export function buildPaymentAccount(accountType: "bank_account" | "digital_wallet", identifierType: "id_account_number" | "phone_number", identifier: string, institution: string, beneficiaryName: string): {
    type: string;
    payment_account: {
        account_type: "bank_account" | "digital_wallet";
        identifier_type: "id_account_number" | "phone_number";
        identifier_value: string;
        institution_name: string;
        beneficiary_name: string;
    };
};
export function buildPaymentParams(opts3?: { [key: string]: any;
    amount: number;
    item: string;
    note?: string;
    done?: boolean;
    accounts?: object[];
}): string;
export function sendPayment(client: any, jid: string, spec: object, opts1?: { [key: string]: any;
    title?: string;
    body?: string;
    footer?: string;
    image?: string;
}): Promise<any>;
export function Pay(client: any, jid: string, spec: object, opts2?: { [key: string]: any;
    title?: string;
    body?: string;
    footer?: string;
    image?: string;
}): Promise<any>;
