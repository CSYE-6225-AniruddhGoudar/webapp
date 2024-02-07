import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
dotenv.config();

const dbHost = process.env.DATABASE_HOST;
const dbPort = process.env.DATABASE_PORT;
const dbUser = process.env.DATABASE_USER;
const dbPassword = process.env.DATABASE_PASSWORD;
const dbDatabase = process.env.DATABASE_NAME;

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: dbHost,
  port: dbPort,
  username: dbUser,
  password: dbPassword,
  database: dbDatabase,
  define: {
    timestamps: true, 
  },
});

export { sequelize };

