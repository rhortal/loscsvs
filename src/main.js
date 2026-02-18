import './style.css';
import { t, changeLanguage, getCurrentLanguage, getAvailableLanguages } from './i18n/index.js';
import Papa from 'papaparse';
import JSZip from 'jszip';

const state = {
  file1: null,
  file2: null,
  data1: null,
  data2: null,
  mergedData: null,
  mergedByProperty: null,
  selectedPropertyId: null
};

function init() {
  renderApp();
  setupEventListeners();
}

function renderApp() {
  const app = document.querySelector('#app');
  app.innerHTML = `
    <header class="header">
      <h1 data-i18n="app.title">${t('app.title')}</h1>
      <p data-i18n="app.subtitle">${t('app.subtitle')}</p>
      <div class="language-switcher">
        <label data-i18n="actions.language">${t('actions.language')}:</label>
        <select id="language-select">
          ${getAvailableLanguages().map(lang => `
            <option value="${lang.code}" ${lang.code === getCurrentLanguage() ? 'selected' : ''}>
              ${lang.name}
            </option>
          `).join('')}
        </select>
      </div>
    </header>

    <main class="main">
      <section class="upload-section">
        <div class="file-upload" id="file1-upload">
          <h3 data-i18n="upload.properties">${t('upload.properties')}</h3>
          <p class="file-description" data-i18n="upload.propertiesDesc">${t('upload.propertiesDesc')}</p>
          <div class="dropzone" id="dropzone1">
            <span data-i18n="upload.dropzone">${t('upload.dropzone')}</span>
          </div>
          <div class="file-info" id="file1-info"></div>
        </div>

        <div class="file-upload" id="file2-upload">
          <h3 data-i18n="upload.bookings">${t('upload.bookings')}</h3>
          <p class="file-description" data-i18n="upload.bookingsDesc">${t('upload.bookingsDesc')}</p>
          <div class="dropzone" id="dropzone2">
            <span data-i18n="upload.dropzone">${t('upload.dropzone')}</span>
          </div>
          <div class="file-info" id="file2-info"></div>
        </div>
      </section>

      <section class="report-section">
        <div class="tabs">
          <button class="tab-btn active" data-tab="1">${t('upload.properties')}</button>
          <button class="tab-btn" data-tab="2">${t('upload.bookings')}</button>
          <button class="tab-btn" data-tab="3">${t('report.title')}</button>
        </div>
        <div class="tab-panels">
          <div class="tab-panel active" id="panel1">
            <div class="panel-header">
              <h3 data-i18n="preview.title">${t('preview.title')}</h3>
              <button class="btn btn-outline btn-small discard-btn" data-file="1" style="display:none">${t('actions.discard')}</button>
            </div>
            <div class="preview-content" id="preview1" data-i18n="preview.noData">${t('preview.noData')}</div>
          </div>
          <div class="tab-panel" id="panel2">
            <div class="panel-header">
              <h3 data-i18n="preview.title">${t('preview.title')}</h3>
              <button class="btn btn-outline btn-small discard-btn" data-file="2" style="display:none">${t('actions.discard')}</button>
            </div>
            <div class="preview-content" id="preview2" data-i18n="preview.noData">${t('preview.noData')}</div>
          </div>
          <div class="tab-panel" id="panel3">
            <div class="panel-header">
              <h3 data-i18n="report.title">${t('report.title')}</h3>
            </div>
            <div class="preview-content" id="preview3" data-i18n="report.noData">${t('report.noData')}</div>
          </div>
        </div>
      </section>

      <section class="actions-section">
        <button id="merge-btn" class="btn btn-primary" data-i18n="actions.merge">${t('actions.merge')}</button>
        <button id="download-btn" class="btn btn-secondary" disabled data-i18n="actions.download">${t('actions.download')}</button>
        <button id="clear-btn" class="btn btn-outline" data-i18n="actions.clear">${t('actions.clear')}</button>
      </section>

      <div id="message" class="message"></div>
    </main>
  `;
}

