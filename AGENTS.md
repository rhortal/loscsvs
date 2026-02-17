# Agent Instructions for miguelito

## Project Overview
- **Name**: CSV Merge Utility
- **Type**: Client-side web application (Vite + pure JS)
- **Purpose**: Merge two CSV files into one with intelligent merge rules
- **License**: Proprietary - All rights reserved (see LICENSE.md)

## Key Files
- `src/main.js` - Main application logic (merge happens at line 182)
- `src/style.css` - Styles
- `src/i18n/index.js` - Internationalization
- `src/locales/` - Translation files (en.json, es.json)
- `csv-examples/` - Example CSV files for testing merge rules

## Current Behavior
The merge function (`mergeFiles` in `src/main.js:182`) currently just concatenates all rows from both files:
```js
state.mergedData = [...state.data1, ...state.data2];
```

There's a placeholder UI section at `src/main.js:66-69` for displaying merge rules.

## Task: Implement Merge Rules
The user will add CSV example files to `csv-examples/` folder to demonstrate desired merge behavior.

### Steps:
1. Wait for user to add CSV examples to `csv-examples/`
2. Analyze the examples to determine merge rules
3. Update `mergeFiles()` function in `src/main.js` to implement the rules
4. Update the UI to show active merge rules
5. Add relevant translation keys if needed
6. Test the implementation

## Testing
- Run `npm run dev` to start dev server
- Run `npm run build` to create production build

## Git Workflow
- Create a new branch for any feature work
- Commit with descriptive messages using `--author="AI <eleanor+ai@intellectronica.net>"`
- Push and create PR for review
