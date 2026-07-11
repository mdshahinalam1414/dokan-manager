/**
 * DOKAN MANAGER - Backend (Google Apps Script) - v2
 * ---------------------------------------------------
 * নতুন ফিচার: Staff login/roles, Low stock alert, Customer/Supplier history,
 * Discount+VAT+Split payment on sales, Monthly income/expense chart data.
 *
 * সেটআপ:
 * 1) Google Sheet > Extensions > Apps Script এ এই পুরো কোড পেস্ট করুন।
 * 2) ফাংশন ড্রপডাউন থেকে "setup" Run করুন (শিট/হেডার তৈরি হবে + একটা ডিফল্ট
 *    Owner ইউজার তৈরি হবে: username="owner", password="owner123").
 * 3) Deploy > New deployment > Web app (Execute as: Me, Access: Anyone) করুন।
 * 4) সাইটে লগইন করে সাথে সাথে Users ট্যাব থেকে owner এর পাসওয়ার্ড পাল্টে দিন।
 * 5) কোড পরিবর্তন করলে Deploy > Manage deployments > Edit > New version > Deploy করতে হবে।
 */

// ---------- সেটআপ ----------

function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  createSheetIfMissing(ss, 'Settings', ['Key', 'Value']);
  createSheetIfMissing(ss, 'Users', ['ID', 'Username', 'Password', 'Role', 'Name']);
  createSheetIfMissing(ss, 'Capital', ['ID','Date','Type','Amount','Method','Note']);
  createSheetIfMissing(ss, 'Income_Expense', ['ID','Date','Type','Category','Amount','Method','Note']);
  createSheetIfMissing(ss, 'Shareholders', ['ID','Name','Phone','JoinDate','SharePercent']);
  createSheetIfMissing(ss, 'ShareholderPayments', ['ID','Date','ShareholderName','Month','Amount','Method','Note']);
  createSheetIfMissing(ss, 'Inventory', ['ID','ProductName','Category','PurchasePrice','SalePrice','Stock','LowStockThreshold']);
  createSheetIfMissing(ss, 'StockLog', ['ID','Date','ProductID','ProductName','Type','Qty','Note']);
  createSheetIfMissing(ss, 'Sales', ['ID','InvoiceNo','Date','CustomerName','CustomerPhone','ItemsJSON','Subtotal','Discount','VAT','TotalAmount','PaidCash','PaidBank','DueAmount','Note']);
  createSheetIfMissing(ss, 'ReceivablePayable', ['ID','Date','PartyName','Type','Amount','PaidAmount','DueAmount','Note']);
  createSheetIfMissing(ss, 'Parties', ['ID','Name','Phone','Type','Note']);
  createSheetIfMissing(ss, 'Ledger', ['ID','Date','Module','RefNo','Description','CashDelta','BankDelta']);

  var settings = ss.getSheetByName('Settings');
  if (settings.getLastRow() < 2) {
    settings.appendRow(['ShopName', 'আমার দোকান']);
    settings.appendRow(['Address', '']);
    settings.appendRow(['Phone', '']);
    settings.appendRow(['NextInvoiceNo', '1']);
  }

  var users = ss.getSheetByName('Users');
  if (users.getLastRow() < 2) {
    users.appendRow([1, 'owner', 'owner123', 'Owner', 'Owner']);
  }
  Logger.log('Setup complete! Default login -> username: owner / password: owner123 (পাল্টে ফেলুন সাইটে লগইন করার পর)');
}

function createSheetIfMissing(ss, name, headers) {
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(headers);
    sh.setFrozenRows(1);
  } else {
    // পুরনো শিটে নতুন কলাম যোগ থাকলে (আপগ্রেডের সময়) হেডার মিলিয়ে নেওয়া
    var existing = sh.getRange(1, 1, 1, Math.max(sh.getLastColumn(), 1)).getValues()[0];
    headers.forEach(function (h, i) {
      if (existing[i] !== h) {
        sh.getRange(1, i + 1).setValue(h);
      }
    });
  }
}

// ---------- এন্ট্রি পয়েন্ট ----------

function doGet(e) { return handleRequest(e); }
function doPost(e) { return handleRequest(e); }

var OWNER_ONLY_ACTIONS = [
  'dashboard','list_capital','add_capital','edit_capital','delete_capital',
  'list_income_expense','add_income_expense',
  'list_shareholders','add_shareholder','list_shareholder_payments','add_shareholder_payment',
  'edit_shareholder_payment','delete_shareholder_payment','shareholder_distribution',
  'add_product','stock_purchase','stock_adjust','list_receivable_payable','add_receivable_payable',
  'add_payment_rp','update_settings','report','monthly_summary',
  'list_users','add_user','update_user_password','list_parties','add_party','get_party_history',
  'edit_sale','delete_sale'
];

