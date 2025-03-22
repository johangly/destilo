# Manual de Instalación - D-estilo Plus

### Requisitos Previos
1. Descargar e instalar Node.js
   - Visita https://nodejs.org/es/
   - Descarga la versión LTS (soporte a largo plazo) para Windows
   - Ejecuta el instalador descargado y sigue las instrucciones del asistente
   - Para verificar la instalación, abre una terminal (Windows + R, escribe "cmd" y presiona Enter)
   - Escribe `node --version` y `npm --version` para confirmar que ambos están instalados

### Instalación de la Aplicación
1. Descomprime el archivo ZIP
   - Haz clic derecho sobre el archivo ZIP que recibiste
   - Selecciona "Extraer todo..."
   - Elige una ubicación de fácil acceso (por ejemplo, C:\D-estilo-plus)
   - Haz clic en "Extraer"

2. Instalar las dependencias
   - Abre una terminal (Windows + R, escribe "cmd" y presiona Enter)
   - Navega hasta la carpeta del proyecto usando el comando:
     ```
     cd C:\ruta\donde\extrajiste\D-estilo-plus
     ```
   - Ejecuta el siguiente comando para instalar todas las dependencias:
     ```
     npm install
     ```
   - Espera a que termine la instalación (esto puede tomar varios minutos)

3. Configurar la aplicación
   - En la carpeta del proyecto, busca el archivo `.env.example` (si existe)
   - Crea una copia y renómbrala a `.env`
   - Configura las variables de entorno necesarias según las instrucciones del archivo

4. Iniciar la aplicación
   - En la misma terminal, ejecuta:
     ```
     npm run build
     ```
   - Una vez completada la construcción, ejecuta:
     ```
     npm run dev
     ```
   - La aplicación estará disponible en tu navegador web en: http://localhost:3000

### Solución de Problemas Comunes
- Si recibes un error de "puerto en uso", asegúrate de que el puerto 3000 no esté siendo utilizado por otra aplicación
- Si hay problemas con la instalación de dependencias, intenta eliminar la carpeta `node_modules` y el archivo `package-lock.json`, luego ejecuta `npm install` nuevamente
- Para cualquier otro error, asegúrate de tener una conexión estable a internet y que todos los pasos anteriores se hayan completado correctamente

### Requisitos Mínimos del Sistema
- Sistema Operativo: Windows 10 o superior
- Memoria RAM: 4GB mínimo (8GB recomendado)
- Espacio en disco: 1GB mínimo de espacio libre
- Navegador web actualizado (Chrome, Firefox, o Edge en sus últimas versiones)
