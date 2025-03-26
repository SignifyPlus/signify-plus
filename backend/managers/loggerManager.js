const Pino = require('pino')
class LoggerManager{
    constructor() {
        this.createLogger.bind(this);
    }

    async createLogger(logLevel) {
        return Pino({
            level: logLevel,
            transport : {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    translateTime: 'HH:MM:ss'
                },
            }
        })
    }
}

module.exports = LoggerManager;