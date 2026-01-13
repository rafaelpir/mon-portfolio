# 📊 Configuration de Google Analytics 4

**Date de création :** 12 janvier 2026
**Statut :** ✅ Installé - Configuration requise
**Objectif :** Suivre le trafic du portfolio et analyser les performances

---

## 🎯 Pourquoi Google Analytics ?

Google Analytics te permet de :
- **Suivre le nombre de visiteurs** sur ton portfolio
- **Analyser les pages les plus vues** (quels projets attirent le plus ?)
- **Connaître l'origine du trafic** (Google, LinkedIn, direct, etc.)
- **Voir les statistiques en temps réel** (combien de personnes sont sur ton site maintenant)
- **Montrer en soutenance** : "Mon portfolio a eu X visiteurs depuis son lancement"

**C'est 100% gratuit et très valorisé en BUT MMI !**

---

## ⚡ Installation rapide (15 minutes)

### Étape 1 : Créer un compte Google Analytics

1. **Va sur Google Analytics**
   URL : https://analytics.google.com/

2. **Connecte-toi** avec ton compte Google (ou crée-en un)

3. **Clique sur "Commencer à mesurer"** ou **"Start measuring"**

4. **Nom du compte** : Entre `Rafael Piral Portfolio` (ou ce que tu veux)
   Coche toutes les cases de partage de données (recommandé)
   Clique sur **"Suivant"**

5. **Nom de la propriété** : Entre `Portfolio rafaelpiral.fr`
   - **Fuseau horaire** : `(GMT+01:00) Paris`
   - **Devise** : `Euro (EUR)`
   Clique sur **"Suivant"**

6. **Informations sur l'entreprise** :
   - **Secteur d'activité** : Design ou Technologie
   - **Taille de l'entreprise** : Petite (1-10)
   - **Utilisation de Google Analytics** : Mesurer l'engagement des utilisateurs
   Clique sur **"Créer"**

7. **Accepte les conditions d'utilisation**
   Lis et accepte les CGU de Google Analytics

8. **Configuration de la collecte de données** :
   - Sélectionne **"Web"**
   - **URL du site web** : `https://rafaelpiral.fr`
   - **Nom du flux** : `Portfolio Web`
   Clique sur **"Créer un flux"**

---

### Étape 2 : Récupérer ton ID de mesure

Une fois le flux créé, tu vas voir une page avec :

```
ID de mesure
G-XXXXXXXXXX
```

**Copie cet ID** (il commence toujours par `G-`)

Exemple : `G-1A2B3C4D5E`

---

### Étape 3 : Configurer ton portfolio

