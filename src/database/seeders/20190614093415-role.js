export const up = queryInterface => queryInterface.bulkInsert('Roles', [{
  id: 'b79c4eed-60c6-42fb-9040-f0822d8414fa',
  roleName: 'reader',
  createdAt: new Date(),
  updatedAt: new Date()
}, {
  id: 'f2dec928-1ff9-421a-b77e-8998c8e2e720',
  roleName: 'author',
  createdAt: new Date(),
  updatedAt: new Date()
}, {
  id: '38a10a21-a56e-4ba2-b17c-e7dfb11c1602',
  roleName: 'admin',
  createdAt: new Date(),
  updatedAt: new Date()
}, {
  id: '2c4dfb3f-1798-43d4-8eb6-1c125994a263',
  roleName: 'superadmin',
  createdAt: new Date(),
  updatedAt: new Date()
}], {});
export const down = queryInterface => queryInterface.bulkDelete('Roles', null, {});
