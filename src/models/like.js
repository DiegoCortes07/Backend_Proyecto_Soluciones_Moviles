import { DataTypes, Model } from "sequelize";
import db from "../config/database.js";

class Like extends Model {
  static id;
}

Like.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    songId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }
  },
  {
    sequelize: db,
    modelName: "Like",
    tableName: "like",
  }
);

Like.associations = (models) => {
  Like.belongsTo(models.User, {
    foreignKey: "userId",
    as: "user",
  });
  Like.belongsTo(models.Song, {
    foreignKey: "songId",
    as: "song",
  });
};

export default Like;