1. **Ouvre le fichier `.env`** à la racine de ton projet
   (Si le fichier n'existe pas, crée-le)

2. **Ajoute cette ligne** en remplaçant par ton vrai ID :

```bash
# Google Analytics 4 Measurement ID
VITE_GA_MEASUREMENT_ID=G-TON_ID_ICI
```

Exemple avec un vrai ID :
```bash
VITE_GA_MEASUREMENT_ID=G-1A2B3C4D5E
```

3. **Sauvegarde le fichier**

---

### Étape 4 : Configurer sur Vercel (IMPORTANT)

Pour que Google Analytics fonctionne en production (sur ton site en ligne), tu dois aussi ajouter la variable sur Vercel :

1. **Va sur Vercel Dashboard** : https://vercel.com/dashboard

2. **Sélectionne ton projet** `mon-portfolio`

3. **Va dans Settings → Environment Variables**

4. **Ajoute une nouvelle variable** :
   - **Key** : `VITE_GA_MEASUREMENT_ID`
   - **Value** : `G-TON_ID_ICI` (ton vrai ID)
   - **Environments** : Coche **Production**, **Preview**, et **Development**

5. **Clique sur "Save"**

6. **Redéploie ton site** :
   Va dans **Deployments** → Clique sur les 3 points du dernier déploiement → **"Redeploy"**

---

### Étape 5 : Vérifier que ça fonctionne

#### Test en local (sur ton ordinateur)

1. **Lance ton serveur de développement** :
```bash
npm run dev
```

2. **Ouvre ton navigateur** et va sur `http://localhost:5173`

3. **Ouvre la console du navigateur** (F12 ou clic droit → Inspecter → Console)

4. **Tu devrais voir** :
```
Google Analytics initialisé: G-TON_ID
```

Si tu vois ce message, c'est bon ! ✅

#### Test en production (sur ton site en ligne)

1. **Va sur ton site** : https://rafaelpiral.fr

2. **Attends 2-3 minutes**

3. **Retourne sur Google Analytics** : https://analytics.google.com/

4. **Clique sur "Rapports" → "Temps réel"**

5. **Tu devrais voir "1 utilisateur actif"** (c'est toi !)

Si tu vois ton activité en temps réel, **c'est parfait** ! 🎉

---

## 📈 Comment utiliser Google Analytics

### Rapports essentiels à consulter

1. **Temps réel** (Pour impressionner en soutenance)
   - Rapports → Temps réel
   - Montre combien de personnes sont sur ton site en ce moment

2. **Vue d'ensemble** (Statistiques générales)
   - Rapports → Vue d'ensemble
   - Nombre total de visiteurs
   - Pages vues
   - Durée moyenne de session

3. **Acquisition** (D'où viennent tes visiteurs ?)
   - Rapports → Acquisition → Vue d'ensemble
   - Google, LinkedIn, Direct, etc.

4. **Pages et écrans** (Quelles pages sont les plus vues ?)
   - Rapports → Engagement → Pages et écrans
   - Tu verras quels projets attirent le plus

5. **Données démographiques** (Âge, sexe, localisation)
   - Rapports → Utilisateur → Données démographiques

---

## 💡 Conseils pour la soutenance

### Ce que tu peux dire en soutenance :

✅ **"J'ai intégré Google Analytics pour suivre les performances de mon portfolio"**

✅ **"Depuis le lancement, j'ai eu X visiteurs et Y pages vues"** (vérifie les chiffres avant la soutenance)

✅ **"Les projets les plus consultés sont [Projet 1] et [Projet 2]"** (montre que tu analyses ton audience)

✅ **"Mon site respecte le RGPD avec l'anonymisation des IP"** (fonctionnalité activée dans le code)

### Captures d'écran à préparer

Avant la soutenance, prends des captures d'écran de :
1. Vue d'ensemble (nombre total de visiteurs)
2. Temps réel (pour montrer l'activité en direct pendant la soutenance si possible)
3. Pages les plus vues (tes projets les plus populaires)

---

## 🔐 Sécurité et RGPD

### Est-ce que Google Analytics respecte le RGPD ?

✅ **Oui**, avec les paramètres que j'ai configurés :

1. **Anonymisation des IP** : Activée dans le code
   ```javascript
   anonymize_ip: true
   ```

2. **Pas de cookies tiers** : Google Analytics 4 n'utilise plus de cookies publicitaires

3. **ID de mesure public** : Ton ID `G-XXXXXXXXXX` peut être visible dans le code (c'est normal et sans danger)

### Dois-je afficher une bannière de cookies ?

Pour un portfolio étudiant, **ce n'est pas obligatoire** si :
- Tu n'utilises pas de cookies publicitaires (✅ c'est le cas)
- Tu anonymises les IP (✅ c'est fait)
- Tu n'as pas de cookies de tracking tiers (✅ c'est le cas)

**Mais tu peux ajouter une mention dans les mentions légales** :
> "Ce site utilise Google Analytics pour mesurer son audience de manière anonyme."

---

## 🐛 Dépannage

### Problème 1 : "ID de mesure non configuré" dans la console

**Solution** :
- Vérifie que tu as bien ajouté `VITE_GA_MEASUREMENT_ID` dans `.env`
- Redémarre ton serveur de développement (`npm run dev`)

### Problème 2 : Aucune donnée dans Google Analytics

**Solutions possibles** :

1. **Attends 24-48h** : Google Analytics peut mettre du temps à afficher les premières données

2. **Vérifie l'ID** : Assure-toi que l'ID dans `.env` correspond exactement à celui de Google Analytics

3. **Vérifie sur Vercel** : L'environnement de production a-t-il la variable configurée ?

4. **Désactive les bloqueurs de pub** : AdBlock et autres extensions peuvent bloquer Google Analytics

### Problème 3 : Les données ne s'affichent qu'en local, pas en production

**Solution** :
- Tu as oublié de configurer la variable sur Vercel
- Retourne à l'**Étape 4** et ajoute `VITE_GA_MEASUREMENT_ID` sur Vercel

---

## 📚 Ressources utiles

- **Google Analytics Academy** : https://analytics.google.com/analytics/academy/
- **Documentation GA4** : https://support.google.com/analytics/
- **Google Analytics en temps réel** : Parfait pour tester pendant la soutenance

---

## ✅ Checklist de configuration

Avant la soutenance, assure-toi que :

- [ ] Compte Google Analytics créé
- [ ] ID de mesure récupéré (format `G-XXXXXXXXXX`)
- [ ] Variable `VITE_GA_MEASUREMENT_ID` ajoutée dans `.env`
- [ ] Variable configurée sur Vercel (Settings → Environment Variables)
- [ ] Site redéployé sur Vercel après configuration
- [ ] Test en local réussi (message dans la console)
- [ ] Test en production réussi (activité visible dans "Temps réel")
- [ ] Captures d'écran prises pour la soutenance

---

## 💬 Besoin d'aide ?

Si tu rencontres un problème :
1. Vérifie la console du navigateur (F12) pour voir les erreurs
2. Assure-toi que l'ID commence bien par `G-`
3. Vérifie que la variable est bien configurée sur Vercel
4. Redémarre le serveur local ou redéploie sur Vercel

**Dernière mise à jour :** 12 janvier 2026
**Statut :** Composant installé, configuration utilisateur requise