function handleRequest(e) {
  var out;
  try {
    var params = {};
    if (e.postData && e.postData.contents) {
      params = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      params = e.parameter;
      if (params.payload) { try { params.payload = JSON.parse(params.payload); } catch (err) {} }
    }

    var action = params.action;
    var authedUser = null;

    if (action !== 'ping') {
      authedUser = checkAuth(params.username, params.password);
      if (!authedUser) {
        return jsonResponse({ ok: false, error: 'ভুল ইউজারনেম বা পাসওয়ার্ড (Invalid username/password)' });
      }
    }
    var role = authedUser ? authedUser.Role : null;

    if (OWNER_ONLY_ACTIONS.indexOf(action) !== -1 && role !== 'Owner') {
      return jsonResponse({ ok: false, error: 'এই কাজের অনুমতি নেই (Owner only)' });
    }

    var payload = params.payload || {};
    var result;

    switch (action) {
      case 'ping': result = { ok: true }; break;
      case 'login': result = { ok: true, role: role, name: authedUser.Name, username: authedUser.Username }; break;

      case 'dashboard': result = getDashboard(); break;
      case 'staff_dashboard': result = getStaffDashboardData(); break;

      case 'list_capital': result = listSheet('Capital'); break;
      case 'add_capital': result = addCapital(payload); break;
      case 'edit_capital': result = editCapital(payload); break;
      case 'delete_capital': result = deleteCapital(payload); break;

      case 'list_income_expense': result = listSheet('Income_Expense'); break;
      case 'add_income_expense': result = addIncomeExpense(payload); break;

      case 'list_shareholders': result = listSheet('Shareholders'); break;
      case 'add_shareholder': result = addShareholder(payload); break;
      case 'list_shareholder_payments': result = listSheet('ShareholderPayments'); break;
      case 'add_shareholder_payment': result = addShareholderPayment(payload); break;
      case 'edit_shareholder_payment': result = editShareholderPayment(payload); break;
      case 'delete_shareholder_payment': result = deleteShareholderPayment(payload); break;
      case 'shareholder_distribution': result = getShareholderDistribution(); break;

      case 'list_inventory': result = listSheet('Inventory'); break;
      case 'add_product': result = addProduct(payload); break;
      case 'stock_purchase': result = stockPurchase(payload); break;
      case 'stock_adjust': result = stockAdjust(payload); break;

      case 'list_sales': result = listSheet('Sales'); break;
      case 'add_sale': result = addSale(payload); break;
      case 'get_sale': result = getSale(payload); break;
      case 'edit_sale': result = editSale(payload); break;
      case 'delete_sale': result = deleteSale(payload); break;

      case 'list_receivable_payable': result = listSheet('ReceivablePayable'); break;
      case 'add_receivable_payable': result = addReceivablePayable(payload); break;
      case 'add_payment_rp': result = addPaymentRP(payload); break;

      case 'list_parties': result = listSheet('Parties'); break;
      case 'add_party': result = addParty(payload); break;
      case 'get_party_history': result = getPartyHistory(payload); break;

      case 'get_settings': result = getSettings(); break;
      case 'update_settings': result = updateSettings(payload); break;

      case 'report': result = getReport(payload); break;
      case 'monthly_summary': result = getMonthlySummary(payload); break;

      case 'list_users': result = listUsers(); break;
      case 'add_user': result = addUser(payload); break;
      case 'update_user_password': result = updateUserPassword(payload); break;

      default: result = { ok: false, error: 'Unknown action: ' + action };
    }

    out = (result && result.ok !== undefined) ? result : { ok: true, data: result };
  } catch (err) {
    out = { ok: false, error: String(err) };
  }
  return jsonResponse(out);
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function checkAuth(username, password) {
  if (!username || !password) return null;
  var users = listSheet('Users');
  for (var i = 0; i < users.length; i++) {
    if (String(users[i].Username) === String(username) && String(users[i].Password) === String(password)) {
      return users[i];
    }
  }
  return null;
}

// ---------- হেল্পার ----------

function ss_() { return SpreadsheetApp.getActiveSpreadsheet(); }
function sheet_(name) { return ss_().getSheetByName(name); }
function nextId_(sheetName) { return sheet_(sheetName).getLastRow(); }

function listSheet(name) {
  var sh = sheet_(name);
  var values = sh.getDataRange().getValues();
  var headers = values.shift();
  return values.map(function (row) {
    var obj = {};
    headers.forEach(function (h, i) { obj[h] = row[i]; });
    return obj;
  });
}

function addLedger(module, refNo, description, cashDelta, bankDelta) {
  sheet_('Ledger').appendRow([nextId_('Ledger'), new Date(), module, refNo, description, cashDelta || 0, bankDelta || 0]);
}

function todayStr_() { return new Date(); }

function findRowById_(sheetName, id) {
  var values = sheet_(sheetName).getDataRange().getValues();
  for (var i = 1; i < values.length; i++) { if (String(values[i][0]) === String(id)) return i + 1; }
  return -1;
}
function deleteSheetRowById_(sheetName, id) {
  var sh = sheet_(sheetName);
  var values = sh.getDataRange().getValues();
  for (var i = values.length - 1; i >= 1; i--) {
    if (String(values[i][0]) === String(id)) { sh.deleteRow(i + 1); return true; }
  }
  return false;
}
function deleteLedgerByRef_(module, refNo) {
  var sh = sheet_('Ledger');
  var values = sh.getDataRange().getValues();
  for (var i = values.length - 1; i >= 1; i--) {
    if (values[i][2] === module && String(values[i][3]) === String(refNo)) sh.deleteRow(i + 1);
  }
}
function deleteIncomeExpenseByNote_(note) {
  var sh = sheet_('Income_Expense');
  var values = sh.getDataRange().getValues();
  for (var i = values.length - 1; i >= 1; i--) { if (values[i][6] === note) sh.deleteRow(i + 1); }
}
function deleteReceivablePayableByNote_(note) {
  var sh = sheet_('ReceivablePayable');
  var values = sh.getDataRange().getValues();
  for (var i = values.length - 1; i >= 1; i--) { if (values[i][7] === note) sh.deleteRow(i + 1); }
}

function upsertParty_(name, phone, type) {
  if (!name) return;
  var sh = sheet_('Parties');
  var values = sh.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (values[i][1] === name) return; // already exists
  }
  sh.appendRow([nextId_('Parties'), name, phone || '', type, '']);
}

