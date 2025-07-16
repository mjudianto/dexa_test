'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('master_attendance', [
      {
        user_id: 1,
        check_in: new Date('2025-07-16T08:00:00'),
        check_out: new Date('2025-07-16T17:00:00')
      },
      {
        user_id: 2,
        check_in: new Date('2025-07-16T09:00:00'),
        check_out: new Date('2025-07-16T18:00:00')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('master_attendance', null, {});
  }
};
