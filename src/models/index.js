import { readdirSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join, basename as _basename } from "path";
import { Sequelize } from "sequelize";
import sequelize from "../config/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const basename = _basename(__filename);

const db = {};

for (const file of readdirSync(__dirname)) {
  if (
    file.indexOf(".") !== 0 &&
    file !== basename &&
    file.slice(-3) === ".js" &&
    !file.endsWith(".test.js")
  ) {
    const module = await import(pathToFileURL(join(__dirname, file)));
    const model = module.default; // ✅ el modelo ya viene inicializado
    db[model.name] = model;
  }
}

for (const modelName of Object.keys(db)) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
