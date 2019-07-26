import bcrypt from 'bcrypt';

export const up = queryInterface => queryInterface.bulkInsert('Users', [{
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
  roleId: 1,
  createdAt: new Date(),
  updatedAt: new Date()
}], {});
export const down = queryInterface => queryInterface.bulkDelete('Users', null, {});
