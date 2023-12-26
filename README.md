# NodeJS: De cero a experto (USER STORE)

## Acerca de

Este es un repositorio personal para ejecución de los proyectos del cursos **NodeJS: De cero a experto** de **Fernando Herrera** en Udemy. Para acceder al curso completo puede hacer [clic aquí](https://www.udemy.com/course/node-de-cero-a-experto/)

El proyecto desarrollado a continuación es un xxxx implementado con Express. En el proceso se exploran fundamentos de Arquitectura Limpias entre otros conceptos más de arquitectura de software.

## Requerimientos

- Node 20.9.0 LTS
- Express 4.18.2
- Docker 24.0.5

## Instalación del proyecto

Para instalar el proyecto siga los siguientes pasos

Instalar módulos o dependencias

```
npm install
```

## Ejecución del proyecto

Para ejecutar el proyecto se deben seguir los siguientes pasos:

1. Clonar el archivo `.env.template` a `.env`
2. Configurar variables de entorno

```
PORT=3000
PUBLIC_PATH=public
```

3. Levantar las bases de datos

```
docker compose up -d

```

4. Generar las migraciones de Prisma a la base de dato de Postgres

```
npx prisma migrate dev

```

5. Correr el proyecto usando alguno de los siguientes scripts según el entorno

Ejecutar entorno de desarrollo

```
npm run dev
```

Ejecutar entorno de producción

```
npm start
```
