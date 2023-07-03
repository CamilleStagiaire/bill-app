# bill-app

# Débuggez et testez un SaaS RH - Projet 9
https://github.com/CamilleStagiaire/bill-app.git

*Formation Développeur d'application - JavaScript React*

# Etapes
* installation et configuration du projet :
- git clone https://github.com/OpenClassrooms-Student-Center/Billed-app-FR-Back.git
- git clone https://github.com/OpenClassrooms-Student-Center/Billed-app-FR-Front.git
- cd Billed-app-FR-Back
    _ npm install
    _ npm run run:dev
- cd Billed-app-FR-Front
    _ npm install
    _ npm install -g live-server
    _ live-server
    _ npm run test
    _ npm i -g jest-cli
    _ jest src/__tests__/your_test_file.js

* Debug :
- [Bug report] - Bills : affichage par ordre décroissant
- [Bug report] - Login : connexion admin
- [Bug Hunt] - Bills : contrôle des extensions
- [Bug Hunt] - Dashboard : navigation admins dans le dashboard

* Tests unitaires et d'intégration Bills.js :
- Finir le test d'intégration "Then bill icon in vertical layout should be highlighted"
- Test unitaire "Then handleClickNewBill should navigate to new bill"
- Test unitaire "Then a click event listener should be attached to the eye icon"
- Test d'intégration "Integration test - Then getBills should retrieve and format bills from API"
- Test d'intégration "Integration test - Then getBills should throw an error for bad dates"

* Tests unitaires et d'intégration NewBill.js :
- Construire le test unitaire "Then 'envoyer une note de frais' text should be present on the page"
- Test unitaire "Then handleChangeFile should return an alert for incorrect file format"
- Test d'intégration "Integration test - Then it should POST a new bill"


## Comptes et utilisateurs :

Vous pouvez vous connecter en utilisant les comptes:

### administrateur : 
```
utilisateur : admin@test.tld 
mot de passe : admin
```
### employé :
```
utilisateur : employee@test.tld
mot de passe : employee


# Compétences évaluées:

- Débugger une application web avec le Chrome Debugger
- Ecrire des tests unitaires avec JavaScript
- Ecrire des tests d'intégration avec JavaScript
- Rédiger un plan de test end-to-end manuel