# 🌸 Objectif Japon

Site web pour planifier et suivre votre voyage au Japon. Gestion des économies, planification des étapes, suivi des dépenses et convertisseur de devises en temps réel.

## 📋 Fonctionnalités Principales

### 🏠 Page d'Accueil (Stats)
- **Compte à rebours** : Décompte automatique jusqu'au départ (1er avril 2026)
- **Suivi des économies** : Visualisation de vos économies actuelles vs objectif (3000€)
- **Système de paliers** : 5 objectifs intermédiaires avec progression visuelle
- **Boutons d'économie** : 
  - Économie quotidienne (+15€)
  - Économie libre (montant personnalisé)
- **Barre de progression** : Affichage visuel de votre avancement
- **Sauvegarde automatique** : Vos données sont conservées dans le navigateur

### ✈️ Page Voyage
- **9 articles détaillés** sur les destinations japonaises
- **Navigation fluide** entre les articles
- **Informations pratiques** : transports, prix, conseils
- **Boutons de retour** vers la page principale

### 💰 Page Frais (Nouvelle)
- **Convertisseur de devises** : Euro ↔ Yen en temps réel
- **API de taux de change** : Données réelles du marché
- **Suivi des achats** : Enregistrement complet de vos dépenses
- **Résumé des dépenses** : Totaux et statistiques
- **Sauvegarde locale** : Vos achats sont conservés

## 🎯 Paliers d'Objectifs

1. **✈️ Vol** : 800€
2. **🏨 Hôtel** : 1600€  
3. **🏯 Osaka** : 1800€
4. **🍜 Restaurant** : 2400€
5. **⚡ Shopping Pokemon** : 3000€

## 📚 Articles de Voyage Disponibles

### 🛬 Arrivée à Tokyo
Guide complet de l'aéroport d'Haneda : terminaux, transports, services, conseils pratiques.

### 🌃 Shibuya
Le quartier le plus dynamique de Tokyo : intersection mythique, shopping, vie nocturne.

### 👗 Harajuku
Berceau de la mode alternative japonaise : cosplay, Lolita fashion, Takeshita Street.

### 🏪 Les Konbini
Les supérettes 24h/24 du Japon : services, produits, conseils d'utilisation.

### 🚄 Le Shinkansen
Le train à grande vitesse japonais : réservations, classes, conseils de voyage.

### 🍜 Osaka
La capitale gastronomique du Japon : street food, restaurants, quartiers.

### 🎢 Universal Studios Japan
Le parc d'attractions d'Osaka : attractions, billets, conseils de visite.

### 🎮 Pokémon Center et Nintendo Shop
Le Cyberspace Shibuya : boutiques officielles, produits exclusifs.

### 🍡 Street Food sans viande
Guide culinaire végétarien à Tokyo : restaurants, plats traditionnels.

## 💰 Fonctionnalités du Suivi des Frais

### Convertisseur de Devises
- **Taux en temps réel** : API ExchangeRate-API
- **Conversion automatique** : Euro ↔ Yen
- **Conversions rapides** : Montants prédéfinis (1€, 5€, 10€, 20€, 50€, 100€)
- **Mise à jour automatique** : Toutes les heures
- **Raccourcis clavier** : Ctrl+1 (€→¥), Ctrl+2 (¥→€), Ctrl+R (mise à jour)

### Suivi des Achats
- **Formulaire complet** : nom, date, ville, type, montant, paiement, commentaire
- **Types d'achats** : souvenir, restaurant, konbini, transport, hôtel, activité, shopping, autre
- **Modes de paiement** : espèces, carte, Suica/Pasmo, PayPay, autre
- **Conversion automatique** : Montant en Yen → Euro calculé automatiquement
- **Validation en temps réel** : Champs obligatoires vérifiés
- **Résumé des dépenses** : Total en Yen et Euro, nombre d'achats
- **Liste des achats** : Affichage détaillé avec possibilité de suppression

## 🚀 Comment Utiliser

### Page d'Accueil
1. Ouvrez `index.html` dans votre navigateur
2. Utilisez les boutons d'économie pour ajouter des montants
3. Suivez votre progression vers les paliers d'objectifs
4. Vos données sont automatiquement sauvegardées

### Page Voyage
1. Cliquez sur "Voyage" dans la navigation
2. Parcourez les articles selon vos intérêts
3. Utilisez le bouton "Retour au voyage" pour naviguer

### Page Frais
1. Cliquez sur "Frais" dans la navigation
2. **Convertisseur** : Saisissez un montant et utilisez les boutons de conversion
3. **Suivi des achats** :
   - Remplissez le formulaire avec les détails de votre achat
   - Cliquez sur "Ajouter l'achat"
   - Consultez le résumé et la liste de vos dépenses
4. Vos achats sont automatiquement sauvegardés

## 📁 Structure du Projet

```
objectif_japon/
├── index.html              # Page d'accueil avec suivi des économies
├── voyage.html             # Page des articles de voyage
├── frais.html              # Page de suivi des frais et convertisseur
├── articles/               # Dossier contenant tous les articles
│   ├── article-haneda.html
│   ├── article-shibuya.html
│   ├── article-harajuku.html
│   ├── article-konbini.html
│   ├── article-shinkansen.html
│   ├── article-osaka.html
│   ├── article-universal.html
│   ├── article-pokemon.html
│   └── article-food.html
├── styles.css              # Styles CSS
├── script.js               # JavaScript principal
├── frais.js                # JavaScript pour la page frais
├── assets/                 # Images et ressources
│   ├── background.jpg
│   ├── 1step.png à 5step.png
│   └── images des articles
└── README.md               # Documentation
```

## 🛠️ Technologies Utilisées

- **HTML5** : Structure sémantique et accessibilité
- **CSS3** : Styles, animations, responsive design
- **JavaScript ES6+** : Interactions, gestion des données, API
- **LocalStorage** : Sauvegarde des données utilisateur
- **ExchangeRate-API** : Taux de change en temps réel

## 💾 Sauvegarde des Données

- **Économies** : Sauvegardées automatiquement dans le navigateur
- **Achats** : Sauvegardés dans le localStorage
- **Taux de change** : Mis à jour automatiquement toutes les heures
- **Pas de perte de données** entre les sessions

## 📱 Compatibilité

- **Navigateurs** : Chrome, Firefox, Safari, Edge
- **Responsive** : S'adapte aux écrans mobile, tablette et desktop
- **Hors ligne** : Fonctionne sans connexion (sauf mise à jour des taux)

## 🔧 Fonctionnalités Avancées

### Raccourcis Clavier (Page Frais)
- `Ctrl+1` : Conversion Euro → Yen
- `Ctrl+2` : Conversion Yen → Euro
- `Ctrl+R` : Mise à jour du taux de change

### Validation Automatique
- Champs obligatoires vérifiés en temps réel
- Boutons désactivés tant que le formulaire n'est pas complet
- Messages d'erreur clairs

### Gestion des Erreurs
- Fallback en cas d'erreur API
- Conservation des données précédentes
- Notifications informatives

## 🎯 Fonctionnalités à Venir

- [ ] Section "Langue" dans la navigation
- [ ] Historique des transactions
- [ ] Export des données en CSV/PDF
- [ ] Personnalisation des paliers d'objectifs
- [ ] Statistiques détaillées par catégorie
- [ ] Notifications de progression
- [ ] Mode sombre/clair
- [ ] Synchronisation cloud

---

*Bon voyage vers le Japon ! 🇯🇵🌸* 