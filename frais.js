// Taux de change actuel (sera mis à jour via API)
let currentExchangeRate = 160;
let lastUpdateTime = null;

// Éléments DOM
const euroInput = document.getElementById('euro-amount');
const yenInput = document.getElementById('yen-amount');
const euroToYenBtn = document.getElementById('euro-to-yen');
const yenToEuroBtn = document.getElementById('yen-to-euro');
const updateRateBtn = document.getElementById('update-rate');
const currentRateSpan = document.getElementById('current-rate');
const quickItems = document.querySelectorAll('.quick-item');

// Configuration des événements
function setupEventListeners() {
    // Conversion Euro vers Yen
    euroToYenBtn.addEventListener('click', function() {
        if (euroInput.value && euroInput.value > 0) {
            const euros = parseFloat(euroInput.value);
            const yens = euros * currentExchangeRate;
            yenInput.value = Math.round(yens);
        }
    });

    // Conversion Yen vers Euro
    yenToEuroBtn.addEventListener('click', function() {
        if (yenInput.value && yenInput.value > 0) {
            const yens = parseInt(yenInput.value);
            const euros = yens / currentExchangeRate;
            euroInput.value = euros.toFixed(2);
        }
    });

    // Conversion automatique lors de la saisie
    euroInput.addEventListener('input', function() {
        if (this.value && this.value > 0) {
            const euros = parseFloat(this.value);
            const yens = euros * currentExchangeRate;
            yenInput.value = Math.round(yens);
        } else {
            yenInput.value = '';
        }
    });

    yenInput.addEventListener('input', function() {
        if (this.value && this.value > 0) {
            const yens = parseInt(this.value);
            const euros = yens / currentExchangeRate;
            euroInput.value = euros.toFixed(2);
        } else {
            euroInput.value = '';
        }
    });

    // Mise à jour du taux de change
    updateRateBtn.addEventListener('click', fetchExchangeRate);

    // Conversions rapides
    quickItems.forEach(item => {
        item.addEventListener('click', function() {
            const euroAmount = parseFloat(this.dataset.euro);
            euroInput.value = euroAmount;
            const yenAmount = euroAmount * currentExchangeRate;
            yenInput.value = Math.round(yenAmount);
        });
    });

    // Raccourcis clavier
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    euroToYenBtn.click();
                    break;
                case '2':
                    e.preventDefault();
                    yenToEuroBtn.click();
                    break;
                case 'r':
                    e.preventDefault();
                    updateRateBtn.click();
                    break;
            }
        }
    });
}

// Récupération du taux de change en temps réel via API
async function fetchExchangeRate() {
    updateRateBtn.disabled = true;
    updateRateBtn.textContent = 'Mise à jour...';
    
    try {
        // API gratuite ExchangeRate-API
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Récupération du taux EUR vers JPY
        const newRate = data.rates.JPY;
        
        if (newRate && newRate > 0) {
            const oldRate = currentExchangeRate;
            currentExchangeRate = Math.round(newRate * 100) / 100; // Arrondi à 2 décimales
            lastUpdateTime = new Date();
            
            updateCurrentRateDisplay();
            updateQuickConversions();
            
            // Mise à jour des champs si ils contiennent des valeurs
            if (euroInput.value) {
                const euros = parseFloat(euroInput.value);
                const yens = euros * currentExchangeRate;
                yenInput.value = Math.round(yens);
            } else if (yenInput.value) {
                const yens = parseInt(yenInput.value);
                const euros = yens / currentExchangeRate;
                euroInput.value = euros.toFixed(2);
            }
            
            // Calcul de la variation
            const variation = ((currentExchangeRate - oldRate) / oldRate * 100).toFixed(2);
            const variationText = variation > 0 ? `+${variation}%` : `${variation}%`;
            
            showNotification(`Taux mis à jour : 1 € = ${currentExchangeRate} ¥ (${variationText})`, 'success');
            
        } else {
            throw new Error('Taux de change invalide reçu de l\'API');
        }
        
    } catch (error) {
        console.error('Erreur lors de la récupération du taux:', error);
        
        // En cas d'erreur, on garde l'ancien taux
        showNotification('Erreur de connexion à l\'API. Taux précédent conservé.', 'error');
        
        // Si c'est le premier chargement et qu'il y a une erreur, on utilise un taux par défaut
        if (!lastUpdateTime) {
            currentExchangeRate = 160;
            updateCurrentRateDisplay();
            updateQuickConversions();
        }
    } finally {
        updateRateBtn.disabled = false;
        updateRateBtn.textContent = 'Mettre à jour le taux';
    }
}

// Mise à jour de l'affichage du taux actuel
function updateCurrentRateDisplay() {
    let displayText = `1 € = ${currentExchangeRate} ¥`;
    
    if (lastUpdateTime) {
        const timeString = lastUpdateTime.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });
        displayText += ` (mis à jour à ${timeString})`;
    }
    
    currentRateSpan.textContent = displayText;
}

