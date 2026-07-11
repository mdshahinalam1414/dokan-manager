/* ============ CONFIG / STATE ============ */
let currentLang = localStorage.getItem('dm_lang') || 'bn';
let currentUsername = sessionStorage.getItem('dm_user') || '';
let currentPassword = sessionStorage.getItem('dm_pass') || '';
let currentRole = sessionStorage.getItem('dm_role') || '';
let currentName = sessionStorage.getItem('dm_name') || '';
let productsCache = [];
let saleItems = [];
let editingCapitalId = null;
let editingShPaymentId = null;
let editingSaleId = null;

/* ============ I18N ============ */
const I18N = {
  bn: {
    appName: "Shopr", login: "লগইন", loginSub: "চালিয়ে যেতে ইউজারনেম ও পাসওয়ার্ড দিন",
    username: "ইউজারনেম", password: "পাসওয়ার্ড", logout: "লগআউট",
    nav_dashboard: "ড্যাশবোর্ড", nav_capital: "মূলধন", nav_income_expense: "ইনকাম/এক্সপেন্স",
    nav_shareholders: "শেয়ারহোল্ডার", nav_inventory: "ইনভেন্টরি", nav_sales: "বিক্রয় / ভাউচার",
    nav_rp: "দেনাদার-পাওনাদার", nav_settings: "সেটিংস", nav_reports: "রিপোর্ট",
    nav_parties: "কাস্টমার/সাপ্লায়ার", nav_users: "স্টাফ/ইউজার",
    fromDate: "শুরুর তারিখ", toDate: "শেষ তারিখ", generate: "রিপোর্ট দেখুন",
    incomeByCategory: "খাত অনুযায়ী ইনকাম", expenseByCategory: "খাত অনুযায়ী এক্সপেন্স",
    transactionList: "বিস্তারিত লেনদেন", allTime: "সর্বমোট (সব সময়ের)", monthlyTrend: "মাসিক ট্রেন্ড (ইনকাম/এক্সপেন্স/লাভ)",
    cash: "ক্যাশ ইন হ্যান্ড", bank: "ব্যাংক ব্যালেন্স", totalCapital: "মোট মূলধন",
    totalWithdrawal: "মোট উত্তোলন", totalIncome: "মোট ইনকাম", totalExpense: "মোট এক্সপেন্স",
    netProfit: "নিট লাভ", receivable: "মোট পাওনা (দেনাদার)", payable: "মোট দেনা (পাওনাদার)",
    inventoryValue: "ইনভেন্টরি মূল্য", shareholderPaid: "শেয়ারহোল্ডারকে মোট প্রদান",
    lowStockAlert: "⚠ স্টক কম আছে এমন প্রোডাক্ট", todaySales: "আজকের বিক্রয়", todaySalesCount: "আজকে মোট বিক্রয় সংখ্যা",
    date: "তারিখ", type: "ধরণ", amount: "পরিমাণ", method: "পদ্ধতি", note: "নোট", action: "একশন",
    add: "যোগ করুন", cash_opt: "ক্যাশ", bank_opt: "ব্যাংক",
    capital_initial: "প্রাথমিক মূলধন", capital_new: "নতুন মূলধন", capital_withdrawal: "উত্তোলন",
    category: "ক্যাটাগরি", income_opt: "ইনকাম", expense_opt: "এক্সপেন্স",
    name: "নাম", phone: "ফোন", sharePercent: "শেয়ার %", month: "মাস",
    productName: "প্রোডাক্টের নাম", purchasePrice: "ক্রয়মূল্য", salePrice: "বিক্রয়মূল্য", stock: "স্টক",
    lowStockThreshold: "লো-স্টক থ্রেশহোল্ড", addProduct: "নতুন প্রোডাক্ট", stockPurchase: "স্টক ক্রয়",
    qty: "পরিমাণ", supplierName: "সাপ্লায়ারের নাম",
    paidAmount: "পরিশোধিত পরিমাণ", customerName: "কাস্টমারের নাম", customerPhone: "কাস্টমারের ফোন",
    invoiceNo: "ভাউচার নং", total: "মোট", subtotal: "সাব-টোটাল", discount: "ডিসকাউন্ট", vat: "ভ্যাট/ট্যাক্স %",
    paidCash: "ক্যাশে পরিশোধ", paidBank: "ব্যাংকে পরিশোধ",
    due: "বাকি", product: "প্রোডাক্ট", addItem: "আইটেম যোগ",
    createSale: "বিক্রয় সম্পন্ন করুন", printVoucher: "ভাউচার প্রিন্ট", searchInvoice: "ভাউচার নং দিয়ে খুঁজুন",
    partyName: "পার্টির নাম", receivable_opt: "পাওনা (দেনাদার)", payable_opt: "দেনা (পাওনাদার)",
    paySettle: "পেমেন্ট/পরিশোধ", shopName: "দোকানের নাম", address: "ঠিকানা", save: "সেভ করুন",
    close: "বন্ধ", print: "প্রিন্ট", loading: "লোড হচ্ছে...", noData: "কোনো তথ্য নেই",
    thankYou: "কেনাকাটার জন্য ধন্যবাদ!", loginFail: "ভুল ইউজারনেম বা পাসওয়ার্ড",
    settle: "নিষ্পত্তি করুন", remaining: "অবশিষ্ট বাকি",
    partyDirectory: "কাস্টমার/সাপ্লায়ার তালিকা", partyType: "ধরণ", customer_opt: "কাস্টমার", supplier_opt: "সাপ্লায়ার",
    viewHistory: "ইতিহাস দেখুন", totalSales: "মোট বিক্রয়", totalDue: "মোট বাকি", history: "লেনদেনের ইতিহাস",
    addUser: "নতুন ইউজার যোগ", role: "রোল", owner_opt: "মালিক (Owner)", staff_opt: "স্টাফ (Staff)",
    fullName: "পূর্ণ নাম", welcomeBack: "স্বাগতম",
    search: "খুঁজুন...", exportCsv: "CSV এক্সপোর্ট", backupAll: "সম্পূর্ণ ডেটা ব্যাকআপ (CSV)", backupDone: "ব্যাকআপ সম্পন্ন হয়েছে ✓",
    edit: "এডিট", delete: "ডিলিট", update: "আপডেট করুন", cancelEdit: "বাতিল", confirmDelete: "আপনি কি নিশ্চিত মুছে ফেলতে চান?",
    distribution: "লভ্যাংশ বণ্টন (% অনুযায়ী)", netProfitLabel: "মোট নিট লাভ", entitled: "প্রাপ্য (% অনুযায়ী)",
    balanceDue: "বাকি/অতিরিক্ত", owedToThem: "তাকে দেওয়া বাকি", advanceTaken: "অতিরিক্ত নেওয়া হয়েছে"
  },
  en: {
    appName: "Shopr", login: "Login", loginSub: "Enter username & password to continue",
    username: "Username", password: "Password", logout: "Logout",
    nav_dashboard: "Dashboard", nav_capital: "Capital", nav_income_expense: "Income/Expense",
    nav_shareholders: "Shareholders", nav_inventory: "Inventory", nav_sales: "Sales / Voucher",
    nav_rp: "Receivable-Payable", nav_settings: "Settings", nav_reports: "Reports",
    nav_parties: "Customers/Suppliers", nav_users: "Staff/Users",
    fromDate: "From Date", toDate: "To Date", generate: "Generate Report",
    incomeByCategory: "Income by Category", expenseByCategory: "Expense by Category",
    transactionList: "Transaction Details", allTime: "All Time", monthlyTrend: "Monthly Trend (Income/Expense/Profit)",
    cash: "Cash In Hand", bank: "Bank Balance", totalCapital: "Total Capital",
    totalWithdrawal: "Total Withdrawal", totalIncome: "Total Income", totalExpense: "Total Expense",
    netProfit: "Net Profit", receivable: "Total Receivable", payable: "Total Payable",
    inventoryValue: "Inventory Value", shareholderPaid: "Total Paid to Shareholders",
    lowStockAlert: "⚠ Low Stock Products", todaySales: "Today's Sales", todaySalesCount: "Today's Sale Count",
    date: "Date", type: "Type", amount: "Amount", method: "Method", note: "Note", action: "Action",
    add: "Add", cash_opt: "Cash", bank_opt: "Bank",
    capital_initial: "Initial Capital", capital_new: "New Capital", capital_withdrawal: "Withdrawal",
    category: "Category", income_opt: "Income", expense_opt: "Expense",
    name: "Name", phone: "Phone", sharePercent: "Share %", month: "Month",
    productName: "Product Name", purchasePrice: "Purchase Price", salePrice: "Sale Price", stock: "Stock",
    lowStockThreshold: "Low Stock Threshold", addProduct: "Add Product", stockPurchase: "Stock Purchase",
    qty: "Qty", supplierName: "Supplier Name",
    paidAmount: "Paid Amount", customerName: "Customer Name", customerPhone: "Customer Phone",
    invoiceNo: "Invoice No", total: "Total", subtotal: "Subtotal", discount: "Discount", vat: "VAT/Tax %",
    paidCash: "Paid (Cash)", paidBank: "Paid (Bank)",
    due: "Due", product: "Product", addItem: "Add Item",
    createSale: "Complete Sale", printVoucher: "Print Voucher", searchInvoice: "Search by Invoice No",
    partyName: "Party Name", receivable_opt: "Receivable", payable_opt: "Payable",
    paySettle: "Payment/Settle", shopName: "Shop Name", address: "Address", save: "Save",
    close: "Close", print: "Print", loading: "Loading...", noData: "No data",
    thankYou: "Thank you for shopping with us!", loginFail: "Wrong username or password",
    settle: "Settle", remaining: "Remaining Due",
    partyDirectory: "Customer/Supplier Directory", partyType: "Type", customer_opt: "Customer", supplier_opt: "Supplier",
    viewHistory: "View History", totalSales: "Total Sales", totalDue: "Total Due", history: "Transaction History",
    addUser: "Add New User", role: "Role", owner_opt: "Owner", staff_opt: "Staff",
    fullName: "Full Name", welcomeBack: "Welcome back",
    search: "Search...", exportCsv: "Export CSV", backupAll: "Full Data Backup (CSV)", backupDone: "Backup complete ✓",
    edit: "Edit", delete: "Delete", update: "Update", cancelEdit: "Cancel", confirmDelete: "Are you sure you want to delete this?",
    distribution: "Profit Distribution (by %)", netProfitLabel: "Total Net Profit", entitled: "Entitled (by %)",
    balanceDue: "Balance Due/Advance", owedToThem: "Owed to them", advanceTaken: "Advance taken"
  }
};
function t(key) { return (I18N[currentLang] && I18N[currentLang][key]) || key; }

