class NomenclatureDirectory extends BaseEntityComponent {
    constructor() {
        super('nomenclature', 'Номенклатура', 'nomenclature');
    }

    getColumns() {
        return [
            { id: 'code', label: 'Артикул', filterable: true },
            { id: 'name', label: 'Наименование', filterable: true },
            { id: 'type', label: 'Вид номенклатуры', filterable: true }
        ];
    }

    getColumnValue(record, colId) {
        if (colId === 'code') return `<strong>${record.code}</strong>`;
        if (colId === 'type') {
            const typeObj = state.nomenclatureTypes.find(t => t.id === record.type) || {};
            return `<span class="badge badge-info">${typeObj.name || record.type}</span>`;
        }
        return record[colId] || '';
    }

    getModalViewBody(id) {
        const item = this.getRecords().find(x => x.id === id);
        const typeObj = state.nomenclatureTypes.find(t => t.id === item.type) || {};
        return `
            <div class="view-details">
                <div class="view-fields-grid">
                    <div class="view-field">
                        <span class="view-field-label">Артикул / Код</span>
                        <span class="view-field-value">${item.code}</span>
                    </div>
                    <div class="view-field">
                        <span class="view-field-label">Вид номенклатуры</span>
                        <span class="view-field-value"><span class="badge badge-info">${typeObj.name || item.type}</span></span>
                    </div>
                </div>
                <div class="view-field">
                    <span class="view-field-label">Наименование</span>
                    <span class="view-field-value">${item.name}</span>
                </div>
            </div>
        `;
    }

    getModalEditBody(id) {
        const item = id ? this.getRecords().find(x => x.id === id) : { code: '', name: '', type: 'ГП' };
        return `
            <form id="dir-form">
                <div class="form-group">
                    <label class="form-label">Артикул / Код</label>
                    <input type="text" class="form-control" name="code" value="${item.code}" required placeholder="Например: ГП-001">
                </div>
                <div class="form-group">
                    <label class="form-label">Наименование</label>
                    <input type="text" class="form-control" name="name" value="${item.name}" required placeholder="Например: Носки шерстяные красные">
                </div>
                <div class="form-group">
                    <label class="form-label">Вид номенклатуры</label>
                    <select class="form-control" name="type" required>
                        ${state.nomenclatureTypes.map(t => `<option value="${t.id}" ${t.id === item.type ? 'selected' : ''}>${t.name}</option>`).join('')}
                    </select>
                </div>
            </form>
        `;
    }

    saveRow(id) {
        const form = document.getElementById('dir-form');
        if (!form.reportValidity()) return;
        const fd = new FormData(form);
        if (id) {
            const idx = state.nomenclature.findIndex(x => x.id === id);
            state.nomenclature[idx] = { ...state.nomenclature[idx], code: fd.get('code'), name: fd.get('name'), type: fd.get('type') };
        } else {
            state.nomenclature.push({
                id: 'n_' + Date.now(),
                code: fd.get('code'),
                name: fd.get('name'),
                type: fd.get('type')
            });
        }
        saveState();
        closeModal();
        showToast('Номенклатура успешно сохранена!', 'success');
        this.renderTable(this.currentViewport);
    }
}

class CounterpartyDirectory extends BaseEntityComponent {
    constructor() {
        super('counterparties', 'Контрагенты', 'counterparties');
    }

    getColumns() {
        return [
            { id: 'name', label: 'Контрагент', filterable: true },
            { id: 'phone', label: 'Телефон', filterable: true },
            { id: 'contracts', label: 'Договоры', filterable: true }
        ];
    }

    getColumnValue(record, colId) {
        if (colId === 'name') return `<strong>${record.name}</strong>`;
        if (colId === 'contracts') {
            const contracts = state.contracts.filter(con => con.counterpartyId === record.id);
            return contracts.map(con => `<span class="badge badge-success" style="margin-right: 4px;">${con.num} (${con.currency})</span>`).join('') || '<span class="text-muted">Нет договора</span>';
        }
        return record[colId] || '—';
    }

