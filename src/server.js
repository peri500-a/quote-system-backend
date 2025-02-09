const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

// Import all routes
const userRoutes = require('./routes/users');
const quoteRoutes = require('./routes/quotes');
const catalogRoutes = require('./routes/catalog');

// Initialize
dotenv.config();
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/catalog', catalogRoutes);

// Basic test route
app.get('/test', (req, res) => {
 res.json({ message: 'Server is running' });
});

// Database connection test
async function testDbConnection() {
 try {
   await prisma.$connect();
   console.log('Database connection successful');
 } catch (error) {
   console.error('Database connection failed:', error);
   process.exit(1);
 }
}

// Start server
async function startServer() {
 try {
   await testDbConnection();
   app.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
     console.log(`Test the server at http://localhost:${PORT}/test`);
   });
 } catch (error) {
   console.error('Failed to start server:', error);
   process.exit(1);
 }
}

startServer();