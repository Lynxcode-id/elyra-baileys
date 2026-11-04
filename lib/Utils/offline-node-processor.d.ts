export function makeOfflineNodeProcessor(nodeProcessorMap: any, deps: any, batchSize?: number): {
    enqueue: (type: any, node: any) => void;
};
