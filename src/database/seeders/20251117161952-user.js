'use strict';
import bcrypt from 'bcryptjs';
export async function up(queryInterface, Sequelize) {

  const users = await queryInterface.sequelize.query(
    'SELECT COUNT(*) as count FROM user;',
    { type: Sequelize.QueryTypes.SELECT }
  );

  if (users[0].count > 0) {
    console.log("Seed User: tabla con datos, se omite inserción.");
    return;
  }

  return queryInterface.bulkInsert('user', [
    {
      username: 'diego',
      email: 'diego@test.com',
      password: bcrypt.hashSync('password123', 10),
      enabled: true,
    },
    {
      username: 'cristian',
      email: 'cristian@test.com',
      password: bcrypt.hashSync('password123', 10),
      enabled: true,
    }
  ]);
}

export async function down(queryInterface, Sequelize) {
  return queryInterface.bulkDelete('user', null, {});
}