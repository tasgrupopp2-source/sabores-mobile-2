# Sabores Andinos — Documentación del Proyecto

## Descripción General

App móvil de gestión para **Sabores Andinos S.R.L.**, una empresa de especias y productos regionales. Permite administrar productos, proveedores, clientes, pedidos y órdenes de compra.

**Stack tecnológico:**
- **Frontend:** React Native + Expo SDK 57
- **Backend:** Supabase (Auth, Database, Storage)
- **Navegación:** React Navigation (native-stack)
- **Fuentes:** Cormorant (headers) + Open Sans (body)

---

## Estructura de Carpetas

```
sabores-mobile-2/
├── App.js                    # Punto de entrada. Carga fuentes y monta Navigation.
├── .env                      # Credenciales Supabase (NO se sube a git)
├── assets/                   # Imágenes (splash, login, productos, iconos)
└── src/
    ├── config/theme.js       # Colores y fuentes de la marca
    ├── navigation/Navegation.js  # Stack Navigator con todas las rutas
    ├── screens/              # Pantallas (UI pura, max 300 líneas)
    ├── hooks/                # Lógica de negocio extraída (max 250 líneas)
    ├── components/           # Componentes reutilizables
    ├── services/             # Comunicación con Supabase
    ├── styles/               # StyleSheets extraídos (max 300 líneas)
    ├── data/                 # Datos estáticos (imágenes de productos)
    └── util/                 # Funciones utilitarias
```

---

## Arquitectura Modular

Cada pantalla sigue el patrón:
- **Screen** → solo JSX/UI, importa su hook y estilos
- **Hook** → toda la lógica (estados, efectos, funciones CRUD)
- **Styles** → StyleSheet separado
- **Components** → piezas de UI reutilizables

---

## Flujo de Navegación

```
SplashScreen → Login ──→ Home (pantalla principal)
                │
                ├── SignUp (registro)
                └── RecuperarPassword → VerificarCorreo → NuevaPassword
```

### Desde Home se accede a:

| Sección | Pantalla | Descripción |
|---------|----------|-------------|
| Productos | `GestionProductos` | Lista, busca y elimina productos |
| Productos | `nuevosProductos` | Crea/edita productos con imagen |
| Proveedores | `GestionProveedores` | ABM de proveedores |
| Órdenes | `OrdenesCompra` | Crea órdenes con dropdown de proveedor/productos |
| Pedidos | `ListaPedidos` | Lista pedidos por estado (Pendiente → En ruta → Entregado) |
| Pedidos | `NuevoPedido` | Crea pedido: cliente + productos + método de pago |
| Clientes | `Clientes` | ABM de clientes con historial de pedidos |
| Perfil | `Perfil` | Datos del usuario, cambio de contraseña, cerrar sesión |

---

## Pantallas y sus Hooks/Componentes

### 1. SplashScreen
- **Hook:** `useSplashAnimations` — animaciones de entrada (logo, iconos, ventana)
- Después de 4 segundos navega a Login

### 2. Login
- Autenticación con `supabase.auth.signInWithPassword()`
- Si hay sesión activa, redirige a Home automáticamente

### 3. SignUp (Registro)
- **Hook:** `useSignUp` — validación de campos, `supabase.auth.signUp()`
- Envía email de verificación con redirect URL

### 4. RecuperarPassword
- Envía email de recuperación con `supabase.auth.resetPasswordForEmail()`

### 5. VerificarCorreo
- **Hook:** `useCodigoOtp` — input de 6 dígitos con auto-avance
- Verifica código OTP con `supabase.auth.verifyOtp()`

### 6. NuevaPassword
- **Componente:** `RequisitosSeguridad` — muestra requisitos (largo, mayúscula, número)
- Actualiza contraseña con `supabase.auth.updateUser()`

### 7. Home
- **Hook:** `useHome` — cuenta pedidos por estado y productos críticos (stock < 5)
- **Componente:** `PanelControl` — grid de 4 botones de navegación
- Muestra dashboard: pedidos pendientes, en ruta, entregados, productos críticos

### 8. GestionProductos
- Lista productos desde Supabase con buscador
- **Componentes:** `BuscadorProductos`, `ProductoCard`
- Navega a `nuevosProductos` para crear/editar

### 9. nuevosProductos (Crear/Editar Producto)
- **Hook:** `useProductoForm` — form con validación, selección de imagen, subida a Supabase Storage
- Usa `expo-image-picker` para elegir foto
- Sube imagen al bucket "productos" de Supabase Storage
- Campos: nombre, precio compra, margen, stock, proveedor, descripción, imagen

