import { toggleBox } from '../core/state';
import { elements } from '../core/dom';
import { updateDisplay } from './display';

export function createGrid(): void {
  elements.grid.innerHTML = '';
  
  for (let i = 0; i < 12; i++) {
    const box = document.createElement('div');
    box.className = 'box';
    box.dataset.index = i.toString();
    
    // Add bit label showing the power of 2 value
    const label = document.createElement('span');
    label.className = 'bit-label';
    const bitValue = Math.pow(2, 11 - i);
    label.textContent = bitValue.toString();
    box.appendChild(label);
    
    box.addEventListener('click', () => {
      toggleBox(i);
      updateDisplay();
    });
    elements.grid.appendChild(box);
  }
  
  updateDisplay();
}
