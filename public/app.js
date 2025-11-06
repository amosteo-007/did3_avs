const API_BASE = 'http://localhost:3000/api';

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    loadStats();
});

// Switch between search tabs
function switchTab(tab) {
    const tabs = document.querySelectorAll('.tab-btn');
    const forms = document.querySelectorAll('.search-form');

    tabs.forEach(t => t.classList.remove('active'));
    forms.forEach(f => f.classList.remove('active'));

    if (tab === 'simple') {
        tabs[0].classList.add('active');
        document.getElementById('simple-search').classList.add('active');
    } else {
        tabs[1].classList.add('active');
        document.getElementById('advanced-search').classList.add('active');
    }
}

// Load all clients
async function loadAllClients() {
    showLoading();
    try {
        const response = await fetch(`${API_BASE}/clients`);
        const data = await response.json();

        if (data.success) {
            displayResults(data.data);
        } else {
            showError('Failed to load clients');
        }
    } catch (error) {
        showError('Error connecting to server: ' + error.message);
    }
}

// Simple search
async function searchClients() {
    const query = document.getElementById('searchQuery').value.trim();
    const field = document.getElementById('searchField').value;

    if (!query) {
        alert('Please enter a search term');
        return;
    }

    showLoading();

    try {
        const response = await fetch(`${API_BASE}/search?query=${encodeURIComponent(query)}&field=${field}`);
        const data = await response.json();

        if (data.success) {
            displayResults(data.data);
        } else {
            showError(data.message);
        }
    } catch (error) {
        showError('Error connecting to server: ' + error.message);
    }
}

// Advanced search
async function advancedSearch() {
    const searchParams = {
        name: document.getElementById('advName').value.trim(),
        email: document.getElementById('advEmail').value.trim(),
        phone: document.getElementById('advPhone').value.trim(),
        nationality: document.getElementById('advNationality').value.trim(),
        minBalance: document.getElementById('advMinBalance').value,
        maxBalance: document.getElementById('advMaxBalance').value
    };

    // Remove empty fields
    Object.keys(searchParams).forEach(key => {
        if (!searchParams[key]) {
            delete searchParams[key];
        }
    });

    if (Object.keys(searchParams).length === 0) {
        alert('Please enter at least one search criterion');
        return;
    }

    showLoading();

    try {
        const response = await fetch(`${API_BASE}/search/advanced`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(searchParams)
        });

        const data = await response.json();

        if (data.success) {
            displayResults(data.data);
        } else {
            showError(data.message);
        }
    } catch (error) {
        showError('Error connecting to server: ' + error.message);
    }
}

// Clear advanced search form
function clearAdvancedSearch() {
    document.getElementById('advName').value = '';
    document.getElementById('advEmail').value = '';
    document.getElementById('advPhone').value = '';
    document.getElementById('advNationality').value = '';
    document.getElementById('advMinBalance').value = '';
    document.getElementById('advMaxBalance').value = '';
}

// Display results
function displayResults(clients) {
    const container = document.getElementById('resultsContainer');
    const countElement = document.getElementById('resultCount');

    if (clients.length === 0) {
        container.innerHTML = '<p class="placeholder">No clients found matching your search criteria</p>';
        countElement.textContent = '(0 found)';
        return;
    }

    countElement.textContent = `(${clients.length} found)`;

    const html = clients.map(client => `
        <div class="client-card">
            <div class="client-header">
                <span class="client-name">${client.name}</span>
                <span class="client-id">${client.id}</span>
            </div>
            <div class="client-details">
                <div class="detail-item">
                    <span class="detail-label">Email</span>
                    <span class="detail-value">${client.email}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Mobile Phone</span>
                    <span class="detail-value">${client.mobilePhone}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Nationality</span>
                    <span class="detail-value">${client.nationality}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Race</span>
                    <span class="detail-value">${client.race}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Address</span>
                    <span class="detail-value">${client.address}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Account Balance</span>
                    <span class="detail-value balance">$${client.accountBalance.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
            </div>
        </div>
    `).join('');

    container.innerHTML = html;
}

// Load statistics
async function loadStats() {
    try {
        const response = await fetch(`${API_BASE}/stats`);
        const result = await response.json();

        if (result.success) {
            const stats = result.data;
            const html = `
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-label">Total Clients</div>
                        <div class="stat-value">${stats.totalClients}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Total Balance</div>
                        <div class="stat-value">$${parseFloat(stats.totalBalance).toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Average Balance</div>
                        <div class="stat-value">$${parseFloat(stats.averageBalance).toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                    </div>
                </div>
            `;
            document.getElementById('statsContent').innerHTML = html;
        }
    } catch (error) {
        document.getElementById('statsContent').innerHTML = '<p class="error">Failed to load statistics</p>';
    }
}

// Show loading state
function showLoading() {
    const container = document.getElementById('resultsContainer');
    container.innerHTML = '<div class="loading">Searching...</div>';
}

// Show error message
function showError(message) {
    const container = document.getElementById('resultsContainer');
    container.innerHTML = `<div class="error">${message}</div>`;
    document.getElementById('resultCount').textContent = '';
}

// Handle Enter key on simple search
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('searchQuery').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchClients();
        }
    });
});
