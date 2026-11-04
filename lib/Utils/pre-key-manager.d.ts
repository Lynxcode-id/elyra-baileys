export class PreKeyManager {
    constructor(store: any, logger: any);
    store: any;
    logger: any;
    queues: Map<any, any>;
    getQueue(keyType: any): any;
    processOperations(data: any, keyType: any, transactionCache: any, mutations: any, isInTransaction: any): Promise<any>;
    processDeletions(keyType: any, ids: any, transactionCache: any, mutations: any, isInTransaction: any): Promise<void>;
    validateDeletions(data: any, keyType: any): Promise<any>;
}
