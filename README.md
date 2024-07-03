## Requisitos Previos

- Tener Docker y Docker Compose instalados en tu máquina. Puedes seguir las instrucciones oficiales de instalación:
    - [Docker](https://docs.docker.com/engine/install/)
    - [Docker Compose](https://docs.docker.com/compose/install/)

## Estructura del Proyecto

El archivo `docker-compose.yml` proporciona la configuración necesaria para desplegar los servicios involucrados en tu proyecto. Los servicios definidos son:

1. **db**: Base de datos PostgreSQL la cual incluye la extensión de PostGIS, necesaria para el almacenamiento y posterior conexión con Geoserver.
2. **geoserver**: Un contenedor de GeoServer, que es el que nos permitirá la visualización de los datos geográficos almacenados en la base de datos PostgreSQL.
3. **app**: Un contenedor para el fronend y el backend desarrollado en Node.js y Angular.

## Contenido del Archivo `docker-compose.yml`

```yml
version: '3.9'

services:
  db:
    build: ./DB
    container_name: DB-postgis
    environment:
      POSTGRES_DB: ips_bogota
      POSTGRES_USER: root
      POSTGRES_PASSWORD: F%&C&3L88bmZ7Q2
    ports:
      - "5432:5432"
    volumes:
      - ./DB/docker-data:/var/lib/postgresql/data

  geoserver:
    image: oscarfonts/geoserver:latest
    container_name: geoserver
    environment:
      - GEOSERVER_CORS_ENABLED=true
      - GEOSERVER_CORS_ALLOWED_ORIGINS=*
      - GEOSERVER_CORS_ALLOWED_METHODS=GET,POST,PUT,DELETE,OPTIONS
      - GEOSERVER_CORS_ALLOWED_HEADERS=Content-Type,Authorization, application/json
      - GEOSERVER_CORS_URL_PATTERN=/*
    depends_on:
      - db
    ports:
      - "8080:8080"
    volumes:
      - ./GeoServer/data_dir:/var/local/geoserver
      - ./GeoServer/map_style:/var/local/geoserver/map_style
      - ./GeoServer/web.xml:/usr/local/geoserver/WEB-INF/web.xml

  app:
    image: node:lts-alpine3.20
    container_name: node-js
    depends_on:
      - geoserver
      - db
    ports:
      - "4200:4200"
      - "3000:3000"
    volumes:
      - ./node:/app
    command: sh start.sh
    working_dir: /app
```

## Pasos para la Ejecución del Proyecto

1. **Descomprime el archivo .zip enviado**, este archivo contiene todas las carpetas y configuraciones listas para ser desplegadas por docker, no se requieren configuraciones adicionales. [link](https://1drv.ms/u/c/b5fc889227dbcb16/EScBT7P8bq9GujlYfGMVb_UBFHNoDCAg8yy_rZXNUADzkA?e=BB8ykX)
   - Alternativa, **Clona el Repositorio** del proyecto. Esto conlleva una desventaja y relacionada con el almacenamiento de las configuraciones y capas alojadas en el servidor de geoserver, que incluyen los datos geográficos por lo que se sugiere utilizar el archivo **.zip**
    ```sh
    git clone https://github.com/OjoVerde/Realtix
    cd
    ```
2. **Construye los Contenedores** Ejecuta el siguiente comando para construir y levantar los contenedores definidos en el archivo `docker-compose.yml`.
   ```sh
   docker-compose up --build
   ```
3. **Verifica la Ejecución de los Servicios**
   - **PostGIS (Base de Datos):** La base de datos estará accesible en `localhost:5432`. Puedes conectarte usando un cliente de PostgreSQL como `psql` o una herramienta GUI como pgAdmin.
   - **GeoServer:** La interfaz de GeoServer estará disponible en `http://localhost:8080/geoserver`.
   - **App:** El backend en Node.js estará disponible en el puertos `3000` y el frontend se disponibiliza en el puerto `4200` según se necesite.
## Notas Adicionales
- **Persistencia de Datos:** Los volúmenes definidos aseguran que los datos de la base de datos y las configuraciones de GeoServer se mantengan persistentes incluso si los contenedores se detienen o se recrean.
- **Archivos de Configuración:** Asegúrate de que los archivos y directorios mencionados (`./DB/docker-data`, `./GeoServer/data_dir`, etc.) existen y contienen la configuración necesaria para tu aplicación.