function setupEventListeners() {
  const dropzone1 = document.getElementById('dropzone1');
  const dropzone2 = document.getElementById('dropzone2');

  setupDropzone(dropzone1, 'file1');
  setupDropzone(dropzone2, 'file2');

  document.getElementById('language-select').addEventListener('change', (e) => {
    changeLanguage(e.target.value);
    renderApp();
    setupEventListeners();
  });

  document.getElementById('merge-btn').addEventListener('click', mergeFiles);
  document.getElementById('download-btn').addEventListener('click', downloadMerged);
  document.getElementById('clear-btn').addEventListener('click', clearAll);

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`panel${btn.dataset.tab}`).classList.add('active');
    });
  });

  document.querySelectorAll('.discard-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const fileNum = btn.dataset.file;
      discardFile(fileNum);
    });
  });
}

function setupDropzone(dropzone, fileKey) {
  dropzone.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e) => handleFileSelect(e.target.files[0], fileKey);
    input.click();
  });

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) {
      handleFileSelect(file, fileKey);
    }
  });
}

function handleFileSelect(file, fileKey) {
  if (!file) return;

  const isBookingsFile = fileKey === 'file2';

  Papa.parse(file, {
    header: false,
    skipEmptyLines: true,
    complete: (results) => {
      if (results.errors.length > 0) {
        showMessage(t('messages.parseError'), 'error');
        return;
      }

      let data;
      
      if (isBookingsFile && results.data.length >= 2) {
        const headers = results.data[1];
        const rows = results.data.slice(2);
        data = rows.map(row => {
          const obj = {};
          headers.forEach((header, i) => {
            obj[header] = row[i] || '';
          });
          return obj;
        });
      } else {
        const headers = results.data[0];
        const rows = results.data.slice(1);
        data = rows.map(row => {
          const obj = {};
          headers.forEach((header, i) => {
            obj[header] = row[i] || '';
          });
          return obj;
        });
      }

      state[fileKey] = file;
      state[`data${fileKey.replace('file', '')}`] = data;

      const dropzone = document.getElementById(`dropzone${fileKey.replace('file', '')}`);
      const fileInfo = document.getElementById(`file${fileKey.replace('file', '')}-info`);

      dropzone.innerHTML = `<span class="file-name">${file.name}</span>`;
      fileInfo.innerHTML = `<span>${data.length} ${t('upload.rows')}, ${Object.keys(data[0] || {}).length} ${t('upload.columns')}</span>`;

      document.querySelector(`.discard-btn[data-file="${fileKey.replace('file', '')}"]`).style.display = 'block';
      renderPreview(fileKey.replace('file', ''), data);
    }
  });
}

function renderPreview(num, data) {
  const preview = document.getElementById(`preview${num}`);
  if (!data || data.length === 0) {
    preview.innerHTML = `<span data-i18n="preview.noData">${t('preview.noData')}</span>`;
    return;
  }

  const columns = Object.keys(data[0]);
  const rows = data.slice(0, 5);

  let html = `<p class="preview-label">${t('preview.firstRows')}</p>`;
  html += '<table class="preview-table"><thead><tr>';
  columns.forEach(col => {
    html += `<th>${escapeHtml(col)}</th>`;
  });
  html += '</tr></thead><tbody>';
  rows.forEach(row => {
    html += '<tr>';
    columns.forEach(col => {
      html += `<td>${escapeHtml(row[col] || '')}</td>`;
    });
    html += '</tr>';
  });
  html += '</tbody></table>';

  preview.innerHTML = html;
}