function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.getAttribute('data-i18n')); });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph'))); });
  document.getElementById('langToggle').textContent = currentLang === 'bn' ? 'EN' : 'বাং';
}

/* ============ API ============ */
async function api(action, payload) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, username: currentUsername, password: currentPassword, payload: payload || {} })
  });
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || 'Unknown error');
  return json.data !== undefined ? json.data : json;
}

/* ============ LOGIN ============ */
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const uname = document.getElementById('usernameInput').value;
  const pass = document.getElementById('passwordInput').value;
  currentUsername = uname; currentPassword = pass;
  const errBox = document.getElementById('loginError');
  errBox.textContent = '';
  try {
    const res = await api('login', {});
    currentRole = res.role; currentName = res.name;
    sessionStorage.setItem('dm_user', uname);
    sessionStorage.setItem('dm_pass', pass);
    sessionStorage.setItem('dm_role', currentRole);
    sessionStorage.setItem('dm_name', currentName || '');
    showApp();
  } catch (err) {
    errBox.textContent = t('loginFail');
  }
});

function logout() {
  sessionStorage.clear();
  currentUsername = ''; currentPassword = ''; currentRole = ''; currentName = '';
  document.getElementById('app').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
}

function showApp() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  document.getElementById('welcomeName').textContent = (currentName || currentUsername);
  applyRoleVisibility();
  if (currentRole === 'Owner') switchTab('dashboard'); else switchTab('sales');
}

