// SOCKS.PRO - Application Controller

// 1. Initial State Definition (Mock Data)
const DEFAULT_STATE = {
    nomenclatureTypes: [
        { id: 'С', name: 'Сырьё (С)' },
        { id: 'ПФ', name: 'Полуфабрикат (ПФ)' },
        { id: 'ГП', name: 'Готовая продукция (ГП)' },
        { id: 'КП', name: 'Комплект готовых продукций (КП)' }
    ],
    nomenclature: [
        { id: 'n_1', code: 'С-ХЛ100', name: 'Хлопок чесаный 100%', type: 'С' },
        { id: 'n_2', code: 'С-ЭЛ20', name: 'Эластан нить 20/70', type: 'С' },
        { id: 'n_3', code: 'ПФ-КЛ-ВЗ', name: 'Заготовка классического носка (ПФ)', type: 'ПФ' },
        { id: 'n_4', code: 'ПФ-СП-ВЗ', name: 'Заготовка спортивного носка (ПФ)', type: 'ПФ' },
        { id: 'n_5', code: 'ГП-КЛ-СИН', name: 'Носки мужские Classic Navy Blue', type: 'ГП' },
        { id: 'n_6', code: 'ГП-СП-БЕЛ', name: 'Носки спортивные Sport White', type: 'ГП' }
    ],
    counterparties: [
        { id: 'c_1', name: 'ООО "Модный Носок"', phone: '+7 (495) 777-88-99' },
        { id: 'c_2', name: 'ИП "Носочный Рай"', phone: '+7 (911) 222-33-44' }
    ],
    contracts: [
        { id: 'con_1', num: 'ДОГ-МН-2026', counterpartyId: 'c_1', currency: 'RUB' },
        { id: 'con_2', num: 'ДОГ-НР-EXP', counterpartyId: 'c_2', currency: 'USD' }
    ],
    employees: [
        { id: 'e_1', name: 'Смирнов Николай Иванович', role: 'Бригадир' },
        { id: 'e_2', name: 'Козлов Иван Петрович', role: 'Оператор' },
        { id: 'e_3', name: 'Попова Анна Сергеевна', role: 'Оператор' },
        { id: 'e_4', name: 'Дмитриева Мария Васильевна', role: 'Швея' },
        { id: 'e_5', name: 'Григорьева Ольга Николаевна', role: 'Швея' },
        { id: 'e_6', name: 'Соколов Дмитрий Андреевич', role: 'Конструктор' },
        { id: 'e_7', name: 'Мельник Павел Петрович', role: 'Механик' }
    ],
    equipment: [
        { id: 'eq_1', type: 'Вязальный станок', num: 'ВЗ-01', operatorId: 'e_2' },
        { id: 'eq_2', type: 'Вязальный станок', num: 'ВЗ-02', operatorId: 'e_2' },
        { id: 'eq_3', type: 'Вязальный станок', num: 'ВЗ-03', operatorId: 'e_2' },
        { id: 'eq_4', type: 'Вязальный станок', num: 'ВЗ-04', operatorId: 'e_3' },
        { id: 'eq_5', type: 'Вязальный станок', num: 'ВЗ-05', operatorId: 'e_3' },
        { id: 'eq_6', type: 'Швейная машина', num: 'ШВ-01', seamstressId: 'e_4' },
        { id: 'eq_7', type: 'Швейная машина', num: 'ШВ-02', seamstressId: 'e_5' }
    ],
    lines: [
        { id: 'l_1', name: 'Вязальная линия А', foremanId: 'e_1', operatorIds: ['e_2', 'e_3'] }
    ],
    specifications: [
        { 
            id: 'spec_1', 
            name: 'Техкарта Classic Navy Blue', 
            productId: 'n_5', 
            semiProductId: 'n_3', 
            machineNum: 'ВЗ-01', 
            color: 'Темно-синий', 
            gender: 'Мужской', 
            sewingTimeSec: 15,
            materials: [
                { id: 'n_1', qty: 0.035 }, 
                { id: 'n_2', qty: 0.005 }
            ]
        },
        { 
            id: 'spec_2', 
            name: 'Техкарта Sport Active White', 
            productId: 'n_6', 
            semiProductId: 'n_4', 
            machineNum: 'ВЗ-04', 
            color: 'Белый', 
            gender: 'Унисекс', 
            sewingTimeSec: 12,
            materials: [
                { id: 'n_1', qty: 0.030 }, 
                { id: 'n_2', qty: 0.007 }
            ]
        }
    ],
    orders: [
        { 
            id: 'ord_1', 
            date: '2026-06-20', 
            num: 'ЗК-551', 
            counterpartyId: 'c_1', 
            contractId: 'con_1', 
            currency: 'RUB',
            items: [
                { id: 'item_1', productId: 'n_5', char: 'Размер 41-43, темно-синий', qty: 5000, price: 60, sum: 300000 },
                { id: 'item_2', productId: 'n_6', char: 'Размер 39-40, с белым кантом', qty: 3000, price: 70, sum: 210000 }
            ]
        }
    ],
    planning: [
        {
            id: 'p_1',
            date: '2026-06-21',
            orderId: 'ord_1',
            items: [
                { productId: 'n_5', lineId: 'l_1', qty: 3000, planNum: '551/1-06' },
                { productId: 'n_5', lineId: 'l_1', qty: 2000, planNum: '551/2-06' },
                { productId: 'n_6', lineId: 'l_1', qty: 3000, planNum: '551/3-06' }
            ]
        }
    ],
    releases: [
        {
            id: 'rel_1',
            date: '2026-06-21',
            operatorId: 'e_2',
            items: [
                { machineNum: 'ВЗ-01', planNum: '551/1-06', qty: 4000 }, // 4000 шт ПФ = 2000 пар
                { machineNum: 'ВЗ-02', planNum: '551/2-06', qty: 1000 }  // 1000 шт ПФ = 500 пар
            ]
        },
        {
            id: 'rel_2',
            date: '2026-06-22',
            operatorId: 'e_3',
            items: [
                { machineNum: 'ВЗ-04', planNum: '551/3-06', qty: 3000 } // 3000 шт ПФ = 1500 пар
            ]
        }
    ],
    sewings: [
        {
            id: 'sew_1',
            date: '2026-06-22',
            lineId: 'l_1',
            items: [
                { seamstressId: 'e_4', planNum: '551/1-06', qty: 1500 }, // 1500 пар ГП
                { seamstressId: 'e_4', planNum: '551/2-06', qty: 300 },
                { seamstressId: 'e_5', planNum: '551/3-06', qty: 1000 }  // 1000 пар ГП
            ]
        }
    ],
    packagings: [
        {
            id: 'pack_1',
            date: '2026-06-22',
            operatorName: 'Смирнов Николай Иванович',
            items: [
                { planNum: '551/1-06', qty: 1200 }, // 1200 пар
                { planNum: '551/2-06', qty: 200 },
                { planNum: '551/3-06', qty: 800 }   // 800 пар
            ]
        }
    ],
    settings: {
        companyName: 'Socks.Pro Производство носков',
        accountingCurrency: 'RUB',
        phoneFormat: '+7 (XXX) XXX-XX-XX'
    }
};

// 2. Global State Variable
let state = {};

// 3. Load & Save State Functions
function loadState() {
    const saved = localStorage.getItem('socks_production_state');
    if (saved) {
        try {
            state = JSON.parse(saved);
            if (!state.settings) {
                state.settings = JSON.parse(JSON.stringify(DEFAULT_STATE.settings));
            }
        } catch (e) {
            console.error("Ошибка парсинга LocalStorage. Загрузка демо-данных.", e);
            resetState();
        }
    } else {
        resetState();
    }
}

function saveState() {
    localStorage.setItem('socks_production_state', JSON.stringify(state));
}

function resetState() {
    state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    saveState();
    showToast('Данные успешно сброшены к демо-значениям!', 'success');
    updateBrandName();
    renderCurrentTab();
}

// 4. Utility Toast System
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'ph-info';
    if (type === 'success') icon = 'ph-check-circle';
    if (type === 'warning') icon = 'ph-warning';
    if (type === 'danger') icon = 'ph-x-circle';
    
    toast.innerHTML = `
        <i class="ph-bold ${icon} toast-icon"></i>
        <span>${message}</span>
    `;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'none';
        toast.offsetHeight; /* trigger reflow */
        toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// 5. Modal System
const modalOverlay = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalFooter = document.getElementById('modal-footer');
const btnModalClose = document.getElementById('btn-modal-close');

function openModal(title, bodyHtml, footerHtml = '') {
    modalTitle.textContent = title;
    modalBody.innerHTML = bodyHtml;
    modalFooter.innerHTML = footerHtml;
    modalOverlay.classList.add('active');
}

function closeModal() {
    modalOverlay.classList.remove('active');
}

btnModalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});

// 6. Navigation Router
let currentTab = 'dashboard';

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        currentTab = item.getAttribute('data-tab');
        renderCurrentTab();
    });
});

document.getElementById('btn-reset-data').addEventListener('click', () => {
    if (confirm('Вы уверены, что хотите сбросить все данные и перезагрузить демонстрационный стенд? Свои изменения будут утеряны.')) {
        resetState();
    }
});

document.getElementById('btn-quick-order').addEventListener('click', () => {
    currentTab = 'doc-orders';
    document.querySelectorAll('.nav-item').forEach(i => {
        i.classList.remove('active');
        if (i.getAttribute('data-tab') === 'doc-orders') i.classList.add('active');
    });
    renderCurrentTab();
    openCreateDocumentModal('orders');
});