// ---------- Capital ----------

function addCapital(p) {
  var sh = sheet_('Capital');
  var id = nextId_('Capital');
  sh.appendRow([id, todayStr_(), p.type, p.amount, p.method, p.note || '']);
  var cash = p.method === 'Cash' ? Number(p.amount) : 0;
  var bank = p.method === 'Bank' ? Number(p.amount) : 0;
  if (p.type === 'Withdrawal') { cash = -cash; bank = -bank; }
  addLedger('Capital', id, p.type + ' - ' + (p.note || ''), cash, bank);
  return { ok: true, id: id };
}

function editCapital(p) {
  var row = findRowById_('Capital', p.id);
  if (row < 0) return { ok: false, error: 'পাওয়া যায়নি (Not found)' };
  var sh = sheet_('Capital');
  sh.getRange(row, 3).setValue(p.type);
  sh.getRange(row, 4).setValue(p.amount);
  sh.getRange(row, 5).setValue(p.method);
  sh.getRange(row, 6).setValue(p.note || '');
  deleteLedgerByRef_('Capital', p.id);
  var cash = p.method === 'Cash' ? Number(p.amount) : 0;
  var bank = p.method === 'Bank' ? Number(p.amount) : 0;
  if (p.type === 'Withdrawal') { cash = -cash; bank = -bank; }
  addLedger('Capital', p.id, p.type + ' - ' + (p.note || '') + ' (edited)', cash, bank);
  return { ok: true };
}

function deleteCapital(p) {
  deleteLedgerByRef_('Capital', p.id);
  deleteSheetRowById_('Capital', p.id);
  return { ok: true };
}

// ---------- Income / Expense ----------

function addIncomeExpense(p) {
  var sh = sheet_('Income_Expense');
  var id = nextId_('Income_Expense');
  sh.appendRow([id, todayStr_(), p.type, p.category, p.amount, p.method, p.note || '']);
  var cash = p.method === 'Cash' ? Number(p.amount) : 0;
  var bank = p.method === 'Bank' ? Number(p.amount) : 0;
  if (p.type === 'Expense') { cash = -cash; bank = -bank; }
  addLedger('Income_Expense', id, p.category + ' - ' + (p.note || ''), cash, bank);
  return { ok: true, id: id };
}

