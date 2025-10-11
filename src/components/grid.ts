import { toggleBox } from '../core/state';
import { elements } from '../core/dom';
import { updateDisplay } from './display';

export function createGrid(): void {
  elements.grid.innerHTML = '';

  for (let i = 0; i < 12; i++) {
    const box = document.createElement('button');
    box.className = 'box';
    box.dataset.index = i.toString();
    box.type = 'button';

    const bitValue = Math.pow(2, 11 - i);
    box.setAttribute('role', 'switch');
    box.setAttribute('aria-checked', 'false');
    box.setAttribute('aria-label', `Bit ${i + 1}, value ${bitValue}`);
    box.setAttribute('tabindex', '0');

    const label = document.createElement('span');
    label.className = 'bit-label';
    label.textContent = bitValue.toString();
    label.setAttribute('aria-hidden', 'true');
    box.appendChild(label);

    box.addEventListener('click', () => {
      toggleBox(i);
      updateDisplay();
    });

    box.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleBox(i);
        updateDisplay();
      }
    });

    elements.grid.appendChild(box);
  }

  updateDisplay();
}
