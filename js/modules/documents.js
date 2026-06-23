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
                                <th style="width: 80px;">Заказано (пар)</th>
                                <th style="width: 80px;">В планах (пар)</th>
                                <th style="width: 80px;">Осталось (пар)</th>
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
                            ${orderedProducts.map(p => `<option value="${p.id}" ${rowVal && rowVal.productId === p.id ? 'selected' : ''}>${p.name}</option>`).join('')}
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
                        <input type="text" class="form-control row-ordered-qty" style="background: rgba(255,255,255,0.03); text-align: right; font-size: 11px;" readonly value="0">
                    </td>
                    <td>
                        <input type="text" class="form-control row-planned-qty" style="background: rgba(255,255,255,0.03); text-align: right; font-size: 11px;" readonly value="0">
                    </td>
                    <td>
                        <input type="text" class="form-control row-remain-qty" style="background: rgba(255,255,255,0.03); text-align: right; font-size: 11px;" readonly value="0">
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
                const productSelect = tr.querySelector('.row-product-select');
                
                const updatePlanNum = () => {
                    const orderNumDigits = orderObj.num.replace(/\D/g, '');
                    const lineIndex = state.lines.findIndex(l => l.id === lineSelect.value);
                    const lineNum = lineIndex > -1 ? (lineIndex + 1) : '?';
                    const dateVal = dateInput.value || new Date().toISOString().split('T')[0];
                    const month = dateVal.split('-')[1] || '06';
                    planNumInput.value = `${orderNumDigits}/${lineNum}-${month}`;
                };

                const updateHelperColumns = () => {
                    const prodId = productSelect.value;
                    let ordered = 0;
                    let planned = 0;
                    
                    if (prodId) {
                        ordered = orderObj.items.filter(it => it.productId === prodId).reduce((s, it) => s + (Number(it.qty) || 0), 0);
                        
                        // sum of planned quantities for this product and this order in other docs
                        state.planning.forEach(pl => {
                            if (pl.id !== id && pl.orderId === ordId) {
                                pl.items.forEach(pi => {
                                    if (pi.productId === prodId) {
                                        planned += Number(pi.qty) || 0;
                                    }
                                });
                            }
                        });
                    }
                    
                    tr.querySelector('.row-ordered-qty').value = formatQty(ordered);
                    tr.querySelector('.row-planned-qty').value = formatQty(planned);
                    tr.querySelector('.row-remain-qty').value = formatQty(Math.max(0, ordered - planned));
                };

                lineSelect.addEventListener('change', updatePlanNum);
                dateInput.addEventListener('change', updatePlanNum);
                productSelect.addEventListener('change', updateHelperColumns);
                tr.querySelector('.btn-remove-row').addEventListener('click', () => tr.remove());
                
                if (!rowVal) updatePlanNum();
                updateHelperColumns();
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
        super('releases', 'Вязальный');
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
                                <th style="width: 80px;">План (шт)</th>
                                <th style="width: 80px;">Связано (шт)</th>
                                <th style="width: 80px;">Осталось (шт)</th>
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
                        activePlans.push({ code: it.planNum, desc: `${it.planNum} — ${prod.name}` });
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
                    <td>
                        <input type="text" class="form-control row-planned-qty" style="background: rgba(255,255,255,0.03); text-align: right; font-size: 11px;" readonly value="0">
                    </td>
                    <td>
                        <input type="text" class="form-control row-knitted-qty" style="background: rgba(255,255,255,0.03); text-align: right; font-size: 11px;" readonly value="0">
                    </td>
                    <td>
                        <input type="text" class="form-control row-remain-qty" style="background: rgba(255,255,255,0.03); text-align: right; font-size: 11px;" readonly value="0">
                    </td>
                    <td class="col-btn">
                        <button type="button" class="btn btn-danger btn-icon-only btn-remove-row"><i class="ph ph-trash"></i></button>
                    </td>
                `;
                itemsTableBody.appendChild(tr);
                
                const rowQtyInput = tr.querySelector('.row-qty');
                setupNumericFormatting(rowQtyInput, 'qty');
                
                const planSelect = tr.querySelector('.row-plannum-select');
                
                const updateHelperColumns = () => {
                    const planNum = planSelect.value;
                    let planned = 0;
                    let knitted = 0;
                    
                    if (planNum) {
                        planned = window.getPlannedQtyForPlan(planNum) * 2; // in pieces
                        knitted = window.getKnittedQtyForPlan(planNum, id); // in pieces
                    }
                    
                    tr.querySelector('.row-planned-qty').value = formatQty(planned);
                    tr.querySelector('.row-knitted-qty').value = formatQty(knitted);
                    tr.querySelector('.row-remain-qty').value = formatQty(Math.max(0, planned - knitted));
                };

                planSelect.addEventListener('change', updateHelperColumns);
                tr.querySelector('.btn-remove-row').addEventListener('click', () => tr.remove());
                
                updateHelperColumns();
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
        super('sewings', 'Прошив');
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
                                <th style="width: 80px;">Связано (пар)</th>
                                <th style="width: 80px;">Прошито (пар)</th>
                                <th style="width: 80px;">Осталось (пар)</th>
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
                            activePlans.push({ code: it.planNum, desc: `${it.planNum} — ${prod.name}` });
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
                    <td>
                        <input type="text" class="form-control row-knitted-qty" style="background: rgba(255,255,255,0.03); text-align: right; font-size: 11px;" readonly value="0">
                    </td>
                    <td>
                        <input type="text" class="form-control row-sewn-qty" style="background: rgba(255,255,255,0.03); text-align: right; font-size: 11px;" readonly value="0">
                    </td>
                    <td>
                        <input type="text" class="form-control row-remain-qty" style="background: rgba(255,255,255,0.03); text-align: right; font-size: 11px;" readonly value="0">
                    </td>
                    <td class="col-btn">
                        <button type="button" class="btn btn-danger btn-icon-only btn-remove-row"><i class="ph ph-trash"></i></button>
                    </td>
                `;
                itemsTableBody.appendChild(tr);
                
                const rowQtyInput = tr.querySelector('.row-qty');
                setupNumericFormatting(rowQtyInput, 'qty');
                
                const planSelect = tr.querySelector('.row-plannum-select');
                
                const updateHelperColumns = () => {
                    const planNum = planSelect.value;
                    let knitted = 0;
                    let sewn = 0;
                    
                    if (planNum) {
                        knitted = Math.floor(window.getKnittedQtyForPlan(planNum) / 2); // in pairs
                        sewn = window.getSewnQtyForPlan(planNum, id); // in pairs
                    }
                    
                    tr.querySelector('.row-knitted-qty').value = formatQty(knitted);
                    tr.querySelector('.row-sewn-qty').value = formatQty(sewn);
                    tr.querySelector('.row-remain-qty').value = formatQty(Math.max(0, knitted - sewn));
                };

                planSelect.addEventListener('change', updateHelperColumns);
                tr.querySelector('.btn-remove-row').addEventListener('click', () => tr.remove());
                
                updateHelperColumns();
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
                                <th style="width: 80px;">Прошито (пар)</th>
                                <th style="width: 80px;">Упаковано (пар)</th>
                                <th style="width: 80px;">Осталось (пар)</th>
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
                        activePlans.push({ code: it.planNum, desc: `${it.planNum} — ${prod.name}` });
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
                    <td>
                        <input type="text" class="form-control row-sewn-qty" style="background: rgba(255,255,255,0.03); text-align: right; font-size: 11px;" readonly value="0">
                    </td>
                    <td>
                        <input type="text" class="form-control row-packaged-qty" style="background: rgba(255,255,255,0.03); text-align: right; font-size: 11px;" readonly value="0">
                    </td>
                    <td>
                        <input type="text" class="form-control row-remain-qty" style="background: rgba(255,255,255,0.03); text-align: right; font-size: 11px;" readonly value="0">
                    </td>
                    <td class="col-btn">
                        <button type="button" class="btn btn-danger btn-icon-only btn-remove-row"><i class="ph ph-trash"></i></button>
                    </td>
                `;
                itemsTableBody.appendChild(tr);
                
                const rowQtyInput = tr.querySelector('.row-qty');
                setupNumericFormatting(rowQtyInput, 'qty');
                
                const planSelect = tr.querySelector('.row-plannum-select');
                
                const updateHelperColumns = () => {
                    const planNum = planSelect.value;
                    let sewn = 0;
                    let packaged = 0;
                    
                    if (planNum) {
                        sewn = window.getSewnQtyForPlan(planNum); // in pairs
                        packaged = window.getPackagedQtyForPlan(planNum, id); // in pairs
                    }
                    
                    tr.querySelector('.row-sewn-qty').value = formatQty(sewn);
                    tr.querySelector('.row-packaged-qty').value = formatQty(packaged);
                    tr.querySelector('.row-remain-qty').value = formatQty(Math.max(0, sewn - packaged));
                };

                planSelect.addEventListener('change', updateHelperColumns);
                tr.querySelector('.btn-remove-row').addEventListener('click', () => tr.remove());
                
                updateHelperColumns();
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

class RealizationDocument extends BaseDocument {
    constructor() {
        super('realizations', 'Реализация готовой продукции');
    }

    getColumns() {
        return [
            { id: 'date', label: 'Дата реализации', filterable: true },
            { id: 'num', label: 'Номер', filterable: true },
            { id: 'clientName', label: 'Контрагент', filterable: true },
            { id: 'contractNum', label: 'Договор / Валюта', filterable: true },
            { id: 'sum', label: 'Сумма', filterable: false },
            { id: 'sumAcc', label: 'Сумма в уч. вал.', filterable: false }
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
                        <span class="view-field-label">Номер реализации</span>
                        <span class="view-field-value">${item.num}</span>
                    </div>
                    <div class="view-field">
                        <span class="view-field-label">Дата реализации</span>
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
                    <span class="text-secondary" style="font-size: 11px; display: block; margin-bottom: 6px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Спецификация отгрузки</span>
                    <table class="data-table" style="width: 100%; font-size: 12px;">
                        <thead>
                            <tr>
                                <th>Номенклатура ГП</th>
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
                                        <td class="text-secondary">${it.char || '—'}</td>
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
        const doc = id ? this.getRecords().find(x => x.id === id) : { date: new Date().toISOString().split('T')[0], num: '', counterpartyId: '', contractId: '', orderId: '', currency: 'KGS', items: [] };
        return `
            <form id="doc-form">
                <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                    <div class="form-group">
                        <label class="form-label">Дата реализации</label>
                        <input type="date" class="form-control" name="date" id="realization-date-input" value="${doc.date}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Номер документа</label>
                        <input type="text" class="form-control" name="num" id="realization-num-input" value="${doc.num}" required placeholder="например, РЛ-001">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Заказ-основание (необязательно)</label>
                        <select class="form-control" name="orderId" id="realization-order-select">
                            <option value="">-- Прямая продажа (без заказа) --</option>
                            ${state.orders.map(o => `<option value="${o.id}" ${o.id === doc.orderId ? 'selected' : ''}>${o.num} (${(state.counterparties.find(c => c.id === o.counterpartyId) || {}).name || ''})</option>`).join('')}
                        </select>
                    </div>
                </div>
                <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                    <div class="form-group">
                        <label class="form-label">Контрагент</label>
                        <select class="form-control" name="counterpartyId" id="realization-counterparty-select" required>
                            <option value="">-- Выберите контрагента --</option>
                            ${state.counterparties.map(c => `<option value="${c.id}" ${c.id === doc.counterpartyId ? 'selected' : ''}>${c.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Договор</label>
                        <select class="form-control" name="contractId" id="realization-contract-select" required>
                            <option value="">-- Выберите договор --</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Валюта</label>
                        <input type="text" class="form-control" id="realization-currency-input" name="currency" value="${doc.currency}" readonly style="background: rgba(255,255,255,0.03);">
                    </div>
                </div>

                <h4 style="margin: 20px 0 10px 0;">Товары отгрузки & Контроль складских остатков</h4>
                <div class="table-wrapper">
                    <table class="table-form" id="realization-items-table">
                        <thead>
                            <tr>
                                <th>Номенклатура ГП</th>
                                <th>Характеристика</th>
                                <th class="col-qty">Кол-во (пар)</th>
                                <th style="width: 80px;">Упаковано (пар)</th>
                                <th style="width: 80px;">Реализовано (пар)</th>
                                <th style="width: 80px;">Остаток (пар)</th>
                                <th class="col-price">Цена (за пару)</th>
                                <th class="col-sum">Сумма</th>
                                <th class="col-sum">Сумма в уч. вал.</th>
                                <th class="col-btn"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Loaded in afterModalOpen -->
                        </tbody>
                    </table>
                </div>
                <button type="button" class="btn btn-secondary" id="btn-realization-add-line" style="margin-top: 8px;">
                    <i class="ph ph-plus"></i>Добавить товар
                </button>
            </form>
        `;
    }

    afterModalOpen(id, mode) {
        if (mode === 'edit') {
            const orderSelect = document.getElementById('realization-order-select');
            const counterpartySelect = document.getElementById('realization-counterparty-select');
            const contractSelect = document.getElementById('realization-contract-select');
            const currencyInput = document.getElementById('realization-currency-input');
            const dateInput = document.getElementById('realization-date-input');
            const itemsTableBody = document.querySelector('#realization-items-table tbody');
            const item = id ? this.getRecords().find(x => x.id === id) : null;

            const updateContracts = () => {
                const clientId = counterpartySelect.value;
                const prevValue = contractSelect.value;
                contractSelect.innerHTML = '<option value="">-- Выберите договор --</option>';
                if (clientId) {
                    const clientContracts = state.contracts.filter(c => c.counterpartyId === clientId);
                    clientContracts.forEach(c => {
                        contractSelect.innerHTML += `<option value="${c.id}">${c.num} (${c.currency})</option>`;
                    });
                }
                if (prevValue) contractSelect.value = prevValue;
                updateCurrency();
            };

            const updateCurrency = () => {
                const contractId = contractSelect.value;
                if (contractId) {
                    const contract = state.contracts.find(c => c.id === contractId);
                    currencyInput.value = contract ? contract.currency : 'KGS';
                } else {
                    currencyInput.value = 'KGS';
                }
                updateAllSums();
            };

            const updateAllSums = () => {
                const trs = itemsTableBody.querySelectorAll('tr');
                trs.forEach(tr => {
                    if (tr.querySelector('.row-item-qty')) {
                        const qty = parseFormattedNumber(tr.querySelector('.row-item-qty').value);
                        const price = parseFormattedNumber(tr.querySelector('.row-item-price').value);
                        const sum = qty * price;
                        tr.querySelector('.row-item-sum').value = formatMoney(sum);
                        
                        const date = dateInput.value;
                        const curr = currencyInput.value || 'KGS';
                        const sumAcc = window.convertToAccounting(sum, curr, date);
                        tr.querySelector('.row-item-sum-acc').value = formatMoney(sumAcc);
                    }
                });
            };

            counterpartySelect.addEventListener('change', updateContracts);
            contractSelect.addEventListener('change', updateCurrency);
            dateInput.addEventListener('change', updateAllSums);

            const addRow = (rowVal = null) => {
                const tr = document.createElement('tr');
                const products = state.nomenclature.filter(n => n.type === 'ГП' || n.type === 'КП');

                const initialDate = dateInput.value;
                const initialCurr = currencyInput.value || 'KGS';
                const initialSum = rowVal ? rowVal.sum : (rowVal ? rowVal.qty * rowVal.price : 0);
                const initialSumAcc = window.convertToAccounting(initialSum, initialCurr, initialDate);

                tr.innerHTML = `
                    <td>
                        <select class="form-control row-item-product" required>
                            <option value="">-- Выберите --</option>
                            ${products.map(p => `<option value="${p.id}" ${rowVal && rowVal.productId === p.id ? 'selected' : ''}>${p.name}</option>`).join('')}
                        </select>
                    </td>
                    <td>
                        <input type="text" class="form-control row-item-char" value="${rowVal ? rowVal.char : ''}" required placeholder="Размер, цвет...">
                    </td>
                    <td class="col-qty">
                        <input type="text" class="form-control row-item-qty col-qty" value="${rowVal ? formatQty(rowVal.qty) : '100'}" required>
                    </td>
                    <td>
                        <input type="text" class="form-control row-packaged-qty" style="background: rgba(255,255,255,0.03); text-align: right; font-size: 11px;" readonly value="0">
                    </td>
                    <td>
                        <input type="text" class="form-control row-realized-qty" style="background: rgba(255,255,255,0.03); text-align: right; font-size: 11px;" readonly value="0">
                    </td>
                    <td>
                        <input type="text" class="form-control row-remain-qty" style="background: rgba(255,255,255,0.03); text-align: right; font-size: 11px;" readonly value="0">
                    </td>
                    <td class="col-price">
                        <input type="text" class="form-control row-item-price col-price" value="${rowVal ? formatMoney(rowVal.price) : '50'}" required>
                    </td>
                    <td class="col-sum">
                        <input type="text" class="form-control row-item-sum col-sum" value="${formatMoney(initialSum)}" readonly style="background: transparent; border-color: transparent;">
                    </td>
                    <td class="col-sum">
                        <input type="text" class="form-control row-item-sum-acc col-sum" value="${formatMoney(initialSumAcc)}" readonly style="background: transparent; border-color: transparent;">
                    </td>
                    <td class="col-btn">
                        <button type="button" class="btn btn-danger btn-icon-only btn-remove-row"><i class="ph ph-trash"></i></button>
                    </td>
                `;
                itemsTableBody.appendChild(tr);

                const productSelect = tr.querySelector('.row-item-product');
                const qtyInput = tr.querySelector('.row-item-qty');
                const priceInput = tr.querySelector('.row-item-price');
                const sumInput = tr.querySelector('.row-item-sum');
                const sumAccInput = tr.querySelector('.row-item-sum-acc');

                const updateRowSum = () => {
                    const qty = parseFormattedNumber(qtyInput.value);
                    const price = parseFormattedNumber(priceInput.value);
                    const sum = qty * price;
                    sumInput.value = formatMoney(sum);
                    
                    const date = dateInput.value;
                    const currency = currencyInput.value || 'KGS';
                    const sumAcc = window.convertToAccounting(sum, currency, date);
                    sumAccInput.value = formatMoney(sumAcc);
                };

                const updateHelperColumns = () => {
                    const prodId = productSelect.value;
                    let packaged = 0;
                    let realized = 0;
                    if (prodId) {
                        packaged = window.getPackagedQtyForProduct(prodId);
                        realized = window.getRealizedQtyForProduct(prodId, id);
                    }
                    tr.querySelector('.row-packaged-qty').value = formatQty(packaged);
                    tr.querySelector('.row-realized-qty').value = formatQty(realized);
                    tr.querySelector('.row-remain-qty').value = formatQty(Math.max(0, packaged - realized));
                };

                qtyInput.addEventListener('input', updateRowSum);
                priceInput.addEventListener('input', updateRowSum);
                productSelect.addEventListener('change', updateHelperColumns);
                
                setupNumericFormatting(qtyInput, 'qty');
                setupNumericFormatting(priceInput, 'price');

                updateRowSum();
                updateHelperColumns();
                
                tr.querySelector('.btn-remove-row').addEventListener('click', () => {
                    tr.remove();
                    updateAllSums();
                });
            };

            orderSelect.addEventListener('change', () => {
                const ordId = orderSelect.value;
                if (ordId) {
                    const orderObj = state.orders.find(o => o.id === ordId);
                    if (orderObj) {
                        counterpartySelect.value = orderObj.counterpartyId;
                        updateContracts();
                        contractSelect.value = orderObj.contractId;
                        updateCurrency();
                        
                        itemsTableBody.innerHTML = '';
                        orderObj.items.forEach(it => {
                            addRow({
                                productId: it.productId,
                                char: it.char,
                                qty: it.qty,
                                price: it.price
                            });
                        });
                    }
                } else {
                    counterpartySelect.value = '';
                    updateContracts();
                    contractSelect.value = '';
                    updateCurrency();
                    itemsTableBody.innerHTML = '';
                }
            });

            document.getElementById('btn-realization-add-line').addEventListener('click', () => addRow());

            if (item) {
                counterpartySelect.value = item.counterpartyId;
                updateContracts();
                contractSelect.value = item.contractId;
                updateCurrency();
                
                if (item.items && item.items.length > 0) {
                    itemsTableBody.innerHTML = '';
                    item.items.forEach(it => addRow(it));
                }
            } else {
                updateContracts();
            }
        }
    }

    saveRow(id) {
        const form = document.getElementById('doc-form');
        if (!form.reportValidity()) return;

        const cpId = form.counterpartyId.value;
        const conId = form.contractId.value;
        const orderId = form.orderId.value;
        const currency = document.getElementById('realization-currency-input').value;
        const date = form.date.value;
        const num = form.num.value;

        const itemRows = document.querySelectorAll('#realization-items-table tbody tr');
        const items = [];
        let validationError = null;

        itemRows.forEach((tr, idx) => {
            const productId = tr.querySelector('.row-item-product').value;
            const char = tr.querySelector('.row-item-char').value;
            const qty = parseFormattedNumber(tr.querySelector('.row-item-qty').value);
            const price = parseFormattedNumber(tr.querySelector('.row-item-price').value);
            const sum = qty * price;

            const prodName = (state.nomenclature.find(n => n.id === productId) || {}).name || 'Номенклатура';
            
            // Check available stock
            const packaged = window.getPackagedQtyForProduct(productId);
            const realizedOther = window.getRealizedQtyForProduct(productId, id);
            const available = Math.max(0, packaged - realizedOther);

            if (qty > available) {
                validationError = `Ошибка: Недостаточно товара на складе для "${prodName}"!\nДоступно к реализации: ${formatQty(available)} пар\nЗапрошено: ${formatQty(qty)} пар.`;
            }

            items.push({ id: 'item_' + idx + '_' + Date.now(), productId, char, qty, price, sum });
        });

        if (validationError) {
            alert(validationError);
            return;
        }

        if (items.length === 0) {
            alert('Спецификация отгрузки должна содержать хотя бы одну позицию товаров!');
            return;
        }

        const newDoc = {
            id: id || 'real_' + Date.now(),
            date,
            num,
            counterpartyId: cpId,
            contractId: conId,
            orderId: orderId || null,
            currency,
            items
        };

        if (id) {
            const idx = state.realizations.findIndex(x => x.id === id);
            state.realizations[idx] = newDoc;
        } else {
            state.realizations.push(newDoc);
        }

        saveState();
        closeModal();
        showToast('Документ реализации успешно сохранен!', 'success');
        this.renderTable(this.currentViewport);
    }
}

