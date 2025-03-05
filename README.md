# Vuku Dash

## Overview
Vuku Dash is a modern, customizable web dashboard designed to provide quick access to frequently used websites and services. Built with Node.js and containerized with Docker, this application offers a clean, minimalist interface with a focus on customization and ease of use.

## Features
- **Quick Access Shortcuts**: Add, remove, and manage shortcuts to your favorite websites
- **Personalization**: Customize display name, dashboard title, and UI preferences
- **Multiple Themes**: Choose from blue, red, green, or purple themes to match your style
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Shortcut Size Options**: Select from small, medium, or large shortcut tiles
- **Search Integration**: Built-in Google search with URL detection

## Technology Stack
- **Backend**: Node.js with Express
- **Frontend**: HTML5, CSS3, JavaScript
- **Data Storage**: YAML file-based storage for shortcuts and settings
- **Containerization**: Docker with Docker Compose for easy deployment
- **Styling**: Custom CSS with glass-morphism design elements

## Deployment
The application is designed to run in a Docker container, making it easy to deploy on any system that supports Docker.

```yaml
version: '3.8'

services:
 vuku_dash:
   build: .
   ports:
     - "9665:80"
   volumes:
     - /path/to/host/directory:/usr/src/app
   restart: unless-stopped

## Project Structure
vuku_dash/
├── Dockerfile
├── docker-compose.yaml
├── html/
│   ├── css/
│   │   └── styles.css
│   ├── index.html
│   └── settings.html
├── config/
│   └── settings.yaml
├── shortcuts/
│   └── shortcuts.yaml
├── package.json
└── server.js

## Configuration
Settings and shortcuts are stored in YAML files for persistence:

shortcuts.yaml: Stores user-defined shortcuts including name, URL, and icon
settings.yaml: Stores user preferences including display name, theme, and UI settings

## Local Storage Fallback
For improved reliability, user settings are also cached in the browser's localStorage, providing a seamless experience even if there are issues with the server-side storage.

##Customization
The dashboard offers multiple customization options:

Themes: Blue, Red, Green, Purple
Tile Sizes: Small, Medium, Large
Display Name: Personalize your greeting
Dashboard Title: Customize the dashboard title
Language and Timezone: Set your preferred language and timezone (Not Functional)