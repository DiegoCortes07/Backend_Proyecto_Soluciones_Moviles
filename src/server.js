import dotenv from "dotenv";
dotenv.config();

import morgan from "morgan";
import cors from "cors";
import express from "express";
import db from "./models/index.js";
import http from "http";
import apiRoutes from "./routes/api.js";
import fileUpload from "express-fileupload";

import * as seedArtist from "./database/seeders/20251116193312-artist.js";
import * as seedAlbum from "./database/seeders/20251116194007-album.js";
import * as seedSong from "./database/seeders/20251116194517-song.js";
import * as seedUser from "./database/seeders/20251117161952-user.js";

class Server {
  constructor() {

    this.app = express();
    this.port = process.env.PORT || 3000;
    this.server = http.createServer(this.app);

    
    // this.app.use(fileUpload({
    //   useTempFiles: true,
    //   tempFileDir: './src/tmp',
    //   createParentPath: true
    // }));
    
    this.app.use(express.urlencoded({ extended: true }));
    this.connectDB();
    this.middlewares();
    this.routes();
  }

  async connectDB() {


    try {
      await db.sequelize.authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }

    await db.sequelize.sync({ alter: false });
    console.log("All models were synchronized successfully.");
    
    this.seeders();
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(morgan("dev"));
    this.app.use(cors());
  }

  routes() {
    this.app.use('/api', apiRoutes);
  }

  listen() {
    this.server.listen(this.port,'0.0.0.0', () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
  async seeders() {
    await seedArtist.up(db.sequelize.getQueryInterface(), db.Sequelize);
    await seedAlbum.up(db.sequelize.getQueryInterface(), db.Sequelize);
    await seedSong.up(db.sequelize.getQueryInterface(), db.Sequelize);
    await seedUser.up(db.sequelize.getQueryInterface(), db.Sequelize);
  }
}

export default Server;