function applyRoleVisibility() {
  const ownerOnlyTabs = ['nav-capital', 'nav-income_expense', 'nav-shareholders', 'nav-rp', 'nav-reports', 'nav-parties', 'nav-users', 'nav-settings'];
  ownerOnlyTabs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = currentRole === 'Owner' ? '' : 'none';
  });
  document.getElementById('addProductBlock').style.display = currentRole === 'Owner' ? '' : 'none';
  document.getElementById('stockPurchaseBlock').style.display = currentRole === 'Owner' ? '' : 'none';
}

/* ============ NAV ============ */
function switchTab(tabName) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar button').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + tabName).classList.add('active');
  document.getElementById('nav-' + tabName).classList.add('active');

  if (tabName === 'dashboard') loadDashboard();
  if (tabName === 'capital') loadCapital();
  if (tabName === 'income_expense') loadIncomeExpense();
  if (tabName === 'shareholders') loadShareholders();
  if (tabName === 'inventory') loadInventory();
  if (tabName === 'sales') loadSales();
  if (tabName === 'rp') loadRP();
  if (tabName === 'reports') loadReports();
  if (tabName === 'parties') loadParties();
  if (tabName === 'users') loadUsers();
  if (tabName === 'settings') loadSettings();
}

function toggleLang() {
  currentLang = currentLang === 'bn' ? 'en' : 'bn';
  localStorage.setItem('dm_lang', currentLang);
  applyI18n();
}

function money(n) { return Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 }); }
function fmtDate(d) { if (!d) return ''; const dt = new Date(d); return isNaN(dt) ? d : dt.toLocaleDateString(); }

/* ============ TABLE SEARCH/FILTER ============ */
function filterTableRows(inputEl, tbodyId) {
  const q = inputEl.value.toLowerCase().trim();
  document.getElementById(tbodyId).querySelectorAll('tr').forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}

