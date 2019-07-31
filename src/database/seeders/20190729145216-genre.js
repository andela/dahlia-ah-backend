export const up = queryInterface => queryInterface.bulkInsert('Genres', [{
  name: 'action',
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  name: 'thriller',
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  name: 'romance',
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  name: 'fiction',
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  name: 'motivational',
  createdAt: new Date(),
  updatedAt: new Date()
}
], {});

export const down = queryInterface => queryInterface.bulkDelete('Genres', null, {});
