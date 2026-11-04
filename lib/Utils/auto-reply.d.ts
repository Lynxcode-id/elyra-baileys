export class AutoReplyHandler {
    constructor(sendMessage: any, sendPresence: any, options?: {});
    rules: Map<any, any>;
    cooldowns: Map<any, any>;
    globalCooldown: Map<any, any>;
    sendMessage: any;
    sendPresence: any;
    options: {
        globalCooldown: any;
        simulateTyping: any;
        typingDuration: any;
        multiMatch: any;
        onReply: any;
        onError: any;
    };
    generateId(): string;
    addRule(rule: any): any;
    removeRule(id: any): boolean;
    getRules(): any[];
    getRule(id: any): any;
    setRuleActive(id: any, active: any): boolean;
    clearRules(): void;
    checkCooldown(ruleId: any, jid: any): boolean;
    checkGlobalCooldown(jid: any): boolean;
    setCooldown(ruleId: any, jid: any, cooldown: any): void;
    matchRule(text: any, rule: any): any;
    isJidAllowed(jid: any, rule: any): boolean;
    processMessage(message: any): Promise<boolean>;
}
export function createAutoReply(sendMessage: any, sendPresence: any, options: any): AutoReplyHandler;
