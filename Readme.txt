MERN ESTATE
============
Directory del progetto : MernEstate

- CREAZIONE DEL CLIENT :

- npm create vite@latest client : uso vite per creare la cartella CLIENT ed installare REACT , scegliere react e JavaScript+SWC

- cd client

- npm install

- npm run dev

INSTALLIAMO Tailwind CSS con Vite:

https://tailwindcss.com/docs/guides/vite : seguire i passi indicati

- cancellare App.css 

- cancellare nella cartella public il file vite.svg

- canvellare nella cartella assets il file react.svg

- Modificare App.jsx : cancellare tutto e creare un react functional component con rfc

INIZIALIZZAMO il git repository :

- git init

- git add .

- git commit -m "Messaggio"

CREARE un nuovo repository su github.com e poi una volta creato seguire questi comandi nel terminale

- git remote add origin https://github.com/LeoLeonidus/mern-estate.git
- git branch -M main
- git push -u origin main

ADESSO installiamo il react-router-dom :
- npm install react-router-dom

PER le icons:
- npm install react-icons


MI PORTO nella dir principale del progetto (MernEstate) e inizializzo

- cd ..
- npm init -y
- npm i express : installo express

CREAZIONE DEL SERVER :
======================

creo la cartella api

nella cartella creo index.js

- npm i nodemon : installo nodemon poi modifico package.json creando gli script "dev" (usa nodemon) e "start" (usa node)

- npm run dev : per lanciare 


COLLEGAMENTO AL DB MONGODB
==========================

dalla dir del progetto (MernEstate) installo mongoose

-npm install mongoose

vado sul sito di mongodb e creo un nuovo db

DB name : mern-estate
User: verzonimassimo
Password: 2kalC6i6jPmbQ3Il

una volta creato scelgo Cloud Environment

nell' IP Address aggiungere 0.0.0.0 per avere un accesso indipendentemente dall'IP

Successivo : vedere Connect your application - Drivers

Creo il file .env per la stringa di connessione al DB , per poterla leggere con process.env.MONGO devo installare :

- npm install dotenv

poi aggiungere .env alla file del .gitignore

PER CRIPTARE LA PASSWORD

- npm install bcryptjs

PER INDIRIZZARE LE RICHIESTE DEL CLIENT SULLA PORTA 3000 MODIFICARE VITE.CONFIG.GS :

export default defineConfig({
  
  server:{
    proxy:{
      '/api': {
        target: 'http://localhost:3000',
        secure: false
      }
    }
  },

  plugins: [react()],
})

INSTALLARE JSONWEBTOKEN PER L'AUTENTICAZIONE : dalla root MernEstate

-npm install jsonwebtoken


INSTALLARE REDUX TOOLKIT (https://redux-toolkit.js.org/)

- cd client
- npm install @reduxjs/toolkit react-redux

USARE REDUX PERSIST per evitare che i dati inseriti vengano persi se reload della pagina nel browser

- npm install redux-persist ( sempre nel client )

modificare store.js per usarlo , poi nel main.js avvolgere la App nel PersistGate

OAUTH GOOGLE : UTILIZZO DI FIREBASE PER AUTENTICARSI CON LE CREDENZIALI GOOGLE

https://firebase.google.com/

- npm install firebase ( nel client )







-