/* ============ CSV EXPORT / BACKUP ============ */
function arrayToCSV(rows) {
  if (!rows || !rows.length) return '';
  const headers = Object.keys(rows[0]);
  const esc = v => `"${String(v === undefined || v === null ? '' : v).replace(/"/g, '""')}"`;
  const lines = [headers.join(',')];
  rows.forEach(r => lines.push(headers.map(h => esc(r[h])).join(',')));
  return lines.join('\r\n');
}
function downloadCSV(filename, rows) {
  const csv = arrayToCSV(rows);
  if (!csv) { alert(t('noData')); return; }
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
async function exportData(action, filename) {
  try { downloadCSV(filename, await api(action, {})); } catch (err) { alert(err.message); }
}
async function exportAllData() {
  const jobs = [
    ['list_capital', 'capital.csv'], ['list_income_expense', 'income_expense.csv'],
    ['list_shareholders', 'shareholders.csv'], ['list_shareholder_payments', 'shareholder_payments.csv'],
    ['list_inventory', 'inventory.csv'], ['list_sales', 'sales.csv'],
    ['list_receivable_payable', 'receivable_payable.csv'], ['list_parties', 'parties.csv']
  ];
  for (const [action, filename] of jobs) {
    await exportData(action, filename);
    await new Promise(r => setTimeout(r, 350));
  }
  alert(t('backupDone'));
}

/* ============ DASHBOARD ============ */
async function loadDashboard() {
  const el = document.getElementById('dashboardCards');
  el.innerHTML = `<div class="card">${t('loading')}</div>`;
  document.getElementById('lowStockBanner').innerHTML = '';
  try {
    if (currentRole === 'Owner') {
      const d = await api('dashboard', {});
      el.innerHTML = `
        <div class="card positive"><div class="label">${t('cash')}</div><div class="value">৳ ${money(d.cashInHand)}</div></div>
        <div class="card positive"><div class="label">${t('bank')}</div><div class="value">৳ ${money(d.bankBalance)}</div></div>
        <div class="card"><div class="label">${t('totalCapital')}</div><div class="value">৳ ${money(d.totalCapital)}</div></div>
        <div class="card"><div class="label">${t('totalWithdrawal')}</div><div class="value">৳ ${money(d.totalWithdrawal)}</div></div>
        <div class="card positive"><div class="label">${t('totalIncome')}</div><div class="value">৳ ${money(d.totalIncome)}</div></div>
        <div class="card negative"><div class="label">${t('totalExpense')}</div><div class="value">৳ ${money(d.totalExpense)}</div></div>
        <div class="card ${d.netProfit >= 0 ? 'positive' : 'negative'}"><div class="label">${t('netProfit')}</div><div class="value">৳ ${money(d.netProfit)}</div></div>
        <div class="card"><div class="label">${t('receivable')}</div><div class="value">৳ ${money(d.totalReceivable)}</div></div>
        <div class="card negative"><div class="label">${t('payable')}</div><div class="value">৳ ${money(d.totalPayable)}</div></div>
        <div class="card"><div class="label">${t('inventoryValue')}</div><div class="value">৳ ${money(d.inventoryValue)} (${d.inventoryUnits} pcs)</div></div>
        <div class="card"><div class="label">${t('shareholderPaid')}</div><div class="value">৳ ${money(d.totalShareholderPaid)}</div></div>
      `;
      renderLowStockBanner(d.lowStockProducts);
    } else {
      const d = await api('staff_dashboard', {});
      el.innerHTML = `
        <div class="card positive"><div class="label">${t('todaySales')}</div><div class="value">৳ ${money(d.todaySalesTotal)}</div></div>
        <div class="card"><div class="label">${t('todaySalesCount')}</div><div class="value">${d.todaySalesCount}</div></div>
      `;
      renderLowStockBanner(d.lowStockProducts);
    }
  } catch (err) { el.innerHTML = `<div class="card">${err.message}</div>`; }
}

function renderLowStockBanner(list) {
  const box = document.getElementById('lowStockBanner');
  if (!list || !list.length) { box.innerHTML = ''; return; }
  box.innerHTML = `<div class="card negative" style="margin-bottom:16px;">
    <div class="label">${t('lowStockAlert')}</div>
    <div>${list.map(p => `${p.ProductName} (${t('stock')}: ${p.Stock})`).join(', ')}</div>
  </div>`;
}

/* ============ CAPITAL ============ */
async function loadCapital() {
  const rows = await api('list_capital', {});
  window._capitalRows = rows;
  document.getElementById('capitalTableBody').innerHTML = rows.slice().reverse().map(r => `
    <tr><td>${fmtDate(r.Date)}</td>
      <td><span class="tag ${r.Type === 'Withdrawal' ? 'withdrawal' : 'initial'}">${r.Type}</span></td>
      <td>৳ ${money(r.Amount)}</td><td>${r.Method}</td><td>${r.Note || ''}</td>
      <td><button class="btn secondary" onclick="editCapitalRow(${r.ID})">${t('edit')}</button>
          <button class="btn danger" onclick="deleteCapitalRow(${r.ID})">${t('delete')}</button></td></tr>`
  ).join('') || `<tr><td colspan="6">${t('noData')}</td></tr>`;
}
document.getElementById('capitalForm').addEventListener('submit', async (e) => {
  e.preventDefault(); const f = e.target;
  const payload = { type: f.type.value, amount: f.amount.value, method: f.method.value, note: f.note.value };
  if (editingCapitalId) { await api('edit_capital', { id: editingCapitalId, ...payload }); cancelCapitalEdit(); }
  else { await api('add_capital', payload); }
  f.reset(); loadCapital(); loadDashboard();
});
function editCapitalRow(id) {
  const row = (window._capitalRows || []).find(r => Number(r.ID) === Number(id));
  if (!row) return;
  const f = document.getElementById('capitalForm');
  f.type.value = row.Type; f.amount.value = row.Amount; f.method.value = row.Method; f.note.value = row.Note || '';
  editingCapitalId = id;
  document.getElementById('capitalSubmitBtn').textContent = t('update');
  document.getElementById('capitalCancelBtn').style.display = '';
}
function cancelCapitalEdit() {
  editingCapitalId = null;
  document.getElementById('capitalForm').reset();
  document.getElementById('capitalSubmitBtn').textContent = t('add');
  document.getElementById('capitalCancelBtn').style.display = 'none';
}
function deleteCapitalRow(id) {
  if (!confirm(t('confirmDelete'))) return;
  api('delete_capital', { id }).then(() => { loadCapital(); loadDashboard(); });
}

/* ============ INCOME / EXPENSE ============ */
async function loadIncomeExpense() {
  const rows = await api('list_income_expense', {});
  document.getElementById('ieTableBody').innerHTML = rows.slice().reverse().map(r => `
    <tr><td>${fmtDate(r.Date)}</td><td><span class="tag ${r.Type.toLowerCase()}">${r.Type}</span></td>
      <td>${r.Category}</td><td>৳ ${money(r.Amount)}</td><td>${r.Method}</td><td>${r.Note || ''}</td></tr>`
  ).join('') || `<tr><td colspan="6">${t('noData')}</td></tr>`;
}
document.getElementById('ieForm').addEventListener('submit', async (e) => {
  e.preventDefault(); const f = e.target;
  await api('add_income_expense', { type: f.type.value, category: f.category.value, amount: f.amount.value, method: f.method.value, note: f.note.value });
  f.reset(); loadIncomeExpense(); loadDashboard();
});

/* ============ SHAREHOLDERS ============ */
async function loadShareholders() {
  const [holders, payments, dist] = await Promise.all([
    api('list_shareholders', {}), api('list_shareholder_payments', {}), api('shareholder_distribution', {})
  ]);
  window._shPaymentRows = payments;

  document.getElementById('shareholderTableBody').innerHTML = holders.map(r => `
    <tr><td>${r.Name}</td><td>${r.Phone || ''}</td><td>${r.SharePercent || ''}</td><td>${fmtDate(r.JoinDate)}</td></tr>`
  ).join('') || `<tr><td colspan="4">${t('noData')}</td></tr>`;

  document.querySelector('#shPaymentForm select[name=shareholderName]').innerHTML =
    holders.map(h => `<option value="${h.Name}">${h.Name}</option>`).join('');

  document.getElementById('shPaymentTableBody').innerHTML = payments.slice().reverse().map(r => `
    <tr><td>${fmtDate(r.Date)}</td><td>${r.ShareholderName}</td><td>${r.Month}</td><td>৳ ${money(r.Amount)}</td><td>${r.Method}</td><td>${r.Note || ''}</td>
      <td><button class="btn secondary" onclick="editShPaymentRow(${r.ID})">${t('edit')}</button>
          <button class="btn danger" onclick="deleteShPaymentRow(${r.ID})">${t('delete')}</button></td></tr>`
  ).join('') || `<tr><td colspan="7">${t('noData')}</td></tr>`;

  document.getElementById('distNetProfit').textContent = '৳ ' + money(dist.netProfit);
  document.getElementById('distTableBody').innerHTML = dist.distribution.map(d => `
    <tr><td>${d.name}</td><td>${d.sharePercent}%</td><td>৳ ${money(d.entitled)}</td><td>৳ ${money(d.paid)}</td>
      <td class="${d.balanceDue >= 0 ? '' : 'negative'}">৳ ${money(Math.abs(d.balanceDue))} ${d.balanceDue >= 0 ? '(' + t('owedToThem') + ')' : '(' + t('advanceTaken') + ')'}</td></tr>`
  ).join('') || `<tr><td colspan="5">${t('noData')}</td></tr>`;
}
document.getElementById('shareholderForm').addEventListener('submit', async (e) => {
  e.preventDefault(); const f = e.target;
  await api('add_shareholder', { name: f.name.value, phone: f.phone.value, sharePercent: f.sharePercent.value });
  f.reset(); loadShareholders();
});
document.getElementById('shPaymentForm').addEventListener('submit', async (e) => {
  e.preventDefault(); const f = e.target;
  const payload = { shareholderName: f.shareholderName.value, month: f.month.value, amount: f.amount.value, method: f.method.value, note: f.note.value };
  if (editingShPaymentId) { await api('edit_shareholder_payment', { id: editingShPaymentId, ...payload }); cancelShPaymentEdit(); }
  else { await api('add_shareholder_payment', payload); }
  f.reset(); loadShareholders(); loadDashboard();
});
function editShPaymentRow(id) {
  const row = (window._shPaymentRows || []).find(r => Number(r.ID) === Number(id));
  if (!row) return;
  const f = document.getElementById('shPaymentForm');
  f.shareholderName.value = row.ShareholderName; f.month.value = row.Month; f.amount.value = row.Amount;
  f.method.value = row.Method; f.note.value = row.Note || '';
  editingShPaymentId = id;
  document.getElementById('shPaymentSubmitBtn').textContent = t('update');
  document.getElementById('shPaymentCancelBtn').style.display = '';
}
function cancelShPaymentEdit() {
  editingShPaymentId = null;
  document.getElementById('shPaymentForm').reset();
  document.getElementById('shPaymentSubmitBtn').textContent = t('add');
  document.getElementById('shPaymentCancelBtn').style.display = 'none';
}
function deleteShPaymentRow(id) {
  if (!confirm(t('confirmDelete'))) return;
  api('delete_shareholder_payment', { id }).then(() => { loadShareholders(); loadDashboard(); });
}

/* ============ INVENTORY ============ */
async function loadInventory() {
  const rows = await api('list_inventory', {});
  productsCache = rows;
  document.getElementById('inventoryTableBody').innerHTML = rows.map(r => {
    const low = Number(r.Stock) <= Number(r.LowStockThreshold || 0);
    return `<tr style="${low ? 'background:#fbe9e7;' : ''}">
      <td>${r.ProductName}</td><td>${r.Category || ''}</td>
      <td>৳ ${money(r.PurchasePrice)}</td><td>৳ ${money(r.SalePrice)}</td>
      <td>${r.Stock}${low ? ' ⚠' : ''}</td><td>${r.LowStockThreshold || ''}</td></tr>`;
  }).join('') || `<tr><td colspan="6">${t('noData')}</td></tr>`;

  const purchaseSelect = document.querySelector('#stockPurchaseForm select[name=productId]');
  if (purchaseSelect) purchaseSelect.innerHTML = rows.map(p => `<option value="${p.ID}">${p.ProductName}</option>`).join('');
}
const productForm = document.getElementById('productForm');
if (productForm) productForm.addEventListener('submit', async (e) => {
  e.preventDefault(); const f = e.target;
  await api('add_product', { name: f.name.value, category: f.category.value, purchasePrice: f.purchasePrice.value, salePrice: f.salePrice.value, lowStockThreshold: f.lowStockThreshold.value || 5 });
  f.reset(); loadInventory();
});
const stockForm = document.getElementById('stockPurchaseForm');
if (stockForm) stockForm.addEventListener('submit', async (e) => {
  e.preventDefault(); const f = e.target;
  await api('stock_purchase', { productId: f.productId.value, qty: f.qty.value, unitCost: f.unitCost.value || undefined, method: f.method.value, paidAmount: f.paidAmount.value || 0, supplierName: f.supplierName.value });
  f.reset(); loadInventory(); loadDashboard(); if (document.getElementById('nav-rp').style.display !== 'none') loadRP();
});

/* ============ SALES / VOUCHER (discount + VAT + split payment) ============ */
async function loadSales() {
  const rows = await api('list_sales', {});
  window._salesRows = rows;
  const canEdit = currentRole === 'Owner';
  document.getElementById('salesTableBody').innerHTML = rows.slice().reverse().map(r => `
    <tr><td>${r.InvoiceNo}</td><td>${fmtDate(r.Date)}</td><td>${r.CustomerName || ''}</td>
      <td>৳ ${money(r.TotalAmount)}</td><td>৳ ${money(Number(r.PaidCash||0)+Number(r.PaidBank||0))}</td><td>৳ ${money(r.DueAmount)}</td>
      <td>
        <button class="btn secondary" onclick="reprintVoucher('${r.InvoiceNo}')">${t('printVoucher')}</button>
        ${canEdit ? `<button class="btn secondary" onclick="editSaleRow(${r.ID})">${t('edit')}</button>
        <button class="btn danger" onclick="deleteSaleRow(${r.ID})">${t('delete')}</button>` : ''}
      </td></tr>`
  ).join('') || `<tr><td colspan="7">${t('noData')}</td></tr>`;

  if (!productsCache.length) productsCache = await api('list_inventory', {});
  document.querySelector('#saleItemAdd select[name=productId]').innerHTML =
    productsCache.map(p => `<option value="${p.ID}" data-price="${p.SalePrice}" data-name="${p.ProductName}">${p.ProductName} (${t('stock')}: ${p.Stock})</option>`).join('');
}

document.getElementById('addSaleItemBtn').addEventListener('click', () => {
  const form = document.getElementById('saleItemAdd');
  const opt = form.productId.options[form.productId.selectedIndex];
  if (!opt) return;
  const qty = Number(form.qty.value || 1);
  const unitPrice = Number(form.unitPrice.value || opt.dataset.price);
  saleItems.push({ productId: opt.value, productName: opt.dataset.name, qty, unitPrice });
  renderSaleItems();
  form.qty.value = ''; form.unitPrice.value = '';
});

function renderSaleItems() {
  const body = document.getElementById('saleItemsBody');
  let subtotal = 0;
  body.innerHTML = saleItems.map((it, i) => {
    const lineTotal = it.qty * it.unitPrice;
    subtotal += lineTotal;
    return `<tr><td>${it.productName}</td><td>${it.qty}</td><td>৳ ${money(it.unitPrice)}</td><td>৳ ${money(lineTotal)}</td>
      <td><button class="btn danger" onclick="removeSaleItem(${i})">✕</button></td></tr>`;
  }).join('');
  updateSaleTotals(subtotal);
  return subtotal;
}
function removeSaleItem(i) { saleItems.splice(i, 1); renderSaleItems(); }

function updateSaleTotals(subtotal) {
  const f = document.getElementById('saleForm');
  const discount = Number(f.discount.value || 0);
  const vatPercent = Number(f.vatPercent.value || 0);
  const vatAmount = (subtotal - discount) * (vatPercent / 100);
  const total = subtotal - discount + vatAmount;
  document.getElementById('saleSubtotalDisplay').textContent = '৳ ' + money(subtotal);
  document.getElementById('saleVatAmountDisplay').textContent = '৳ ' + money(vatAmount);
  document.getElementById('saleTotalDisplay').textContent = '৳ ' + money(total);
  return { subtotal, discount, vatAmount, total };
}
document.getElementById('saleForm').addEventListener('input', () => {
  let subtotal = 0; saleItems.forEach(it => subtotal += it.qty * it.unitPrice);
  updateSaleTotals(subtotal);
});

document.getElementById('saleForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!saleItems.length) return alert(t('addItem'));
  const f = e.target;
  const subtotal = renderSaleItems();
  const totals = updateSaleTotals(subtotal);
  const payload = {
    customerName: f.customerName.value, customerPhone: f.customerPhone.value,
    items: saleItems, discount: totals.discount, vat: totals.vatAmount,
    paidCash: f.paidCash.value || 0, paidBank: f.paidBank.value || 0, note: f.note.value
  };
  let invoiceNo;
  if (editingSaleId) {
    const res = await api('edit_sale', { id: editingSaleId, ...payload });
    invoiceNo = res.invoiceNo;
    cancelSaleEdit();
  } else {
    const res = await api('add_sale', payload);
    invoiceNo = res.invoiceNo;
  }
  saleItems = []; renderSaleItems(); f.reset();
  loadSales(); loadDashboard(); loadInventory();
  await reprintVoucher(invoiceNo);
});

