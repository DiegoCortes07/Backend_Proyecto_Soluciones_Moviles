"use strict";

export async function up(queryInterface, Sequelize) {
  const now = new Date();

  const songs = await queryInterface.sequelize.query(
    'SELECT COUNT(*) as count FROM song;',
    { type: Sequelize.QueryTypes.SELECT }
  );

  if (songs[0].count > 0) {
    console.log("Seed Song: tabla con datos, se omite inserción.");
    return;
  }

  return queryInterface.bulkInsert("song", [
    {
      title: "Something",
      explicit: false,
      year: 1969,
      albumId: 1,
      artistId: 1,
      cloudinaryPublicId: "Something - The Beatles",
      cloudinarySecureUrl:
        "https://res.cloudinary.com/dyrzwal7v/video/upload/v1763322770/The_Beatles_-_Something_dmibj9.mp3",
      artistName: "The Beatles",
    },
    {
      title: "Come Together",
      explicit: false,
      year: 1969,
      albumId: 1,
      artistId: 1,
      cloudinaryPublicId: "Come Together - The Beatles",
      cloudinarySecureUrl:
        "https://res.cloudinary.com/dyrzwal7v/video/upload/v1763322879/The_Beatles_-_Come_Together_bsmlyg.mp3",
      artistName: "The Beatles",
    },
    {
      title: "SI VEO A TU MAMÁ",
      explicit: true,
      year: 2020,
      albumId: 2,
      artistId: 2,
      cloudinaryPublicId: "SI VEO A TU MAMA - Bad Bunny",
      cloudinarySecureUrl:
        "https://res.cloudinary.com/dyrzwal7v/video/upload/v1763322977/BAD_BUNNY_-_SI_VEO_A_TU_MAM%C3%81_YHLQMDLG_Video_Oficial_cuixso.mp3",
      artistName: "Bad Bunny"
    },
    {
      title: "LA ZONA",
      explicit: true,
      year: 2020,
      albumId: 2,
      artistId: 2,
      cloudinaryPublicId: "LA ZONA - Bad Bunny",
      cloudinarySecureUrl:
        "https://res.cloudinary.com/dyrzwal7v/video/upload/v1763323141/BAD_BUNNY_-_LA_ZONA_YHLQMDLG_Visualizer_sccwwj.mp3",
      artistName: "Bad Bunny"
    },
    {
      title: "Qué quieres de mí",
      explicit: true,
      year: 2021,
      albumId: 3,
      artistId: 3,
      cloudinaryPublicId: "Que quieres de mi - Myke Towers",
      cloudinarySecureUrl:
        "https://res.cloudinary.com/dyrzwal7v/video/upload/v1763323242/Myke_Towers_Eladio_Carri%C3%B3n_-_QU%C3%89_QUIERES_DE_MI__Visualizer_hehvk8.mp3",
      artistName: "Myke Towers"
    },
    {
      title: "Yo estaré",
      explicit: true,
      year: 2021,
      albumId: 3,
      artistId: 3,
      cloudinaryPublicId: "Yo estaré - Myke Towers",
      cloudinarySecureUrl:
        "https://res.cloudinary.com/dyrzwal7v/video/upload/v1763323321/YO_ESTAR%C3%89_njyrlq.mp3",
      artistName: "Myke Towers"
    },
  ]);
}

export async function down(queryInterface, Sequelize) {
  return queryInterface.bulkDelete("song", null, {});
}
