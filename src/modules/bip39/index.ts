export * from './domain/state';
export * from './domain/boxCalculations';
export * from './domain/boxDisableRules';
export * from './domain/wordValidation';

export { 
  determineUILanguage, 
  getGitHashOrDefault, 
  validateModalElement, 
  validateButtonElements 
} from './domain/mainHelpers';

export { 
  MODAL_TRANSITION_DURATION,
  getModalTransitionDuration,
  isEscapeKey,
  isModalOpen,
  shouldCloseOnKey,
  validateModalElements 
} from './domain/modalLogic';

export { elements } from './infrastructure/elements';
export * from './infrastructure/wordlist';