    getModalViewBody(id) {
        const item = this.getRecords().find(x => x.id === id);
        const contracts = state.contracts.filter(con => con.counterpartyId === id);
        return `
            <div class="view-details">
                <div class="view-fields-grid">
                    <div class="view-field">
                        <span class="view-field-label">Название контрагента</span>
                        <span class="view-field-value">${item.name}</span>
                    </div>
                    <div class="view-field">
                        <span class="view-field-label">Телефон</span>
                        <span class="view-field-value">${item.phone || '—'}</span>
                    </div>
                </div>
                <div>
                    <span class="text-secondary" style="font-size: 11px; display: block; margin-bottom: 6px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Договоры контрагента</span>
                    <table class="data-table" style="width: 100%; font-size: 12px;">
                        <thead>
                            <tr>
                                <th>Номер договора</th>
                                <th>Валюта расчетов</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${contracts.map(con => `
                                <tr>
                                    <td><i class="ph ph-file-text text-success" style="margin-right: 6px;"></i><strong>${con.num}</strong></td>
                                    <td>${con.currency}</td>
                                </tr>
                            `).join('') || `<tr><td colspan="2" class="text-secondary" style="text-align: center;">Договоры отсутствуют</td></tr>`}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    getModalEditBody(id) {
        const item = id ? this.getRecords().find(x => x.id === id) : { name: '', phone: '' };
        return `
            <form id="dir-form">
                <div class="form-group">
                    <label class="form-label">Название контрагента</label>
                    <input type="text" class="form-control" name="name" value="${item.name}" required placeholder='Например: ООО "Мир текстиля"'>
                </div>
                <div class="form-group">
                    <label class="form-label">Телефон</label>
                    <input type="text" class="form-control" name="phone" id="counterparty-phone-input" value="${item.phone || ''}">
                </div>
                
                <hr style="border: none; border-top: 1px solid var(--border-color); margin: 20px 0;">
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <h4 style="font-size: 14px; margin: 0;"><i class="ph ph-file-text" style="margin-right: 6px;"></i>Договоры контрагента</h4>
                    <button type="button" class="btn btn-secondary" id="btn-add-contract-row" style="padding: 4px 10px; font-size: 11px;">
                        <i class="ph ph-plus"></i>Добавить договор
                    </button>
                </div>
                
                <div class="table-wrapper">
                    <table class="table-form" id="counterparty-contracts-table">
                        <thead>
                            <tr>
                                <th>Номер договора</th>
                                <th style="width: 200px;">Валюта расчетов</th>
                                <th style="width: 50px;"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Loaded asynchronously in afterModalOpen -->
                        </tbody>
                    </table>
                </div>
            </form>
        `;
    }

    afterModalOpen(id, mode) {
        if (mode === 'edit') {
            const tableBody = document.querySelector('#counterparty-contracts-table tbody');
            const phoneInput = document.getElementById('counterparty-phone-input');
            if (phoneInput) {
                applyPhoneMask(phoneInput);
            }
            
            function addContractRow(data = null) {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>
                        <input type="text" class="form-control row-contract-num" value="${data ? data.num : 'ДОГ-' + Math.floor(100 + Math.random()*900)}" required placeholder="ДОГ-123">
                    </td>
                    <td>
                        <select class="form-control row-contract-currency" required>
                            <option value="KGS" ${data && data.currency === 'KGS' ? 'selected' : ''}>KGS (Сом)</option>
                            <option value="RUB" ${data && data.currency === 'RUB' ? 'selected' : ''}>RUB (Рубли)</option>
                            <option value="USD" ${data && data.currency === 'USD' ? 'selected' : ''}>USD (Доллары)</option>
                            <option value="EUR" ${data && data.currency === 'EUR' ? 'selected' : ''}>EUR (Евро)</option>
                            <option value="CNY" ${data && data.currency === 'CNY' ? 'selected' : ''}>CNY (Юани)</option>
                        </select>
                    </td>
                    <td>
                        <button type="button" class="btn btn-danger btn-icon-only btn-remove-contract-row"><i class="ph ph-trash"></i></button>
                    </td>
                `;
                tableBody.appendChild(tr);
                tr.querySelector('.btn-remove-contract-row').addEventListener('click', () => tr.remove());
            }
            
            const cpContracts = id ? state.contracts.filter(con => con.counterpartyId === id) : [];
            if (cpContracts.length > 0) {
                cpContracts.forEach(con => addContractRow(con));
            } else {
                addContractRow();
            }
            
