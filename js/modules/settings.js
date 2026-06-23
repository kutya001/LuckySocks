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
                <div style="margin-top: 30px; display: flex; justify-content: flex-end;">
                    <button type="submit" class="btn btn-primary">Сохранить настройки</button>
                </div>
            </form>
        </div>
    `;

    document.getElementById('settings-form').addEventListener('submit', (e) => {
        e.preventDefault();
        state.settings.companyName = document.getElementById('set-company').value;
        state.settings.accountingCurrency = document.getElementById('set-currency').value;
        state.settings.phoneFormat = document.getElementById('set-phone').value;
        saveState();
        showToast('Учетная политика успешно сохранена', 'success');
        updateBrandName();
    });
}

function updateBrandName() {
    const brandEl = document.getElementById('brand-name');
    if (brandEl && state.settings && state.settings.companyName) {
        brandEl.textContent = state.settings.companyName;
    }
}
