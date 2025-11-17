'use strict';

export async function up(queryInterface, Sequelize) {
  const now = new Date();

  return queryInterface.bulkInsert('artist', [
    {
      name: 'The Beatles',
      description: 'An iconic British rock band formed in Liverpool in 1960.',
      image: 'https://mott.pe/noticias/wp-content/uploads/2018/01/Portada-Beatles.jpg',
    },
    {
      name: "bad bunny",
      description: "Bad Bunny es un cantante...",
      image: "https://www.billboard.com/wp-content/uploads/2024/12/Bad-Bunny-cr-Eric-Rojas-2024-uiyt-billboard-1548.jpg?w=942&h=628&crop=1",
    },
    {
      name: "Myke towers",
      description: "Myke Towers es un cantante...",
      image: "https://i0.wp.com/es.rollingstone.com/wp-content/uploads/2023/11/Myke-Towers-esta-viviendo-su-mejor-vida.jpg",
    },
    {
      name: "Billie Eilish",
      description: "Billie Eilish es una cantante...",
      image: "https://i0.wp.com/elplanetaurbano.com/wp-content/uploads/2023/03/Billie-Eilish-APPROVED.jpg",
    },
  ]);
}

export async function down(queryInterface, Sequelize) {
  return queryInterface.bulkDelete('artist', null, {});
}

