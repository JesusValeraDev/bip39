// Translations for the UI
export interface Translations {
  title: string;
  subtitle: string;
  languageLabel: string;
  selectedWord: string;
  resetButton: string;
  pickPattern: string;
  outOfRange: string;
  binaryPattern: string;
  infoText: string;
  privacyTooltip: string;
}

// Map wordlist language codes to UI language codes
export const wordlistToUILang: Record<string, string> = {
  'english': 'en',
  'spanish': 'es',
  'french': 'fr',
  'italian': 'it',
  'portuguese': 'pt',
  'chinese_simplified': 'zh',
  'chinese_traditional': 'zh',
  'japanese': 'ja',
  'korean': 'ko',
  'czech': 'cs',
};

export const translations: Record<string, Translations> = {
  en: {
    title: 'BIP39 Word Selector',
    subtitle: 'Click the boxes to select a word from the BIP39 wordlist',
    languageLabel: 'Language:',
    selectedWord: 'Selected Word:',
    resetButton: 'Reset',
    pickPattern: 'Pick a pattern',
    outOfRange: 'Out of range (max 2048)',
    binaryPattern: 'Binary pattern:',
    infoText: 'Each box represents a bit. The 12 boxes create a number from 0-4095, which maps to one of the 2048 BIP39 words.',
    privacyTooltip: 'Your privacy is protected: This application runs entirely in your browser. No data is transmitted, stored, or tracked. Everything stays on your device.',
  },
  es: {
    title: 'Selector de Palabras BIP39',
    subtitle: 'Haz clic en las casillas para seleccionar una palabra de la lista BIP39',
    languageLabel: 'Idioma:',
    selectedWord: 'Palabra Seleccionada:',
    resetButton: 'Reiniciar',
    pickPattern: 'Elige un patrón',
    outOfRange: 'Fuera de rango (máx 2048)',
    binaryPattern: 'Patrón binario:',
    infoText: 'Cada casilla representa un bit. Las 12 casillas crean un número de 0-4095, que corresponde a una de las 2048 palabras BIP39.',
    privacyTooltip: 'Tu privacidad está protegida: Esta aplicación se ejecuta completamente en tu navegador. No se transmite, almacena ni rastrea ningún dato. Todo permanece en tu dispositivo.',
  },
  fr: {
    title: 'Sélecteur de Mots BIP39',
    subtitle: 'Cliquez sur les cases pour sélectionner un mot de la liste BIP39',
    languageLabel: 'Langue:',
    selectedWord: 'Mot Sélectionné:',
    resetButton: 'Réinitialiser',
    pickPattern: 'Choisissez un motif',
    outOfRange: 'Hors limites (max 2048)',
    binaryPattern: 'Motif binaire:',
    infoText: 'Chaque case représente un bit. Les 12 cases créent un nombre de 0-4095, qui correspond à l\'un des 2048 mots BIP39.',
    privacyTooltip: 'Votre confidentialité est protégée : Cette application s\'exécute entièrement dans votre navigateur. Aucune donnée n\'est transmise, stockée ou suivie. Tout reste sur votre appareil.',
  },
  it: {
    title: 'Selettore di Parole BIP39',
    subtitle: 'Clicca sulle caselle per selezionare una parola dalla lista BIP39',
    languageLabel: 'Lingua:',
    selectedWord: 'Parola Selezionata:',
    resetButton: 'Ripristina',
    pickPattern: 'Scegli un pattern',
    outOfRange: 'Fuori intervallo (max 2048)',
    binaryPattern: 'Pattern binario:',
    infoText: 'Ogni casella rappresenta un bit. Le 12 caselle creano un numero da 0-4095, che corrisponde a una delle 2048 parole BIP39.',
    privacyTooltip: 'La tua privacy è protetta: Questa applicazione viene eseguita interamente nel tuo browser. Nessun dato viene trasmesso, memorizzato o tracciato. Tutto rimane sul tuo dispositivo.',
  },
  pt: {
    title: 'Seletor de Palavras BIP39',
    subtitle: 'Clique nas caixas para selecionar uma palavra da lista BIP39',
    languageLabel: 'Idioma:',
    selectedWord: 'Palavra Selecionada:',
    resetButton: 'Reiniciar',
    pickPattern: 'Escolha um padrão',
    outOfRange: 'Fora do alcance (máx 2048)',
    binaryPattern: 'Padrão binário:',
    infoText: 'Cada caixa representa um bit. As 12 caixas criam um número de 0-4095, que mapeia para uma das 2048 palavras BIP39.',
    privacyTooltip: 'Sua privacidade está protegida: Este aplicativo é executado inteiramente no seu navegador. Nenhum dado é transmitido, armazenado ou rastreado. Tudo permanece no seu dispositivo.',
  },
  zh: {
    title: 'BIP39 单词选择器',
    subtitle: '点击方框从 BIP39 单词列表中选择一个单词',
    languageLabel: '语言：',
    selectedWord: '选定的单词：',
    resetButton: '重置',
    pickPattern: '选择一个模式',
    outOfRange: '超出范围（最大 2048）',
    binaryPattern: '二进制模式：',
    infoText: '每个方框代表一个位。12 个方框创建一个从 0-4095 的数字，对应 2048 个 BIP39 单词之一。',
    privacyTooltip: '您的隐私受到保护：此应用程序完全在您的浏览器中运行。不会传输、存储或跟踪任何数据。所有内容都保留在您的设备上。',
  },
  ja: {
    title: 'BIP39 ワードセレクター',
    subtitle: 'ボックスをクリックして BIP39 ワードリストから単語を選択',
    languageLabel: '言語：',
    selectedWord: '選択された単語：',
    resetButton: 'リセット',
    pickPattern: 'パターンを選択',
    outOfRange: '範囲外（最大 2048）',
    binaryPattern: 'バイナリパターン：',
    infoText: '各ボックスは1ビットを表します。12個のボックスは0-4095の数値を作成し、2048個のBIP39単語の1つにマッピングされます。',
    privacyTooltip: 'プライバシーは保護されています：このアプリケーションはブラウザ内で完全に動作します。データの送信、保存、追跡は一切行われません。すべてがデバイス内に留まります。',
  },
  ko: {
    title: 'BIP39 단어 선택기',
    subtitle: 'BIP39 단어 목록에서 단어를 선택하려면 상자를 클릭하세요',
    languageLabel: '언어:',
    selectedWord: '선택된 단어:',
    resetButton: '재설정',
    pickPattern: '패턴 선택',
    outOfRange: '범위 초과 (최대 2048)',
    binaryPattern: '이진 패턴:',
    infoText: '각 상자는 비트를 나타냅니다. 12개의 상자는 0-4095 범위의 숫자를 만들며, 2048개의 BIP39 단어 중 하나에 매핑됩니다.',
    privacyTooltip: '개인정보가 보호됩니다: 이 애플리케이션은 브라우저에서 완전히 실행됩니다. 데이터 전송, 저장 또는 추적이 없습니다. 모든 것이 기기에 남아 있습니다.',
  },
  cs: {
    title: 'BIP39 Výběr Slov',
    subtitle: 'Klikněte na pole pro výběr slova ze seznamu BIP39',
    languageLabel: 'Jazyk:',
    selectedWord: 'Vybrané slovo:',
    resetButton: 'Resetovat',
    pickPattern: 'Vyberte vzor',
    outOfRange: 'Mimo rozsah (max 2048)',
    binaryPattern: 'Binární vzor:',
    infoText: 'Každé pole představuje jeden bit. 12 polí vytvoří číslo od 0 do 4095, které odpovídá jednomu z 2048 slov BIP39.',
    privacyTooltip: 'Vaše soukromí je chráněno: Tato aplikace běží zcela ve vašem prohlížeči. Žádná data nejsou přenášena, ukládána ani sledována. Vše zůstává ve vašem zařízení.',
  },
};

export function getTranslation(lang: string): Translations {
  return translations[lang] || translations.en;
}