async function editSaleRow(id) {
  const row = (window._salesRows || []).find(r => Number(r.ID) === Number(id));
  if (!row) return;
  const sale = await api('get_sale', { invoiceNo: row.InvoiceNo });
  saleItems = sale.Items.map(it => ({ productId: it.productId, productName: it.productName, qty: it.qty, unitPrice: it.unitPrice }));
  renderSaleItems();
  const f = document.getElementById('saleForm');
  f.customerName.value = sale.CustomerName || '';
  f.customerPhone.value = sale.CustomerPhone || '';
  f.discount.value = sale.Discount || 0;
  const base = Number(sale.Subtotal) - Number(sale.Discount);
  f.vatPercent.value = base > 0 ? (Number(sale.VAT) / base * 100).toFixed(2) : 0;
  f.paidCash.value = sale.PaidCash || 0;
  f.paidBank.value = sale.PaidBank || 0;
  f.note.value = sale.Note || '';
  editingSaleId = id;
  document.getElementById('saleSubmitBtn').textContent = t('update');
  document.getElementById('saleCancelBtn').style.display = '';
  updateSaleTotals(Number(sale.Subtotal));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function cancelSaleEdit() {
  editingSaleId = null;
  saleItems = []; renderSaleItems();
  document.getElementById('saleForm').reset();
  document.getElementById('saleSubmitBtn').textContent = t('createSale');
  document.getElementById('saleCancelBtn').style.display = 'none';
}
function deleteSaleRow(id) {
  if (!confirm(t('confirmDelete'))) return;
  api('delete_sale', { id }).then(() => { loadSales(); loadDashboard(); loadInventory(); });
}

function buildVoucherCopyHtml(sale, settings, copyLabel) {
  return `
    <div class="voucher-copy">
      <div class="copy-label">${copyLabel}</div>
      <h3>${settings.ShopName || ''}</h3>
      <div class="shop-sub">${settings.Address || ''} ${settings.Phone ? '| ' + settings.Phone : ''}</div>
      <div class="shop-sub">${t('invoiceNo')}: <b>${sale.InvoiceNo}</b> &nbsp; ${fmtDate(sale.Date)}</div>
      <div class="shop-sub">${sale.CustomerName || ''} ${sale.CustomerPhone ? '- ' + sale.CustomerPhone : ''}</div>
      <table>
        <thead><tr><th>${t('product')}</th><th>${t('qty')}</th><th>${t('amount')}</th></tr></thead>
        <tbody>${sale.Items.map(it => `<tr><td>${it.productName}</td><td>${it.qty}</td><td>৳ ${money(it.qty * it.unitPrice)}</td></tr>`).join('')}</tbody>
        <tfoot class="totals">
          <tr><td colspan="2">${t('subtotal')}</td><td>৳ ${money(sale.Subtotal)}</td></tr>
          <tr><td colspan="2">${t('discount')}</td><td>৳ ${money(sale.Discount)}</td></tr>
          <tr><td colspan="2">${t('vat')}</td><td>৳ ${money(sale.VAT)}</td></tr>
          <tr><td colspan="2">${t('total')}</td><td>৳ ${money(sale.TotalAmount)}</td></tr>
          <tr><td colspan="2">${t('paidCash')}</td><td>৳ ${money(sale.PaidCash)}</td></tr>
          <tr><td colspan="2">${t('paidBank')}</td><td>৳ ${money(sale.PaidBank)}</td></tr>
          <tr><td colspan="2">${t('due')}</td><td>৳ ${money(sale.DueAmount)}</td></tr>
        </tfoot>
      </table>
      <div class="shop-sub" style="margin-top:6px;">${t('thankYou')}</div>
      <div class="signature-row">
        <div class="signature-box">............................<br>${currentLang === 'bn' ? 'ক্রেতার স্বাক্ষর' : "Customer's Signature"}</div>
        <div class="signature-box">............................<br>${currentLang === 'bn' ? 'বিক্রেতার স্বাক্ষর' : "Seller's Signature"}</div>
      </div>
    </div>`;
}

async function reprintVoucher(invoiceNo) {
  const sale = await api('get_sale', { invoiceNo });
  const settings = await api('get_settings', {});
  const custLabel = currentLang === 'bn' ? 'ক্রেতার কপি' : 'Customer Copy';
  const sellLabel = currentLang === 'bn' ? 'বিক্রেতার কপি' : 'Seller Copy';
  document.getElementById('voucherPrintArea').innerHTML =
    buildVoucherCopyHtml(sale, settings, custLabel) + buildVoucherCopyHtml(sale, settings, sellLabel);
  document.getElementById('voucherModal').style.display = 'flex';
}
function closeVoucher() { document.getElementById('voucherModal').style.display = 'none'; }
function printVoucherNow() { window.print(); }

document.getElementById('searchInvoiceForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const inv = e.target.invoiceNo.value.trim();
  if (!inv) return;
  try { await reprintVoucher(inv); } catch (err) { alert(err.message); }
});

