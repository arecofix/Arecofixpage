# Guía Paso a Paso: Testing del Carrito con Cypress

Este documento explica cómo se realizan las pruebas automatizadas (E2E) utilizando Cypress para el flujo del carrito de compras ("compracarrito").

## 1. Llamada Inicial al Sitio Web
El test comienza simulando a un usuario real que entra a la aplicación.
- Utilizamos el comando `cy.visit('/repuestos')` para abrir la página donde se listan los productos. Cypress levanta un navegador automatizado (por defecto Electron, Chrome o Firefox) y carga tu aplicación Angular/Ionic como si fuera un humano.

## 2. Interacción con el Carrito (Validación de Funciones)
Una vez cargada la página, Cypress busca elementos en el DOM (la estructura HTML) e interactúa con ellos.
- **Agregar al carrito:** Usamos `cy.get('button').contains('Agregar al Carrito').first().click()` para encontrar el primer botón de agregar producto y hacer clic en él.
- **Validación visual:** Se comprueba que aparezca un mensaje de éxito con `cy.contains('Agregaste un producto al carrito').should('be.visible')`.
- **Apertura del modal:** Se hace clic en el ícono del carrito y se verifica que el carrito se despliegue y que el texto "Tu carrito está vacío" no exista (`.should('not.exist')`), comprobando así la lógica interna del estado del carrito.

## 3. Flujo de Checkout
El test simula la navegación a la página de pago.
- Completamos automáticamente los formularios del usuario utilizando `cy.get('input[formControlName="..."]').type('Valor')`.
- Avanzamos por los pasos de checkout haciendo clic en los botones correspondientes hasta llegar a la confirmación final de la reserva.

## 4. Validación de la Conexión a la Base de Datos (Supabase)
Aquí es donde nos aseguramos de que todos los datos se envíen de manera correcta y estructurada.
- **Interceptación de red:** En lugar de saturar la base de datos de producción con datos basura, Cypress intercepta la petición HTTP saliente hacia la base de datos (Supabase) utilizando:
  `cy.intercept('POST', '**/rest/v1/orders*').as('createOrder')`
- **Validación del Payload:** Una vez que el usuario (el test automatizado) hace clic en "Confirmar", Cypress captura la petición interceptada usando `cy.wait('@createOrder')`.
- **Aserciones:** Extraemos el `body` (el contenido de los datos que Angular iba a enviar a la BD) y validamos campo por campo:
  ```javascript
  expect(payload.customer_name).to.equal('Usuario Test');
  expect(payload.payment_method).to.equal('cash');
  // etc...
  ```
Esto garantiza que si en el futuro alguien rompe el formulario, el test detectará que los datos están mal formateados antes de que lleguen a Firebase/Supabase.

## 5. Ejecución
Para correr estos tests, puedes abrir la terminal en la raíz del proyecto y usar:
- `npm run cypress:open` (Abre una interfaz gráfica para ver el bot actuar en tiempo real).
- `npm run test:e2e` (Corre los tests en modo silencioso o "headless", ideal para GitHub Actions).
