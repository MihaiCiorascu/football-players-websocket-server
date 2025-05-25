import { Op } from 'sequelize';
import Log from './Log.js';
import MonitoredUser from './MonitoredUser.js';
import sequelize from './database.js';

const TIME_WINDOW_MINUTES = 5; // Time window in minutes
const ACTION_THRESHOLD = 50;   // Number of actions considered suspicious

async function monitorLogs() {
  const now = new Date();
  const windowStart = new Date(now - TIME_WINDOW_MINUTES * 60 * 1000);

  // Find users with more than ACTION_THRESHOLD actions in the time window
  const logs = await Log.findAll({
    where: {
      timestamp: { [Op.gte]: windowStart }
    },
    attributes: ['userId', [sequelize.fn('COUNT', sequelize.col('id')), 'actionCount']],
    group: ['userId'],
    having: sequelize.literal(`COUNT(id) > ${ACTION_THRESHOLD}`)
  });

  for (const log of logs) {
    const userId = log.userId;
    const existing = await MonitoredUser.findOne({ where: { userId } });
    if (!existing) {
      await MonitoredUser.create({
        userId,
        reason: `High CRUD activity: ${log.getDataValue('actionCount')} actions in ${TIME_WINDOW_MINUTES} minutes`,
        detectedAt: now
      });
      console.log(`User ${userId} added to monitored list for suspicious activity.`);
    }
  }
}

// Run every 5 minutes
setInterval(monitorLogs, TIME_WINDOW_MINUTES * 60 * 1000);

// Optionally, run once on startup
monitorLogs(); 