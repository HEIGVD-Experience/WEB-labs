# Hello, World!

L'objectif de ce laboratoire est d'installer l'environnement de développement et de se familiariser avec GitHub Classroom.
C'est un travail individuel d'introduction qui n'est pas noté.

## Installer node.js et npm

Commencez par installer node.js version 18 LTS à l'aide de [NVM](https://github.com/nvm-sh/nvm).
Lorsque node.js sera installé, l'exécution de la commande `node --version` dans le terminal devrait retourner `v18.12.0` ou plus récent.
De manière similaire, l'exécution de la commande `npm --version` devrait retourner `9.8.0` ou plus récent.

## Copier le code source du laboratoire

Commencez par cloner ce repository sur votre machine à l'aide de `git`.

Ensuite, dans le dossier de l'exercice, exécutez la commande `node hello.js` dans le terminal, puis modifiez le fichier `hello.js` de manière à ce qu'il imprime `Hello World!`, puis commit sur GitHub.
GitHub Classroom effectue des vérifications automatiques et devrait vous donner un premier point.

Toujours dans le dossier de l'exercice, exécutez la commande `node server.js` dans le terminal.
Ouvrez ensuite le navigateur à l'adresse [http://localhost:3000/](http://localhost:3000).
Lisez attentivement le code de manière à identifier clairement les parties qui s'exécutent sur le serveur et celles qui s'exécutent dans le navigateur.

## Initialiser l'environnement de développement

Initialisez maintenant une application JavaScript à l'aide de la commande `npm init` et complétez les informations demandées par l'utilitaire de configuration.

Installez ensuite une dépendance de développement avec la commande `npm install eslint --save-dev`. 
Cette commande installe un [linter](https://en.wikipedia.org/wiki/Lint_(software)) qui vous aidera à corriger le programme `server.js`.
Notez l'apparition du fichier `package.json` (configuration) et du dossier `node_modules/` (dépendances) à la racine du projet.

Exécutez la commande `npx eslint --init` à la racine du projet et complétez les informations demandées par l'utilitaire de configuration ([configuration recommandée](./configuration-eslint.md)). La commande `npx eslint server.js` devrait afficher une liste de problèmes.


## Corriger le projet à l'aide de Visual Studio Code

Pour vous assister dans les corrections, installez [Visual Studio Code](https://code.visualstudio.com/) et l'extension ESLint.
Utilisez les recommandations du linter et l’outil de formatage pour corriger le projet et commitez  sur GitHub. 
Si le linter n'affiche plus aucun problème, GitHub Classroom devrait vous accorder les points restant pour ce travail.
