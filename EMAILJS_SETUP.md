# Configuration EmailJS pour le formulaire de contact

## Étape 1 : Créer un compte EmailJS

1. Rendez-vous sur [EmailJS](https://www.emailjs.com/)
2. Cliquez sur "Sign Up" et créez un compte gratuit
3. Confirmez votre email

## Étape 2 : Connecter votre service email

1. Dans le dashboard EmailJS, allez dans "Email Services"
2. Cliquez sur "Add New Service"
3. Choisissez votre fournisseur d'email (Gmail, Outlook, etc.)
4. Suivez les instructions pour connecter votre compte
5. Notez le **Service ID** affiché (ex: `service_abc123`)

## Étape 3 : Créer un template d'email

1. Allez dans "Email Templates"
2. Cliquez sur "Create New Template"
3. Configurez votre template avec les variables suivantes :

```
Sujet : {{subject}}

Nouveau message de : {{from_name}}
Email : {{from_email}}

Message :
{{message}}
```

4. Notez le **Template ID** (ex: `template_xyz789`)

## Étape 4 : Obtenir votre clé publique

1. Allez dans "Account" > "General"
2. Trouvez votre **Public Key** (ex: `abcdef123456`)

## Étape 5 : Configurer votre application

1. Créez un fichier `.env` à la racine du projet (copiez `.env.example`)
2. Remplissez les valeurs avec vos identifiants :

```
REACT_APP_EMAILJS_SERVICE_ID=service_abc123
REACT_APP_EMAILJS_TEMPLATE_ID=template_xyz789
REACT_APP_EMAILJS_PUBLIC_KEY=abcdef123456
```

3. **Important** : Le fichier `.env` est déjà dans `.gitignore`, vos clés ne seront pas partagées sur GitHub

## Étape 6 : Redémarrer l'application

```bash
npm start
```

## Test du formulaire

1. Remplissez le formulaire de contact sur votre site
2. Vérifiez que vous recevez bien l'email sur `rafa2002@hotmail.fr`
3. Si ça ne fonctionne pas, vérifiez la console du navigateur pour les erreurs

## Limite gratuite

Le plan gratuit d'EmailJS permet :
- 200 emails par mois
- 2 templates
- 1 utilisateur

Pour un portfolio personnel, c'est largement suffisant !

## Dépannage

- **Erreur 403** : Vérifiez que votre Public Key est correcte
- **Erreur 404** : Vérifiez vos Service ID et Template ID
- **Email non reçu** : Vérifiez vos spams et que le service email est bien connecté
