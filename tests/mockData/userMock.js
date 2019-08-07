
export default {
  invalidEmail: {
    firstName: 'john',
    lastName: 'joe',
    username: 'joe22',
    password: 'password2',
    email: 'invalid'
  },
  emptyEmail: {
    firstName: 'john',
    lastName: 'joe',
    username: 'joe22',
    password: 'password2',
    email: ''
  },
  validUser: {
    firstName: 'john',
    lastName: 'joe',
    username: 'joe22',
    password: 'password2',
    email: 'doe@gmail.com'
  },
  novelUser: {
    firstName: 'john',
    lastName: 'novel',
    username: 'novelist',
    password: 'password',
    email: 'novel@gmail.com'
  },
  invalidFirstName: {
    firstName: 'john77***99he**J',
    lastName: 'joe',
    username: 'joe22',
    password: 'password2',
    email: 'doe@gmail.com'
  },
  emptyFirstName: {
    firstName: ' ',
    lastName: 'joe',
    username: 'joe22',
    password: 'password2',
    email: 'doe@gmail.com'
  },
  invalidLastName: {
    firstName: 'john',
    lastName: 'joer556$#$%%5',
    username: 'joe22',
    password: 'password2',
    email: 'doe@gmail.com'
  },
  emptyLastName: {
    firstName: 'john',
    lastName: '',
    username: 'joe22',
    password: 'password2',
    email: 'doe@gmail.com'
  },
  invalidUserName: {
    firstName: 'john',
    lastName: 'doe',
    username: 'joe22_%^^^&&',
    password: 'password2',
    email: 'doe@gmail.com'
  },
  emptyUserName: {
    firstName: 'john',
    lastName: 'doe',
    username: '',
    password: 'password2',
    email: 'doe@gmail.com'
  },
  invalidPassword: {
    firstName: 'john',
    lastName: 'doe',
    username: 'joe22',
    password: 'password2+=#$',
    email: 'doe@gmail.com'
  },
  emptyPassword: {
    firstName: 'john',
    lastName: 'doe',
    username: 'doe22',
    password: '',
    email: 'doe@gmail.com'
  },
  validUser2: {
    firstName: 'Annie',
    lastName: 'Skywalker',
    username: 'Vader',
    email: 'lordvader@order66.com',
    password: 'Password'
  },
  duplicateEmail: {
    firstName: 'Hondo',
    lastName: 'Onaka',
    username: 'ThePirate',
    email: 'lordvader@order66.com',
    password: 'Password'
  },
  duplicateUsername: {
    firstName: 'Hondo',
    lastName: 'Onaka',
    username: 'Vader',
    email: 'hondod@pirate.com',
    password: 'Password'
  },
  forgotPasswordEmail: {
    email: 'eden@gmail.com'
  },
  wrongForgotPasswordEmail: {
    email: 'example@gmail.com'
  },
  seededUser1: {
    firstName: 'Eden',
    lastName: 'Hazard',
    email: 'eden@gmail.com',
    username: 'eden101',
    password: 'edenHazard',
    bio: 'I am the best author in the world'
  },
  seededUser2: {
    email: 'eden@gmail.com',
    password: 'edenHazargd',
  }
};
