import { DataTypes, Model } from "sequelize";
import db from "../config/database.js";

class Song extends Model {
    static id
    static tittle
    static cloudinaryPublicId
    static cloudinarySecureUrl
    static explicit
    static enabled
    static year
}

Song.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cloudinaryPublicId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cloudinarySecureUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        explicit: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        enabled: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    {
        sequelize: db,
        modelName: "Song",
        tableName: "song",
        timestamps: false,
    }

);

Song.associate = (models) => {
    Song.belongsTo(models.Album, {
        foreignKey: "albumId",
        as: "album",
    });
    Song.belongsTo(models.Artist, {
        foreignKey: "artistId",
        as: "artist",
    });

    Song.hasMany(models.PlaylistSong, {
        foreignKey: "songId",
        as: "playlistSongs",
    });
};

export default Song;
