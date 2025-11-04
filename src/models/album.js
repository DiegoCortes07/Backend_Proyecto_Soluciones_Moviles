import DataTypes, { Model } from "sequelize";
import db from "../config/database.js";
import Artist from "./artist.js";

class Album extends Model {
  static id
  static title
  static year
  static image}

Album.init(
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
    year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    modelName: "Album",
    tableName: "album",
    timestamps: false,
  }
);

Artist.associate = (models) => {
  Album.belongsTo(models.Artist, {
    foreignKey: "artistId",
    as: "artist",
  });
}

export default Album;