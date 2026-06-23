class BaseEntityComponent {
    constructor(type, title, stateKey) {
        this.type = type;
        this.title = title;
        this.stateKey = stateKey;
        this.columns = this.getColumns(); // [{ id: '...', label: '...', filterable: true }]
        this.activeFilters = {};
        this.visibleColumns = this.loadColumnPreferences();
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
                            ${visibleCols.map(col => `
                                <th>${col.label}</th>
                            `).join('')}
                            <th style="text-align: right; width: 100px;">Действия</th>
                        </tr>
                        <!-- Filter Row -->
                        <tr class="filter-row" style="background: rgba(0,0,0,0.2);">
                            ${visibleCols.map(col => `
                                <td style="padding: 6px;">
                                    ${col.filterable !== false ? `
                                        <div style="position: relative; display: flex; align-items: center;">
                                            <input type="text" class="form-control col-filter-input" data-col="${col.id}" value="${this.activeFilters[col.id] || ''}" placeholder="Фильтр..." style="padding: 4px 8px; font-size: 11px; height: auto; background: var(--bg-main); border: 1px solid var(--border-color); color: var(--text-primary);">
                                        </div>
                                    ` : ''}
                                </td>
                            `).join('')}
                            <td style="padding: 6px;"></td>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredList.length === 0 ? `
                            <tr>
                                <td colspan="${visibleCols.length + 1}" class="text-secondary" style="text-align: center; padding: 30px;">
                                    Записи не найдены
                                </td>
                            </tr>
                        ` : ''}
                        ${filteredList.map(record => `
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
        `;
        viewport.innerHTML = html;

        this.bindEvents(viewport);
    }

    getFilteredRecords() {
        const list = this.getRecords();
        return list.filter(record => {
            return Object.keys(this.activeFilters).every(colId => {
                const filterVal = this.activeFilters[colId].toLowerCase().trim();
                if (!filterVal) return true;
                const recordVal = this.getColumnValueForFilter(record, colId).toLowerCase();
                return recordVal.includes(filterVal);
            });
        });
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

        // Column filter inputs
        viewport.querySelectorAll('.col-filter-input').forEach(input => {
            input.addEventListener('input', (e) => {
                const colId = input.getAttribute('data-col');
                this.activeFilters[colId] = e.target.value;
                this.renderTable(viewport);
                // Keep focus on the active input
                const newInput = viewport.querySelector(`.col-filter-input[data-col="${colId}"]`);
                if (newInput) {
                    newInput.focus();
                    newInput.setSelectionRange(newInput.value.length, newInput.value.length);
                }
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
