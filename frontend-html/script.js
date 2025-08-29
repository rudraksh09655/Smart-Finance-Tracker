document.addEventListener('DOMContentLoaded', () => {
    // Auth elements
    const authContainer = document.getElementById('auth-container');
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterBtn = document.getElementById('show-register-btn');
    const showLoginBtn = document.getElementById('show-login-btn');

    // Dashboard elements
    const dashboardPage = document.getElementById('dashboard-page');
    const logoutBtn = document.getElementById('logout-btn');
    
    // Transaction Modal elements
    const transactionModal = document.getElementById('transaction-modal');
    const modalTitle = document.getElementById('modal-title');
    const addTransactionBtn = document.getElementById('add-transaction-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const transactionForm = document.getElementById('transaction-form');
    const transactionIdInput = document.getElementById('transaction-id');

    // Budget Modal elements
    const budgetModal = document.getElementById('budget-modal');
    const setBudgetBtn = document.getElementById('set-budget-btn'); // This line was missing
    const cancelBudgetBtn = document.getElementById('cancel-budget-btn');
    const budgetForm = document.getElementById('budget-form');

    const API_URL = 'http://127.0.0.1:5000';
    let transactionsCache = [];
    let budgetsCache = [];
    let spendingTrendChart = null;
    let dayToDayChart = null;

    // --- INITIALIZATION ---
    const token = localStorage.getItem('token');
    if (token) {
        showDashboard();
    } else {
        showLoginView();
    }

    // --- EVENT LISTENERS ---
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    showRegisterBtn.addEventListener('click', showRegisterView);
    showLoginBtn.addEventListener('click', showLoginView);
    logoutBtn.addEventListener('click', handleLogout);
    addTransactionBtn.addEventListener('click', openAddModal);
    cancelBtn.addEventListener('click', () => transactionModal.classList.add('hidden'));
    transactionForm.addEventListener('submit', handleFormSubmit);
    document.getElementById('recent-expenses-body').addEventListener('click', handleTableClick);
    setBudgetBtn.addEventListener('click', () => budgetModal.classList.remove('hidden'));
    cancelBudgetBtn.addEventListener('click', () => budgetModal.classList.add('hidden'));
    budgetForm.addEventListener('submit', handleSetBudget);

    // --- AUTH & VIEW TOGGLING ---
    function showLoginView() {
        authContainer.classList.remove('hidden');
        loginView.classList.remove('hidden');
        registerView.classList.add('hidden');
    }

    function showRegisterView() {
        registerView.classList.remove('hidden');
        loginView.classList.add('hidden');
    }

    function handleLogout() {
        localStorage.clear();
        window.location.reload();
    }

    async function handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if (!response.ok) throw new Error('Login failed');
            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('userEmail', data.email);
            showDashboard();
        } catch (error) {
            alert('Login failed. Please check your credentials.');
        }
    }

    async function handleRegister(e) {
        e.preventDefault();
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Registration failed');
            alert('Registration successful! Please log in.');
            showLoginView();
        } catch (error) {
            alert(error.message);
        }
    }

    // --- MODAL & FORM HANDLING ---
    function openAddModal() {
        transactionForm.reset();
        transactionIdInput.value = '';
        modalTitle.textContent = 'Add New Transaction';
        transactionModal.classList.remove('hidden');
    }

    function openEditModal(transaction) {
        transactionForm.reset();
        modalTitle.textContent = 'Edit Transaction';
        transactionIdInput.value = transaction.id;
        document.getElementById('transaction-amount').value = transaction.amount;
        document.getElementById('transaction-category').value = transaction.category;
        document.getElementById('transaction-description').value = transaction.description;
        document.querySelector(`input[name="type"][value="${transaction.type}"]`).checked = true;
        transactionModal.classList.remove('hidden');
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        const id = transactionIdInput.value;
        const isEditing = !!id;
        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing ? `${API_URL}/api/transactions/${id}` : `${API_URL}/api/transactions`;
        
        const formData = {
            amount: parseFloat(document.getElementById('transaction-amount').value),
            category: document.getElementById('transaction-category').value,
            description: document.getElementById('transaction-description').value,
            type: document.querySelector('input[name="type"]:checked').value
        };

        try {
            const token = localStorage.getItem('token');
            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'x-access-token': token },
                body: JSON.stringify(formData)
            });
            transactionModal.classList.add('hidden');
            fetchAndRenderData();
        } catch (error) {
            alert(`Could not ${isEditing ? 'update' : 'add'} transaction.`);
        }
    }

    async function handleSetBudget(e) {
        e.preventDefault();
        const category = document.getElementById('budget-category').value;
        const amount = document.getElementById('budget-amount').value;
        const token = localStorage.getItem('token');

        try {
            await fetch(`${API_URL}/api/budgets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-access-token': token },
                body: JSON.stringify({ category, amount: parseFloat(amount) })
            });
            budgetModal.classList.add('hidden');
            budgetForm.reset();
            fetchAndRenderData();
        } catch (error) {
            alert('Could not set budget.');
        }
    }

    function handleTableClick(e) {
        const target = e.target.closest('button');
        if (!target) return;
        const transactionId = target.dataset.id;
        if (target.dataset.action === 'edit') {
            const transactionToEdit = transactionsCache.find(t => t.id == transactionId);
            if (transactionToEdit) openEditModal(transactionToEdit);
        } else if (target.dataset.action === 'delete') {
            handleDelete(transactionId);
        }
    }

    async function handleDelete(id) {
        if (!confirm('Are you sure?')) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_URL}/api/transactions/${id}`, {
                method: 'DELETE',
                headers: { 'x-access-token': token }
            });
            fetchAndRenderData();
        } catch (error) {
            alert('Failed to delete transaction.');
        }
    }
    
    function showDashboard() {
        authContainer.classList.add('hidden');
        dashboardPage.classList.remove('hidden');
        dashboardPage.classList.add('flex');
        updateUserInfo();
        fetchAndRenderData();
    }

    function updateUserInfo() {
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
            const userName = userEmail.split('@')[0];
            const userInitial = userName.charAt(0).toUpperCase();
            document.getElementById('user-name').textContent = userName;
            document.getElementById('user-avatar').src = `https://placehold.co/48x48/334155/E2E8F0?text=${userInitial}`;
        }
    }

    async function fetchAndRenderData() {
        const token = localStorage.getItem('token');
        if (!token) { window.location.reload(); return; }
        try {
            const [transactionsRes, budgetsRes] = await Promise.all([
                fetch(`${API_URL}/api/transactions`, { headers: { 'x-access-token': token } }),
                fetch(`${API_URL}/api/budgets`, { headers: { 'x-access-token': token } })
            ]);

            if (transactionsRes.status === 401 || budgetsRes.status === 401) {
                handleLogout();
                return;
            }
            
            if (!transactionsRes.ok || !budgetsRes.ok) {
                throw new Error('Failed to fetch data from the server.');
            }
            
            const transactionsData = await transactionsRes.json();
            const budgetsData = await budgetsRes.json();

            transactionsCache = transactionsData.transactions;
            budgetsCache = budgetsData.budgets;

            renderRecentExpenses(transactionsCache);
            renderQuickStats(transactionsCache);
            renderCharts(transactionsCache);
            renderBudgets(transactionsCache, budgetsCache);

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    function renderRecentExpenses(transactions) {
        const tbody = document.getElementById('recent-expenses-body');
        tbody.innerHTML = '';
        transactions.slice(0, 10).forEach(t => {
            const row = `
                <tr class="border-b border-slate-800">
                    <td class="py-3 font-medium text-slate-200">${t.category}</td>
                    <td class="py-3 text-right font-semibold ${t.type === 'income' ? 'text-green-400' : 'text-red-400'}">€${t.amount.toFixed(2)}</td>
                    <td class="py-3 text-center">
                        <button data-id="${t.id}" data-action="edit" class="text-slate-400 hover:text-indigo-400 mr-2">Edit</button>
                        <button data-id="${t.id}" data-action="delete" class="text-slate-400 hover:text-red-400">Delete</button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    }

    function renderQuickStats(transactions) {
        const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
        const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
        const balance = totalIncome - totalExpenses;
        document.getElementById('stats-income').textContent = `$${totalIncome.toFixed(2)}`;
        document.getElementById('stats-expenses').textContent = `$${totalExpenses.toFixed(2)}`;
        document.getElementById('stats-balance').textContent = `$${balance.toFixed(2)}`;
    }

    function renderBudgets(transactions, budgets) {
        const container = document.getElementById('budgets-container');
        container.innerHTML = '';
        if (budgets.length === 0) {
            container.innerHTML = '<p class="text-slate-400 text-sm">No budgets set.</p>';
            return;
        }

        budgets.forEach(budget => {
            const spent = transactions
                .filter(t => t.type === 'expense' && t.category.toLowerCase() === budget.category.toLowerCase())
                .reduce((acc, t) => acc + t.amount, 0);
            
            const progress = Math.min((spent / budget.amount) * 100, 100);
            const progressColor = progress > 85 ? 'bg-red-500' : 'bg-indigo-500';

            const budgetEl = `
                <div class="text-sm">
                    <div class="flex justify-between mb-1">
                        <span class="font-medium text-slate-300">${budget.category}</span>
                        <span class="text-slate-400">$${spent.toFixed(2)} / $${budget.amount.toFixed(2)}</span>
                    </div>
                    <div class="w-full bg-slate-700 rounded-full h-2.5">
                        <div class="${progressColor} h-2.5 rounded-full" style="width: ${progress}%"></div>
                    </div>
                </div>
            `;
            container.innerHTML += budgetEl;
        });
    }

    function renderCharts(transactions) {
        if (spendingTrendChart) spendingTrendChart.destroy();
        if (dayToDayChart) dayToDayChart.destroy();

        const lineChartOptions = {
            responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
            scales: { x: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } }, y: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } } },
            elements: { line: { tension: 0.4 } }
        };

        spendingTrendChart = new Chart(document.getElementById('spending-trend-chart'), {
            type: 'line', options: lineChartOptions,
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Spending', data: [65, 59, 80, 81, 56, 55, 40],
                    backgroundColor: 'rgba(74, 222, 128, 0.2)', borderColor: 'rgba(74, 222, 128, 1)',
                    fill: true, borderWidth: 2, pointBackgroundColor: 'rgba(74, 222, 128, 1)'
                }]
            }
        });

        const expenseData = transactions.filter(t => t.type === 'expense').reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {});

        dayToDayChart = new Chart(document.getElementById('day-to-day-chart'), {
            type: 'doughnut',
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 12, padding: 15 } } }
            },
            data: {
                labels: Object.keys(expenseData),
                datasets: [{
                    label: 'Expenses', data: Object.values(expenseData),
                    backgroundColor: ['#8474E2', '#4ADF80', '#FF9F40', '#FF6384', '#36A2EB'],
                    borderColor: '#0D1117', borderWidth: 4
                }]
            }
        });
    }
});
