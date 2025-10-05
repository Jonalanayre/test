const brandButtons = Array.from(document.querySelectorAll('.toggle-group button'));
const seasonSelect = document.getElementById('season');
const departmentSelect = document.getElementById('department');
const continueButton = document.getElementById('continue-btn');
const briefingPanel = document.getElementById('briefing-panel');
const briefingForm = document.getElementById('briefing-form');
const briefingSummaryPanel = document.getElementById('briefing-summary');
const briefingSummaryList = briefingSummaryPanel?.querySelector('dl') ?? null;
const editBriefButton = document.getElementById('edit-brief');
const workspacePanel = document.getElementById('workspace-panel');
const selectionSummary = document.getElementById('selection-summary');
const moduleNav = document.querySelector('.module-nav');
const moduleContent = document.getElementById('module-content');

const moduleTemplates = {
  article: document.getElementById('article-template'),
  materials: document.getElementById('materials-template'),
  colors: document.getElementById('colors-template'),
  calendar: document.getElementById('calendar-template'),
};

let selectedBrand = '';
let selectedSeason = '';
let selectedDepartment = '';

const moduleData = {
  article: [
    { style: 'MST-212', category: 'Outerwear', status: 'Tech Pack', milestone: 'Fit Review', badge: 'info' },
    { style: 'MTP-114', category: 'Bottoms', status: 'Proto Sample', milestone: 'Proto Approval', badge: 'warning' },
    { style: 'MKN-408', category: 'Knitwear', status: 'Bulk Ready', milestone: 'PO Placement', badge: 'success' },
  ],
  materials: [
    { name: 'Recycled Nylon Ripstop', composition: '100% Recycled Nylon', supplier: 'EverSource Mills', status: 'Nominated', badge: 'info' },
    { name: 'Organic Cotton Fleece', composition: '95% Cotton / 5% Spandex', supplier: 'GreenLoop Textiles', status: 'Approved', badge: 'success' },
    { name: 'Matte Rubberized Zipper', composition: 'TPU + Metal', supplier: 'ZipTech', status: 'Pending Testing', badge: 'warning' },
  ],
  colors: [
    { color: 'Midnight Navy', code: 'MN-402', finish: 'Matte', approval: 'Approved', badge: 'success' },
    { color: 'Canyon Clay', code: 'CC-215', finish: 'Pigment Dye', approval: 'Lab Dip', badge: 'info' },
    { color: 'Frost Grey', code: 'FG-117', finish: 'Heather', approval: 'Pending', badge: 'warning' },
  ],
  calendar: [
    { milestone: 'Line Adoption', owner: 'Merchandising', dueDate: 'May 12, 2024', status: 'On Track', badge: 'success' },
    { milestone: 'Proto Fit Review', owner: 'Technical Design', dueDate: 'June 03, 2024', status: 'Scheduled', badge: 'info' },
    { milestone: 'Bulk Fabric Commit', owner: 'Production', dueDate: 'July 22, 2024', status: 'Risk', badge: 'warning' },
  ],
};

if (briefingSummaryPanel) {
  briefingSummaryPanel.setAttribute('aria-hidden', 'true');
}

function updateContinueState() {
  const hasBrand = Boolean(selectedBrand);
  const hasSeason = seasonSelect.value !== '';
  const hasDepartment = departmentSelect.value !== '';
  continueButton.disabled = !(hasBrand && hasSeason && hasDepartment);
}

function updateSummary() {
  const entries = [selectedBrand, selectedSeason, selectedDepartment].map((value) => value || '-');
  const targets = [selectionSummary, briefingSummaryList].filter(Boolean);
  targets.forEach((node) => {
    node.querySelectorAll('dd').forEach((dd, index) => {
      dd.textContent = entries[index];
    });
  });
}

