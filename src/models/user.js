import { DataTypes, Model } from 'sequelize';
import db from '../config/database.js';

class User extends Model {
    static id;
    static username;
    static email;
    static password;
    static plan;
    static profilePhoto;
    static language;
    static theme;
    static explicitContent;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        plan: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "free",
        },
        profilePhoto: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        language: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "en",
        },
        theme: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "light",
        },
        explicitContent: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        sequelize: db,
        modelName: "User",
        tableName: "user",
        timestamps: true,
    }
);

export default User;
