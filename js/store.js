// js/store.js

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
        { id: 'n_6', code: 'ГП-СП-БЕЛ', name: 'Носки спортивные Sport White', type: 'ГП' },
        { id: 'n_7', code: 'ГП-КЛ-ЧЕР', name: 'Носки мужские Classic Black', type: 'ГП' },
        { id: 'n_8', code: 'ГП-СП-КР', name: 'Носки спортивные Sport Red', type: 'ГП' },
        { id: 'n_9', code: 'ГП-ЖЕН-РОЗ', name: 'Носки женские Cozy Pink', type: 'ГП' },
        { id: 'n_10', code: 'ГП-ДЕТ-ЖЕЛ', name: 'Носки детские Funny Yellow', type: 'ГП' },
        { id: 'n_11', code: 'ПФ-ЖЕН-ВЗ', name: 'Заготовка женского носка (ПФ)', type: 'ПФ' },
        { id: 'n_12', code: 'ПФ-ДЕТ-ВЗ', name: 'Заготовка детского носка (ПФ)', type: 'ПФ' }
    ],
    counterparties: [
        { id: 'c_1', name: 'ООО "Модный Носок"', phone: '+996 (777) 12-34-56' },
        { id: 'c_2', name: 'ИП "Носочный Рай"', phone: '+996 (555) 98-76-54' },
        { id: 'c_3', name: 'ООО "Текстиль Опт"', phone: '+996 (312) 44-55-66' },
        { id: 'c_4', name: 'ОсОО "Чуй-Носки"', phone: '+996 (500) 11-22-33' },
        { id: 'c_5', name: 'АО "Бишкек-Трейд"', phone: '+996 (700) 99-88-77' }
    ],
    contracts: [
        { id: 'con_1', num: 'ДОГ-МН-2026', counterpartyId: 'c_1', currency: 'KGS' },
        { id: 'con_2', num: 'ДОГ-НР-EXP', counterpartyId: 'c_2', currency: 'USD' },
        { id: 'con_3', num: 'ДОГ-МН-ДОП', counterpartyId: 'c_1', currency: 'KGS' },
        { id: 'con_4', num: 'ДОГ-ТО-RUB', counterpartyId: 'c_3', currency: 'RUB' },
        { id: 'con_5', num: 'ДОГ-ЧН-KGS', counterpartyId: 'c_4', currency: 'KGS' },
        { id: 'con_6', num: 'ДОГ-БТ-EUR', counterpartyId: 'c_5', currency: 'EUR' }
    ],
    employees: [
        { id: 'e_1', name: 'Смирнов Николай Иванович', role: 'Бригадир' },
        { id: 'e_2', name: 'Козлов Иван Петрович', role: 'Оператор' },
        { id: 'e_3', name: 'Попова Анна Сергеевна', role: 'Оператор' },
        { id: 'e_4', name: 'Дмитриева Мария Васильевна', role: 'Швея' },
        { id: 'e_5', name: 'Григорьева Ольга Николаевна', role: 'Швея' },
        { id: 'e_6', name: 'Соколов Дмитрий Андреевич', role: 'Конструктор' },
        { id: 'e_7', name: 'Мельник Павел Петрович', role: 'Механик' },
        { id: 'e_8', name: 'Никифоров Петр Сергеевич', role: 'Бригадир' },
        { id: 'e_9', name: 'Алексеев Владимир Ильич', role: 'Оператор' },
        { id: 'e_10', name: 'Степанов Илья Михайлович', role: 'Оператор' },
        { id: 'e_11', name: 'Осипова Екатерина Львовна', role: 'Швея' },
        { id: 'e_12', name: 'Васильева Елена Павловна', role: 'Швея' },
        { id: 'e_13', name: 'Иванов Сергей Васильевич', role: 'Упаковщик' }
    ],
    equipment: [
        { id: 'eq_1', type: 'Вязальный станок', num: 'ВЗ-01', operatorId: 'e_2' },
        { id: 'eq_2', type: 'Вязальный станок', num: 'ВЗ-02', operatorId: 'e_2' },
        { id: 'eq_3', type: 'Вязальный станок', num: 'ВЗ-03', operatorId: 'e_2' },
        { id: 'eq_4', type: 'Вязальный станок', num: 'ВЗ-04', operatorId: 'e_3' },
        { id: 'eq_5', type: 'Вязальный станок', num: 'ВЗ-05', operatorId: 'e_3' },
        { id: 'eq_6', type: 'Швейная машина', num: 'ШВ-01', seamstressId: 'e_4' },
        { id: 'eq_7', type: 'Швейная машина', num: 'ШВ-02', seamstressId: 'e_5' },
        { id: 'eq_8', type: 'Вязальный станок', num: 'ВЗ-06', operatorId: 'e_9' },
        { id: 'eq_9', type: 'Вязальный станок', num: 'ВЗ-07', operatorId: 'e_9' },
        { id: 'eq_10', type: 'Вязальный станок', num: 'ВЗ-08', operatorId: 'e_10' },
        { id: 'eq_11', type: 'Швейная машина', num: 'ШВ-03', seamstressId: 'e_11' },
        { id: 'eq_12', type: 'Швейная машина', num: 'ШВ-04', seamstressId: 'e_12' }
    ],
    lines: [
        { id: 'l_1', name: 'Вязальная линия А', foremanId: 'e_1', operatorIds: ['e_2', 'e_3'] },
        { id: 'l_2', name: 'Вязальная линия Б', foremanId: 'e_8', operatorIds: ['e_9', 'e_10'] }
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
            currency: 'KGS',
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
                { machineNum: 'ВЗ-01', planNum: '551/1-06', qty: 4000 },
                { machineNum: 'ВЗ-02', planNum: '551/2-06', qty: 1000 }
            ]
        },
        {
            id: 'rel_2',
            date: '2026-06-22',
            operatorId: 'e_3',
            items: [
                { machineNum: 'ВЗ-04', planNum: '551/3-06', qty: 3000 }
            ]
        }
    ],
    sewings: [
        {
            id: 'sew_1',
            date: '2026-06-22',
            lineId: 'l_1',
            items: [
                { seamstressId: 'e_4', planNum: '551/1-06', qty: 1500 },
                { seamstressId: 'e_4', planNum: '551/2-06', qty: 300 },
                { seamstressId: 'e_5', planNum: '551/3-06', qty: 1000 }
            ]
        }
    ],
    packagings: [
        {
            id: 'pack_1',
            date: '2026-06-22',
            operatorName: 'Смирнов Николай Иванович',
            items: [
                { planNum: '551/1-06', qty: 1200, grade: '1-й сорт' },
                { planNum: '551/2-06', qty: 200, grade: '2-й сорт' },
                { planNum: '551/3-06', qty: 800, grade: '1-й сорт' }
            ]
        }
    ],
    rates: [
        { id: 'rate_1', date: '2026-06-20', currency: 'USD', rate: 87.45 },
        { id: 'rate_2', date: '2026-06-20', currency: 'EUR', rate: 93.80 },
        { id: 'rate_3', date: '2026-06-20', currency: 'RUB', rate: 0.98 },
        { id: 'rate_4', date: '2026-06-20', currency: 'KZT', rate: 0.19 },
        { id: 'rate_5', date: '2026-06-20', currency: 'CNY', rate: 12.05 }
    ],
    realizations: [],
    pmp: [],
    settings: {
        companyName: 'LuckySocks',
        accountingCurrency: 'KGS',
        phoneFormat: '+996 (XXX) XX-XX-XX',
        useDecimals: false,
        decimalPlaces: 2
    }
};

