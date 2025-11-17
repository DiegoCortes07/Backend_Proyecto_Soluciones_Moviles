'use strict';

export async function up(queryInterface, Sequelize) {

  return queryInterface.bulkInsert('user', [
    {
      username: 'diego',
      email: 'diego@test.com',
      password: 'password123',
    },
    {
      username: 'cristian',
      email: 'cristian@test.com',
      password: 'password123',
    }
  ]);
}

export async function down(queryInterface, Sequelize) {
  return queryInterface.bulkDelete('user', null, {});
}

