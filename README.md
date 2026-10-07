# DSW-2026-Frontend

Frontend del Trabajo Práctico de Desarrollo de Software. Sistema de reserva de espacios.

## Stack

- React
- TypeScript
- Vite
- ESLint
- npm 

## Requisitos previos

- Node.js 24.x.
- npm.
- Backend del proyecto ejecutándose para consultar o modificar datos.

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/mateonunez1907/DSW-2026-Frontend.git
cd DSW-2026-Frontend
```
Instalar las dependencias: 

```bash
npm install
```

## Ejecución en desarrollo

Iniciar el frontend:

```bash 
npm run dev
```

Abrir la dirección que muestra la terminal, normalmente `http://localhost:5173`.

Para utilizar las consultas a la API, iniciar también el backend en otra terminal, desde su carpeta:

```bash
npm run start:dev
```

El backend debe estar disponible en `http://localhost:3000`.

Durante el desarrollo, Vite reenvía las solicitudes que empiezan con `/api` al backend mediante el proxy configurado en `vite.config.ts`.

## Scripts disponibles

- `npm run dev`: inicia el servidor de desarrollo.
- `npm run build`: comprueba TypeScript y genera la aplicación en `dist`.
- `npm run preview`: permite visualizar localmente la compilación generada previamente con `npm run build`.
- `npm run lint`: revisa el código con ESLint.