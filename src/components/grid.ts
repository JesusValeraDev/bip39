import { toggleBox } from '../core/state';
import { elements } from '../core/dom';
import { updateDisplay } from './display';
import { showDisabledBoxToast } from './toast';

export function createGrid(): void {
  elements.grid.innerHTML = '';

  for (let i = 0; i < 12; i++) {
    const box = document.createElement('button');
    box.className = 'box';
    box.dataset.index = i.toString();
    box.type = 'button';

    const bitValue = Math.pow(2, 11 - i);
    box.setAttribute('aria-pressed', 'false');
    box.setAttribute('aria-label', `Bit ${i + 1}, value ${bitValue}`);

    const label = document.createElement('span');
    label.className = 'bit-label';
    label.textContent = bitValue.toString();
    label.setAttribute('aria-hidden', 'true');
    box.appendChild(label);

    box.addEventListener('click', () => {
      if (box.dataset.isDisabled === 'true') {
        showDisabledBoxToast();
        return;
      }
      toggleBox(i);
      updateDisplay();
    });

    elements.grid.appendChild(box);
  }

  updateDisplay();
}
