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
-esLint

* Debug :
- [Bug report] - Bills : affichage par ordre décroissant
- [Bug report] - Login : connexion admin
- [Bug Hunt] - Bills : contrôle des extensions
- [Bug Hunt] - Dashboard : navigation admin dans le dashboard

* Tests Bills.js :
- Tests d'intégration:
    "Then it should fetch bills from the mock API GET"
    "Then it should throw an error for bad dates"
    "Then getBills should fail with a 404 error"
    "Then getBills should fail with a 500 error"

- Tests unitaires :
    "Then bill icon in vertical layout should be highlighted" _ Test à finir
    "Then bills should be ordered from earliest to latest"_ Test déja fourni
    "Then handleClickNewBill should navigate to new bill"
    "Then handleClickIconEye should be called Then handleClickIconEye should be called when the eye icon is clicked when the eye icon is clicked"
 

* Tests NewBill.js :
- Tests unitaires :
    "Then 'envoyer une note de frais' text should be present on the page" _ Test à construire
    "Then handleChangeFile should return an alert for incorrect file format"

- Tests d'intégration:
    "Then it should successfully POST a new bill"
    "Then handleSubmit should fail with 404 error"
    "Then handleSubmit should fail with 500 error"

* Test End-to-End

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