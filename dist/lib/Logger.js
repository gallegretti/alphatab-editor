import { LogLevel } from '@src/LogLevel';
export class ConsoleLogger {
    static format(category, msg) {
        return `[AlphaTab][${category}] ${msg}`;
    }
    debug(category, msg, ...details) {
        console.debug(ConsoleLogger.format(category, msg), ...details);
    }
    warning(category, msg, ...details) {
        console.warn(ConsoleLogger.format(category, msg), ...details);
    }
    info(category, msg, ...details) {
        console.info(ConsoleLogger.format(category, msg), ...details);
    }
    error(category, msg, ...details) {
        console.error(ConsoleLogger.format(category, msg), ...details);
    }
}
ConsoleLogger.logLevel = LogLevel.Info;
export class Logger {
    static shouldLog(level) {
        return Logger.logLevel !== LogLevel.None && level >= Logger.logLevel;
    }
    static debug(category, msg, ...details) {
        if (Logger.shouldLog(LogLevel.Debug)) {
            Logger.log.debug(category, msg, ...details);
        }
    }
    static warning(category, msg, ...details) {
        if (Logger.shouldLog(LogLevel.Warning)) {
            Logger.log.warning(category, msg, ...details);
        }
    }
    static info(category, msg, ...details) {
        if (Logger.shouldLog(LogLevel.Info)) {
            Logger.log.info(category, msg, ...details);
        }
    }
    static error(category, msg, ...details) {
        if (Logger.shouldLog(LogLevel.Error)) {
            Logger.log.error(category, msg, ...details);
        }
    }
}
Logger.logLevel = LogLevel.Info;
Logger.log = new ConsoleLogger();
//# sourceMappingURL=Logger.js.map