
const userMock = {
  invalidEmail: {
    firstName: 'john',
    lastName: 'joe',
    userName: 'joe22',
    password: 'password2',
    email: 'invalid'
  },
  emptyEmail: {
    firstName: 'john',
    lastName: 'joe',
    userName: 'joe22',
    password: 'password2',
    email: ''
  },
  validUser: {
    firstName: 'john',
    lastName: 'joe',
    userName: 'joe22',
    password: 'password2',
    email: 'doe@gmail.com'
  },
  invalidFirstName: {
    firstName: 'john77***99he**J',
    lastName: 'joe',
    userName: 'joe22',
    password: 'password2',
    email: 'doe@gmail.com'
  },
  emptyFirstName: {
    firstName: ' ',
    lastName: 'joe',
    userName: 'joe22',
    password: 'password2',
    email: 'doe@gmail.com'
  },
  invalidLastName: {
    firstName: 'john',
    lastName: 'joer556$#$%%5',
    userName: 'joe22',
    password: 'password2',
    email: 'doe@gmail.com'
  },
  emptyLastName: {
    firstName: 'john',
    lastName: '',
    userName: 'joe22',
    password: 'password2',
    email: 'doe@gmail.com'
  },
  invalidUserName: {
    firstName: 'john',
    lastName: 'doe',
    userName: 'joe22_%^^^&&',
    password: 'password2',
    email: 'doe@gmail.com'
  },
  emptyUserName: {
    firstName: 'john',
    lastName: 'doe',
    userName: '',
    password: 'password2',
    email: 'doe@gmail.com'
  },
  invalidPassword: {
    firstName: 'john',
    lastName: 'doe',
    userName: 'joe22',
    password: 'password2+=#$',
    email: 'doe@gmail.com'
  },
  emptyPassword: {
    firstName: 'john',
    lastName: 'doe',
    userName: 'doe22',
    password: '',
    email: 'doe@gmail.com'
  },
};

export default userMock;
