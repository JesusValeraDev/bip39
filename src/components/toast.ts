import { currentTranslations } from '../services/language';

let toastTimeout: NodeJS.Timeout | null = null;
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
    showToast(currentTranslations.disabledBoxMessage);
    clickCount = 0;
  }
}

function showToast(message: string): void {
  const existingToast = document.getElementById('toast-notification');
  if (existingToast) {
    existingToast.remove();
  }

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  const toast = document.createElement('div');
  toast.id = 'toast-notification';
  toast.className = 'toast';
  toast.textContent = message;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');

  document.body.appendChild(toast);

  // Use setTimeout instead of requestAnimationFrame for better testability
  setTimeout(() => {
    toast.classList.add('show');
  }, 0);

  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300); // Wait for fade out animation
  }, 3000);
}
