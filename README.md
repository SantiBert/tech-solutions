# Actores y Películas

## Challenge de codigo de Santiago Bertero para Techcode

## Instalación 

ubicarse en la carpeta del backend:
cd backend

el repositorio ya cuenta con un archivo db con registros, lo que no es necesario realizar una conección a la base de datos o realizar las migraciones, aun así están en la carpeta src/prisma

instalamos las dependencias:
npm i

para iniciar el servidor:
npm run dev

una vez el servidor está corriendo ubicarse en la carpeta del frontend:

cd .. && cd front

instalamos las dependencias:
npm i

para iniciar el front:
npm run start

el fron comenzará a correr en el puerto 3000

## Login

http://localhost:3000/login

cuentas disponibles:

email: bpitt3@dsds.com
pass: .tz&2%3X_qKVTs$

email: bpitt4@dsds.com
pass: .tz&2%3X_qKVTs$

email: bpitt5@dsds.com
pass: .tz&2%3X_qKVTs$

email: bpitt6@dsds.com
pass: .tz&2%3X_qKVTs$

email: bpitt7@dsds.com
pass: .tz&2%3X_qKVTs$

## Crear cuenta
http://localhost:3000/register

NOTA: al crear la cuenta el hash para activar la cuenta se verá en la terminal del backend

## Activar cuenta
http://localhost:3000/activate-account

## Home 

http://localhost:3000/ 

Buscador de películas.
La db cuenta con 12 películas y 6 tv shows regístrados para probarla

## POSTMAN FILE
En caso de querere probar otros endpoints no incluidos en el proyecto utilizar el archivo json en postman
file = 'tech-solution.postman_collection.json'