export const up = queryInterface => queryInterface.bulkInsert('Reports', [{
  id: '67a68419-405a-45e6-8d4f-cb00cbff7a64',
  userId: '122a0d86-8b78-4bb8-b28f-8e5f7811c456',
  novelId: '7f45df6d-7003-424f-86ec-1e2b36e2fd14',
  type: 'general',
  body: 'i hate this novel',
  createdAt: new Date(),
  updatedAt: new Date()
},
], {});

export const down = queryInterface => queryInterface.bulkDelete('Reports', null, {});
