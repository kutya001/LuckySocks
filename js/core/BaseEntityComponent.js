class BaseEntityComponent {
    constructor(type, title, stateKey) {
        this.type = type;
        this.title = title;
        this.stateKey = stateKey;
        this.columns = this.getColumns(); // [{ id: '...', label: '...', filterable: true }]
        this.activeFilters = {};
        this.visibleColumns = this.loadColumnPreferences();
        this.sortColumn = null;
        this.sortDirection = null;
        this.currentPage = 1;
        this.rowsPerPage = parseInt(localStorage.getItem(`rows_per_page_${this.type}`)) || 10;
    }

    loadColumnPreferences() {
        const saved = localStorage.getItem(`cols_visible_${this.type}`);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error(e);
            }
        }
        // Default: all columns visible
        const defaults = {};
        this.columns.forEach(c => {
            defaults[c.id] = c.visible !== false;
        });
        return defaults;
    }

    saveColumnPreferences() {
        localStorage.setItem(`cols_visible_${this.type}`, JSON.stringify(this.visibleColumns));
    }

    getColumns() {
        return []; // Override in subclasses
    }

    getRecords() {
        return state[this.stateKey] || [];
    }

    getColumnValue(record, colId) {
        return record[colId] || '';
    }

    getColumnValueForFilter(record, colId) {
        const val = this.getColumnValue(record, colId);
        // If it's HTML, strip tags for filtering
        if (typeof val === 'string' && val.includes('<')) {
            const temp = document.createElement('div');
            temp.innerHTML = val;
            return temp.textContent || temp.innerText || '';
        }
        return String(val || '');
    }

    renderTable(viewport) {
        this.currentViewport = viewport;
        const filteredList = this.getFilteredRecords();
        const visibleCols = this.columns.filter(c => this.visibleColumns[c.id]);
        
        const totalRecords = filteredList.length;
        const totalPages = Math.ceil(totalRecords / this.rowsPerPage) || 1;
        
        if (this.currentPage > totalPages) {
            this.currentPage = totalPages;
        }
        if (this.currentPage < 1) {
            this.currentPage = 1;
        }
        
        const startIndex = (this.currentPage - 1) * this.rowsPerPage;
        const endIndex = Math.min(startIndex + this.rowsPerPage, totalRecords);
        const pageRecords = filteredList.slice(startIndex, endIndex);
        
        const startRecord = totalRecords === 0 ? 0 : startIndex + 1;
        const endRecord = endIndex;

        let pageButtonsHTML = '';
        for (let p = 1; p <= totalPages; p++) {
            const activeStyle = this.currentPage === p 
                ? 'background: var(--primary); border-color: var(--primary); color: white; font-weight: bold;' 
                : '';
            pageButtonsHTML += `
                <button class="btn btn-secondary pagination-btn page-num-btn" data-page="${p}" style="padding: 4px 10px; font-size: 11px; min-width: 28px; ${activeStyle}">
                    ${p}
                </button>
            `;
        }

        let html = `
            <div class="dir-toolbar" style="display: flex; justify-content: space-between; align-items: center; gap: 15px; margin-bottom: 20px; position: relative;">
                <h3 style="margin: 0; font-size: 16px;">${this.title}</h3>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <button class="btn btn-secondary" id="btn-toggle-cols-${this.type}">
                        <i class="ph ph-columns"></i>
                        <span>Колонки</span>
                    </button>
                    <button class="btn btn-primary" id="btn-create-${this.type}">
                        <i class="ph ph-plus"></i>
                        <span>Создать</span>
                    </button>
                </div>
            </div>
            
            <!-- Column Toggling Popover (hidden by default) -->
            <div id="popover-cols-${this.type}" class="card" style="display: none; position: absolute; z-index: 1000; padding: 15px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); box-shadow: var(--shadow-main); width: 220px;">
                <h4 style="margin: 0 0 10px 0; font-size: 13px; color: var(--text-primary); border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">Видимость колонок</h4>
                <div style="display: flex; flex-direction: column; gap: 8px; max-height: 250px; overflow-y: auto;">
                    ${this.columns.map(col => `
                        <label style="display: flex; align-items: center; gap: 8px; font-size: 12px; cursor: pointer; color: var(--text-primary);">
                            <input type="checkbox" class="col-visibility-chk" data-col="${col.id}" ${this.visibleColumns[col.id] ? 'checked' : ''}>
                            <span>${col.label}</span>
                        </label>
                    `).join('')}
                </div>
            </div>

            <div class="table-wrapper table-responsive">
                <table class="data-table">
                    <thead>
                        <tr>
                            ${visibleCols.map(col => {
                                const isFiltered = this.activeFilters[col.id] !== undefined;
                                const isSorted = this.sortColumn === col.id;
                                const sortIcon = isSorted ? (this.sortDirection === 'asc' ? '<i class="ph ph-caret-up sort-indicator"></i>' : '<i class="ph ph-caret-down sort-indicator"></i>') : '';
                                const filterBtn = col.filterable !== false ? `
                                    <button class="btn-excel-filter ${isFiltered ? 'active' : ''}" data-col="${col.id}" title="Сортировка и фильтр">
                                        <i class="ph ph-funnel"></i>
                                    </button>
                                ` : '';
                                return `
                                    <th>
                                        <div class="th-filter-wrapper">
                                            <span>${col.label} ${sortIcon}</span>
                                            ${filterBtn}
                                        </div>
                                    </th>
                                `;
                            }).join('')}
                            <th style="text-align: right; width: 100px;">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${pageRecords.length === 0 ? `
                            <tr>
                                <td colspan="${visibleCols.length + 1}" class="text-secondary" style="text-align: center; padding: 30px;">
                                    Записи не найдены
                                </td>
                            </tr>
                        ` : ''}
                        ${pageRecords.map(record => `
                            <tr class="clickable-row" data-id="${record.id}" style="cursor: pointer;">
                                ${visibleCols.map(col => `
                                    <td>${this.getColumnValue(record, col.id)}</td>
                                `).join('')}
                                <td style="text-align: right;" class="actions-cell">
                                    <div class="row-actions" style="display: flex; justify-content: flex-end; gap: 4px;">
                                        <button class="btn btn-secondary btn-icon-only edit-row-btn" data-id="${record.id}" title="Редактировать"><i class="ph ph-pencil-simple"></i></button>
                                        <button class="btn btn-danger btn-icon-only delete-row-btn" data-id="${record.id}" title="Удалить"><i class="ph ph-trash"></i></button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <!-- Pagination Toolbar -->
            <div class="pagination-container" style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px; font-size: 12px; gap: 15px; flex-wrap: wrap;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="text-secondary">Показывать по:</span>
                    <select class="form-control pagination-limit-select" style="width: 70px; padding: 4px 8px; height: auto; font-size: 12px; background: var(--bg-card); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: var(--radius-sm);">
                        ${[5, 10, 20, 50, 100].map(limit => `<option value="${limit}" ${this.rowsPerPage === limit ? 'selected' : ''}>${limit}</option>`).join('')}
                    </select>
                    <span class="text-secondary" style="margin-left: 10px;">Показано с ${startRecord} по ${endRecord} из ${totalRecords}</span>
                </div>
                <div style="display: flex; gap: 5px; align-items: center;">
                    <button class="btn btn-secondary pagination-btn prev-btn" ${this.currentPage === 1 ? 'disabled' : ''} style="padding: 4px 8px; font-size: 11px;"><i class="ph ph-caret-left"></i></button>
                    ${pageButtonsHTML}
                    <button class="btn btn-secondary pagination-btn next-btn" ${this.currentPage === totalPages ? 'disabled' : ''} style="padding: 4px 8px; font-size: 11px;"><i class="ph ph-caret-right"></i></button>
                </div>
            </div>
        `;
        viewport.innerHTML = html;

        this.bindEvents(viewport);
    }

    getFilteredRecords() {
        let list = [...this.getRecords()];
        
        // Apply Excel filters
        list = list.filter(record => {
            return Object.keys(this.activeFilters).every(colId => {
                const allowedValues = this.activeFilters[colId];
                if (!allowedValues || !Array.isArray(allowedValues)) return true;
                const recordVal = this.getColumnValueForFilter(record, colId);
                return allowedValues.includes(recordVal);
            });
        });
        
        // Apply Sorting
        if (this.sortColumn) {
            const colId = this.sortColumn;
            const dir = this.sortDirection === 'desc' ? -1 : 1;
            
            list.sort((a, b) => {
                const valA = this.getColumnValueForFilter(a, colId);
                const valB = this.getColumnValueForFilter(b, colId);
                
                // Try sorting as numbers: strip spaces and replace commas with dots
                const numA = parseFloat(valA.replace(/\s/g, '').replace(',', '.'));
                const numB = parseFloat(valB.replace(/\s/g, '').replace(',', '.'));
                
                if (!isNaN(numA) && !isNaN(numB)) {
                    return (numA - numB) * dir;
                }
                
                // Try sorting as dates: YYYY-MM-DD or DD.MM.YYYY
                const datePattern1 = /^(\d{4})-(\d{2})-(\d{2})$/;
                const datePattern2 = /^(\d{2})\.(\d{2})\.(\d{4})$/;
                
                const matchA1 = valA.match(datePattern1);
                const matchB1 = valB.match(datePattern1);
                if (matchA1 && matchB1) {
                    const dateA = new Date(matchA1[1], matchA1[2] - 1, matchA1[3]);
                    const dateB = new Date(matchB1[1], matchB1[2] - 1, matchB1[3]);
                    return (dateA - dateB) * dir;
                }
                
                const matchA2 = valA.match(datePattern2);
                const matchB2 = valB.match(datePattern2);
                if (matchA2 && matchB2) {
                    const dateA = new Date(matchA2[3], matchA2[2] - 1, matchA2[1]);
                    const dateB = new Date(matchB2[3], matchB2[2] - 1, matchB2[1]);
                    return (dateA - dateB) * dir;
                }
                
                // Fallback to localeCompare
                return valA.localeCompare(valB, 'ru', { numeric: true }) * dir;
            });
        }
        
        return list;
    }

    openExcelFilterPopup(btn, colId) {
        let popup = document.getElementById('excel-filter-popup');
        if (!popup) {
            popup = document.createElement('div');
            popup.id = 'excel-filter-popup';
            popup.className = 'excel-filter-popup';
            document.body.appendChild(popup);
        }

        const escapeHtml = (str) => {
            if (typeof str !== 'string') return str;
            return str.replace(/&/g, '&amp;')
                      .replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;')
                      .replace(/"/g, '&quot;')
                      .replace(/'/g, '&#039;');
        };

        // Gather unique values
        const records = this.getRecords();
        const uniqueValues = Array.from(new Set(records.map(r => this.getColumnValueForFilter(r, colId)))).filter(v => v !== undefined && v !== null);
        
        // Sort unique values logically
        uniqueValues.sort((a, b) => {
            const numA = parseFloat(a.replace(/\s/g, '').replace(',', '.'));
            const numB = parseFloat(b.replace(/\s/g, '').replace(',', '.'));
            if (!isNaN(numA) && !isNaN(numB)) {
                return numA - numB;
            }
            return String(a).localeCompare(String(b), 'ru', { numeric: true });
        });

        const activeSel = this.activeFilters[colId] || null;

        popup.innerHTML = `
            <div class="filter-option" id="excel-sort-asc" style="display: flex; align-items: center; gap: 8px;">
                <i class="ph ph-sort-ascending"></i>
                <span>Сортировка по возрастанию</span>
            </div>
            <div class="filter-option" id="excel-sort-desc" style="display: flex; align-items: center; gap: 8px;">
                <i class="ph ph-sort-descending"></i>
                <span>Сортировка по убыванию</span>
            </div>
            <div class="filter-divider"></div>
            <div class="filter-search-wrapper">
                <i class="ph ph-magnifying-glass"></i>
                <input type="text" class="filter-search-input" placeholder="Поиск..." id="excel-search-input">
            </div>
            <div class="checkbox-list" id="excel-checkbox-list">
                <label class="checkbox-item">
                    <input type="checkbox" id="excel-select-all" checked>
                    <span>(Выделить все)</span>
                </label>
                ${uniqueValues.map(val => {
                    const isChecked = !activeSel || activeSel.includes(val);
                    return `
                        <label class="checkbox-item unique-val-item" data-val="${escapeHtml(val)}">
                            <input type="checkbox" class="excel-val-chk" data-val="${escapeHtml(val)}" ${isChecked ? 'checked' : ''}>
                            <span>${val === '' ? '(Пустые)' : escapeHtml(val)}</span>
                        </label>
                    `;
                }).join('')}
            </div>
            <div class="filter-actions">
                <button class="btn btn-secondary" id="excel-filter-cancel">Отмена</button>
                <button class="btn btn-secondary" id="excel-filter-clear">Сбросить</button>
                <button class="btn btn-primary" id="excel-filter-ok">ОК</button>
            </div>
        `;

        // Search input logic
        const searchInput = popup.querySelector('#excel-search-input');
        const chkItems = popup.querySelectorAll('.unique-val-item');
        const selectAllChk = popup.querySelector('#excel-select-all');

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            chkItems.forEach(item => {
                const val = item.getAttribute('data-val').toLowerCase();
                if (val.includes(query)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
            updateSelectAllState();
        });

        // Checkboxes change event
        const valChks = popup.querySelectorAll('.excel-val-chk');
        valChks.forEach(chk => {
            chk.addEventListener('change', () => {
                updateSelectAllState();
            });
        });

        const updateSelectAllState = () => {
            const visibleChks = popup.querySelectorAll('.unique-val-item:not([style*="display: none"]) .excel-val-chk');
            if (visibleChks.length === 0) {
                selectAllChk.checked = false;
                selectAllChk.indeterminate = false;
            } else {
                const allChecked = Array.from(visibleChks).every(c => c.checked);
                const someChecked = Array.from(visibleChks).some(c => c.checked);
                selectAllChk.checked = allChecked;
                selectAllChk.indeterminate = !allChecked && someChecked;
            }
        };

        updateSelectAllState();

        selectAllChk.addEventListener('change', (e) => {
            const visibleChks = popup.querySelectorAll('.unique-val-item:not([style*="display: none"]) .excel-val-chk');
            visibleChks.forEach(chk => {
                chk.checked = e.target.checked;
            });
        });

        // Click handlers
        popup.querySelector('#excel-sort-asc').addEventListener('click', () => {
            this.sortColumn = colId;
            this.sortDirection = 'asc';
            popup.style.display = 'none';
            this.renderTable(this.currentViewport);
        });

        popup.querySelector('#excel-sort-desc').addEventListener('click', () => {
            this.sortColumn = colId;
            this.sortDirection = 'desc';
            popup.style.display = 'none';
            this.renderTable(this.currentViewport);
        });

        popup.querySelector('#excel-filter-clear').addEventListener('click', () => {
            delete this.activeFilters[colId];
            if (this.sortColumn === colId) {
                this.sortColumn = null;
                this.sortDirection = null;
            }
            popup.style.display = 'none';
            this.currentPage = 1;
            this.renderTable(this.currentViewport);
        });

        popup.querySelector('#excel-filter-cancel').addEventListener('click', () => {
            popup.style.display = 'none';
        });

        popup.querySelector('#excel-filter-ok').addEventListener('click', () => {
            const checkedVals = Array.from(popup.querySelectorAll('.excel-val-chk:checked')).map(chk => chk.getAttribute('data-val'));
            if (checkedVals.length === valChks.length) {
                delete this.activeFilters[colId];
            } else {
                this.activeFilters[colId] = checkedVals;
            }
            popup.style.display = 'none';
            this.currentPage = 1;
            this.renderTable(this.currentViewport);
        });

        // Position and show popover
        popup.style.display = 'flex';
        const rect = btn.getBoundingClientRect();
        let top = rect.bottom + window.scrollY + 5;
        let left = rect.left + window.scrollX - 220;
        
        if (left < 10) left = 10;
        const screenWidth = window.innerWidth;
        if (left + 250 > screenWidth - 10) {
            left = screenWidth - 260;
        }
        
        popup.style.top = `${top}px`;
        popup.style.left = `${left}px`;

        const outsideClickListener = (e) => {
            if (!popup.contains(e.target) && !e.target.closest('.btn-excel-filter')) {
                popup.style.display = 'none';
                document.removeEventListener('click', outsideClickListener);
            }
        };
        setTimeout(() => {
            document.addEventListener('click', outsideClickListener);
        }, 10);
    }

    bindEvents(viewport) {
        // Toggle columns popover
        const btnToggle = document.getElementById(`btn-toggle-cols-${this.type}`);
        const popover = document.getElementById(`popover-cols-${this.type}`);
        if (btnToggle && popover) {
            btnToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const rect = btnToggle.getBoundingClientRect();
                popover.style.top = `${rect.bottom + window.scrollY + 5}px`;
                popover.style.left = `${rect.left + window.scrollX - 100}px`;
                popover.style.display = popover.style.display === 'none' ? 'block' : 'none';
            });
            document.addEventListener('click', () => {
                popover.style.display = 'none';
            });
            popover.addEventListener('click', (e) => e.stopPropagation());
        }

        // Column visibility checkboxes
        viewport.querySelectorAll('.col-visibility-chk').forEach(chk => {
            chk.addEventListener('change', () => {
                const colId = chk.getAttribute('data-col');
                this.visibleColumns[colId] = chk.checked;
                this.saveColumnPreferences();
                this.renderTable(viewport);
            });
        });

        // Excel filter buttons
        viewport.querySelectorAll('.btn-excel-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const colId = btn.getAttribute('data-col');
                this.openExcelFilterPopup(btn, colId);
            });
        });

        // Click row opens view modal
        viewport.querySelectorAll('.clickable-row').forEach(row => {
            row.addEventListener('click', (e) => {
                // If clicked on action buttons or cell, don't open view modal
                if (e.target.closest('.actions-cell') || e.target.closest('button')) return;
                const id = row.getAttribute('data-id');
                this.openViewModal(id);
            });
        });

        // Edit buttons inside table
        viewport.querySelectorAll('.edit-row-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                this.openEditModal(id);
            });
        });

        // Delete buttons inside table
        viewport.querySelectorAll('.delete-row-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                this.deleteRow(id);
            });
        });

        // Create button
        const btnCreate = document.getElementById(`btn-create-${this.type}`);
        if (btnCreate) {
            btnCreate.addEventListener('click', () => {
                this.openEditModal(null);
            });
        }

        // Pagination Limit select
        const limitSelect = viewport.querySelector('.pagination-limit-select');
        if (limitSelect) {
            limitSelect.addEventListener('change', (e) => {
                this.rowsPerPage = parseInt(e.target.value);
                localStorage.setItem(`rows_per_page_${this.type}`, this.rowsPerPage);
                this.currentPage = 1;
                this.renderTable(viewport);
            });
        }

        // Prev page button
        const prevBtn = viewport.querySelector('.prev-btn');
        if (prevBtn && !prevBtn.disabled) {
            prevBtn.addEventListener('click', () => {
                this.currentPage--;
                this.renderTable(viewport);
            });
        }

        // Next page button
        const nextBtn = viewport.querySelector('.next-btn');
        if (nextBtn && !nextBtn.disabled) {
            nextBtn.addEventListener('click', () => {
                this.currentPage++;
                this.renderTable(viewport);
            });
        }

        // Page number buttons
        viewport.querySelectorAll('.page-num-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentPage = parseInt(btn.getAttribute('data-page'));
                this.renderTable(viewport);
            });
        });
    }

    openViewModal(id) {
        const title = `Просмотр: ${this.title}`;
        const body = this.getModalViewBody(id);
        const footer = `
            <button type="button" class="btn btn-secondary" onclick="closeModal()">Закрыть</button>
            <button type="button" class="btn btn-primary" id="btn-view-edit-${this.type}">Изменить</button>
        `;
        openModal(title, body, footer);
        
        setTimeout(() => this.afterModalOpen(id, 'view'), 50);

        document.getElementById(`btn-view-edit-${this.type}`).addEventListener('click', () => {
            closeModal();
            setTimeout(() => this.openEditModal(id), 100);
        });
    }

    openEditModal(id) {
        const title = id ? `Редактирование: ${this.title}` : `Создание: ${this.title}`;
        const body = this.getModalEditBody(id);
        const footer = `
            <button type="button" class="btn btn-secondary" onclick="closeModal()">Отмена</button>
            <button type="button" class="btn btn-primary" id="btn-save-${this.type}">Сохранить</button>
        `;
        openModal(title, body, footer);

        setTimeout(() => this.afterModalOpen(id, 'edit'), 50);

        document.getElementById(`btn-save-${this.type}`).addEventListener('click', () => {
            this.saveRow(id);
        });
    }

    getModalViewBody(id) {
        return `<p>Метод getModalViewBody должен быть переопределен</p>`;
    }

    getModalEditBody(id) {
        return `<p>Метод getModalEditBody должен быть переопределен</p>`;
    }

    afterModalOpen(id, mode) {
        // Optional
    }

    saveRow(id) {
        // Implement in subclass
    }

    deleteRow(id) {
        if (!confirm('Вы действительно хотите удалить эту запись?')) return;
        state[this.stateKey] = state[this.stateKey].filter(x => x.id !== id);
        saveState();
        showToast('Запись успешно удалена', 'success');
        this.renderTable(this.currentViewport);
    }
}
