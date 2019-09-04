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
},
{
  id: '996eb0ff-16fe-48d4-b1d9-06308def8291',
  userId: '122a0d86-8b78-4bb8-b28f-8e5f7811c456',
  novelId: '10d42194-2ea2-4c90-aef2-043421952220',
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  id: 'a054422b-9abf-4b53-8ba8-4e2ce7b87d06',
  userId: 'fb94de4d-47ff-4079-89e8-b0186c0a3be8',
  novelId: '10d42194-2ea2-4c90-aef2-043421952220',
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  id: '52320861-74af-4525-902f-a0d6a9444ea2',
  userId: '20eacfca-0fe5-4833-862c-0263dfbf66e5',
  novelId: '10d42194-2ea2-4c90-aef2-043421952220',
  createdAt: new Date(),
  updatedAt: new Date()
}], {});
export const down = queryInterface => queryInterface.bulkDelete('Likes', null, {});