let state = {};

function loadState() {
    const saved = localStorage.getItem('socks_production_state');
    if (saved) {
        try {
            state = JSON.parse(saved);
            if (!state.settings) {
                state.settings = JSON.parse(JSON.stringify(DEFAULT_STATE.settings));
            }
            if (state.settings.useDecimals === undefined) {
                state.settings.useDecimals = true;
            }
            if (state.settings.decimalPlaces === undefined) {
                state.settings.decimalPlaces = 2;
            }
            if (!state.rates) {
                state.rates = JSON.parse(JSON.stringify(DEFAULT_STATE.rates));
            }
            if (!state.realizations) {
                state.realizations = [];
            }
            if (!state.pmp) {
                state.pmp = [];
            }
        } catch (e) {
            console.error("Ошибка парсинга LocalStorage. Загрузка демо-данных.", e);
            resetState(false);
        }
    } else {
        resetState(false);
    }
}

function saveState() {
    localStorage.setItem('socks_production_state', JSON.stringify(state));
}

function resetState(shouldReload = true) {
    state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    saveState();
    if (shouldReload) {
        window.location.reload();
    }
}

window.getExchangeRate = function(currency, date) {
    if (currency === 'KGS') return 1.0;
    if (!state.rates || state.rates.length === 0) return 1.0;
    
    // Filter rates for this currency
    const currencyRates = state.rates.filter(r => r.currency === currency);
    if (currencyRates.length === 0) return 1.0;
    
    // Sort by date descending
    const sorted = [...currencyRates].sort((a, b) => b.date.localeCompare(a.date));
    
    // Find exact match or the latest rate preceding/on the given date
    const rateObj = sorted.find(r => r.date <= date) || sorted[sorted.length - 1];
    return rateObj ? Number(rateObj.rate) : 1.0;
};

