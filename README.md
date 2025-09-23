# Formative One - Regex Onboarding Hackathon

## Overview
This web-based application allows users to extract valid emails, URLs, phone numbers, credit card numbers, times (24hrs and 12hrs), HTML tags, hashtags, and currency values from any provided text. The application is built using HTML, CSS, and JavaScript.

It supports various use cases:
- Text Area Input: Users can type or paste text into a text area.
- Sample Input: A sample text is provided to test the app's functionality.
- File Upload: Users can upload a file or drag-and-drop a `.txt` file, and the app will load its content into the text area. Then press Extract.

## Features
- Phone Number Extraction:
  - Validates phone numbers in multiple formats, including local and international numbers.
  - Handles parentheses around area codes, dashes, spaces, and dots as separators.
  - Excludes invalid or excessively long phone numbers.
  - Handles international phone numbers starting with `+` and a country code.
- Email Extraction:
  - Validates email addresses in formats such as `user@example.com` and `firstname.lastname@company.co.uk`.
- Credit Card Validation:
  - Extracts valid credit card numbers (16 digits only).
  - Excludes repeated numbers (e.g., `4444 4444 4444 4444`).
- Time Extraction:
  - Supports both 12-hour (e.g., `2:30 PM`) and 24-hour formats (e.g., `14:30`).
- Hashtag Extraction:
  - Extracts hashtags (e.g., `#example`, `#ThisIsAHashtag`).
- URL Extraction:
  - Extracts URLs (e.g., `http://`, `https://`).
- HTML Tag Extraction:
  - Extracts HTML tags (opening and closing tags) from the provided content (e.g., `<div class="example">`, `</span>`).
- Currency Extraction:
  - Extracts USD currency values (e.g., `$19.99`, `$1,234.56`).

## How It Works
1. Text Area: Paste or type the text you want to analyze in the provided text area.
2. Sample Text: Click the "Use Sample Text" button to load predefined text.
3. File Upload: Click "Use File Extractor" and then click the dropzone (or drag-and-drop a `.txt` file). The tool loads the file’s content into the text area (no auto-extract).
4. Analysis: Click "Extract" to trigger the analysis. A short toast message guides empty input and no-match cases. The results will be displayed as cards showing different categories.

## Test Validations
1. Phone Numbers
   - Valid Format: `(123) 456-7890`, `123-456-7890`, `123.456.7890`, `+250795613644`
   - Invalid Format: numbers exceeding typical length, repeated-only patterns, malformed phone numbers
2. Credit Card Numbers
   - Valid Credit Card: `4532 0151 1283 0366`, `5500-0000-0000-0004`
   - Invalid Credit Card: `4444 4444 4444 4444` (repeated blocks), incorrect length
3. Sample Test Cases
   - Case 1 Input: Phones + Emails → Expected: those phones and emails extracted
   - Case 2 Input: Credit Cards + Time + Hashtags → Expected: valid cards only; `14:30`, `2:30 PM`; hashtags

## Edge Cases Handled
- Multiple formats of phone numbers: with or without parentheses, dashes, spaces, and dots.
- Credit card numbers with valid and invalid formats (including the repeated number check).
- Time formats in both 12-hour and 24-hour formats.
- Currency extraction that handles commas and decimal points.
- Valid hashtags without spaces.
- Drag-and-drop is protected so the browser does not navigate away by mistake.
- Re-selecting the same file works (file input resets after processing).

## Technologies Used
- HTML: For the structure of the page.
- CSS: For styling and layout (`regex_style.css`).
- JavaScript: For regex pattern matching and UI functionality (`regex_pattern.js`).

## Project Structure
- `regex_validator.html` — Main page
- `regex_style.css` — Styles
- `regex_pattern.js` — Regex logic and UI interactions

## Getting Started
- Option 1: Double-click `regex_validator.html` to open it in your browser.
- Option 2: Serve locally
  - Python: `python3 -m http.server`
  - Open `http://localhost:8000/alu_regex-data-extraction-owizdom/regex_validator.html`

## How to Use
1. Open `regex_validator.html`.
2. Enter text, load Sample, or Use File Extractor to load a `.txt`.
3. Click "Extract" to see the results.

## License
MIT
