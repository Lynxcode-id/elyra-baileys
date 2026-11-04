import { Boom } from '@hapi/boom';
import { randomBytes } from 'crypto';
import { proto } from '../../WAProto/index.js';
const indexCache = new WeakMap();
export const getBinaryNodeChildren = (node, childTag) => {
    if (!node || !Array.isArray(node.content))
        return [];
    let index = indexCache.get(node);
    if (!index) {
        index = new Map();
        for (const child of node.content) {
            let arr = index.get(child.tag);
            if (!arr)
                index.set(child.tag, (arr = []));
            arr.push(child);
        }
        indexCache.set(node, index);
    }
    return index.get(childTag) || [];
};
export const getBinaryNodeChild = (node, childTag) => {
    return getBinaryNodeChildren(node, childTag)[0];
};
export const getAllBinaryNodeChildren = ({ content }) => {
    if (Array.isArray(content)) {
        return content;
    }
    return [];
};
export const getBinaryNodeChildBuffer = (node, childTag) => {
    const child = getBinaryNodeChild(node, childTag)?.content;
    if (Buffer.isBuffer(child) || child instanceof Uint8Array) {
        return child;
    }
};
export const getBinaryNodeChildString = (node, childTag) => {
    const child = getBinaryNodeChild(node, childTag)?.content;
    if (Buffer.isBuffer(child) || child instanceof Uint8Array) {
        return Buffer.from(child).toString('utf-8');
    }
    else if (typeof child === 'string') {
        return child;
    }
};
export const getBinaryFilteredButtons = (nodeContent) => {
    if (!Array.isArray(nodeContent)) return false;
    return nodeContent.some(a => ['native_flow'].includes(a?.content?.[0]?.content?.[0]?.tag) ||
        ['interactive', 'buttons', 'list'].includes(a?.content?.[0]?.tag) ||
        ['hsm', 'biz'].includes(a?.tag));
};
export const getBinaryNodeFilter = (nodeContent) => {
    if (!Array.isArray(nodeContent)) return false;
    return getBinaryFilteredButtons(nodeContent) ||
        nodeContent.some(a => a?.tag === 'bot' && a?.attrs?.biz_bot === '1');
};
export const getBinaryNodeChildUInt = (node, childTag, length) => {
    const buff = getBinaryNodeChildBuffer(node, childTag);
    if (buff) {
        return bufferToUInt(buff, length);
    }
};
export const assertNodeErrorFree = (node) => {
    const errNode = getBinaryNodeChild(node, 'error');
    if (errNode) {
        throw new Boom(errNode.attrs.text || 'Unknown error', { data: +errNode.attrs.code });
    }
};
export const reduceBinaryNodeToDictionary = (node, tag) => {
    const nodes = getBinaryNodeChildren(node, tag);
    const dict = nodes.reduce((dict, { attrs }) => {
        if (typeof attrs.name === 'string') {
            dict[attrs.name] = attrs.value || attrs.config_value;
        }
        else {
            dict[attrs.config_code] = attrs.value || attrs.config_value;
        }
        return dict;
    }, {});
    return dict;
};
export const getBinaryNodeMessages = ({ content }) => {
    const msgs = [];
    if (Array.isArray(content)) {
        for (const item of content) {
            if (item.tag === 'message') {
                msgs.push(proto.WebMessageInfo.decode(item.content).toJSON());
            }
        }
    }
    return msgs;
};
function bufferToUInt(e, t) {
    let a = 0;
    for (let i = 0; i < t; i++) {
        a = 256 * a + e[i];
    }
    return a;
}
const tabs = (n) => '\t'.repeat(n);
export function binaryNodeToString(node, i = 0) {
    if (!node) {
        return node;
    }
    if (typeof node === 'string') {
        return tabs(i) + node;
    }
    if (node instanceof Uint8Array) {
        return tabs(i) + Buffer.from(node).toString('hex');
    }
    if (Array.isArray(node)) {
        return node.map(x => tabs(i + 1) + binaryNodeToString(x, i + 1)).join('\n');
    }
    const children = binaryNodeToString(node.content, i + 1);
    const tag = `<${node.tag} ${Object.entries(node.attrs || {})
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => `${k}='${v}'`)
        .join(' ')}`;
    const content = children ? `>\n${children}\n${tabs(i)}</${node.tag}>` : '/>';
    return tag + content;
}
const FLOWS_MAP = {
    mpm: true,
    catalog_message: true,
    cta_catalog: true,
    send_location: true,
    call_permission_request: true,
    wa_payment_transaction_details: true,
    automated_greeting_message_view_catalog: true,
    card_message: true,
    order_status: true,
    track_order: true,
    reorder: true,
    cancel_order: true,
    clear_chat: true,
    navigateToScreen: true,
    payment_status: true,
    payment_method: true,
    flow_action: true,
    voice_call: true,
    video_call_button: true,
    otp_button: true,
    authentication_button: true,
    cta_reminder: true,
    cta_cancel_reminder: true,
    flow: true,
    payment_key_info: '1',
    booking_confirmation: '1',
};
const DECISION_SOURCE_CONTENT = [
    {
        tag: 'decision_source',
        attrs: { value: 'df' }
    }
];
const LIST_TYPE_CONTENT = {
    tag: 'list',
    attrs: { v: '2', type: 'product_list' }
};
const NATIVE_FLOW_ATTRIBUTE = { type: 'native_flow', v: '1' };
const MIXED_NATIVE_FLOW = {
    tag: 'interactive',
    attrs: NATIVE_FLOW_ATTRIBUTE,
    content: [
        {
            tag: 'native_flow',
            attrs: { v: '9', name: 'mixed' }
        }
    ]
};
export const getBizBinaryNode = (message) => {
    const flowMsg = message.interactiveMessage?.nativeFlowMessage;
    const carouselMsg = message.interactiveMessage?.carouselMessage;
    const buttonsMsg = message.buttonsMessage;
    const firstButtonName =
        flowMsg?.buttons?.[0]?.name ??
        carouselMsg?.cards?.[0]?.nativeFlowMessage?.buttons?.[0]?.name ??
        buttonsMsg?.buttons?.[0]?.nativeFlowInfo?.name;
    const qualityContent = {
        tag: 'quality_control',
        attrs: {
            decision_id: randomBytes(20).toString('hex'),
            source_type: 'third_party'
        },
        content: DECISION_SOURCE_CONTENT
    };
    const bizAttributes = {
        actual_actors: '2',
        host_storage: '2',
        privacy_mode_ts: `${Date.now() / 1_000 | 0}`
    };
    const ORDER_RESPONSE_ALIAS = {
        review_and_pay: 'order_details',
        review_order: 'order_status',
        payment_info: 'payment_info',
        payment_status: 'payment_status',
        payment_method: 'payment_method',
        order_details: 'order_details',
        order_status: 'order_status',
        track_order: 'track_order',
        reorder: 'reorder',
        cancel_order: 'cancel_order',
        catalog_message: 'catalog_message',
        form_message: 'form_message',
    };
    if (firstButtonName && ORDER_RESPONSE_ALIAS[firstButtonName]) {
        bizAttributes.native_flow_name = ORDER_RESPONSE_ALIAS[firstButtonName];
        return {
            tag: 'biz',
            attrs: bizAttributes,
            content: [qualityContent]
        };
    }
    if (firstButtonName && FLOWS_MAP[firstButtonName]) {
        const flowVersion = typeof FLOWS_MAP[firstButtonName] === 'string' ? FLOWS_MAP[firstButtonName] : '2';
        const flowAttrs = firstButtonName === 'payment_key_info' ? { name: firstButtonName } : { v: flowVersion, name: firstButtonName };
        return {
            tag: 'biz',
            attrs: bizAttributes,
            content: [
                {
                    tag: 'interactive',
                    attrs: NATIVE_FLOW_ATTRIBUTE,
                    content: [
                        {
                            tag: 'native_flow',
                            attrs: flowAttrs
                        }
                    ]
                },
                qualityContent
            ]
        };
    }
    if (flowMsg || carouselMsg || message.buttonsMessage || message.templateMessage) {
        return {
            tag: 'biz',
            attrs: bizAttributes,
            content: [
                MIXED_NATIVE_FLOW,
                qualityContent
            ]
        };
    }
    if (message.listMessage) {
        return {
            tag: 'biz',
            attrs: bizAttributes,
            content: [
                LIST_TYPE_CONTENT,
                qualityContent
            ]
        };
    }
    return {
        tag: 'biz',
        attrs: bizAttributes,
        content: [qualityContent]
    };
};
