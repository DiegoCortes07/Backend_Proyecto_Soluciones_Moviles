import { request, response } from "express";
import Song from "../models/song.js";
import Album from "../models/album.js";

export const getAllShows = async (req = request, res = response) => {
    try {
        const podcasts = await Song.findAll({ where: { enabled: true, isPodcast: true } });
        return res.status(200).json(podcasts);
    }
    catch (error) {
        return res.status(500).send("Error al obtener los podcasts");
    }
};

export const getAllPodcast = async (req = request, res = response) => {
    try {
        const albums = await Album.findAll({ where: { isPodcast: true } });
        return res.status(200).json(albums);
    }
    catch (error) {
        return res.status(500).send("Error al obtener los podcasts");
    }
};

export const getShowsForPodcastId = async (req = request, res = response) => {
    const { podcastId } = req.params;
    try {
        const shows = await Song.findAll({ where: { enabled: true, isPodcast: true, albumId: podcastId } });
        
        if (shows.length === 0) {
            return res.status(404).send("No se encontraron episodios para el podcast especificado");
        }
        return res.status(200).json(shows);
    }
    catch (error) {
        return res.status(500).send("Error al obtener los episodios del podcast");
    }
};