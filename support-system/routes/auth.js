const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Registro
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashedPassword });
    res.status(201).send('Usuário criado com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao criar usuário');
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).send('Credenciais inválidas');
    }
    const token = jwt.sign({ id: user.id }, 'secrect', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).send('Erro ao realizar login');
  }
});

module.exports = router;
