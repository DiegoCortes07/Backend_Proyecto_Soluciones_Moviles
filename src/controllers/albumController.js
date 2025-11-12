import { request, response } from "express";
import Artist from "../models/artist.js";
import Album from "../models/album.js";

export const createAlbumForArtist = async (req = request, res = response) => {
    const { artistId } = req.params;
    const { title, date } = req.body;
    try {
        const artist = await Artist.findByPk(artistId);
        if (!artist) {
            return res.status(404).send("Artista no encontrado");
        }
        const newAlbum = await Album.create({
            title,
            date,
            artistId: artist.id
        });
        return res.status(201).json(newAlbum);
    } catch (error) {
        return res.status(500).send("Error al crear el álbum para el artista");
    }
};

export const getAlbumsByArtist = async (req = request, res = response) => {
    const { artistId } = req.params;
    try {
        const artist = await Artist.findByPk(artistId);
        if (!artist) {
            return res.status(404).send("Artista no encontrado");
        }
        const albums = await Album.findAll({ where: { artistId: artist.id } });
        return res.status(200).json(albums);
    } catch (error) {
        return res.status(500).send("Error al obtener los álbumes del artista");
    }
};