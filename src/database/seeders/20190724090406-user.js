export const up = queryInterface => queryInterface.bulkInsert('Users', [{
  username: 'ukhuseven',
  createdAt: new Date(),
  updatedAt: new Date()
}], {});
export const down = queryInterface => queryInterface.bulkDelete('Users', null, {});