class PmpDocument extends BaseDocument {
    constructor() {
        super('pmp', 'Производственно мощностной план');
    }

    getColumns() {
        return [
            { id: 'month', label: 'Месяц планирования', filterable: true },
            { id: 'workingDays', label: 'Рабочих дней', filterable: true },
            { id: 'hoursNorm', label: 'Норма часов / день', filterable: false },
            { id: 'efficiencyCoef', label: 'Коэф. выработки (%)', filterable: false },
            { id: 'totals', label: 'Планируемый выпуск по этапам', filterable: false }
        ];
    }

    getColumnValue(record, colId) {
        if (colId === 'month') return `<strong>${record.month}</strong>`;
        if (colId === 'workingDays') return `${record.workingDays} дн.`;
        if (colId === 'hoursNorm') return `${record.hoursNorm} ч.`;
        if (colId === 'efficiencyCoef') return `${record.efficiencyCoef}%`;
        if (colId === 'totals') {
            const kn = record.items.filter(it => it.stage === 'Вязание').reduce((s, it) => s + (Number(it.plannedQty) || 0), 0);
            const sw = record.items.filter(it => it.stage === 'Прошив').reduce((s, it) => s + (Number(it.plannedQty) || 0), 0);
            const pk = record.items.filter(it => it.stage === 'Упаковка').reduce((s, it) => s + (Number(it.plannedQty) || 0), 0);
            return `
                <div style="font-size: 11px;">
                    <span class="badge badge-info">Вяз: ${formatQty(kn)} шт</span>
                    <span class="badge badge-success">Прош: ${formatQty(sw)} пар</span>
                    <span class="badge badge-warning">Упак: ${formatQty(pk)} пар</span>
                </div>
            `;
        }
        return record[colId] || '';
    }