### 10. GestionProveedores
- ABM completo de proveedores (nombre, contacto, teléfono, email, dirección)
- Modal para crear/editar

### 11. OrdenesCompra (Órdenes de compra)
- **Hook:** `useOrdenCompra` — CRUD de órdenes con detalles
- **Componente:** `Dropdown` — selector desplegable reutilizable
- Proveedor y productos se seleccionan con **dropdowns** (no botones)
- Cada orden tiene: proveedor, productos con cantidad y precio, total calculado

### 12. ListaPedidos
- **Hook:** `usePedidos` — carga pedidos con cliente, detalles y productos
- **Componente:** `PedidoCard` — tarjeta con estado, cliente, productos, total
- Flujo de estados: Pendiente → En ruta → Entregado (botón "Avanzar estado")

### 13. NuevoPedido
- **Hook:** `useNuevoPedido` — carga clientes, productos (con stock > 0), métodos de pago
- **Estilos:** `nuevoPedidoStyles`
- Selección por chips (cliente, método pago) y filas con cantidad (productos)
- Calcula total automático, descuenta stock al guardar
- Genera ID secuencial (ped001, ped002...)

### 14. Clientes
- **Hook:** `useClientes` — ABM de clientes
- **Componentes:** `BuscadorClientes`, `ClienteCard`, `FormularioCliente`, `PedidosCliente`
- Muestra historial de pedidos por cliente

### 15. Perfil
- **Hook:** `usePerfil` — datos del usuario, actualización de nombre/apellido
- **Componente:** `PerfilSeguridad` — cambio de contraseña con validación
- Cerrar sesión con `supabase.auth.signOut()`

### 16. ProductosCriticosCliente
- Muestra productos con stock menor a 5 unidades
- Alerta visual para reposición

---

## Servicios (comunicación con Supabase)

| Archivo | Tabla | Operaciones |
|---------|-------|-------------|
| `supabase.js` | — | Cliente Supabase (singleton) |
| `clientesServices.js` | `clientes` | obtener, crear, actualizar, eliminar |
| `productosServices.js` | `productos` | obtener, crear, actualizar, eliminar |
| `proveedoresService.js` | `proveedores` | obtener, crear, actualizar, eliminar |
| `ordenesCompraService.js` | `ordenes_compra` + `detalle_orden_compra` | CRUD con detalles |
| `perfilServices.js` | `usuarios` / auth | obtener y actualizar perfil |

---

## Tablas de Supabase (base de datos)

| Tabla | Campos principales |
|-------|-------------------|
| `productos` | id, nombre, precio, precio_compra, margen, stock, proveedorId, descripcion, imagen |
| `proveedores` | id, nombre, contacto, telefono, email, direccion |
| `clientes` | id, nombre, apellido, telefono, email, direccion |
| `pedidos` | id, clienteId, fecha, total, trabajadorId, estadoId, metodoPagoId |
| `detalle_pedido` | id, pedidoId, productoId, cantidad, precioUnitario, subtotal |
| `ordenes_compra` | id, proveedorId, fecha, total, estado |
| `detalle_orden_compra` | id, ordenId, productoId, cantidad, precioUnitario, subtotal |
| `metodosPago` | id, nombre, activo |
| `estados` | id, nombre (Pendiente, En ruta, Entregado) |

---

## Componentes Reutilizables

| Componente | Uso |
|-----------|-----|
| `Dropdown` | Selector desplegable con scroll y checkmark (órdenes de compra) |
| `BottomNavigation` | Barra inferior con 3 tabs: Inicio, Productos, Perfil |
| `AnimatedIcon` | Ícono animado para la barra de navegación |
| `Button` | Botón estilizado genérico |
| `Input` | Campo de texto estilizado |
| `PasswordField` | Campo de contraseña con ojo para mostrar/ocultar |
| `PasswordEye` | Ícono del ojo (mostrar/ocultar contraseña) |

---

## Variables de Entorno (.env)

```
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxxx
```

> **IMPORTANTE:** El archivo `.env` NO se sube a git. Cada desarrollador debe crear el suyo con las credenciales de Supabase.

---

## Cómo ejecutar

```bash
npm install
npx expo start
```

Escanear el QR con Expo Go (Android/iOS) o presionar `w` para abrir en navegador web.
