// js/modules/about.js

window.renderAboutApp = function(container) {
    container.innerHTML = `
        <div class="about-container fade-in">
            <!-- Hero Promo Section -->
            <div class="about-hero" style="background: linear-gradient(135deg, rgba(79, 70, 229, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 30px; margin-bottom: 30px; position: relative; overflow: hidden;">
                <div style="max-width: 700px; position: relative; z-index: 2;">
                    <span class="badge badge-success" style="font-size: 11px; padding: 4px 8px; margin-bottom: 12px; letter-spacing: 0.5px;">ПРЕЗЕНТАЦИЯ СИСТЕМЫ</span>
                    <h2 style="font-size: 28px; line-height: 1.2; margin-bottom: 10px; font-family: var(--font-heading);">
                        Управляйте трикотажной фабрикой на основе данных с <span style="color: var(--primary-hover); text-shadow: 0 0 10px rgba(99, 102, 241, 0.3);">SOCKS.PRO</span>
                    </h2>
                    <p class="text-secondary" style="font-size: 14px; line-height: 1.6; margin-bottom: 0;">
                        Инновационное решение для оцифровки всех этапов носочного производства. Система контролирует движение сырья, пресекает ошибки персонала на оборудовании, рассчитывает точную себестоимость и окупаемость в режиме реального времени.
                    </p>
                </div>
                <i class="ph ph-sketch-logo" style="position: absolute; right: -40px; bottom: -40px; font-size: 260px; color: rgba(79, 70, 229, 0.05); pointer-events: none; z-index: 1;"></i>
            </div>

            <div style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 30px; margin-bottom: 30px;">
                <!-- Left: Interactive Factory Flow Simulator -->
                <div class="card" style="padding: 24px;">
                    <h3 style="font-size: 16px; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
                        <i class="ph ph-factory text-primary"></i>
                        <span>Интерактивный симулятор производства</span>
                    </h3>
                    <p class="text-secondary" style="font-size: 12px; margin-bottom: 20px;">
                        Нажмите на любой этап ниже, чтобы увидеть, как SOCKS.PRO берет его под жесткий автоматический контроль.
                    </p>
                    
                    <!-- Steps Grid Links -->
                    <div class="flow-steps-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px;">
                        <div class="flow-step-card active" data-step="1" style="cursor: pointer; padding: 12px; border: 1px solid var(--primary); background: var(--primary-glow); border-radius: var(--radius-md); text-align: center; transition: all var(--transition-fast);">
                            <i class="ph ph-shopping-cart" style="font-size: 24px; color: var(--primary-hover); display: block; margin: 0 auto 6px;"></i>
                            <strong style="font-size: 12px; display: block; color: var(--text-primary);">1. Заказ клиента</strong>
                            <span style="font-size: 10px; color: var(--text-secondary);">Ввод & Валюты</span>
                        </div>
                        <div class="flow-step-card" data-step="2" style="cursor: pointer; padding: 12px; border: 1px solid var(--border-color); background: rgba(255,255,255,0.01); border-radius: var(--radius-md); text-align: center; transition: all var(--transition-fast);">
                            <i class="ph ph-calendar" style="font-size: 24px; color: var(--info); display: block; margin: 0 auto 6px;"></i>
                            <strong style="font-size: 12px; display: block; color: var(--text-primary);">2. Планирование</strong>
                            <span style="font-size: 10px; color: var(--text-secondary);">Очередь & Линии</span>
                        </div>
                        <div class="flow-step-card" data-step="3" style="cursor: pointer; padding: 12px; border: 1px solid var(--border-color); background: rgba(255,255,255,0.01); border-radius: var(--radius-md); text-align: center; transition: all var(--transition-fast);">
                            <i class="ph ph-needle" style="font-size: 24px; color: var(--info); display: block; margin: 0 auto 6px;"></i>
                            <strong style="font-size: 12px; display: block; color: var(--text-primary);">3. Вязальный</strong>
                            <span style="font-size: 10px; color: var(--text-secondary);">Станки & Операторы</span>
                        </div>
                        <div class="flow-step-card" data-step="4" style="cursor: pointer; padding: 12px; border: 1px solid var(--border-color); background: rgba(255,255,255,0.01); border-radius: var(--radius-md); text-align: center; transition: all var(--transition-fast);">
                            <i class="ph ph-scissors" style="font-size: 24px; color: var(--primary-hover); display: block; margin: 0 auto 6px;"></i>
                            <strong style="font-size: 12px; display: block; color: var(--text-primary);">4. Прошив</strong>
                            <span style="font-size: 10px; color: var(--text-secondary);">Выработка швей</span>
                        </div>
                        <div class="flow-step-card" data-step="5" style="cursor: pointer; padding: 12px; border: 1px solid var(--border-color); background: rgba(255,255,255,0.01); border-radius: var(--radius-md); text-align: center; transition: all var(--transition-fast);">
                            <i class="ph ph-package" style="font-size: 24px; color: var(--success); display: block; margin: 0 auto 6px;"></i>
                            <strong style="font-size: 12px; display: block; color: var(--text-primary);">5. Упаковка</strong>
                            <span style="font-size: 10px; color: var(--text-secondary);">Качество & Сорта</span>
                        </div>
                        <div class="flow-step-card" data-step="6" style="cursor: pointer; padding: 12px; border: 1px solid var(--border-color); background: rgba(255,255,255,0.01); border-radius: var(--radius-md); text-align: center; transition: all var(--transition-fast);">
                            <i class="ph ph-truck" style="font-size: 24px; color: var(--success); display: block; margin: 0 auto 6px;"></i>
                            <strong style="font-size: 12px; display: block; color: var(--text-primary);">6. Реализация</strong>
                            <span style="font-size: 10px; color: var(--text-secondary);">Склад & Отгрузка</span>
                        </div>
                        <div class="flow-step-card" data-step="7" style="cursor: pointer; padding: 12px; border: 1px solid var(--border-color); background: rgba(255,255,255,0.01); border-radius: var(--radius-md); text-align: center; transition: all var(--transition-fast);">
                            <i class="ph ph-presentation-chart" style="font-size: 24px; color: var(--success); display: block; margin: 0 auto 6px;"></i>
                            <strong style="font-size: 12px; display: block; color: var(--text-primary);">7. Аналитика</strong>
                            <span style="font-size: 10px; color: var(--text-secondary);">Транзакции & ROI</span>
                        </div>
                    </div>

                    <!-- Flow Step Details Display -->
                    <div id="flow-details-panel" style="padding: 16px; background: rgba(0,0,0,0.2); border: 1px solid var(--border-color); border-radius: var(--radius-md); min-height: 120px; transition: opacity 0.2s ease;">
                        <!-- Rendered by js selection -->
                    </div>
                </div>

                <!-- Right: Interactive ROI Calculator for Factory Owner -->
                <div class="card" style="padding: 24px; display: flex; flex-direction: column;">
                    <h3 style="font-size: 16px; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
                        <i class="ph ph-calculator text-success"></i>
                        <span>Калькулятор окупаемости для владельца</span>
                    </h3>
                    <p class="text-secondary" style="font-size: 12px; margin-bottom: 20px;">
                        Оцените примерный ежемесячный финансовый эффект от внедрения SOCKS.PRO на вашей фабрике.
                    </p>

                    <!-- Calculator Inputs -->
                    <div style="margin-bottom: 16px;">
                        <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
                            <span class="text-secondary">Объем производства (пар/мес)</span>
                            <strong id="val-qty-display" style="color: var(--primary-hover);">100 000</strong>
                        </div>
                        <input type="range" id="input-roi-qty" min="10000" max="500000" step="5000" value="100000" style="width: 100%; accent-color: var(--primary-hover);">
                    </div>
                    <div style="margin-bottom: 24px;">
                        <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
                            <span class="text-secondary">Средняя оптовая цена пары (KGS)</span>
                            <strong id="val-price-display" style="color: var(--primary-hover);">60</strong>
                        </div>
                        <input type="range" id="input-roi-price" min="20" max="400" step="5" value="60" style="width: 100%; accent-color: var(--primary-hover);">
                    </div>

                    <!-- Calculated Savings Metrics -->
                    <div style="background: rgba(0,0,0,0.15); border-radius: var(--radius-md); padding: 15px; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; gap: 12px; border: 1px dashed var(--border-color);">
                        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
                            <span class="text-secondary"><i class="ph ph-clock" style="margin-right: 6px; color: var(--info);"></i>Время бригадира:</span>
                            <strong id="save-time">~32 ч / мес</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
                            <span class="text-secondary"><i class="ph ph-needle" style="margin-right: 6px; color: var(--info);"></i>Экономия сырья:</span>
                            <strong id="save-raw">~250 кг / мес</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
                            <span class="text-secondary"><i class="ph ph-check-square" style="margin-right: 6px; color: var(--success);"></i>Снижение брака/потерь:</span>
                            <strong id="save-defect">~1 500 пар / мес</strong>
                        </div>
                        
                        <hr style="border: none; border-top: 1px solid var(--border-color); margin: 6px 0;">
                        
                        <div>
                            <span class="text-secondary" style="font-size: 11px; display: block; font-weight: 600; text-transform: uppercase;">Итоговый эффект в месяц:</span>
                            <span id="save-total" style="font-size: 26px; font-weight: 800; font-family: var(--font-heading); color: var(--success); display: block; text-shadow: 0 0 10px rgba(16, 185, 129, 0.2);">120 000 KGS</span>
                            <span class="text-muted" style="font-size: 9px; display: block; margin-top: 2px;">* Расчет произведен на основе статистических показателей автоматизации текстильных производств (~1.5% сокращения общих издержек).</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Features Cheat Sheet Cards -->
            <h3 style="font-size: 18px; margin-bottom: 16px; font-family: var(--font-heading); text-align: center;">
                Ключевые преимущества внедрения SOCKS.PRO
            </h3>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 20px;">
                <div class="card" style="padding: 20px; transition: transform 0.2s;">
                    <div style="width: 40px; height: 40px; border-radius: var(--radius-sm); background: var(--primary-glow); display: flex; align-items: center; justify-content: center; margin-bottom: 12px;">
                        <i class="ph-bold ph-git-merge" style="font-size: 20px; color: var(--primary-hover);"></i>
                    </div>
                    <h4 style="font-size: 14px; margin-bottom: 8px; font-weight: 600;">Жесткие переходы и живой контроль</h4>
                    <p class="text-secondary" style="font-size: 12px; line-height: 1.5; margin: 0;">
                        Живой контроль остатков в отдельных колонках при вводе спецификаций. Сотрудники физически не могут ввести объем больше, чем обработано на предыдущем этапе.
                    </p>
                </div>
                <div class="card" style="padding: 20px; transition: transform 0.2s;">
                    <div style="width: 40px; height: 40px; border-radius: var(--radius-sm); background: var(--info-bg); display: flex; align-items: center; justify-content: center; margin-bottom: 12px;">
                        <i class="ph-bold ph-globe" style="font-size: 20px; color: var(--info);"></i>
                    </div>
                    <h4 style="font-size: 14px; margin-bottom: 8px; font-weight: 600;">Автоматизация НБКР & Валюты</h4>
                    <p class="text-secondary" style="font-size: 12px; line-height: 1.5; margin: 0;">
                        Интеграция с Нацбанком позволяет загружать официальные курсы валют за любой период. Суммы в заказах автоматически пересчитываются в валюту учета на дату отгрузки.
                    </p>
                </div>
                <div class="card" style="padding: 20px; transition: transform 0.2s;">
                    <div style="width: 40px; height: 40px; border-radius: var(--radius-sm); background: var(--success-bg); display: flex; align-items: center; justify-content: center; margin-bottom: 12px;">
                        <i class="ph-bold ph-chart-line-up" style="font-size: 20px; color: var(--success);"></i>
                    </div>
                    <h4 style="font-size: 14px; margin-bottom: 8px; font-weight: 600;">Мониторинг сортности и выработки</h4>
                    <p class="text-secondary" style="font-size: 12px; line-height: 1.5; margin: 0;">
                        Полноценный учет 1-го, 2-го и 3-го сорта при сдаче на склад. Живые цветные индикаторы в отчетах позволяют мгновенно оценить долю брака в каждой партии.
                    </p>
                </div>
            </div>
            
            <div class="card" style="padding: 20px; text-align: center; background: rgba(79, 70, 229, 0.04); border-color: rgba(79, 70, 229, 0.15); margin-bottom: 30px;">
                <h4 style="font-size: 15px; margin-bottom: 6px;">Готовы протестировать возможности системы вживую?</h4>
                <p class="text-secondary" style="font-size: 12px; margin-bottom: 12px; max-width: 600px; margin-left: auto; margin-right: auto;">
                    Используйте боковую панель для перехода в реальные модули системы: заведите новые Спецификации, составьте Производственно мощностной план, запланируйте запуск по линиям, проведите Выпуск вязания и проверьте окупаемость в Отчетах!
                </p>
                <button class="btn btn-primary" id="btn-start-exploring" style="padding: 8px 20px; font-size: 12px;">
                    <i class="ph ph-rocket-launch"></i>Начать работу с системой
                </button>
            </div>
        </div>
    `;

    // Flow Simulator Step Descriptions
    const flowDescriptions = {
        1: {
            title: "Заказ покупателя (Ввод & Договор)",
            icon: "ph-shopping-cart",
            color: "var(--primary-hover)",
            desc: "Здесь менеджеры оформляют контракты в различных валютах (USD, EUR, RUB, KGS). Система на лету пересчитывает сумму заказа в базовую валюту фабрики (KGS) по курсу ЦБ на дату ввода, фиксируя финансовые обязательства.",
            roi: "Отказ от ручного пересчета, 100% точность курсовой разницы в управленческом учете."
        },
        2: {
            title: "Планирование & Мощностной план (ПМП)",
            icon: "ph-calendar",
            color: "var(--info)",
            desc: "Составление производственно-мощностного плана (ПМП) по этапам (Вязальный, Прошив, Упаковка) с расчетом планового объема в секундах и парах. Распределение заказов в производство в модуле 'Планирование и запуск' с живым контролем остатков.",
            roi: "Синхронизация рабочих часов, контроль плановой загрузки оборудования и предотвращение перегрузки линий."
        },
        3: {
            title: "Вязальный (Вязальный цех - ПФ)",
            icon: "ph-needle",
            color: "var(--info)",
            desc: "Операторы регистрируют выпуск сырой чулочной заготовки (полуфабриката) по станкам. В спецификации выводится живой контроль остатка: сколько запланировано, сколько уже связано и остаток к выпуску. Система блокирует перепроизводство заготовок.",
            roi: "Предотвращает бесконтрольное перепроизводство заготовок на 100%, экономя сырье."
        },
        4: {
            title: "Прошив (Швейный цех - ГП)",
            icon: "ph-scissors",
            color: "var(--primary-hover)",
            desc: "Швеи проводят финишную сборку изделий (мысок). Система выводит в спецификации сравнение с вязанием (вязано в парах, уже прошито, остаток) и строго блокирует превышение прошитых пар над фактически связанным объемом.",
            roi: "Мгновенное выявление скрытых потерь полуфабрикатов на межоперационном переходе."
        },
        5: {
            title: "Упаковка (Сложное пакетирование)",
            icon: "ph-package",
            color: "var(--success)",
            desc: "Приемка готовой продукции на склад с разделением по сортам (1-й сорт, 2-й сорт, 3-й сорт) на уровне линий. В спецификации выводится живой контроль: прошито пар по плану, уже упаковано, остаток. Блокирует превышение упаковки сверх прошива.",
            roi: "Оперативный анализ сортности в партии, контроль доли брака и точный складской баланс."
        },
        6: {
            title: "Реализация продукции (Списание со склада)",
            icon: "ph-truck",
            color: "var(--success)",
            desc: "Оформление отгрузки готовой продукции покупателю. Поддерживается отгрузка по заказам (с автозаполнением спецификации) и прямая продажа. На лету рассчитываются складские остатки: упаковано, уже отгружено, остаток на складе с блокировкой отгрузок в минус.",
            roi: "Исключение пересортицы и отгрузки несуществующего товара, автоматический контроль остатков."
        },
        7: {
            title: "Сквозная аналитика и отслеживание транзакций",
            icon: "ph-presentation-chart",
            color: "var(--success)",
            desc: "В реальном времени собирается общая статистика готовности. На панели управления владелец может в один клик развернуть детальный chronological таймлайн (историю) по каждой позиции заказа, с указанием конкретных дат, операторов, станков и швей.",
            roi: "Тотальный аудит и прозрачность производственного процесса от нитки до упаковки."
        }
    };

    const updateFlowStepDisplay = (stepNum) => {
        const step = flowDescriptions[stepNum];
        const panel = document.getElementById('flow-details-panel');
        if (!step || !panel) return;
        
        panel.style.opacity = '0';
        setTimeout(() => {
            panel.innerHTML = `
                <div style="display: flex; gap: 12px; align-items: flex-start; animation: fadeIn 0.25s ease;">
                    <div style="width: 44px; height: 44px; border-radius: var(--radius-sm); background: rgba(255,255,255,0.03); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid var(--border-color);">
                        <i class="ph ${step.icon}" style="font-size: 24px; color: ${step.color};"></i>
                    </div>
                    <div>
                        <h4 style="font-size: 13px; color: var(--text-primary); margin-bottom: 4px; font-weight: 600;">${step.title}</h4>
                        <p class="text-secondary" style="font-size: 12px; line-height: 1.5; margin-bottom: 8px;">${step.desc}</p>
                        <div style="font-size: 11px; background: rgba(16, 185, 129, 0.08); border-left: 3px solid var(--success); padding: 6px 10px; border-radius: 2px;">
                            <strong style="color: var(--success);">Эффект для бизнеса:</strong> <span class="text-secondary">${step.roi}</span>
                        </div>
                    </div>
                </div>
            `;
            panel.style.opacity = '1';
        }, 150);
    };

    // Bind Factory Flow Steps Click Handler
    const stepCards = container.querySelectorAll('.flow-step-card');
    stepCards.forEach(card => {
        card.addEventListener('click', () => {
            stepCards.forEach(c => {
                c.style.background = 'rgba(255,255,255,0.01)';
                c.style.borderColor = 'var(--border-color)';
                c.classList.remove('active');
            });
            
            const stepNum = card.getAttribute('data-step');
            card.style.background = 'var(--primary-glow)';
            card.style.borderColor = 'var(--primary)';
            card.classList.add('active');
            
            updateFlowStepDisplay(stepNum);
        });
    });

    // Initialize Flow step display with Step 1
    updateFlowStepDisplay(1);

    // ROI Calculator Event Listeners & Math Logic
    const sliderQty = container.querySelector('#input-roi-qty');
    const sliderPrice = container.querySelector('#input-roi-price');
    const displayQty = container.querySelector('#val-qty-display');
    const displayPrice = container.querySelector('#val-price-display');
    
    const saveTimeEl = container.querySelector('#save-time');
    const saveRawEl = container.querySelector('#save-raw');
    const saveDefectEl = container.querySelector('#save-defect');
    const saveTotalEl = container.querySelector('#save-total');

    const recalculateROI = () => {
        const qty = parseInt(sliderQty.value);
        const price = parseInt(sliderPrice.value);
        
        displayQty.textContent = qty.toLocaleString('ru-RU');
        displayPrice.textContent = price.toLocaleString('ru-RU');

        // Logic formulas:
        // Foreman time saved: ~ 32 hours per 100k pairs (due to planning & automation)
        const timeSaved = Math.round((qty / 100000) * 32);
        // Raw material saved: ~250 kg per 100k pairs (yarn control, preventing waste)
        const rawSaved = Math.round((qty / 100000) * 250);
        // Defect pairs saved: ~1.5% of total volume (preventing overproduction and spotting flaws early)
        const defectSaved = Math.round(qty * 0.015);
        
        // Financial effect:
        // Raw savings (~$5 / 440 KGS per kg of cotton) + Defect prevention (saving product cost)
        const yarnValue = rawSaved * 450;
        const defectValue = defectSaved * price * 0.5; // average cost of defect is 50% of selling price
        const totalSaved = Math.round(yarnValue + defectValue + (timeSaved * 300)); // brigades supervisor hourly rate KGS 300

        saveTimeEl.textContent = `~${timeSaved.toLocaleString('ru-RU')} ч / мес`;
        saveRawEl.textContent = `~${rawSaved.toLocaleString('ru-RU')} кг / мес`;
        saveDefectEl.textContent = `~${defectSaved.toLocaleString('ru-RU')} пар / мес`;
        
        saveTotalEl.textContent = `${totalSaved.toLocaleString('ru-RU')} KGS`;
    };

    sliderQty.addEventListener('input', recalculateROI);
    sliderPrice.addEventListener('input', recalculateROI);
    
    // Initial calculate
    recalculateROI();

    // Bind Button "Начать работу" to switch tab to Dashboard
    container.querySelector('#btn-start-exploring').addEventListener('click', () => {
        const dashNav = document.querySelector('.nav-item[data-tab="dashboard"]');
        if (dashNav) {
            dashNav.click();
        }
    });
};