// ---------- Shareholders ----------

function addShareholder(p) {
  var sh = sheet_('Shareholders');
  var id = nextId_('Shareholders');
  sh.appendRow([id, p.name, p.phone || '', todayStr_(), p.sharePercent || '']);
  return { ok: true, id: id };
}

function addShareholderPayment(p) {
  var sh = sheet_('ShareholderPayments');
  var id = nextId_('ShareholderPayments');
  sh.appendRow([id, todayStr_(), p.shareholderName, p.month, p.amount, p.method, p.note || '']);
  var cash = p.method === 'Cash' ? -Number(p.amount) : 0;
  var bank = p.method === 'Bank' ? -Number(p.amount) : 0;
  addLedger('ShareholderPayment', id, p.shareholderName + ' (' + p.month + ')', cash, bank);
  return { ok: true, id: id };
}

function editShareholderPayment(p) {
  var row = findRowById_('ShareholderPayments', p.id);
  if (row < 0) return { ok: false, error: 'পাওয়া যায়নি (Not found)' };
  var sh = sheet_('ShareholderPayments');
  sh.getRange(row, 3).setValue(p.shareholderName);
  sh.getRange(row, 4).setValue(p.month);
  sh.getRange(row, 5).setValue(p.amount);
  sh.getRange(row, 6).setValue(p.method);
  sh.getRange(row, 7).setValue(p.note || '');
  deleteLedgerByRef_('ShareholderPayment', p.id);
  var cash = p.method === 'Cash' ? -Number(p.amount) : 0;
  var bank = p.method === 'Bank' ? -Number(p.amount) : 0;
  addLedger('ShareholderPayment', p.id, p.shareholderName + ' (' + p.month + ') (edited)', cash, bank);
  return { ok: true };
}

function deleteShareholderPayment(p) {
  deleteLedgerByRef_('ShareholderPayment', p.id);
  deleteSheetRowById_('ShareholderPayments', p.id);
  return { ok: true };
}

function getShareholderDistribution() {
  var ie = listSheet('Income_Expense');
  var totalIncome = 0, totalExpense = 0;
  ie.forEach(function (r) {
    if (r.Type === 'Income') totalIncome += Number(r.Amount); else totalExpense += Number(r.Amount);
  });
  var netProfit = totalIncome - totalExpense;

  var holders = listSheet('Shareholders');
  var payments = listSheet('ShareholderPayments');

  var distribution = holders.map(function (h) {
    var percent = Number(h.SharePercent || 0);
    var entitled = netProfit * (percent / 100);
    var paid = payments.filter(function (pmt) { return pmt.ShareholderName === h.Name; })
      .reduce(function (sum, pmt) { return sum + Number(pmt.Amount); }, 0);
    return {
      name: h.Name, sharePercent: percent,
      entitled: entitled, paid: paid, balanceDue: entitled - paid
    };
  });

  return { netProfit: netProfit, distribution: distribution };
}

// ---------- Inventory ----------

function addProduct(p) {
  var sh = sheet_('Inventory');
  var id = nextId_('Inventory');
  sh.appendRow([id, p.name, p.category || '', p.purchasePrice, p.salePrice, 0, p.lowStockThreshold || 5]);
  return { ok: true, id: id };
}

function findProductRow_(productId) {
  var values = sheet_('Inventory').getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(productId)) return i + 1;
  }
  return -1;
}

function getLowStockProducts() {
  return listSheet('Inventory').filter(function (r) {
    return Number(r.Stock) <= Number(r.LowStockThreshold || 0);
  }).map(function (r) {
    return { ProductName: r.ProductName, Stock: r.Stock, LowStockThreshold: r.LowStockThreshold };
  });
}

function stockPurchase(p) {
  var row = findProductRow_(p.productId);
  if (row < 0) return { ok: false, error: 'Product not found' };
  var sh = sheet_('Inventory');
  var currentStock = Number(sh.getRange(row, 6).getValue());
  sh.getRange(row, 6).setValue(currentStock + Number(p.qty));
  if (p.unitCost) sh.getRange(row, 4).setValue(p.unitCost);
  var productName = sh.getRange(row, 2).getValue();

  var logId = nextId_('StockLog');
  sheet_('StockLog').appendRow([logId, todayStr_(), p.productId, productName, 'Purchase', p.qty, p.note || '']);

  var total = Number(p.unitCost || sh.getRange(row, 4).getValue()) * Number(p.qty);
  var paid = Number(p.paidAmount || 0);
  var cash = p.method === 'Cash' ? -paid : 0;
  var bank = p.method === 'Bank' ? -paid : 0;
  addLedger('StockPurchase', logId, 'Purchase: ' + productName, cash, bank);

  var due = total - paid;
  if (due > 0.001) {
    var rpId = nextId_('ReceivablePayable');
    sheet_('ReceivablePayable').appendRow([rpId, todayStr_(), p.supplierName || 'Supplier', 'Payable', total, paid, due, 'Stock purchase: ' + productName]);
  }
  if (p.supplierName) upsertParty_(p.supplierName, '', 'Supplier');
  return { ok: true };
}

