import { currentTranslations } from '../services/language';

let toastTimeout: NodeJS.Timeout | null = null;
let clickCount = 0;
let clickResetTimeout: NodeJS.Timeout | null = null;

export function showDisabledBoxToast(): void {
  clickCount++;

  // Reset click count after 2 seconds of no clicks
  if (clickResetTimeout) {
    clearTimeout(clickResetTimeout);
  }
  clickResetTimeout = setTimeout(() => {
    clickCount = 0;
  }, 2000);

  // Show toast only after 2+ clicks
  if (clickCount >= 2) {
    showToast(currentTranslations.disabledBoxMessage);
    clickCount = 0; // Reset after showing
  }
}

// Exported for testing
export function resetToastState(): void {
  clickCount = 0;
  if (clickResetTimeout) {
    clearTimeout(clickResetTimeout);
    clickResetTimeout = null;
  }
  if (toastTimeout) {
    clearTimeout(toastTimeout);
    toastTimeout = null;
  }
}

function showToast(message: string): void {
  // Remove existing toast if any
  const existingToast = document.getElementById('toast-notification');
  if (existingToast) {
    existingToast.remove();
  }

  // Clear existing timeout
  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  // Create toast element
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