function mergeFiles() {
  if (!state.data1 || !state.data2) {
    showMessage(t('messages.noFiles'), 'error');
    return;
  }

  const properties = state.data1;
  const bookings = state.data2;

  console.log('Properties sample:', JSON.stringify(properties[0], null, 2));
  console.log('Bookings sample:', JSON.stringify(bookings[0], null, 2));

  const propertyMap = new Map();
  const propertyNameMap = new Map();
  
  properties.forEach(prop => {
    const propId = prop['Id. Vivienda'] || prop['Id.Vivienda'];
    if (propId) {
      propertyMap.set(propId.toString().trim(), prop);
    }
    const propName = prop['Alojamiento'] || prop['alojamiento'];
    if (propName) {
      propertyNameMap.set(propName.toString().trim().toLowerCase(), prop);
    }
  });

  console.log('Property IDs:', Array.from(propertyMap.keys()));
  console.log('Property names:', Array.from(propertyNameMap.keys()));
  console.log('Total bookings:', bookings.length);

  const bookingsByProperty = new Map();
  const unmatchedBookings = [];
  bookings.forEach(booking => {
    let propId = booking['id alojamiento'] || booking['Id alojamiento'];
    let prop = null;
    
    if (propId) {
      const id = propId.toString().trim();
      prop = propertyMap.get(id);
    }
    
    if (!prop) {
      const propName = booking['Nombre alojamiento'] || booking['nombre alojamiento'];
      if (propName) {
        prop = propertyNameMap.get(propName.toString().trim().toLowerCase());
      }
    }
    
    if (prop) {
      const finalPropId = (prop['Id. Vivienda'] || prop['Id.Vivienda'] || '').toString().trim();
      if (!bookingsByProperty.has(finalPropId)) {
        bookingsByProperty.set(finalPropId, []);
      }
      bookingsByProperty.get(finalPropId).push(booking);
    } else {
      console.log('Unmatched booking:', { id: propId, name: booking['Nombre alojamiento'] || booking['nombre alojamiento'] });
      unmatchedBookings.push({ id: propId, name: booking['Nombre alojamiento'] || booking['nombre alojamiento'] });
    }
  });

  console.log('Unmatched bookings:', unmatchedBookings);
  console.log('Bookings by property:', Array.from(bookingsByProperty.keys()));

  const mergedByProperty = new Map();
  const allRows = [];

  const sortedPropertyIds = Array.from(bookingsByProperty.keys()).sort();

  sortedPropertyIds.forEach(propId => {
    const prop = propertyMap.get(propId);
    if (!prop) return;

    const propName = prop['Alojamiento'] || prop['alojamiento'] || propId;
    const bookingsList = bookingsByProperty.get(propId);
    
    const touristBookings = bookingsList.filter(b => {
      const noches = parseInt(b['noches'] || b['Noches'] || '0', 10);
      return noches >= 1 && noches <= 10;
    });

    const nonTouristBookings = bookingsList.filter(b => {
      const noches = parseInt(b['noches'] || b['Noches'] || '0', 10);
      return noches > 10;
    });

    touristBookings.sort((a, b) => {
      const dateA = parseDate(a['Fecha entrada'] || a['fecha entrada']);
      const dateB = parseDate(b['Fecha entrada'] || b['fecha entrada']);
      return dateA - dateB;
    });

    nonTouristBookings.sort((a, b) => {
      const dateA = parseDate(a['Fecha entrada'] || a['fecha entrada']);
      const dateB = parseDate(b['Fecha entrada'] || b['fecha entrada']);
      return dateA - dateB;
    });

    const turisticoNRU = prop['Turistico '] || prop['Turistico'] || prop['turistico'] || '';
    const noTuristicoNRU = prop['no turistico'] || prop['no turistico '] || '';
    const edificio = prop['Edificio'] || '';
    const guests = getGuestsFromProperty(edificio);

    const propertyOutput = [];

    touristBookings.forEach(booking => {
      const entryDate = booking['Fecha entrada'] || booking['fecha entrada'] || '';
      const exitDate = booking['Fecha salida'] || booking['fecha salida'] || '';
      
      const nru = turisticoNRU;
      const formattedEntry = formatDate(entryDate);
      const formattedExit = formatDateExit(entryDate, exitDate);

      const row = {
        'NRUA': nru,
        'Finalidad (1)': 'Vacacional/Turístico',
        'Nº de huéspedes': guests,
        'Fecha de entrada (dd.mm.aaaa)': formattedEntry,
        'Fecha de salida (dd.mm.aaaa)': formattedExit,
        'Sin actividad (3)': ''
      };
      propertyOutput.push(row);
      allRows.push(row);
    });

    if (touristBookings.length > 0 && nonTouristBookings.length > 0) {
      for (let i = 0; i < 4; i++) {
        const emptyRow = {
          'NRUA': '',
          'Finalidad (1)': '',
          'Nº de huéspedes': '',
          'Fecha de entrada (dd.mm.aaaa)': '',
          'Fecha de salida (dd.mm.aaaa)': '',
          'Sin actividad (3)': ''
        };
        propertyOutput.push(emptyRow);
        allRows.push(emptyRow);
      }
    }

    nonTouristBookings.forEach(booking => {
      const entryDate = booking['Fecha entrada'] || booking['fecha entrada'] || '';
      const exitDate = booking['Fecha salida'] || booking['fecha salida'] || '';
      
      const nru = noTuristicoNRU;
      const formattedEntry = formatDate(entryDate);
      const formattedExit = formatDateExit(entryDate, exitDate);

      const row = {
        'NRUA': nru,
        'Finalidad (1)': 'No turístico',
        'Nº de huéspedes': guests,
        'Fecha de entrada (dd.mm.aaaa)': formattedEntry,
        'Fecha de salida (dd.mm.aaaa)': formattedExit,
        'Sin actividad (3)': ''
      };
      propertyOutput.push(row);
      allRows.push(row);
    });

    mergedByProperty.set(propId, {
      name: propName,
      rows: propertyOutput
    });
  });

  state.mergedData = allRows;
  state.mergedByProperty = mergedByProperty;
  state.selectedPropertyId = sortedPropertyIds.length > 0 ? sortedPropertyIds[0] : null;
  
  console.log('Output rows:', allRows.length);
  console.log('Properties with data:', mergedByProperty.size);

  renderReportPreview();
  
  showMessage(t('messages.mergeSuccess'), 'success');
  document.getElementById('download-btn').disabled = false;
}

