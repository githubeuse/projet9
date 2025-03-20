
# Billed Application


## Description

Billed est une application web de gestion des notes de frais pour les employés et les administrateurs.<br> 
Les employés peuvent soumettre leurs notes de frais avec les justificatifs, tandis que les administrateurs peuvent les examiner, les approuver ou les refuser.

## Installation

1. Clonez le dépôt :

```sh
git https://github.com/githubeuse/projet9.git
cd projet9
```

2. Installez sur votre appareil, Node Version Manager.
Rendez-vous sur ce lien : https://github.com/coreybutler/nvm-windows/releases<br>
Sélectionnez par ex : nvm-setup.exe<br>
Procéder à l'installation complète avec les options par défaut.

3. Redémarrez votre éditeur de code (VS Code par ex)<br>
puis installez la version de node 18.16.1,<br>
basculez sur celle-ci et vérifiez que c'est bien la version node 18.16.1 qui est utilisée<br>
```sh
nvm install 18.16.1
nvm use 18.16.1
node -v
``` 
Vous devriez avoir comme résultat : v18.16.1 pour la commande node-v
Si ce n'est pas le cas, rendez-vous au point #résolution de problèmes

4. Vous pouvez alors installer les dépendances sur le back-end

```sh
npm back
npm install
``` 

5. Vous pouvez installer les dépendances sur le front-end
```sh
npm front
npm install
``` 


## Scripts

1. Pour lancer l'application en mode développement (backend) :
```sh
npm run run:dev
```
Le terminal vous indiquera sur quelle URL le serveur se lancera, par ex : https://localhost:5678/ <br>
Vous devriez y voir ce message si le serveur se lance bien : "Bill App backend API v1"

2. Pour lancer le serveur de développement (frontend) :
```sh
live-server
```
Le terminal vous indiquera sur quelle URL l'application se lancera, par ex : https://127.0.0.1:8080/

## Comptes et utilisateurs

Vous pouvez vous connecter en utilisant les comptes :

### Administrateur :

- utilisateur : 
```sh
admin@test.tld 
```
- mot de passe : 
```sh
admin
```

### Employé :


- utilisateur : 
```sh
employee@test.tld
```

- mot de passe : 
```sh
employee
```


## Lancement de tests

1. Pour lancer tous les tests en local avec Jest :

```sh
cd front
npm run test
```

2. Pour lancer un seul test :

```sh
cd front
npx jest src/__tests__/your_test_file.js
```

3. Pour voir la couverture des tests :<br>
http://127.0.0.1:8080/coverage/lcov-report/

## Résolution de problèmes

1. Ouvrir Powershell en mode administrateur

2. Entrer la commande pour pouvoir gérer l’execution de scripts dans powershell :
```sh
Set-ExecutionPolicy RemoteSigned
```

3. Fermer toutes les instances de terminal<br>
entrer la commande suivante pour installer la gestion des variables d’environnement node pour window
```sh
npm install -g win-node-env
```

4. reprendre à #installation au point 4.