function populateTable(moduleKey) {
  const template = moduleTemplates[moduleKey];
  if (!template) return;

  const fragment = template.content.cloneNode(true);
  const tableBody = fragment.querySelector('tbody');
  const data = moduleData[moduleKey];

  data.forEach((item) => {
    const row = document.createElement('tr');

    switch (moduleKey) {
      case 'article': {
        row.innerHTML = `
          <td>${item.style}</td>
          <td>${item.category}</td>
          <td><span class="badge badge--${item.badge}">${item.status}</span></td>
          <td>${item.milestone}</td>
        `;
        break;
      }
      case 'materials': {
        row.innerHTML = `
          <td>${item.name}</td>
          <td>${item.composition}</td>
          <td>${item.supplier}</td>
          <td><span class="badge badge--${item.badge}">${item.status}</span></td>
        `;
        break;
      }
      case 'colors': {
        row.innerHTML = `
          <td>${item.color}</td>
          <td>${item.code}</td>
          <td>${item.finish}</td>
          <td><span class="badge badge--${item.badge}">${item.approval}</span></td>
        `;
        break;
      }
      case 'calendar': {
        row.innerHTML = `
          <td>${item.milestone}</td>
          <td>${item.owner}</td>
          <td>${item.dueDate}</td>
          <td><span class="badge badge--${item.badge}">${item.status}</span></td>
        `;
        break;
      }
      default:
        break;
    }

    tableBody.appendChild(row);
  });

  const summaryBar = document.createElement('footer');
  summaryBar.className = 'module__context';
  const contextDetails = [selectedBrand, selectedSeason, selectedDepartment].filter(Boolean).join(' · ');
  summaryBar.innerHTML = `
    <div class="module__context-label">Showing ${moduleData[moduleKey].length} records</div>
    <div class="module__context-pill">${contextDetails || 'Context pending'}</div>
  `;

  fragment.querySelector('.module').appendChild(summaryBar);

  moduleContent.replaceChildren(fragment);
}

function setActiveModule(button) {
  if (!button) return;
  moduleNav.querySelectorAll('.module-nav__item').forEach((item) => {
    item.classList.toggle('is-active', item === button);
  });
  const moduleKey = button.dataset.module;
  populateTable(moduleKey);
}

brandButtons.forEach((button) => {
  button.addEventListener('click', () => {
    selectedBrand = button.dataset.brand;
    brandButtons.forEach((other) => {
      const isActive = other === button;
      other.setAttribute('aria-pressed', String(isActive));
      if (!isActive) {
        other.blur();
      }
    });
    updateContinueState();
  });
});

briefingForm.addEventListener('input', () => {
  selectedSeason = seasonSelect.value;
  selectedDepartment = departmentSelect.value;
  updateContinueState();
});

briefingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  updateSummary();
  briefingForm.setAttribute('aria-hidden', 'true');
  briefingPanel.classList.add('panel--complete');
  if (briefingSummaryPanel) {
    briefingSummaryPanel.hidden = false;
    briefingSummaryPanel.setAttribute('aria-hidden', 'false');
  }
  workspacePanel.classList.remove('panel--hidden');
  workspacePanel.setAttribute('aria-hidden', 'false');
  workspacePanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const defaultModule = moduleNav.querySelector('[data-module="article"]');
  setActiveModule(defaultModule);
});

moduleNav.addEventListener('click', (event) => {
  const button = event.target.closest('.module-nav__item');
  if (!button) return;
  setActiveModule(button);
});

if (editBriefButton) {
  editBriefButton.addEventListener('click', () => {
    briefingForm.setAttribute('aria-hidden', 'false');
    briefingPanel.classList.remove('panel--complete');
    if (briefingSummaryPanel) {
      briefingSummaryPanel.hidden = true;
      briefingSummaryPanel.setAttribute('aria-hidden', 'true');
    }
    workspacePanel.classList.add('panel--hidden');
    workspacePanel.setAttribute('aria-hidden', 'true');
    moduleNav.querySelectorAll('.module-nav__item').forEach((item) => item.classList.remove('is-active'));
    moduleContent.replaceChildren();
    updateContinueState();
    continueButton.focus();
  });
}
