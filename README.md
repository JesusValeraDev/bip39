# BIP39 Word Selector

An interactive web application for exploring the BIP39 wordlist through a visual binary pattern selector.

## Features

- 🎯 **12-Box Grid**: Click boxes to create binary patterns
- 🔢 **Binary to Word Mapping**: Each pattern maps to a specific BIP39 word
- 🌍 **Multi-Language UI**: Interface available in 9 languages (English, Spanish, French, German, Italian, Portuguese, Chinese, Japanese, Korean)
- 📝 **Multi-Language Wordlists**: Choose from 10 different BIP39 wordlists
- 🎨 **Modern UI**: Beautiful, responsive design with smooth animations
- 🌓 **Dark/Light Mode**: Toggle between dark and light themes with preference persistence
- 🔄 **Reset Function**: Quickly clear all selections
- 📊 **Real-time Display**: See the binary pattern, word index, and selected word

## How It Works

The application displays 12 clickable boxes arranged in a grid. Each box represents a bit (0 or 1):
- **Unselected box** = 0 (off)
- **Selected box** = 1 (on)

The 12 boxes create a binary number from `000000000000` to `111111111111` (0-4095 in decimal), which maps to one of the 2048 words in the BIP39 wordlist (using modulo 2048).

## Getting Started

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

This will start a local server at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## BIP39 Wordlist

This project includes the official BIP39 wordlists in multiple languages:

- English
- Chinese (Simplified & Traditional)
- Czech
- French
- Italian
- Japanese
- Korean
- Portuguese
- Spanish

You can switch between languages using the dropdown selector in the app. Your language preference is automatically saved.

## Tech Stack

- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **Vanilla CSS**: Modern, responsive styling
- **BIP39**: Standard for mnemonic code generation

## License

MIT
