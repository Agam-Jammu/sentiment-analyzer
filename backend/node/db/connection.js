const { Pool } = require('pg');

// Configuration for the PostgreSQL database
const pool = new Pool({
  user: 'postgres',          // Replace with your PostgreSQL username
  host: 'localhost',              // Host of your database
  database: 'postgres', // Replace with your database name
  password: 'cracked',      // Replace with your PostgreSQL password
  port: 5432                      // Default PostgreSQL port
});

// Test the connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Connected to the PostgreSQL database successfully!');
    client.release(); // Release the client back to the pool
  } catch (error) {
    console.error('Error connecting to the PostgreSQL database:', error);
    process.exit(1); // Exit the application if connection fails
  }
};

// Call testConnection during initialization
testConnection();

module.exports = pool;
