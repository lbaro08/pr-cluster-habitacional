# Sistema de Gestión WEB para un Cluster Habitacional

Este repositorio contiene el desarrollo de un sistema web dinámico desarrollado con PHP y estructurado para facilitar la organización de módulos de usuarios, administradores y componentes comunes. El sistema está diseñado para ejecutarse localmente mediante **XAMPP** (8.2.12).

## 👨‍💻 Autoría
Proyecto desarrollado para la materia de Desarrollo WEB del Instituto Tecnológico de Veracruz utilizando herramientas modernas, estructuración modular y buenas prácticas de programación.

## 📁 Estructura del Proyecto
```
├── api/ # Lógica de la API (endpoints)
├── BD/ # Archivos relacionados con la base de datos (scripts .sql, backups)
├── bootstrap/
│      ├── css/ # Estilos de Bootstrap personalizados o integraciones
│      └── js/ # Scripts de Bootstrap
├── config/ # Archivos de configuración general (BD)
├── core/ # Configuración base de los DAO del proyecto
├── models/ # Modelos de datos (interacción con la BD)
├── test/ # Pruebas de la API
├── views/ # Vistas y componentes visuales reutilizables
│     │
│     ├── assets/ # Imagenes y recurso del proyecto
│     ├── js/
│     │ ├── adminJS/ # Scripts exclusivos para el panel de administrador
│     │ ├── generalJS/ # Funcionalidades comunes (validaciones, helpers)
│     │ ├── test/ # Scripts para pruebas o demostraciones
│     │ └── login.js # Script principal de autenticación
│     ├── styles/ # Estilos CSS 
│     ├── templates/
│     │ ├── adminTemplates/ # Plantillas del panel de administrador
│     │ ├── generalTemplates/ # Plantillas de uso común en todo el sistema
│     │ ├── userTemplates/ # Plantillas del panel de usuario
│     │ ├── adminMenu.html # Menú principal del administrador
│     │ ├── userMenu.html # Menú principal del usuario
│     │ ├── info.html # Página de información
│     │ └── sobreNosotros.html # Página "Sobre nosotros"
│
├── favicon.ico
├── index.html # Página de inicio
└── README.md
```

## ⚙️ Requisitos

- [XAMPP (8.2.12)](https://www.apachefriends.org/)
- Navegador moderno (Chrome, Firefox, Edge)
- Editor de texto (recomendado: VSCode)

## 🚀 Instalación y ejecución

1. Clona este repositorio en la carpeta `htdocs` de XAMPP:
```bash
   git clone https://github.com/AscCrs/pr-cluster-habitacional.git
```

2. Inicia Apache y MySQL desde el panel de XAMPP.

3. Importa la base de datos:

- Abre http://localhost/phpmyadmin
- Crea una nueva base de datos
- Importa el archivo SQL que se encuentra en la carpeta BD

4. Accede al sistema desde tu navegador:
```
http://localhost/pr-cluster-habitacional/index.html
```

## 🧩 Módulos del sistema
- Login: Módulo de autenticación ubicado en `js/login/` y gestionado desde `login.js`
- Panel de Administrador: Interfaz exclusiva con funcionalidades administrativas (`adminTemplates/`, `adminJS/`)
- Panel de Usuario: Interfaz orientada al usuario final (`userTemplates/`, `userMenu.html`)
- Componentes generales: Incluyen vistas comunes como `info.html` y `sobreNosotros.html`