    getActualsForMonth(month) {
        const actualDaysSet = new Set();
        const actualKnittingMachines = new Set();
        const actualSewingMachines = new Set();
        let actualKnittedQty = 0;
        let actualSewnQty = 0;
        let actualPackagedQty = 0;

        // Releases (Knitting)
        if (state.releases) {
            state.releases.forEach(rel => {
                if (rel.date && rel.date.startsWith(month)) {
                    actualDaysSet.add(rel.date);
                    if (rel.items) {
                        rel.items.forEach(ri => {
                            if (ri.machineNum) actualKnittingMachines.add(ri.machineNum);
                            actualKnittedQty += Number(ri.qty) || 0;
                        });
                    }
                }
            });
        }

        // Sewings (Sewing)
        if (state.sewings) {
            state.sewings.forEach(sew => {
                if (sew.date && sew.date.startsWith(month)) {
                    actualDaysSet.add(sew.date);
                    if (sew.items) {
                        sew.items.forEach(si => {
                            if (si.seamstressId) actualSewingMachines.add(si.seamstressId);
                            actualSewnQty += Number(si.qty) || 0;
                        });
                    }
                }
            });
        }

        // Packagings (Packaging)
        if (state.packagings) {
            state.packagings.forEach(pack => {
                if (pack.date && pack.date.startsWith(month)) {
                    actualDaysSet.add(pack.date);
                    if (pack.items) {
                        pack.items.forEach(pi => {
                            actualPackagedQty += Number(pi.qty) || 0;
                        });
                    }
                }
            });
        }

        return {
            workingDays: actualDaysSet.size,
            knittingMachines: actualKnittingMachines.size,
            sewingMachines: actualSewingMachines.size,
            knittedQty: actualKnittedQty,
            sewnQty: actualSewnQty,
            packagedQty: actualPackagedQty
        };
     }

