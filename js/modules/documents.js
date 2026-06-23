class OrderDocument extends BaseDocument {
    constructor() {
        super('orders', 'Заявки на заказ покупателей');
    }

    getColumns() {
        return [
            { id: 'date', label: 'Дата', filterable: true },
            { id: 'num', label: 'Номер заказа', filterable: true },
            { id: 'clientName', label: 'Контрагент', filterable: true },
            { id: 'contractNum', label: 'Договор / Валюта', filterable: true },
            { id: 'sum', label: 'Сумма', filterable: false },
            { id: 'sumAcc', label: 'Сумма в уч. валюте', filterable: false }
        ];
    }

    getColumnValue(record, colId) {
        if (colId === 'date') return record.date;
        if (colId === 'num') return `<strong>${record.num}</strong>`;
        if (colId === 'clientName') {
            const client = state.counterparties.find(c => c.id === record.counterpartyId) || {};
            return client.name || '—';
        }
        if (colId === 'contractNum') {
            const contract = state.contracts.find(c => c.id === record.contractId) || {};
            return `<span class="badge badge-success">${contract.num || '—'} (${record.currency})</span>`;
        }
        if (colId === 'sum') {
            const sum = record.items.reduce((acc, i) => acc + (Number(i.sum) || 0), 0);
            return `<strong>${formatMoney(sum)} ${record.currency}</strong>`;
        }
        if (colId === 'sumAcc') {
            const sum = record.items.reduce((acc, i) => acc + (Number(i.sum) || 0), 0);
            const sumAcc = window.convertToAccounting(sum, record.currency, record.date);
            return `<strong>${formatMoney(sumAcc)} ${(state.settings && state.settings.accountingCurrency) || 'KGS'}</strong>`;
        }
        return record[colId] || '';
    }

    getModalViewBody(id) {
        const item = this.getRecords().find(x => x.id === id);
        const client = state.counterparties.find(c => c.id === item.counterpartyId) || {};
        const contract = state.contracts.find(c => c.id === item.contractId) || {};
        const totalSum = item.items.reduce((s, i) => s + Number(i.sum), 0);
        const totalSumAcc = window.convertToAccounting(totalSum, item.currency, item.date);
        return `
            <div class="view-details">
                <div class="view-fields-grid">
                    <div class="view-field">
                        <span class="view-field-label">Номер документа</span>
                        <span class="view-field-value">${item.num}</span>
                    </div>
                    <div class="view-field">
                        <span class="view-field-label">Дата документа</span>
                        <span class="view-field-value">${item.date}</span>
                    </div>
                </div>
                <div class="view-fields-grid">
                    <div class="view-field">
                        <span class="view-field-label">Контрагент</span>
                        <span class="view-field-value">${client.name || '—'}</span>
                    </div>
                    <div class="view-field">
                        <span class="view-field-label">Договор</span>
                        <span class="view-field-value"><span class="badge badge-success">${contract.num || '—'} (${item.currency})</span></span>
                    </div>
                </div>
                <div>
                    <span class="text-secondary" style="font-size: 11px; display: block; margin-bottom: 6px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Товары заказа (Спецификация)</span>
                    <table class="data-table" style="width: 100%; font-size: 12px;">
                        <thead>
                            <tr>
                                <th>Номенклатура</th>
                                <th>Характеристика</th>
                                <th style="text-align: right; width: 120px;">Кол-во (пар / шт)</th>
                                <th style="text-align: right; width: 140px;">Цена (пар / шт)</th>
                                <th style="text-align: right; width: 120px;">Сумма</th>
                                <th style="text-align: right; width: 120px;">Сумма в уч. вал.</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${item.items.map(it => {
                                const prod = state.nomenclature.find(n => n.id === it.productId) || {};
                                const sumAcc = window.convertToAccounting(it.sum, item.currency, item.date);
                                const qtyPcs = it.qty * 2;
                                const pricePc = it.price / 2;
                                return `
                                    <tr>
                                        <td>${prod.name || '—'}</td>
                                        <td class="text-secondary">${it.char}</td>
                                        <td style="text-align: right;">${formatQty(it.qty)} пар<br><small class="text-muted">${formatQty(qtyPcs)} шт</small></td>
                                        <td style="text-align: right;">${formatMoney(it.price)} ${item.currency}<br><small class="text-muted">${formatMoney(pricePc)} за шт</small></td>
                                        <td style="text-align: right;"><strong>${formatMoney(it.sum)} ${item.currency}</strong></td>
                                        <td style="text-align: right;"><strong>${formatMoney(sumAcc)} ${(state.settings && state.settings.accountingCurrency) || 'KGS'}</strong></td>
                                    </tr>
                                `;
                            }).join('')}
                            <tr style="background: rgba(255,255,255,0.02); font-weight: bold;">
                                <td colspan="4" style="text-align: right;">Итого:</td>
                                <td style="text-align: right; color: var(--success);">${formatMoney(totalSum)} ${item.currency}</td>
                                <td style="text-align: right; color: var(--success);">${formatMoney(totalSumAcc)} ${(state.settings && state.settings.accountingCurrency) || 'KGS'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    getModalEditBody(id) {
        const item = id ? this.getRecords().find(x => x.id === id) : { date: new Date().toISOString().split('T')[0], num: 'ЗК-' + Math.floor(100 + Math.random()*900), items: [] };
        return `
            <form id="doc-form">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                    <div class="form-group">
                        <label class="form-label">Номер документа</label>
                        <input type="text" class="form-control" name="num" value="${item.num}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Дата документа</label>
                        <input type="date" class="form-control" name="date" value="${item.date}" required>
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr 120px; gap: 15px;">
                    <div class="form-group">
                        <label class="form-label">Контрагент</label>
                        <select class="form-control" name="counterpartyId" id="order-client-select" required>
                            <option value="">-- Выберите --</option>
                            ${state.counterparties.map(c => `<option value="${c.id}" ${c.id === item.counterpartyId ? 'selected' : ''}>${c.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Договор (определяет валюту)</label>
                        <select class="form-control" name="contractId" id="order-contract-select" required disabled>
                            <option value="">-- Сначала выберите контрагента --</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Валюта</label>
                        <input type="text" class="form-control" name="currency" id="order-currency-input" value="${item.currency || ''}" readonly style="background: rgba(255,255,255,0.03);">
                    </div>
                </div>
                
                <hr style="border: none; border-top: 1px solid var(--border-color); margin: 20px 0;">
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <h4 style="font-size: 14px; margin: 0;">Товары заказа</h4>
                    <button type="button" class="btn btn-secondary" id="btn-add-item-row" style="padding: 4px 10px; font-size: 11px;">
                        <i class="ph ph-plus"></i>Добавить строку
                    </button>
                </div>
                
                <div class="table-wrapper">
                    <table class="table-form" id="order-items-table">
                        <thead>
                            <tr>
                                <th>Номенклатура ГП</th>
                                <th>Характеристика</th>
                                <th class="col-qty">Кол-во (пар)</th>
                                <th class="col-price">Цена</th>
                                <th class="col-sum">Сумма</th>
                                <th class="col-sum">Сумма в уч. вал.</th>
                                <th class="col-btn"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Dynamic items -->
                        </tbody>
                    </table>
                </div>
            </form>
        `;
    }

    afterModalOpen(id, mode) {
        if (mode === 'edit') {
            const clientSelect = document.getElementById('order-client-select');
            const contractSelect = document.getElementById('order-contract-select');
            const currencyInput = document.getElementById('order-currency-input');
            const dateInput = document.querySelector('input[name="date"]');
            const item = id ? this.getRecords().find(x => x.id === id) : null;
            const tableBody = document.querySelector('#order-items-table tbody');

            const updateAllSums = () => {
                const rows = tableBody.querySelectorAll('tr');
                const date = dateInput.value;
                const currency = currencyInput.value || 'KGS';
                rows.forEach(tr => {
                    const qtyInput = tr.querySelector('.row-item-qty');
                    const priceInput = tr.querySelector('.row-item-price');
                    const sumInput = tr.querySelector('.row-item-sum');
                    const sumAccInput = tr.querySelector('.row-item-sum-acc');
                    const qtyPcsHelper = tr.querySelector('.qty-pcs-helper');
                    const pricePcHelper = tr.querySelector('.price-pc-helper');
                    if (qtyInput && priceInput && sumInput && sumAccInput) {
                        const qty = parseFormattedNumber(qtyInput.value);
                        const price = parseFormattedNumber(priceInput.value);
                        const sum = qty * price;
                        sumInput.value = formatMoney(sum);
                        
                        const sumAcc = window.convertToAccounting(sum, currency, date);
                        sumAccInput.value = formatMoney(sumAcc);

                        if (qtyPcsHelper) qtyPcsHelper.textContent = `${formatQty(qty * 2)} шт`;
                        if (pricePcHelper) pricePcHelper.textContent = `${formatMoney(price / 2)} за шт`;
                    }
                });
            };

            const updateContracts = () => {
                const cpId = clientSelect.value;
                if (!cpId) {
                    contractSelect.innerHTML = '<option value="">-- Выберите контрагента --</option>';
                    contractSelect.disabled = true;
                    currencyInput.value = '';
                    updateAllSums();
                    return;
                }
                const contracts = state.contracts.filter(c => c.counterpartyId === cpId);
                contractSelect.innerHTML = contracts.map(c => `<option value="${c.id}" data-curr="${c.currency}">${c.num} (${c.currency})</option>`).join('');
                contractSelect.disabled = false;
                
                if (item && item.counterpartyId === cpId && item.contractId) {
                    contractSelect.value = item.contractId;
                }
                
                const activeCon = state.contracts.find(c => c.id === contractSelect.value);
                currencyInput.value = activeCon ? activeCon.currency : '';
                updateAllSums();
            };

            clientSelect.addEventListener('change', () => {
                updateContracts();
            });
            contractSelect.addEventListener('change', () => {
                const activeCon = state.contracts.find(c => c.id === contractSelect.value);
                currencyInput.value = activeCon ? activeCon.currency : '';
                updateAllSums();
            });
            dateInput.addEventListener('change', updateAllSums);
            
            if (clientSelect.value) updateContracts();

            const addRow = (rowVal = null) => {
                const tr = document.createElement('tr');
                const products = state.nomenclature.filter(n => n.type === 'ГП' || n.type === 'КП');
                
                const initialDate = dateInput.value;
                const initialCurr = currencyInput.value || 'KGS';
                const initialSum = rowVal ? rowVal.sum : 5000;
                const initialSumAcc = window.convertToAccounting(initialSum, initialCurr, initialDate);

                tr.innerHTML = `
                    <td>
                        <select class="form-control row-item-product" required>
                            <option value="">-- Выберите --</option>
                            ${products.map(p => `<option value="${p.id}" ${rowVal && rowVal.productId === p.id ? 'selected' : ''}>${p.name}</option>`).join('')}
                        </select>
                    </td>
                    <td><input type="text" class="form-control row-item-char" value="${rowVal ? rowVal.char : 'Размер 41-43'}" required></td>
                    <td class="col-qty">
                        <input type="text" class="form-control row-item-qty col-qty" value="${rowVal ? formatQty(rowVal.qty) : '100'}" required>
                        <div class="text-muted qty-pcs-helper" style="font-size: 10px; margin-top: 4px; font-weight: 500;"></div>
                    </td>
                    <td class="col-price">
                        <input type="text" class="form-control row-item-price col-price" value="${rowVal ? formatMoney(rowVal.price) : '50'}" required>
                        <div class="text-muted price-pc-helper" style="font-size: 10px; margin-top: 4px; font-weight: 500;"></div>
                    </td>
                    <td class="col-sum"><input type="text" class="form-control row-item-sum col-sum" value="${formatMoney(initialSum)}" readonly style="background: transparent; border-color: transparent;"></td>
                    <td class="col-sum"><input type="text" class="form-control row-item-sum-acc col-sum" value="${formatMoney(initialSumAcc)}" readonly style="background: transparent; border-color: transparent;"></td>
                    <td class="col-btn"><button type="button" class="btn btn-danger btn-icon-only btn-remove-row"><i class="ph ph-trash"></i></button></td>
                `;
                tableBody.appendChild(tr);

                const qtyInput = tr.querySelector('.row-item-qty');
                const priceInput = tr.querySelector('.row-item-price');
                const sumInput = tr.querySelector('.row-item-sum');
                const sumAccInput = tr.querySelector('.row-item-sum-acc');
                const qtyPcsHelper = tr.querySelector('.qty-pcs-helper');
                const pricePcHelper = tr.querySelector('.price-pc-helper');

                const updateRowSum = () => {
                    const qty = parseFormattedNumber(qtyInput.value);
                    const price = parseFormattedNumber(priceInput.value);
                    const sum = qty * price;
                    sumInput.value = formatMoney(sum);
                    
                    const date = dateInput.value;
                    const currency = currencyInput.value || 'KGS';
                    const sumAcc = window.convertToAccounting(sum, currency, date);
                    sumAccInput.value = formatMoney(sumAcc);

                    if (qtyPcsHelper) qtyPcsHelper.textContent = `${formatQty(qty * 2)} шт`;
                    if (pricePcHelper) pricePcHelper.textContent = `${formatMoney(price / 2)} за шт`;
                };

                qtyInput.addEventListener('input', updateRowSum);
                priceInput.addEventListener('input', updateRowSum);
                
                setupNumericFormatting(qtyInput, 'qty');
                setupNumericFormatting(priceInput, 'price');

                updateRowSum();
                
                tr.querySelector('.btn-remove-row').addEventListener('click', () => tr.remove());
            };

            if (item && item.items.length > 0) {
                item.items.forEach(it => addRow(it));
            } else {
                addRow();
            }

            document.getElementById('btn-add-item-row').addEventListener('click', () => addRow());
        }
    }

    saveRow(id) {
        const form = document.getElementById('doc-form');
        if (!form.reportValidity()) return;

        const cpId = form.counterpartyId.value;
        const conId = form.contractId.value;
        const currency = document.getElementById('order-currency-input').value;

        const itemRows = document.querySelectorAll('#order-items-table tbody tr');
        const items = [];
        itemRows.forEach((tr, idx) => {
            const productId = tr.querySelector('.row-item-product').value;
            const char = tr.querySelector('.row-item-char').value;
            const qty = parseFormattedNumber(tr.querySelector('.row-item-qty').value);
            const price = parseFormattedNumber(tr.querySelector('.row-item-price').value);
            const sum = qty * price;
            
            items.push({ id: 'item_' + idx + '_' + Date.now(), productId, char, qty, price, sum });
        });

        if (items.length === 0) {
            alert('Заказ должен содержать хотя бы одну позицию товаров спецификации!');
            return;
        }

        const newOrder = {
            id: id || 'ord_' + Date.now(),
            num: form.num.value,
            date: form.date.value,
            counterpartyId: cpId,
            contractId: conId,
            currency: currency,
            items
        };

        if (id) {
            const index = state.orders.findIndex(x => x.id === id);
            state.orders[index] = newOrder;
        } else {
            state.orders.push(newOrder);
        }

        saveState();
        closeModal();
        showToast('Заказ покупателя успешно сохранен!', 'success');
        this.renderTable(this.currentViewport);
    }
}

class SpecificationDocument extends BaseDocument {
    constructor() {
        super('specifications', 'Технологические карты (Спецификации)');
    }

    getColumns() {
        return [
            { id: 'productName', label: 'Продукт ГП', filterable: true },
            { id: 'name', label: 'Техкарта', filterable: true },
            { id: 'machineNum', label: 'Станок', filterable: true },
            { id: 'genderColor', label: 'Цвет / Пол', filterable: true },
            { id: 'sewingTimeSec', label: 'Время пошива', filterable: true },
            { id: 'materials', label: 'Расход Сырья', filterable: true }
        ];
    }

    getColumnValue(record, colId) {
        if (colId === 'productName') {
            const prod = state.nomenclature.find(n => n.id === record.productId) || {};
            return `<strong>${prod.name || '—'}</strong>`;
        }
        if (colId === 'name') return record.name;
        if (colId === 'machineNum') return `<span class="badge badge-info">${record.machineNum}</span>`;
        if (colId === 'genderColor') return `${record.color} / ${record.gender}`;
        if (colId === 'sewingTimeSec') return `<strong>${formatQty(record.sewingTimeSec)} сек</strong>`;
        if (colId === 'materials') {
            return record.materials.map(m => {
                const mat = state.nomenclature.find(n => n.id === m.id) || {};
                return `<span class="badge badge-success" style="margin-right: 4px;">${mat.name}: ${formatRate(m.qty)} кг/шт</span>`;
            }).join('');
        }
        return record[colId] || '';
    }

    getModalViewBody(id) {
        const item = this.getRecords().find(x => x.id === id);
        const prod = state.nomenclature.find(n => n.id === item.productId) || {};
        const semi = state.nomenclature.find(n => n.id === item.semiProductId) || {};
        return `
            <div class="view-details">
                <div class="view-field">
                    <span class="view-field-label">Название Техкарты</span>
                    <span class="view-field-value">${item.name}</span>
                </div>
                <div class="view-fields-grid">
                    <div class="view-field">
                        <span class="view-field-label">Готовый продукт (ГП)</span>
                        <span class="view-field-value">${prod.name || '—'}</span>
                    </div>
                    <div class="view-field">
                        <span class="view-field-label">Полуфабрикат (ПФ)</span>
                        <span class="view-field-value">${semi.name || '—'}</span>
                    </div>
                </div>
                <div class="view-fields-grid" style="grid-template-columns: 1fr 1fr 1fr;">
                    <div class="view-field">
                        <span class="view-field-label">Станок по умолчанию</span>
                        <span class="view-field-value"><span class="badge badge-info">${item.machineNum}</span></span>
                    </div>
                    <div class="view-field">
                        <span class="view-field-label">Цвет / Пол</span>
                        <span class="view-field-value">${item.color} / ${item.gender}</span>
                    </div>
                    <div class="view-field">
                        <span class="view-field-label">Время пошива 1 шт</span>
                        <span class="view-field-value">${formatQty(item.sewingTimeSec)} сек</span>
                    </div>
                </div>
                <div>
                    <span class="text-secondary" style="font-size: 11px; display: block; margin-bottom: 6px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Нормы расхода сырья на единицу</span>
                    <table class="data-table" style="width: 100%; font-size: 12px;">
                        <thead>
                            <tr>
                                <th>Сырьё / Материал</th>
                                <th style="text-align: right; width: 200px;">Расход (кг/шт)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${item.materials.map(m => {
                                const mat = state.nomenclature.find(n => n.id === m.id) || {};
                                return `
                                    <tr>
                                        <td>${mat.name || '—'}</td>
                                        <td style="text-align: right;"><strong>${formatRate(m.qty)} кг/шт</strong></td>
                                    </tr>
                                `;
                            }).join('') || `<tr><td colspan="2" class="text-secondary" style="text-align: center;">Нормы не заданы</td></tr>`}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    getModalEditBody(id) {
        const doc = id ? this.getRecords().find(x => x.id === id) : { name: '', productId: '', semiProductId: '', machineNum: '', color: '', gender: 'Мужской', sewingTimeSec: 15, materials: [] };
        const gpNomen = state.nomenclature.filter(n => n.type === 'ГП');
        const pfNomen = state.nomenclature.filter(n => n.type === 'ПФ');
        const machines = state.equipment.filter(eq => eq.type.includes('Вязальный'));
        return `
            <form id="doc-form">
                <div class="form-group">
                    <label class="form-label">Название Техкарты / Спецификации</label>
                    <input type="text" class="form-control" name="name" value="${doc.name}" required placeholder="Техкарта на носки Classic Синие">
                </div>
                <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                    <div class="form-group">
                        <label class="form-label">Готовый продукт (ГП)</label>
                        <select class="form-control" name="productId" required>
                            <option value="">-- Выберите ГП --</option>
                            ${gpNomen.map(gp => `<option value="${gp.id}" ${gp.id === doc.productId ? 'selected' : ''}>${gp.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Используемый полуфабрикат (ПФ)</label>
                        <select class="form-control" name="semiProductId" required>
                            <option value="">-- Выберите ПФ заготовку --</option>
                            ${pfNomen.map(pf => `<option value="${pf.id}" ${pf.id === doc.semiProductId ? 'selected' : ''}>${pf.name}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr 1fr 120px; gap: 15px; margin-bottom: 15px;">
                    <div class="form-group">
                        <label class="form-label">Вязальный станок (по умолчанию)</label>
                        <select class="form-control" name="machineNum" required>
                            <option value="">-- Выберите станок --</option>
                            ${machines.map(m => `<option value="${m.num}" ${m.num === doc.machineNum ? 'selected' : ''}>${m.num}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Цвет носков</label>
                        <input type="text" class="form-control" name="color" value="${doc.color}" required placeholder="Красный, Синий...">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Пол</label>
                        <select class="form-control" name="gender" required>
                            <option value="Мужской" ${doc.gender === 'Мужской' ? 'selected' : ''}>Мужской</option>
                            <option value="Женский" ${doc.gender === 'Женский' ? 'selected' : ''}>Женский</option>
                            <option value="Детский" ${doc.gender === 'Детский' ? 'selected' : ''}>Детский</option>
                            <option value="Унисекс" ${doc.gender === 'Унисекс' ? 'selected' : ''}>Унисекс</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Пошив (сек)</label>
                        <input type="text" class="form-control" name="sewingTimeSec" id="spec-sewing-time-input" value="${formatQty(doc.sewingTimeSec)}" required>
                    </div>
                </div>
                <h4 style="margin: 20px 0 10px 0;">Нормы расхода сырья на пару готовой продукции</h4>
                <div class="table-wrapper">
                    <table class="table-form" id="spec-materials-table">
                        <thead>
                            <tr>
                                <th>Сырьё (Вид: С)</th>
                                <th class="col-price">Расход (кг/шт)</th>
                                <th class="col-btn"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Dynamic rows -->
                        </tbody>
                    </table>
                </div>
                <button type="button" class="btn btn-secondary" id="btn-spec-add-line" style="margin-top: 8px;">
                    <i class="ph ph-plus"></i>Добавить расход сырья
                </button>
            </form>
        `;
    }

    afterModalOpen(id, mode) {
        if (mode === 'edit') {
            const tableBody = document.querySelector('#spec-materials-table tbody');
            const item = id ? this.getRecords().find(x => x.id === id) : null;
            
            const sewingTimeInput = document.getElementById('spec-sewing-time-input');
            setupNumericFormatting(sewingTimeInput, 'qty');
            
            const addRow = (rowVal = null) => {
                const tr = document.createElement('tr');
                const rawMaterials = state.nomenclature.filter(n => n.type === 'С' || n.type === 'ПФ');
                tr.innerHTML = `
                    <td>
                        <select class="form-control row-material-select" required>
                            <option value="">-- Выберите сырьё --</option>
                            ${rawMaterials.map(rm => `<option value="${rm.id}" ${rowVal && rowVal.id === rm.id ? 'selected' : ''}>${rm.name}</option>`).join('')}
                        </select>
                    </td>
                    <td class="col-price">
                        <input type="text" class="form-control row-qty col-price" value="${rowVal ? formatRate(rowVal.qty) : '0.01'}" required>
                    </td>
                    <td class="col-btn">
                        <button type="button" class="btn btn-danger btn-icon-only btn-remove-row"><i class="ph ph-trash"></i></button>
                    </td>
                `;
                tableBody.appendChild(tr);
                
                const rowQtyInput = tr.querySelector('.row-qty');
                setupNumericFormatting(rowQtyInput, 'rate');
                
                tr.querySelector('.btn-remove-row').addEventListener('click', () => tr.remove());
            };

            if (item && item.materials.length > 0) {
                item.materials.forEach(mat => addRow(mat));
            } else {
                addRow();
            }

            document.getElementById('btn-spec-add-line').addEventListener('click', () => addRow());
        }
    }

    saveRow(id) {
        const form = document.getElementById('doc-form');
        if (!form.reportValidity()) return;
        const fd = new FormData(form);
        
        const trs = document.querySelectorAll('#spec-materials-table tbody tr');
        const materials = [];
        trs.forEach(tr => {
            materials.push({
                id: tr.querySelector('.row-material-select').value,
                qty: parseFormattedNumber(tr.querySelector('.row-qty').value)
            });
        });

        const newDoc = {
            id: id || 'spec_' + Date.now(),
            name: fd.get('name'),
            productId: fd.get('productId'),
            semiProductId: fd.get('semiProductId'),
            machineNum: fd.get('machineNum'),
            color: fd.get('color'),
            gender: fd.get('gender'),
            sewingTimeSec: parseFormattedNumber(document.getElementById('spec-sewing-time-input').value),
            materials
        };

        if (id) {
            const idx = state.specifications.findIndex(x => x.id === id);
            state.specifications[idx] = newDoc;
        } else {
            state.specifications.push(newDoc);
        }

        saveState();
        closeModal();
        showToast('Техкарта успешно сохранена!', 'success');
        this.renderTable(this.currentViewport);
    }
}

class PlanningDocument extends BaseDocument {
    constructor() {
        super('planning', 'Планирование и Запуск');
    }

    getColumns() {
        return [
            { id: 'date', label: 'Дата планирования', filterable: true },
            { id: 'orderNum', label: 'Заказ', filterable: true },
            { id: 'products', label: 'Продукция', filterable: true },
            { id: 'distribution', label: 'Распределение по Линиям', filterable: true }
        ];
    }

    getColumnValue(record, colId) {
        if (colId === 'date') return record.date;
        if (colId === 'orderNum') {
            const orderObj = state.orders.find(o => o.id === record.orderId) || { num: 'Неизвестно' };
            return `<strong>${orderObj.num}</strong>`;
        }
        if (colId === 'products') {
            return record.items.map(pi => {
                const prod = state.nomenclature.find(n => n.id === pi.productId) || {};
                return `<div style="font-size:12px; margin-bottom: 2px;">${prod.name}</div>`;
            }).join('');
        }
        if (colId === 'distribution') {
            return record.items.map(pi => {
                const lineObj = state.lines.find(l => l.id === pi.lineId) || {};
                return `<div style="margin-bottom: 4px;"><span class="badge badge-info">${pi.planNum}</span> на <strong>${lineObj.name || '—'}</strong> (${formatQty(pi.qty)} пар)</div>`;
            }).join('');
        }
        return record[colId] || '';
    }

    getModalViewBody(id) {
        const item = this.getRecords().find(x => x.id === id);
        const orderObj = state.orders.find(o => o.id === item.orderId) || { num: 'Неизвестно' };
        return `
            <div class="view-details">
                <div class="view-fields-grid">
                    <div class="view-field">
                        <span class="view-field-label">Дата планирования</span>
                        <span class="view-field-value">${item.date}</span>
                    </div>
                    <div class="view-field">
                        <span class="view-field-label">Заказ-основание</span>
                        <span class="view-field-value">${orderObj.num}</span>
                    </div>
                </div>
                <div>
                    <span class="text-secondary" style="font-size: 11px; display: block; margin-bottom: 6px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Распределение партий по Линиям</span>
                    <table class="data-table" style="width: 100%; font-size: 12px;">
                        <thead>
                            <tr>
                                <th>Продукция ГП</th>
                                <th>Линия вязания</th>
                                <th style="text-align: right; width: 140px;">Плановый объем</th>
                                <th style="text-align: center; width: 140px;">Плановый №</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${item.items.map(it => {
                                const prod = state.nomenclature.find(n => n.id === it.productId) || {};
                                const line = state.lines.find(l => l.id === it.lineId) || {};
                                return `
                                    <tr>
                                        <td>${prod.name || '—'}</td>
                                        <td><strong>${line.name || '—'}</strong></td>
                                        <td style="text-align: right;">${formatQty(it.qty)} пар</td>
                                        <td style="text-align: center;"><span class="badge badge-info">${it.planNum}</span></td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    getModalEditBody(id) {
        const doc = id ? this.getRecords().find(x => x.id === id) : { date: new Date().toISOString().split('T')[0], orderId: '', items: [] };
        return `
            <form id="doc-form">
                <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                    <div class="form-group">
                        <label class="form-label">Дата планирования</label>
                        <input type="date" class="form-control" name="date" id="plan-date-input" value="${doc.date}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Заказ клиента</label>
                        <select class="form-control" name="orderId" id="plan-order-select" required>
                            <option value="">-- Выберите заказ покупателя --</option>
                            ${state.orders.map(o => `<option value="${o.id}" ${o.id === doc.orderId ? 'selected' : ''}>${o.num} (${(state.counterparties.find(c => c.id === o.counterpartyId) || {}).name || ''})</option>`).join('')}
                        </select>
                    </div>
                </div>
                <h4 style="margin: 20px 0 10px 0;">Распределение по Линиям & Генерация плановых номеров</h4>
                <div class="table-wrapper">
                    <table class="table-form" id="plan-items-table">
                        <thead>
                            <tr>
                                <th>Готовая продукция (из Заказа)</th>
                                <th>Производственная Линия</th>
                                <th class="col-qty">Кол-во (пар)</th>
                                <th style="width: 130px;">Плановый номер</th>
                                <th class="col-btn"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Loaded in afterModalOpen -->
                        </tbody>
                    </table>
                </div>
                <button type="button" class="btn btn-secondary" id="btn-plan-add-line" style="margin-top: 8px;">
                    <i class="ph ph-plus"></i>Добавить распределение
                </button>
            </form>
        `;
    }

    afterModalOpen(id, mode) {
        if (mode === 'edit') {
            const orderSelect = document.getElementById('plan-order-select');
            const itemsTableBody = document.querySelector('#plan-items-table tbody');
            const dateInput = document.getElementById('plan-date-input');
            const item = id ? this.getRecords().find(x => x.id === id) : null;
            
            const addRow = (rowVal = null) => {
                const ordId = orderSelect.value;
                if (!ordId) return;
                const orderObj = state.orders.find(o => o.id === ordId);
                if (!orderObj) return;

                const tr = document.createElement('tr');
                const orderedProducts = orderObj.items.map(it => {
                    const prod = state.nomenclature.find(n => n.id === it.productId) || {};
                    return { id: it.productId, name: prod.name, totalQty: it.qty };
                });

                tr.innerHTML = `
                    <td>
                        <select class="form-control row-product-select" required>
                            <option value="">-- Выберите продукт --</option>
                            ${orderedProducts.map(p => `<option value="${p.id}" ${rowVal && rowVal.productId === p.id ? 'selected' : ''}>${p.name} (Заказ: ${p.totalQty} пар)</option>`).join('')}
                        </select>
                    </td>
                    <td>
                        <select class="form-control row-line-select" required>
                            <option value="">-- Выберите линию --</option>
                            ${state.lines.map(l => `<option value="${l.id}" ${rowVal && rowVal.lineId === l.id ? 'selected' : ''}>${l.name}</option>`).join('')}
                        </select>
                    </td>
                    <td class="col-qty">
                        <input type="text" class="form-control row-qty col-qty" value="${rowVal ? formatQty(rowVal.qty) : '1 000'}" required>
                    </td>
                    <td>
                        <input type="text" class="form-control row-plannum" value="${rowVal ? rowVal.planNum : ''}" required readonly style="text-align: center; background: rgba(255,255,255,0.03);">
                    </td>
                    <td class="col-btn">
                        <button type="button" class="btn btn-danger btn-icon-only btn-remove-row"><i class="ph ph-trash"></i></button>
                    </td>
                `;
                itemsTableBody.appendChild(tr);
                
                const rowQtyInput = tr.querySelector('.row-qty');
                setupNumericFormatting(rowQtyInput, 'qty');

                const lineSelect = tr.querySelector('.row-line-select');
                const planNumInput = tr.querySelector('.row-plannum');
                
                const updatePlanNum = () => {
                    const orderNumDigits = orderObj.num.replace(/\D/g, '');
                    const lineIndex = state.lines.findIndex(l => l.id === lineSelect.value);
                    const lineNum = lineIndex > -1 ? (lineIndex + 1) : '?';
                    const dateVal = dateInput.value || new Date().toISOString().split('T')[0];
                    const month = dateVal.split('-')[1] || '06';
                    planNumInput.value = `${orderNumDigits}/${lineNum}-${month}`;
                };

                lineSelect.addEventListener('change', updatePlanNum);
                dateInput.addEventListener('change', updatePlanNum);
                tr.querySelector('.btn-remove-row').addEventListener('click', () => tr.remove());
                if (!rowVal) updatePlanNum();
            };

            orderSelect.addEventListener('change', () => {
                itemsTableBody.innerHTML = '';
                addRow();
            });

            if (item && item.items.length > 0) {
                item.items.forEach(it => addRow(it));
            } else {
                if (orderSelect.value) addRow();
            }

            document.getElementById('btn-plan-add-line').addEventListener('click', () => addRow());
        }
    }

    saveRow(id) {
        const form = document.getElementById('doc-form');
        if (!form.reportValidity()) return;
        const fd = new FormData(form);

        const trs = document.querySelectorAll('#plan-items-table tbody tr');
        const items = [];
        trs.forEach(tr => {
            items.push({
                productId: tr.querySelector('.row-product-select').value,
                lineId: tr.querySelector('.row-line-select').value,
                qty: parseFormattedNumber(tr.querySelector('.row-qty').value),
                planNum: tr.querySelector('.row-plannum').value
            });
        });

        if (items.length === 0) {
            alert('Ошибка: Вы не добавили распределение по производственным линиям.');
            return;
        }

        const newDoc = {
            id: id || 'p_' + Date.now(),
            date: fd.get('date'),
            orderId: fd.get('orderId'),
            items
        };

        if (id) {
            const idx = state.planning.findIndex(x => x.id === id);
            state.planning[idx] = newDoc;
        } else {
            state.planning.push(newDoc);
        }

        saveState();
        closeModal();
        showToast('План запуска успешно сохранен!', 'success');
        this.renderTable(this.currentViewport);
    }
}

class ReleaseDocument extends BaseDocument {
    constructor() {
        super('releases', 'Выпуск полуфабрикатов (Вязание)');
    }

    getColumns() {
        return [
            { id: 'date', label: 'Дата выпуска', filterable: true },
            { id: 'operatorName', label: 'Оператор', filterable: true },
            { id: 'details', label: 'Выпуск по Станкам & Планам', filterable: true }
        ];
    }

    getColumnValue(record, colId) {
        if (colId === 'date') return record.date;
        if (colId === 'operatorName') {
            const op = state.employees.find(e => e.id === record.operatorId) || {};
            return `<strong>${op.name || '—'}</strong> (Оператор)`;
        }
        if (colId === 'details') {
            return record.items.map(ri => `
                <div style="margin-bottom: 4px;">
                    Станок <span class="badge badge-info">${ri.machineNum}</span> | 
                    План <span class="badge badge-success">${ri.planNum}</span> : 
                    <strong>${formatQty(ri.qty)} шт ПФ</strong> (${formatQty(Math.round(ri.qty/2))} пар)
                </div>
            `).join('');
        }
        return record[colId] || '';
    }

    getModalViewBody(id) {
        const item = this.getRecords().find(x => x.id === id);
        const op = state.employees.find(e => e.id === item.operatorId) || {};
        return `
            <div class="view-details">
                <div class="view-fields-grid">
                    <div class="view-field">
                        <span class="view-field-label">Дата выпуска</span>
                        <span class="view-field-value">${item.date}</span>
                    </div>
                    <div class="view-field">
                        <span class="view-field-label">Оператор вязания</span>
                        <span class="view-field-value">${op.name || '—'}</span>
                    </div>
                </div>
                <div>
                    <span class="text-secondary" style="font-size: 11px; display: block; margin-bottom: 6px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Выпущенная заготовка (ПФ)</span>
                    <table class="data-table" style="width: 100%; font-size: 12px;">
                        <thead>
                            <tr>
                                <th>Вязальный станок</th>
                                <th>Плановый номер</th>
                                <th style="text-align: right; width: 140px;">Объем (штук)</th>
                                <th style="text-align: right; width: 140px;">Объем (пар)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${item.items.map(it => `
                                <tr>
                                    <td>Станок <strong>${it.machineNum}</strong></td>
                                    <td><span class="badge badge-success">${it.planNum}</span></td>
                                    <td style="text-align: right;">${formatQty(it.qty)} шт.</td>
                                    <td style="text-align: right;"><strong>${formatQty(Math.round(it.qty / 2))} пар</strong></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    getModalEditBody(id) {
        const doc = id ? this.getRecords().find(x => x.id === id) : { date: new Date().toISOString().split('T')[0], operatorId: '', items: [] };
        const operators = state.employees.filter(e => e.role === 'Оператор');
        return `
            <form id="doc-form">
                <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                    <div class="form-group">
                        <label class="form-label">Дата выпуска</label>
                        <input type="date" class="form-control" name="date" value="${doc.date}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">ФИО Оператора вязания</label>
                        <select class="form-control" name="operatorId" id="release-operator-select" required>
                            <option value="">-- Выберите оператора --</option>
                            ${operators.map(op => `<option value="${op.id}" ${op.id === doc.operatorId ? 'selected' : ''}>${op.name}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <h4 style="margin: 20px 0 10px 0;">Выпуск заготовок ПФ (вязальные станки оператора)</h4>
                <div class="table-wrapper">
                    <table class="table-form" id="release-items-table">
                        <thead>
                            <tr>
                                <th>Станок оператора</th>
                                <th>Плановый номер</th>
                                <th class="col-price">Выпуск (шт)</th>
                                <th class="col-btn"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Dynamic rows loaded in afterModalOpen -->
                        </tbody>
                    </table>
                </div>
                <button type="button" class="btn btn-secondary" id="btn-release-add-line" style="margin-top: 8px;">
                    <i class="ph ph-plus"></i>Добавить строку
                </button>
            </form>
        `;
    }

    afterModalOpen(id, mode) {
        if (mode === 'edit') {
            const opSelect = document.getElementById('release-operator-select');
            const itemsTableBody = document.querySelector('#release-items-table tbody');
            const item = id ? this.getRecords().find(x => x.id === id) : null;

            const addRow = (rowVal = null) => {
                const operatorId = opSelect.value;
                if (!operatorId) return;

                const tr = document.createElement('tr');
                const assignedMachines = state.equipment.filter(eq => eq.type.includes('Вязальный') && eq.operatorId === operatorId);
                const activePlans = [];
                state.planning.forEach(pl => {
                    pl.items.forEach(it => {
                        const prod = state.nomenclature.find(n => n.id === it.productId) || {};
                        activePlans.push({ code: it.planNum, desc: `${it.planNum} — ${prod.name} (${it.qty} пар)` });
                    });
                });

                tr.innerHTML = `
                    <td>
                        <select class="form-control row-machine-select" required>
                            <option value="">-- Выберите станок --</option>
                            ${assignedMachines.map(m => `<option value="${m.num}" ${rowVal && rowVal.machineNum === m.num ? 'selected' : ''}>Станок ${m.num}</option>`).join('')}
                            ${assignedMachines.length === 0 ? '<option value="" disabled>За оператором нет станков!</option>' : ''}
                        </select>
                    </td>
                    <td>
                        <select class="form-control row-plannum-select" required>
                            <option value="">-- Выберите плановый номер --</option>
                            ${activePlans.map(ap => `<option value="${ap.code}" ${rowVal && rowVal.planNum === ap.code ? 'selected' : ''}>${ap.desc}</option>`).join('')}
                        </select>
                    </td>
                    <td class="col-price">
                        <input type="text" class="form-control row-qty col-price" value="${rowVal ? formatQty(rowVal.qty) : '1 000'}" required>
                    </td>
                    <td class="col-btn">
                        <button type="button" class="btn btn-danger btn-icon-only btn-remove-row"><i class="ph ph-trash"></i></button>
                    </td>
                `;
                itemsTableBody.appendChild(tr);
                
                const rowQtyInput = tr.querySelector('.row-qty');
                setupNumericFormatting(rowQtyInput, 'qty');
                
                tr.querySelector('.btn-remove-row').addEventListener('click', () => tr.remove());
            };

            opSelect.addEventListener('change', () => {
                itemsTableBody.innerHTML = '';
                addRow();
            });

            if (item && item.items.length > 0) {
                item.items.forEach(it => addRow(it));
            } else {
                if (opSelect.value) addRow();
            }

            document.getElementById('btn-release-add-line').addEventListener('click', () => addRow());
        }
    }

    saveRow(id) {
        const form = document.getElementById('doc-form');
        if (!form.reportValidity()) return;
        const fd = new FormData(form);

        const trs = document.querySelectorAll('#release-items-table tbody tr');
        const items = [];
        trs.forEach(tr => {
            items.push({
                machineNum: tr.querySelector('.row-machine-select').value,
                planNum: tr.querySelector('.row-plannum-select').value,
                qty: parseFormattedNumber(tr.querySelector('.row-qty').value)
            });
        });

        if (items.length === 0) {
            alert('Ошибка: Добавьте строки выпуска по вязальным станкам.');
            return;
        }

        // --- VALIDATION CHECK FOR EACH PLANNUM ---
        const docQuantities = {};
        items.forEach(item => {
            docQuantities[item.planNum] = (docQuantities[item.planNum] || 0) + item.qty;
        });

        for (const [planNum, docQty] of Object.entries(docQuantities)) {
            const plannedQtyPairs = window.getPlannedQtyForPlan(planNum);
            const maxKnittedQtyPcs = plannedQtyPairs * 2;
            const alreadyKnittedQtyPcs = window.getKnittedQtyForPlan(planNum, id);
            
            if (alreadyKnittedQtyPcs + docQty > maxKnittedQtyPcs) {
                const available = maxKnittedQtyPcs - alreadyKnittedQtyPcs;
                alert(`Ошибка сохранения выпуска по плану ${planNum}:\nПревышен лимит запуска!\nЗапланировано: ${plannedQtyPairs} пар (${maxKnittedQtyPcs} шт)\nУже выпущено: ${alreadyKnittedQtyPcs} шт\nДоступный остаток для ввода: ${available >= 0 ? available : 0} шт.`);
                return;
            }
        }
        // ----------------------------------------

        const newDoc = {
            id: id || 'rel_' + Date.now(),
            date: fd.get('date'),
            operatorId: fd.get('operatorId'),
            items
        };

        if (id) {
            const idx = state.releases.findIndex(x => x.id === id);
            state.releases[idx] = newDoc;
        } else {
            state.releases.push(newDoc);
        }

        saveState();
        closeModal();
        showToast('Документ выпуска успешно сохранен!', 'success');
        this.renderTable(this.currentViewport);
    }
}

class SewingDocument extends BaseDocument {
    constructor() {
        super('sewings', 'Прошив мыска');
    }

    getColumns() {
        return [
            { id: 'date', label: 'Дата прошива', filterable: true },
            { id: 'lineName', label: 'Производственная Линия', filterable: true },
            { id: 'details', label: 'Выработка швей', filterable: true }
        ];
    }

    getColumnValue(record, colId) {
        if (colId === 'date') return record.date;
        if (colId === 'lineName') {
            const line = state.lines.find(l => l.id === record.lineId) || {};
            return `<strong>${line.name || '—'}</strong>`;
        }
        if (colId === 'details') {
            return record.items.map(si => {
                const seam = state.employees.find(e => e.id === si.seamstressId) || {};
                return `
                    <div style="margin-bottom: 4px;">
                        Швея: <strong>${seam.name ? seam.name.split(' ')[0] : '—'}</strong> | 
                        План: <span class="badge badge-info">${si.planNum}</span> | 
                        Выпущено ГП: <strong>${formatQty(si.qty)} пар</strong>
                    </div>
                `;
            }).join('');
        }
        return record[colId] || '';
    }

    getModalViewBody(id) {
        const item = this.getRecords().find(x => x.id === id);
        const line = state.lines.find(l => l.id === item.lineId) || {};
        return `
            <div class="view-details">
                <div class="view-fields-grid">
                    <div class="view-field">
                        <span class="view-field-label">Дата прошива</span>
                        <span class="view-field-value">${item.date}</span>
                    </div>
                    <div class="view-field">
                        <span class="view-field-label">Производственная Линия</span>
                        <span class="view-field-value">${line.name || '—'}</span>
                    </div>
                </div>
                <div>
                    <span class="text-secondary" style="font-size: 11px; display: block; margin-bottom: 6px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Выработка швей (ГП)</span>
                    <table class="data-table" style="width: 100%; font-size: 12px;">
                        <thead>
                            <tr>
                                <th>Швея</th>
                                <th>Плановый номер</th>
                                <th style="text-align: right; width: 200px;">Прошито (пар готовой продукции)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${item.items.map(it => {
                                const seam = state.employees.find(e => e.id === it.seamstressId) || {};
                                return `
                                    <tr>
                                        <td><strong>${seam.name || '—'}</strong></td>
                                        <td><span class="badge badge-info">${it.planNum}</span></td>
                                        <td style="text-align: right;"><strong>${formatQty(it.qty)} пар</strong></td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    getModalEditBody(id) {
        const doc = id ? this.getRecords().find(x => x.id === id) : { date: new Date().toISOString().split('T')[0], lineId: '', items: [] };
        return `
            <form id="doc-form">
                <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                    <div class="form-group">
                        <label class="form-label">Дата прошива</label>
                        <input type="date" class="form-control" name="date" value="${doc.date}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Производственная линия</label>
                        <select class="form-control" name="lineId" id="sew-line-select" required>
                            <option value="">-- Выберите линию прошива --</option>
                            ${state.lines.map(l => `<option value="${l.id}" ${l.id === doc.lineId ? 'selected' : ''}>${l.name}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <h4 style="margin: 20px 0 10px 0;">Объемы прошива по швеям (ПФ -> ГП)</h4>
                <div class="table-wrapper">
                    <table class="table-form" id="sew-items-table">
                        <thead>
                            <tr>
                                <th>Швея</th>
                                <th>Плановый номер (заготовка ПФ)</th>
                                <th class="col-price">Прошито (пар)</th>
                                <th class="col-btn"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Dynamic rows loaded in afterModalOpen -->
                        </tbody>
                    </table>
                </div>
                <button type="button" class="btn btn-secondary" id="btn-sew-add-line" style="margin-top: 8px;">
                    <i class="ph ph-plus"></i>Добавить строку
                </button>
            </form>
        `;
    }

    afterModalOpen(id, mode) {
        if (mode === 'edit') {
            const lineSelect = document.getElementById('sew-line-select');
            const itemsTableBody = document.querySelector('#sew-items-table tbody');
            const item = id ? this.getRecords().find(x => x.id === id) : null;

            const addRow = (rowVal = null) => {
                const lineId = lineSelect.value;
                if (!lineId) return;

                const tr = document.createElement('tr');
                const seamstresses = state.employees.filter(e => e.role === 'Швея');
                const activePlans = [];
                state.planning.forEach(pl => {
                    pl.items.forEach(it => {
                        if (it.lineId === lineId) {
                            const prod = state.nomenclature.find(n => n.id === it.productId) || {};
                            activePlans.push({ code: it.planNum, desc: `${it.planNum} — ${prod.name} (${it.qty} пар)` });
                        }
                    });
                });

                tr.innerHTML = `
                    <td>
                        <select class="form-control row-seamstress-select" required>
                            <option value="">-- Выберите швею --</option>
                            ${seamstresses.map(s => `<option value="${s.id}" ${rowVal && rowVal.seamstressId === s.id ? 'selected' : ''}>${s.name}</option>`).join('')}
                        </select>
                    </td>
                    <td>
                        <select class="form-control row-plannum-select" required>
                            <option value="">-- Выберите плановый номер --</option>
                            ${activePlans.map(ap => `<option value="${ap.code}" ${rowVal && rowVal.planNum === ap.code ? 'selected' : ''}>${ap.desc}</option>`).join('')}
                            ${activePlans.length === 0 ? '<option value="" disabled>На этой линии нет запущенных планов!</option>' : ''}
                        </select>
                    </td>
                    <td class="col-price">
                        <input type="text" class="form-control row-qty col-price" value="${rowVal ? formatQty(rowVal.qty) : '500'}" required>
                    </td>
                    <td class="col-btn">
                        <button type="button" class="btn btn-danger btn-icon-only btn-remove-row"><i class="ph ph-trash"></i></button>
                    </td>
                `;
                itemsTableBody.appendChild(tr);
                
                const rowQtyInput = tr.querySelector('.row-qty');
                setupNumericFormatting(rowQtyInput, 'qty');
                
                tr.querySelector('.btn-remove-row').addEventListener('click', () => tr.remove());
            };

            lineSelect.addEventListener('change', () => {
                itemsTableBody.innerHTML = '';
                addRow();
            });

            if (item && item.items.length > 0) {
                item.items.forEach(it => addRow(it));
            } else {
                if (lineSelect.value) addRow();
            }

            document.getElementById('btn-sew-add-line').addEventListener('click', () => addRow());
        }
    }

    saveRow(id) {
        const form = document.getElementById('doc-form');
        if (!form.reportValidity()) return;
        const fd = new FormData(form);

        const trs = document.querySelectorAll('#sew-items-table tbody tr');
        const items = [];
        trs.forEach(tr => {
            items.push({
                seamstressId: tr.querySelector('.row-seamstress-select').value,
                planNum: tr.querySelector('.row-plannum-select').value,
                qty: parseFormattedNumber(tr.querySelector('.row-qty').value)
            });
        });

        if (items.length === 0) {
            alert('Ошибка: Заполните выработку швей.');
            return;
        }

        // --- VALIDATION CHECK FOR EACH PLANNUM ---
        const docQuantities = {};
        items.forEach(item => {
            docQuantities[item.planNum] = (docQuantities[item.planNum] || 0) + item.qty;
        });

        for (const [planNum, docQty] of Object.entries(docQuantities)) {
            const knittedPcs = window.getKnittedQtyForPlan(planNum);
            const maxSewnPairs = Math.floor(knittedPcs / 2);
            const alreadySewnPairs = window.getSewnQtyForPlan(planNum, id);
            
            if (alreadySewnPairs + docQty > maxSewnPairs) {
                const available = maxSewnPairs - alreadySewnPairs;
                alert(`Ошибка сохранения прошива по плану ${planNum}:\nПревышен лимит прошива!\nСвязано (ПФ): ${knittedPcs} шт (${maxSewnPairs} пар)\nУже прошито: ${alreadySewnPairs} пар\nДоступный остаток для ввода: ${available >= 0 ? available : 0} пар.`);
                return;
            }
        }
        // ----------------------------------------

        const newDoc = {
            id: id || 'sew_' + Date.now(),
            date: fd.get('date'),
            lineId: fd.get('lineId'),
            items
        };

        if (id) {
            const idx = state.sewings.findIndex(x => x.id === id);
            state.sewings[idx] = newDoc;
        } else {
            state.sewings.push(newDoc);
        }

        saveState();
        closeModal();
        showToast('Документ прошива успешно сохранен!', 'success');
        this.renderTable(this.currentViewport);
    }
}

class PackagingDocument extends BaseDocument {
    constructor() {
        super('packagings', 'Упаковка продукции');
    }

    getColumns() {
        return [
            { id: 'date', label: 'Дата упаковки', filterable: true },
            { id: 'operatorName', label: 'Оператор принятия', filterable: true },
            { id: 'details', label: 'Детали упаковки', filterable: true }
        ];
    }

    getColumnValue(record, colId) {
        if (colId === 'date') return record.date;
        if (colId === 'operatorName') return `<strong>${record.operatorName}</strong>`;
        if (colId === 'details') {
            return record.items.map(pi => `
                <div style="margin-bottom: 4px;">
                    План <span class="badge badge-success">${pi.planNum}</span> : 
                    <strong>${formatQty(pi.qty)} пар ГП</strong> упаковано (${pi.grade || '1-й сорт'})
                </div>
            `).join('');
        }
        return record[colId] || '';
    }

    getModalViewBody(id) {
        const item = this.getRecords().find(x => x.id === id);
        return `
            <div class="view-details">
                <div class="view-fields-grid">
                    <div class="view-field">
                        <span class="view-field-label">Дата упаковки</span>
                        <span class="view-field-value">${item.date}</span>
                    </div>
                    <div class="view-field">
                        <span class="view-field-label">Оператор принятия упаковки</span>
                        <span class="view-field-value">${item.operatorName}</span>
                    </div>
                </div>
                <div>
                    <span class="text-secondary" style="font-size: 11px; display: block; margin-bottom: 6px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Упакованная готовая продукция (ГП)</span>
                    <table class="data-table" style="width: 100%; font-size: 12px;">
                        <thead>
                            <tr>
                                <th>Плановый номер</th>
                                <th>Сорт</th>
                                <th style="text-align: right; width: 240px;">Упаковано (пар готовой продукции)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${item.items.map(it => `
                                <tr>
                                    <td><span class="badge badge-success">${it.planNum}</span></td>
                                    <td><span class="badge badge-info">${it.grade || '1-й сорт'}</span></td>
                                    <td style="text-align: right;"><strong>${formatQty(it.qty)} пар</strong></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    getModalEditBody(id) {
        const doc = id ? this.getRecords().find(x => x.id === id) : { date: new Date().toISOString().split('T')[0], operatorName: 'Смирнов Николай Иванович', items: [] };
        return `
            <form id="doc-form">
                <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                    <div class="form-group">
                        <label class="form-label">Дата упаковки</label>
                        <input type="date" class="form-control" name="date" value="${doc.date}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Оператор принятия упаковки</label>
                        <input type="text" class="form-control" name="operatorName" value="${doc.operatorName}" required>
                    </div>
                </div>
                <h4 style="margin: 20px 0 10px 0;">Упаковано по плановым номерам</h4>
                <div class="table-wrapper">
                    <table class="table-form" id="pack-items-table">
                        <thead>
                            <tr>
                                <th>Плановый номер (готовая продукция)</th>
                                <th style="width: 150px;">Сорт</th>
                                <th class="col-price">Упаковано (пар)</th>
                                <th class="col-btn"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Loaded in afterModalOpen -->
                        </tbody>
                    </table>
                </div>
                <button type="button" class="btn btn-secondary" id="btn-pack-add-line" style="margin-top: 8px;">
                    <i class="ph ph-plus"></i>Добавить строку
                </button>
            </form>
        `;
    }

    afterModalOpen(id, mode) {
        if (mode === 'edit') {
            const itemsTableBody = document.querySelector('#pack-items-table tbody');
            const item = id ? this.getRecords().find(x => x.id === id) : null;

            const addRow = (rowVal = null) => {
                const tr = document.createElement('tr');
                const activePlans = [];
                state.planning.forEach(pl => {
                    pl.items.forEach(it => {
                        const prod = state.nomenclature.find(n => n.id === it.productId) || {};
                        activePlans.push({ code: it.planNum, desc: `${it.planNum} — ${prod.name} (${it.qty} пар)` });
                    });
                });

                const grades = ['1-й сорт', '2-й сорт', '3-й сорт'];
                const selectedGrade = rowVal ? rowVal.grade : '1-й сорт';

                tr.innerHTML = `
                    <td>
                        <select class="form-control row-plannum-select" required>
                            <option value="">-- Выберите плановый номер --</option>
                            ${activePlans.map(ap => `<option value="${ap.code}" ${rowVal && rowVal.planNum === ap.code ? 'selected' : ''}>${ap.desc}</option>`).join('')}
                        </select>
                    </td>
                    <td>
                        <select class="form-control row-grade-select" required>
                            ${grades.map(g => `<option value="${g}" ${g === selectedGrade ? 'selected' : ''}>${g}</option>`).join('')}
                        </select>
                    </td>
                    <td class="col-price">
                        <input type="text" class="form-control row-qty col-price" value="${rowVal ? formatQty(rowVal.qty) : '500'}" required>
                    </td>
                    <td class="col-btn">
                        <button type="button" class="btn btn-danger btn-icon-only btn-remove-row"><i class="ph ph-trash"></i></button>
                    </td>
                `;
                itemsTableBody.appendChild(tr);
                
                const rowQtyInput = tr.querySelector('.row-qty');
                setupNumericFormatting(rowQtyInput, 'qty');
                
                tr.querySelector('.btn-remove-row').addEventListener('click', () => tr.remove());
            };

            if (item && item.items.length > 0) {
                item.items.forEach(it => addRow(it));
            } else {
                addRow();
            }

            document.getElementById('btn-pack-add-line').addEventListener('click', () => addRow());
        }
    }

    saveRow(id) {
        const form = document.getElementById('doc-form');
        if (!form.reportValidity()) return;
        const fd = new FormData(form);

        const trs = document.querySelectorAll('#pack-items-table tbody tr');
        const items = [];
        trs.forEach(tr => {
            items.push({
                planNum: tr.querySelector('.row-plannum-select').value,
                grade: tr.querySelector('.row-grade-select').value,
                qty: parseFormattedNumber(tr.querySelector('.row-qty').value)
            });
        });

        if (items.length === 0) {
            alert('Ошибка: Заполните хотя бы одну строчку упакованного товара.');
            return;
        }

        // --- VALIDATION CHECK FOR EACH PLANNUM ---
        const docQuantities = {};
        items.forEach(item => {
            docQuantities[item.planNum] = (docQuantities[item.planNum] || 0) + item.qty;
        });

        for (const [planNum, docQty] of Object.entries(docQuantities)) {
            const sewnPairs = window.getSewnQtyForPlan(planNum);
            const maxPackagedPairs = sewnPairs;
            const alreadyPackagedPairs = window.getPackagedQtyForPlan(planNum, id);
            
            if (alreadyPackagedPairs + docQty > maxPackagedPairs) {
                const available = maxPackagedPairs - alreadyPackagedPairs;
                alert(`Ошибка сохранения упаковки по плану ${planNum}:\nПревышен лимит упаковки!\nПрошито (ГП): ${sewnPairs} пар\nУже упаковано: ${alreadyPackagedPairs} пар\nДоступный остаток для ввода: ${available >= 0 ? available : 0} пар.`);
                return;
            }
        }
        // ----------------------------------------

        const newDoc = {
            id: id || 'pack_' + Date.now(),
            date: fd.get('date'),
            operatorName: fd.get('operatorName'),
            items
        };

        if (id) {
            const idx = state.packagings.findIndex(x => x.id === id);
            state.packagings[idx] = newDoc;
        } else {
            state.packagings.push(newDoc);
        }

        saveState();
        closeModal();
        showToast('Документ упаковки успешно сохранен!', 'success');
        this.renderTable(this.currentViewport);
    }
}

// Map of document classes
const docMap = {
    'orders': new OrderDocument(),
    'specifications': new SpecificationDocument(),
    'planning': new PlanningDocument(),
    'releases': new ReleaseDocument(),
    'sewings': new SewingDocument(),
    'packagings': new PackagingDocument()
};


