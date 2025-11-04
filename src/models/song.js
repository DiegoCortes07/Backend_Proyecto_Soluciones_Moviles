import { DataTypes, Model } from "sequelize";
import db from "../config/database.js";

class Song extends Model {
  static id
  static tittle
  static duration
  static audioUrl
  static explicit
  static enabled
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
    duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
        },
    audioUrl: {
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
};

export default Song;
