export const dispatchEvent = (element: EventTarget, eventType: string): boolean => element.dispatchEvent(createEvent(eventType));

export const dispatchInputEvent = (element: HTMLInputElement | HTMLTextAreaElement, value: string): boolean => {
    element.value = value;
    return dispatchEvent(element, 'input');
}

export const dispatchBlurEvent = (element: HTMLElement) => dispatchEvent(element, 'blur');

export const dispatchMouseDownEvent = (element: HTMLElement) => dispatchEvent(element, "mousedown");

export const defaultMouseEventOptions: MouseEventInit = {
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    clientX: 0,
    clientY: 0
};

export function dispatchMouseEvent(element: EventTarget, eventType: string, options: MouseEventInit = defaultMouseEventOptions) {
    const mouseOptions = { ...defaultMouseEventOptions, ...options, bubbles: true };
    const mouseEvent = new MouseEvent(eventType, mouseOptions);
    return element.dispatchEvent(mouseEvent);
}

export const createEvent = (type: string, bubbles: boolean = true, cancelable: boolean = true): Event => {
    let evt: Event = document.createEvent('Event');
    evt.initEvent(type, bubbles, cancelable);
    return evt;
}

export type KeyboardContext = {
    ctrlKey: boolean,
    altKey: boolean,
    shiftKey: boolean,
    metaKey: boolean,
    canBubble: boolean,
    cancelable: boolean,
    view: Window | any,
    key: string
}

export const defaultKeyboardContext: KeyboardContext = {
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    canBubble: true,
    cancelable: true,
    view: null,
    key: ''
}

export const dispatchKeyboardEvent = (eventType: string) => (element: HTMLElement, keyCode: number, ctx: KeyboardContext = defaultKeyboardContext) => {
    const keyBoardCtx = { ...defaultKeyboardContext, ...ctx };
    const { ctrlKey, altKey, shiftKey, metaKey, canBubble, cancelable, view, key } = keyBoardCtx;
    const event: any = element.ownerDocument.createEvent('KeyboardEvent');
    Object.defineProperty(event, 'keyCode', { get: () => event.keyCodeVal });
    Object.defineProperty(event, 'which', { get: () => event.keyCodeVal });
    Object.defineProperty(event, 'key', { get: () => key });

    // to support deprecated browsers
    if (event.initKeyboardEvent) {
        const wnd: any = window;
        if (wnd['chrome'] && !/Edge/.test(navigator.appVersion))
            event.initKeyboardEvent(eventType, canBubble, cancelable, view, "", 0, ctrlKey, altKey, shiftKey, metaKey);
        else {
            let modifiers = (shiftKey ? "Shift " : "") + (ctrlKey ? "Control " : "") + (altKey ? "Alt " : "") + (metaKey ? "Meta" : "");
            event.initKeyboardEvent(eventType, canBubble, cancelable, view, "", 0, modifiers, false, "en");
        }
    } else
        event.initKeyEvent(eventType, canBubble, cancelable, view, ctrlKey, altKey, shiftKey, metaKey, keyCode, 0);


    event.keyCodeVal = keyCode;

    if (event.keyCode !== keyCode) {
        throw new Error(`keyCode mismatch ${event.keyCode} (${event.which})`);
    }

    return element.dispatchEvent(event);
}

export const dispatchKeyboardKeydownEvent = dispatchKeyboardEvent('keydown');
export const dispatchKeyboardKeypressEvent = dispatchKeyboardEvent('keypress');
