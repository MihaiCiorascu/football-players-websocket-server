import { DataTypes } from 'sequelize';
import sequelize from './database.js';

const MonitoredUser = sequelize.define('MonitoredUser', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  detectedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

export default MonitoredUser; 