function renderSettings(viewport) {
    viewport.innerHTML = `
        <div class="card" style="max-width: 600px; margin: 0 auto;">
            <h2 style="margin-bottom: 20px;">Настройки Учетной политики</h2>
            <form id="settings-form">
                <div class="form-group">
                    <label>Название компании</label>
                    <input type="text" class="form-control" id="set-company" value="${state.settings.companyName || ''}" required>
                </div>
                <div class="form-group">
                    <label>Основная валюта учета</label>
                    <select class="form-control" id="set-currency">
                        <option value="RUB" ${state.settings.accountingCurrency === 'RUB' ? 'selected' : ''}>RUB - Российский рубль</option>
                        <option value="USD" ${state.settings.accountingCurrency === 'USD' ? 'selected' : ''}>USD - Доллар США</option>
                        <option value="EUR" ${state.settings.accountingCurrency === 'EUR' ? 'selected' : ''}>EUR - Евро</option>
                        <option value="KZT" ${state.settings.accountingCurrency === 'KZT' ? 'selected' : ''}>KZT - Казахстанский тенге</option>
                        <option value="KGS" ${state.settings.accountingCurrency === 'KGS' ? 'selected' : ''}>KGS - Кыргызский сом</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Формат телефонного номера (маска)</label>
                    <input type="text" class="form-control" id="set-phone" value="${state.settings.phoneFormat || '+996 (XXX) XX-XX-XX'}" placeholder="+996 (XXX) XX-XX-XX" required>
                    <small class="text-muted" style="display: block; margin-top: 5px;">Используйте X для обозначения цифр</small>
                </div>
                <div class="form-group" style="flex-direction: row; align-items: center; gap: 10px; margin-top: 15px;">
                    <input type="checkbox" id="set-decimals" ${state.settings.useDecimals ? 'checked' : ''} style="width: 18px; height: 18px; cursor: pointer;">
                    <label for="set-decimals" style="margin: 0; cursor: pointer; font-weight: 500;">Учитывать копейки (знаки после запятой) в валютах</label>
                </div>
                <div class="form-group" id="decimal-places-group" style="margin-top: 10px; ${state.settings.useDecimals ? '' : 'display: none;'}">
                    <label>Количество знаков после запятой</label>
                    <input type="number" class="form-control" id="set-decimal-places" value="${state.settings.decimalPlaces !== undefined ? state.settings.decimalPlaces : 2}" min="0" max="4" required>
                </div>
                <div style="margin-top: 30px; display: flex; justify-content: flex-end;">
                    <button type="submit" class="btn btn-primary">Сохранить настройки</button>
                </div>
            </form>
        </div>
    `;

    const setDecimals = document.getElementById('set-decimals');
    const decimalPlacesGroup = document.getElementById('decimal-places-group');
    if (setDecimals && decimalPlacesGroup) {
        setDecimals.addEventListener('change', () => {
            decimalPlacesGroup.style.display = setDecimals.checked ? '' : 'none';
        });
    }

    document.getElementById('settings-form').addEventListener('submit', (e) => {
        e.preventDefault();
        state.settings.companyName = document.getElementById('set-company').value;
        state.settings.accountingCurrency = document.getElementById('set-currency').value;
        state.settings.phoneFormat = document.getElementById('set-phone').value;
        state.settings.useDecimals = document.getElementById('set-decimals').checked;
        state.settings.decimalPlaces = parseInt(document.getElementById('set-decimal-places').value, 10) || 0;
        saveState();
        showToast('Учетная политика успешно сохранена', 'success');
        updateBrandName();
        // Force refresh table/dashboard formatters by updating view
        renderCurrentTab();
    });
}

function updateBrandName() {
    const brandEl = document.getElementById('brand-name');
    if (brandEl && state.settings && state.settings.companyName) {
        brandEl.textContent = state.settings.companyName;
    }
}
