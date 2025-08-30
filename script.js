// Animation des pétales de sakura
class SakuraAnimation {
    constructor() {
        this.container = document.getElementById('sakuraContainer');
        this.maxPetals = 50;
        this.currentPetals = 0;
        this.init();
    }

    init() {
        // Créer les premiers pétales
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createPetal();
            }, i * 200);
        }

        // Continuer à créer des pétales
        setInterval(() => {
            if (this.currentPetals < this.maxPetals) {
                this.createPetal();
            }
        }, 300);
    }

    createPetal() {
        const petal = document.createElement('div');
        petal.className = 'sakura-petal';
        petal.textContent = '🌸';
        
        // Position aléatoire
        const startX = Math.random() * window.innerWidth;
        petal.style.left = startX + 'px';
        
        // Taille aléatoire
        const size = 15 + Math.random() * 15;
        petal.style.fontSize = size + 'px';
        
        // Durée d'animation aléatoire
        const duration = 8 + Math.random() * 12;
        petal.style.animationDuration = duration + 's';
        
        // Délai aléatoire
        const delay = Math.random() * 5;
        petal.style.animationDelay = delay + 's';
        
        // Ajouter au conteneur
        this.container.appendChild(petal);
        this.currentPetals++;
        
        // Supprimer le pétale après l'animation
        setTimeout(() => {
            if (petal.parentNode) {
                petal.parentNode.removeChild(petal);
                this.currentPetals--;
            }
        }, (duration + delay) * 1000);
    }
}

// Gestion des données d'économies
class SavingsTracker {
    constructor() {
        this.currentSavings = 0;
        this.targetAmount = 5000;
        this.milestones = [
            { amount: 800, name: "Vol", icon: "✈️", status: "locked" },
            { amount: 1600, name: "Hôtel", icon: "🏨", status: "locked" },
            { amount: 1800, name: "Osaka", icon: "🏯", status: "locked" },
            { amount: 2400, name: "Restaurant", icon: "🍜", status: "locked" },
            { amount: 3000, name: "Shopping Pokemon", icon: "⚡", status: "locked" }
        ];
        this.init();
    }

    init() {
        this.loadSavings();
        this.updateDisplay();
        this.updateMilestones();
        
        // Ajouter des événements pour tester
        this.addTestButtons();
    }

    loadSavings() {
        const saved = localStorage.getItem('japanSavings');
        if (saved) {
            this.currentSavings = parseFloat(saved);
        }
    }

    saveSavings() {
        localStorage.setItem('japanSavings', this.currentSavings.toString());
    }

    addSavings(amount) {
        this.currentSavings += amount;
        if (this.currentSavings > this.targetAmount) {
            this.currentSavings = this.targetAmount;
        }
        this.saveSavings();
        this.updateDisplay();
    }

    updateDisplay() {
        const currentElement = document.querySelector('.stat-box:nth-child(1) .amount');
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        if (currentElement) {
            currentElement.textContent = `€${this.currentSavings.toFixed(0)}`;
        }
        
        const percentage = Math.min((this.currentSavings / this.targetAmount) * 100, 100);
        
        if (progressFill) {
            progressFill.style.width = percentage + '%';
        }
        
        if (progressText) {
            progressText.textContent = `€${this.currentSavings.toFixed(0)} / €${this.targetAmount.toFixed(0)}`;
        }
        
        this.updateMilestones();
    }