function stockAdjust(p) {
  var row = findProductRow_(p.productId);
  if (row < 0) return { ok: false, error: 'Product not found' };
  var sh = sheet_('Inventory');
  var currentStock = Number(sh.getRange(row, 6).getValue());
  sh.getRange(row, 6).setValue(currentStock + Number(p.qty));
  var productName = sh.getRange(row, 2).getValue();
  sheet_('StockLog').appendRow([nextId_('StockLog'), todayStr_(), p.productId, productName, 'Adjust', p.qty, p.note || '']);
  return { ok: true };
}

// ---------- Sales / Voucher (discount + VAT + split payment) ----------

function addSale(p) {
  var items = p.items || [];
  var subtotal = 0;
  items.forEach(function (it) { subtotal += Number(it.qty) * Number(it.unitPrice); });

  var discount = Number(p.discount || 0);
  var vat = Number(p.vat || 0);
  var total = subtotal - discount + vat;

  items.forEach(function (it) {
    var row = findProductRow_(it.productId);
    if (row > 0) {
      var sh = sheet_('Inventory');
      var currentStock = Number(sh.getRange(row, 6).getValue());
      sh.getRange(row, 6).setValue(currentStock - Number(it.qty));
      sheet_('StockLog').appendRow([nextId_('StockLog'), todayStr_(), it.productId, it.productName, 'Sale', -Number(it.qty), 'Invoice']);
    }
  });

  var nextInv = getSettingValue_('NextInvoiceNo') || 1;
  var invoiceNo = 'INV-' + String(nextInv).padStart(5, '0');
  setSettingValue_('NextInvoiceNo', Number(nextInv) + 1);

  var paidCash = Number(p.paidCash || 0);
  var paidBank = Number(p.paidBank || 0);
  var paid = paidCash + paidBank;
  var due = total - paid;

  var id = nextId_('Sales');
  sheet_('Sales').appendRow([id, invoiceNo, todayStr_(), p.customerName || '', p.customerPhone || '',
    JSON.stringify(items), subtotal, discount, vat, total, paidCash, paidBank, due, p.note || '']);

  var ieId = nextId_('Income_Expense');
  var method = paidCash > 0 && paidBank > 0 ? 'Mixed' : (paidBank > 0 ? 'Bank' : 'Cash');
  sheet_('Income_Expense').appendRow([ieId, todayStr_(), 'Income', 'Sales', total, method, 'Invoice ' + invoiceNo]);

  addLedger('Sale', invoiceNo, 'Sale to ' + (p.customerName || 'Customer'), paidCash, paidBank);

  if (due > 0.001) {
    var rpId = nextId_('ReceivablePayable');
    sheet_('ReceivablePayable').appendRow([rpId, todayStr_(), p.customerName || 'Customer', 'Receivable', total, paid, due, 'Invoice ' + invoiceNo]);
  }
  if (p.customerName) upsertParty_(p.customerName, p.customerPhone, 'Customer');

  return { ok: true, id: id, invoiceNo: invoiceNo, total: total, due: due };
}

function getSale(p) {
  var found = listSheet('Sales').filter(function (r) { return String(r.InvoiceNo) === String(p.invoiceNo); });
  if (!found.length) return { ok: false, error: 'Invoice not found' };
  var sale = found[0];
  try { sale.Items = JSON.parse(sale.ItemsJSON); } catch (e) { sale.Items = []; }
  return { ok: true, data: sale };
}

