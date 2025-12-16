import { DataTypes, Model } from 'sequelize';
import db from '../config/database.js';

class User extends Model {
    static id;
    static username;
    static email;
    static password;
    static enabled;
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
        alias: {
            type: DataTypes.STRING,
            allowNull:true
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
        enabled: {
            type: DataTypes.BOOLEAN,
            allowNull:true,
            defaultValue: false
        },
        plan: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "free",
        },
        profilePhoto: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        language: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "es",
        },
        theme: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "light",
        },
        explicitContent: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        sequelize: db,
        modelName: "User",
        tableName: "user",
        timestamps: false,
    }
);

User.associate = (models) => {
    User.hasMany(models.Playlist, { foreignKey: 'userId', as: 'playlists' });
    User.hasMany(models.Like, { foreignKey: 'userId', as: 'likes' });   
};

export default User;
