let currentTab = 'dashboard';

document.addEventListener('DOMContentLoaded', () => {
    loadState();
    updateBrandName();

    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            currentTab = item.getAttribute('data-tab');
            renderCurrentTab();
        });
    });

    document.getElementById('btn-reset-data')?.addEventListener('click', () => {
        if (confirm('Сбросить все данные?')) {
            resetState();
        }
    });

    document.getElementById('btn-quick-order')?.addEventListener('click', () => {
        currentTab = 'orders';
        document.querySelectorAll('.nav-item').forEach(i => {
            i.classList.remove('active');
            if (i.getAttribute('data-tab') === 'orders') i.classList.add('active');
        });
        renderCurrentTab();
    });

    renderCurrentTab();
});

function renderCurrentTab(subTab = null) {
    const viewport = document.getElementById('viewport');
    const pageTitle = document.getElementById('page-title');
    const pageSubtitle = document.getElementById('page-subtitle');
    
    viewport.innerHTML = '';
    
    switch (currentTab) {
        case 'dashboard':
            pageTitle.textContent = 'Панель управления';
            pageSubtitle.textContent = 'Сводные показатели';
            renderDashboard(viewport);
            break;
        case 'directories':
            pageTitle.textContent = 'Справочники';
            pageSubtitle.textContent = 'Управление НСИ';
            renderDirectories(viewport, subTab);
            break;
        case 'orders':
            pageTitle.textContent = 'Заказы покупателей';
            pageSubtitle.textContent = 'Продажи / Реализация';
            docMap.orders.renderTable(viewport);
            break;
        case 'specifications':
            pageTitle.textContent = 'Спецификации';
            pageSubtitle.textContent = 'Технологические карты (Разработка)';
            docMap.specifications.renderTable(viewport);
            break;
        case 'planning':
            pageTitle.textContent = 'Планирование и запуск';
            pageSubtitle.textContent = 'Очередь запуска в производство';
            docMap.planning.renderTable(viewport);
            break;
        case 'releases':
            pageTitle.textContent = 'Выпуск полуфабрикатов';
            pageSubtitle.textContent = 'Выработка вязального цеха (ПФ)';
            docMap.releases.renderTable(viewport);
            break;
        case 'sewings':
            pageTitle.textContent = 'Прошив мыска';
            pageSubtitle.textContent = 'Выработка швейного цеха (ГП)';
            docMap.sewings.renderTable(viewport);
            break;
        case 'packagings':
            pageTitle.textContent = 'Упаковка';
            pageSubtitle.textContent = 'Сдача готовой продукции на склад';
            docMap.packagings.renderTable(viewport);
            break;
        case 'reports':
            pageTitle.textContent = 'Отчеты';
            pageSubtitle.textContent = 'Анализ';
            renderReports(viewport);
            break;
        case 'settings':
            pageTitle.textContent = 'Учетная политика';
            pageSubtitle.textContent = 'Настройки системы';
            renderSettings(viewport);
            break;
    }
}

function getAggregateData() {
    let orderProgress = {}; // key: orderId
    
    // Initialize order info
    state.orders.forEach(o => {
        orderProgress[o.id] = {
            id: o.id,
            num: o.num,
            date: o.date,
            clientName: (state.counterparties.find(c => c.id === o.counterpartyId) || {}).name || 'Неизвестно',
            currency: o.currency,
            items: o.items.map(item => {
                const prod = state.nomenclature.find(n => n.id === item.productId) || {};
                return {
                    productId: item.productId,
                    name: prod.name || 'Неизвестно',
                    char: item.char,
                    orderedPairs: item.qty, // ordered in pairs
                    plannedPairs: 0,
                    knittedPairs: 0,
                    sewnPairs: 0,
                    packagedPairs: 0
                };
            })
        };
    });
    
    // Accumulate Planned quantities
    state.planning.forEach(p => {
        const ordProgress = orderProgress[p.orderId];
        if (!ordProgress) return;
        
        p.items.forEach(pItem => {
            const itemProgress = ordProgress.items.find(i => i.productId === pItem.productId);
            if (itemProgress) {
                itemProgress.plannedPairs += Number(pItem.qty);
            }
        });
    });
    
    // Helper to find orderItem by plan number
    // plan number format is OrderNumDigits/LineNum-Month e.g. "551/1-06"
    // Order number could be "ЗК-551". Digits match "551".
    function findItemByPlanNum(planNum) {
        if (!planNum) return null;
        const parts = planNum.split('/');
        const orderNumDigits = parts[0]; // e.g. "551"
        
        // Find order
        const order = state.orders.find(o => o.num.replace(/\D/g, '') === orderNumDigits);
        if (!order) return null;
        
        const ordProgress = orderProgress[order.id];
        if (!ordProgress) return null;
        
        // Find which product matches this plan number in Planning docs
        let productId = null;
        for (const pl of state.planning) {
            if (pl.orderId === order.id) {
                const match = pl.items.find(pi => pi.planNum === planNum);
                if (match) {
                    productId = match.productId;
                    break;
                }
            }
        }
        
        if (!productId) return null;
        
        const item = ordProgress.items.find(i => i.productId === productId);
        return item ? { orderId: order.id, item } : null;
    }
    
    // Accumulate Knitted (Release ПФ)
    state.releases.forEach(rel => {
        rel.items.forEach(rItem => {
            const match = findItemByPlanNum(rItem.planNum);
            if (match) {
                // 1 pair = 2 pieces. Releases are entered in pieces (шт).
                const pairs = Math.round(Number(rItem.qty) / 2);
                match.item.knittedPairs += pairs;
            }
        });
    });
    
    // Accumulate Sewn (Прошив ПФ -> ГП)
    state.sewings.forEach(sew => {
        sew.items.forEach(sItem => {
            const match = findItemByPlanNum(sItem.planNum);
            if (match) {
                // Sewing is in pairs
                match.item.sewnPairs += Number(sItem.qty);
            }
        });
    });
    
    // Accumulate Packaged (Упаковка ГП)
    state.packagings.forEach(pack => {
        pack.items.forEach(pItem => {
            const match = findItemByPlanNum(pItem.planNum);
            if (match) {
                // Packaging is in pairs
                match.item.packagedPairs += Number(pItem.qty);
            }
        });
    });
    
    return orderProgress;
}

