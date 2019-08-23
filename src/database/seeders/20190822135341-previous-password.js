import bcrypt from 'bcrypt';

export const up = queryInterface => queryInterface.bulkInsert('PreviousPasswords', [{
  id: 'd0bd6342-3188-4c49-9980-eb8fe7c77b83',
  userId: '11fb0350-5b46-4ace-9a5b-e3b788167915',
  password: bcrypt.hashSync('pogba1234', 10),
  passwordCount: 1,
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  id: 'd5347c0c-cba2-46a6-abb2-69c68ce928fe',
  userId: '11fb0350-5b46-4ace-9a5b-e3b788167915',
  password: bcrypt.hashSync('lionel1234', 10),
  passwordCount: 2,
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  id: '88f5b93b-b408-454c-bf30-4abb590db6ba',
  userId: '11fb0350-5b46-4ace-9a5b-e3b788167915',
  password: bcrypt.hashSync('ronaldo1234', 10),
  passwordCount: 3,
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  id: 'e87df52f-080b-4d9d-8e35-0a8f645ab390',
  userId: '11fb0350-5b46-4ace-9a5b-e3b788167915',
  password: bcrypt.hashSync('mason1234', 10),
  passwordCount: 4,
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  id: 'b93e45ff-dab8-4f64-894e-862d174f8416',
  userId: '11fb0350-5b46-4ace-9a5b-e3b788167915',
  password: bcrypt.hashSync('lampard1234', 10),
  passwordCount: 5,
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  id: '95dda745-8efa-4342-8ef7-02f80bda1add',
  userId: '8487ef08-2ac2-4387-8bd6-738b12c75dff',
  password: bcrypt.hashSync('bakayoko1234', 10),
  passwordCount: 1,
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  id: '9722da61-1c7a-4041-b934-976cef877ddf',
  userId: '8487ef08-2ac2-4387-8bd6-738b12c75dff',
  password: bcrypt.hashSync('drinkwater1234', 10),
  passwordCount: 2,
  createdAt: new Date(),
  updatedAt: new Date()
}], {});
export const down = queryInterface => queryInterface.bulkDelete('PreviousPasswords', null, {});
