import produce from '../lib/immer';

const RECIEVE_LOGS = 'wel/log-events/RECIEVE_LOGS';
const FILTER_BY_ERRORS = 'wel/log-events/FILTER_BY_ERRORS';
const FILTER_BY_WARNINGS = 'wel/log-events/FILTER_BY_WARNINGS';
const SELECT_MODULE = 'wel/log-events/SELECT_MODULE';

const initState = {
    items:[],
    errors: 0,
    warnings: 0,
    moduleNames: ['-- ALL --'],
    moduleNameCache: {},
    filters: {
        module: '-- ALL --',
        errorsOnly: false,
        warningsOnly: false
    }
};

export default function reducer(state = initState, action = {}) {
    return produce(state, draft => {
        switch (action.type) {
            case RECIEVE_LOGS: {
                const {
                    LVL__c,
                    TST__c,
                    NSP__c,
                    MSG__c,
                    TRC__c,
                    CreatedById
                } = action.payload.data.payload;

                let eventLog = {
                    level: LVL__c,
                    timestamp: TST__c,
                    namespace: NSP__c,
                    message: MSG__c,
                    trace: TRC__c,
                    createdById: CreatedById,
                    replayId: action.payload.data.event.replayId,
                };

                let moduleName = draft.moduleNameCache[eventLog.namespace];
                if (!moduleName && eventLog.namespace) {
                    let index = eventLog.namespace.indexOf(':');
                    if (index === -1) {
                        moduleName = eventLog.namespace;
                        draft.moduleNameCache[eventLog.namespace] = eventLog.namespace;
                    } else {
                        moduleName = eventLog.namespace.substring(0, index);
                        draft.moduleNameCache[eventLog.namespace] = moduleName;
                    }
                    if (!draft.moduleNames.includes(moduleName)) {
                        draft.moduleNames.push(moduleName);
                    }
                }
                eventLog.module = moduleName;

                draft.items.push(eventLog);

                if (draft.filters.module === '-- ALL --'
                    || draft.filters.module === eventLog.module) {
                    if (eventLog.level === 'E') {
                        draft.errors++;
                    } else if (eventLog.level === 'W') {
                        draft.warnings++;
                    }
                }
                break;
            }
            case SELECT_MODULE: {
                draft.filters.module = action.payload;
                draft.errors = draft.items.filter(item =>
                    (action.payload === '-- ALL --'
                    || action.payload === item.module)
                    && item.level === 'E').length;
                draft.warnings = draft.items.filter(item =>
                    (action.payload === '-- ALL --'
                    || action.payload === item.module)
                    && item.level === 'W').length;
                break;
            }
            case FILTER_BY_ERRORS: {
                draft.filters.errorsOnly = !draft.filters.errorsOnly;
                break;
            }
            case FILTER_BY_WARNINGS: {
                draft.filters.warningsOnly = !draft.filters.warningsOnly;
                break;
            }
        }
    })
}

export function recieveLogEvent(logEvent) {
    return { type: RECIEVE_LOGS, payload: logEvent };
}

export function fitlerByErrors() {
    return { type: FILTER_BY_ERRORS };
}

export function fitlerByWarnings() {
    return { type: FILTER_BY_WARNINGS};
}

export function selectModule(moduleName) {
    return { type: SELECT_MODULE, payload: moduleName};
}