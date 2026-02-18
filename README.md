# CSV Merge Utility

A simple, user-friendly web application for merging property and booking data into separate reports per property. Built with Vite, pure JavaScript, and supports multiple languages.

**Live Demo**: https://loscsvs.pages.dev

## Features

- **Dual File Upload**: Upload properties and bookings CSV files
- **Property Matching**: Automatically matches bookings to properties by ID or name
- **Smart Merge Rules**: 
  - Tourist stays (1-10 nights): Uses "Turistico" NRU code with "Vacacional/Turístico" finalidade
  - Long stays (11+ nights): Uses "No turístico" NRU code with "No turístico" finalidade
- **Separate Reports**: Generates individual CSV files per property
- **ZIP Download**: Download all property reports as a single ZIP file
- **Live Preview**: Preview merged data with property selector
- **Multi-language Support**: Switch between English and Spanish
- **Client-side Processing**: All processing happens in your browser - your data never leaves your device

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rhortal/loscsvs.git
cd loscsvs
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

1. **Upload Properties File**: Drag and drop or click to upload the properties CSV (with NRU codes)
2. **Upload Bookings File**: Drag and drop or click to upload the bookings CSV
3. **Preview Data**: Review the first 5 rows of each file to ensure correctness
4. **Generate Report**: Click "Generate Report" to merge the data
5. **Select Property**: Use the dropdown to preview each property's report
6. **Download**: Click "Download ZIP" to get all property CSVs as a ZIP file
7. **Clear**: Use "Clear All" to reset and start over

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
- **JSZip** - ZIP file generation
- **i18next** - Internationalization framework
- **Pure JavaScript** - No frontend framework

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is proprietary and confidential. See [LICENSE](LICENSE.md) for full terms.
Copyright (c) 2026 Roberto Hortal. All rights reserved.
