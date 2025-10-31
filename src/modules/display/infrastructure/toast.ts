import { currentTranslations } from '../../language';

const toastTimers = new Map<
  string,
  {
    show: NodeJS.Timeout | null;
    hide: NodeJS.Timeout | null;
    remove: NodeJS.Timeout | null;
  }
>();

let clickCount = 0;
let clickResetTimeout: NodeJS.Timeout | null = null;

export function showDisabledBoxToast(): void {
  clickCount++;

  if (clickResetTimeout) {
    clearTimeout(clickResetTimeout);
  }
  clickResetTimeout = setTimeout(() => {
    clickCount = 0;
  }, 2000);

  // Show toast only after 2+ clicks
  if (clickCount >= 2) {
    showToast('toast-notification', currentTranslations.disabledBoxMessage);
    clickCount = 0;
  }
}

export function showToast(id: string, message: string, duration: number = 3000, className: string = 'toast'): void {
  cleanupExistingToast(id);
  const toast = createToastElement(id, message, className);
  scheduleToastAnimations(id, toast, duration);
}

function cleanupExistingToast(id: string): void {
  const existingToast = document.getElementById(id);
  existingToast?.remove();

  clearToastTimers(id);
}

function clearToastTimers(id: string): void {
  const timers = toastTimers.get(id);
  if (timers) {
    if (timers.show) clearTimeout(timers.show);
    if (timers.hide) clearTimeout(timers.hide);
    if (timers.remove) clearTimeout(timers.remove);
  }
}

function createToastElement(id: string, message: string, className: string): HTMLElement {
  const toast = document.createElement('div');
  toast.id = id;
  toast.className = className;
  toast.textContent = message;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');
  document.body.appendChild(toast);

  return toast;
}

function scheduleToastAnimations(id: string, toast: HTMLElement, duration: number): void {
  toastTimers.set(id, { show: null, hide: null, remove: null });
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const timers = toastTimers.get(id)!;

  timers.show = setTimeout(() => toast.classList.add('show'), 10);

  timers.hide = setTimeout(() => {
    toast.classList.remove('show');
    timers.remove = setTimeout(() => {
      toast.remove();
      toastTimers.delete(id);
    }, 300);
  }, duration);
}
