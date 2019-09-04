export const up = queryInterface => queryInterface.bulkInsert('Genres', [{
  id: 'da86915a-6d4d-455f-8b44-5c4b8221ebf6',
  name: 'action',
  coverImgUrl: 'https://res.cloudinary.com/allebd/image/upload/v1567555891/dahlia/back5unsplash.jpg',
  themeColor: '#b80f0a',
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  id: 'ceb59aa0-b10d-4f37-a0d5-925b38876db4',
  name: 'thriller',
  coverImgUrl: 'https://res.cloudinary.com/allebd/image/upload/v1567555883/dahlia/back9unsplash.jpg',
  themeColor: '#db0000',
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  id: 'ffe299b9-889b-4ad3-86cf-138cd57d5aab',
  name: 'romance',
  coverImgUrl: 'https://res.cloudinary.com/allebd/image/upload/v1567555878/dahlia/back6unsplash.jpg',
  themeColor: '#e5579b',
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  id: 'e4427fcd-d1dd-480d-98a6-bb08d5e4d4aa',
  name: 'fiction',
  coverImgUrl: 'https://res.cloudinary.com/allebd/image/upload/v1567555884/dahlia/back7unsplash.jpg',
  themeColor: '#fce205',
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  id: '09add0fe-d063-48ce-8e18-0dc590d04dcf',
  name: 'motivational',
  coverImgUrl: 'https://res.cloudinary.com/allebd/image/upload/v1567555876/dahlia/back3unsplash.jpg',
  themeColor: '#111e6c',
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  id: 'b637853a-fe66-4bf7-8b30-eeae972b1a3b',
  name: 'horror',
  coverImgUrl: 'https://res.cloudinary.com/allebd/image/upload/v1567555877/dahlia/back8unsplash.jpg',
  themeColor: '#fe2020',
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  id: '8d8e24bf-a18c-4256-b0fa-8678ecc7a7c1',
  name: 'memoir',
  coverImgUrl: 'https://res.cloudinary.com/allebd/image/upload/v1567555878/dahlia/back2unsplash.jpg',
  themeColor: '#f9a602',
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  id: '01b9ee31-2e24-4e71-afe0-7b5e37f67a36',
  name: 'drama',
  coverImgUrl: 'https://res.cloudinary.com/allebd/image/upload/v1567555877/dahlia/back1unsplash.jpg',
  themeColor: '#4c9a2a',
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  id: 'bf073c64-7244-43d2-ab12-81e716b65680',
  name: 'sci-fi',
  coverImgUrl: 'https://res.cloudinary.com/allebd/image/upload/v1567555883/dahlia/back11unsplash.jpg',
  themeColor: '#797979',
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  id: '295ad5d3-f0f3-4609-82f1-85b71b05b0f9',
  name: 'fantasy',
  coverImgUrl: 'https://res.cloudinary.com/allebd/image/upload/v1567555877/dahlia/back4unsplash.jpg',
  themeColor: '#df5286',
  createdAt: new Date(),
  updatedAt: new Date()
},

{
  id: '8e1d4ee7-8a58-46a3-b47f-98cd481f2ad3',
  name: 'mystery',
  coverImgUrl: 'https://res.cloudinary.com/allebd/image/upload/v1567555882/dahlia/back10unsplash.jpg',
  themeColor: '#000008',
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  id: '918f192d-f20b-423f-8e80-8120f336a9f0',
  name: 'history',
  coverImgUrl: 'https://res.cloudinary.com/drlcfqzym/image/upload/v1567083948/claire-rodahaver-o1Sc5VXglNI-unsplash.jpg',
  themeColor: '#fedc56',
  createdAt: new Date(),
  updatedAt: new Date()
}], {});

export const down = queryInterface => queryInterface.bulkDelete('Genres', null, {});