function renderReportPreview() {
  const preview = document.getElementById('preview3');
  
  if (!state.mergedByProperty || state.mergedByProperty.size === 0) {
    preview.innerHTML = `<span data-i18n="report.noData">${t('report.noData')}</span>`;
    return;
  }

  const propertyIds = Array.from(state.mergedByProperty.keys()).sort();
  
  let html = `<div class="property-selector">`;
  html += `<label>${t('report.selectProperty') || 'Select Property'}: </label>`;
  html += `<select id="property-select">`;
  propertyIds.forEach(propId => {
    const propData = state.mergedByProperty.get(propId);
    const isSelected = propId === state.selectedPropertyId ? 'selected' : '';
    html += `<option value="${propId}" ${isSelected}>${propId} - ${escapeHtml(propData.name)} (${propData.rows.length} ${t('report.rows') || 'rows'})</option>`;
  });
  html += `</select>`;
  html += `</div>`;

  const selectedData = state.mergedByProperty.get(state.selectedPropertyId);
  if (selectedData) {
    const columns = Object.keys(selectedData.rows[0] || {});
    const rows = selectedData.rows.slice(0, 10);

    html += `<p class="preview-label">${t('preview.firstRows')} (${selectedData.rows.length} ${t('report.totalRows')})</p>`;
    html += '<table class="preview-table"><thead><tr>';
    columns.forEach(col => {
      html += `<th>${escapeHtml(col)}</th>`;
    });
    html += '</tr></thead><tbody>';
    rows.forEach(row => {
      html += '<tr>';
      columns.forEach(col => {
        html += `<td>${escapeHtml(row[col] || '')}</td>`;
      });
      html += '</tr>';
    });
    html += '</tbody></table>';
  }

  preview.innerHTML = html;

  document.getElementById('property-select').addEventListener('change', (e) => {
    state.selectedPropertyId = e.target.value;
    renderReportPreview();
  });
  
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelector('.tab-btn[data-tab="3"]').classList.add('active');
  document.getElementById('panel3').classList.add('active');
}

