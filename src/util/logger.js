import winston from 'winston';
import path from 'path';

const logsDirectory = process.env.NODE_ENV === 'production' ? '.' : '/var/log/';

const myLogger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  // Defining where to log the messages to which file
  transports: [
    new winston.transports.File({
      filename: path.join(logsDirectory, 'webapp.log'),
      level: 'info',
    }),
  ],
  exitOnError: false,
});

myLogger.stream = {
  write: message => {
    // Using the 'info' log level so that output will be picked up by both transports (console and file)
    myLogger.info(message.trim());
  },
};

export default myLogger;
