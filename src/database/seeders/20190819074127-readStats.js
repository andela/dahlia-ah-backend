const novelId1 = '7f45df6d-7003-424f-86ec-1e2b36e2fd14';
const novelId2 = '8bd8c0ec-3b50-4228-bb71-e617c7b8d3b5';
const userId1 = '122a0d86-8b78-4bb8-b28f-8e5f7811c456';
const userId2 = '0ce36391-2c08-4703-bddb-a4ea8cccbbc5';
const now = Date.now();
const currentDate = new Date(null);
const daysToDate = days => parseInt(currentDate.setTime(now - (86400 * 1000 * days)), 10);

const tenDays = daysToDate(10);
const twentyDays = daysToDate(20);
const thirtyOneDays = daysToDate(31);


export const up = queryInterface => queryInterface.bulkInsert('readStats', [{
  id: '55868c7c-1fc7-483b-b535-39f2496c2adc',
  userId: userId1,
  novelId: novelId1,
  createdAt: new Date(tenDays),
  updatedAt: new Date()
}, {
  id: '3853f342-71c6-473a-b545-fa4bb4fb43fb',
  userId: userId1,
  novelId: novelId2,
  createdAt: new Date(twentyDays),
  updatedAt: new Date()
}, {
  id: '48b9e5b8-1ade-4e62-ae78-fcfaa4d79132',
  userId: userId2,
  novelId: novelId1,
  createdAt: new Date(thirtyOneDays),
  updatedAt: new Date()
}], {});
export const down = queryInterface => queryInterface.bulkDelete('readStats', null, {});
