public with sharing class WELLogger {
    private static final Map<String, LoggingLevel> LOGGING_LEVEL_CACHE;
    @TestVisible
    private static final Map<String, LoggerSetting> LOGGER_SETTING_CACHE;
    @TestVisible
    private static final Map<String, ILogger> LOGGER_CACHE;
    @TestVisible
    private static final List<Log> LOG_QUEUE_EVENT;
    @TestVisible
    private static final List<Log> LOG_QUEUE_OBJECT;
    private static final Type LOG_TYPE_EVENT = Type.forName('WELLogEvent__e');
    private static final Type LOG_TYPE_OBJECT = Type.forName('WELLog__c');

    private static final String LOGGER_NAME_DEFAULT = 'default';
    @TestVisible
    private static final String LOGGER_NAME_MAIN = 'main';
    private static final LoggerSetting DEFAULT_LOGGER_SETTING;
    @TestVisible
    private static ILogger MAIN_LOGGER;

    static {
        LOGGING_LEVEL_CACHE = new Map<String, LoggingLevel>();
        LOGGER_SETTING_CACHE = new Map<String, LoggerSetting>();
        LOGGER_CACHE = new Map<String, Logger>();
        LOG_QUEUE_EVENT = new List<Log>();
        LOG_QUEUE_OBJECT = new List<Log>();

        loadLoggingLevelMap();
        loadLoggerSettings();

        if (LOGGER_SETTING_CACHE.containsKey(LOGGER_NAME_DEFAULT)) {
            DEFAULT_LOGGER_SETTING = LOGGER_SETTING_CACHE.get(LOGGER_NAME_DEFAULT);
        } else {
            DEFAULT_LOGGER_SETTING = new LoggerSetting();
            DEFAULT_LOGGER_SETTING.loggingLevelObject = LoggingLevel.NONE;
            DEFAULT_LOGGER_SETTING.loggingLevelEvent = LoggingLevel.NONE;
            DEFAULT_LOGGER_SETTING.loggingLevelDebug = LoggingLevel.DEBUG;
            DEFAULT_LOGGER_SETTING.enabled = true;
        }

        if (!LOGGER_SETTING_CACHE.containsKey(LOGGER_NAME_MAIN)) {
            LOGGER_SETTING_CACHE.put(LOGGER_NAME_MAIN, DEFAULT_LOGGER_SETTING);
        }

        MAIN_LOGGER = get(LOGGER_NAME_MAIN);
    }

    private static void loadLoggingLevelMap() {
        for (LoggingLevel enumValue : LoggingLevel.values()) {
            LOGGING_LEVEL_CACHE.put(String.valueOf(enumValue).toUpperCase(), enumValue);
        }
    }

    private static void loadLoggerSettings() {
        for (WELLogSetting__mdt setting : [
            SELECT
                MasterLabel,
                Enabled__c,
                Logging_Level_Object__c,
                Logging_Level_Event__c,
                Logging_Level_Debug__c
            FROM WELLogSetting__mdt
        ]) {
            LOGGER_SETTING_CACHE.put(setting.MasterLabel, new LoggerSetting(setting));
        }
    }

    private WELLogger() {}

    public static ILogger get(String name) {
        if (name == null) {
            return MAIN_LOGGER;
        }

        if (LOGGER_CACHE.containsKey(name)) {
            return LOGGER_CACHE.get(name);
        }

        return get(name, new Logger());
    }

    public static ILogger get(String name, Type className) {
        if (name == null) {
            return MAIN_LOGGER;
        }

        if (LOGGER_CACHE.containsKey(name)) {
            return LOGGER_CACHE.get(name);
        }

        if (className == null) {
            return MAIN_LOGGER;
        }

        Object newLogger = className.newInstance();
        if (newLogger instanceOf Logger) {
            return get(name, (Logger)newLogger);
        } else {
            return MAIN_LOGGER;
        }
    }

    private static ILogger get(String namespace, Logger newLogger) {
        LoggerSetting setting = LOGGER_SETTING_CACHE.get(namespace.substringBefore(':'));
        if (setting == null) {
            setting = DEFAULT_LOGGER_SETTING;
        }

        newLogger.namespace = namespace;
        newLogger.setting = setting;
        LOGGER_CACHE.put(namespace, newLogger);
        return newLogger;
    }

    public static void debug(Object message) {
        MAIN_LOGGER.debug(LoggingLevel.DEBUG, message);
    }

    public static void debug(LoggingLevel logLvl, Object message) {
        MAIN_LOGGER.debug(logLvl, message);
    }

    public static void debug(String message, Object trace) {
        MAIN_LOGGER.debug(LoggingLevel.DEBUG, message, trace);
    }

    public static void debug(LoggingLevel logLvl, String message, Object trace) {
        MAIN_LOGGER.debug(logLvl, message, trace);
    }

    public static void save() {
        saveLogs(LOG_QUEUE_EVENT, LOG_TYPE_EVENT, true);
        saveLogs(LOG_QUEUE_OBJECT, LOG_TYPE_OBJECT, false);
    }

    private static void saveLogs(List<Log> logQueue, Type logType, Boolean asEvent) {
        if (!logQueue.isEmpty()) {
            if (logType != null) {
                List<sObject> logList = new List<sObject>();
                SObject logObj;
                for (Log log : logQueue) {
                    logObj = (SObject)logType.newInstance();
                    logObj.put('TST__c', log.tst);
                    logObj.put('LVL__c', log.lvl);
                    logObj.put('NSP__c', log.nsp);
                    logObj.put('MSG__c', log.msg);
                    logObj.put('TRC__c', String.valueOf(log.trc));
                    logList.add(logObj);
                }
                if (asEvent) {
                    Eventbus.publish(logList);
                } else {
                    Database.insert(logList, false);
                }
                logQueue.clear();
            }
        }
    }

    public class LoggerSetting {
        public LoggingLevel loggingLevelObject { get; set; }
        public LoggingLevel loggingLevelEvent { get; set; }
        public LoggingLevel loggingLevelDebug { get; set; }
        public Boolean enabled { get; set; }

        public LoggerSetting() {

        }

        public LoggerSetting(WELLogSetting__mdt setting) {
            enabled = setting.Enabled__c;
            if (enabled) {
                loggingLevelObject = LOGGING_LEVEL_CACHE.get(setting.Logging_Level_Object__c);
                loggingLevelEvent = LOGGING_LEVEL_CACHE.get(setting.Logging_Level_Event__c);
                loggingLevelDebug = LOGGING_LEVEL_CACHE.get(setting.Logging_Level_Debug__c);
            } else {
                loggingLevelObject = LoggingLevel.NONE;
                loggingLevelEvent = LoggingLevel.NONE;
                loggingLevelDebug = LoggingLevel.NONE;
            }
        }
    }

    public interface LoggerInterface {
        ILogger get(String name);
        void debug(Object message);
        void debug(LoggingLevel logLvl, Object message);
        void debug(String message, Object trace);
        void debug(LoggingLevel logLvl, String message, Object trace);
    }

    public interface ILogger extends LoggerInterface  {

    }

    public virtual class Logger implements ILogger {
        @TestVisible
        protected LoggerSetting setting;
        @TestVisible
        protected String namespace;

        public ILogger get(String name) {
            String namespace = this.namespace + ':' + name;
            if (LOGGER_CACHE.containsKey(namespace)) {
                return LOGGER_CACHE.get(namespace);
            }
            Logger logger = this.clone();
            logger.namespace = namespace;
            return logger;
        }

        public void debug(Object message) {
            this.internalDebug(LoggingLevel.DEBUG, message, null);
        }

        public void debug(LoggingLevel logLvl, Object message) {
            this.internalDebug(logLvl, message, null);
        }

        public void debug(String message, Object trace) {
            this.internalDebug(LoggingLevel.DEBUG, message, trace);
        }

        public void debug(LoggingLevel logLvl, String message, Object trace) {
            this.internalDebug(logLvl, message, trace);
        }

        protected virtual void internalDebug(LoggingLevel logLvl, Object message, Object trace) {
            if (!this.setting.enabled) {
                return;
            }

            Log log = new Log(logLvl, this.namespace, message, trace);
            if (this.setting.loggingLevelObject != LoggingLevel.NONE
                && logLvl != LoggingLevel.NONE
                && logLvl.ordinal() >= this.setting.loggingLevelObject.ordinal()) {
                LOG_QUEUE_OBJECT.add(log);
            }

            if (this.setting.loggingLevelEvent != LoggingLevel.NONE
                && logLvl != LoggingLevel.NONE
                && logLvl.ordinal() >= this.setting.loggingLevelEvent.ordinal()) {
                LOG_QUEUE_EVENT.add(log);
            }

            if (this.setting.loggingLevelDebug != LoggingLevel.NONE
                && logLvl != LoggingLevel.NONE
                && logLvl.ordinal() >= this.setting.loggingLevelDebug.ordinal()) {
                System.debug(logLvl, log);
            }
        }

        protected void addLog(Log log) {
            LOG_QUEUE_EVENT.add(log);
        }

        protected void addAllLogs(List<Log> logs) {
            LOG_QUEUE_EVENT.addAll(logs);
        }
    }

    public virtual class Log {
        @TestVisible
        @AuraEnabled
        protected Decimal tst { get; private set; }
        @TestVisible
        @AuraEnabled
        protected String lvl { get; private set; }
        @TestVisible
        @AuraEnabled
        protected String nsp { get; private set; }
        @TestVisible
        @AuraEnabled
        protected String msg { get; private set; }
        @TestVisible
        @AuraEnabled
        protected Object trc { get; private set; }

        public Log(LoggingLevel logLvl, String namespace, Object message, Object trace) {
            tst = Datetime.now().getTime();
            nsp = namespace;
            format(message, trace);

            switch on logLvl {
                when DEBUG {
                    lvl = 'D';
                }
                when ERROR {
                    lvl = 'E';
                }
                when INFO {
                    lvl = 'I';
                }
                when WARN {
                    lvl = 'W';
                }
                when FINE, FINER, FINEST {
                    lvl = 'F';
                }
                when else {
                    lvl = 'N';
                }
            }
        }

        protected virtual void format(Object message, Object trace) {
            if (message instanceOf Exception) {
                Exception ex = (Exception)message;
                msg = String.format('{0}: {1}', new List<String> {
                    ex.getTypeName(),
                    ex.getMessage()
                });
                trc = ex.getStackTraceString();
            } else if (trace == null) {
                msg = String.valueOf(message);
            } else if (trace instanceOf Exception) {
                Exception ex = (Exception)trace;
                msg = String.format('{0}|{1}: {2}', new List<String> {
                    String.valueOf(message),
                    ex.getTypeName(),
                    ex.getMessage()
                });
                trc = ex.getStackTraceString();
            } else {
                msg = (String)message;
                trc = trace;
            }
        }

        public virtual override String toString() {
            String format;
            if (trc != null) {
                if (trc instanceOf String) {
                    format = '[{0}]|{1}|"{2}"';
                    return String.format(format, new List<String> { nsp, msg, (String)trc });
                } else {
                    format = '[{0}]|{1}|{2}';
                    return String.format(format, new List<String> { nsp, msg, String.valueOf(trc) });
                }
            } else {
                format = '[{0}]|{1}';
                return String.format(format, new List<String> { nsp, msg });
            }
        }
    }
}
