export const up = queryInterface => queryInterface.bulkInsert('Followers', [{
  id: 'dffde558-94ee-4c05-b04b-50dc72a226ef',
  followeeId: '122a0d86-8b78-4bb8-b28f-8e5f7811c456',
  followerId: 'fb94de4d-47ff-4079-89e8-b0186c0a3be8',
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  id: '8c10699b-762f-4dee-adb2-b7a632d2a237',
  followeeId: '122a0d86-8b78-4bb8-b28f-8e5f7811c456',
  followerId: 'ce87299b-0dfa-44ed-bb53-45d434647eb2',
  createdAt: new Date(),
  updatedAt: new Date()
}], {});
export const down = queryInterface => queryInterface.bulkDelete('Followers', null, {});
