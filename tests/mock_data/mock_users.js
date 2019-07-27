const mockUsers = {
  validDetails: {
    firstname: 'Annie',
    lastname: 'Skywalker',
    username: 'Vader',
    email: 'lordvader@order66.com',
    password: 'Password'
  },
  validDetail2: {
    firstname: 'Luke',
    lastname: 'Skywalker',
    username: 'Marcos',
    email: 'korlmarcos@dforce.com',
    password: 'Password'
  },
  duplicateEmail: {
    firstname: 'Hondo',
    lastname: 'Onaka',
    username: 'ThePirate',
    email: 'lordvader@order66.com',
    password: 'Password'
  },
  duplicateUsername: {
    firstname: 'Hondo',
    lastname: 'Onaka',
    username: 'Vader',
    email: 'hondod@pirate.com',
    password: 'Password'
  }
};

mockUsers.correctLogin = {
  email: mockUsers.validDetail2.email,
  password: mockUsers.validDetail2.password
};

export default mockUsers;
