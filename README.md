# Sabores Andinos — App móvil

App de gestión para **Sabores Andinos S.R.L.** hecha con **React Native + Expo (SDK 57)** y **Supabase** como base de datos.
Proyecto de la Práctica Profesional II — ISDEM Nº 8207.

---

## Cómo correr el proyecto

1. Instalar las dependencias:
   ```bash
   npm install
   ```
2. Crear un archivo `.env` en la raíz (al lado de `package.json`) con las claves de Supabase:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=TU_CLAVE_PUBLICA
   ```
   > El `.env` no se sube a GitHub (está en el `.gitignore`). Pedile las claves al grupo.
3. Arrancar Expo:
   ```bash
   npx expo start -c
   ```
4. Escanear el QR con **Expo Go** (misma cuenta de Expo en la compu y en el celu).

---

## Cambios realizados (Pablo Aguirre)

### 1. Nuevo producto — `src/screens/nuevosProductos.js`
- **Alertas que funcionan en web y celular**: se agregó `mostrarMensaje()`. En web usa `globalThis.alert`, en el celu `Alert.alert`.
- Al guardar con éxito: en web avisa y vuelve atrás; en el celu muestra un cartel con botón **Aceptar**.
- **Imagen desde la galería** (en lugar de pegar una URL):
  - Botón **Seleccionar imagen** con `expo-image-picker`.
  - Vista previa de 120×120.
  - Al guardar, la foto se sube a **Supabase Storage** (bucket `productos`) y se guarda la URL pública.
  - En edición se muestra la imagen que ya tenía.

### 2. Órdenes de compra — `src/screens/OrdenesCompra.js` y `src/services/ordenesCompraService.js`
- Al elegir un proveedor **solo aparecen sus productos**.
- El precio usa el **precio de compra** (si no tiene, usa el de venta).
- Al cambiar de proveedor se limpian los productos elegidos.
- El **precio no se puede editar**: se calcula solo (**precio × cantidad**) y muestra el precio por unidad abajo (ej: `$ 9.000` / `$ 4.500 c/u`).
- Toda la pantalla ahora **se puede desplazar** (antes quedaba trabada).
- Botón **Listo** arriba del teclado numérico en iPhone y el teclado se baja al deslizar.
- Arreglo del error `null value in column "id" of relation "detalle_orden_compra"`: ahora cada renglón se guarda con id propio (`OC-0003-1`, `OC-0003-2`...).

### 3. Proveedores — `src/screens/GestionProveedores.js`
- Cada tarjeta muestra el **ID** del proveedor.
- Datos con etiqueta: **Nombre de la empresa**, **Catálogo**, **Nombre del proveedor** y **Número de teléfono**.
- El formulario de agregar/editar tiene un título arriba de cada campo y muestra el ID al editar.

### 4. Login — `src/screens/Login.js`
- El título "Bienvenido" ahora cambia según la hora del celular:
  - 6:00 a 11:59 → **Buenos días**
  - 12:00 a 19:59 → **Buenas tardes**
  - 20:00 a 5:59 → **Buenas noches**
- Debajo, una frase que también cambia con la hora (ej: *"Iniciá sesión y arrancá el día"*).

### 5. Home — `src/screens/Home.js`
- La **alerta de inventario** ya no muestra un número fijo (antes decía siempre 7): cuenta en Supabase los productos con stock **entre 1 y 15**, la misma regla que la pantalla de productos críticos.
- Nueva caja **ENTREGADOS** junto a PENDIENTES y EN RUTA.

### 6. Pedidos — `src/screens/ListaPedidos.js` y `src/screens/NuevoPedido.js` (nuevo)
- **Cambiar el estado de un pedido** con un botón:
  ```
  PENDIENTE ──🚚 Enviar──▶ EN RUTA ──✅ Entregado──▶ ENTREGADO
   (est001)                (est005)                  (est004)
  ```
- Cada pedido muestra el **nombre del cliente** y los **productos que compró** (cantidad y subtotal).
- **Nueva pantalla "Nuevo pedido"** (botón **+ Nuevo pedido** en Pendientes):
  - Elegir cliente, productos con cantidad y método de pago.
  - El total se calcula solo. No deja pedir más que el stock disponible.
  - Si un producto no tiene precio de venta, se calcula con *precio de compra + margen*.
  - Al guardar: el pedido queda **Pendiente**, se guarda el detalle de productos y **se descuenta el stock**.
- La pantalla se registró en `src/navigation/Navegation.js`.

---

## Cambios necesarios en Supabase

Correr en el **SQL Editor** (una sola vez):

```sql
-- fotos de productos (bucket "productos" creado como público en Storage)
create policy "subir fotos productos"
on storage.objects for insert
to anon, authenticated
with check (bucket_id = 'productos');

create policy "ver fotos productos"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'productos');

-- poder cambiar el estado de los pedidos desde la app
grant update on pedidos to anon, authenticated;

create policy "cambiar estado pedidos"
on pedidos for update
to anon, authenticated
using (true)
with check (true);

-- detalle de productos de cada pedido
create table detalle_pedido (
  id text primary key,
  "pedidoId" text not null,
  "productoId" text not null,
  cantidad integer not null,
  "precioUnitario" numeric not null,
  subtotal numeric not null
);

grant select, insert, update, delete on detalle_pedido to anon, authenticated;
```

> Si alguna policy ya existe, Supabase avisa con un error de "already exists": se puede ignorar.
