# Video Streamer Frontend
A modern React + TypeScript + Tailwind CSS single-page application (SPA) compiled into static assets and served by Nginx, which also functions as a reverse proxy for backend REST API requests. The entire setup is containerized using Docker and orchestrated with Docker Compose for easy deployment and scalability.

## Overview
This repository contains the frontend application and its server configuration. The application is built into optimized static assets and delivered via Nginx, which additionally proxies API requests (e.g., /api/*) to the backend service. The frontend implements client-side routing to provide a seamless user experience.

## Features
- React + TypeScript SPA
- Tailwind CSS utility-first styling
- Reverse proxy for backend API (e.g., /api → upstream)
- Optional CORS preflight handling on the proxy if needed
- Dockerized build
- Docker Compose orchestration

## Tech Stack
|Item| Type|
|--|--|
|Frontend| React, TypeScript, Tailwind CSS, Vite|
|Server|Nginx|
|Containerrization| Docker|
|Orchestration| Docker Compose|
|Package Manager| npm|

## Prerequisites
- Docker ≥ 20.x
- Docker Compose ≥ v2.x
- (For local dev) Node.js ≥ 18.x and npm ≥ 9.x

## Setup
1. **Clone and configure** (TODO: API URL configuration)
```
git clone git@github.com:allandark/VideoStreamerFrontend.git
```
2. **Build and run via Docker Compose**
```
docker compose up --build -d
# Access at http://localhost:8080 (or your mapped port)
```
3. **Stop**
```
docker compose down
```

## Configuration
In `docker-compose.yaml` there are environment variables for configuration.   
>Note: the backend api is on the same docker network and is refered as such
```
environment:
      HOST: localhost
      SERVER_NAME: localhost
      PORT: 8080
      API_SERVER_NAME: rest-api
```

## Development Workflow
**Install & run locally**
```
cd React/Frontend
npm ci
npm run dev
```
**Build locally** 
```
npm run build
```

## Project Structure
```
.
├── Nginx/
│   └── nginx.conf.template     # Nginx configuration
├── React/
│   └── Frontend/
│       ├── src/                # React source dir
│       │   ├── api/            # Api calls
│       │   ├── components/     # React components
│       │   ├── pages/          # Pages
│       │   ├── services/       # Helper services
│       │   ├── App.tsx         # Endpoint routing
│       │   ├── index.css       # Tailwind setup
│       │   ├── main.tsx        # React main file
│       │   └── Types.ts        # Types and interfaces
│       ├── index.html          # Main html file
│       ├── entry.sh            # Docker entrypoint script
│       ├── vite.config.ts      # Vite configurations
│       ├── package.json        # NPM packages
│       └── tsconfig.json       # Type Script configuration
├── docker-compose.yaml         # Docker compose file
├── Dockerfile                  # Docker image
├── .gitignore                  
├── .gitattributes
└── README.md
```