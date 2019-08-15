import bcrypt from 'bcrypt';

export const up = queryInterface => queryInterface.bulkInsert('Users', [{
  id: '122a0d86-8b78-4bb8-b28f-8e5f7811c456',
  firstName: 'Eden',
  lastName: 'Hazard',
  email: 'eden@gmail.com',
  password: bcrypt.hashSync('edenHazard', 10),
  bio: 'I am the best author in the world',
  avatarUrl: null,
  phoneNo: null,
  isVerified: true,
  isSubscribed: true,
  roleId: 'f2dec928-1ff9-421a-b77e-8998c8e2e720',
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  id: 'fb94de4d-47ff-4079-89e8-b0186c0a3be8',
  firstName: 'James',
  lastName: 'Bond',
  email: 'jamesbond@gmail.com',
  password: bcrypt.hashSync('jamesbond', 10),
  bio: 'My name is James, James Bond',
  avatarUrl: null,
  phoneNo: null,
  isVerified: true,
  isSubscribed: false,
  roleId: 'f2dec928-1ff9-421a-b77e-8998c8e2e720',
  createdAt: new Date(),
  updatedAt: new Date()
}, {
  id: '0ce36391-2c08-4703-bddb-a4ea8cccbbc5',
  firstName: 'jamie',
  lastName: 'foxx',
  email: 'jamiefoxx@gmail.com',
  password: bcrypt.hashSync('jamiefoxx', 10),
  avatarUrl: '',
  bio: 'I am a writer, and i have authored 5 best selling books',
  phoneNo: '2347032123404',
  isVerified: true,
  isSubscribed: false,
  roleId: 'b79c4eed-60c6-42fb-9040-f0822d8414fa',
  createdAt: new Date(),
  updatedAt: new Date()
}], {});
export const down = queryInterface => queryInterface.bulkDelete('Users', null, {});
