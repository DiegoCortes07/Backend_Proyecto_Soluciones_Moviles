import { request, response } from "express";
import cloudinary from "cloudinary";
import Song from "../models/song.js";
import Artist from "../models/artist.js";
import Album from "../models/album.js";
import path from "path";
import fs from "fs";
import uploadFile from "../config/cloudinary.js";

export const uploadSong = async (req = request, res = response) => {
    try{
    const result = await uploadFile(req.files.song)
    const song = await Song.create({
        ...req.body,
        cloudinaryPublicId: result.public_id,
        cloudinarySecureUrl: result.secure_url
    });
    res.status(201).json(song);
    }
    catch(error){
        console.error(error);
        return res.status(500).send("Error del servidor");
    }
}