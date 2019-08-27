const novelId1 = '7f45df6d-7003-424f-86ec-1e2b36e2fd14';
const novelId2 = '8bd8c0ec-3b50-4228-bb71-e617c7b8d3b5';
const userId1 = '122a0d86-8b78-4bb8-b28f-8e5f7811c456';

export const up = queryInterface => queryInterface.bulkInsert('Bookmarks', [{
  id: 'd54d5aaa-f843-4cb1-b725-8cf6b9ea1a39',
  userId: userId1,
  novelId: novelId1,
  createdAt: new Date(),
  updatedAt: new Date()
}, {
  id: 'bd450c18-8484-4c1a-b124-384c097c2297',
  userId: userId1,
  novelId: novelId2,
  createdAt: new Date(),
  updatedAt: new Date()
}], {});
export const down = queryInterface => queryInterface.bulkDelete('Bookmarks', null, {});
