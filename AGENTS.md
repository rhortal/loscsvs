# Agent Instructions for csvs

## Project Overview
- **Name**: CSV Merge Utility
- **Type**: Client-side web application (Vite + pure JS)
- **Purpose**: Merge property and booking data into separate reports per property
- **License**: Proprietary - All rights reserved (see LICENSE.md)

## Key Files
- `src/main.js` - Main application logic
- `src/style.css` - Styles
- `src/i18n/index.js` - Internationalization
- `src/locales/` - Translation files (en.json, es.json)
- `csv-examples/` - Example CSV files for testing

## Testing Files
Use these files for testing:
- **Properties file**: `csv-examples/listado apartamento para enviar.csv` (104 rows)
- **Bookings file**: `csv-examples/Listado pruebas 1-7-25 CSV.csv` (14 bookings)

## Current Implementation

### Merge Rules
1. Match bookings to properties by ID (`Id. Vivienda`) or name (`Alojamiento`)
2. For each property:
   - **Tourist bookings** (1-10 nights): Use "Turistico" NRU code (ESFCTU...)
   - **Non-tourist bookings** (11+ nights): Use "no turistico" NRU code (ESFCNT...)
   - Tourist bookings first, then 4 empty rows if property has both types, then non-tourist
3. Date format: dd.mm.aaaa (e.g., 01.07.2025)
4. Exit date empty if cross-year

### Report Generation
- Generates separate CSV for each property
- Downloads as ZIP file containing all property CSVs
- Filename format: `{propertyId}.csv` (e.g., 502775.csv)
- Preview shows dropdown to select between properties

### Known Issues
- 3 bookings don't match (OCE3 3A, OCE3 2A, MAR Y VENT 4D) - these properties don't exist in properties file

## Testing
- Run `npm run dev` to start dev server
- Run `npm run build` to create production build

## Git Workflow
- Create a new branch for any feature work
- Commit with descriptive messages using `--author="AI <eleanor+ai@intellectronica.net>"`
- Merge to main and push
- Delete feature branches when done
