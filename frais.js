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

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Charger le taux de change au démarrage
    fetchExchangeRate();
    setupEventListeners();
    
    // Mise à jour automatique toutes les heures
    setInterval(fetchExchangeRate, 3600000); // 1 heure = 3600000 ms
});

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

// Export des fonctions pour utilisation externe
window.currencyConverter = {
    convertEuroToYen: (euros) => Math.round(euros * currentExchangeRate),
    convertYenToEuro: (yens) => yens / currentExchangeRate,
    getCurrentRate: () => currentExchangeRate,
    getLastUpdateTime: () => lastUpdateTime,
    updateRate: fetchExchangeRate
}; 