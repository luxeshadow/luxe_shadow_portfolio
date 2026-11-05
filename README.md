# Portfolio — Kore Bleza Natanael

Site statique en HTML, CSS et JavaScript, sans framework ni compilation.

## Structure
- `index.html` : structure des pages et formulaire de contact.
- `assets/css/main.css` : mise en page, responsive et thèmes.
- `assets/css/contact.css` : section contact.
- `assets/js/main.js` : données des projets, technologies, navigation, thème et contact.
- `assets/images/` : emplacement des nouveaux visuels.
- `img/` : médias existants et CV conservés.
- `archive/ancien-site/` : sauvegarde du site précédent.

## Lancer
Ouvrir `index.html` ou démarrer un serveur statique à la racine.

## Personnaliser
Les listes `skills`, `stacks`, `projects` et les coordonnées `contactDetails` sont dans `assets/js/main.js`.
Les vignettes sont provisoires. Les polices Inter et Space Grotesk ainsi que les icônes Flaticon sont chargées depuis leurs CDN.
Le formulaire ouvre le logiciel email du visiteur ; aucun serveur d’envoi n’est configuré.
Le choix du thème est mémorisé dans le navigateur.

## Français / English
- i18next 25.6.0 est embarqué dans `assets/vendor/`, sans dépendance réseau pour traduire.
- Les textes sont dans `assets/js/translations.js` (dictionnaires français et anglais).
- `assets/js/i18n.js` applique la traduction aux textes, placeholders, descriptions et libellés accessibles sans reconstruire les formulaires.
- Le choix est mémorisé dans `portfolio-language`. Français est la langue par défaut.
- Les textes ajoutés aux projets doivent aussi être ajoutés aux deux dictionnaires.