function deleteSale(p) {
  var row = findRowById_('Sales', p.id);
  if (row < 0) return { ok: false, error: 'পাওয়া যায়নি (Not found)' };
  var sh = sheet_('Sales');
  var invoiceNo = sh.getRange(row, 2).getValue();
  var itemsJSON = sh.getRange(row, 6).getValue();
  var items = []; try { items = JSON.parse(itemsJSON); } catch (e) {}

  items.forEach(function (it) {
    var r2 = findProductRow_(it.productId);
    if (r2 > 0) {
      var invSh = sheet_('Inventory');
      var cur = Number(invSh.getRange(r2, 6).getValue());
      invSh.getRange(r2, 6).setValue(cur + Number(it.qty));
      sheet_('StockLog').appendRow([nextId_('StockLog'), todayStr_(), it.productId, it.productName, 'Sale-Deleted', it.qty, 'Deleted invoice ' + invoiceNo]);
    }
  });

  deleteIncomeExpenseByNote_('Invoice ' + invoiceNo);
  deleteLedgerByRef_('Sale', invoiceNo);
  deleteReceivablePayableByNote_('Invoice ' + invoiceNo);
  sh.deleteRow(row);
  return { ok: true };
}

function editSale(p) {
  var row = findRowById_('Sales', p.id);
  if (row < 0) return { ok: false, error: 'পাওয়া যায়নি (Not found)' };
  var sh = sheet_('Sales');
  var invoiceNo = sh.getRange(row, 2).getValue();
  var oldItemsJSON = sh.getRange(row, 6).getValue();
  var oldItems = []; try { oldItems = JSON.parse(oldItemsJSON); } catch (e) {}

  // পুরনো প্রভাব রিভার্স (স্টক ফেরত, ইনকাম/লেজার/দেনাদার এন্ট্রি মুছে ফেলা)
  oldItems.forEach(function (it) {
    var r2 = findProductRow_(it.productId);
    if (r2 > 0) {
      var invSh = sheet_('Inventory');
      var cur = Number(invSh.getRange(r2, 6).getValue());
      invSh.getRange(r2, 6).setValue(cur + Number(it.qty));
    }
  });
  deleteIncomeExpenseByNote_('Invoice ' + invoiceNo);
  deleteLedgerByRef_('Sale', invoiceNo);
  deleteReceivablePayableByNote_('Invoice ' + invoiceNo);

  // নতুন হিসাব প্রয়োগ (একই ইনভয়েস নম্বর ব্যবহার হবে)
  var items = p.items || [];
  var subtotal = 0;
  items.forEach(function (it) { subtotal += Number(it.qty) * Number(it.unitPrice); });
  var discount = Number(p.discount || 0);
  var vat = Number(p.vat || 0);
  var total = subtotal - discount + vat;

  items.forEach(function (it) {
    var r2 = findProductRow_(it.productId);
    if (r2 > 0) {
      var invSh = sheet_('Inventory');
      var cur = Number(invSh.getRange(r2, 6).getValue());
      invSh.getRange(r2, 6).setValue(cur - Number(it.qty));
      sheet_('StockLog').appendRow([nextId_('StockLog'), todayStr_(), it.productId, it.productName, 'Sale-Edited', -Number(it.qty), 'Edited invoice ' + invoiceNo]);
    }
  });

  var paidCash = Number(p.paidCash || 0);
  var paidBank = Number(p.paidBank || 0);
  var paid = paidCash + paidBank;
  var due = total - paid;

  sh.getRange(row, 4).setValue(p.customerName || '');
  sh.getRange(row, 5).setValue(p.customerPhone || '');
  sh.getRange(row, 6).setValue(JSON.stringify(items));
  sh.getRange(row, 7).setValue(subtotal);
  sh.getRange(row, 8).setValue(discount);
  sh.getRange(row, 9).setValue(vat);
  sh.getRange(row, 10).setValue(total);
  sh.getRange(row, 11).setValue(paidCash);
  sh.getRange(row, 12).setValue(paidBank);
  sh.getRange(row, 13).setValue(due);
  sh.getRange(row, 14).setValue(p.note || '');

  var ieId = nextId_('Income_Expense');
  var method = paidCash > 0 && paidBank > 0 ? 'Mixed' : (paidBank > 0 ? 'Bank' : 'Cash');
  sheet_('Income_Expense').appendRow([ieId, todayStr_(), 'Income', 'Sales', total, method, 'Invoice ' + invoiceNo]);
  addLedger('Sale', invoiceNo, 'Sale to ' + (p.customerName || 'Customer') + ' (edited)', paidCash, paidBank);

  if (due > 0.001) {
    var rpId = nextId_('ReceivablePayable');
    sheet_('ReceivablePayable').appendRow([rpId, todayStr_(), p.customerName || 'Customer', 'Receivable', total, paid, due, 'Invoice ' + invoiceNo]);
  }
  return { ok: true, invoiceNo: invoiceNo };
}