            document.getElementById('btn-add-contract-row').addEventListener('click', () => addContractRow());
        }
    }

    saveRow(id) {
        const form = document.getElementById('dir-form');
        if (!form.reportValidity()) return;
        const name = form.name.value;
        const phone = form.phone.value;
        const cpId = id || 'c_' + Date.now();
        
        if (!id) {
            state.counterparties.push({ id: cpId, name, phone });
        } else {
            const item = state.counterparties.find(x => x.id === id);
            item.name = name;
            item.phone = phone;
        }
        
        // Save contracts
        const contractRows = document.querySelectorAll('#counterparty-contracts-table tbody tr');
        const newContracts = [];
        contractRows.forEach((tr, i) => {
            newContracts.push({
                id: 'con_' + i + '_' + Date.now(),
                num: tr.querySelector('.row-contract-num').value,
                counterpartyId: cpId,
                currency: tr.querySelector('.row-contract-currency').value
            });
        });
        
        if (newContracts.length === 0) {
            alert('Каждый контрагент должен иметь хотя бы один договор!');
            return;
        }
        
        state.contracts = state.contracts.filter(c => c.counterpartyId !== cpId);
        state.contracts.push(...newContracts);
        
        saveState();
        closeModal();
        showToast('Контрагент успешно сохранен!', 'success');
        this.renderTable(this.currentViewport);
    }
}

class EmployeeDirectory extends BaseEntityComponent {
    constructor() {
        super('employees', 'Сотрудники', 'employees');
    }

    getColumns() {
        return [
            { id: 'name', label: 'ФИО Сотрудника', filterable: true },
            { id: 'role', label: 'Должность / Профиль', filterable: true }
        ];
    }

    getColumnValue(record, colId) {
        if (colId === 'name') return `<strong>${record.name}</strong>`;
        if (colId === 'role') return `<span class="badge badge-info">${record.role}</span>`;
        return record[colId] || '';
    }

    getModalViewBody(id) {
        const item = this.getRecords().find(x => x.id === id);
        return `
            <div class="view-details">
                <div class="view-fields-grid">
                    <div class="view-field">
                        <span class="view-field-label">ФИО сотрудника</span>
                        <span class="view-field-value">${item.name}</span>
                    </div>
                    <div class="view-field">
                        <span class="view-field-label">Должность / Специализация</span>
                        <span class="view-field-value"><span class="badge badge-info">${item.role}</span></span>
                    </div>
                </div>
            </div>
        `;
    }

    getModalEditBody(id) {
        const item = id ? this.getRecords().find(x => x.id === id) : { name: '', role: 'Оператор' };
        return `
            <form id="dir-form">
                <div class="form-group">
                    <label class="form-label">ФИО сотрудника</label>
                    <input type="text" class="form-control" name="name" value="${item.name}" required placeholder="Иванов Иван Иванович">
                </div>
                <div class="form-group">
                    <label class="form-label">Роль / Специализация</label>
                    <select class="form-control" name="role" required>
                        <option value="Оператор" ${item.role === 'Оператор' ? 'selected' : ''}>Оператор вязального оборудования</option>
                        <option value="Швея" ${item.role === 'Швея' ? 'selected' : ''}>Швея (прошив)</option>
                        <option value="Бригадир" ${item.role === 'Бригадир' ? 'selected' : ''}>Бригадир производственной линии</option>
                        <option value="Конструктор" ${item.role === 'Конструктор' ? 'selected' : ''}>Конструктор-технолог карточек</option>
                        <option value="Механик" ${item.role === 'Механик' ? 'selected' : ''}>Механик / Наладчик оборудования</option>
                        <option value="Упаковщик" ${item.role === 'Упаковщик' ? 'selected' : ''}>Оператор упаковки</option>
                    </select>
                </div>
            </form>
        `;
    }

    saveRow(id) {
        const form = document.getElementById('dir-form');
        if (!form.reportValidity()) return;
        const name = form.name.value;
        const role = form.role.value;
        if (id) {
            const idx = state.employees.findIndex(x => x.id === id);
            state.employees[idx] = { ...state.employees[idx], name, role };
        } else {
            state.employees.push({ id: 'e_' + Date.now(), name, role });
        }
        saveState();
        closeModal();
        showToast('Сотрудник успешно сохранен!', 'success');
        this.renderTable(this.currentViewport);
    }
}

