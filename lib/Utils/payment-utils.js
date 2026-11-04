

export function buildPaymentAccount(accountType, identifierType, identifier, institution, beneficiaryName) {
	return {
		type: 'payment_account',
		payment_account: {
			account_type: accountType,
			identifier_type: identifierType,
			identifier_value: identifier,
			institution_name: institution,
			beneficiary_name: beneficiaryName,
		},
	};
}

export function buildPaymentParams({ amount, item, note = '', done = false, accounts = [] } = {}) {
	if (typeof amount !== 'number' || !Number.isFinite(amount)) {
		throw new TypeError('buildPaymentParams: spec.amount must be a finite number');
	}
	if (typeof item !== 'string' || !item) {
		throw new TypeError('buildPaymentParams: spec.item must be a non-empty string');
	}

	const value = amount * 100;
	const money = { value, offset: 100 };

	if (done) {
		const refId = `CPAY-${Date.now()}`;
		const item_ = {
			retailer_id: `item-${Date.now()}${Math.floor(Math.random() * 1e6)}`,
			name: item,
			amount: money,
			quantity: 1,
		};

		return JSON.stringify({
			currency: 'IDR',
			total_amount: money,
			reference_id: refId,
			type: 'physical-goods',
			additional_note: note,
			native_payment_methods: [],
			share_payment_status: true,
			payment_type: '',
			payment_method: 'confirm',
			payment_status: 'captured',
			payment_timestamp: Date.now(),
			payment_configuration: '',
			order: {
				status: 'completed',
				order_type: 'PAYMENT_REQUEST',
				subtotal: money,
				items: [item_],
			},
		});
	}

	if (!accounts.length) {
		throw new TypeError('buildPaymentParams: spec.accounts is required (and non-empty) when spec.done is not true');
	}

	const refId = `PAY-${Date.now()}`;
	const item_ = {
		name: item,
		amount: money,
		quantity: 1,
		description: note,
	};

	return JSON.stringify({
		currency: 'IDR',
		total_amount: money,
		reference_id: refId,
		type: 'physical-goods',
		additional_note: note,
		native_payment_methods: [],
		share_payment_status: false,
		payment_configuration: '',
		payment_type: 'upr',
		payment_settings: accounts,
		order: {
			status: 'pending',
			description: note,
			order_type: 'PAYMENT_REQUEST',
			items: [item_],
			subtotal: money,
			tax: { value: 0, offset: 100 },
			shipping: { value: 0, offset: 100 },
			discount: { value: 0, offset: 100 },
		},
	});
}

export async function sendPayment(client, jid, spec, { title = '', body = '', footer = '', image } = {}) {
	const { Button } = await import('../Builders/index.js');
	const params = buildPaymentParams(spec);
	const btn = new Button(client);

	if (title) btn.setTitle(title);
	if (body) btn.setBody(body);
	if (footer) btn.setFooter(footer);
	if (image) btn.setImage(image);

	btn.addButton('review_and_pay', params);

	return btn.send(jid);
}

export const Pay = sendPayment;