    getModalViewBody(id) {
        const item = this.getRecords().find(x => x.id === id);
        const act = this.getActualsForMonth(item.month);
        
        // Sum planned stage totals
        const planKn = item.items.filter(it => it.stage === 'Вязание').reduce((s, it) => s + (Number(it.plannedQty) || 0), 0);
        const planSw = item.items.filter(it => it.stage === 'Прошив').reduce((s, it) => s + (Number(it.plannedQty) || 0), 0);
        const planPk = item.items.filter(it => it.stage === 'Упаковка').reduce((s, it) => s + (Number(it.plannedQty) || 0), 0);

        // Calculate % execution
        const pctKn = planKn > 0 ? Math.round((act.knittedQty / planKn) * 100) : 0;
        const pctSw = planSw > 0 ? Math.round((act.sewnQty / planSw) * 100) : 0;
        const pctPk = planPk > 0 ? Math.round((act.packagedQty / planPk) * 100) : 0;

        // Plan machines count
        const planKnMachines = item.items.filter(it => it.stage === 'Вязание').reduce((s, it) => s + (Number(it.machinesCount) || 0), 0);
        const planSwMachines = item.items.filter(it => it.stage === 'Прошив').reduce((s, it) => s + (Number(it.machinesCount) || 0), 0);
        const planPkMachines = item.items.filter(it => it.stage === 'Упаковка').reduce((s, it) => s + (Number(it.machinesCount) || 0), 0);

        return `
            <div class="view-details">
                <div class="view-fields-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 15px;">
                    <div class="view-field">
                        <span class="view-field-label">Месяц планирования</span>
                        <span class="view-field-value"><strong>${item.month}</strong></span>
                    </div>
                    <div class="view-field">
                        <span class="view-field-label">Рабочих дней (план)</span>
                        <span class="view-field-value">${item.workingDays} дн.</span>
                    </div>
                    <div class="view-field">
                        <span class="view-field-label">Норма часов в день</span>
                        <span class="view-field-value">${item.hoursNorm} ч.</span>
                    </div>
                    <div class="view-field">
                        <span class="view-field-label">Коэф. выработки</span>
                        <span class="view-field-value">${item.efficiencyCoef}%</span>
                    </div>
                </div>

                <div>
                    <span class="text-secondary" style="font-size: 11px; display: block; margin-bottom: 6px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Спецификация плана мощностей</span>
                    <table class="data-table" style="width: 100%; font-size: 12px; margin-bottom: 20px;">
                        <thead>
                            <tr>
                                <th>Линия</th>
                                <th>Этап производства</th>
                                <th style="text-align: right; width: 110px;">Оборудование</th>
                                <th style="text-align: right; width: 110px;">Рабочих часов</th>
                                <th style="text-align: right; width: 110px;">Цикл (сек)</th>
                                <th style="text-align: right; width: 150px;">Плановый объем</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${item.items.map(it => {
                                const line = state.lines.find(l => l.id === it.lineId) || {};
                                const unit = it.stage === 'Вязание' ? 'шт' : 'пар';
                                return `
                                    <tr>
                                        <td><strong>${line.name || '—'}</strong></td>
                                        <td><span class="badge badge-secondary">${it.stage}</span></td>
                                        <td style="text-align: right;">${it.machinesCount} шт.</td>
                                        <td style="text-align: right;">${it.hoursPerDay} ч/сут.</td>
                                        <td style="text-align: right;">${it.cycleTimeSec} сек.</td>
                                        <td style="text-align: right;"><strong>${formatQty(it.plannedQty)} ${unit}</strong></td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>

                <div style="margin-top: 20px;">
                    <span class="text-secondary" style="font-size: 11px; display: block; margin-bottom: 6px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Сравнение План-Факт за ${item.month}</span>
                    <table class="data-table" style="width: 100%; font-size: 12px;">
                        <thead>
                            <tr>
                                <th>Этап производства</th>
                                <th style="text-align: right;">План (объем)</th>
                                <th style="text-align: right;">Факт (объем)</th>
                                <th style="text-align: center;">Выполнение (%)</th>
                                <th style="text-align: right;">План (оборуд.)</th>
                                <th style="text-align: right;">Факт (оборуд.)</th>
                                <th style="text-align: right;">План (дней)</th>
                                <th style="text-align: right;">Факт (дней)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Вязальный</strong></td>
                                <td style="text-align: right;">${formatQty(planKn)} шт.</td>
                                <td style="text-align: right;">${formatQty(act.knittedQty)} шт.</td>
                                <td style="text-align: center; font-weight: bold; color: ${pctKn >= 100 ? 'var(--success)' : (pctKn >= 50 ? 'var(--info)' : 'var(--danger)')};">${pctKn}%</td>
                                <td style="text-align: right;">${planKnMachines} шт.</td>
                                <td style="text-align: right;">${act.knittingMachines} шт.</td>
                                <td style="text-align: right;" rowspan="3">${item.workingDays} дней</td>
                                <td style="text-align: right;" rowspan="3">${act.workingDays} дней</td>
                            </tr>
                            <tr>
                                <td><strong>Прошив</strong></td>
                                <td style="text-align: right;">${formatQty(planSw)} пар</td>
                                <td style="text-align: right;">${formatQty(act.sewnQty)} пар</td>
                                <td style="text-align: center; font-weight: bold; color: ${pctSw >= 100 ? 'var(--success)' : (pctSw >= 50 ? 'var(--info)' : 'var(--danger)')};">${pctSw}%</td>
                                <td style="text-align: right;">${planSwMachines} швей</td>
                                <td style="text-align: right;">${act.sewingMachines} швей</td>
                            </tr>
                            <tr>
                                <td><strong>Упаковка</strong></td>
                                <td style="text-align: right;">${formatQty(planPk)} пар</td>
                                <td style="text-align: right;">${formatQty(act.packagedQty)} пар</td>
                                <td style="text-align: center; font-weight: bold; color: ${pctPk >= 100 ? 'var(--success)' : (pctPk >= 50 ? 'var(--info)' : 'var(--danger)')};">${pctPk}%</td>
                                <td style="text-align: right;">${planPkMachines} столов</td>
                                <td style="text-align: right;">—</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    getModalEditBody(id) {
        const doc = id ? this.getRecords().find(x => x.id === id) : { month: new Date().toISOString().slice(0, 7), workingDays: 22, hoursNorm: 8, efficiencyCoef: 80, items: [] };
        return `
            <form id="doc-form">
                <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                    <div class="form-group">
                        <label class="form-label">Месяц планирования</label>
                        <input type="month" class="form-control" name="month" id="pmp-month" value="${doc.month}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Кол-во рабочих дней</label>
                        <input type="text" class="form-control" name="workingDays" id="pmp-working-days" value="${formatQty(doc.workingDays)}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Норма часов в день</label>
                        <input type="text" class="form-control" name="hoursNorm" id="pmp-hours-norm" value="${formatQty(doc.hoursNorm)}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Коэф. выработки (%)</label>
                        <input type="text" class="form-control" name="efficiencyCoef" id="pmp-efficiency" value="${formatQty(doc.efficiencyCoef)}" required>
                    </div>
                </div>

                <h4 style="margin: 20px 0 10px 0;">Линии & Плановые мощности оборудования</h4>
                <div class="table-wrapper">
                    <table class="table-form" id="pmp-items-table">
                        <thead>
                            <tr>
                                <th>Производственная линия</th>
                                <th style="width: 130px;">Этап производства</th>
                                <th class="col-qty">Кол-во оборуд.</th>
                                <th class="col-qty">Часов работы</th>
                                <th class="col-qty">Цикл (сек)</th>
                                <th class="col-price">Плановый объем</th>
                                <th class="col-btn"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Loaded in afterModalOpen -->
                        </tbody>
                    </table>
                </div>
                <button type="button" class="btn btn-secondary" id="btn-pmp-add-line" style="margin-top: 8px;">
                    <i class="ph ph-plus"></i>Добавить строку плана
                </button>
            </form>
        `;
    }

    afterModalOpen(id, mode) {
        if (mode === 'edit') {
            const itemsTableBody = document.querySelector('#pmp-items-table tbody');
            const workingDaysInput = document.getElementById('pmp-working-days');
            const efficiencyInput = document.getElementById('pmp-efficiency');
            const item = id ? this.getRecords().find(x => x.id === id) : null;

            setupNumericFormatting(workingDaysInput, 'qty');
            setupNumericFormatting(document.getElementById('pmp-hours-norm'), 'qty');
            setupNumericFormatting(efficiencyInput, 'qty');

            const updateAllRows = () => {
                const trs = itemsTableBody.querySelectorAll('tr');
                trs.forEach(tr => updateRowQty(tr));
            };

            workingDaysInput.addEventListener('input', updateAllRows);
            efficiencyInput.addEventListener('input', updateAllRows);

            const updateRowQty = (tr) => {
                const workingDays = parseFormattedNumber(workingDaysInput.value) || 0;
                const efficiency = parseFormattedNumber(efficiencyInput.value) || 0;

                const machinesCount = parseFormattedNumber(tr.querySelector('.row-machines').value) || 0;
                const hoursPerDay = parseFormattedNumber(tr.querySelector('.row-hours').value) || 0;
                const cycleTimeSec = parseFormattedNumber(tr.querySelector('.row-cycle-time').value) || 0;

                let plannedQty = 0;
                if (cycleTimeSec > 0) {
                    plannedQty = Math.round((machinesCount * workingDays * hoursPerDay * 3600 * (efficiency / 100)) / cycleTimeSec);
                }

                tr.querySelector('.row-planned-qty').value = formatQty(plannedQty);
            };

            const addRow = (rowVal = null) => {
                const tr = document.createElement('tr');
                const stages = ['Вязание', 'Прошив', 'Упаковка'];

                tr.innerHTML = `
                    <td>
                        <select class="form-control row-line" required>
                            <option value="">-- Выберите линию --</option>
                            ${state.lines.map(l => `<option value="${l.id}" ${rowVal && rowVal.lineId === l.id ? 'selected' : ''}>${l.name}</option>`).join('')}
                        </select>
                    </td>
                    <td>
                        <select class="form-control row-stage" required>
                            ${stages.map(st => `<option value="${st}" ${rowVal && rowVal.stage === st ? 'selected' : ''}>${st}</option>`).join('')}
                        </select>
                    </td>
                    <td class="col-qty">
                        <input type="text" class="form-control row-machines col-qty" value="${rowVal ? formatQty(rowVal.machinesCount) : '5'}" required>
                    </td>
                    <td class="col-qty">
                        <input type="text" class="form-control row-hours col-qty" value="${rowVal ? formatQty(rowVal.hoursPerDay) : '12'}" required>
                    </td>
                    <td class="col-qty">
                        <input type="text" class="form-control row-cycle-time col-qty" value="${rowVal ? formatQty(rowVal.cycleTimeSec) : '90'}" required>
                    </td>
                    <td class="col-price">
                        <input type="text" class="form-control row-planned-qty col-price" value="0" readonly style="background: rgba(255,255,255,0.03); text-align: right;">
                    </td>
                    <td class="col-btn">
                        <button type="button" class="btn btn-danger btn-icon-only btn-remove-row"><i class="ph ph-trash"></i></button>
                    </td>
                `;
                itemsTableBody.appendChild(tr);

                const machinesIn = tr.querySelector('.row-machines');
                const hoursIn = tr.querySelector('.row-hours');
                const cycleIn = tr.querySelector('.row-cycle-time');

                setupNumericFormatting(machinesIn, 'qty');
                setupNumericFormatting(hoursIn, 'qty');
                setupNumericFormatting(cycleIn, 'qty');

                const changeHandler = () => updateRowQty(tr);
                machinesIn.addEventListener('input', changeHandler);
                hoursIn.addEventListener('input', changeHandler);
                cycleIn.addEventListener('input', changeHandler);

                tr.querySelector('.btn-remove-row').addEventListener('click', () => tr.remove());

                updateRowQty(tr);
            };

            document.getElementById('btn-pmp-add-line').addEventListener('click', () => addRow());

            if (item && item.items && item.items.length > 0) {
                item.items.forEach(it => addRow(it));
            } else {
                addRow();
            }
        }
    }

    saveRow(id) {
        const form = document.getElementById('doc-form');
        if (!form.reportValidity()) return;

        const month = form.month.value;
        const workingDays = parseFormattedNumber(form.workingDays.value) || 0;
        const hoursNorm = parseFormattedNumber(form.hoursNorm.value) || 0;
        const efficiencyCoef = parseFormattedNumber(form.efficiencyCoef.value) || 0;

        const trs = document.querySelectorAll('#pmp-items-table tbody tr');
        const items = [];
        trs.forEach(tr => {
            items.push({
                lineId: tr.querySelector('.row-line').value,
                stage: tr.querySelector('.row-stage').value,
                machinesCount: parseFormattedNumber(tr.querySelector('.row-machines').value) || 0,
                hoursPerDay: parseFormattedNumber(tr.querySelector('.row-hours').value) || 0,
                cycleTimeSec: parseFormattedNumber(tr.querySelector('.row-cycle-time').value) || 0,
                plannedQty: parseFormattedNumber(tr.querySelector('.row-planned-qty').value) || 0
            });
        });

        if (items.length === 0) {
            alert('Спецификация плана должна содержать хотя бы одну строку!');
            return;
        }

        const newDoc = {
            id: id || 'pmp_' + Date.now(),
            date: new Date().toISOString().split('T')[0],
            month,
            workingDays,
            hoursNorm,
            efficiencyCoef,
            items
        };

        if (id) {
            const idx = state.pmp.findIndex(x => x.id === id);
            state.pmp[idx] = newDoc;
        } else {
            state.pmp.push(newDoc);
        }

        saveState();
        closeModal();
        showToast('Мощностной план успешно сохранен!', 'success');
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
    'packagings': new PackagingDocument(),
    'realizations': new RealizationDocument(),
    'pmp': new PmpDocument()
};


