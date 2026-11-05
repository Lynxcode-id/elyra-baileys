export class Poll extends BaseBuilder {
    constructor(client: any);
    _name: string;
    _values: any[];
    _selectableCount: number;
    _hideVoter: boolean;
    _canAddOption: boolean;
    _toAnnouncementGroup: boolean;
    _correctAnswer: string;
    _endDate: Date;
    setName(name: any): this;
    addOption(name: any): this;
    addOptions(names: string[]): this;
    setSelectable(count: any): this;
    setMultiSelect(canSelectMultiple?: boolean): this;
    setHideVoter(hide?: boolean): this;
    setCanAddOption(allow?: boolean): this;
    setAnnouncementGroup(isAnnouncement?: boolean): this;
    setEndDate(date: any): this;
    setQuiz(correctOptionName: string): this;
    build(): {
        poll: Record<string, any>;
    };
    send(jid: any, options?: {}): Promise<any>;
    #private;
}
import { BaseBuilder } from './shared.js';
