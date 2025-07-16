'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('master_user', [
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        phone_number: '1234567890',
        position_id: 1, // Assuming position_id = 1 exists
        profile_picture: 'alice.jpg',
        password: 'hashed_password_1' // Replace with a real hash in production
      },
      {
        name: 'Bob Smith',
        email: 'bob@example.com',
        phone_number: '9876543210',
        position_id: 2,
        profile_picture: 'bob.jpg',
        password: 'hashed_password_2'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('master_user', null, {});
  }
};
