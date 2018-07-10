import { tick } from "@angular/core/testing";

export const getTextValue = (element: HTMLElement) => { return element.textContent ? element.textContent.trim() : ""; }
export const tickAnimationFrame = () => tick(16);
