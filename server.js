const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Load client data
const clientsPath = path.join(__dirname, 'data', 'clients.json');
let clients = JSON.parse(fs.readFileSync(clientsPath, 'utf8'));

// API Routes

// Get all clients
app.get('/api/clients', (req, res) => {
  res.json({
    success: true,
    count: clients.length,
    data: clients
  });
});

// Get client by ID
app.get('/api/clients/:id', (req, res) => {
  const client = clients.find(c => c.id === req.params.id);

  if (!client) {
    return res.status(404).json({
      success: false,
      message: 'Client not found'
    });
  }

  res.json({
    success: true,
    data: client
  });
});

// Search clients
app.get('/api/search', (req, res) => {
  const { query, field } = req.query;

  if (!query) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required'
    });
  }

  let results = clients;

  // If field is specified, search only in that field
  if (field && field !== 'all') {
    results = clients.filter(client => {
      const value = client[field];
      if (value === undefined) return false;
      return value.toString().toLowerCase().includes(query.toLowerCase());
    });
  } else {
    // Search across all fields
    results = clients.filter(client => {
      return Object.values(client).some(value =>
        value.toString().toLowerCase().includes(query.toLowerCase())
      );
    });
  }

  res.json({
    success: true,
    count: results.length,
    data: results
  });
});

// Search by specific criteria
app.post('/api/search/advanced', (req, res) => {
  const { name, email, phone, nationality, minBalance, maxBalance } = req.body;

  let results = clients;

  if (name) {
    results = results.filter(c =>
      c.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (email) {
    results = results.filter(c =>
      c.email.toLowerCase().includes(email.toLowerCase())
    );
  }

  if (phone) {
    results = results.filter(c =>
      c.mobilePhone.includes(phone)
    );
  }

  if (nationality) {
    results = results.filter(c =>
      c.nationality.toLowerCase().includes(nationality.toLowerCase())
    );
  }

  if (minBalance !== undefined) {
    results = results.filter(c => c.accountBalance >= minBalance);
  }

  if (maxBalance !== undefined) {
    results = results.filter(c => c.accountBalance <= maxBalance);
  }

  res.json({
    success: true,
    count: results.length,
    data: results
  });
});

// Get statistics
app.get('/api/stats', (req, res) => {
  const totalBalance = clients.reduce((sum, client) => sum + client.accountBalance, 0);
  const avgBalance = totalBalance / clients.length;

  const nationalityCount = clients.reduce((acc, client) => {
    acc[client.nationality] = (acc[client.nationality] || 0) + 1;
    return acc;
  }, {});

  res.json({
    success: true,
    data: {
      totalClients: clients.length,
      totalBalance: totalBalance.toFixed(2),
      averageBalance: avgBalance.toFixed(2),
      nationalityDistribution: nationalityCount
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`KYC Bank Mockup Server running on port ${PORT}`);
  console.log(`Access the application at http://localhost:${PORT}`);
});