function renderCurrentTab(subTab = null) {
    const viewport = document.getElementById('viewport');
    const pageTitle = document.getElementById('page-title');
    const pageSubtitle = document.getElementById('page-subtitle');
    
    viewport.innerHTML = '';
    
    switch (currentTab) {
        case 'dashboard':
            pageTitle.textContent = 'Панель управления';
            pageSubtitle.textContent = 'Сводные показатели и оперативный статус линий';
            renderDashboard(viewport);
            break;
        case 'directories':
            pageTitle.textContent = 'Справочники';
            pageSubtitle.textContent = 'Управление нормативно-справочной информацией производства';
            renderDirectories(viewport, subTab);
            break;
        case 'doc-orders':
            pageTitle.textContent = 'Заявки на заказ покупателей';
            pageSubtitle.textContent = 'Регистрация потребностей покупателей и согласование цен';
            renderDocuments(viewport, 'orders');
            break;
        case 'doc-specifications':
            pageTitle.textContent = 'Технологические карты (Разработка)';
            pageSubtitle.textContent = 'Составление спецификаций сырья и нормирование времени пошива';
            renderDocuments(viewport, 'specifications');
            break;
        case 'doc-planning':
            pageTitle.textContent = 'Планирование и Запуск';
            pageSubtitle.textContent = 'Распределение заказов по производственным линиям с плановыми номерами';
            renderDocuments(viewport, 'planning');
            break;
        case 'doc-releases':
            pageTitle.textContent = 'Выпуск полуфабрикатов (Вязание)';
            pageSubtitle.textContent = 'Регистрация операторами выработки по вязальным станкам в штуках';
            renderDocuments(viewport, 'releases');
            break;
        case 'doc-sewings':
            pageTitle.textContent = 'Прошив мыска (Выпуск ГП)';
            pageSubtitle.textContent = 'Регистрация швеями выработки готовой продукции в парах';
            renderDocuments(viewport, 'sewings');
            break;
        case 'doc-packagings':
            pageTitle.textContent = 'Упаковка готовой продукции';
            pageSubtitle.textContent = 'Сдача упакованных готовых носков на склад';
            renderDocuments(viewport, 'packagings');
            break;
        case 'reports':
            pageTitle.textContent = 'Мониторинг этапов';
            pageSubtitle.textContent = 'Анализ выполнения клиентских заказов по стадиям производства';
            renderReports(viewport);
            break;
    }
}

// 7. Aggregation Helpers (Calculates Stage Quantities)
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

// 8. View: Dashboard
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
                // Get all plan numbers associated with this line
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

// 9. View: Directories
let activeDirTab = 'nomenclature';
let dirSearchQuery = '';

function renderDirectories(viewport, preselectTab = null) {
    if (preselectTab) activeDirTab = preselectTab;
    
    viewport.innerHTML = `
        <div class="view-tabs">
            <button class="tab-btn ${activeDirTab === 'nomenclature' ? 'active' : ''}" data-dir="nomenclature">Номенклатура</button>
            <button class="tab-btn ${activeDirTab === 'counterparties' ? 'active' : ''}" data-dir="counterparties">Контрагенты</button>
            <button class="tab-btn ${activeDirTab === 'employees' ? 'active' : ''}" data-dir="employees">Сотрудники</button>
            <button class="tab-btn ${activeDirTab === 'equipment' ? 'active' : ''}" data-dir="equipment">Оборудование</button>
            <button class="tab-btn ${activeDirTab === 'lines' ? 'active' : ''}" data-dir="lines">Производственные линии</button>
        </div>
        
        <div class="dir-toolbar">
            <div class="search-input-wrapper">
                <i class="ph ph-magnifying-glass"></i>
                <input type="text" class="search-input" id="dir-search" placeholder="Поиск по названию..." value="${dirSearchQuery}">
            </div>
            <button class="btn btn-primary" id="btn-dir-create">
                <i class="ph ph-plus"></i>
                <span>Добавить элемент</span>
            </button>
        </div>
        
        <div class="table-wrapper" id="dir-table-container">
            <!-- Table rendered here -->
        </div>
    `;
    
    // Add tab event listeners
    viewport.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            viewport.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeDirTab = btn.getAttribute('data-dir');
            dirSearchQuery = '';
            document.getElementById('dir-search').value = '';
            renderDirTable();
        });
    });
    
    // Search listener
    const searchInput = document.getElementById('dir-search');
    searchInput.addEventListener('input', (e) => {
        dirSearchQuery = e.target.value.toLowerCase().trim();
        renderDirTable();
    });
    
    // Create button listener
    document.getElementById('btn-dir-create').addEventListener('click', () => {
        openDirEditModal(null);
    });
    
    renderDirTable();
}

