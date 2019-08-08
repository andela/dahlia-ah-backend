import bcrypt from 'bcrypt';

export const up = queryInterface => queryInterface.bulkInsert('Users', [{
  id: '122a0d86-8b78-4bb8-b28f-8e5f7811c456',
  firstName: 'Eden',
  lastName: 'Hazard',
  email: 'eden@gmail.com',
  username: 'eden101',
  password: bcrypt.hashSync('edenHazard', 10),
  bio: 'I am the best author in the world',
  avatarUrl: null,
  phoneNo: null,
  isVerified: true,
  isSubscribed: true,
  paymentStatus: true,
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  id: 'fb94de4d-47ff-4079-89e8-b0186c0a3be8',
  firstName: 'James',
  lastName: 'Bond',
  email: 'jamesbond@gmail.com',
  username: 'JB007',
  password: bcrypt.hashSync('jamesBond', 10),
  bio: 'My name is James, James Bond',
  avatarUrl: null,
  phoneNo: null,
  isVerified: true,
  isSubscribed: false,
  paymentStatus: true,
  createdAt: new Date(),
  updatedAt: new Date()
}], {});
export const down = queryInterface => queryInterface.bulkDelete('Users', {
  email: 'eden@gmail.com',
});
