const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// Configurar o middleware body-parser para tratar o JSON e dados de formulário
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração do banco de dados
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'progweb'
});

// Conexão com o banco de dados
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Conexão bem sucedida com o banco de dados');
});

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota para exibir todas as tarefas
app.get('/tasks', (req, res) => {
  db.query('SELECT * FROM tasks', (err, results) => {
    if (err) {
      throw err;
    }
    res.json(results);
  });
});

// Rota para adicionar uma nova tarefa
app.post('/tasks', (req, res) => {
  const { task } = req.body;
  db.query('INSERT INTO tasks (task) VALUES (?)', [task], (err, result) => {
    if (err) {
      throw err;
    }
    res.json({ insertId: result.insertId });
  });
});

// Rota para marcar uma tarefa como concluída
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  db.query('UPDATE tasks SET completed = ? WHERE id = ?', [completed, id], (err) => {
    if (err) {
      throw err;
    }
    res.sendStatus(200);
  });
});

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
