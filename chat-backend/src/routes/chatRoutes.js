const express = require('express');
const { sendQuestion } = require('../controllers/chatController');

const router = express.Router();

router.post('/send_question', sendQuestion);

module.exports = router;