import { ComponentFixture, flush, tick } from "@angular/core/testing";
import { defaultKeyboardContext, dispatchBlurEvent, dispatchEvent, dispatchInputEvent, dispatchKeyboardKeydownEvent, dispatchKeyboardKeypressEvent, dispatchMouseDownEvent, KeyboardContext } from "./dispatch";

export type PageSettings = {
    fakeAsync: boolean
}

export const defaultPageSettings: PageSettings = { fakeAsync: true };

export abstract class Page {
    private _rootElement: HTMLElement;

    constructor(private fixture: ComponentFixture<any>, private options: PageSettings = defaultPageSettings, element?: HTMLElement) {
        this._rootElement = element ? element : fixture.nativeElement;
    }

    public get root(): HTMLElement {
        return this._rootElement;
    }

    public detectChanges() {
        this.fixture.detectChanges();
    }

    public select<TElement extends HTMLElement>(selector: string, context: HTMLElement = this.root): TElement | null {
        return context.querySelector<TElement>(selector);
    }

    public selectMany<TElement extends HTMLElement>(selector: string, context: HTMLElement = this.root): TElement[] {
        return Array.from<TElement>(context.querySelectorAll(selector));
    }

    public click(button: HTMLElement) {
        button.focus();
        button.click();
        this.waitForAngular();
    }

    public dispatchEvent(element: HTMLElement, event: string, markAsTouched: boolean = false) {
        dispatchEvent(element, event)

        if (markAsTouched)
            dispatchBlurEvent(element);

        this.waitForAngular();
    }

    public dispatchInputEvent(element: HTMLInputElement, value: string, markAsTouched: boolean = false) {
        dispatchInputEvent(element, value);

        if (markAsTouched)
            dispatchBlurEvent(element);

        this.waitForAngular();
    }

    public dispatchMouseDownEvent(element: HTMLElement) {
        dispatchMouseDownEvent(element);
        this.waitForAngular();
    }

    public dispatchKeydownEvent(element: HTMLElement, keyCode: number, ctx: KeyboardContext = defaultKeyboardContext) {
        dispatchKeyboardKeydownEvent(element, keyCode, ctx);
        this.waitForAngular();
    }

    public dispatchKeypressEvent(element: HTMLElement, key: string, ctx: KeyboardContext = defaultKeyboardContext) {
        const keyboardCtx = { ...ctx, key: key };
        dispatchKeyboardKeypressEvent(element, 0, keyboardCtx);
        this.waitForAngular();
    }

    public waitForAngular(timeoutMs?: number) {
        if (!this.options.fakeAsync)
            return;

        tick(timeoutMs);
        this.detectChanges();

        flush();
        this.detectChanges();
    }
}
