import { request, response } from "express";
import Song from "../models/song.js";
import {uploadMusicFile} from "../config/cloudinary.js";
import Artist from "../models/artist.js";

export const uploadSong = async (req = request, res = response) => {

    const result = await uploadMusicFile(req.files.song);

    if (!result || !result.public_id || !result.secure_url) {
        return res.status(500).json({
            ok: false,
            msg: "Error uploading file to Cloudinary",
        });
    }

    console.log("FILES =>", req.files);
    console.log("BODY  =>", req.body);


    const artist = await Artist.findByPk(req.body.artistId);

    try {
        const song = await Song.create({
            title: req.body.title,
            artistId: req.body.artistId,
            albumId: req.body.albumId,
            genre: req.body.genre,
            year: req.body.year,
            explicit: req.body.explicit,
            cloudinaryPublicId: result.public_id,
            cloudinarySecureUrl: result.secure_url,
            artistName: artist ? artist.name : null,
            imageUrl: req.body.imageUrl ? req.body.imageUrl : null,
        });

        res.status(201).json({
            ok: true,
            msg: "Song uploaded successfully",
            song,
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Error creating song",
            error: error.message,
        });
    }
};

export const getAllSongs = async (req = request, res = response) => {
   console.log("Song importado es:", Song);
    try {
        const songs = await Song.findAll();
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
