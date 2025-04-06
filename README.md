# Proyectos Inmobiliarios

Este es un proyecto web para la gestión y visualización de proyectos inmobiliarios. Está construido utilizando tecnologías modernas para garantizar un rendimiento óptimo y una experiencia de usuario fluida.

## Características

- Gestión de proyectos inmobiliarios.
- Visualización de estadísticas y datos relevantes.
- Integración con Firebase para autenticación y base de datos.
- Diseño responsivo y moderno.

## Tecnologías Utilizadas

- **Next.js**: Framework de React para aplicaciones web.
- **Firebase**: Backend como servicio para autenticación y base de datos.
- **Tailwind CSS**: Framework de CSS para diseño responsivo.
- **Radix UI**: Componentes accesibles y personalizables.

## Instalación

Sigue estos pasos para configurar el proyecto localmente:

1. Clona este repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd proyectos-inmobiliarios
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   Crea un archivo `.env.local` en la raíz del proyecto y añade las siguientes variables:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=<tu_api_key>
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<tu_auth_domain>
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=<tu_project_id>
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<tu_storage_bucket>
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<tu_messaging_sender_id>
   NEXT_PUBLIC_FIREBASE_APP_ID=<tu_app_id>
   ```

4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo.
- `npm run build`: Construye la aplicación para producción.
- `npm run start`: Inicia el servidor en modo producción.
- `npm run lint`: Ejecuta el linter para verificar errores de código.

## Estructura del Proyecto

```
proyectos-inmobiliarios/
├── components/       # Componentes reutilizables
├── pages/            # Páginas de la aplicación
├── public/           # Archivos estáticos
├── styles/           # Archivos de estilos
├── lib/              # Funciones y utilidades
├── .env.local        # Variables de entorno
└── README.md         # Documentación del proyecto
```

## Contribución

Si deseas contribuir a este proyecto, sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz un commit (`git commit -m 'Añadir nueva funcionalidad'`).
4. Sube tus cambios (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

## Contacto

Si tienes preguntas o sugerencias, no dudes en contactarnos a través de [correo electrónico](mailto:info@formulard.com).