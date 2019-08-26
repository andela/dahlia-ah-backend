export const up = queryInterface => queryInterface.bulkInsert('Comments', [{
  id: '6a7b986e-1102-4e9a-83b0-cad7df993e1c',
  commentBody: 'This is novel is so nice',
  userId: '122a0d86-8b78-4bb8-b28f-8e5f7811c456',
  novelId: '7f45df6d-7003-424f-86ec-1e2b36e2fd14',
  parentId: null,
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  id: 'b84f246f-ba18-4f83-876d-145be90b494d',
  commentBody: 'Yeah I think the same',
  userId: '122a0d86-8b78-4bb8-b28f-8e5f7811c456',
  novelId: null,
  parentId: '6a7b986e-1102-4e9a-83b0-cad7df993e1c',
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  id: '5de099c5-22d4-4e88-885b-1fd7374d7d5c',
  commentBody: 'fresh like today bread',
  userId: '122a0d86-8b78-4bb8-b28f-8e5f7811c456',
  novelId: '7f45df6d-7003-424f-86ec-1e2b36e2fd14',
  parentId: null,
  createdAt: new Date(),
  updatedAt: new Date()
}, {
  id: '8a97e8da-78a6-4352-b32b-7e033bffb664',
  commentBody: 'Yeah I think the same too',
  userId: 'be84f364-36fd-466d-a892-54dee6cc09d7',
  novelId: null,
  parentId: '6a7b986e-1102-4e9a-83b0-cad7df993e1c',
  createdAt: new Date(),
  updatedAt: new Date()
}], {});
export const down = queryInterface => queryInterface.bulkDelete('Comments', null, {});
