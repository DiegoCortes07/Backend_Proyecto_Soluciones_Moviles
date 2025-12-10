"use strict";

export async function up(queryInterface, Sequelize) {
  // Verificar si la tabla song ya tiene datos
  const songs = await queryInterface.sequelize.query(
    'SELECT COUNT(*) as count FROM song;',
    { type: Sequelize.QueryTypes.SELECT }
  );

  if (songs[0].count > 0) {
    console.log("Seed Song: tabla con datos, se omite inserción.");
    return;
  }

  // Verificar que los albumId y artistId sean válidos
  const albums = await queryInterface.sequelize.query(
    'SELECT id FROM album WHERE id IN (1, 2, 3, 4, 5);',
    { type: Sequelize.QueryTypes.SELECT }
  );
  
  const artists = await queryInterface.sequelize.query(
    'SELECT id FROM artist WHERE id IN (1, 2, 3, 4, 5);',
    { type: Sequelize.QueryTypes.SELECT }
  );

  const validAlbumIds = albums.map(album => album.id);
  const validArtistIds = artists.map(artist => artist.id);

  // Comprobar si los IDs son válidos
  const isValid = validAlbumIds.length === 5 && validArtistIds.length === 5;
  
  if (!isValid) {
    console.log("Error: Las claves foráneas albumId o artistId no son válidas.");
    return;
  }

  console.log("Seed Song: insertando datos...");

  // Insertar canciones
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
      imageUrl: "https://m.media-amazon.com/images/M/MV5BZjI0ODFlM2YtYzQ4Yy00MGM4LTkxMDYtYTAyMTI2MGQzYzJiXkEyXkFqcGc@._V1_.jpg"
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
      imageUrl: "https://i.scdn.co/image/ab67616d0000b273dc30583ba717007b00cceb25"
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
      artistName: "Bad Bunny",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b273548f7ec52da7313de0c5e4a0"
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
      artistName: "Bad Bunny",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b273548f7ec52da7313de0c5e4a0"
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
      artistName: "Myke Towers",
      imageUrl: "https://i1.sndcdn.com/artworks-RMO4jQjB6dUh-0-t500x500.jpg"
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
      artistName: "Myke Towers",
      imageUrl: "https://i1.sndcdn.com/artworks-DukzEMZwKvZEXV53-reEi2g-t500x500.jpg"
    },
    {
      title: "Chihiro",
      explicit: false,
      year: 2024,
      albumId: 4,
      artistId: 4,
      cloudinaryPublicId: "Chihiro - Billie Eilish",
      cloudinarySecureUrl: "https://res.cloudinary.com/dyrzwal7v/video/upload/v1764947939/Billie_Eilish_-_CHIHIRO_Official_Music_Video_ppp3ti.mp3",
      artistName: "Billie Eilish",
      imageUrl: "https://image.europafm.com/clipping/cmsimages02/2024/06/06/8D0B2744-30BE-4C03-8009-89B29EE2C66A/billie-eilish-videoclip-chihiro_104.jpg?crop=611,611,x350,y0&width=1200&height=1200&optimize=low&format=webply"
    },
    {
      title: "birds of a feather",
      explicit: false,
      year: 2024,
      albumId: 4,
      artistId: 4,
      cloudinaryPublicId: "birds of a feather - Billie Eilish",
      cloudinarySecureUrl: "https://res.cloudinary.com/dyrzwal7v/video/upload/v1764948793/Billie_Eilish_-_BIRDS_OF_A_FEATHER_Official_Music_Video_V9PVRfjEBTI_qsnocw.mp3",
      artistName: "Billie Eilish",
      imageUrl: "https://i1.sndcdn.com/artworks-T99f0BmoDfy0jidN-wrXBRg-t1080x1080.jpg"
    },
    {
      title: "In the End",
      explicit: false,
      year: 2000,
      albumId: 5,
      artistId: 5,
      cloudinaryPublicId: "In the End - Linkin Park",
      cloudinarySecureUrl: "https://res.cloudinary.com/dyrzwal7v/video/upload/v1764948953/In_The_End_Official_HD_Music_Video_-_Linkin_Park_isbz3j.mp3",
      artistName: "Linkin Park",
      imageUrl: "https://lastfm.freetls.fastly.net/i/u/ar0/7e2052e324fd6753725da8b05bcf4c37.jpg"
    },
    {
      title: "papercut",
      explicit: false,
      year: 2000,
      albumId: 5,
      artistId: 5,
      cloudinaryPublicId: "papercut - Linkin Park",
      cloudinarySecureUrl: "https://res.cloudinary.com/dyrzwal7v/video/upload/v1764949041/Papercut_Official_HD_Music_Video_-_Linkin_Park_jlgdun.mp3",
      artistName: "Linkin Park",
      imageUrl: "https://lastfm.freetls.fastly.net/i/u/ar0/ebd0c17794b943a016d4345ce4e5b8c5.jpg"
    },
    {
      title: "bendecido",
      explicit: true,
      year: 2024,
      albumId: 6,
      artistId: 6,
      cloudinaryPublicId: "bendecido - Eladio carrión",
      cloudinarySecureUrl: "https://res.cloudinary.com/dyrzwal7v/video/upload/v1765042860/Bendecido_uqfpnn.mp3",
      artistName: "Eladio carrión",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b273ec105eaf625391e95540ba97"
    },
    {
      title: "TQM",
      explicit: true,
      year: 2024,
      albumId: 6,
      artistId: 6,
      cloudinaryPublicId: "TQM - Eladio carrión",
      cloudinarySecureUrl: "https://res.cloudinary.com/dyrzwal7v/video/upload/v1765043236/Eladio_Carri%C3%B3n_-_TQMQA_Visualizer_SOL_MAR%C3%8DA_c0y6jr.mp3",
      artistName: "Eladio carrión",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b273555742588f8a2cc4a0e21d9f"
    },
    {title: "Tu ritmo",
      explicit: true,
      year: 2024,
      albumId: 6,
      artistId: 6,
      cloudinaryPublicId: "Tu ritmo - Eladio carrión",
      cloudinarySecureUrl: "https://res.cloudinary.com/dyrzwal7v/video/upload/v1765043445/Eladio_Carri%C3%B3n_-_Tu_Ritmo_Visualizer_SOL_MAR%C3%8DA_wwqlqw.mp3",
      artistName: "Eladio carrión",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b273555742588f8a2cc4a0e21d9f"
    },
    {
      title: "Invencible",
      explicit: true,
      year: 2025,
      albumId: 7,
      artistId: 6,
      cloudinaryPublicId: "Invencible - Eladio carrión",
      cloudinarySecureUrl: "https://res.cloudinary.com/dyrzwal7v/video/upload/v1765043719/Invencible_-_Eladio_Carri%C3%B3n_LetraLyrics_dqwvhp.mp3",
      artistName: "Eladio carrión",
      imageUrl: "https://i.scdn.co/image/ab67616d00001e02e83df08dc5b90b0909566bd4"
    },
    {
      title : "Ohtani",
      explicit: true,
      year: 2025,
      albumId: 7,
      artistId: 6,
      cloudinaryPublicId: "Ohtani - Eladio carrión",
      cloudinarySecureUrl: "https://res.cloudinary.com/dyrzwal7v/video/upload/v1765043986/Ohtani_-Eladio_Carri%C3%B3n_LetraLyrics_vja5yg.mp3",
      artistName: "Eladio carrión",
      imageUrl: "https://i.scdn.co/image/ab67616d00001e02e83df08dc5b90b0909566bd4"
    }
  ]);
}

export async function down(queryInterface, Sequelize) {
  return queryInterface.bulkDelete("song", null, {});
}