# KYC Bank Mockup Application

A mockup bank application for managing and querying client KYC (Know Your Customer) information. This application provides backend users with the ability to search and view mock client data including personal information, contact details, and account balances.

## Features

- **Client Database**: 10 pre-generated mock clients with diverse backgrounds
- **Simple Search**: Quick search across all fields or specific fields
- **Advanced Search**: Multi-criteria search with filters for name, email, phone, nationality, and balance range
- **Statistics Dashboard**: View total clients, total balance, and average balance
- **RESTful API**: Clean API endpoints for integration and querying
- **Modern UI**: Responsive web interface for backend users

## Client Data Structure

Each client record includes:
- **ID**: Unique client identifier
- **Name**: Full name
- **Address**: Complete physical address
- **Nationality**: Country of citizenship
- **Account Balance**: Current account balance in USD
- **Race**: Ethnicity information
- **Mobile Phone**: Contact phone number
- **Email Address**: Email contact

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd did3_avs
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Usage

1. Start the server (runs on port 3000 by default)
2. Open your browser and navigate to `http://localhost:3000`
3. Use the search interface to find client information

## API Endpoints

### Get All Clients
```
GET /api/clients
```
Returns all client records.

### Get Client by ID
```
GET /api/clients/:id
```
Returns a specific client by their ID.

### Simple Search
```
GET /api/search?query=<search_term>&field=<field_name>
```
Search clients by a query term. The `field` parameter is optional (defaults to "all").

### Advanced Search
```
POST /api/search/advanced
Content-Type: application/json

{
  "name": "string",
  "email": "string",
  "phone": "string",
  "nationality": "string",
  "minBalance": number,
  "maxBalance": number
}
```
Search with multiple criteria. All fields are optional.

### Get Statistics
```
GET /api/stats
```
Returns system statistics including total clients, total balance, and average balance.

## Project Structure

```
did3_avs/
├── data/
│   └── clients.json        # Mock client database
├── public/
│   ├── index.html          # Main UI
│   ├── style.css           # Styling
│   └── app.js              # Frontend JavaScript
├── server.js               # Express server
├── package.json            # Dependencies
└── README.md               # Documentation
```

## Technology Stack

- **Backend**: Node.js with Express.js
- **Frontend**: Vanilla HTML, CSS, and JavaScript
- **Data Storage**: JSON file (mock database)
- **API**: RESTful endpoints

## Sample Clients

The application includes 10 diverse mock clients from various countries including:
- United States
- Singapore
- UAE
- Ireland
- India
- Brazil
- Japan
- Nigeria
- Sweden
- Egypt

## Security Note

This is a MOCKUP application for demonstration purposes only. In a production environment, you would need to:
- Implement proper authentication and authorization
- Use a real database with encryption
- Add data validation and sanitization
- Implement HTTPS
- Add rate limiting
- Comply with data protection regulations (GDPR, CCPA, etc.)
- Implement proper access controls and audit logging

## License

MIT