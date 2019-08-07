export const up = queryInterface => queryInterface.bulkInsert('Likes', [{
  id: '3fd8e8ff-38cc-4cc5-b67a-0c40dee8f6fb',
  userId: 'ce87299b-0dfa-44ed-bb53-45d434647eb2',
  novelId: '7f45df6d-7003-424f-86ec-1e2b36e2fd14',
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  id: '47df283b-40bf-4c25-9a5c-15792561a9a9',
  userId: '20eacfca-0fe5-4833-862c-0263dfbf66e5',
  novelId: '7f45df6d-7003-424f-86ec-1e2b36e2fd14',
  createdAt: new Date(),
  updatedAt: new Date()
}], {});
export const down = queryInterface => queryInterface.bulkDelete('Likes', null, {});
