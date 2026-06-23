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
        { id: 'n_6', code: 'ГП-СП-БЕЛ', name: 'Носки спортивные Sport White', type: 'ГП' }
    ],
    counterparties: [
        { id: 'c_1', name: 'ООО "Модный Носок"', phone: '+996 (777) 12-34-56' },
        { id: 'c_2', name: 'ИП "Носочный Рай"', phone: '+996 (555) 98-76-54' }
    ],
    contracts: [
        { id: 'con_1', num: 'ДОГ-МН-2026', counterpartyId: 'c_1', currency: 'KGS' },
        { id: 'con_2', num: 'ДОГ-НР-EXP', counterpartyId: 'c_2', currency: 'USD' },
        { id: 'con_3', num: 'ДОГ-МН-ДОП', counterpartyId: 'c_1', currency: 'KGS' }
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
                { planNum: '551/1-06', qty: 1200 },
                { planNum: '551/2-06', qty: 200 },
                { planNum: '551/3-06', qty: 800 }
            ]
        }
    ],
    settings: {
        companyName: 'Socks.Pro Производство',
        accountingCurrency: 'KGS',
        phoneFormat: '+996 (XXX) XX-XX-XX',
        useDecimals: true,
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