class EquipmentDirectory extends BaseEntityComponent {
    constructor() {
        super('equipment', 'Оборудование', 'equipment');
    }

    getColumns() {
        return [
            { id: 'num', label: 'Номер станка / машины', filterable: true },
            { id: 'type', label: 'Тип оборудования', filterable: true },
            { id: 'workerName', label: 'Ответственный сотрудник', filterable: true }
        ];
    }

    getColumnValue(record, colId) {
        if (colId === 'num') return `<strong>${record.num}</strong>`;
        if (colId === 'workerName') {
            let workerName = '—';
            if (record.operatorId) {
                workerName = (state.employees.find(e => e.id === record.operatorId) || {}).name || '—';
            } else if (record.seamstressId) {
                workerName = (state.employees.find(e => e.id === record.seamstressId) || {}).name || '—';
            }
            return `<i class="ph ph-user" style="margin-right: 6px;"></i>${workerName}`;
        }
        return record[colId] || '';
    }

    getModalViewBody(id) {
        const item = this.getRecords().find(x => x.id === id);
        let workerName = '—';
        if (item.operatorId) {
            workerName = (state.employees.find(e => e.id === item.operatorId) || {}).name || '—';
        } else if (item.seamstressId) {
            workerName = (state.employees.find(e => e.id === item.seamstressId) || {}).name || '—';
        }
        return `
            <div class="view-details">
                <div class="view-fields-grid" style="grid-template-columns: 1fr 1.5fr;">
                    <div class="view-field">
                        <span class="view-field-label">Инвентарный / Персональный №</span>
                        <span class="view-field-value">${item.num}</span>
                    </div>
                    <div class="view-field">
                        <span class="view-field-label">Тип оборудования</span>
                        <span class="view-field-value">${item.type}</span>
                    </div>
                </div>
                <div class="view-field">
                    <span class="view-field-label">Закрепленный ответственный</span>
                    <span class="view-field-value"><i class="ph ph-user" style="margin-right: 6px;"></i>${workerName}</span>
                </div>
            </div>
        `;
    }

    getModalEditBody(id) {
        const item = id ? this.getRecords().find(x => x.id === id) : { type: 'Вязальный станок', num: '', operatorId: '', seamstressId: '' };
        const operators = state.employees.filter(e => e.role === 'Оператор');
        const seamstresses = state.employees.filter(e => e.role === 'Швея');
        return `
            <form id="dir-form">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Тип оборудования</label>
                        <select class="form-control" name="type" id="equipment-type-select" required>
                            <option value="Вязальный станок" ${item.type === 'Вязальный станок' ? 'selected' : ''}>Вязальный станок</option>
                            <option value="Швейная машина" ${item.type === 'Швейная машина' ? 'selected' : ''}>Швейная машина</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Инвентарный / Персональный №</label>
                        <input type="text" class="form-control" name="num" value="${item.num}" required placeholder="Например: ВЗ-06">
                    </div>
                </div>
                
                <div class="form-group" id="opt-operator-group" style="${item.type === 'Вязальный станок' ? '' : 'display:none;'}">
                    <label class="form-label">Ответственный оператор</label>
                    <select class="form-control" name="operatorId">
                        <option value="">-- Выберите оператора --</option>
                        ${operators.map(op => `<option value="${op.id}" ${op.id === item.operatorId ? 'selected' : ''}>${op.name}</option>`).join('')}
                    </select>
                </div>
                
                <div class="form-group" id="opt-seamstress-group" style="${item.type === 'Швейная машина' ? '' : 'display:none;'}">
                    <label class="form-label">Закрепленная швея (1 станок = 1 швея)</label>
                    <select class="form-control" name="seamstressId">
                        <option value="">-- Выберите швею --</option>
                        ${seamstresses.map(s => `<option value="${s.id}" ${s.id === item.seamstressId ? 'selected' : ''}>${s.name}</option>`).join('')}
                    </select>
                </div>
            </form>
        `;
    }

    afterModalOpen(id, mode) {
        if (mode === 'edit') {
            const selectEl = document.getElementById('equipment-type-select');
            const opGrp = document.getElementById('opt-operator-group');
            const seamGrp = document.getElementById('opt-seamstress-group');
            selectEl.addEventListener('change', () => {
                if (selectEl.value === 'Вязальный станок') {
                    opGrp.style.display = '';
                    seamGrp.style.display = 'none';
                } else {
                    opGrp.style.display = 'none';
                    seamGrp.style.display = '';
                }
            });
        }
    }

