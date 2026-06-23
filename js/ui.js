// js/ui.js

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container') || createToastContainer();
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

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '20px';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '10px';
    document.body.appendChild(container);
    return container;
}

function openModal(title, bodyHtml, footerHtml = '') {
    const modalOverlay = document.getElementById('modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalFooter = document.getElementById('modal-footer');
    
    if(!modalOverlay) return;

    modalTitle.textContent = title;
    modalBody.innerHTML = bodyHtml;
    modalFooter.innerHTML = footerHtml;
    modalOverlay.classList.add('active');
}

function closeModal() {
    const modalOverlay = document.getElementById('modal-overlay');
    if(modalOverlay) {
        modalOverlay.classList.remove('active');
    }
}

function generateId(prefix = 'id') {
    return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
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

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-modal-close')?.addEventListener('click', closeModal);
    document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
        const modalOverlay = document.getElementById('modal-overlay');
        if (e.target === modalOverlay) closeModal();
    });
});

window.formatMoney = function(value) {
    const num = Number(value) || 0;
    const useDec = (window.state && window.state.settings && window.state.settings.useDecimals !== undefined) 
        ? window.state.settings.useDecimals 
        : true;
    const decPlaces = (window.state && window.state.settings && window.state.settings.decimalPlaces !== undefined) 
        ? window.state.settings.decimalPlaces 
        : 2;
    
    return num.toLocaleString('ru-RU', {
        minimumFractionDigits: useDec ? decPlaces : 0,
        maximumFractionDigits: useDec ? decPlaces : 0
    });
};

window.formatQty = function(value) {
    const num = Number(value) || 0;
    return num.toLocaleString('ru-RU', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
};

window.formatRate = function(value) {
    const num = Number(value) || 0;
    return num.toLocaleString('ru-RU', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 5
    });
};

