"use strict";

export async function up(queryInterface, Sequelize) {
  const now = new Date();

  const albums = await queryInterface.sequelize.query(
    'SELECT COUNT(*) as count FROM album;',
    { type: Sequelize.QueryTypes.SELECT }
  );

  if (albums[0].count > 0) {
    console.log("Seed Album: tabla con datos, se omite inserción.");
    return;
  }

  return queryInterface.bulkInsert("album", [
    {
      title: "Abbey Road",
      year: 1969,
      image: "https://akamai.sscdn.co/uploadfile/letras/albuns/6/0/a/0/262601715606697.jpg",
      genre: "Rock",
      artistId: 1,
      artistName: "The Beatles",
    },
    {
      title: "YHLQMDLG",
      year: 2020,
      image: "https://i.scdn.co/image/ab67616d0000b273548f7ec52da7313de0c5e4a0",
      genre: "Reguetón",
      artistId: 2,
      artistName: "bad bunny",
    },
    {
      title: "Lyke Myke",
      year: 2021,
      image: "https://i.scdn.co/image/ab67616d0000b2735de3684f42b7afa9b580b475",
      genre: "Música Urbana",
      artistId: 3,
      artistName: "Myke towers",
    },
    {
      title: "HIT ME HARD AND SOFT",
      year: 2024,
      image: "https://i.scdn.co/image/ab67616d0000b27371d62ea7ea8a5be92d3c1f62",
      genre: "Pop",
      artistId: 4,
      artistName: "Billie Eilish",
    },
    {
      title: "Hybrid Theory",
      year: 2000,
      image: "https://musiclife.cl/3649-superlarge_default/linkin-park-hybrid-theory-2cd-cd.webp",
      genre: "Rock Alternativo",
      artistId: 5,
      artistName: "Linkin Park",
    },
    {
      title: "SOL MARIA",
      year: 2024,
      image: "https://i.scdn.co/image/ab67616d0000b273ec105eaf625391e95540ba97",
      genre: "Trap",
      artistId: 6,
      artistName: "Eladio carrión",
    },
    {
      title: "DON KBRN",
      year: 2025,
      image: "https://i.scdn.co/image/ab67616d00001e02e83df08dc5b90b0909566bd4",
      genre: "Rap",
      artistId: 6,
      artistName: "Eladio carrión",
    }
  ]);
}

export async function down(queryInterface, Sequelize) {
  return queryInterface.bulkDelete("album", null, {});
}