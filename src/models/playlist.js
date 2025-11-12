import { DataTypes, Model } from "sequelize";
import db from "../config/database.js";
import User from "./user.js";

class Playlist extends Model {
    static id;
    static name;
    static description;
    static image_url;
}

Playlist.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        image_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize: db,
        modelName: "Playlist",
    }
);

Playlist.associate = (models) => {
    Playlist.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
    });
    Playlist.hasMany(models.PlaylistSong, {
        foreignKey: "playlistId",
        as: "songs",
    });
}

export default Playlist;
