import { DataTypes, Model } from "sequelize";
import db from "../config/database.js";

class Artist extends Model {
  static id;
  static name;
  static description;
  static image;
}

Artist.init(
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
    image: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize: db,
    modelName: "Artist",
    tableName: "artist",
    timestamps: true,
  }
);



Artist.associate = (models) => {
    Artist.hasMany(models.Album, { foreignKey: 'artistId', as: 'albums' });
    Artist.hasMany(models.Song, { foreignKey: 'artistId', as: 'songs' });
};

export default Artist;
