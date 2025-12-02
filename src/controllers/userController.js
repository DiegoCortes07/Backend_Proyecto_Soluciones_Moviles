import { response, request } from "express";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { enviarCorreo } from "../mail/mailsystem.js";
import fs from "fs";
import path from "path";

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

const generateEmailToken = (email) =>{
    return jwt.sign({ id: email }, process.env.JWT_SECRET, {
        expiresIn: '40m',
    });
};

const templatePath = path.resolve("src/mail/template/confirmMail.html");
let html = fs.readFileSync(templatePath, "utf8");

export const register = async (req = request, res = response) => {
    const { username, email, password } = req.body;

    // Validar que no falten campos
    if (!username || !email || !password) {
        return res.status(400).json({
            message: "Faltan campos obligatorios. Asegúrate de completar nombre, correo y contraseña."
        });
    }

    try {
        // Verificar si ya existe un usuario con el correo proporcionado
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({
                message: "El correo electrónico ya está en uso. Por favor, usa otro correo."
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

        const emailToken = generateEmailToken(email);
        const frontUrl = `${process.env.API_URL}verify-mail?token=${emailToken}`;
        html = html
            .replace(/{{USER_NAME}}/g, username)
            .replace(/{{VERIFICATION_URL}}/g, frontUrl)
            .replace(/{{APP_NAME}}/g, "Tunesly")
            .replace(/{{YEAR}}/g, new Date().getFullYear());

        await enviarCorreo(email, "Confirmacion de Email",html);

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
            message: "Hubo un error en el servidor. Por favor, intenta más tarde."
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
                token
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error del servidor");
    }
};

export const allUsers = async (req = request, res = response) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ['password'] } });

        if (users.length === 0) {
            return res.status(404).send("No se encontraron usuarios");
        }

        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error del servidor");
    }
};

// obtener las playlist de un usuario autenticado por su token

export const getUserPlaylists = async (req = request, res = response) => {
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

        if (user.playlists.length === 0) {
            return res.status(204).send("No se encontraron playlists para este usuario");
        }

        res.status(200).json(user.playlists);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error del servidor");
    }
};

export const validateEmail = async (req = request, res = response) => {
    const {token} = req.body

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.id;
        const emailExist = await User.findOne({where: {email:email}});
        if(!emailExist){
            return res.status(404).send("Usuario no encontrado");
        }

        emailExist.enabled = true;
        await emailExist.save();

        res.status(200).json({msg: "Email verificado"});

    }catch(error){
        console.error(error);
        return res.status(500).send("Error del servidor");
    }
};