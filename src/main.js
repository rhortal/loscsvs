import './style.css';
import { t, changeLanguage, getCurrentLanguage, getAvailableLanguages } from './i18n/index.js';
import Papa from 'papaparse';

const state = {
  file1: null,
  file2: null,
  data1: null,
  data2: null,
  mergedData: null
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
          <h3 data-i18n="upload.file1">${t('upload.file1')}</h3>
          <div class="dropzone" id="dropzone1">
            <span data-i18n="upload.dropzone">${t('upload.dropzone')}</span>
          </div>
          <div class="file-info" id="file1-info"></div>
        </div>

        <div class="file-upload" id="file2-upload">
          <h3 data-i18n="upload.file2">${t('upload.file2')}</h3>
          <div class="dropzone" id="dropzone2">
            <span data-i18n="upload.dropzone">${t('upload.dropzone')}</span>
          </div>
          <div class="file-info" id="file2-info"></div>
        </div>
      </section>

      <section class="preview-section">
        <div class="preview-panel" id="preview1">
          <h3>${t('upload.file1')} - <span data-i18n="preview.title">${t('preview.title')}</span></h3>
          <div class="preview-content" data-i18n="preview.noData">${t('preview.noData')}</div>
        </div>
        <div class="preview-panel" id="preview2">
          <h3>${t('upload.file2')} - <span data-i18n="preview.title">${t('preview.title')}</span></h3>
          <div class="preview-content" data-i18n="preview.noData">${t('preview.noData')}</div>
        </div>
      </section>

      <section class="rules-section">
        <h3 data-i18n="rules.title">${t('rules.title')}</h3>
        <p data-i18n="rules.placeholder">${t('rules.placeholder')}</p>
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

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      if (results.errors.length > 0) {
        showMessage(t('messages.parseError'), 'error');
        return;
      }

      state[fileKey] = file;
      state[`data${fileKey.replace('file', '')}`] = results.data;

      const dropzone = document.getElementById(`dropzone${fileKey.replace('file', '')}`);
      const fileInfo = document.getElementById(`file${fileKey.replace('file', '')}-info`);

      dropzone.innerHTML = `<span class="file-name">${file.name}</span>`;
      fileInfo.innerHTML = `<span>${results.data.length} ${t('upload.rows')}, ${Object.keys(results.data[0] || {}).length} ${t('upload.columns')}</span>`;

      renderPreview(fileKey.replace('file', ''), results.data);
    }
  });
}

function renderPreview(num, data) {
  const preview = document.getElementById(`preview${num}`);
  if (!data || data.length === 0) {
    preview.querySelector('.preview-content').innerHTML = `<span data-i18n="preview.noData">${t('preview.noData')}</span>`;
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

  preview.querySelector('.preview-content').innerHTML = html;
}

function mergeFiles() {
  if (!state.data1 || !state.data2) {
    showMessage(t('messages.noFiles'), 'error');
    return;
  }

  // Simple merge: concatenate all rows from both files
  state.mergedData = [...state.data1, ...state.data2];

  showMessage(t('messages.mergeSuccess'), 'success');
  document.getElementById('download-btn').disabled = false;
}

function downloadMerged() {
  if (!state.mergedData || state.mergedData.length === 0) {
    return;
  }

  const csv = Papa.unparse(state.mergedData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'merged.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function clearAll() {
  state.file1 = null;
  state.file2 = null;
  state.data1 = null;
  state.data2 = null;
  state.mergedData = null;

  document.getElementById('dropzone1').innerHTML = `<span data-i18n="upload.dropzone">${t('upload.dropzone')}</span>`;
  document.getElementById('dropzone2').innerHTML = `<span data-i18n="upload.dropzone">${t('upload.dropzone')}</span>`;
  document.getElementById('file1-info').innerHTML = '';
  document.getElementById('file2-info').innerHTML = '';

  document.querySelector('#preview1 .preview-content').innerHTML = `<span data-i18n="preview.noData">${t('preview.noData')}</span>`;
  document.querySelector('#preview2 .preview-content').innerHTML = `<span data-i18n="preview.noData">${t('preview.noData')}</span>`;

  document.getElementById('download-btn').disabled = true;
  hideMessage();
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
