const express = require('express');
const {Organization} = require('../models');
const { Client } = require('../models');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Middleware de autenticação
router.use(authMiddleware);

// Nova rota para cadastrar uma organização cliente 
router.post('/orgs', async (req, res) => {
  try {
    const { name, clientData } = req.body;

    let response = await Organization.findOne({ where: { name } }); 

    if (!response) {
      const org = new Organization()
      org.name = name;
      response = await org.save(); // Salva a nova organização
    }
    response = response.dataValues.id; // Extrai o ID da organização salva

    if (response) {
      let response_cliente = await Client.findOne({ where: { email: clientData.email.toLowerCase() } })

      if (response_cliente) {
        res.send({ id: response_cliente.id })
      } else {
        const client = new Client()

        client.fullname = clientData.fullname
        client.email = clientData.email.toLowerCase()
        client.telephone = clientData.telephone
        client.organization_id = response
        const response_cliente = await client.save()
        res.send({ id: response_cliente.dataValues.id });
      }
    }

  } catch (error) {
    res.status(500).send("Erro ao cadastrar organização");
  }
});

module.exports = router;
