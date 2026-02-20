# Agent Instructions for csvs

## Project Overview
- **Name**: CSV Merge Utility
- **Type**: Client-side web application (Vite + pure JS)
- **Purpose**: Merge property and booking data into separate reports per property
- **License**: Proprietary - All rights reserved (see LICENSE.md)
- **Live URL**: https://loscsvs.pages.dev

## Key Files
- `src/main.js` - Main application logic
- `src/style.css` - Styles
- `src/i18n/index.js` - Internationalization
- `src/locales/` - Translation files (en.json, es.json)
- `csv-examples/` - Example CSV files for testing

## Testing Files
Use these files for testing:
- **Properties file**: `csv-examples/ListadoApartamentos.csv` (148 rows)
- **Bookings file**: `csv-examples/Listado pruebas 1-7-25 CSV.csv` (14 bookings - original)
- **Full test file**: `csv-examples/Listado pruebas completo.csv` (24 bookings with synthetic long stays)

## Current Implementation

### Merge Rules
1. Match bookings to properties by ID (`Id. Vivienda`) or name (`Alojamiento`)
2. For each property:
   - **Tourist bookings** (1-10 nights): Use "Turistico" NRU code (ESFCTU...), Finalidad = "Vacacional/Turístico"
   - **Non-tourist bookings** (11+ nights): Use "no turistico" NRU code (ESFCNT...), Finalidad = "Otros"
   - Tourist bookings first (sorted by date), then non-tourist (sorted by date) - no empty rows between
3. Date format: dd.mm.aaaa (e.g., 01.07.2025)
4. Exit date empty if cross-year
5. Output columns (in order): NRUA, Fecha de entrada, Fecha de salida, Nº de huéspedes, Finalidad

### Report Generation
- Generates separate CSV for each property
- Downloads as ZIP file containing all property CSVs
- Filename format: `{propertyName}.csv` (e.g., `Apartamento_La_Zona.csv`) - spaces replaced with underscores
- Preview shows dropdown to select between properties

### Known Issues
- None - all bookings match with updated properties file

## Testing
- Run `npm run dev` to start dev server
- Run `npm run build` to create production build
- Test at: https://loscsvs.pages.dev

## Git Workflow
- Create a new branch for any feature work
- Commit with descriptive messages using `--author="AI <eleanor+ai@intellectronica.net>"`
- Merge to main and push
- Delete feature branches when done

## Customer Testing Folder
- `instrucciones-cliente/` - Contains customer-facing instructions and test files:
  - `INSTRUCCIONES.md` - Spanish instructions for testing
  - `ListadoApartamentos.csv` - Properties file (148 rows)
  - `ListadoPruebasCompleto.csv` - Full test bookings (24 bookings with synthetic data including long stays)
