
/**
 * Logger Factory fasciliates the application logger to the designated classes
 */

class LoggerFactory {
    //private fields
    /**
     * @private
     * @type {import("pino").Logger | null}
     */
      static #applicationLogger = null;

    static get getApplicationLogger() {
        return LoggerFactory.#applicationLogger;
    }
        
    /**
     * @param {(param: import("pino").Logger) => void} value
     */
    static set setApplicationLogger(value) {
        LoggerFactory.#applicationLogger = value;
    }
}

module.exports = LoggerFactory;