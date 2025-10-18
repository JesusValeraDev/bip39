export const MODAL_TRANSITION_DURATION = 300; // milliseconds

export function isEscapeKey(key: string): boolean {
  return key === 'Escape';
}

export function isModalOpen(ariaHidden: string | null): boolean {
  return ariaHidden === 'false';
}

export function getModalTransitionDuration(): number {
  return MODAL_TRANSITION_DURATION;
}

export function shouldCloseOnKey(key: string, modalOpen: boolean): boolean {
  return isEscapeKey(key) && modalOpen;
}

export function validateModalElements(button: unknown, modal: unknown, closeButton: unknown): boolean {
  return button !== null && modal !== null && closeButton !== null;
}
