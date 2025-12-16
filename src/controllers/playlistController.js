import { request, response } from "express";
import User from "../models/user.js";
import Playlist from "../models/playlist.js";
import PlaylistSong from "../models/playlistSong.js";
import Song from "../models/song.js";
import jwt from "jsonwebtoken";
import { uploadCoverFile, deleteFile } from "../config/cloudinary.js";

export const getUserPlaylists = async (req = request, res = response) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).send("No se proporcionó token de autenticación");
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }

        console.log("Usuario encontrado:", user.email);

        const playlists = await user.getPlaylists();

        if (playlists.length === 0) {
            return res
                .status(204)
                .send("No se encontraron playlists para este usuario");
        }

        res.status(200).json(playlists);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error del servidor");
    }
};

export const createPlaylist = async (req = request, res = response) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const { name, description, image_url } = req.body;

    if (!token) {
        return res.status(401).send("No se proporcionó token de autenticación");
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }
        const newPlaylist = await Playlist.create({
            name,
            description,
            image_url,
            userId: user.id
        });

        res.status(201).json(newPlaylist);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error del servidor");
    }
};

export const postSongToPlaylist = async (req = request, res = response) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const { playlistId } = req.params;
    const { songId } = req.body;

    if (!token) {
        return res.status(401).send("No se proporcionó token de autenticación");
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }

        const playlist = await Playlist.findByPk(playlistId);
        if (!playlist) {
            return res.status(404).send("Playlist no encontrada");
        }

        if (playlist.userId !== user.id) {
            return res.status(403).send("No tienes permiso para modificar esta playlist");
        }

        const song = await Song.findByPk(songId);
        if (!song) {
            return res.status(404).send("Canción no encontrada");
        }

        // si esa cancion ya se encuentra en la playlist, no agregarla de nuevo
        const existingEntry = await PlaylistSong.findOne({
            where: { playlistId: playlist.id, songId: song.id }
        });

        if (existingEntry) {
            return res.status(409).send("La canción ya está en la playlist");
        }

        const playlistSong = await PlaylistSong.create({
            playlistId: playlist.id,
            songId: song.id
        });

        res.status(201).json(playlistSong);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error del servidor");
    }
};

export const getPlaylistSongs = async (req = request, res = response) => {
    const { playlistId } = req.params;
    try {
        const playlist = await Playlist.findByPk(playlistId)
        if (!playlist) {
            return res.status(404).send("Playlist no encontrada");
        }

        const songs = await playlist.getSongs();
        if (songs.length === 0) {
            return res
                .status(204)
                .send("No se encontraron canciones para esta playlist");
        }

        const detailedSongs = [];
        for (const song of songs) {
            const detailedSong = await Song.findByPk(song.songId);
            detailedSongs.push(detailedSong);
        }

        res.status(200).json(detailedSongs);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error del servidor");
    }
};

export const deletePlaylist = async (req = request, res = response) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const { playlistId } = req.params;
    if (!token) {
        return res.status(401).send("No se proporcionó token de autenticación");
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }
        const playlist = await Playlist.findByPk(playlistId);
        if (!playlist) {
            return res.status(404).send("Playlist no encontrada");
        }
        if (playlist.userId !== user.id) {
            return res.status(403).send("No tienes permiso para eliminar esta playlist");
        }
        await playlist.destroy();
        res.status(200).send("Playlist eliminada correctamente");
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error del servidor");
    }
};

export const deleteSongFromPlaylist = async (req = request, res = response) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const { playlistId, songId } = req.params;
    if (!token) {
        return res.status(401).send("No se proporcionó token de autenticación");
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }
        const playlist = await Playlist.findByPk(playlistId);
        if (!playlist) {
            return res.status(404).send("Playlist no encontrada");
        }
        if (playlist.userId !== user.id) {
            return res.status(403).send("No tienes permiso para modificar esta playlist");
        }
        const playlistSong = await PlaylistSong.findOne({
            where: { playlistId: playlist.id, songId: songId }
        });
        if (!playlistSong) {
            return res.status(404).send("La canción no está en la playlist");
        }
        await playlistSong.destroy();
        res.status(200).send("Canción eliminada de la playlist correctamente");
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error del servidor");
    }
};

export const uploadPlaylistImage = async (req = request, res = response) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const { playlistId } = req.params;

    if (!token) {
        return res.status(401).send("No se proporcionó token de autenticación");
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);

        if (!user) return res.status(404).send("Usuario no encontrado");

        const playlist = await Playlist.findByPk(playlistId);

        if (!playlist) return res.status(404).send("Playlist no encontrada");

        if (playlist.userId !== user.id) {
            return res.status(403).send("No tienes permiso para modificar esta playlist");
        }
        console.log(req.file)

        if (!req.file) {
            return res.status(400).send("No se proporcionó ninguna imagen");
        }

        const file = req.file.buffer;

        if (playlist.image_public_id) {
            await deleteFile(playlist.image_public_id);
        }
        const fileUploaded = await uploadCoverFile(file);

        // Guardar URL en DB
        playlist.image_url = fileUploaded.secure_url;
        await playlist.save();

        return res.status(200).json({
            success: true,
            image_url: playlist.image_url,
        });

    } catch (error) {
        console.error("Error al subir imagen:", error);
        return res.status(500).send("Error del servidor");
    }
};

export const changePlaylistDetails = async (req = request, res = response) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const { playlistId } = req.params;
    const { name, description } = req.body;
    if (!token) {
        return res.status(401).send("No se proporcionó token de autenticación");
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }

        const playlist = await Playlist.findByPk(playlistId);
        if (!playlist) {
            return res.status(404).send("Playlist no encontrada");
        }

        if (playlist.userId !== user.id) {
            return res.status(403).send("No tienes permiso para modificar esta playlist");
        }

        playlist.name = name || playlist.name;
        playlist.description = description || playlist.description;

        await playlist.save();
        res.status(200).json(playlist);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error del servidor");
    }
};