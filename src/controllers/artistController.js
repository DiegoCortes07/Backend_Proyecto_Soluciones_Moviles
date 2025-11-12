import { response, request } from "express";
import Artist from "../models/artist.js";
import Song from "../models/song.js";

export const createArtist = async (req = request, res = response) => {
    const { name, genre, description } = req.body;

    if (!name || !genre || !description) {
        return res.status(400).send("Faltan campos obligatorios");
    }

    try {
        const newArtist = await Artist.create({
            name,
            genre,
            description,
        });
        return res.status(201).json(newArtist);
    } catch (error) {
        return res.status(500).send("Error al crear el artista");
    }
};

export const getArtists = async (req = request, res = response) => {
    try {
        const artists = await Artist.findAll();
        return res.status(200).json(artists);
    } catch (error) {
        return res.status(500).send("Error al obtener los artistas");
    }
};

export const getArtistById = async (req = request, res = response) => {
    const { artistId } = req.params;
    try {
        const artist = await Artist.findByPk(artistId);
        if (!artist) {
            return res.status(404).send("Artista no encontrado");
        }
        return res.status(200).json(artist);
    } catch (error) {
        return res.status(500).send("Error al obtener el artista");
    }
};

export const getSongsByArtist = async (req = request, res = response) => {
    const { artistId } = req.params;

    try {
        const songs = await Song.findAll({ where: { artistId } });
        return res.status(200).json(songs);
    } catch (error) {
        return res.status(500).send("Error al obtener las canciones del artista");
    }

}