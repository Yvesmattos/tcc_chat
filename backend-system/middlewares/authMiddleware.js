const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).send('Token não fornecido');
  }
//   jwt.verify(token, 'secrect', (err, decoded) => {
//     if (err) {
//       return res.status(403).send('Token inválido');
//     }
//     req.userId = decoded.id;
    next();
//   });
};
