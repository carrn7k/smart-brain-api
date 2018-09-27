const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json('incorrect form submission');
  }
  const hash = bcrypt.hashSync(password);
    return db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date()
          })
          .then(user => {
            res.json(user[0]);
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register'))
}

const signRegistration = (db, bcrypt) => (req, res) => {
  const user = handleRegister(req, res, db, bcrypt);
  return res.json({test: 'test', user});
  /*.then(user => {
    return user.id && user.email ? createSession(user) : Promise.reject(data)
  })
  .then(data => res.json(data))
  .catch(err => res.status(400).json(err));
  */
}


module.exports = {
  signRegistration: signRegistration
  //handleRegister: handleRegister
};