// ---------- Receivable / Payable ----------

function addReceivablePayable(p) {
  var id = nextId_('ReceivablePayable');
  var amount = Number(p.amount);
  sheet_('ReceivablePayable').appendRow([id, todayStr_(), p.partyName, p.type, amount, 0, amount, p.note || '']);
  if (p.partyName) upsertParty_(p.partyName, '', p.type === 'Receivable' ? 'Customer' : 'Supplier');
  return { ok: true, id: id };
}

function addPaymentRP(p) {
  var sh = sheet_('ReceivablePayable');
  var values = sh.getDataRange().getValues();
  var rowIdx = -1;
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(p.id)) { rowIdx = i + 1; break; }
  }
  if (rowIdx < 0) return { ok: false, error: 'Record not found' };

  var type = sh.getRange(rowIdx, 4).getValue();
  var paidSoFar = Number(sh.getRange(rowIdx, 6).getValue());
  var due = Number(sh.getRange(rowIdx, 7).getValue());
  var partyName = sh.getRange(rowIdx, 3).getValue();
  var amt = Number(p.amount);

  sh.getRange(rowIdx, 6).setValue(paidSoFar + amt);
  sh.getRange(rowIdx, 7).setValue(due - amt);

  var cash = 0, bank = 0;
  if (type === 'Receivable') { if (p.method === 'Cash') cash = amt; else bank = amt; }
  else { if (p.method === 'Cash') cash = -amt; else bank = -amt; }
  addLedger('RP_Payment', p.id, (type === 'Receivable' ? 'Collected from ' : 'Paid to ') + partyName, cash, bank);

  return { ok: true, newDue: due - amt };
}

// ---------- Parties (Customer/Supplier directory + history) ----------

function addParty(p) {
  var id = nextId_('Parties');
  sheet_('Parties').appendRow([id, p.name, p.phone || '', p.type, p.note || '']);
  return { ok: true, id: id };
}

function getPartyHistory(p) {
  var name = p.name;
  var sales = listSheet('Sales').filter(function (r) { return r.CustomerName === name; });
  var rp = listSheet('ReceivablePayable').filter(function (r) { return r.PartyName === name; });

  var totalSales = 0, totalPaidOnSales = 0;
  sales.forEach(function (s) {
    totalSales += Number(s.TotalAmount);
    totalPaidOnSales += Number(s.PaidCash || 0) + Number(s.PaidBank || 0);
  });
  var totalDue = 0;
  rp.forEach(function (r) { totalDue += Number(r.DueAmount); });

  return { name: name, sales: sales, receivablePayable: rp, totalSales: totalSales, totalPaidOnSales: totalPaidOnSales, totalDue: totalDue };
}

// ---------- Settings ----------

function getSettingValue_(key) {
  var values = sheet_('Settings').getDataRange().getValues();
  for (var i = 1; i < values.length; i++) if (values[i][0] === key) return values[i][1];
  return null;
}
function setSettingValue_(key, value) {
  var sh = sheet_('Settings');
  var values = sh.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (values[i][0] === key) { sh.getRange(i + 1, 2).setValue(value); return; }
  }
  sh.appendRow([key, value]);
}
function getSettings() {
  return { ok: true, data: { ShopName: getSettingValue_('ShopName') || '', Address: getSettingValue_('Address') || '', Phone: getSettingValue_('Phone') || '' } };
}
function updateSettings(p) {
  if (p.ShopName !== undefined) setSettingValue_('ShopName', p.ShopName);
  if (p.Address !== undefined) setSettingValue_('Address', p.Address);
  if (p.Phone !== undefined) setSettingValue_('Phone', p.Phone);
  return { ok: true };
}

// ---------- Users (staff logins) ----------

function listUsers() {
  return listSheet('Users').map(function (u) { return { ID: u.ID, Username: u.Username, Role: u.Role, Name: u.Name }; });
}
function addUser(p) {
  var users = listSheet('Users');
  for (var i = 0; i < users.length; i++) {
    if (users[i].Username === p.username) return { ok: false, error: 'এই ইউজারনেম আগে থেকেই আছে' };
  }
  var id = nextId_('Users');
  sheet_('Users').appendRow([id, p.username, p.password, p.role, p.name || '']);
  return { ok: true, id: id };
}
function updateUserPassword(p) {
  var sh = sheet_('Users');
  var values = sh.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (values[i][1] === p.username) { sh.getRange(i + 1, 3).setValue(p.newPassword); return { ok: true }; }
  }
  return { ok: false, error: 'User not found' };
}