    saveRow(id) {
        const form = document.getElementById('dir-form');
        if (!form.reportValidity()) return;
        const fd = new FormData(form);
        const eqType = fd.get('type');
        const opId = fd.get('operatorId') || null;
        const seamId = fd.get('seamstressId') || null;
        
        if (eqType === 'Швейная машина' && seamId) {
            const alreadyAssigned = state.equipment.find(eq => eq.seamstressId === seamId && eq.id !== id);
            if (alreadyAssigned) {
                alert(`Ошибка: Эта швея уже закреплена за швейной машиной ${alreadyAssigned.num}! По правилам, у швеи может быть только одна швейная машина.`);
                return;
            }
        }
        
        if (id) {
            const idx = state.equipment.findIndex(x => x.id === id);
            state.equipment[idx] = { 
                ...state.equipment[idx], 
                type: eqType, 
                num: fd.get('num'), 
                operatorId: eqType === 'Вязальный станок' ? opId : null,
                seamstressId: eqType === 'Швейная машина' ? seamId : null
            };
        } else {
            state.equipment.push({
                id: 'eq_' + Date.now(),
                type: eqType,
                num: fd.get('num'),
                operatorId: eqType === 'Вязальный станок' ? opId : null,
                seamstressId: eqType === 'Швейная машина' ? seamId : null
            });
        }
        saveState();
        closeModal();
        showToast('Оборудование успешно сохранено!', 'success');
        this.renderTable(this.currentViewport);
    }
}

class LineDirectory extends BaseEntityComponent {
    constructor() {
        super('lines', 'Производственные линии', 'lines');
    }

    getColumns() {
        return [
            { id: 'name', label: 'Линия', filterable: true },
            { id: 'foreman', label: 'Бригадир', filterable: true },
            { id: 'operators', label: 'Операторы на линии', filterable: true }
        ];
    }

    getColumnValue(record, colId) {
        if (colId === 'name') return `<strong>${record.name}</strong>`;
        if (colId === 'foreman') {
            const foreman = state.employees.find(e => e.id === record.foremanId) || {};
            return foreman.name || 'Не назначен';
        }
        if (colId === 'operators') {
            const ops = record.operatorIds.map(id => state.employees.find(e => e.id === id)).filter(Boolean);
            return ops.map(o => `<span class="badge badge-info" style="margin-right: 4px;">${o.name.split(' ')[0]}</span>`).join('') || '<span class="text-muted">Нет операторов</span>';
        }
        return record[colId] || '';
    }

    getModalViewBody(id) {
        const item = this.getRecords().find(x => x.id === id);
        const foreman = state.employees.find(e => e.id === item.foremanId) || {};
        const ops = item.operatorIds.map(oId => state.employees.find(e => e.id === oId)).filter(Boolean);
        return `
            <div class="view-details">
                <div class="view-fields-grid">
                    <div class="view-field">
                        <span class="view-field-label">Линия</span>
                        <span class="view-field-value">${item.name}</span>
                    </div>
                    <div class="view-field">
                        <span class="view-field-label">Бригадир</span>
                        <span class="view-field-value"><i class="ph ph-user" style="margin-right: 6px;"></i>${foreman.name || 'Не назначен'}</span>
                    </div>
                </div>
                <div>
                    <span class="text-secondary" style="font-size: 11px; display: block; margin-bottom: 6px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Операторы на линии</span>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                        ${ops.map(o => `<span class="badge badge-info" style="padding: 6px 12px; font-size: 12px;"><i class="ph ph-user" style="margin-right: 4px;"></i>${o.name}</span>`).join('') || '<span class="text-muted">Операторы отсутствуют</span>'}
                    </div>
                </div>
            </div>
        `;
    }

