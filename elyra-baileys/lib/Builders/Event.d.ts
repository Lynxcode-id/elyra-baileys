export class Event extends BaseBuilder {
    static #toSec(v: any, label: any): number;
    constructor(client: any);
    _name: string;
    _description: string;
    _start: number;
    _end: number;
    _location: {
        degreesLatitude?: number;
        degreesLongitude?: number;
        name?: string;
        address?: string;
    };
    _call: any;
    _cancelled: boolean;
    _extraGuests: boolean;
    _scheduleCall: boolean;
    _reminderOffsetSec: any;
    _botFbids: any[];
    setName(name: any): this;
    setDescription(text: any): this;
    setStart(when: Date | number): this;
    setEnd(when: Date | number): this;
    setLocation(location: {
        degreesLatitude?: number;
        degreesLongitude?: number;
        name?: string;
        address?: string;
    }): this;
    setCall(kind: any): this;
    setCancelled(v?: boolean): this;
    setExtraGuestsAllowed(v?: boolean): this;
    setScheduleCall(v?: boolean): this;
    setReminder(seconds: any): this;
    clearReminder(): this;
    setBotFbid(...fbids: any[]): this;
    build(): {
        event: object;
    };
    send(jid: any, options?: {}): Promise<any>;
    #private;
}
import { BaseBuilder } from './shared.js';
