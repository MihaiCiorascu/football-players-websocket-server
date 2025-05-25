import { Sequelize } from 'sequelize';
import path from 'path';
import sqlite3 from 'sqlite3';
import pg from 'pg';

let sequelize;

if (process.env.DATABASE_URL) {
  // Use Railway/Postgres in production
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectModule: pg,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // For Railway/Heroku/Render
      },
    },
    logging: console.log,
    define: {
      freezeTableName: true,
      underscored: true,
    },
  });
} else {
  // Use SQLite locally
  const dbPath = path.join(process.cwd(), 'database.sqlite');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    dialectModule: sqlite3,
    logging: console.log,
    define: {
      freezeTableName: true,
      underscored: true,
    },
  });
}

export async function dropDuplicateIndices() {
  if (sequelize.getDialect() === 'sqlite') {
    try {
      await sequelize.query('DROP INDEX IF EXISTS rating_player_value_idx;');
      await sequelize.query('DROP INDEX IF EXISTS rating_player_date_idx;');
      await sequelize.query('DROP INDEX IF EXISTS player_position_goals_idx;');
      await sequelize.query('DROP INDEX IF EXISTS player_age_rating_idx;');
    } catch (error) {
      console.warn('Warning: Could not drop indices:', error.message);
    }
  }
}

export default sequelize;