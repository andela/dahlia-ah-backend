export const up = queryInterface => queryInterface.bulkInsert('CommentHistories', [{
  id: 'b984fb1d-faa8-43aa-bfcd-b7e27a94342c',
  commentBody: 'This is novel is so nice',
  commentId: '6a7b986e-1102-4e9a-83b0-cad7df993e1c',
  createdAt: new Date(),
  updatedAt: new Date()
}, {
  id: '057477bc-5f50-447e-90d9-e3e39e24da5f',
  commentBody: 'Yeah I think the same',
  commentId: '6a7b986e-1102-4e9a-83b0-cad7df993e1c',
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  id: 'b4a15d61-669c-4bad-b9b7-8b5b7afa8106',
  commentBody: 'No I do not think so',
  commentId: 'b84f246f-ba18-4f83-876d-145be90b494d',
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  id: 'be145307-1763-459f-8ea0-aff7bf84a078',
  commentBody: '',
  commentId: 'b84f246f-ba18-4f83-876d-145be90b494d',
  createdAt: new Date(),
  updatedAt: new Date()
}], {});
export const down = queryInterface => queryInterface.bulkDelete('CommentHistories', null, {});
