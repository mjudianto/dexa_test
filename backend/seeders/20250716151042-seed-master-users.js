'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword1 = await bcrypt.hash('adminPassword', 10);
    const hashedPassword2 = await bcrypt.hash('userPassword1', 10);
    const hashedPassword3 = await bcrypt.hash('userPassword2', 10);

    await queryInterface.bulkInsert('master_user', [
      {
        id: 1,
        name: 'Admin User',
        email: 'admin@dexagroup.com',
        phone_number: '0000000000',
        position_id: 1,
        profile_picture: null,
        password: hashedPassword1,
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        phone_number: '1234567890',
        position_id: 2,
        profile_picture: 'alice.jpg',
        password: hashedPassword2,
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Bob Smith',
        email: 'bob@example.com',
        phone_number: '9876543210',
        position_id: 3,
        profile_picture: 'bob.jpg',
        password: hashedPassword3,
        created_by: 1,
        updated_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('master_user', null, {});
  }
};
