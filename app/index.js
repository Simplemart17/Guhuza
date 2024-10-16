require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const port = process.env.PORT || 3000;

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

let connection;

// Function to create database connection
async function connectToDatabase() {
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL database');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  }
}

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Example route using the database connection
app.get('/users', async (req, res) => {
  try {
    const [rows] = await connection.execute('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Connect to the database before starting the server
connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
