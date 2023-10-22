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

creo la cartella api

nella cartella creo index.js

- npm i nodemon : installo nodemon poi modifico package.json creando gli script "dev" (usa nodemon) e "start" (usa node)

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