/* ============ RECEIVABLE / PAYABLE ============ */
async function loadRP() {
  const rows = await api('list_receivable_payable', {});
  document.getElementById('rpTableBody').innerHTML = rows.slice().reverse().map(r => `
    <tr><td>${fmtDate(r.Date)}</td>
      <td><span class="tag ${r.Type.toLowerCase()}">${r.Type === 'Receivable' ? t('receivable_opt') : t('payable_opt')}</span></td>
      <td>${r.PartyName}</td><td>৳ ${money(r.Amount)}</td><td>৳ ${money(r.PaidAmount)}</td><td>৳ ${money(r.DueAmount)}</td>
      <td>${Number(r.DueAmount) > 0 ? `<button class="btn secondary" onclick="openSettle(${r.ID})">${t('settle')}</button>` : '-'}</td></tr>`
  ).join('') || `<tr><td colspan="7">${t('noData')}</td></tr>`;
  window._rpRows = rows;
}
document.getElementById('rpForm').addEventListener('submit', async (e) => {
  e.preventDefault(); const f = e.target;
  await api('add_receivable_payable', { partyName: f.partyName.value, type: f.type.value, amount: f.amount.value, note: f.note.value });
  f.reset(); loadRP(); loadDashboard();
});
function openSettle(id) {
  const row = (window._rpRows || []).find(r => Number(r.ID) === id);
  if (!row) return;
  const amount = prompt(`${row.PartyName} - ${t('remaining')}: ৳ ${money(row.DueAmount)}\n${t('paySettle')}:`);
  if (!amount) return;
  const method = confirm(t('cash_opt') + ' = OK, ' + t('bank_opt') + ' = Cancel') ? 'Cash' : 'Bank';
  api('add_payment_rp', { id, amount, method }).then(() => { loadRP(); loadDashboard(); });
}

