# Configuration de l'authentification GitHub

## 🔑 Option 1 : Token d'accès personnel (Recommandé - Plus simple)

### Étape 1 : Créer un token sur GitHub

1. Aller sur : [https://github.com/settings/tokens](https://github.com/settings/tokens)

2. Cliquer sur **"Generate new token"** → **"Generate new token (classic)"**

3. Configurer le token :
   - **Note** : `mon-portfolio-token` (ou autre nom)
   - **Expiration** : Choisir la durée (ex: 90 jours ou No expiration)
   - **Scopes** : Cocher uniquement :
     - ✅ `repo` (Full control of private repositories)

4. Cliquer sur **"Generate token"**

5. **IMPORTANT** : Copier le token immédiatement (il commence par `ghp_...`)
   - ⚠️ Vous ne pourrez plus le voir après avoir quitté la page !

### Étape 2 : Configurer Git pour utiliser le token

Ouvrir un terminal et exécuter :

```bash
# Configurer Git pour stocker les credentials
git config --global credential.helper store

# Essayer de push (Git demandera les identifiants)
cd /Users/rafael/mon-portfolio
git push
```

Quand Git demande :
- **Username** : Votre username GitHub (ex: `rafaelpir`)
- **Password** : Coller le token (`ghp_...`) - PAS votre mot de passe GitHub !

Le token sera sauvegardé et vous n'aurez plus besoin de le rentrer.

---

## 🔑 Option 2 : Clé SSH (Plus sécurisé, plus technique)

### Étape 1 : Générer une clé SSH

```bash
# Générer la clé (remplacer par votre email GitHub)
ssh-keygen -t ed25519 -C "votre-email@example.com"

# Appuyer sur Entrée 3 fois (accepter le chemin par défaut, pas de passphrase)
```

### Étape 2 : Ajouter la clé à l'agent SSH

```bash
# Démarrer l'agent SSH
eval "$(ssh-agent -s)"

# Ajouter la clé
ssh-add ~/.ssh/id_ed25519
```

### Étape 3 : Copier la clé publique

```bash
# Afficher et copier la clé publique
cat ~/.ssh/id_ed25519.pub
```

Copier TOUTE la sortie (commence par `ssh-ed25519...`)

### Étape 4 : Ajouter la clé sur GitHub

1. Aller sur : [https://github.com/settings/keys](https://github.com/settings/keys)

2. Cliquer sur **"New SSH key"**

3. Configurer :
   - **Title** : `Mac Portfolio` (ou autre nom)
   - **Key** : Coller la clé publique copiée

4. Cliquer sur **"Add SSH key"**

### Étape 5 : Changer l'URL du repo en SSH

```bash
cd /Users/rafael/mon-portfolio
git remote set-url origin git@github.com:rafaelpir/mon-portfolio.git
```

### Étape 6 : Tester

```bash
# Tester la connexion SSH
ssh -T git@github.com

# Push
git push
```

---

## ✅ Vérifier que ça fonctionne

Après configuration, exécuter :

```bash
cd /Users/rafael/mon-portfolio
git push
```

Si ça fonctionne, vous verrez :
```
Enumerating objects: X, done.
Counting objects: 100% (X/X), done.
...
To https://github.com/rafaelpir/mon-portfolio.git
   xxxxxxx..yyyyyyy  main -> main
```

---

## 🆘 Problèmes courants

**"Authentication failed"**
- Token : Vérifier que vous avez bien collé le token (pas votre mot de passe)
- SSH : Vérifier que la clé est bien ajoutée sur GitHub

**"Permission denied"**
- SSH : Vérifier que `ssh -T git@github.com` fonctionne

**"Could not read from remote repository"**
- Vérifier que l'URL du repo est correcte : `git remote -v`

---

**Recommandation** : Commencer par l'Option 1 (Token), c'est plus rapide !
