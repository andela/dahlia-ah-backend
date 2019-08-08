export const up = queryInterface => queryInterface.bulkInsert('Novels', [{
  id: '7f45df6d-7003-424f-86ec-1e2b36e2fd14',
  title: 'hancock',
  description: 'A',
  slug: 'hancock',
  body: 'abcd',
  genreId: 'ffe299b9-889b-4ad3-86cf-138cd57d5aab',
  authorId: '122a0d86-8b78-4bb8-b28f-8e5f7811c456',
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  id: '8bd8c0ec-3b50-4228-bb71-e617c7b8d3b5',
  title: 'bancock',
  description: 'A',
  slug: 'bancock',
  body: 'abcd',
  genreId: 'ffe299b9-889b-4ad3-86cf-138cd57d5aab',
  authorId: '122a0d86-8b78-4bb8-b28f-8e5f7811c456',
  createdAt: new Date(),
  updatedAt: new Date()
}], {});

export const down = queryInterface => queryInterface.bulkDelete('Roles', null, {});
