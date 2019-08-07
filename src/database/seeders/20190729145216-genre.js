export const up = queryInterface => queryInterface.bulkInsert('Genres', [{
  id: 'da86915a-6d4d-455f-8b44-5c4b8221ebf6',
  name: 'action',
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  id: 'ceb59aa0-b10d-4f37-a0d5-925b38876db4',
  name: 'thriller',
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  id: 'ffe299b9-889b-4ad3-86cf-138cd57d5aab',
  name: 'romance',
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  id: 'e4427fcd-d1dd-480d-98a6-bb08d5e4d4aa',
  name: 'fiction',
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  id: '09add0fe-d063-48ce-8e18-0dc590d04dcf',
  name: 'motivational',
  createdAt: new Date(),
  updatedAt: new Date()
}
], {});

export const down = queryInterface => queryInterface.bulkDelete('Genres', null, {});
