const { Strategy } = require('passport-local');
const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const UserService = require('./../../../services/user.service');

const userService = new UserService();

// En este caso el username es el email enviado.
const LocalStrategy = new Strategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      
      const user = await userService.findByEmail(email);
      if (!user) {
        done(boom.unauthorized('UNAUTHORIZED'), false);
      }
     
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        done(boom.unauthorized('UNAUTHORIZED'), false);
      }

      delete user.dataValues.password;
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  });

module.exports = LocalStrategy;
