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
  getUser: {
    firstName: 'john',
    lastName: 'snow',
    username: 'knows',
    password: 'password',
    email: 'snow@gmail.com'
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
  validUser3: {
    firstName: 'Annie',
    lastName: 'Skywalker',
    email: 'lordvadser@order66.com',
    password: 'Password'
  },
  duplicateEmail: {
    firstName: 'Hondo',
    lastName: 'Onaka',
    email: 'lordvader@order66.com',
    password: 'Password'
  },
  forgotPasswordEmail: {
    email: 'lordvader@order66.com'
  },
  wrongForgotPasswordEmail: {
    email: 'example@gmail.com'
  },
  wrongCurrentPassword: {
    currentPassword: 'abcdefgh',
    newPassword: 'newnewnewnew'
  },
  sameCurentAndNewPassword: {
    currentPassword: 'newnewnewnew',
    newPassword: 'newnewnewnew'
  },
  usingPreviousPassword: {
    currentPassword: 'newnewnewnew',
    newPassword: 'richardCroft'
  },
  userWithoutPreviousPassword: {
    currentPassword: 'williamsBrook',
    newPassword: 'willywilly'
  },
  withoutFivePreviousPassword: {
    currentPassword: 'bruceClifford',
    newPassword: 'bigBruce'
  },
  validChangePasswordInput: {
    currentPassword: 'richardCroft',
    newPassword: 'newnewnewnew'
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
  seededUser3: {
    email: 'jamesbond@gmail.com',
    password: 'jamesbond'
  },
  seededUser4: {
    email: 'jamiefoxx@gmail.com',
    password: 'jamiefoxx'
  },
  seededUser5: {
    email: 'zendaya@gmail.com',
    password: 'zendaya'
  },
  validProfileLogin: {
    email: 'jamesbond@gmail.com',
    password: 'jamesbond'
  },
  validProfile: {
    firstName: 'james',
    lastName: 'bonder',
    avatarUrl: 'https://gravatar.com/avatar/aed61baf1e9256ed7d70e2cbbfcba9aa?s=400&d=robohash&r=x',
    bio: 'I like acting movies only',
    phoneNo: '2347032123007',
  },
  invalidProfile1: {
    password: 'password',
    firstName: 'james',
    lastName: 'bonder',
    avatarUrl: 'https://gravatar.com/avatar/aed61baf1e9256ed7d70e2cbbfcba9aa?s=400&d=robohash&r=x',
    bio: 'I like acting movies only',
    phoneNo: '2347032123007',
  },
  invalidProfile2: {
    firstName: '1232'
  },
  invalidProfile3: {
    title: '1232',
    description: 'just testing'
  },
  invalidProfileToken: {
    expiredToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNTY0ODA0NDQ3LCJleHAiOjE1NjQ3NzkyNDd9.778heTKCI1eFw47SVT2rZLcBoBnTB4rD5wDacVzT3Kw'
  },
  validReaderProfileLogin: {
    email: 'jamiefoxx@gmail.com',
    password: 'jamiefoxx'
  },
  seededUser: {
    id: 'fb94de4d-47ff-4079-89e8-b0186c0a3be8',
    email: 'jamesbond@gmail.com',
    password: 'jamesbond'
  },
  seededSuperAdmin: {
    firstName: 'Sheev',
    lastName: 'Palpatine',
    email: 'theemperor@empire.com',
    password: 'theEmperor'
  },
  newUserByAdmin: {
    firstName: 'Maul',
    lastName: 'Maul',
    email: 'darthmaul@empire.com',
    password: 'darthmaul',
    roleName: 'admin'
  },
  newUser2ByAdmin: {
    firstName: 'Savage',
    lastName: 'Opress',
    email: 'savage@empire.com',
    password: 'savageopress',
    roleName: 'reader'
  }
};
