const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const app = express();

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'db_simatu'
});

app.use(express.json());

// Secret key untuk JWT
const secretKey = 'TI24';

// Middleware untuk memeriksa token JWT
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).send('Access Denied');
    }

    try {
        const verified = jwt.verify(token, secretKey);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};

// Endpoint untuk login dan menghasilkan JWT
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM Users WHERE username = ? AND password = ?';

    db.query(query, [username, password], (err, results) => {
        if (err) return res.status(500).send('Login failed');
        if (results.length === 0) return res.status(400).send('Invalid credentials');

        const token = jwt.sign({ id: results[0].id }, secretKey, { expiresIn: '1h' });
        res.status(200).json({ token });
    });
});

// Endpoint CRUD untuk Users
app.get('/users', authenticateJWT, (req, res) => {
    db.query('SELECT * FROM Users', (err, results) => {
        if (err) return res.status(500).send('Failed to fetch users');
        res.status(200).json(results);
    });
});

app.post('/users', authenticateJWT, (req, res) => {
    const { username, email, password } = req.body;
    const query = 'INSERT INTO Users (username, email, password) VALUES (?, ?, ?)';

    db.query(query, [username, email, password], (err) => {
        if (err) return res.status(500).send('Failed to add user');
        res.status(201).send('User added successfully');
    });
});

app.get('/users/:id', authenticateJWT, (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM Users WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).send('Failed to fetch user');
        if (results.length === 0) return res.status(404).send('User not found');
        res.status(200).json(results[0]);
    });
});

app.put('/users/:id', authenticateJWT, (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;
    const query = 'UPDATE Users SET username = ?, email = ?, password = ? WHERE id = ?';

    db.query(query, [username, email, password, id], (err) => {
        if (err) return res.status(500).send('Failed to update user');
        res.status(200).send('User updated successfully');
    });
});

app.delete('/users/:id', authenticateJWT, (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM Users WHERE id = ?';

    db.query(query, [id], (err) => {
        if (err) return res.status(500).send('Failed to delete user');
        res.status(200).send('User deleted successfully');
    });
});

// Endpoint CRUD untuk Projects
app.get('/projects', authenticateJWT, (req, res) => {
    db.query('SELECT * FROM Projects', (err, results) => {
        if (err) return res.status(500).send('Failed to fetch projects');
        res.status(200).json(results);
    });
});

app.post('/projects', authenticateJWT, (req, res) => {
    const { user_id, name, description } = req.body;
    const query = 'INSERT INTO Projects (user_id, name, description) VALUES (?, ?, ?)';

    db.query(query, [user_id, name, description], (err) => {
        if (err) return res.status(500).send('Failed to add project');
        res.status(201).send('Project added successfully');
    });
});

app.get('/projects/:id', authenticateJWT, (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM Projects WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).send('Failed to fetch project');
        if (results.length === 0) return res.status(404).send('Project not found');
        res.status(200).json(results[0]);
    });
});

app.put('/projects/:id', authenticateJWT, (req, res) => {
    const { id } = req.params;
    const { user_id, name, description } = req.body;
    const query = 'UPDATE Projects SET user_id = ?, name = ?, description = ? WHERE id = ?';

    db.query(query, [user_id, name, description, id], (err) => {
        if (err) return res.status(500).send('Failed to update project');
        res.status(200).send('Project updated successfully');
    });
});

app.delete('/projects/:id', authenticateJWT, (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM Projects WHERE id = ?';

    db.query(query, [id], (err) => {
        if (err) return res.status(500).send('Failed to delete project');
        res.status(200).send('Project deleted successfully');
    });
});

// Endpoint CRUD untuk Tasks
app.get('/tasks', authenticateJWT, (req, res) => {
    db.query('SELECT * FROM Tasks', (err, results) => {
        if (err) return res.status(500).send('Failed to fetch tasks');
        res.status(200).json(results);
    });
});

app.post('/tasks', authenticateJWT, (req, res) => {
    const { project_id, title, status, due_date } = req.body;
    const query = 'INSERT INTO Tasks (project_id, title, status, due_date) VALUES (?, ?, ?, ?)';

    db.query(query, [project_id, title, status, due_date], (err) => {
        if (err) return res.status(500).send('Failed to add task');
        res.status(201).send('Task added successfully');
    });
});

app.get('/tasks/:id', authenticateJWT, (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM Tasks WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).send('Failed to fetch task');
        if (results.length === 0) return res.status(404).send('Task not found');
        res.status(200).json(results[0]);
    });
});

app.put('/tasks/:id', authenticateJWT, (req, res) => {
    const { id } = req.params;
    const { project_id, title, status, due_date } = req.body;
    const query = 'UPDATE Tasks SET project_id = ?, title = ?, status = ?, due_date = ? WHERE id = ?';

    db.query(query, [project_id, title, status, due_date, id], (err) => {
        if (err) return res.status(500).send('Failed to update task');
        res.status(200).send('Task updated successfully');
    });
});

app.delete('/tasks/:id', authenticateJWT, (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM Tasks WHERE id = ?';

    db.query(query, [id], (err) => {
        if (err) return res.status(500).send('Failed to delete task');
        res.status(200).send('Task deleted successfully');
    });
});

// Endpoint CRUD untuk Comments
app.get('/comments', authenticateJWT, (req, res) => {
    db.query('SELECT * FROM Comments', (err, results) => {
        if (err) return res.status(500).send('Failed to fetch comments');
        res.status(200).json(results);
    });
});

app.post('/comments', authenticateJWT, (req, res) => {
    const { task_id, user_id, content } = req.body;
    const query = 'INSERT INTO Comments (task_id, user_id, content) VALUES (?, ?, ?)';

    db.query(query, [task_id, user_id, content], (err) => {
        if (err) return res.status(500).send('Failed to add comment');
        res.status(201).send('Comment added successfully');
    });
});

app.get('/comments/:id', authenticateJWT, (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM Comments WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).send('Failed to fetch comment');
        if (results.length === 0) return res.status(404).send('Comment not found');
        res.status(200).json(results[0]);
    });
});

app.delete('/comments/:id', authenticateJWT, (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM Comments WHERE id = ?';

    db.query(query, [id], (err) => {
        if (err) return res.status(500).send('Failed to delete comment');
        res.status(200).send('Comment deleted successfully');
    });
});

// Menambahkan listen port
app.listen(2000, () => {
    console.log('Server is running on port 2000');
});