window.convertToAccounting = function(amount, fromCurrency, date) {
    const accCurrency = (state.settings && state.settings.accountingCurrency) || 'KGS';
    if (fromCurrency === accCurrency) return amount;
    
    const rateFrom = window.getExchangeRate(fromCurrency, date);
    const rateTo = window.getExchangeRate(accCurrency, date);
    
    if (rateTo === 0) return 0;
    return amount * (rateFrom / rateTo);
};

window.getPlannedQtyForPlan = function(planNum) {
    let plannedQtyPairs = 0;
    if (!state.planning) return 0;
    state.planning.forEach(pl => {
        pl.items.forEach(pi => {
            if (pi.planNum === planNum) {
                plannedQtyPairs += Number(pi.qty) || 0;
            }
        });
    });
    return plannedQtyPairs;
};

window.getKnittedQtyForPlan = function(planNum, excludeDocId = null) {
    let knittedQtyPcs = 0;
    if (!state.releases) return 0;
    state.releases.forEach(rel => {
        if (rel.id !== excludeDocId) {
            rel.items.forEach(ri => {
                if (ri.planNum === planNum) {
                    knittedQtyPcs += Number(ri.qty) || 0;
                }
            });
        }
    });
    return knittedQtyPcs;
};

window.getSewnQtyForPlan = function(planNum, excludeDocId = null) {
    let sewnQtyPairs = 0;
    if (!state.sewings) return 0;
    state.sewings.forEach(sew => {
        if (sew.id !== excludeDocId) {
            sew.items.forEach(si => {
                if (si.planNum === planNum) {
                    sewnQtyPairs += Number(si.qty) || 0;
                }
            });
        }
    });
    return sewnQtyPairs;
};

window.getPackagedQtyForPlan = function(planNum, excludeDocId = null) {
    let packagedQtyPairs = 0;
    if (!state.packagings) return 0;
    state.packagings.forEach(pack => {
        if (pack.id !== excludeDocId) {
            pack.items.forEach(pi => {
                if (pi.planNum === planNum) {
                    packagedQtyPairs += Number(pi.qty) || 0;
                }
            });
        }
    });
    return packagedQtyPairs;
};

window.getProductIdForPlan = function(planNum) {
    if (!state.planning) return null;
    for (const pl of state.planning) {
        for (const pi of pl.items) {
            if (pi.planNum === planNum) {
                return pi.productId;
            }
        }
    }
    return null;
};

window.getPackagedQtyForProduct = function(productId, excludeDocId = null) {
    let total = 0;
    if (!state.packagings) return 0;
    state.packagings.forEach(pack => {
        if (pack.id !== excludeDocId) {
            pack.items.forEach(pi => {
                const prodId = window.getProductIdForPlan(pi.planNum);
                if (prodId === productId) {
                    total += Number(pi.qty) || 0;
                }
            });
        }
    });
    return total;
};

window.getRealizedQtyForProduct = function(productId, excludeDocId = null) {
    let total = 0;
    if (!state.realizations) return 0;
    state.realizations.forEach(real => {
        if (real.id !== excludeDocId) {
            real.items.forEach(ri => {
                if (ri.productId === productId) {
                    total += Number(ri.qty) || 0;
                }
            });
        }
    });
    return total;
};

window.getAvailableStockForProduct = function(productId, excludeDocId = null) {
    const packaged = window.getPackagedQtyForProduct(productId);
    const realized = window.getRealizedQtyForProduct(productId, excludeDocId);
    return Math.max(0, packaged - realized);
};
