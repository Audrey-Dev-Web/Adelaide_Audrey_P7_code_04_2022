# GROUPOMANIA

## Créer un réseaux social d'entreprise

## INSTALLATION

Depuis le dossier api: `npm install`
Depuis le dossier client: `npm install`

### Avant de démarrer l'application, il va vous falloir créer

A la racine du dossier api le dossier `images` et le fichier `.env`

#### Vous devez ensuite remplir le fichier .env

PORT = '8080' (Port sur lequel fonctionnera votre api)

DB_HOST = 'host de votre base de donnée MySQL' (si vous êtes en local)
DB_DATABASE = 'Groupomania' (le nom que vous souhaitez donner à la base de donnée)
DB_PORT = '3307' (le port de votre server MySQL)

DB_CONNEC_ACC = 'login BDD' (nom de compte compte MySQL)
DB_CONNEC_PASS = 'password BDD' (Mot de pass de votre compte MySQL)

SECRET_TOKEN = 'password token' (utilisé pour bcrypt)
SECRET_EMAIL = 'pass email' (utilisé pour crypto-js)

### DEMARRAGE DE L'APPLICATION

Afin de démarrer l'application

Depuis le dossier api : `npm start`
Depuis le dossier client : `npm start`

Une fois que tout est configuré, les tables et la base de donnée de l'application sera créé automatiquement au démarrage

Un compte utilisateur sera aussi créé avec les identifiants suivant :

Login: `admin@groupomania.fr`
password : `admin`

Ces identifiants vous permettrons de vous connecter à l'application avec les droits administrateurs mais vous pouvez aussi créer un compte utilisateur, comme bon vous semble!

L'amin peut suprimer les articles et le compte de tous les utilisateurs et il ne peut y avoir qu'un seul compte admin
