'use strict';
import bcrypt from "bcryptjs";

export async function up(queryInterface, Sequelize) {

  return queryInterface.bulkInsert('user', [
    {
      username: 'diego',
      email: 'diego@test.com',
      password: await bcrypt.hash("password123", 10),
    },
    {
      username: 'cristian',
      email: 'cristian@test.com',
      password: await bcrypt.hash("123password", 10),
    }
  ]);
}

export async function down(queryInterface, Sequelize) {
  return queryInterface.bulkDelete('user', null, {});
}