    getModalEditBody(id) {
        const item = id ? this.getRecords().find(x => x.id === id) : { name: '', foremanId: '', operatorIds: [] };
        const foremen = state.employees.filter(e => e.role === 'Бригадир');
        const operators = state.employees.filter(e => e.role === 'Оператор');
        return `
            <form id="dir-form">
                <div class="form-group">
                    <label class="form-label">Название линии</label>
                    <input type="text" class="form-control" name="name" value="${item.name}" required placeholder="Линия вязания №2">
                </div>
                <div class="form-group">
                    <label class="form-label">Бригадир (управляет линией)</label>
                    <select class="form-control" name="foremanId" required>
                        <option value="">-- Выберите бригадира --</option>
                        ${foremen.map(f => `<option value="${f.id}" ${f.id === item.foremanId ? 'selected' : ''}>${f.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Подчинённые операторы (выберите нескольких через Ctrl)</label>
                    <select class="form-control" name="operatorIds" multiple style="height: 120px;">
                        ${operators.map(op => `<option value="${op.id}" ${item.operatorIds.includes(op.id) ? 'selected' : ''}>${op.name}</option>`).join('')}
                    </select>
                    <span class="text-muted" style="font-size: 11px; margin-top: 4px; display: block;">Зажмите Ctrl на Windows или Command на Mac, чтобы выбрать нескольких операторов.</span>
                </div>
            </form>
        `;
    }

    saveRow(id) {
        const form = document.getElementById('dir-form');
        if (!form.reportValidity()) return;
        const fd = new FormData(form);
        const selectEl = form.querySelector('select[name="operatorIds"]');
        const selectedOperators = Array.from(selectEl.selectedOptions).map(option => option.value);
        
        // Validation: one operator can only work on one line
        for (const opId of selectedOperators) {
            const alreadyAssignedLine = state.lines.find(line => line.operatorIds.includes(opId) && line.id !== id);
            if (alreadyAssignedLine) {
                const opName = (state.employees.find(e => e.id === opId) || {}).name || opId;
                alert(`Ошибка: Оператор "${opName}" уже закреплен за линией "${alreadyAssignedLine.name}"! Один оператор может работать только на одной линии.`);
                return;
            }
        }
        
        if (id) {
            const idx = state.lines.findIndex(x => x.id === id);
            state.lines[idx] = {
                ...state.lines[idx],
                name: fd.get('name'),
                foremanId: fd.get('foremanId'),
                operatorIds: selectedOperators
            };
        } else {
            state.lines.push({
                id: 'l_' + Date.now(),
                name: fd.get('name'),
                foremanId: fd.get('foremanId'),
                operatorIds: selectedOperators
            });
        }
        saveState();
        closeModal();
        showToast('Линия успешно сохранена!', 'success');
        this.renderTable(this.currentViewport);
    }
}

class ExchangeRateDirectory extends BaseEntityComponent {
    constructor() {
        super('rates', 'Курсы валют', 'rates');
    }

    getColumns() {
        return [
            { id: 'date', label: 'Дата курса', filterable: true },
            { id: 'currency', label: 'Валюта', filterable: true },
            { id: 'rate', label: 'Курс (к Сому)', filterable: true }
        ];
    }

    getColumnValue(record, colId) {
        if (colId === 'date') return record.date;
        if (colId === 'currency') return `<span class="badge badge-info">${record.currency}</span>`;
        if (colId === 'rate') return `<strong>${formatMoney(record.rate)}</strong>`;
        return record[colId] || '';
    }

    getModalViewBody(id) {
        const item = this.getRecords().find(x => x.id === id);
        return `
            <div class="view-details">
                <div class="view-fields-grid">
                    <div class="view-field">
                        <span class="view-field-label">Дата</span>
                        <span class="view-field-value">${item.date}</span>
                    </div>
                    <div class="view-field">
                        <span class="view-field-label">Валюта</span>
                        <span class="view-field-value"><span class="badge badge-info">${item.currency}</span></span>
                    </div>
                </div>
                <div class="view-field">
                    <span class="view-field-label">Курс (к Сому)</span>
                    <span class="view-field-value"><strong>${formatMoney(item.rate)}</strong></span>
                </div>
            </div>
        `;
    }

    getModalEditBody(id) {
        const item = id ? this.getRecords().find(x => x.id === id) : { date: new Date().toISOString().split('T')[0], currency: 'USD', rate: 1.0 };
        return `
            <form id="dir-form">
                <div class="form-group">
                    <label class="form-label">Дата</label>
                    <input type="date" class="form-control" name="date" value="${item.date}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Валюта</label>
                    <select class="form-control" name="currency" required>
                        <option value="USD" ${item.currency === 'USD' ? 'selected' : ''}>USD - Доллар США</option>
                        <option value="EUR" ${item.currency === 'EUR' ? 'selected' : ''}>EUR - Евро</option>
                        <option value="RUB" ${item.currency === 'RUB' ? 'selected' : ''}>RUB - Российский рубль</option>
                        <option value="KZT" ${item.currency === 'KZT' ? 'selected' : ''}>KZT - Казахстанский тенге</option>
                        <option value="CNY" ${item.currency === 'CNY' ? 'selected' : ''}>CNY - Китайский юань</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Курс (к Сому)</label>
                    <input type="text" class="form-control" name="rate" id="rate-input-field" value="${formatMoney(item.rate)}" required>
                </div>
            </form>
        `;
    }

    getExtraButtons() {
        return `
            <button class="btn btn-secondary" id="btn-import-nbkr">
                <i class="ph ph-download-simple"></i>
                <span>Загрузить из НБКР</span>
            </button>
        `;
    }

    afterModalOpen(id, mode) {
        if (mode === 'edit') {
            const rateInput = document.getElementById('rate-input-field');
            setupNumericFormatting(rateInput, 'money');
        }
    }

    bindEvents(viewport) {
        super.bindEvents(viewport);
        const btnImport = document.getElementById('btn-import-nbkr');
        if (btnImport) {
            btnImport.addEventListener('click', () => {
                this.openImportModal();
            });
        }
    }

    openImportModal() {
        const title = 'Загрузка курсов из НБКР';
        const today = new Date().toISOString().split('T')[0];
        const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const body = `
            <form id="import-nbkr-form">
                <div class="form-group">
                    <label class="form-label">Валюта</label>
                    <select class="form-control" name="currency" required>
                        <option value="USD">USD - Доллар США</option>
                        <option value="EUR">EUR - Евро</option>
                        <option value="RUB">RUB - Российский рубль</option>
                        <option value="KZT">KZT - Казахстанский тенге</option>
                        <option value="CNY">CNY - Китайский юань</option>
                    </select>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 10px;">
                    <div class="form-group">
                        <label class="form-label">Дата начала</label>
                        <input type="date" class="form-control" name="begDate" value="${monthAgo}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Дата окончания</label>
                        <input type="date" class="form-control" name="endDate" value="${today}" required>
                    </div>
                </div>
            </form>
        `;
        const footer = `
            <button type="button" class="btn btn-secondary" onclick="closeModal()">Отмена</button>
            <button type="button" class="btn btn-primary" id="btn-do-import">Загрузить</button>
        `;
        openModal(title, body, footer);

        document.getElementById('btn-do-import').addEventListener('click', () => {
            this.runImport();
        });
    }

    async runImport() {
        const form = document.getElementById('import-nbkr-form');
        if (!form.reportValidity()) return;

        const currency = form.currency.value;
        const begDate = form.begDate.value;
        const endDate = form.endDate.value;

        if (begDate > endDate) {
            alert('Дата начала не может быть позже даты окончания!');
            return;
        }

        const currencyIds = {
            'USD': 15,
            'EUR': 20,
            'RUB': 44,
            'KZT': 40,
            'CNY': 24
        };

        const valutaId = currencyIds[currency];
        
        const begParts = begDate.split('-');
        const endParts = endDate.split('-');
        
        const begDay = begParts[2];
        const begMonth = begParts[1];
        const begYear = begParts[0];

        const endDay = endParts[2];
        const endMonth = endParts[1];
        const endYear = endParts[0];

        const nbkrUrl = `https://www.nbkr.kg/index1.jsp?item=1562&lang=RUS&valuta_id=${valutaId}&beg_day=${begDay}&beg_month=${begMonth}&beg_year=${begYear}&end_day=${endDay}&end_month=${endMonth}&end_year=${endYear}`;
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(nbkrUrl)}`;

        const btnDoImport = document.getElementById('btn-do-import');
        btnDoImport.disabled = true;
        btnDoImport.innerHTML = '<i class="ph ph-spinner spinner" style="margin-right: 6px;"></i>Загрузка...';

        try {
            const response = await fetch(proxyUrl);
            if (!response.ok) throw new Error('Ошибка сети');
            const html = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const rows = doc.querySelectorAll('tr');
            let importCount = 0;

            rows.forEach(row => {
                const dateTd = row.querySelector('.stat-center');
                const rateTd = row.querySelector('.stat-right');

                if (dateTd && rateTd) {
                    const dateStr = dateTd.textContent.trim(); // DD.MM.YYYY
                    const rateStr = rateTd.textContent.trim().replace(/\s/g, '').replace(',', '.');

                    const dateParts = dateStr.split('.');
                    if (dateParts.length === 3) {
                        const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
                        const rateVal = parseFloat(rateStr);

                        if (!isNaN(rateVal)) {
                            const existingIdx = state.rates.findIndex(r => r.date === formattedDate && r.currency === currency);
                            if (existingIdx !== -1) {
                                state.rates[existingIdx].rate = rateVal;
                            } else {
                                state.rates.push({
                                    id: 'rate_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
                                    date: formattedDate,
                                    currency: currency,
                                    rate: rateVal
                                });
                            }
                            importCount++;
                        }
                    }
                }
            });

            saveState();
            closeModal();
            showToast(`Успешно загружено/обновлено курсов: ${importCount}`, 'success');
            this.renderTable(this.currentViewport);
        } catch (error) {
            console.error('Ошибка импорта из НБКР:', error);
            alert('Не удалось загрузить курсы валют из НБКР. Проверьте подключение к Интернету.');
            btnDoImport.disabled = false;
            btnDoImport.innerHTML = 'Загрузить';
        }
    }

    saveRow(id) {
        const form = document.getElementById('dir-form');
        if (!form.reportValidity()) return;
        const date = form.date.value;
        const currency = form.currency.value;
        const rate = parseFormattedNumber(form.rate.value);

        const existingIdx = state.rates.findIndex(x => x.date === date && x.currency === currency && x.id !== id);
        if (existingIdx !== -1) {
            state.rates[existingIdx].rate = rate;
            if (id) {
                state.rates = state.rates.filter(x => x.id !== id);
            }
        } else {
            if (id) {
                const idx = state.rates.findIndex(x => x.id === id);
                state.rates[idx] = { ...state.rates[idx], date, currency, rate };
            } else {
                state.rates.push({
                    id: 'rate_' + Date.now(),
                    date,
                    currency,
                    rate
                });
            }
        }
        saveState();
        closeModal();
        showToast('Курс валюты успешно сохранен!', 'success');
        this.renderTable(this.currentViewport);
    }
}

// Map of directories
const dirMap = {
    'nomenclature': new NomenclatureDirectory(),
    'counterparties': new CounterpartyDirectory(),
    'employees': new EmployeeDirectory(),
    'equipment': new EquipmentDirectory(),
    'lines': new LineDirectory(),
    'rates': new ExchangeRateDirectory()
};

let activeDirTab = 'nomenclature';

function renderDirectories(viewport, preselectTab = null) {
    if (preselectTab) activeDirTab = preselectTab;
    
    viewport.innerHTML = `
        <div class="view-tabs">
            <button class="tab-btn ${activeDirTab === 'nomenclature' ? 'active' : ''}" data-dir="nomenclature">Номенклатура</button>
            <button class="tab-btn ${activeDirTab === 'counterparties' ? 'active' : ''}" data-dir="counterparties">Контрагенты</button>
            <button class="tab-btn ${activeDirTab === 'employees' ? 'active' : ''}" data-dir="employees">Сотрудники</button>
            <button class="tab-btn ${activeDirTab === 'equipment' ? 'active' : ''}" data-dir="equipment">Оборудование</button>
            <button class="tab-btn ${activeDirTab === 'lines' ? 'active' : ''}" data-dir="lines">Производственные линии</button>
            <button class="tab-btn ${activeDirTab === 'rates' ? 'active' : ''}" data-dir="rates">Курсы валют</button>
        </div>
        <div class="table-wrapper" id="dir-table-container" style="margin-top: 20px;">
            <!-- Table rendered here -->
        </div>
    `;
    
    const container = document.getElementById('dir-table-container');
    
    const renderActive = () => {
        if (dirMap[activeDirTab]) {
            dirMap[activeDirTab].renderTable(container);
        }
    };
    
    viewport.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            viewport.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeDirTab = btn.getAttribute('data-dir');
            renderActive();
        });
    });
    
    renderActive();
}
