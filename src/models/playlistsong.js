import { DataTypes, Model } from "sequelize";
import db from "../config/database.js";
import Playlist from "./playlist.js";
import Song from "./song.js";

class PlaylistSong extends Model {
    static id
}

PlaylistSong.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        playlistId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Playlist,
                key: "id",
            },
        },
        songId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Song,
                key: "id",
            },
        },
        enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        sequelize: db,
        modelName: "PlaylistSong",
        tableName: "PlaylistSong",
        timestamps: true,
        createdAt: "createdAt",
        updatedAt: "updatedAt",
    }
);

PlaylistSong.associate = (models) => {
    PlaylistSong.belongsTo(models.Playlist, {
        foreignKey: "playlistId",
    });
    PlaylistSong.belongsTo(models.Song, {
        foreignKey: "songId",
    });
};

export default PlaylistSong;