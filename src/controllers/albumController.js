import { request, response } from "express";
import Artist from "../models/artist.js";
import Album from "../models/album.js";

export const createAlbumForArtist = async (req = request, res = response) => {
    const { artistId } = req.params;
    const { title, year, genre, image } = req.body;
    try {
        const artist = await Artist.findByPk(artistId);
        if (!artist) {
            return res.status(404).send("Artista no encontrado");
        }

        const newAlbum = await Album.create({
            title,
            year,
            genre,
            image,
            artistId: artist.id
        });

        return res.status(201).json(newAlbum);
    } catch (error) {
        return res.status(500).send("Error al crear el álbum para el artista");
    }
};

export const getAllAlbums = async (req = request, res = response) => {
    try {
        const albums = await Album.findAll({ where: { isPodcast: false } });
        if (albums.length === 0) {
            return res.status(404).send("No se encontraron álbumes");
        }
        return res.status(200).json(albums);
    } catch (error) {
        return res.status(500).send("Error al obtener rlos álbumes");
    }
};

export const getAlbumById = async (req = request, res = response) => {
    const { albumId } = req.params;
    try {
        const album = await Album.findByPk(albumId);
        if (!album) {
            return res.status(404).send("Álbum no encontrado");
        }
        return res.status(200).json(album);
    } catch (error) {
        return res.status(500).send("Error al obtener el álbum");
    }
};

export const getSongsForAlbum = async (req = request, res = response) => {
    const { albumId } = req.params;
    try {
        const album = await Album.findByPk(albumId, {
            include: 'songs'
        });
        if (!album) {
            return res.status(404).send("Álbum no encontrado");
        }
        return res.status(200).json(album.songs);
    } catch (error) {
        return res.status(500).send("Error al obtener las canciones del álbum");
    }
};