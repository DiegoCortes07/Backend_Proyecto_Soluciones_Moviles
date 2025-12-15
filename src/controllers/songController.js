import { request, response } from "express";
import Song from "../models/song.js";
import Artist from "../models/artist.js";

export const getAllSongs = async (req = request, res = response) => {
   console.log("Song importado es:", Song);
    try {
        const songs = await Song.findAll({ where: { enabled: true, isPodcast: false } });
        return res.status(200).json(songs);
    }
    catch (error) {
        return res.status(500).send("Error al obtener las canciones");
    }
};

export const getSongById = async (req = request, res = response) => {
    const { id } = req.params;
    try {
        const song = await Song.findByPk(id);
        if (!song) {
            return res.status(404).send("Canción no encontrada");
        }
        return res.status(200).json(song);
    } catch (error) {
        return res.status(500).send("Error al obtener la canción");
    }
}; 

export const getSongsByArtist = async (req = request, res = response) => {
    const { artistId } = req.params;  
    try {
        const song = await Song.findAll({ where: { artistId: artistId } });
        if (song.length === 0) {
            return res.status(404).send("Canciones no encontradas para el artista");
        }
        return res.status(200).json(song);
    } catch (error) {
        return res.status(500).send("Error al obtener las canciones del artista");
    }
};
