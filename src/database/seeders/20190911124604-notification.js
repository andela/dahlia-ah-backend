export const up = queryInterface => queryInterface.bulkInsert('Notifications', [{
  id: 'f83238c9-258f-4c38-a548-5c939a7fdf22',
  notificationObjectId: 'aeab6e66-b8e9-4045-803a-92eced0c56db',
  notifierId: '122a0d86-8b78-4bb8-b28f-8e5f7811c456',
  isRead: false,
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  id: 'f48e79ba-3363-4305-aba2-1c720f505815',
  notificationObjectId: 'aeab6e66-b8e9-4045-803a-92eced0c56db',
  notifierId: 'ce87299b-0dfa-44ed-bb53-45d434647eb2',
  isRead: false,
  createdAt: new Date(),
  updatedAt: new Date()
}], {});
export const down = queryInterface => queryInterface.bulkDelete('Notifications', null, {});
