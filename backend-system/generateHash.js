const bcrypt = require('bcryptjs');
const saltRounds = 10; // Número de rounds de salt

const senha = '12345';

bcrypt.hash(senha, saltRounds, (err, hash) => {
  if (err) {
    console.error('Erro ao gerar o hash:', err);
    return;
  }
  console.log('Hash bcrypt:', hash);
});
