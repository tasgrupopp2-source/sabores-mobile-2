// lista de los productos nuevos (no estan en supabase)
// se usa en inicio y en la pantalla de nuevos productos
export const NUEVOS = [
  {
    id: "1",
    nombre: "Canela Cassia",
    descripcion: "Canela en rama de aroma intenso y sabor dulce. Ideal para postres, infusiones y guisos.",
    presentacion: "Bolsa de 100 g",
    precio: 10000,
  },
  {
    id: "2",
    nombre: "Semillas de Lino",
    descripcion: "Semillas enteras ricas en fibra y omega 3. Para sumar a panes, yogures y ensaladas.",
    presentacion: "Bolsa de 500 g",
    precio: 3500,
  },
  {
    id: "3",
    nombre: "Cúrcuma de la Selva",
    descripcion: "Cúrcuma molida de color dorado intenso. Le da sabor y color a arroces, sopas y guisos.",
    presentacion: "Bolsa de 100 g",
    precio: 4900,
  },
  {
    id: "4",
    nombre: "Quinoa Real",
    descripcion: "Quinoa real del altiplano, lavada y lista para cocinar. Fuente natural de proteínas.",
    presentacion: "Bolsa de 1 kg",
    precio: 5800,
  },
  {
    id: "5",
    nombre: "Comino en Grano",
    descripcion: "Comino entero de aroma cálido y terroso. Clásico en empanadas, locros y carnes.",
    presentacion: "Bolsa de 100 g",
    precio: 3200,
  },
];

// pasa el nombre a minuscula y le saca las tildes
// asi "Cúrcuma" y "curcuma" se consideran iguales
function normalizar(texto) {
  return (texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

// cada nombre (ya normalizado) con su foto de assets/productos
// require tiene que ir con la ruta escrita fija
const IMAGENES = {
  "aji molido": require("../../assets/productos/Aji molido.png"),
  "canela cassia": require("../../assets/productos/Canela Cassia.png"),
  "comino en grano": require("../../assets/productos/Comino en Grano.png"),
  "curcuma de selva": require("../../assets/productos/Curcuma de Selva.png"),
  "curcuma de la selva": require("../../assets/productos/Curcuma de Selva.png"),
  "dulce de cayote": require("../../assets/productos/Dulce de Cayote.png"),
  "dulce de leche": require("../../assets/productos/Dulce de leche.png"),
  "harina de algarroba": require("../../assets/productos/harino de algarroba.png"),
  "harino de algarroba": require("../../assets/productos/harino de algarroba.png"),
  "maiz molido": require("../../assets/productos/Maiz Molido.png"),
  "harina de maiz": require("../../assets/productos/Maiz Molido.png"),
  "mermelada de tuna": require("../../assets/productos/Mermelada de tuna.png"),
  "miel de abeja": require("../../assets/productos/Miel de abeja.png"),
  "oregano": require("../../assets/productos/oregano.png"),
  "pimenton": require("../../assets/productos/Pimenton.png"),
  "pimientos en conserva": require("../../assets/productos/Pimientos en conserva.png"),
  "queso de cabra": require("../../assets/productos/Queso de cabra.png"),
  "quinoa real": require("../../assets/productos/Quinoa Real.png"),
  "semillas de lino": require("../../assets/productos/Semillas de Lino.png"),
  "tomates en conserva": require("../../assets/productos/Tomates en conserva.png"),
};

// funcion que devuelve la imagen segun el nombre del producto
// se usa en Home, en Nuevos Productos y en Gestion de Productos
export function obtenerImagen(nombre) {
  const foto = IMAGENES[normalizar(nombre)];
  if (foto) {
    return foto;
  }
  // si no hay foto para ese nombre, imagen de respaldo con el nombre escrito
  const texto = encodeURIComponent(nombre || "Sin imagen");
  return { uri: `https://placehold.co/300x300/F4E1C1/7A3E1D/png?text=${texto}` };
}