/* ============ PARTIES (customer/supplier directory + history) ============ */
async function loadParties() {
  const rows = await api('list_parties', {});
  document.getElementById('partiesTableBody').innerHTML = rows.map(r => `
    <tr><td>${r.Name}</td><td>${r.Phone || ''}</td>
      <td><span class="tag ${r.Type === 'Customer' ? 'receivable' : 'payable'}">${r.Type === 'Customer' ? t('customer_opt') : t('supplier_opt')}</span></td>
      <td><button class="btn secondary" onclick="viewPartyHistory('${r.Name.replace(/'/g, "\\'")}')">${t('viewHistory')}</button></td></tr>`
  ).join('') || `<tr><td colspan="4">${t('noData')}</td></tr>`;
}
document.getElementById('partyForm').addEventListener('submit', async (e) => {
  e.preventDefault(); const f = e.target;
  await api('add_party', { name: f.name.value, phone: f.phone.value, type: f.type.value });
  f.reset(); loadParties();
});
async function viewPartyHistory(name) {
  const data = await api('get_party_history', { name });
  const box = document.getElementById('partyHistoryBox');
  box.innerHTML = `
    <h3>${data.name}</h3>
    <div class="cards" style="margin-bottom:16px;">
      <div class="card"><div class="label">${t('totalSales')}</div><div class="value">৳ ${money(data.totalSales)}</div></div>
      <div class="card negative"><div class="label">${t('totalDue')}</div><div class="value">৳ ${money(data.totalDue)}</div></div>
    </div>
    <h4 data-i18n="history">${t('history')}</h4>
    <div class="table-wrap"><table>
      <thead><tr><th>${t('date')}</th><th>${t('invoiceNo')}</th><th>${t('total')}</th><th>${t('due')}</th></tr></thead>
      <tbody>${data.sales.map(s => `<tr><td>${fmtDate(s.Date)}</td><td>${s.InvoiceNo}</td><td>৳ ${money(s.TotalAmount)}</td><td>৳ ${money(s.DueAmount)}</td></tr>`).join('') || `<tr><td colspan="4">${t('noData')}</td></tr>`}</tbody>
    </table></div>`;
  box.style.display = 'block';
}

/* ============ USERS (staff logins) ============ */
async function loadUsers() {
  const rows = await api('list_users', {});
  document.getElementById('usersTableBody').innerHTML = rows.map(r => `
    <tr><td>${r.Username}</td><td>${r.Name || ''}</td><td>${r.Role === 'Owner' ? t('owner_opt') : t('staff_opt')}</td></tr>`
  ).join('') || `<tr><td colspan="3">${t('noData')}</td></tr>`;
}
document.getElementById('userForm').addEventListener('submit', async (e) => {
  e.preventDefault(); const f = e.target;
  await api('add_user', { username: f.username.value, password: f.password.value, role: f.role.value, name: f.name.value });
  f.reset(); loadUsers();
});