function parseDate(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.trim().split(/[\/\-\.]/);
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    if (year < 100) {
      return new Date(year + 2000, month, day);
    }
    return new Date(year, month, day);
  }
  return null;
}

function formatDate(dateStr) {
  const date = parseDate(dateStr);
  if (!date) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

function formatDateExit(entryDateStr, exitDateStr) {
  const entryDate = parseDate(entryDateStr);
  const exitDate = parseDate(exitDateStr);
  
  if (!entryDate || !exitDate) return '';
  
  if (entryDate.getFullYear() !== exitDate.getFullYear()) {
    return '';
  }
  
  const day = String(exitDate.getDate()).padStart(2, '0');
  const month = String(exitDate.getMonth() + 1).padStart(2, '0');
  const year = exitDate.getFullYear();
  return `${day}.${month}.${year}`;
}

function getGuestsFromProperty(edificio) {
  if (!edificio) return 2;
  const lower = edificio.toLowerCase();
  if (lower.includes('estudio') || lower.includes('studio')) return 2;
  if (lower.includes('1 dormitorio') || lower.includes('1 dormitorio')) return 2;
  if (lower.includes('2 dormitorios') || lower.includes('2 dormitorios')) return 4;
  if (lower.includes('3 dormitorios') || lower.includes('3 dormitorios')) return 6;
  if (lower.includes('4 dormitorios') || lower.includes('4 dormitorios')) return 6;
  return 2;
}

async function downloadMerged() {
  if (!state.mergedByProperty || state.mergedByProperty.size === 0) {
    return;
  }

  const zip = new JSZip();
  const columns = ['NRUA', 'Finalidad (1)', 'Nº de huéspedes', 'Fecha de entrada (dd.mm.aaaa)', 'Fecha de salida (dd.mm.aaaa)', 'Sin actividad (3)'];

  state.mergedByProperty.forEach((propData, propId) => {
    const csv = Papa.unparse(propData.rows, { columns });
    zip.file(`${propId}.csv`, csv);
  });

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'informes_propiedades.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  showMessage(t('messages.downloadSuccess'), 'success');
}

function clearAll() {
  state.file1 = null;
  state.file2 = null;
  state.data1 = null;
  state.data2 = null;
  state.mergedData = null;
  state.mergedByProperty = null;
  state.selectedPropertyId = null;

  document.getElementById('dropzone1').innerHTML = `<span data-i18n="upload.dropzone">${t('upload.dropzone')}</span>`;
  document.getElementById('dropzone2').innerHTML = `<span data-i18n="upload.dropzone">${t('upload.dropzone')}</span>`;
  document.getElementById('file1-info').innerHTML = '';
  document.getElementById('file2-info').innerHTML = '';

  document.querySelectorAll('.discard-btn').forEach(btn => btn.style.display = 'none');
  document.querySelector('#preview1').innerHTML = `<span data-i18n="preview.noData">${t('preview.noData')}</span>`;
  document.querySelector('#preview2').innerHTML = `<span data-i18n="preview.noData">${t('preview.noData')}</span>`;
  document.querySelector('#preview3').innerHTML = `<span data-i18n="report.noData">${t('report.noData')}</span>`;

  document.getElementById('download-btn').disabled = true;
  hideMessage();
}

function discardFile(num) {
  state[`file${num}`] = null;
  state[`data${num}`] = null;

  document.getElementById(`dropzone${num}`).innerHTML = `<span data-i18n="upload.dropzone">${t('upload.dropzone')}</span>`;
  document.getElementById(`file${num}-info`).innerHTML = '';
  document.querySelector(`.discard-btn[data-file="${num}"]`).style.display = 'none';
  document.getElementById(`preview${num}`).innerHTML = `<span data-i18n="preview.noData">${t('preview.noData')}</span>`;

  document.getElementById('download-btn').disabled = true;
}

function showMessage(text, type) {
  const msg = document.getElementById('message');
  msg.textContent = text;
  msg.className = `message message-${type}`;
  msg.style.display = 'block';
}

function hideMessage() {
  const msg = document.getElementById('message');
  msg.style.display = 'none';
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

init();
