# Configuration Cloudflare - Portfolio Rafael Piral

## 📋 Récapitulatif de la configuration

**Date :** 8 janvier 2026  
**Domaine :** rafaelpiral.fr  
**Hébergement :** Vercel  
**Protection :** Cloudflare (Proxy activé)

---

## ✅ Configuration DNS actuelle

### Records configurés

| Type | Name | Content | Proxy | Status |
|------|------|---------|-------|--------|
| **A** | rafaelpiral.fr | 216.198.79.1 | ✅ Proxied | ✅ |
| **CNAME** | www | vercel-dns-017.com | ✅ Proxied | ✅ |
| **MX** | rafaelpiral.fr | mx1/mx2/mx3.mail.ovh.net | DNS only | ✅ |
| **NS** | rafaelpiral.fr | dns110/ns110.ovh.net | DNS only | ✅ |
| **TXT** | rafaelpiral.fr | SPF record | DNS only | ✅ |

### ✅ Avantages du proxy Cloudflare

- **Performance** : CDN mondial, cache intelligent
- **Sécurité** : Protection DDoS, WAF
- **SSL/TLS** : Certificat gratuit et automatique
- **Analytics** : Statistiques de trafic détaillées

---

## 🔐 Cloudflare Turnstile

### Configuration

**Widget créé :** Portfolio Contact Form  
**Site Key :** `0x4AAAAAACLO8hF51YDnYssB`  
**Domaines autorisés :**
- ✅ rafaelpiral.fr
- ✅ www.rafaelpiral.fr
- ✅ localhost (pour développement local)

**Widget Mode :** Managed  
**Pre-clearance :** Yes  
**Pre-clearance Level :** Managed

### Fonctionnement

1. **Utilisateur remplit le formulaire** de contact
2. **Turnstile vérifie automatiquement** (challenge invisible ou minimal)
3. **Token généré** si l'utilisateur est humain
4. **Formulaire soumis** à Formspree avec le token
5. **Protection contre les bots** sans friction pour les humains

### Fichiers concernés

- `.env` - Contient la clé Turnstile (non versionné)
- `src/pages/Home.jsx` - Intégration du widget
- `TURNSTILE_SETUP.md` - Documentation complète

---

## 🚀 Déploiement Vercel

### Configuration actuelle

**Plateforme :** Vercel  
**Branch déployée :** main  
**Build Command :** `npm run build`  
**Output Directory :** dist  
**Framework :** Vite + React

### DNS pointant vers Vercel

Le CNAME `www` pointe vers Vercel via Cloudflare :
```
www.rafaelpiral.fr → vercel-dns-017.com → Cloudflare Proxy → Vercel
```

Le record A principal est proxifié par Cloudflare.

---

## 🔒 Sécurité

### Protections actives

✅ **Cloudflare Proxy** - Masque l'IP du serveur d'origine  
✅ **SSL/TLS Full** - Chiffrement bout en bout  
✅ **Turnstile** - Protection formulaire contre les bots  
✅ **Formspree** - Gestion sécurisée des emails  
✅ **CORS** - Configuration appropriée  

### Best Practices appliquées

- ✅ Clé Turnstile en variable d'environnement
- ✅ `.env` dans `.gitignore` (non versionné)
- ✅ Secret Key Turnstile jamais exposée côté client
- ✅ Pre-clearance cookie pour meilleure UX

---

## 📊 Monitoring

### Cloudflare Dashboard

Accès : [https://dash.cloudflare.com/](https://dash.cloudflare.com/)

**Métriques disponibles :**
- Trafic et bande passante
- Requêtes bloquées/autorisées
- Performance du cache
- Analytics Turnstile (challenges passés/échoués)

### Vercel Analytics

Accès : [https://vercel.com/dashboard](https://vercel.com/dashboard)

**Métriques disponibles :**
- Core Web Vitals (LCP, FID, CLS)
- Temps de chargement
- Nombre de visiteurs
- Géolocalisation du trafic

---

## 🔧 Maintenance

### Vérifications régulières

**Tous les mois :**
- [ ] Vérifier les analytics Cloudflare
- [ ] Vérifier les stats Turnstile (taux de passage)
- [ ] Contrôler les logs Vercel

**Tous les 3 mois :**
- [ ] Vérifier la validité du certificat SSL (auto-renouvelé)
- [ ] Tester le formulaire de contact
- [ ] Vérifier les records DNS

**Avant expiration du domaine :**
- [ ] Renouveler rafaelpiral.fr chez OVH
- [ ] Vérifier que les nameservers pointent toujours vers Cloudflare

---

## 🆘 Troubleshooting

### Le widget Turnstile ne s'affiche pas

**Solutions :**
1. Vérifier que la clé dans `.env` est correcte
2. Vérifier que le domaine est autorisé dans Cloudflare
3. Vider le cache du navigateur
4. Vérifier la console DevTools pour erreurs

### Le formulaire ne s'envoie pas

**Solutions :**
1. Vérifier que Turnstile a généré un token (console DevTools)
2. Vérifier que Formspree fonctionne (form ID : xjknoepn)
3. Tester avec la clé de test : `1x00000000000000000000AA`

### Erreur "Invalid domain"

**Solution :**
- Ajouter le domaine dans les paramètres Turnstile sur Cloudflare
- Attendre quelques minutes pour la propagation

---

## 📝 Historique des changements

**8 janvier 2026 :**
- ✅ Configuration Cloudflare Turnstile complète
- ✅ Clé de production intégrée
- ✅ Pre-clearance activé (niveau Managed)
- ✅ Documentation mise à jour

**7 janvier 2026 :**
- Installation package @marsidev/react-turnstile
- Intégration dans le formulaire de contact
- Configuration avec clé de test

---

## 📚 Ressources

**Cloudflare :**
- [Dashboard Cloudflare](https://dash.cloudflare.com/)
- [Turnstile Docs](https://developers.cloudflare.com/turnstile/)
- [DNS Management](https://dash.cloudflare.com/?to=/:account/:zone/dns)

**Vercel :**
- [Dashboard Vercel](https://vercel.com/dashboard)
- [Docs DNS](https://vercel.com/docs/projects/domains)

**OVH (Registrar) :**
- [Espace client OVH](https://www.ovh.com/manager/)

---

**Statut global :** ✅ Tout fonctionne correctement  
**Prochaine action :** Tester le formulaire de contact en production
