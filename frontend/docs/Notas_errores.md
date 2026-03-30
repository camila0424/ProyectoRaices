Solución: resolver problemas de conectividad del servidor de desarrollo de Vite en WSL2/Windows

Problema:

- El proyecto se inicializó y desarrolló dentro de WSL2 (Ubuntu).
- Los módulos de Node.js se instalaron desde WSL, lo que provocó que los binarios fueran incompatibles con la ejecución nativa de Windows.
- Al ejecutar `npm run dev` desde WSL, Vite se conectó a una interfaz de red interna de WSL, lo que lo hizo inaccesible desde el navegador de Windows (ERR_CONNECTION_REFUSED).
- Intentar acceder a través de la IP de WSL (172.x.x.x) resultó en una carga infinita.
- La resolución de localhost se interrumpió debido al aislamiento de red de WSL2.

Síntomas:

- Página en blanco sin errores en la consola ni solicitudes de red en las herramientas de desarrollo.
- Vite informó "listo", pero el navegador no pudo conectarse.
- `npx tsc --noEmit` no devolvió errores (el código era correcto).
- `ss` y `netstat` no están disponibles o no son compatibles en el espacio de nombres de red de WSL2.

Causa raíz:

- Los binarios de `node_modules/.bin` se compilaron para Linux (WSL) y no son reconocidos por Node.js en Windows.
- El comando `vite` no se reconoce como interno ni externo al ejecutarse desde PowerShell.

Solución:

- Restablecer la pila de red de Windows: `netsh int ip reset` (ejecutar como administrador) + reiniciar el sistema.
- Reinstalar las dependencias desde PowerShell nativo de Windows: `npm install`.
- Ejecutar el servidor de desarrollo exclusivamente desde PowerShell (no desde la terminal de WSL): `npm run dev`.

Nota para el desarrollo futuro:

- Ejecutar siempre `npm install` y `npm run dev` desde PowerShell o CMD de Windows, nunca desde la terminal de WSL.
- Si se cambia entre WSL y Windows, eliminar `node_modules` y reinstalar desde el entorno correcto.
- Considerar agregar una nota en `.npmrc` o README para reforzar esta recomendación.