function renderDirTable() {
    const container = document.getElementById('dir-table-container');
    container.innerHTML = '';
    
    let html = '';
    
    switch (activeDirTab) {
        case 'nomenclature': {
            const list = state.nomenclature.filter(n => 
                n.name.toLowerCase().includes(dirSearchQuery) || 
                n.code.toLowerCase().includes(dirSearchQuery)
            );
            
            html = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Артикул</th>
                            <th>Наименование</th>
                            <th>Вид номенклатуры</th>
                            <th style="text-align: right;">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${list.length === 0 ? `<tr><td colspan="4" class="text-secondary" style="text-align: center;">Номенклатура не найдена</td></tr>` : ''}
                        ${list.map(item => {
                            const typeObj = state.nomenclatureTypes.find(t => t.id === item.type) || {};
                            return `
                                <tr>
                                    <td><strong>${item.code}</strong></td>
                                    <td>${item.name}</td>
                                    <td><span class="badge badge-info">${typeObj.name || item.type}</span></td>
                                    <td>
                                        <div class="row-actions">
                                            <button class="btn btn-secondary btn-icon-only edit-row-btn" data-id="${item.id}"><i class="ph ph-pencil-simple"></i></button>
                                            <button class="btn btn-danger btn-icon-only delete-row-btn" data-id="${item.id}"><i class="ph ph-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            `;
            break;
        }
        case 'counterparties': {
            const list = state.counterparties.filter(c => 
                c.name.toLowerCase().includes(dirSearchQuery) || 
                (c.phone && c.phone.includes(dirSearchQuery))
            );
            
            html = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Контрагент</th>
                            <th>Телефон</th>
                            <th>Договоры</th>
                            <th style="text-align: right;">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${list.length === 0 ? `<tr><td colspan="4" class="text-secondary" style="text-align: center;">Контрагенты не найдены</td></tr>` : ''}
                        ${list.map(c => {
                            const contracts = state.contracts.filter(con => con.counterpartyId === c.id);
                            return `
                                <tr>
                                    <td><strong>${c.name}</strong></td>
                                    <td>${c.phone || '—'}</td>
                                    <td>
                                        ${contracts.map(con => `<span class="badge badge-success" style="margin-right: 4px;">${con.num} (${con.currency})</span>`).join('') || '<span class="text-muted">Нет договора</span>'}
                                    </td>
                                    <td>
                                        <div class="row-actions">
                                            <button class="btn btn-secondary btn-icon-only edit-row-btn" data-id="${c.id}"><i class="ph ph-pencil-simple"></i></button>
                                            <button class="btn btn-danger btn-icon-only delete-row-btn" data-id="${c.id}"><i class="ph ph-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            `;
            break;
        }
        case 'employees': {
            const list = state.employees.filter(e => 
                e.name.toLowerCase().includes(dirSearchQuery) || 
                e.role.toLowerCase().includes(dirSearchQuery)
            );
            
            html = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ФИО Сотрудника</th>
                            <th>Должность / Профиль</th>
                            <th style="text-align: right;">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${list.length === 0 ? `<tr><td colspan="3" class="text-secondary" style="text-align: center;">Сотрудники не найдены</td></tr>` : ''}
                        ${list.map(e => `
                            <tr>
                                <td><strong>${e.name}</strong></td>
                                <td><span class="badge badge-info">${e.role}</span></td>
                                <td>
                                    <div class="row-actions">
                                        <button class="btn btn-secondary btn-icon-only edit-row-btn" data-id="${e.id}"><i class="ph ph-pencil-simple"></i></button>
                                        <button class="btn btn-danger btn-icon-only delete-row-btn" data-id="${e.id}"><i class="ph ph-trash"></i></button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            break;
        }
        case 'equipment': {
            const list = state.equipment.filter(eq => 
                eq.num.toLowerCase().includes(dirSearchQuery) || 
                eq.type.toLowerCase().includes(dirSearchQuery)
            );
            
            html = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Номер станка / машины</th>
                            <th>Тип оборудования</th>
                            <th>Ответственный сотрудник</th>
                            <th style="text-align: right;">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${list.length === 0 ? `<tr><td colspan="4" class="text-secondary" style="text-align: center;">Оборудование не найдено</td></tr>` : ''}
                        ${list.map(eq => {
                            let workerName = '—';
                            if (eq.operatorId) {
                                workerName = (state.employees.find(e => e.id === eq.operatorId) || {}).name || '—';
                            } else if (eq.seamstressId) {
                                workerName = (state.employees.find(e => e.id === eq.seamstressId) || {}).name || '—';
                            }
                            
                            return `
                                <tr>
                                    <td><strong>${eq.num}</strong></td>
                                    <td>${eq.type}</td>
                                    <td><i class="ph ph-user" style="margin-right: 6px;"></i>${workerName}</td>
                                    <td>
                                        <div class="row-actions">
                                            <button class="btn btn-secondary btn-icon-only edit-row-btn" data-id="${eq.id}"><i class="ph ph-pencil-simple"></i></button>
                                            <button class="btn btn-danger btn-icon-only delete-row-btn" data-id="${eq.id}"><i class="ph ph-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            `;
            break;
        }
        case 'lines': {
            const list = state.lines.filter(l => 
                l.name.toLowerCase().includes(dirSearchQuery)
            );
            
            html = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Линия</th>
                            <th>Бригадир</th>
                            <th>Операторы на линии</th>
                            <th style="text-align: right;">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${list.length === 0 ? `<tr><td colspan="4" class="text-secondary" style="text-align: center;">Производственные линии не найдены</td></tr>` : ''}
                        ${list.map(l => {
                            const foreman = state.employees.find(e => e.id === l.foremanId) || {};
                            const ops = l.operatorIds.map(id => state.employees.find(e => e.id === id)).filter(Boolean);
                            return `
                                <tr>
                                    <td><strong>${l.name}</strong></td>
                                    <td><strong>${foreman.name || 'Не назначен'}</strong></td>
                                    <td>
                                        ${ops.map(o => `<span class="badge badge-info" style="margin-right: 4px;">${o.name.split(' ')[0]}</span>`).join('') || '<span class="text-muted">Нет операторов</span>'}
                                    </td>
                                    <td>
                                        <div class="row-actions">
                                            <button class="btn btn-secondary btn-icon-only edit-row-btn" data-id="${l.id}"><i class="ph ph-pencil-simple"></i></button>
                                            <button class="btn btn-danger btn-icon-only delete-row-btn" data-id="${l.id}"><i class="ph ph-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            `;
            break;
        }
    }
    
    container.innerHTML = html;
    
    // Bind Edit and Delete events
    container.querySelectorAll('.edit-row-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            openDirEditModal(id);
        });
    });
    
    container.querySelectorAll('.delete-row-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            deleteDirRow(id);
        });
    });
}

function deleteDirRow(id) {
    if (!confirm('Вы действительно хотите удалить этот элемент? Это может нарушить связи в связанных документах.')) return;
    
    let index = -1;
    switch (activeDirTab) {
        case 'nomenclature':
            index = state.nomenclature.findIndex(x => x.id === id);
            if (index > -1) state.nomenclature.splice(index, 1);
            break;
        case 'counterparties':
            index = state.counterparties.findIndex(x => x.id === id);
            if (index > -1) {
                state.counterparties.splice(index, 1);
                // Also clean up contracts
                state.contracts = state.contracts.filter(c => c.counterpartyId !== id);
            }
            break;
        case 'employees':
            index = state.employees.findIndex(x => x.id === id);
            if (index > -1) state.employees.splice(index, 1);
            break;
        case 'equipment':
            index = state.equipment.findIndex(x => x.id === id);
            if (index > -1) state.equipment.splice(index, 1);
            break;
        case 'lines':
            index = state.lines.findIndex(x => x.id === id);
            if (index > -1) state.lines.splice(index, 1);
            break;
    }
    
    saveState();
    showToast('Элемент успешно удален!', 'success');
    renderDirTable();
}

function openDirEditModal(id) {
    let title = id ? 'Редактировать элемент' : 'Создать новый элемент';
    let body = '';
    let item = null;
    
    if (activeDirTab === 'nomenclature') {
        item = id ? state.nomenclature.find(x => x.id === id) : { code: '', name: '', type: 'ГП' };
        body = `
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
    else if (activeDirTab === 'counterparties') {
        item = id ? state.counterparties.find(x => x.id === id) : { name: '', phone: '' };
        const cpContracts = id ? state.contracts.filter(con => con.counterpartyId === id) : [];
        
        body = `
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
                            <!-- Contracts rows load here -->
                        </tbody>
                    </table>
                </div>
            </form>
        `;
        
        setTimeout(() => {
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
                
                tr.querySelector('.btn-remove-contract-row').addEventListener('click', () => {
                    tr.remove();
                });
            }
            
            if (cpContracts.length > 0) {
                cpContracts.forEach(con => addContractRow(con));
            } else {
                addContractRow();
            }
            
            document.getElementById('btn-add-contract-row').addEventListener('click', () => {
                addContractRow();
            });
        }, 100);
    }
    else if (activeDirTab === 'employees') {
        item = id ? state.employees.find(x => x.id === id) : { name: '', role: 'Оператор' };
        body = `
            <form id="dir-form">
                <div class="form-group">
                    <label class="form-label">ФИО сотрудника</label>
                    <input type="text" class="form-control" name="name" value="${item.name}" required placeholder="Иванов Иван Иванович">
                </div>
                <div class="form-group">
                    <label class="form-label">Роль / Специализация</label>
                    <select class="form-control" name="role" required>
                        <option value="Оператор" ${item.role === 'Оператор' ? 'selected' : ''}>Оператор вязального оборудования</option>
                        <option value="Швея" ${item.role === 'Швея' ? 'selected' : ''}>Швея (прошив мыска)</option>
                        <option value="Бригадир" ${item.role === 'Бригадир' ? 'selected' : ''}>Бригадир производственной линии</option>
                        <option value="Конструктор" ${item.role === 'Конструктор' ? 'selected' : ''}>Конструктор-технолог карточек</option>
                        <option value="Механик" ${item.role === 'Механик' ? 'selected' : ''}>Механик / Наладчик оборудования</option>
                        <option value="Упаковщик" ${item.role === 'Упаковщик' ? 'selected' : ''}>Оператор упаковки</option>
                    </select>
                </div>
            </form>
        `;
    }
    else if (activeDirTab === 'equipment') {
        item = id ? state.equipment.find(x => x.id === id) : { type: 'Вязальный станок', num: '', operatorId: '', seamstressId: '' };
        const operators = state.employees.filter(e => e.role === 'Оператор');
        const seamstresses = state.employees.filter(e => e.role === 'Швея');
        
        body = `
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
        
        setTimeout(() => {
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
        }, 100);
    }
    else if (activeDirTab === 'lines') {
        item = id ? state.lines.find(x => x.id === id) : { name: '', foremanId: '', operatorIds: [] };
        const foremen = state.employees.filter(e => e.role === 'Бригадир');
        const operators = state.employees.filter(e => e.role === 'Оператор');
        
        body = `
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
    
    const footer = `
        <button class="btn btn-secondary" onclick="closeModal()">Отмена</button>
        <button class="btn btn-primary" id="btn-modal-save">Сохранить</button>
    `;
    
    openModal(title, body, footer);
    
    document.getElementById('btn-modal-save').addEventListener('click', () => {
        const form = document.getElementById('dir-form');
        if (!form.reportValidity()) return;
        
        const fd = new FormData(form);
        
        if (activeDirTab === 'nomenclature') {
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
        }
        else if (activeDirTab === 'counterparties') {
            let cpId = id;
            if (id) {
                const idx = state.counterparties.findIndex(x => x.id === id);
                state.counterparties[idx] = { ...state.counterparties[idx], name: fd.get('name'), phone: fd.get('phone') };
            } else {
                cpId = 'c_' + Date.now();
                state.counterparties.push({
                    id: cpId,
                    name: fd.get('name'),
                    phone: fd.get('phone')
                });
            }
            
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
            
            state.contracts = state.contracts.filter(con => con.counterpartyId !== cpId);
            state.contracts.push(...newContracts);
        }
        else if (activeDirTab === 'employees') {
            if (id) {
                const idx = state.employees.findIndex(x => x.id === id);
                state.employees[idx] = { ...state.employees[idx], name: fd.get('name'), role: fd.get('role') };
            } else {
                state.employees.push({
                    id: 'e_' + Date.now(),
                    name: fd.get('name'),
                    role: fd.get('role')
                });
            }
        }
        else if (activeDirTab === 'equipment') {
            const eqType = fd.get('type');
            const opId = fd.get('operatorId') || null;
            const seamId = fd.get('seamstressId') || null;
            
            // Check seamstress validation (1-to-1)
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
        }
        else if (activeDirTab === 'lines') {
            // Get select values for multiple operatorIds
            const selectEl = form.querySelector('select[name="operatorIds"]');
            const selectedOperators = Array.from(selectEl.selectedOptions).map(option => option.value);
            
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
        }
        
        saveState();
        closeModal();
        showToast('Элемент справочника успешно сохранён!', 'success');
        renderDirTable();
    });
}

// 10. View: Documents & Manufacturing Steps
let activeDocTab = 'orders';

function renderDocuments(viewport, preselectTab = null) {
    if (preselectTab) activeDocTab = preselectTab;
    
    viewport.innerHTML = `
        <div class="dir-toolbar">
            <div></div> <!-- Spacer -->
            <button class="btn btn-primary" id="btn-doc-create">
                <i class="ph ph-plus"></i>
                <span id="btn-doc-create-text">Создать новый документ</span>
            </button>
        </div>
        
        <div class="table-wrapper" id="doc-table-container">
            <!-- Documents Table rendered here -->
        </div>
    `;
    
    // Create Document trigger
    document.getElementById('btn-doc-create').addEventListener('click', () => {
        openCreateDocumentModal(activeDocTab);
    });
    
    renderDocTable();
}

function renderDocTable() {
    const container = document.getElementById('doc-table-container');
    const createBtnText = document.getElementById('btn-doc-create-text');
    container.innerHTML = '';
    
    let html = '';
    
    if (activeDocTab === 'orders') {
        createBtnText.textContent = 'Создать Заявку на Заказ';
        html = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Дата заказа</th>
                        <th>Номер заказа</th>
                        <th>Контрагент</th>
                        <th>Договор</th>
                        <th>Сумма заказа</th>
                        <th>Кол-во номенклатуры</th>
                        <th style="text-align: right;">Действия</th>
                    </tr>
                </thead>
                <tbody>
                    ${state.orders.length === 0 ? `<tr><td colspan="7" class="text-secondary" style="text-align: center;">Заказы клиентов отсутствуют</td></tr>` : ''}
                    ${state.orders.map(o => {
                        const counterparty = state.counterparties.find(c => c.id === o.counterpartyId) || {};
                        const contract = state.contracts.find(con => con.id === o.contractId) || {};
                        const totalSum = o.items.reduce((s, item) => s + Number(item.sum), 0);
                        const totalQty = o.items.reduce((q, item) => q + Number(item.qty), 0);
                        return `
                            <tr>
                                <td>${o.date}</td>
                                <td><strong>${o.num}</strong></td>
                                <td>${counterparty.name || '—'}</td>
                                <td>${contract.num || '—'} (${o.currency})</td>
                                <td><strong>${totalSum.toLocaleString()} ${o.currency}</strong></td>
                                <td>${totalQty.toLocaleString()} пар (${o.items.length} поз.)</td>
                                <td>
                                    <div class="row-actions">
                                        <button class="btn btn-secondary btn-icon-only edit-doc-btn" data-id="${o.id}"><i class="ph ph-magnifying-glass"></i></button>
                                        <button class="btn btn-danger btn-icon-only delete-doc-btn" data-id="${o.id}"><i class="ph ph-trash"></i></button>
                                    </div>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    }
    else if (activeDocTab === 'specifications') {
        createBtnText.textContent = 'Разработать техкарту носка';
        html = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Продукт ГП</th>
                        <th>Техкарта</th>
                        <th>Станок</th>
                        <th>Цвет / Пол</th>
                        <th>Время пошива 1 шт.</th>
                        <th>Расход Сырья</th>
                        <th style="text-align: right;">Действия</th>
                    </tr>
                </thead>
                <tbody>
                    ${state.specifications.length === 0 ? `<tr><td colspan="7" class="text-secondary" style="text-align: center;">Технологические карты не разработаны</td></tr>` : ''}
                    ${state.specifications.map(s => {
                        const prod = state.nomenclature.find(n => n.id === s.productId) || {};
                        return `
                            <tr>
                                <td><strong>${prod.name || '—'}</strong></td>
                                <td>${s.name}</td>
                                <td><span class="badge badge-info">${s.machineNum}</span></td>
                                <td>${s.color} / ${s.gender}</td>
                                <td><strong>${s.sewingTimeSec} сек</strong></td>
                                <td>
                                    ${s.materials.map(m => {
                                        const mat = state.nomenclature.find(n => n.id === m.id) || {};
                                        return `<span class="badge badge-success" style="margin-right: 4px;">${mat.name}: ${m.qty} кг/шт</span>`;
                                    }).join('')}
                                </td>
                                <td>
                                    <div class="row-actions">
                                        <button class="btn btn-secondary btn-icon-only edit-doc-btn" data-id="${s.id}"><i class="ph ph-magnifying-glass"></i></button>
                                        <button class="btn btn-danger btn-icon-only delete-doc-btn" data-id="${s.id}"><i class="ph ph-trash"></i></button>
                                    </div>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    }
    else if (activeDocTab === 'planning') {
        createBtnText.textContent = 'Запланировать в производство';
        html = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Дата планирования</th>
                        <th>Заказ</th>
                        <th>Продукция</th>
                        <th>Распределение по Линиям (Плановые №)</th>
                        <th style="text-align: right;">Действия</th>
                    </tr>
                </thead>
                <tbody>
                    ${state.planning.length === 0 ? `<tr><td colspan="5" class="text-secondary" style="text-align: center;">Планы запуска отсутствуют</td></tr>` : ''}
                    ${state.planning.map(p => {
                        const orderObj = state.orders.find(o => o.id === p.orderId) || { num: 'Неизвестно' };
                        return `
                            <tr>
                                <td>${p.date}</td>
                                <td><strong>${orderObj.num}</strong></td>
                                <td>
                                    ${p.items.map(pi => {
                                        const prod = state.nomenclature.find(n => n.id === pi.productId) || {};
                                        return `<div style="font-size:12px; margin-bottom: 2px;">${prod.name}</div>`;
                                    }).join('')}
                                </td>
                                <td>
                                    ${p.items.map(pi => {
                                        const lineObj = state.lines.find(l => l.id === pi.lineId) || {};
                                        return `<div style="margin-bottom: 4px;"><span class="badge badge-info">${pi.planNum}</span> на <strong>${lineObj.name || '—'}</strong> (${pi.qty.toLocaleString()} пар)</div>`;
                                    }).join('')}
                                </td>
                                <td>
                                    <div class="row-actions">
                                        <button class="btn btn-secondary btn-icon-only edit-doc-btn" data-id="${p.id}"><i class="ph ph-magnifying-glass"></i></button>
                                        <button class="btn btn-danger btn-icon-only delete-doc-btn" data-id="${p.id}"><i class="ph ph-trash"></i></button>
                                    </div>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    }
    else if (activeDocTab === 'releases') {
        createBtnText.textContent = 'Оформить Выпуск (Оператор)';
        html = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Дата выпуска</th>
                        <th>Оператор</th>
                        <th>Выпуск по Станкам & Планам</th>
                        <th style="text-align: right;">Действия</th>
                    </tr>
                </thead>
                <tbody>
                    ${state.releases.length === 0 ? `<tr><td colspan="4" class="text-secondary" style="text-align: center;">Документы выпуска отсутствуют</td></tr>` : ''}
                    ${state.releases.map(r => {
                        const op = state.employees.find(e => e.id === r.operatorId) || {};
                        return `
                            <tr>
                                <td>${r.date}</td>
                                <td><strong>${op.name || '—'}</strong> (Оператор)</td>
                                <td>
                                    ${r.items.map(ri => `
                                        <div style="margin-bottom: 4px;">
                                            Станок <span class="badge badge-info">${ri.machineNum}</span> | 
                                            План <span class="badge badge-success">${ri.planNum}</span> : 
                                            <strong>${ri.qty.toLocaleString()} шт ПФ</strong> (${Math.round(ri.qty/2)} пар)
                                        </div>
                                    `).join('')}
                                </td>
                                <td>
                                    <div class="row-actions">
                                        <button class="btn btn-secondary btn-icon-only edit-doc-btn" data-id="${r.id}"><i class="ph ph-magnifying-glass"></i></button>
                                        <button class="btn btn-danger btn-icon-only delete-doc-btn" data-id="${r.id}"><i class="ph ph-trash"></i></button>
                                    </div>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    }
    else if (activeDocTab === 'sewings') {
        createBtnText.textContent = 'Оформить Прошив (Швея/Бригадир)';
        html = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Дата прошива</th>
                        <th>Производственная Линия</th>
                        <th>Выработка швей</th>
                        <th style="text-align: right;">Действия</th>
                    </tr>
                </thead>
                <tbody>
                    ${state.sewings.length === 0 ? `<tr><td colspan="4" class="text-secondary" style="text-align: center;">Записи о прошиве отсутствуют</td></tr>` : ''}
                    ${state.sewings.map(s => {
                        const line = state.lines.find(l => l.id === s.lineId) || {};
                        return `
                            <tr>
                                <td>${s.date}</td>
                                <td><strong>${line.name || '—'}</strong></td>
                                <td>
                                    ${s.items.map(si => {
                                        const seam = state.employees.find(e => e.id === si.seamstressId) || {};
                                        return `
                                            <div style="margin-bottom: 4px;">
                                                Швея: <strong>${seam.name ? seam.name.split(' ')[0] : '—'}</strong> | 
                                                План: <span class="badge badge-info">${si.planNum}</span> | 
                                                Выпущено ГП: <strong>${si.qty.toLocaleString()} пар</strong>
                                            </div>
                                        `;
                                    }).join('')}
                                </td>
                                <td>
                                    <div class="row-actions">
                                        <button class="btn btn-secondary btn-icon-only edit-doc-btn" data-id="${s.id}"><i class="ph ph-magnifying-glass"></i></button>
                                        <button class="btn btn-danger btn-icon-only delete-doc-btn" data-id="${s.id}"><i class="ph ph-trash"></i></button>
                                    </div>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    }
    else if (activeDocTab === 'packagings') {
        createBtnText.textContent = 'Зарегистрировать Упаковку';
        html = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Дата упаковки</th>
                        <th>Оператор принятия</th>
                        <th>Детали упаковки</th>
                        <th style="text-align: right;">Действия</th>
                    </tr>
                </thead>
                <tbody>
                    ${state.packagings.length === 0 ? `<tr><td colspan="4" class="text-secondary" style="text-align: center;">Документы упаковки отсутствуют</td></tr>` : ''}
                    ${state.packagings.map(pack => `
                        <tr>
                            <td>${pack.date}</td>
                            <td><strong>${pack.operatorName}</strong></td>
                            <td>
                                ${pack.items.map(pi => `
                                    <div style="margin-bottom: 4px;">
                                        План <span class="badge badge-success">${pi.planNum}</span> : 
                                        <strong>${pi.qty.toLocaleString()} пар ГП</strong> упаковано
                                    </div>
                                `).join('')}
                            </td>
                            <td>
                                <div class="row-actions">
                                    <button class="btn btn-secondary btn-icon-only edit-doc-btn" data-id="${pack.id}"><i class="ph ph-magnifying-glass"></i></button>
                                    <button class="btn btn-danger btn-icon-only delete-doc-btn" data-id="${pack.id}"><i class="ph ph-trash"></i></button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
    
    container.innerHTML = html;
    
    // Bind edit and delete triggers
    container.querySelectorAll('.edit-doc-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            openEditDocumentModal(activeDocTab, id);
        });
    });
    
    container.querySelectorAll('.delete-doc-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            deleteDocRow(activeDocTab, id);
        });
    });
}

function deleteDocRow(docTab, id) {
    if (!confirm('Вы действительно хотите удалить этот документ?')) return;
    
    const index = state[docTab].findIndex(x => x.id === id);
    if (index > -1) {
        state[docTab].splice(index, 1);
        saveState();
        showToast('Документ удален!', 'success');
        renderDocTable();
    }
}

// 11. Modal: Create / Edit Document View
function openCreateDocumentModal(docTab) {
    openEditDocumentModal(docTab, null);
}

function openEditDocumentModal(docTab, id) {
    let title = '';
    let body = '';
    let isReadOnly = id ? true : false; // For viewing completed documents in prototype, show as preview
    
    const today = new Date().toISOString().split('T')[0];
    
    if (docTab === 'orders') {
        title = id ? 'Просмотр Заявки на Заказ' : 'Создать Заявку на Заказ';
        const doc = id ? state.orders.find(o => o.id === id) : { date: today, num: 'ЗК-' + Math.floor(100 + Math.random() * 900), counterpartyId: '', contractId: '', currency: 'RUB', items: [] };
        
        const cOption = state.counterparties.map(c => `<option value="${c.id}" ${c.id === doc.counterpartyId ? 'selected' : ''}>${c.name}</option>`).join('');
        
        body = `
            <form id="doc-form">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Дата документа</label>
                        <input type="date" class="form-control" name="date" value="${doc.date}" ${isReadOnly ? 'disabled' : ''} required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Номер заказа</label>
                        <input type="text" class="form-control" name="num" value="${doc.num}" ${isReadOnly ? 'disabled' : ''} required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Клиент (Контрагент)</label>
                        <select class="form-control" name="counterpartyId" id="order-counterparty-select" ${isReadOnly ? 'disabled' : ''} required>
                            <option value="">-- Выберите клиента --</option>
                            ${cOption}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Договор контрагента</label>
                        <select class="form-control" name="contractId" id="order-contract-select" ${isReadOnly ? 'disabled' : ''} required>
                            <option value="">-- Сначала выберите клиента --</option>
                        </select>
                    </div>
                    <div class="form-group" style="max-width: 120px;">
                        <label class="form-label">Валюта</label>
                        <input type="text" class="form-control" name="currency" id="order-currency-input" value="${doc.currency}" readonly>
                    </div>
                </div>
                
                <h4 style="margin: 20px 0 10px 0;">Товары заказа (Готовая продукция / Комплекты)</h4>
                
                <div class="table-wrapper">
                    <table class="table-form" id="order-items-table">
                        <thead>
                            <tr>
                                <th>Номенклатура ГП / КП</th>
                                <th>Характеристика (вручную)</th>
                                <th style="width: 110px;">Кол-во (пар)</th>
                                <th style="width: 110px;">Цена</th>
                                <th style="width: 110px;">Сумма</th>
                                ${!isReadOnly ? '<th style="width: 50px;"></th>' : ''}
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Item lines will load here -->
                        </tbody>
                    </table>
                </div>
                ${!isReadOnly ? `
                    <button type="button" class="btn btn-secondary" id="btn-order-add-line" style="margin-top: 8px;">
                        <i class="ph ph-plus"></i>Добавить строку
                    </button>
                ` : ''}
            </form>
        `;
        
        setTimeout(() => {
            const cpSelect = document.getElementById('order-counterparty-select');
            const conSelect = document.getElementById('order-contract-select');
            const currInput = document.getElementById('order-currency-input');
            const itemsTableBody = document.querySelector('#order-items-table tbody');
            
            // Function to update contract dropdown based on Counterparty
            function updateContracts(cpId, selectConId = null) {
                conSelect.innerHTML = '<option value="">-- Выберите договор --</option>';
                const filtered = state.contracts.filter(c => c.counterpartyId === cpId);
                filtered.forEach(con => {
                    conSelect.innerHTML += `<option value="${con.id}" ${con.id === selectConId ? 'selected' : ''}>${con.num} (${con.currency})</option>`;
                });
                
                if (filtered.length > 0 && !selectConId) {
                    conSelect.value = filtered[0].id;
                    currInput.value = filtered[0].currency;
                }
            }
            
            cpSelect.addEventListener('change', () => {
                updateContracts(cpSelect.value);
            });
            
            conSelect.addEventListener('change', () => {
                const con = state.contracts.find(c => c.id === conSelect.value);
                currInput.value = con ? con.currency : 'RUB';
            });
            
            // Render existing lines
            if (doc.items.length > 0) {
                doc.items.forEach(item => addOrderRow(item));
            } else if (!isReadOnly) {
                addOrderRow();
            }
            
            function addOrderRow(data = null) {
                const tr = document.createElement('tr');
                const products = state.nomenclature.filter(n => n.type === 'ГП' || n.type === 'КП');
                
                tr.innerHTML = `
                    <td>
                        <select class="form-control row-product-select" required ${isReadOnly ? 'disabled' : ''}>
                            <option value="">-- Выберите ГП --</option>
                            ${products.map(p => `<option value="${p.id}" ${data && data.productId === p.id ? 'selected' : ''}>${p.name}</option>`).join('')}
                        </select>
                    </td>
                    <td>
                        <input type="text" class="form-control row-char" value="${data ? data.char : ''}" required placeholder="Цвет, размер, примечание" ${isReadOnly ? 'disabled' : ''}>
                    </td>
                    <td>
                        <input type="number" class="form-control row-qty" value="${data ? data.qty : 100}" min="1" required style="text-align: right;" ${isReadOnly ? 'disabled' : ''}>
                    </td>
                    <td>
                        <input type="number" class="form-control row-price" value="${data ? data.price : 50}" min="0.01" step="0.01" required style="text-align: right;" ${isReadOnly ? 'disabled' : ''}>
                    </td>
                    <td>
                        <input type="text" class="form-control row-sum" value="${data ? data.sum : 5000}" readonly style="text-align: right; background: transparent; border-color: transparent;">
                    </td>
                    ${!isReadOnly ? `
                        <td>
                            <button type="button" class="btn btn-danger btn-icon-only btn-remove-row"><i class="ph ph-trash"></i></button>
                        </td>
                    ` : ''}
                `;
                
                itemsTableBody.appendChild(tr);
                
                // Row recalculations
                const qtyInput = tr.querySelector('.row-qty');
                const priceInput = tr.querySelector('.row-price');
                const sumInput = tr.querySelector('.row-sum');
                
                function recalc() {
                    sumInput.value = (Number(qtyInput.value) * Number(priceInput.value)).toFixed(2);
                }
                
                qtyInput.addEventListener('input', recalc);
                priceInput.addEventListener('input', recalc);
                
                if (!isReadOnly) {
                    tr.querySelector('.btn-remove-row').addEventListener('click', () => {
                        tr.remove();
                    });
                }
            }
            
            if (!isReadOnly) {
                document.getElementById('btn-order-add-line').addEventListener('click', () => addOrderRow());
            }
            
            // Trigger initial contract loading
            if (doc.counterpartyId) {
                updateContracts(doc.counterpartyId, doc.contractId);
            }
            
        }, 100);
    }
    else if (docTab === 'specifications') {
        title = id ? 'Технологическая карта (Разработка)' : 'Новая Технологическая карта';
        const doc = id ? state.specifications.find(s => s.id === id) : { name: '', productId: '', semiProductId: '', machineNum: '', color: '', gender: '', sewingTimeSec: 15, materials: [] };
        
        const gpNomen = state.nomenclature.filter(n => n.type === 'ГП');
        const pfNomen = state.nomenclature.filter(n => n.type === 'ПФ');
        const machines = state.equipment.filter(eq => eq.type.includes('Вязальный'));
        
        body = `
            <form id="doc-form">
                <div class="form-group">
                    <label class="form-label">Название Техкарты / Спецификации</label>
                    <input type="text" class="form-control" name="name" value="${doc.name}" required placeholder="Техкарта на носки Classic Синие" ${isReadOnly ? 'disabled' : ''}>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Готовый продукт (ГП)</label>
                        <select class="form-control" name="productId" required ${isReadOnly ? 'disabled' : ''}>
                            <option value="">-- Выберите ГП --</option>
                            ${gpNomen.map(gp => `<option value="${gp.id}" ${gp.id === doc.productId ? 'selected' : ''}>${gp.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Используемый полуфабрикат (ПФ)</label>
                        <select class="form-control" name="semiProductId" required ${isReadOnly ? 'disabled' : ''}>
                            <option value="">-- Выберите ПФ заготовку --</option>
                            ${pfNomen.map(pf => `<option value="${pf.id}" ${pf.id === doc.semiProductId ? 'selected' : ''}>${pf.name}</option>`).join('')}
                        </select>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Вязальный станок (по умолчанию)</label>
                        <select class="form-control" name="machineNum" required ${isReadOnly ? 'disabled' : ''}>
                            <option value="">-- Выберите станок --</option>
                            ${machines.map(m => `<option value="${m.num}" ${m.num === doc.machineNum ? 'selected' : ''}>${m.num} (${(state.employees.find(e => e.id === m.operatorId) || {}).name?.split(' ')[0]})</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Цвет носков</label>
                        <input type="text" class="form-control" name="color" value="${doc.color}" required placeholder="Красный, Синий..." ${isReadOnly ? 'disabled' : ''}>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Пол</label>
                        <select class="form-control" name="gender" required ${isReadOnly ? 'disabled' : ''}>
                            <option value="Мужской" ${doc.gender === 'Мужской' ? 'selected' : ''}>Мужской</option>
                            <option value="Женский" ${doc.gender === 'Женский' ? 'selected' : ''}>Женский</option>
                            <option value="Детский" ${doc.gender === 'Детский' ? 'selected' : ''}>Детский</option>
                            <option value="Унисекс" ${doc.gender === 'Унисекс' ? 'selected' : ''}>Унисекс</option>
                        </select>
                    </div>
                    <div class="form-group" style="max-width: 140px;">
                        <label class="form-label">Время пошива 1 шт (сек)</label>
                        <input type="number" class="form-control" name="sewingTimeSec" value="${doc.sewingTimeSec}" min="1" required ${isReadOnly ? 'disabled' : ''}>
                    </div>
                </div>
                
                <h4 style="margin: 20px 0 10px 0;">Нормы расхода сырья на пару готовой продукции</h4>
                <div class="table-wrapper">
                    <table class="table-form" id="spec-materials-table">
                        <thead>
                            <tr>
                                <th>Сырьё (Вид: С)</th>
                                <th style="width: 200px;">Норма расхода (кг или шт)</th>
                                ${!isReadOnly ? '<th style="width: 50px;"></th>' : ''}
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Material lines will load here -->
                        </tbody>
                    </table>
                </div>
                ${!isReadOnly ? `
                    <button type="button" class="btn btn-secondary" id="btn-spec-add-line" style="margin-top: 8px;">
                        <i class="ph ph-plus"></i>Добавить расход сырья
                    </button>
                ` : ''}
            </form>
        `;
        
        setTimeout(() => {
            const tableBody = document.querySelector('#spec-materials-table tbody');
            
            if (doc.materials.length > 0) {
                doc.materials.forEach(mat => addMaterialRow(mat));
            } else if (!isReadOnly) {
                addMaterialRow();
            }
            
            function addMaterialRow(data = null) {
                const tr = document.createElement('tr');
                const rawMaterials = state.nomenclature.filter(n => n.type === 'С' || n.type === 'ПФ');
                
                tr.innerHTML = `
                    <td>
                        <select class="form-control row-material-select" required ${isReadOnly ? 'disabled' : ''}>
                            <option value="">-- Выберите сырьё --</option>
                            ${rawMaterials.map(rm => `<option value="${rm.id}" ${data && data.id === rm.id ? 'selected' : ''}>${rm.name}</option>`).join('')}
                        </select>
                    </td>
                    <td>
                        <input type="number" class="form-control row-qty" value="${data ? data.qty : 0.01}" step="0.001" min="0.0001" required style="text-align: right;" ${isReadOnly ? 'disabled' : ''}>
                    </td>
                    ${!isReadOnly ? `
                        <td>
                            <button type="button" class="btn btn-danger btn-icon-only btn-remove-row"><i class="ph ph-trash"></i></button>
                        </td>
                    ` : ''}
                `;
                
                tableBody.appendChild(tr);
                
                if (!isReadOnly) {
                    tr.querySelector('.btn-remove-row').addEventListener('click', () => {
                        tr.remove();
                    });
                }
            }
            
            if (!isReadOnly) {
                document.getElementById('btn-spec-add-line').addEventListener('click', () => addMaterialRow());
            }
        }, 100);
    }
    else if (docTab === 'planning') {
        title = id ? 'Смотреть План Запуска' : 'Новое Планирование & Запуск';
        const doc = id ? state.planning.find(p => p.id === id) : { date: today, orderId: '', items: [] };
        
        body = `
            <form id="doc-form">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Дата планирования</label>
                        <input type="date" class="form-control" name="date" id="plan-date-input" value="${doc.date}" ${isReadOnly ? 'disabled' : ''} required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Заказ клиента</label>
                        <select class="form-control" name="orderId" id="plan-order-select" ${isReadOnly ? 'disabled' : ''} required>
                            <option value="">-- Выберите заказ покупателя --</option>
                            ${state.orders.map(o => `<option value="${o.id}" ${o.id === doc.orderId ? 'selected' : ''}>${o.num} (${(state.counterparties.find(c => c.id === o.counterpartyId) || {}).name})</option>`).join('')}
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
                                <th style="width: 140px;">Объем запуска (пар)</th>
                                <th style="width: 160px;">Плановый номер</th>
                                ${!isReadOnly ? '<th style="width: 50px;"></th>' : ''}
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Plan lines will load here -->
                        </tbody>
                    </table>
                </div>
                ${!isReadOnly ? `
                    <button type="button" class="btn btn-secondary" id="btn-plan-add-line" style="margin-top: 8px;">
                        <i class="ph ph-plus"></i>Добавить распределение
                    </button>
                ` : ''}
            </form>
        `;
        
        setTimeout(() => {
            const orderSelect = document.getElementById('plan-order-select');
            const itemsTableBody = document.querySelector('#plan-items-table tbody');
            const dateInput = document.getElementById('plan-date-input');
            
            orderSelect.addEventListener('change', () => {
                itemsTableBody.innerHTML = '';
                addPlanRow();
            });
            
            if (doc.items.length > 0) {
                doc.items.forEach(item => addPlanRow(item));
            } else if (!isReadOnly) {
                addPlanRow();
            }
            
            function addPlanRow(data = null) {
                const ordId = orderSelect.value;
                if (!ordId) return;
                
                const orderObj = state.orders.find(o => o.id === ordId);
                if (!orderObj) return;
                
                const tr = document.createElement('tr');
                
                // Get products inside the selected order
                const orderedProducts = orderObj.items.map(item => {
                    const prod = state.nomenclature.find(n => n.id === item.productId) || {};
                    return { id: item.productId, name: prod.name, totalQty: item.qty };
                });
                
                tr.innerHTML = `
                    <td>
                        <select class="form-control row-product-select" required ${isReadOnly ? 'disabled' : ''}>
                            <option value="">-- Выберите продукт --</option>
                            ${orderedProducts.map(p => `<option value="${p.id}" ${data && data.productId === p.id ? 'selected' : ''}>${p.name} (Заказ: ${p.totalQty} пар)</option>`).join('')}
                        </select>
                    </td>
                    <td>
                        <select class="form-control row-line-select" required ${isReadOnly ? 'disabled' : ''}>
                            <option value="">-- Выберите линию --</option>
                            ${state.lines.map(l => `<option value="${l.id}" ${data && data.lineId === l.id ? 'selected' : ''}>${l.name}</option>`).join('')}
                        </select>
                    </td>
                    <td>
                        <input type="number" class="form-control row-qty" value="${data ? data.qty : 1000}" min="1" required style="text-align: right;" ${isReadOnly ? 'disabled' : ''}>
                    </td>
                    <td>
                        <input type="text" class="form-control row-plannum" value="${data ? data.planNum : ''}" required readonly style="text-align: center; background: rgba(255,255,255,0.03);">
                    </td>
                    ${!isReadOnly ? `
                        <td>
                            <button type="button" class="btn btn-danger btn-icon-only btn-remove-row"><i class="ph ph-trash"></i></button>
                        </td>
                    ` : ''}
                `;
                
                itemsTableBody.appendChild(tr);
                
                // Logic to auto-generate plan number
                const lineSelect = tr.querySelector('.row-line-select');
                const planNumInput = tr.querySelector('.row-plannum');
                
                function updatePlanNum() {
                    if (isReadOnly) return;
                    
                    const orderNumDigits = orderObj.num.replace(/\D/g, ''); // Digits only, e.g. "551"
                    const lineIndex = state.lines.findIndex(l => l.id === lineSelect.value);
                    const lineNum = lineIndex > -1 ? (lineIndex + 1) : '?';
                    
                    const dateVal = dateInput.value || today;
                    const month = dateVal.split('-')[1] || '06'; // extracts month, e.g. "06"
                    
                    planNumInput.value = `${orderNumDigits}/${lineNum}-${month}`;
                }
                
                lineSelect.addEventListener('change', updatePlanNum);
                dateInput.addEventListener('change', updatePlanNum);
                
                if (!isReadOnly) {
                    tr.querySelector('.btn-remove-row').addEventListener('click', () => {
                        tr.remove();
                    });
                    if (!data) updatePlanNum(); // run initial if new row
                }
            }
            
            if (!isReadOnly) {
                document.getElementById('btn-plan-add-line').addEventListener('click', () => addPlanRow());
            }
            
        }, 100);
    }
    else if (docTab === 'releases') {
        title = id ? 'Документ Выпуска (Вязание)' : 'Оформить Новый Выпуск (Вязание ПФ)';
        const doc = id ? state.releases.find(r => r.id === id) : { date: today, operatorId: '', items: [] };
        
        const operators = state.employees.filter(e => e.role === 'Оператор');
        
        body = `
            <form id="doc-form">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Дата выпуска</label>
                        <input type="date" class="form-control" name="date" value="${doc.date}" ${isReadOnly ? 'disabled' : ''} required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">ФИО Оператора вязания</label>
                        <select class="form-control" name="operatorId" id="release-operator-select" ${isReadOnly ? 'disabled' : ''} required>
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
                                <th style="width: 200px;">Выпуск заготовки (шт, не пар!)</th>
                                ${!isReadOnly ? '<th style="width: 50px;"></th>' : ''}
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Release lines will load here -->
                        </tbody>
                    </table>
                </div>
                ${!isReadOnly ? `
                    <button type="button" class="btn btn-secondary" id="btn-release-add-line" style="margin-top: 8px;">
                        <i class="ph ph-plus"></i>Добавить строку
                    </button>
                ` : ''}
            </form>
        `;
        
        setTimeout(() => {
            const opSelect = document.getElementById('release-operator-select');
            const itemsTableBody = document.querySelector('#release-items-table tbody');
            
            opSelect.addEventListener('change', () => {
                itemsTableBody.innerHTML = '';
                addReleaseRow();
            });
            
            if (doc.items.length > 0) {
                doc.items.forEach(item => addReleaseRow(item));
            } else if (!isReadOnly) {
                addReleaseRow();
            }
            
            function addReleaseRow(data = null) {
                const operatorId = opSelect.value;
                if (!operatorId) return;
                
                const tr = document.createElement('tr');
                
                // Get knitting machines assigned to this operator
                const assignedMachines = state.equipment.filter(eq => eq.type.includes('Вязальный') && eq.operatorId === operatorId);
                
                // Get all active planning numbers
                const activePlans = [];
                state.planning.forEach(pl => {
                    pl.items.forEach(item => {
                        const prod = state.nomenclature.find(n => n.id === item.productId) || {};
                        activePlans.push({ code: item.planNum, desc: `${item.planNum} — ${prod.name} (${item.qty} пар)` });
                    });
                });
                
                tr.innerHTML = `
                    <td>
                        <select class="form-control row-machine-select" required ${isReadOnly ? 'disabled' : ''}>
                            <option value="">-- Выберите станок --</option>
                            ${assignedMachines.map(m => `<option value="${m.num}" ${data && data.machineNum === m.num ? 'selected' : ''}>Станок ${m.num}</option>`).join('')}
                            ${assignedMachines.length === 0 ? '<option value="" disabled>За оператором нет станков!</option>' : ''}
                        </select>
                    </td>
                    <td>
                        <select class="form-control row-plannum-select" required ${isReadOnly ? 'disabled' : ''}>
                            <option value="">-- Выберите плановый номер --</option>
                            ${activePlans.map(ap => `<option value="${ap.code}" ${data && data.planNum === ap.code ? 'selected' : ''}>${ap.desc}</option>`).join('')}
                        </select>
                    </td>
                    <td>
                        <input type="number" class="form-control row-qty" value="${data ? data.qty : 1000}" min="1" required style="text-align: right;" ${isReadOnly ? 'disabled' : ''}>
                    </td>
                    ${!isReadOnly ? `
                        <td>
                            <button type="button" class="btn btn-danger btn-icon-only btn-remove-row"><i class="ph ph-trash"></i></button>
                        </td>
                    ` : ''}
                `;
                
                itemsTableBody.appendChild(tr);
                
                if (!isReadOnly) {
                    tr.querySelector('.btn-remove-row').addEventListener('click', () => {
                        tr.remove();
                    });
                }
            }
            
            if (!isReadOnly) {
                document.getElementById('btn-release-add-line').addEventListener('click', () => addReleaseRow());
            }
        }, 100);
    }
    else if (docTab === 'sewings') {
        title = id ? 'Смотреть Прошив носков' : 'Оформить Новый Прошив (Выпуск ГП)';
        const doc = id ? state.sewings.find(s => s.id === id) : { date: today, lineId: '', items: [] };
        
        body = `
            <form id="doc-form">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Дата прошива</label>
                        <input type="date" class="form-control" name="date" value="${doc.date}" ${isReadOnly ? 'disabled' : ''} required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Производственная линия</label>
                        <select class="form-control" name="lineId" id="sew-line-select" ${isReadOnly ? 'disabled' : ''} required>
                            <option value="">-- Выберите линию прошива --</option>
                            ${state.lines.map(l => `<option value="${l.id}" ${l.id === doc.lineId ? 'selected' : ''}>${l.name} (${(state.employees.find(e => e.id === l.foremanId) || {}).name})</option>`).join('')}
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
                                <th style="width: 200px;">Прошито (пар готовой продукции)</th>
                                ${!isReadOnly ? '<th style="width: 50px;"></th>' : ''}
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Sewing lines will load here -->
                        </tbody>
                    </table>
                </div>
                ${!isReadOnly ? `
                    <button type="button" class="btn btn-secondary" id="btn-sew-add-line" style="margin-top: 8px;">
                        <i class="ph ph-plus"></i>Добавить строку
                    </button>
                ` : ''}
            </form>
        `;
        
        setTimeout(() => {
            const lineSelect = document.getElementById('sew-line-select');
            const itemsTableBody = document.querySelector('#sew-items-table tbody');
            
            lineSelect.addEventListener('change', () => {
                itemsTableBody.innerHTML = '';
                addSewRow();
            });
            
            if (doc.items.length > 0) {
                doc.items.forEach(item => addSewRow(item));
            } else if (!isReadOnly) {
                addSewRow();
            }
            
            function addSewRow(data = null) {
                const lineId = lineSelect.value;
                if (!lineId) return;
                
                const tr = document.createElement('tr');
                
                // Seamstresses
                const seamstresses = state.employees.filter(e => e.role === 'Швея');
                
                // Get all active plans
                const activePlans = [];
                state.planning.forEach(pl => {
                    pl.items.forEach(item => {
                        if (item.lineId === lineId) {
                            const prod = state.nomenclature.find(n => n.id === item.productId) || {};
                            activePlans.push({ code: item.planNum, desc: `${item.planNum} — ${prod.name} (${item.qty} пар)` });
                        }
                    });
                });
                
                tr.innerHTML = `
                    <td>
                        <select class="form-control row-seamstress-select" required ${isReadOnly ? 'disabled' : ''}>
                            <option value="">-- Выберите швею --</option>
                            ${seamstresses.map(s => `<option value="${s.id}" ${data && data.seamstressId === s.id ? 'selected' : ''}>${s.name}</option>`).join('')}
                        </select>
                    </td>
                    <td>
                        <select class="form-control row-plannum-select" required ${isReadOnly ? 'disabled' : ''}>
                            <option value="">-- Выберите плановый номер --</option>
                            ${activePlans.map(ap => `<option value="${ap.code}" ${data && data.planNum === ap.code ? 'selected' : ''}>${ap.desc}</option>`).join('')}
                            ${activePlans.length === 0 ? '<option value="" disabled>На этой линии нет запущенных планов!</option>' : ''}
                        </select>
                    </td>
                    <td>
                        <input type="number" class="form-control row-qty" value="${data ? data.qty : 500}" min="1" required style="text-align: right;" ${isReadOnly ? 'disabled' : ''}>
                    </td>
                    ${!isReadOnly ? `
                        <td>
                            <button type="button" class="btn btn-danger btn-icon-only btn-remove-row"><i class="ph ph-trash"></i></button>
                        </td>
                    ` : ''}
                `;
                
                itemsTableBody.appendChild(tr);
                
                if (!isReadOnly) {
                    tr.querySelector('.btn-remove-row').addEventListener('click', () => {
                        tr.remove();
                    });
                }
            }
            
            if (!isReadOnly) {
                document.getElementById('btn-sew-add-line').addEventListener('click', () => addPlanRowOrLine(true));
            }
            
            function addPlanRowOrLine(btnTriggered = false) {
                addSewRow();
            }
        }, 100);
    }
    else if (docTab === 'packagings') {
        title = id ? 'Смотреть Упаковку продукции' : 'Оформить Новую Упаковку';
        const doc = id ? state.packagings.find(p => p.id === id) : { date: today, operatorName: 'Смирнов Николай Иванович', items: [] };
        
        body = `
            <form id="doc-form">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Дата упаковки</label>
                        <input type="date" class="form-control" name="date" value="${doc.date}" ${isReadOnly ? 'disabled' : ''} required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Оператор принятия упаковки</label>
                        <input type="text" class="form-control" name="operatorName" value="${doc.operatorName}" ${isReadOnly ? 'disabled' : ''} required>
                    </div>
                </div>
                
                <h4 style="margin: 20px 0 10px 0;">Упаковано по плановым номерам</h4>
                
                <div class="table-wrapper">
                    <table class="table-form" id="pack-items-table">
                        <thead>
                            <tr>
                                <th>Плановый номер (готовая продукция)</th>
                                <th style="width: 240px;">Упаковано готовых носков (пар)</th>
                                ${!isReadOnly ? '<th style="width: 50px;"></th>' : ''}
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Packaging lines will load here -->
                        </tbody>
                    </table>
                </div>
                ${!isReadOnly ? `
                    <button type="button" class="btn btn-secondary" id="btn-pack-add-line" style="margin-top: 8px;">
                        <i class="ph ph-plus"></i>Добавить строку
                    </button>
                ` : ''}
            </form>
        `;
        
        setTimeout(() => {
            const itemsTableBody = document.querySelector('#pack-items-table tbody');
            
            if (doc.items.length > 0) {
                doc.items.forEach(item => addPackRow(item));
            } else if (!isReadOnly) {
                addPackRow();
            }
            
            function addPackRow(data = null) {
                const tr = document.createElement('tr');
                
                // Get all active plans
                const activePlans = [];
                state.planning.forEach(pl => {
                    pl.items.forEach(item => {
                        const prod = state.nomenclature.find(n => n.id === item.productId) || {};
                        activePlans.push({ code: item.planNum, desc: `${item.planNum} — ${prod.name} (${item.qty} пар)` });
                    });
                });
                
                tr.innerHTML = `
                    <td>
                        <select class="form-control row-plannum-select" required ${isReadOnly ? 'disabled' : ''}>
                            <option value="">-- Выберите плановый номер --</option>
                            ${activePlans.map(ap => `<option value="${ap.code}" ${data && data.planNum === ap.code ? 'selected' : ''}>${ap.desc}</option>`).join('')}
                        </select>
                    </td>
                    <td>
                        <input type="number" class="form-control row-qty" value="${data ? data.qty : 500}" min="1" required style="text-align: right;" ${isReadOnly ? 'disabled' : ''}>
                    </td>
                    ${!isReadOnly ? `
                        <td>
                            <button type="button" class="btn btn-danger btn-icon-only btn-remove-row"><i class="ph ph-trash"></i></button>
                        </td>
                    ` : ''}
                `;
                
                itemsTableBody.appendChild(tr);
                
                if (!isReadOnly) {
                    tr.querySelector('.btn-remove-row').addEventListener('click', () => {
                        tr.remove();
                    });
                }
            }
            
            if (!isReadOnly) {
                document.getElementById('btn-pack-add-line').addEventListener('click', () => addPackRow());
            }
        }, 100);
    }
    
    // Renders the Modal Action Buttons (Save/Close)
    const footer = isReadOnly ? `
        <button class="btn btn-secondary" onclick="closeModal()">Закрыть</button>
    ` : `
        <button class="btn btn-secondary" onclick="closeModal()">Отмена</button>
        <button class="btn btn-primary" id="btn-modal-doc-save">Провести документ</button>
    `;
    
    openModal(title, body, footer);
    
    if (!isReadOnly) {
        document.getElementById('btn-modal-doc-save').addEventListener('click', () => {
            const form = document.getElementById('doc-form');
            if (!form.reportValidity()) return;
            
            const fd = new FormData(form);
            
            if (docTab === 'orders') {
                const trs = document.querySelectorAll('#order-items-table tbody tr');
                const items = [];
                
                trs.forEach((tr, i) => {
                    items.push({
                        id: 'item_' + i + '_' + Date.now(),
                        productId: tr.querySelector('.row-product-select').value,
                        char: tr.querySelector('.row-char').value,
                        qty: Number(tr.querySelector('.row-qty').value),
                        price: Number(tr.querySelector('.row-price').value),
                        sum: Number(tr.querySelector('.row-sum').value)
                    });
                });
                
                if (items.length === 0) {
                    alert('Нельзя провести пустой заказ! Добавьте хотя бы одну строку товара.');
                    return;
                }
                
                state.orders.push({
                    id: 'ord_' + Date.now(),
                    date: fd.get('date'),
                    num: fd.get('num'),
                    counterpartyId: fd.get('counterpartyId'),
                    contractId: fd.get('contractId'),
                    currency: fd.get('currency'),
                    items
                });
            }
            else if (docTab === 'specifications') {
                const trs = document.querySelectorAll('#spec-materials-table tbody tr');
                const materials = [];
                
                trs.forEach(tr => {
                    materials.push({
                        id: tr.querySelector('.row-material-select').value,
                        qty: Number(tr.querySelector('.row-qty').value)
                    });
                });
                
                state.specifications.push({
                    id: 'spec_' + Date.now(),
                    name: fd.get('name'),
                    productId: fd.get('productId'),
                    semiProductId: fd.get('semiProductId'),
                    machineNum: fd.get('machineNum'),
                    color: fd.get('color'),
                    gender: fd.get('gender'),
                    sewingTimeSec: Number(fd.get('sewingTimeSec')),
                    materials
                });
            }
            else if (docTab === 'planning') {
                const trs = document.querySelectorAll('#plan-items-table tbody tr');
                const items = [];
                
                trs.forEach(tr => {
                    items.push({
                        productId: tr.querySelector('.row-product-select').value,
                        lineId: tr.querySelector('.row-line-select').value,
                        qty: Number(tr.querySelector('.row-qty').value),
                        planNum: tr.querySelector('.row-plannum').value
                    });
                });
                
                if (items.length === 0) {
                    alert('Ошибка: Вы не добавили распределение по производственным линиям.');
                    return;
                }
                
                state.planning.push({
                    id: 'p_' + Date.now(),
                    date: fd.get('date'),
                    orderId: fd.get('orderId'),
                    items
                });
            }
            else if (docTab === 'releases') {
                const trs = document.querySelectorAll('#release-items-table tbody tr');
                const items = [];
                
                trs.forEach(tr => {
                    items.push({
                        machineNum: tr.querySelector('.row-machine-select').value,
                        planNum: tr.querySelector('.row-plannum-select').value,
                        qty: Number(tr.querySelector('.row-qty').value)
                    });
                });
                
                if (items.length === 0) {
                    alert('Ошибка: Добавьте строки выпуска по вязальным станкам.');
                    return;
                }
                
                state.releases.push({
                    id: 'rel_' + Date.now(),
                    date: fd.get('date'),
                    operatorId: fd.get('operatorId'),
                    items
                });
            }
            else if (docTab === 'sewings') {
                const trs = document.querySelectorAll('#sew-items-table tbody tr');
                const items = [];
                
                trs.forEach(tr => {
                    items.push({
                        seamstressId: tr.querySelector('.row-seamstress-select').value,
                        planNum: tr.querySelector('.row-plannum-select').value,
                        qty: Number(tr.querySelector('.row-qty').value)
                    });
                });
                
                if (items.length === 0) {
                    alert('Ошибка: Заполните выработку швей.');
                    return;
                }
                
                state.sewings.push({
                    id: 'sew_' + Date.now(),
                    date: fd.get('date'),
                    lineId: fd.get('lineId'),
                    items
                });
            }
            else if (docTab === 'packagings') {
                const trs = document.querySelectorAll('#pack-items-table tbody tr');
                const items = [];
                
                trs.forEach(tr => {
                    items.push({
                        planNum: tr.querySelector('.row-plannum-select').value,
                        qty: Number(tr.querySelector('.row-qty').value)
                    });
                });
                
                if (items.length === 0) {
                    alert('Ошибка: Заполните хотя бы одну строчку упакованного товара.');
                    return;
                }
                
                state.packagings.push({
                    id: 'pack_' + Date.now(),
                    date: fd.get('date'),
                    operatorName: fd.get('operatorName'),
                    items
                });
            }
            
            saveState();
            closeModal();
            showToast('Документ успешно проведён!', 'success');
            renderDocTable();
        });
    }
}

// 12. View: Reports (Order Stage Tracking)
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

// 13. Application Startup Initializer
window.addEventListener('DOMContentLoaded', () => {
    loadState();
    updateBrandName();
    renderCurrentTab();
});

// 14. Settings View & Helpers
function renderSettings(viewport) {
    viewport.innerHTML = `
        <div class="card" style="max-width: 600px; margin: 20px auto;">
            <h2 class="section-title" style="margin-bottom: 24px;">
                <i class="ph ph-sliders text-primary"></i>
                <span>Учётная политика предприятия</span>
            </h2>
            <form id="settings-form">
                <div class="form-group">
                    <label class="form-label">Название организации / Фабрики</label>
                    <input type="text" class="form-control" name="companyName" value="${state.settings.companyName || ''}" required placeholder="Например: ООО 'СоксПром'">
                </div>
                <div class="form-group">
                    <label class="form-label">Учётная валюта</label>
                    <select class="form-control" name="accountingCurrency" required>
                        <option value="RUB" ${state.settings.accountingCurrency === 'RUB' ? 'selected' : ''}>RUB (Российский рубль)</option>
                        <option value="USD" ${state.settings.accountingCurrency === 'USD' ? 'selected' : ''}>USD (Доллар США)</option>
                        <option value="EUR" ${state.settings.accountingCurrency === 'EUR' ? 'selected' : ''}>EUR (Евро)</option>
                        <option value="CNY" ${state.settings.accountingCurrency === 'CNY' ? 'selected' : ''}>CNY (Китайский юань)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Маска / Формат телефонных номеров контрагентов</label>
                    <select class="form-control" name="phoneFormat" required>
                        <option value="+7 (XXX) XXX-XX-XX" ${state.settings.phoneFormat === '+7 (XXX) XXX-XX-XX' ? 'selected' : ''}>+7 (XXX) XXX-XX-XX (РФ / Казахстан)</option>
                        <option value="8 (XXX) XXX-XX-XX" ${state.settings.phoneFormat === '8 (XXX) XXX-XX-XX' ? 'selected' : ''}>8 (XXX) XXX-XX-XX (Региональный РФ)</option>
                        <option value="+375 (XX) XXX-XX-XX" ${state.settings.phoneFormat === '+375 (XX) XXX-XX-XX' ? 'selected' : ''}>+375 (XX) XXX-XX-XX (Беларусь)</option>
                        <option value="XXX-XXX-XX" ${state.settings.phoneFormat === 'XXX-XXX-XX' ? 'selected' : ''}>XXX-XXX-XX (Короткий городской)</option>
                        <option value="XXXXXXX" ${state.settings.phoneFormat === 'XXXXXXX' ? 'selected' : ''}>Без ограничений (Свободный ввод)</option>
                    </select>
                </div>
                <div style="margin-top: 24px; display: flex; justify-content: flex-end;">
                    <button type="submit" class="btn btn-primary">Сохранить учётную политику</button>
                </div>
            </form>
        </div>
    `;

    document.getElementById('settings-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        
        state.settings.companyName = fd.get('companyName');
        state.settings.accountingCurrency = fd.get('accountingCurrency');
        state.settings.phoneFormat = fd.get('phoneFormat');
        
        saveState();
        showToast('Учётная политика успешно сохранена!', 'success');
        updateBrandName();
        renderCurrentTab();
    });
}

function updateBrandName() {
    const roleSpan = document.querySelector('.role');
    if (state.settings && roleSpan) {
        roleSpan.textContent = state.settings.companyName || 'Администратор смены';
    }
}

function applyPhoneMask(input) {
    const mask = state.settings?.phoneFormat || '+7 (XXX) XXX-XX-XX';
    if (mask === 'XXXXXXX') {
        input.placeholder = 'Номер телефона';
        return;
    }
    
    input.placeholder = mask;
    
    input.addEventListener('input', () => {
        let value = input.value.replace(/\D/g, ''); // digits only
        
        const maskDigits = mask.split('X')[0].replace(/\D/g, ''); // e.g. "7" or "375"
        if (maskDigits.length > 0 && value.startsWith(maskDigits)) {
            value = value.substring(maskDigits.length);
        } else if (maskDigits.length > 0 && maskDigits === '7' && value.startsWith('8')) {
            value = value.substring(1);
        }
        
        let formatted = '';
        let digitIdx = 0;
        
        for (let i = 0; i < mask.length; i++) {
            if (mask[i] === 'X') {
                if (digitIdx < value.length) {
                    formatted += value[digitIdx++];
                } else {
                    break;
                }
            } else {
                if (digitIdx < value.length) {
                    formatted += mask[i];
                }
            }
        }
        input.value = formatted;
    });
}
