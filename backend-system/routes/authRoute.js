const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Support } = require('../models');


const router = express.Router();

// Registro
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await Support.create({ username, password: hashedPassword });
    res.status(201).send('Usuário criado com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao criar usuário');
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const support = await Support.findOne({ where: { username } });
    if (!support || !(await bcrypt.compare(password, support.password))) {
      return res.status(400).send('Credenciais inválidas');
    }
    const token = jwt.sign({ id: support.id }, 'secrect', { expiresIn: '12h' });
    res.json({ token, id: support.id, userfullname: support.firstname + " " + support.lastname });
  } catch (error) {
    res.status(500).send('Erro ao realizar login');
  }
});

module.exports = router;
