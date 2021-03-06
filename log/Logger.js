/**
 * @author yu
 * @license http://www.apache.org/licenses/LICENSE-2.0
 */
'use strict';

const Y = require('../Y');
const InvalidConfigException = require('../core/InvalidConfigException');
const ILog = require('./ILog');

/**
 * 日志
 */
class Logger {

    /**
     * constructor
     */
    constructor(settings) {
        /**
         * @property {Array} messages logged messages
         *
         * Each log message is of the following structure:
         * [
         *   [0] => string:message
         *   [1] => number:level
         *   [2] => number:timestamp
         * ]
         */
        this.messages = [];

        /**
         * @property {Number} flushInterval how many messages should be logged before they are flushed from memory
         */
        this.flushInterval = 10;

        /**
         * @property {Array} targets the targets class
         */
        this.targets = [];

        this.init(settings);
    }

    init(settings) {
        if(undefined === settings) {
            return;
        }

        if(undefined === settings.targets) {
            throw new InvalidConfigException('The log configuration is invalid');
        }
        if(undefined !== settings.flushInterval) {
            this.flushInterval = settings.flushInterval;
        }

        for(let target in settings.targets) {
            if(undefined !== settings.targets[target].classPath) {
                let clazz = Y.createObject(settings.targets[target].classPath,
                    settings.targets[target]);
                clazz.on(ILog.EVENT_FLUSH, clazz);

                this.targets.push(clazz);
            }
        }
    }

    /**
     * 获取日志类实例
     *
     * @return {Logger}
     */
    static getLogger() {
        if(null === Logger._logger) {
            Logger._logger = new Logger(Y.app.log);
        }

        return Logger._logger;
    }

    /**
     * 创建新日志对象
     *
     * @param {any} settings
     * @return {Logger}
     */
    static newInstance(settings) {
        return new Logger(settings);
    }

    /**
     * 记录日志
     *
     * @param {String} message 消息
     * @param {Number} level 日志级别
     */
    log(message, level) {
        this.messages.push([message, level, Date.now()]);

        if(this.flushInterval > 0 && this.messages.length >= this.flushInterval) {
            this.flush();
        }
    }

    /**
     * 清空 log 并写入目的地
     */
    flush() {
        let messages = this.messages;
        this.messages = [];

        for(let i=0; i<this.targets.length; i++) {
            this.targets[i].trigger(ILog.EVENT_FLUSH, messages);
        }
    }

    /**
     * Logs a error message
     *
     * @param {String} message the message to be logged
     */
    error(message) {
        this.log(message, Logger.LEVEL_ERROR);
    }

    /**
     * Logs a warning message
     *
     * @param {String} message the message to be logged
     */
    warning(message) {
        this.log(message, Logger.LEVEL_WARNING);
    }

    /**
     * Logs a info message
     *
     * @param {String} message the message to be logged
     */
    info(message) {
        this.log(message, Logger.LEVEL_INFO);
    }

    /**
     * Logs a trace message
     *
     * @param {String} message the message to be logged
     */
    trace(message) {
        if(Y.app.debug) {
            this.log(message, Logger.LEVEL_TRACE);
        }
    }

    /**
     * 获取日志级别描述
     *
     * @param {Number} level 级别
     * @return {String}
     */
    static getLevelName(level) {
        let name = 'unknown';
        switch(level) {
            case Logger.LEVEL_ERROR:
                name = 'error';
                break;
            case Logger.LEVEL_WARNING:
                name = 'warning';
                break;
            case Logger.LEVEL_INFO:
                name = 'info';
                break;
            case Logger.LEVEL_TRACE:
                name = 'trace';
                break;
            default:
                break;
        }

        return name;
    }

}

/**
 * Logger instance
 */
Logger._logger = null;

/**
 * Error message level
 */
Logger.LEVEL_ERROR = 1;

/**
 * Warning message level
 */
Logger.LEVEL_WARNING = 2;

/**
 * Informational message level
 */
Logger.LEVEL_INFO = 4;

/**
 * Tracing message level
 */
Logger.LEVEL_TRACE = 8;

module.exports = Logger;