// ---------- Dashboard ----------

function getDashboard() {
  var capital = listSheet('Capital');
  var ie = listSheet('Income_Expense');
  var ledger = listSheet('Ledger');
  var rp = listSheet('ReceivablePayable');
  var inventory = listSheet('Inventory');
  var shPayments = listSheet('ShareholderPayments');

  var totalCapital = 0, totalWithdrawal = 0;
  capital.forEach(function (r) {
    if (r.Type === 'Withdrawal') totalWithdrawal += Number(r.Amount); else totalCapital += Number(r.Amount);
  });

  var totalIncome = 0, totalExpense = 0;
  ie.forEach(function (r) {
    if (r.Type === 'Income') totalIncome += Number(r.Amount); else totalExpense += Number(r.Amount);
  });

  var cash = 0, bank = 0;
  ledger.forEach(function (r) { cash += Number(r.CashDelta || 0); bank += Number(r.BankDelta || 0); });

  var totalReceivable = 0, totalPayable = 0;
  rp.forEach(function (r) {
    if (r.Type === 'Receivable') totalReceivable += Number(r.DueAmount); else totalPayable += Number(r.DueAmount);
  });

  var inventoryValue = 0, inventoryUnits = 0;
  inventory.forEach(function (r) { inventoryValue += Number(r.Stock) * Number(r.PurchasePrice); inventoryUnits += Number(r.Stock); });

  var totalShareholderPaid = 0;
  shPayments.forEach(function (r) { totalShareholderPaid += Number(r.Amount); });

  return {
    totalCapital: totalCapital, totalWithdrawal: totalWithdrawal,
    totalIncome: totalIncome, totalExpense: totalExpense, netProfit: totalIncome - totalExpense,
    cashInHand: cash, bankBalance: bank,
    totalReceivable: totalReceivable, totalPayable: totalPayable,
    inventoryValue: inventoryValue, inventoryUnits: inventoryUnits,
    totalShareholderPaid: totalShareholderPaid,
    lowStockProducts: getLowStockProducts()
  };
}

function getStaffDashboardData() {
  var sales = listSheet('Sales');
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var todaySales = sales.filter(function (s) {
    var d = new Date(s.Date); d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  });
  var todayTotal = 0;
  todaySales.forEach(function (s) { todayTotal += Number(s.TotalAmount); });
  return { todaySalesCount: todaySales.length, todaySalesTotal: todayTotal, lowStockProducts: getLowStockProducts() };
}

// ---------- Profit & Loss Report ----------

function getReport(p) {
  var fromDate = p.fromDate ? new Date(p.fromDate) : null;
  var toDate = p.toDate ? new Date(p.toDate) : null;
  if (toDate) toDate.setHours(23, 59, 59, 999);

  var filtered = listSheet('Income_Expense').filter(function (r) {
    var d = new Date(r.Date);
    if (fromDate && d < fromDate) return false;
    if (toDate && d > toDate) return false;
    return true;
  });

  var totalIncome = 0, totalExpense = 0;
  var incomeByCategory = {}, expenseByCategory = {};
  filtered.forEach(function (r) {
    var amt = Number(r.Amount);
    if (r.Type === 'Income') { totalIncome += amt; incomeByCategory[r.Category] = (incomeByCategory[r.Category] || 0) + amt; }
    else { totalExpense += amt; expenseByCategory[r.Category] = (expenseByCategory[r.Category] || 0) + amt; }
  });
  filtered.sort(function (a, b) { return new Date(a.Date) - new Date(b.Date); });

  return {
    fromDate: p.fromDate || '', toDate: p.toDate || '',
    totalIncome: totalIncome, totalExpense: totalExpense, netProfit: totalIncome - totalExpense,
    incomeByCategory: incomeByCategory, expenseByCategory: expenseByCategory, transactions: filtered
  };
}

function getMonthlySummary() {
  var ie = listSheet('Income_Expense');
  var map = {};
  ie.forEach(function (r) {
    var d = new Date(r.Date);
    var key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
    if (!map[key]) map[key] = { month: key, income: 0, expense: 0 };
    if (r.Type === 'Income') map[key].income += Number(r.Amount); else map[key].expense += Number(r.Amount);
  });
  var arr = Object.keys(map).map(function (k) { return map[k]; });
  arr.sort(function (a, b) { return a.month.localeCompare(b.month); });
  arr.forEach(function (m) { m.profit = m.income - m.expense; });
  return arr.slice(-12);
}
