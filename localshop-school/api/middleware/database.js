// Database Connection Middleware
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'localshop_school',
  port: process.env.DB_PORT || 3306
});

connection.connect(err => {
  if (err) { 
    console.error('Error connecting to MySQL:', err); 
    return; 
  }
  console.log('Connected to MySQL successfully');
});

// Database query helper
function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

module.exports = {
  connection,
  query
};

