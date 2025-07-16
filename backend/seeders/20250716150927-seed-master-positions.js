'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('master_position', [
      {
        description: 'Manager',
        level: 'Senior',
        division: 'Sales'
      },
      {
        description: 'Developer',
        level: 'Mid',
        division: 'IT'
      },
      {
        description: 'HR Officer',
        level: 'Junior',
        division: 'Human Resources'
      },
      {
        description: 'Designer',
        level: 'Mid',
        division: 'Creative'
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('master_position', null, {});
  }
};