function renderDashboard(container) {
    const progressData = getAggregateData();
    
    let totalOrdered = 0;
    let totalPlanned = 0;
    let totalKnitted = 0;
    let totalSewn = 0;
    let totalPackaged = 0;
    
    Object.values(progressData).forEach(o => {
        o.items.forEach(item => {
            totalOrdered += item.orderedPairs;
            totalPlanned += item.plannedPairs;
            totalKnitted += item.knittedPairs;
            totalSewn += item.sewnPairs;
            totalPackaged += item.packagedPairs;
        });
    });
    
    const activeOrdersCount = Object.keys(progressData).length;
    
    container.innerHTML = `
        <!-- Metrics Cards -->
        <div class="dashboard-grid">
            <div class="card stat-card">
                <div class="stat-info">
                    <span class="text-secondary font-weight-500">Заказы в работе</span>
                    <span class="stat-value">${activeOrdersCount}</span>
                </div>
                <i class="ph ph-shopping-bag stat-icon"></i>
            </div>
            <div class="card stat-card">
                <div class="stat-info">
                    <span class="text-secondary">Заказано пар</span>
                    <span class="stat-value">${totalOrdered.toLocaleString()}</span>
                </div>
                <i class="ph ph-hash stat-icon" style="color: var(--info); background: var(--info-bg);"></i>
            </div>
            <div class="card stat-card">
                <div class="stat-info">
                    <span class="text-secondary">Связано (ПФ)</span>
                    <span class="stat-value">${totalKnitted.toLocaleString()}</span>
                </div>
                <i class="ph ph-needle stat-icon" style="color: var(--info); background: var(--info-bg);"></i>
            </div>
            <div class="card stat-card">
                <div class="stat-info">
                    <span class="text-secondary">Прошито (ГП)</span>
                    <span class="stat-value">${totalSewn.toLocaleString()}</span>
                </div>
                <i class="ph ph-scissors stat-icon" style="color: var(--primary-hover); background: var(--primary-glow);"></i>
            </div>
            <div class="card stat-card">
                <div class="stat-info">
                    <span class="text-secondary">Упаковано</span>
                    <span class="stat-value">${totalPackaged.toLocaleString()}</span>
                </div>
                <i class="ph ph-package stat-icon" style="color: var(--success); background: var(--success-bg);"></i>
            </div>
        </div>

        <!-- Production Lines Status -->
        <h2 class="section-title">
            <i class="ph ph-factory text-primary"></i>
            <span>Мониторинг линий вязания</span>
        </h2>
        
        <div class="lines-grid">
            ${state.lines.map(line => {
                const foreman = state.employees.find(e => e.id === line.foremanId) || {};
                const ops = line.operatorIds.map(id => state.employees.find(e => e.id === id)).filter(Boolean);
                const machines = state.equipment.filter(eq => eq.type.includes('Вязальный') && line.operatorIds.includes(eq.operatorId));
                
                // Calculate Line's current Knitting release
                const linePlans = [];
                state.planning.forEach(pl => {
                    pl.items.forEach(item => {
                        if (item.lineId === line.id) linePlans.push(item.planNum);
                    });
                });
                
                let lineKnitQty = 0;
                state.releases.forEach(rel => {
                    rel.items.forEach(item => {
                        if (linePlans.includes(item.planNum)) {
                            lineKnitQty += Number(item.qty); // in pieces
                        }
                    });
                });
                
                return `
                    <div class="card line-card">
                        <div class="line-header">
                            <div class="line-info">
                                <h3>${line.name}</h3>
                                <span>Бригадир: ${foreman.name || 'Не назначен'}</span>
                            </div>
                            <span class="badge badge-success">Активна</span>
                        </div>
                        <div class="line-stats">
                            <div class="line-stat-row">
                                <span class="text-secondary">Вязальных станков:</span>
                                <strong>${machines.length} шт.</strong>
                            </div>
                            <div class="line-stat-row">
                                <span class="text-secondary">Операторов на линии:</span>
                                <strong>${ops.length} чел.</strong>
                            </div>
                            <div class="line-stat-row">
                                <span class="text-secondary">Выпуск заготовки (смена):</span>
                                <strong>${lineKnitQty} шт. (${Math.round(lineKnitQty/2)} пар)</strong>
                            </div>
                        </div>
                        <div style="margin-top: 8px;">
                            <span class="text-muted" style="font-size: 11px; display: block; margin-bottom: 4px;">Связанные станки:</span>
                            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                                ${machines.map(m => `
                                    <span class="badge badge-info" style="font-size: 10px;">${m.num} (${(state.employees.find(e => e.id === m.operatorId) || {}).name?.split(' ')[0]})</span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function renderReports(container) {
    const progressData = getAggregateData();
    
    container.innerHTML = `
        <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px; margin-bottom: 24px;">
            <h3 style="margin-bottom: 12px;"><i class="ph ph-info" style="margin-right: 8px; color: var(--info);"></i>Информационная справка</h3>
            <p class="text-secondary" style="font-size: 13px; line-height: 1.6;">
                Отчет группирует все действующие заказы клиентов и сопоставляет объемы на каждом этапе производственной цепочки:<br>
                <strong>Заказ покупателя (в парах)</strong> ➔ 
                <strong>Запуск в производство (Планы)</strong> ➔ 
                <strong>Выпуск оператора (Вязальные станки в шт / 2)</strong> ➔ 
                <strong>Прошив цеха (в парах готовой продукции)</strong> ➔ 
                <strong>Упаковка (пары ГП на складе)</strong>.
            </p>
        </div>

        <div class="table-wrapper">
            <table class="data-table">
                <thead>
                    <tr>
                        <th style="width: 50px;"></th>
                        <th>Номер заказа</th>
                        <th>Дата</th>
                        <th>Контрагент</th>
                        <th>Продукция (Позиции)</th>
                        <th>Заказано всего</th>
                        <th>Прогресс готовности (упаковки)</th>
                    </tr>
                </thead>
                <tbody id="reports-table-body">
                    ${Object.keys(progressData).length === 0 ? `<tr><td colspan="7" class="text-secondary" style="text-align: center;">Заказы клиентов не обнаружены</td></tr>` : ''}
                    ${Object.values(progressData).map((ord, idx) => {
                        const totalOrdered = ord.items.reduce((s, i) => s + i.orderedPairs, 0);
                        const totalPackaged = ord.items.reduce((s, i) => s + i.packagedPairs, 0);
                        const percent = totalOrdered > 0 ? Math.round((totalPackaged / totalOrdered) * 100) : 0;
                        
                        return `
                            <!-- Order Header Row -->
                            <tr class="order-report-header" style="cursor: pointer; background: rgba(255,255,255,0.01);" data-order-idx="${idx}">
                                <td><i class="ph-bold ph-caret-down toggle-icon" id="toggle-icon-${idx}" style="font-size: 16px; transition: transform 0.2s;"></i></td>
                                <td><strong>${ord.num}</strong></td>
                                <td>${ord.date}</td>
                                <td>${ord.clientName}</td>
                                <td>${ord.items.length} наим.</td>
                                <td><strong>${totalOrdered.toLocaleString()} пар</strong></td>
                                <td>
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <div class="progress-bar-track" style="flex-grow:1; height: 8px;">
                                            <div class="progress-segment progress-segment-packaged" style="width: ${percent}%;"></div>
                                        </div>
                                        <span class="badge ${percent === 100 ? 'badge-success' : 'badge-warning'}" style="min-width: 45px; text-align: center;">${percent}%</span>
                                    </div>
                                </td>
                            </tr>
                            
                            <!-- Order Detail Nested Row -->
                            <tr class="order-report-details" id="details-row-${idx}">
                                <td colspan="7" style="padding: 0 20px 20px 50px; background: rgba(0,0,0,0.15);">
                                    <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
                                        <thead>
                                            <tr style="border-bottom: 1px solid var(--border-color);">
                                                <th style="padding: 8px; font-size: 11px; color: var(--text-muted);">Название номенклатуры ГП</th>
                                                <th style="padding: 8px; font-size: 11px; color: var(--text-muted);">Характеристика</th>
                                                <th style="padding: 8px; font-size: 11px; color: var(--text-muted); text-align: right;">1. Заказ</th>
                                                <th style="padding: 8px; font-size: 11px; color: var(--text-muted); text-align: right;">2. План</th>
                                                <th style="padding: 8px; font-size: 11px; color: var(--text-muted); text-align: right;">3. Вязка (ПФ)</th>
                                                <th style="padding: 8px; font-size: 11px; color: var(--text-muted); text-align: right;">4. Швейка (ГП)</th>
                                                <th style="padding: 8px; font-size: 11px; color: var(--text-muted); text-align: right;">5. Упаковка (ГП)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${ord.items.map(item => {
                                                const knitPercent = item.plannedPairs > 0 ? Math.min(100, Math.round((item.knittedPairs / item.plannedPairs) * 100)) : 0;
                                                const sewPercent = item.knittedPairs > 0 ? Math.min(100, Math.round((item.sewnPairs / item.knittedPairs) * 100)) : 0;
                                                const packPercent = item.sewnPairs > 0 ? Math.min(100, Math.round((item.packagedPairs / item.sewnPairs) * 100)) : 0;
                                                
                                                return `
                                                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.03);">
                                                        <td style="padding: 12px 8px;"><strong>${item.name}</strong></td>
                                                        <td style="padding: 12px 8px;" class="text-secondary">${item.char}</td>
                                                        <td style="padding: 12px 8px; text-align: right;"><strong>${item.orderedPairs} пар</strong></td>
                                                        <td style="padding: 12px 8px; text-align: right; color: var(--info);">${item.plannedPairs} пар</td>
                                                        <td style="padding: 12px 8px; text-align: right;">
                                                            <div style="font-weight: 600; color: var(--info);">${item.knittedPairs} пар</div>
                                                            <span style="font-size:10px; color: var(--text-muted);">${item.knittedPairs*2} шт ПФ (${knitPercent}%)</span>
                                                        </td>
                                                        <td style="padding: 12px 8px; text-align: right;">
                                                            <div style="font-weight: 600; color: var(--primary-hover);">${item.sewnPairs} пар</div>
                                                            <span style="font-size:10px; color: var(--text-muted);">${sewPercent}% от ПФ</span>
                                                        </td>
                                                        <td style="padding: 12px 8px; text-align: right;">
                                                            <div style="font-weight: 600; color: var(--success);">${item.packagedPairs} пар</div>
                                                            <span style="font-size:10px; color: var(--text-muted);">${packPercent}% от швейки</span>
                                                        </td>
                                                    </tr>
                                                    
                                                    <!-- Visual Stage Progress Bar for this nomenclature -->
                                                    <tr>
                                                        <td colspan="7" style="padding: 4px 8px 12px 8px;">
                                                            <div class="stage-progress-container">
                                                                <div class="progress-bar-track">
                                                                    <div class="progress-segment progress-segment-knitted" style="width: ${(item.knittedPairs/item.orderedPairs)*100}%; max-width: 100%;" title="Вязка: ${item.knittedPairs} пар"></div>
                                                                    <div class="progress-segment progress-segment-sewn" style="width: ${(item.sewnPairs/item.orderedPairs)*100}%; max-width: 100%;" title="Прошив: ${item.sewnPairs} пар"></div>
                                                                    <div class="progress-segment progress-segment-packaged" style="width: ${(item.packagedPairs/item.orderedPairs)*100}%; max-width: 100%;" title="Упаковка: ${item.packagedPairs} пар"></div>
                                                                </div>
                                                                <div class="stage-labels-row">
                                                                    <span>Вязание: ${Math.round((item.knittedPairs/item.orderedPairs)*100)}%</span>
                                                                    <span>Швейка (мысок): ${Math.round((item.sewnPairs/item.orderedPairs)*100)}%</span>
                                                                    <span>Упаковка: ${Math.round((item.packagedPairs/item.orderedPairs)*100)}%</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                `;
                                            }).join('')}
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    // Bind toggle detail rows
    container.querySelectorAll('.order-report-header').forEach(header => {
        header.addEventListener('click', () => {
            const idx = header.getAttribute('data-order-idx');
            const detailsRow = document.getElementById(`details-row-${idx}`);
            const caret = document.getElementById(`toggle-icon-${idx}`);
            
            if (detailsRow.style.display === 'none') {
                detailsRow.style.display = '';
                caret.style.transform = 'rotate(0deg)';
            } else {
                detailsRow.style.display = 'none';
                caret.style.transform = 'rotate(-90deg)';
            }
        });
    });
}