    addTestButtons() {
        // Créer un panneau de test (à supprimer en production)
        const testPanel = document.createElement('div');
        testPanel.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            padding: 15px;
            border: 2px solid #ffb7c5;
            border-radius: 5px;
            z-index: 1000;
            font-family: 'VT323', monospace;
        `;
        
        testPanel.innerHTML = `
            <h4 style="color: #ffb7c5; margin-bottom: 10px;">Test - Ajouter des économies</h4>
            <button onclick="savingsTracker.addSavings(100)" style="
                background: #ffb7c5;
                border: none;
                padding: 5px 10px;
                margin: 2px;
                cursor: pointer;
                font-family: 'VT323', monospace;
                color: #000;
            ">+100€</button>
            <button onclick="savingsTracker.addSavings(500)" style="
                background: #ffb7c5;
                border: none;
                padding: 5px 10px;
                margin: 2px;
                cursor: pointer;
                font-family: 'VT323', monospace;
                color: #000;
            ">+500€</button>
            <button onclick="savingsTracker.addSavings(1000)" style="
                background: #ffb7c5;
                border: none;
                padding: 5px 10px;
                margin: 2px;
                cursor: pointer;
                font-family: 'VT323', monospace;
                color: #000;
            ">+1000€</button>
            <br>
            <button onclick="savingsTracker.resetSavings()" style="
                background: #ff6b6b;
                border: none;
                padding: 5px 10px;
                margin: 2px;
                cursor: pointer;
                font-family: 'VT323', monospace;
                color: #fff;
            ">Reset</button>
        `;
        
        document.body.appendChild(testPanel);
    }

    resetSavings() {
        this.currentSavings = 0;
        this.saveSavings();
        this.updateDisplay();
    }

    updateMilestones() {
        const milestoneElements = document.querySelectorAll('.milestone');
        
        milestoneElements.forEach((element, index) => {
            const amount = parseInt(element.dataset.amount);
            const statusElement = element.querySelector('.milestone-status');
            
            // Supprimer toutes les classes
            element.classList.remove('unlocked', 'completed');
            
            if (this.currentSavings >= amount) {
                // Palier atteint
                element.classList.add('completed');
                statusElement.textContent = '✅';
                
                // Animation si c'est la première fois qu'on atteint ce palier
                if (this.milestones[index].status === 'locked') {
                    this.milestones[index].status = 'completed';
                    element.style.animation = 'milestoneUnlock 0.5s ease-out';
                    setTimeout(() => {
                        element.style.animation = '';
                    }, 500);
                }
            } else if (this.currentSavings >= amount * 0.8) {
                // Palier proche (80% atteint)
                element.classList.add('unlocked');
                statusElement.textContent = '🔓';
                
                if (this.milestones[index].status === 'locked') {
                    this.milestones[index].status = 'unlocked';
                    element.style.animation = 'milestoneUnlock 0.5s ease-out';
                    setTimeout(() => {
                        element.style.animation = '';
                    }, 500);
                }
            } else {
                // Palier verrouillé
                statusElement.textContent = '🔒';
                this.milestones[index].status = 'locked';
            }
        });
    }
}

// Effets visuels supplémentaires
class VisualEffects {
    constructor() {
        this.init();
    }

    init() {
        // Effet de parallaxe sur l'arrière-plan
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const background = document.querySelector('.background-image');
            if (background) {
                background.style.transform = `scale(1.1) translateY(${scrolled * 0.5}px)`;
            }
        });

        // Effet de hover sur les boîtes de statistiques
        const statBoxes = document.querySelectorAll('.stat-box');
        statBoxes.forEach(box => {
            box.addEventListener('mouseenter', () => {
                box.style.transform = 'translateY(-5px) scale(1.02)';
            });
            
            box.addEventListener('mouseleave', () => {
                box.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Animation d'apparition progressive
        this.animateElements();
    }

    animateElements() {
        const elements = document.querySelectorAll('.stat-box');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.8s ease-out';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 1000 + (index * 200));
        });
    }
}

// Initialisation quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    // Démarrer l'animation des sakura
    const sakuraAnimation = new SakuraAnimation();
    
    // Initialiser le tracker d'économies
    window.savingsTracker = new SavingsTracker();
    
    // Initialiser les effets visuels
    const visualEffects = new VisualEffects();
    
    // Effet de chargement
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 1s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Gestion du redimensionnement de la fenêtre
window.addEventListener('resize', () => {
    // Recréer les pétales si nécessaire
    const sakuraContainer = document.getElementById('sakuraContainer');
    if (sakuraContainer) {
        sakuraContainer.innerHTML = '';
        setTimeout(() => {
            new SakuraAnimation();
        }, 100);
    }
}); 