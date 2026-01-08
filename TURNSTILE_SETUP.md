# Configuration Cloudflare Turnstile

## ✅ Qu'est-ce que Turnstile ?

Cloudflare Turnstile est une alternative moderne et respectueuse de la vie privée aux CAPTCHA traditionnels. Il protège votre formulaire de contact contre les bots sans tracking Google.

**Avantages :**
- ✅ Gratuit pour un usage illimité
- ✅ Respectueux de la vie privée (pas de cookies tiers)
- ✅ Meilleure UX que reCAPTCHA
- ✅ Simple à configurer

---

## 🚀 Configuration (5 minutes)

### Étape 1 : Obtenir votre Site Key

1. Créer un compte Cloudflare (gratuit) : [https://dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)

2. Aller sur la page Turnstile : [https://dash.cloudflare.com/?to=/:account/turnstile](https://dash.cloudflare.com/?to=/:account/turnstile)

3. Cliquer sur **"Add site"**

4. Remplir le formulaire :
   - **Site name** : `Portfolio Contact Form` (ou autre nom)
   - **Domain** : Votre nom de domaine (ex: `rafaelpiral.fr`)
     - Pour tester en local, ajouter aussi `localhost`
   - **Widget Mode** : `Managed` (recommandé)

5. Cliquer sur **"Create"**

6. Copier votre **Site Key** (commence par `0x...`)

### Étape 2 : Configurer le projet

1. Ouvrir le fichier `.env` à la racine du projet

2. Remplacer la clé de test par votre vraie clé :
```bash
VITE_TURNSTILE_SITE_KEY=votre_vraie_site_key_ici
```

3. Sauvegarder le fichier

### Étape 3 : Tester

1. Lancer le projet en mode développement :
```bash
npm run dev
```

2. Aller sur la page Contact

3. Remplir le formulaire - vous devriez voir le widget Turnstile apparaître

4. Le bouton "ENVOYER" ne s'active que si Turnstile valide l'utilisateur

---

## 🔒 Sécurité

**Important :** La Site Key est publique et peut être visible dans le code frontend. C'est normal et sécurisé.

**Le fichier `.env` ne sera JAMAIS poussé sur GitHub** (il est dans `.gitignore`)

---

## 🎨 Apparence

Le widget Turnstile s'adapte automatiquement au thème de votre portfolio :
- Mode clair → Widget clair
- Mode sombre → Widget sombre

---

## 🧪 Clé de test

Une clé de test est incluse par défaut : `1x00000000000000000000AA`

Cette clé **passe toujours** et permet de tester le fonctionnement sans configurer Turnstile.

⚠️ **Ne l'utilisez PAS en production** - elle accepte tous les bots !

---

## ❓ FAQ

**Q : Le widget ne s'affiche pas**
- Vérifiez que votre domaine est bien ajouté dans les paramètres Turnstile
- Vérifiez que la clé dans `.env` est correcte
- Videz le cache du navigateur

**Q : Est-ce gratuit ?**
- Oui, Turnstile est 100% gratuit pour un usage illimité

**Q : Puis-je utiliser plusieurs domaines ?**
- Oui, ajoutez tous vos domaines dans les paramètres Turnstile (production, staging, localhost)

**Q : Quelle est la différence avec reCAPTCHA ?**
- Turnstile ne nécessite pas de compte Google
- Pas de tracking publicitaire
- Meilleure expérience utilisateur
- Pas de "Je ne suis pas un robot"

---

## 📚 Documentation officielle

[Cloudflare Turnstile Docs](https://developers.cloudflare.com/turnstile/)

---

**Date de configuration :** 7 janvier 2026
**Dernière mise à jour :** 8 janvier 2026
**Statut :** ✅ Intégré et configuré avec clé de production
**Domaine :** rafaelpiral.fr
