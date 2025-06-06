const balanceElement = document.getElementById('balance');
const incomeAmountElement = document.getElementById('income-amount');
const expenseAmountElement = document.getElementById('expense-amount');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const transactionList = document.getElementById('transaction-list');
const transactionForm = document.getElementById('transaction-form');
const addTransactionButton = document.getElementById('add-transaction');

//Neu refresh lai thi thi mat het transaction nen phai luu o local storage
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Update balance, income, and expense amounts
transactionForm.addEventListener('submit', addTransaction);
function addTransaction(event) {
  event.preventDefault();
  // Get form inputs
  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value);
  // add transaction
  if (description !== '' && !isNaN(amount)) {
    const transaction = {
      id: Date.now(),
      description,
      amount,
    };
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    updateTransactionList();
    updateBalance();
    // Clear form inputs
    transactionForm.reset();
  }
}

function updateTransactionList() {
  transactionList.innerHTML = '';
  const storedTransaction = [...transactions].reverse();
  storedTransaction.forEach((transaction) => {
    const transactionElement = createTransactionElement(transaction);
    transactionList.appendChild(transactionElement);
  });
}

function createTransactionElement(transaction) {
  const elementLi = document.createElement('li');
  elementLi.classList.add('transaction');
  elementLi.classList.add(transaction.amount > 0 ? 'income' : 'expense');
  elementLi.innerHTML = `
    <span>${transaction.description}</span>
    <span>${formatAmount(transaction.amount)}
    <button class = "delete-btn" onclick = "removeTransaction(${
      transaction.id
    })">X</button>
    </span>
  `;
  return elementLi;
}

function updateBalance() {
  const amounts = transactions.map((transaction) => transaction.amount);
  const balance = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0);
  const expense =
    amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1;
  balanceElement.textContent = formatAmount(balance); //formatAmount(balance) = $balance;
  incomeAmountElement.textContent = formatAmount(income); //formatAmount(income) = $income;
  expenseAmountElement.textContent = formatAmount(expense); //formatAmount(expense) = $expense;
}

function formatAmount(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  localStorage.setItem('transactions', JSON.stringify(transactions));
  updateTransactionList();
  updateBalance();
}

updateBalance();
updateTransactionList();
