import { response, request } from "express";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Song from "../models/song.js";
import Like from "../models/like.js";
import { enviarCorreo } from "../mail/mailsystem.js";
import fs from "fs";
import path from "path";
import {uploadImageFile, deleteFile} from "../config/cloudinary.js";

const templatePath = path.resolve("src/mail/template/confirmMail.html");
let html = fs.readFileSync(templatePath, "utf8");

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

const generateEmailToken = (email) =>{
    return jwt.sign({ id: email }, process.env.JWT_SECRET, {
        expiresIn: '40m',
    });
};
const createMail = async (email, username, id) =>{
        let newEmail = email + "||";
        if(id){
            newEmail += `${id}`; 
        }
        const emailToken = generateEmailToken(newEmail);
        const frontUrl = `${process.env.API_URL}verify-mail?token=${emailToken}`;
        console.log(username)
        html = html
            .replace(/{{USER_NAME}}/g, username)
            .replace(/{{VERIFICATION_URL}}/g, frontUrl)
            .replace(/{{APP_NAME}}/g, "Tunesly")
            .replace(/{{YEAR}}/g, new Date().getFullYear());
        console.log(email);
        console.log(frontUrl);
        await enviarCorreo(email, "Confirmacion de Email",html);
}


export const register = async (req = request, res = response) => {
    const { username, email, password } = req.body;

    // Validar que no falten campos
    if (!username || !email || !password) {
        return res.status(400).json({
            message:
                "Faltan campos obligatorios. Asegúrate de completar nombre, correo y contraseña.",
        });
    }

    try {
        // Verificar si ya existe un usuario con el correo proporcionado
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({
                message:
                    "El correo electrónico ya está en uso. Por favor, usa otro correo.",
            });
        }

        // Hashear la contraseña
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Crear un nuevo usuario
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        createMail(email,username);

        // Responder con el usuario y el token
        return res.status(201).json({
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                plan: newUser.plan,
                profilePhoto: newUser.profilePhoto,
                language: newUser.language,
                theme: newUser.theme,
                explicitContent: newUser.explicitContent,
            }
        });
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        return res.status(500).json({
            message: "Hubo un error en el servidor. Por favor, intenta más tarde.",
        });
    }
};

export const login = async (req = request, res = response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send("Faltan campos obligatorios");
    }

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).send("Credenciales a inválidas");
        }

        // si la contraseña no coincide
        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).send("Credenciales inválidas");
        }

        if(!user.enabled){
             return res.status(401).send({blocked:true,msg:"La cuenta esta inhabilitada"});
        }

        const token = generateToken(user.id);

        res.status(200).json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                token,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error del servidor");
    }
};

export const getUser = async (req = request, res = response) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).send("No se proporcionó token de autenticación");
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const user = await User.findByPk(userId, { include: 'playlists' });

        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }

        return res.status(200).json({
            user: {
                profile: user.profilePhoto,
                name: user.username,
                email: user.email,
            }
        });


    } catch (error) {
        console.error(error);
        return res.status(500).send("Error del servidor");
    }
};

export const allUsers = async (req = request, res = response) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ["password"] } });

        if (users.length === 0) {
            return res.status(404).send("No se encontraron usuarios");
        }

        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error del servidor");
    }
};

export const getUserProfile = async (req = request, res = response) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).send("No se proporcionó token de autenticación");
    }
    console.log("Token recibido:", token);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const user = await User.findByPk(userId, {
            attributes: { exclude: ["password"] },
        });

        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error del servidor");
    }
};

export const likedSongs = async (req = request, res = response) => {
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

        const likes = await user.getLikes();

        if (likes.length === 0) {
            return res.status(204).send("No se encontraron canciones favoritas para este usuario");
        }

        const enabledLikes = likes.filter(like => like.enabled);

        const songs = await Promise.all(enabledLikes.map(async (like) => {
            return await Song.findByPk(like.songId);
        }));

        res.status(200).json(songs);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error del servidor");
    }
};

export const likeSong = async (req = request, res = response) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const { songId } = req.params;
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
        const song = await Song.findByPk(songId);
        if (!song) {
            return res.status(404).send("Canción no encontrada");
        }

        const existingLike = await Like.findOne({ where: { userId: user.id, songId: song.id } });

        if (existingLike) {
            await toggleLike(user.id, song.id);
        } else {
            await Like.create({ userId: user.id, songId: song.id });
        }
        res.status(200).send("Canción marcada como favorita");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error del servidor");
    }
};

export const validateEmail = async (req = request, res = response) => {
    const {token} = req.body

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.id.split("||");
        if(email[1]){
            const userExist = await User.findByPk(email[1]);
            if(!userExist){
                return res.status(404).send("Usuario no encontrado");
            }
            userExist.email = email[0];
            await userExist.save();
            res.status(200).json({msg: "Email verificado y activo actualmente"});
        }
        else{
            const emailExist = await User.findOne({where: {email:email}});
            if(!emailExist){
                return res.status(404).send("Usuario no encontrado");
            }
            emailExist.enabled = true;
            await emailExist.save();
            res.status(200).json({msg: "Email verificado"});
        }


    }catch(error){
        console.error(error);
        return res.status(500).send("Error del servidor");
    }
};

export const updateUser = async (req = request, res = response) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const {username,email} = req.body;

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
        if(username){
            user.username = username;
        }
        if(email){
            createMail(email,user.username,userId);
        }
        if(req.file){

            const result =  await uploadImageFile(req.file.buffer);

            const oldPhoto = user.profilePhoto;
            user.profilePhoto = result.url;

            // Para eliminar la foto vieja del usuario
            if (oldPhoto) {
                const filteredID = oldPhoto.replace("ttp://res.cloudinary.com/dkmjphwj3/image/upload/","").replace(".png",""); 
                const delResult = await deleteFile(filteredID.replace(filteredID.split("image")[0],""))
                if(delResult.result!= "ok"){
                    console.error("No se pudo reemplazar la imagen anterior.");
                }else{
                    console.error("La imagen fue reemplazada.");
                }
            }
        }

        await user.save();

        res.status(200).json({msg: "Datos Actualizados"});

    } catch (error) {
        console.error(error);
        return res.status(500).send("Error del servidor");
    }

}
const toggleLike = async (userId, songId) => {
    try {
        // deshabilitar el like existente
        const like = await Like.findOne({ where: { userId, songId } });
        if (like) {
            like.enabled = !like.enabled;
            await like.save();
            return like.enabled ? "Like habilitado" : "Like deshabilitado";
        } else {
            return "No se encontró el like para alternar";
        }
    } catch (error) {
        console.error(error);
        return "Error al alternar el like";
    }
};
