export const up = (queryInterface, Sequelize) => queryInterface.addColumn(
  'Novels',
  'isBanned',
  {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
);

export const down = queryInterface => queryInterface.removeColumn(
  'Novels',
  'isBanned',
);
