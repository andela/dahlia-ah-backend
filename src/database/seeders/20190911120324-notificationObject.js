export const up = queryInterface => queryInterface.bulkInsert('NotificationObjects', [{
  id: 'aeab6e66-b8e9-4045-803a-92eced0c56db',
  entityId: 'a00bbeaf-b91e-4986-a3fd-485457b00436',
  actorId: '11fb0350-5b46-4ace-9a5b-e3b788167915',
  entityTypeId: 0,
  createdAt: new Date(),
  updatedAt: new Date()
}], {});
export const down = queryInterface => queryInterface.bulkDelete('NotificationObjects', null, {});
