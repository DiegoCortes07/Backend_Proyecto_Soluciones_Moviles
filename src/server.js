import dotenv from "dotenv";
dotenv.config();

import morgan from "morgan";
import cors from "cors";
import express from "express";
import db from "./models/index.js";
import http from "http";

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.server = http.createServer(this.app);

    this.paths = {
      // definir rutas
    };

    this.middlewares();
    this.connectDB();
    this.routes();
  }

  async connectDB() {
    try {
      await db.sequelize.authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }

    // TODO: agregar los modelos a la base de datos
    await db.sequelize.sync({ alter: true });
    console.log("All models were synchronized successfully.");
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(morgan("dev"));
    this.app.use(cors());
  }

  routes() {
    // definir las rutas
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}

export default Server;
