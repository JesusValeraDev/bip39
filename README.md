# BIP39 Word Selector

[![Tests](https://github.com/JesusValeraDev/bip39/actions/workflows/test.yml/badge.svg)](https://github.com/JesusValeraDev/bip39/actions/workflows/test.yml)
[![Lighthouse CI](https://github.com/JesusValeraDev/bip39/actions/workflows/lighthouse.yml/badge.svg)](https://github.com/JesusValeraDev/bip39/actions/workflows/lighthouse.yml)
[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://bip39.jesusvalera.dev)

> **Bidirectional** Bitcoin BIP39 mnemonic word selector and converter tool

An interactive, privacy-focused web application for exploring the BIP39 wordlist. **Type words or click numbers**. Perfect for understanding how Bitcoin seed phrases work.

## How It Works

### Method 1: Type a Word

Simply type any BIP39 word in the input field. The numbers will automatically update to show the binary pattern.

### Method 2: Click Numbers

Click the number boxes (2048, 1024, 512, etc.) to create a binary pattern. The corresponding BIP39 word appears automatically.

Each number represents a binary bit. Combining them creates values from 1-2048, matching the 2048 BIP39 words.

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

### Testing

The project includes comprehensive test coverage with unit, integration, and end-to-end tests.

```bash
# Run Unit
npm run test:unit

# Run Integration
npm run test:integration

# Run E2E
npm run test:e2e

# Run all Tests (Unit + Integration + E2E)
npm run test:all
```
