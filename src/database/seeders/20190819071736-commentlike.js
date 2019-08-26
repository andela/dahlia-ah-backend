export const up = queryInterface => queryInterface.bulkInsert('CommentLikes', [{
  id: '42f20078-9e37-4bb2-8b53-f4eba5b6456e',
  userId: 'be84f364-36fd-466d-a892-54dee6cc09d7',
  commentId: '6a7b986e-1102-4e9a-83b0-cad7df993e1c',
  createdAt: new Date(),
  updatedAt: new Date()
}, {
  id: '34ff4237-d579-478e-b10f-01862eb2cfe3',
  userId: 'be84f364-36fd-466d-a892-54dee6cc09d7',
  commentId: 'b84f246f-ba18-4f83-876d-145be90b494d',
  createdAt: new Date(),
  updatedAt: new Date()
}, {
  id: '279fad7c-abc0-48f8-a637-0e3c97d87c9a',
  userId: 'fb94de4d-47ff-4079-89e8-b0186c0a3be8',
  commentId: 'b84f246f-ba18-4f83-876d-145be90b494d',
  createdAt: new Date(),
  updatedAt: new Date()
}], {});
export const down = queryInterface => queryInterface.bulkDelete('CommentLikes', null, {});