// Mise à jour des conversions rapides
function updateQuickConversions() {
    quickItems.forEach(item => {
        const euroAmount = parseFloat(item.dataset.euro);
        const yenAmount = euroAmount * currentExchangeRate;
        const yenSpan = item.querySelector('.quick-yen');
        yenSpan.textContent = `${Math.round(yenAmount)} ¥`;
    });
}

// Fonction de notification
function showNotification(message, type = 'info') {
    // Création de la notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Styles de base pour la notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // Couleurs selon le type
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#4CAF50';
            break;
        case 'error':
            notification.style.backgroundColor = '#f44336';
            break;
        default:
            notification.style.backgroundColor = '#2196F3';
    }
    
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Suppression automatique
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Fonction utilitaire pour formater les nombres
function formatCurrency(amount, currency = 'EUR') {
    if (currency === 'EUR') {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    } else if (currency === 'JPY') {
        return new Intl.NumberFormat('ja-JP', {
            style: 'currency',
            currency: 'JPY'
        }).format(amount);
    }
    return amount.toString();
}

// Gestion des dépenses
let expenses = JSON.parse(localStorage.getItem('japanExpenses')) || [];

// Éléments DOM pour les dépenses
const expenseNameInput = document.getElementById('expense-name');
const expenseDateInput = document.getElementById('expense-date');
const expenseCityInput = document.getElementById('expense-city');
const expenseCategorySelect = document.getElementById('expense-category');
const expenseAmountYenInput = document.getElementById('expense-amount-yen');
const expenseAmountEuroInput = document.getElementById('expense-amount-euro');
const expensePaymentSelect = document.getElementById('expense-payment');
const expenseCommentTextarea = document.getElementById('expense-comment');
const addExpenseBtn = document.getElementById('add-expense-btn');
const clearFormBtn = document.getElementById('clear-form-btn');
const expensesContainer = document.getElementById('expenses-container');
const totalYenSpan = document.getElementById('total-yen');
const totalEuroSpan = document.getElementById('total-euro');
const totalExpensesSpan = document.getElementById('total-expenses');

// Initialisation des dépenses
document.addEventListener('DOMContentLoaded', function() {
    // Charger le taux de change au démarrage
    fetchExchangeRate();
    setupEventListeners();
    setupExpenseEventListeners();
    
    // Mise à jour automatique toutes les heures
    setInterval(fetchExchangeRate, 3600000); // 1 heure = 3600000 ms
    
    // Initialiser la date à aujourd'hui
    expenseDateInput.value = new Date().toISOString().split('T')[0];
    
    // Charger et afficher les dépenses existantes
    loadExpenses();
    updateExpensesDisplay();
});

// Configuration des événements pour les dépenses
function setupExpenseEventListeners() {
    // Conversion automatique Yen vers Euro
    expenseAmountYenInput.addEventListener('input', function() {
        if (this.value && this.value > 0) {
            const yens = parseInt(this.value);
            const euros = yens / currentExchangeRate;
            expenseAmountEuroInput.value = euros.toFixed(2);
        } else {
            expenseAmountEuroInput.value = '';
        }
    });
    
    // Ajouter une dépense
    addExpenseBtn.addEventListener('click', addExpense);
    
    // Vider le formulaire
    clearFormBtn.addEventListener('click', clearExpenseForm);
    
    // Validation en temps réel
    expenseNameInput.addEventListener('input', validateForm);
    expenseDateInput.addEventListener('input', validateForm);
    expenseCityInput.addEventListener('input', validateForm);
    expenseCategorySelect.addEventListener('change', validateForm);
    expenseAmountYenInput.addEventListener('input', validateForm);
    expensePaymentSelect.addEventListener('change', validateForm);
}

