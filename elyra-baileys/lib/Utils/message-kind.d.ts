export function resolveButtonAddonKind(message: any): WaButtonAddonKind | null;
export function parseInteractiveReply(message: any): NormalizedInteractiveReply;
export type WaButtonAddonKind = "list" | "interactive" | "payment_info" | "order_details";
export type NormalizedInteractiveReply = {
    kind: "buttons_response" | "list_response" | "native_flow_response" | "template_button_reply" | null;
    id: string | null;
    displayText: string | null;
    params: any | null;
};
