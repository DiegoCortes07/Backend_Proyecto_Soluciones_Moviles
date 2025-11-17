"use strict";

export async function up(queryInterface, Sequelize) {
  const now = new Date();

  return queryInterface.bulkInsert("album", [
    {
      title: "Abbey Road",
      year: 1969,
      image: "https://akamai.sscdn.co/uploadfile/letras/albuns/6/0/a/0/262601715606697.jpg",
      genre: "Rock",
      artistId: 1,
    },
    {
      title: "YHLQMDLG",
      year: 2020,
      image: "https://i.scdn.co/image/ab67616d0000b273548f7ec52da7313de0c5e4a0",
      genre: "Reguetón",
      artistId: 2,
    },
    {
      title: "Lyke Myke",
      year: 2021,
      image: "https://i.scdn.co/image/ab67616d0000b2735de3684f42b7afa9b580b475",
      genre: "Música Urbana",
      artistId: 3,
    },
    {
      title: "HIT ME HARD AND SOFT",
      year: 2024,
      image: "https://i.scdn.co/image/ab67616d0000b27371d62ea7ea8a5be92d3c1f62",
      genre: "Pop",
      artistId: 4,
    },
  ]);
}

export async function down(queryInterface, Sequelize) {
  return queryInterface.bulkDelete("album", null, {});
}
