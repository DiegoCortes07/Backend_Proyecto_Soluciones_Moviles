// usamos Sequelize para manejar la base de datos
import { Sequelize } from 'sequelize';

const db = new Sequelize({
    dialect: 'sqlite',
    logging: false,
    storage: './src/database/database.sqlite'
});

export default db;