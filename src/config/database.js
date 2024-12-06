const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'db',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if(err)
    {
        console.error('Error connecting to the database: ', err.stack);
        process.exit(1);
    }

    console.log('Connected to the database.');
});

module.exports = connection;