import bcrypt from 'bcrypt';

export const up = queryInterface => queryInterface.bulkInsert('PreviousPasswords', [{
  id: '7c7a5ec0-7e7d-4b25-afb7-90bb7406a4ee',
  userId: 'ffd2e717-a092-4dc0-9d81-b50e2f1226e2',
  password: bcrypt.hashSync('edenHazard', 10),
  passwordCount: 1,
  createdAt: new Date(),
  updatedAt: new Date()
}, {
  id: '122cc822-3337-4efa-a5ca-adb7e84dbb9c',
  userId: 'ffd2e717-a092-4dc0-9d81-b50e2f1226e2',
  password: bcrypt.hashSync('edenHazarz', 10),
  passwordCount: 3,
  createdAt: new Date(),
  updatedAt: new Date()
}, {
  id: '4509557b-d7cd-4c57-a78d-8c2ec15baef1',
  userId: 'ffd2e717-a092-4dc0-9d81-b50e2f1226e2',
  password: bcrypt.hashSync('edenHazarb', 10),
  passwordCount: 2,
  createdAt: new Date(),
  updatedAt: new Date()
}, {
  id: 'e04a1223-0675-4317-9ca3-18c23d5cd7d8',
  userId: 'ffd2e717-a092-4dc0-9d81-b50e2f1226e2',
  password: bcrypt.hashSync('edenHazark', 10),
  passwordCount: 4,
  createdAt: new Date(),
  updatedAt: new Date()
}, {
  id: '07526b44-afca-43ab-b9da-c9e845eb973a',
  userId: 'ffd2e717-a092-4dc0-9d81-b50e2f1226e2',
  password: bcrypt.hashSync('edenHazarky', 10),
  passwordCount: 5,
  createdAt: new Date(),
  updatedAt: new Date()
}, {
  id: 'a67c151a-f01c-4d86-b665-d17be1760b19',
  userId: '857cb13a-8437-4e8e-bf7a-468c619a9af3',
  password: bcrypt.hashSync('edenHazarky', 10),
  passwordCount: 1,
  createdAt: new Date(),
  updatedAt: new Date()
}], {});

export const down = queryInterface => queryInterface.bulkDelete('PreviousPasswords', null, {});