// Ajouter une nouvelle dépense
function addExpense() {
    if (!validateForm()) {
        showNotification('Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }
    
    const expense = {
        id: Date.now(),
        name: expenseNameInput.value.trim(),
        date: expenseDateInput.value,
        city: expenseCityInput.value.trim(),
        category: expenseCategorySelect.value,
        amountYen: parseInt(expenseAmountYenInput.value),
        amountEuro: parseFloat(expenseAmountEuroInput.value),
        payment: expensePaymentSelect.value,
        comment: expenseCommentTextarea.value.trim(),
        createdAt: new Date().toISOString()
    };
    
    expenses.unshift(expense); // Ajouter au début de la liste
    saveExpenses();
    updateExpensesDisplay();
    clearExpenseForm();
    
    showNotification(`Achat "${expense.name}" ajouté pour ${expense.amountYen} ¥`, 'success');
}

// Valider le formulaire
function validateForm() {
    const requiredFields = [
        expenseNameInput,
        expenseDateInput,
        expenseCityInput,
        expenseCategorySelect,
        expenseAmountYenInput,
        expensePaymentSelect
    ];
    
    const isValid = requiredFields.every(field => {
        if (field.type === 'select-one') {
            return field.value !== '';
        }
        return field.value.trim() !== '';
    });
    
    addExpenseBtn.disabled = !isValid;
    return isValid;
}

// Vider le formulaire
function clearExpenseForm() {
    expenseNameInput.value = '';
    expenseDateInput.value = new Date().toISOString().split('T')[0];
    expenseCityInput.value = '';
    expenseCategorySelect.value = '';
    expenseAmountYenInput.value = '';
    expenseAmountEuroInput.value = '';
    expensePaymentSelect.value = '';
    expenseCommentTextarea.value = '';
    validateForm();
}

// Sauvegarder les dépenses dans le localStorage
function saveExpenses() {
    localStorage.setItem('japanExpenses', JSON.stringify(expenses));
}

// Charger les dépenses depuis le localStorage
function loadExpenses() {
    const saved = localStorage.getItem('japanExpenses');
    if (saved) {
        expenses = JSON.parse(saved);
    }
}

// Mettre à jour l'affichage des dépenses
function updateExpensesDisplay() {
    if (expenses.length === 0) {
        expensesContainer.innerHTML = '<p class="no-expenses">Aucun achat enregistré pour le moment</p>';
    } else {
        expensesContainer.innerHTML = expenses.map(expense => createExpenseHTML(expense)).join('');
    }
    
    updateExpensesSummary();
    
    // Ajouter les événements de suppression
    document.querySelectorAll('.delete-expense-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const expenseId = parseInt(this.dataset.expenseId);
            deleteExpense(expenseId);
        });
    });
}

// Créer le HTML pour une dépense
function createExpenseHTML(expense) {
    const categoryIcons = {
        'souvenir': '🎁',
        'restaurant': '🍽️',
        'konbini': '🏪',
        'transport': '🚇',
        'hotel': '🏨',
        'activite': '🎯',
        'shopping': '🛍️',
        'autre': '📦'
    };
    
    const paymentIcons = {
        'especes': '💵',
        'carte': '💳',
        'suica': '🚇',
        'paypay': '📱',
        'autre': '💸'
    };
    
    const formattedDate = new Date(expense.date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    
    return `
        <div class="expense-item" data-expense-id="${expense.id}">
            <div class="expense-header">
                <div>
                    <div class="expense-title">${expense.name}</div>
                    <div class="expense-date">${formattedDate}</div>
                </div>
                <div class="expense-amount">${expense.amountYen} ¥</div>
            </div>
            
            <div class="expense-details">
                <div class="expense-detail">
                    <span>${categoryIcons[expense.category]}</span>
                    <span>${expense.category}</span>
                </div>
                <div class="expense-detail">
                    <span>🏙️</span>
                    <span>${expense.city}</span>
                </div>
                <div class="expense-detail">
                    <span>${paymentIcons[expense.payment]}</span>
                    <span>${expense.payment}</span>
                </div>
                <div class="expense-detail">
                    <span>€</span>
                    <span>${expense.amountEuro.toFixed(2)} €</span>
                </div>
            </div>
            
            ${expense.comment ? `<div class="expense-comment">💭 ${expense.comment}</div>` : ''}
            
            <div class="expense-actions">
                <button class="expense-action-btn delete delete-expense-btn" data-expense-id="${expense.id}">
                    🗑️ Supprimer
                </button>
            </div>
        </div>
    `;
}

// Supprimer une dépense
function deleteExpense(expenseId) {
    const expense = expenses.find(e => e.id === expenseId);
    if (expense) {
        if (confirm(`Êtes-vous sûr de vouloir supprimer l'achat "${expense.name}" ?`)) {
            expenses = expenses.filter(e => e.id !== expenseId);
            saveExpenses();
            updateExpensesDisplay();
            showNotification(`Achat "${expense.name}" supprimé`, 'success');
        }
    }
}

// Mettre à jour le résumé des dépenses
function updateExpensesSummary() {
    const totalYen = expenses.reduce((sum, expense) => sum + expense.amountYen, 0);
    const totalEuro = expenses.reduce((sum, expense) => sum + expense.amountEuro, 0);
    
    totalYenSpan.textContent = `${totalYen.toLocaleString()} ¥`;
    totalEuroSpan.textContent = `(${totalEuro.toFixed(2)} €)`;
    totalExpensesSpan.textContent = expenses.length;
}

// Export des fonctions pour utilisation externe
window.currencyConverter = {
    convertEuroToYen: (euros) => Math.round(euros * currentExchangeRate),
    convertYenToEuro: (yens) => yens / currentExchangeRate,
    getCurrentRate: () => currentExchangeRate,
    getLastUpdateTime: () => lastUpdateTime,
    updateRate: fetchExchangeRate
};

window.expenseTracker = {
    addExpense: addExpense,
    deleteExpense: deleteExpense,
    getExpenses: () => expenses,
    getTotalSpent: () => expenses.reduce((sum, expense) => sum + expense.amountYen, 0)
}; 