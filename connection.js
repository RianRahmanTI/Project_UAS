const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin'
});

connection.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.message);
        return;
    }

    // Membuat database
    connection.query('CREATE DATABASE IF NOT EXISTS db_simatu', (err, result) => {
        if (err) {
            console.error('Failed to create database:', err.message);
            return;
        }
        console.log('Database created or already exists.');

        // Menggunakan database
        connection.changeUser({ database: 'db_simatu' }, err => {
            if (err) {
                console.error('Failed to switch database:', err.message);
                return;
            }

            console.log('Switched to database db_simatu.');

            // Membuat tabel Users
            const createUsersTable = `
                CREATE TABLE IF NOT EXISTS Users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `;
            connection.query(createUsersTable, err => {
                if (err) {
                    console.error('Failed to create Users table:', err.message);
                    return;
                }
                console.log('Users table created or already exists.');
            });

            // Membuat tabel Projects
            const createProjectsTable = `
                CREATE TABLE IF NOT EXISTS Projects (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    name VARCHAR(255) NOT NULL,
                    description TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES Users(id)
                )
            `;
            connection.query(createProjectsTable, err => {
                if (err) {
                    console.error('Failed to create Projects table:', err.message);
                    return;
                }
                console.log('Projects table created or already exists.');
            });

            // Membuat tabel Tasks
            const createTasksTable = `
                CREATE TABLE IF NOT EXISTS Tasks (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    project_id INT NOT NULL,
                    title VARCHAR(255) NOT NULL,
                    status VARCHAR(255) NOT NULL,
                    due_date DATE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (project_id) REFERENCES Projects(id)
                )
            `;
            connection.query(createTasksTable, err => {
                if (err) {
                    console.error('Failed to create Tasks table:', err.message);
                    return;
                }
                console.log('Tasks table created or already exists.');
            });

            // Membuat tabel Comments
            const createCommentsTable = `
                CREATE TABLE IF NOT EXISTS Comments (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    task_id INT NOT NULL,
                    user_id INT NOT NULL,
                    content TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (task_id) REFERENCES Tasks(id),
                    FOREIGN KEY (user_id) REFERENCES Users(id)
                )
            `;
            connection.query(createCommentsTable, err => {
                if (err) {
                    console.error('Failed to create Comments table:', err.message);
                    return;
                }
                console.log('Comments table created or already exists.');
            });

            // Menutup koneksi setelah membuat tabel
            // connection.end();
        });
    });
});
