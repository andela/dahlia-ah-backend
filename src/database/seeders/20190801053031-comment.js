export const up = queryInterface => queryInterface.bulkInsert('Comments', [{
  commentBody: 'This is novel is so nice',
  userId: 1,
  novelId: 1,
  parentId: null,
  createdAt: new Date(),
  updatedAt: new Date()
}, {
  commentBody: 'Yeah I think the same',
  userId: 1,
  novelId: null,
  parentId: 1,
  createdAt: new Date(),
  updatedAt: new Date()
}], {});
export const down = queryInterface => queryInterface.bulkDelete('Comments', null, {});
