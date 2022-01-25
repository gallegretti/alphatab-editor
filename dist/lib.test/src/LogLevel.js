/**
 * Defines all loglevels.
 * @json
 */
export var LogLevel;
(function (LogLevel) {
    /**
     * No logging
     */
    LogLevel[LogLevel["None"] = 0] = "None";
    /**
     * Debug level (internal details are displayed).
     */
    LogLevel[LogLevel["Debug"] = 1] = "Debug";
    /**
     * Info level (only important details are shown)
     */
    LogLevel[LogLevel["Info"] = 2] = "Info";
    /**
     * Warning level
     */
    LogLevel[LogLevel["Warning"] = 3] = "Warning";
    /**
     * Error level.
     */
    LogLevel[LogLevel["Error"] = 4] = "Error";
})(LogLevel || (LogLevel = {}));
//# sourceMappingURL=LogLevel.js.map