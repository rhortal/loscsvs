# CSV Merge Utility

A simple, user-friendly web application for merging two CSV files into one. Built with Vite, pure JavaScript, and supports multiple languages.

## Features

- **Dual File Upload**: Drag and drop or click to upload two CSV files
- **Live Preview**: View the first 5 rows of each uploaded file before merging
- **One-Click Merge**: Combine both CSV files with a single click
- **Download**: Export the merged result as a new CSV file
- **Multi-language Support**: Switch between English and Spanish
- **Client-side Processing**: All processing happens in your browser - your data never leaves your device

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd miguelito
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

To create a production build:

```bash
npm run build
```

The output will be in the `dist` directory.

To preview the production build:

```bash
npm run preview
```

## Usage

1. **Upload Files**: Drag and drop CSV files into the two upload zones, or click to browse
2. **Preview Data**: Review the first 5 rows of each file to ensure correctness
3. **Merge**: Click "Merge Files" to combine both datasets
4. **Download**: Click "Download Merged CSV" to save the result
5. **Clear**: Use "Clear All" to reset and start over

## Project Structure

```
miguelito/
├── index.html          # Main HTML entry point
├── package.json        # Project dependencies and scripts
├── src/
│   ├── main.js        # Application logic
│   ├── style.css      # Styles
│   ├── i18n/
│   │   └── index.js   # Internationalization setup
│   └── locales/
│       ├── en.json    # English translations
│       └── es.json    # Spanish translations
├── public/            # Static assets
└── dist/              # Production build output
```

## Technology Stack

- **Vite** - Build tool and dev server
- **Papa Parse** - CSV parsing library
- **i18next** - Internationalization framework
- **Pure JavaScript** - No frontend framework

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
