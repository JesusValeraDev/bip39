import { toggleBox } from '../../bip39';
import { elements } from '../../bip39';
import { updateDisplay } from '../../display';
import { showDisabledBoxToast } from '../../display';
import { generateAllBoxConfigs } from '../../bip39';

export function createGrid(): void {
  elements.grid.innerHTML = '';

  const boxConfigs = generateAllBoxConfigs();

  boxConfigs.forEach(config => {
    const box = createBoxElement(config);
    attachBoxClickHandler(box, config.index);
    elements.grid.appendChild(box);
  });

  updateDisplay();
}

function createBoxElement(config: { index: number; bitValue: number; ariaLabel: string }): HTMLButtonElement {
  const box = document.createElement('button');
  box.className = 'box';
  box.dataset.index = config.index.toString();
  box.type = 'button';
  box.setAttribute('aria-pressed', 'false');
  box.setAttribute('aria-label', config.ariaLabel);

  const label = document.createElement('span');
  label.className = 'bit-label';
  label.textContent = config.bitValue.toString();
  label.setAttribute('aria-hidden', 'true');
  box.appendChild(label);

  return box;
}

function attachBoxClickHandler(box: HTMLButtonElement, index: number): void {
  box.addEventListener('click', () => {
    if (box.dataset.isDisabled === 'true') {
      showDisabledBoxToast();
      return;
    }
    toggleBox(index);
    updateDisplay();
  });
}