/* ============ REPORTS (with monthly chart) ============ */
async function loadReports() {
  await generateReport('', '');
  await renderMonthlyChart();
}
document.getElementById('reportForm').addEventListener('submit', async (e) => {
  e.preventDefault(); const f = e.target;
  await generateReport(f.fromDate.value, f.toDate.value);
});
async function generateReport(fromDate, toDate) {
  const data = await api('report', { fromDate, toDate });
  const settings = await api('get_settings', {});
  document.getElementById('reportShopName').textContent = settings.ShopName || '';
  document.getElementById('reportShopSub').textContent = [settings.Address, settings.Phone].filter(Boolean).join(' | ');
  document.getElementById('reportRangeLabel').textContent = (fromDate || toDate) ? `${t('fromDate')}: ${fromDate || '...'}  —  ${t('toDate')}: ${toDate || '...'}` : t('allTime');

  document.getElementById('reportSummaryCards').innerHTML = `
    <div class="card positive"><div class="label">${t('totalIncome')}</div><div class="value">৳ ${money(data.totalIncome)}</div></div>
    <div class="card negative"><div class="label">${t('totalExpense')}</div><div class="value">৳ ${money(data.totalExpense)}</div></div>
    <div class="card ${data.netProfit >= 0 ? 'positive' : 'negative'}"><div class="label">${t('netProfit')}</div><div class="value">৳ ${money(data.netProfit)}</div></div>`;

  const incCats = Object.keys(data.incomeByCategory || {});
  document.getElementById('reportIncomeCatBody').innerHTML = incCats.map(c => `<tr><td>${c}</td><td>৳ ${money(data.incomeByCategory[c])}</td></tr>`).join('') || `<tr><td colspan="2">${t('noData')}</td></tr>`;

  const expCats = Object.keys(data.expenseByCategory || {});
  document.getElementById('reportExpenseCatBody').innerHTML = expCats.map(c => `<tr><td>${c}</td><td>৳ ${money(data.expenseByCategory[c])}</td></tr>`).join('') || `<tr><td colspan="2">${t('noData')}</td></tr>`;

  document.getElementById('reportTxBody').innerHTML = (data.transactions || []).map(r => `
    <tr><td>${fmtDate(r.Date)}</td><td><span class="tag ${r.Type.toLowerCase()}">${r.Type}</span></td><td>${r.Category}</td><td>৳ ${money(r.Amount)}</td><td>${r.Method}</td><td>${r.Note || ''}</td></tr>`
  ).join('') || `<tr><td colspan="6">${t('noData')}</td></tr>`;
}

async function renderMonthlyChart() {
  const rows = await api('monthly_summary', {});
  const svgBox = document.getElementById('monthlyChart');
  if (!rows.length) { svgBox.innerHTML = `<p>${t('noData')}</p>`; return; }

  const W = 700, H = 300, pad = 40;
  const maxVal = Math.max(1, ...rows.map(r => Math.max(r.income, r.expense, Math.abs(r.profit))));
  const barGroupW = (W - pad * 2) / rows.length;
  const scale = (H - pad * 2) / maxVal;

  let bars = '';
  rows.forEach((r, i) => {
    const gx = pad + i * barGroupW;
    const bw = barGroupW / 4;
    const incH = r.income * scale, expH = r.expense * scale, profH = Math.abs(r.profit) * scale;
    bars += `<rect x="${gx}" y="${H - pad - incH}" width="${bw}" height="${incH}" fill="#1a7a4c"/>`;
    bars += `<rect x="${gx + bw + 4}" y="${H - pad - expH}" width="${bw}" height="${expH}" fill="#c0392b"/>`;
    bars += `<rect x="${gx + (bw + 4) * 2}" y="${H - pad - profH}" width="${bw}" height="${profH}" fill="${r.profit >= 0 ? '#2e86de' : '#e17055'}"/>`;
    bars += `<text x="${gx + barGroupW / 2 - 10}" y="${H - pad + 16}" font-size="10" fill="#6b7a72">${r.month}</text>`;
  });

  svgBox.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:${W}px;">
      <line x1="${pad}" y1="${H - pad}" x2="${W - pad}" y2="${H - pad}" stroke="#e1e6e3"/>
      ${bars}
    </svg>
    <div style="display:flex;gap:16px;font-size:12px;margin-top:6px;">
      <span><span style="display:inline-block;width:10px;height:10px;background:#1a7a4c;"></span> ${t('income_opt')}</span>
      <span><span style="display:inline-block;width:10px;height:10px;background:#c0392b;"></span> ${t('expense_opt')}</span>
      <span><span style="display:inline-block;width:10px;height:10px;background:#2e86de;"></span> ${t('netProfit')}</span>
    </div>`;
}

function printReport() {
  document.body.classList.add('printing-report');
  window.print();
  setTimeout(() => document.body.classList.remove('printing-report'), 500);
}

/* ============ SETTINGS ============ */
async function loadSettings() {
  const s = await api('get_settings', {});
  const f = document.getElementById('settingsForm');
  f.ShopName.value = s.ShopName || ''; f.Address.value = s.Address || ''; f.Phone.value = s.Phone || '';
}
document.getElementById('settingsForm').addEventListener('submit', async (e) => {
  e.preventDefault(); const f = e.target;
  await api('update_settings', { ShopName: f.ShopName.value, Address: f.Address.value, Phone: f.Phone.value });
  alert(t('save') + ' ✓');
});

/* ============ INIT ============ */
applyI18n();
if (currentUsername && currentPassword) {
  api('login', {}).then(res => {
    currentRole = res.role; currentName = res.name;
    showApp();
  }).catch(() => { sessionStorage.clear(); });
}
