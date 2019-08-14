export default {
  invalidEmail: {
    firstName: 'john',
    lastName: 'joe',
    password: 'password2',
    email: 'invalid'
  },
  emptyEmail: {
    firstName: 'john',
    lastName: 'joe',
    password: 'password2',
    email: ''
  },
  validUser: {
    firstName: 'john',
    lastName: 'joe',
    password: 'password2',
    email: 'doe@gmail.com'
  },
  novelUser: {
    firstName: 'john',
    lastName: 'novel',
    password: 'password',
    email: 'novel@gmail.com'
  },
  invalidFirstName: {
    firstName: 'john77***99he**J',
    lastName: 'joe',
    password: 'password2',
    email: 'doe@gmail.com'
  },
  emptyFirstName: {
    firstName: ' ',
    lastName: 'joe',
    password: 'password2',
    email: 'doe@gmail.com'
  },
  invalidLastName: {
    firstName: 'john',
    lastName: 'joer556$#$%%5',
    password: 'password2',
    email: 'doe@gmail.com'
  },
  emptyLastName: {
    firstName: 'john',
    lastName: '',
    password: 'password2',
    email: 'doe@gmail.com'
  },
  invalidPassword: {
    firstName: 'john',
    lastName: 'doe',
    password: 'password2+=#$',
    email: 'doe@gmail.com'
  },
  emptyPassword: {
    firstName: 'john',
    lastName: 'doe',
    password: '',
    email: 'doe@gmail.com'
  },
  validUser2: {
    firstName: 'Annie',
    lastName: 'Skywalker',
    email: 'lordvader@order66.com',
    password: 'Password'
  },
  duplicateEmail: {
    firstName: 'Hondo',
    lastName: 'Onaka',
    email: 'lordvader@order66.com',
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
    password: 'edenHazard',
    bio: 'I am the best author in the world'
  },
  seededUser2: {
    email: 'eden@gmail.com',
    password: 'edenHazargd'
  },
  validProfileLogin: {
    email: 'jamesbond@gmail.com',
    password: 'jamesbond'
  }
};
