const { createLogger, transports, format, info } = require("winston");
const dailyRotateFile = require("winston-daily-rotate-file");
const path = require('path');

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf((info) => `${info.timestamp} ${info.level} : ${info.message}`)
  ),
  transports : [
    new dailyRotateFile({
        filename : path.join('logs' , 'app-%DATE%.log'),
        datePattern : 'YYYY-MM-DD',
        maxSize : '20m',
        maxFiles : '15d'
    })
  ]
});

module.exports = logger;