import {
  ActivityIndicator,
  InputAccessoryView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Dropdown from "../components/Dropdown";
import OrdenCompraCard from "../components/ordenesCompra/OrdenCompraCard";
import useOrdenCompra from "../hooks/useOrdenCompra";
import styles from "../styles/ordenesCompraStyles";

const ID_TECLADO = "tecladoOrdenCompra";

export default function OrdenesCompra({ navigation }) {
  const {
    ordenesFiltradas,
    proveedores,
    productos,
    cargando,
    guardando,
    busqueda, setBusqueda,
    mostrarFormulario, setMostrarFormulario,
    proveedorNuevo, cambiarProveedor,
    detallesNuevos,
    totalNuevo,
    actualizarDetalle,
    agregarDetalle,
    quitarDetalle,
    handleCrear,
    handleEliminar,
    cargarDatos,
    obtenerNombreProveedor,
  } = useOrdenCompra();

  const renderDetalleFormulario = (detalle) => {
    const productosDelProveedor = productos.filter(
      (p) => String(p.proveedor_id) === String(proveedorNuevo),
    );

    return (
      <View style={styles.filaDetalleFormulario} key={detalle.id}>
        <View style={styles.campoPrecio}>
          {!proveedorNuevo ? (
            <Text style={styles.textoOpcion}>Elegí un proveedor primero.</Text>
          ) : productosDelProveedor.length === 0 ? (
            <Text style={styles.textoOpcion}>Este proveedor no tiene productos.</Text>
          ) : (
            <Dropdown
              opciones={productosDelProveedor}
              valor={detalle.productoId}
              onChange={(id) => {
                const item = productosDelProveedor.find((p) => String(p.id) === String(id));
                actualizarDetalle(detalle.id, {
                  productoId: id,
                  precioUnitario: item?.precio_compra || item?.precio,
                });
              }}
              placeholder="Seleccioná un producto"
              disabled={guardando}
              maxHeight={150}
            />
          )}
        </View>
        <TextInput
          style={styles.campoCantidad}
          placeholder="Cant."
          value={String(detalle.cantidad)}
          onChangeText={(cantidad) => actualizarDetalle(detalle.id, { cantidad })}
          keyboardType="numeric"
          editable={!guardando}
          inputAccessoryViewID={ID_TECLADO}
        />
        <View style={[styles.campoPrecio, { justifyContent: "center", backgroundColor: "#F3EEE8" }]}>
          {detalle.precioUnitario ? (
            <>
              <Text style={{ color: "#302820", fontWeight: "bold" }}>
                $ {(Number(detalle.precioUnitario) * (Number(detalle.cantidad) || 0)).toLocaleString("es-AR")}
              </Text>
              <Text style={{ color: "#8C8178", fontSize: 11 }}>
                $ {Number(detalle.precioUnitario).toLocaleString("es-AR")} c/u
              </Text>
            </>
          ) : (
            <Text style={{ color: "#8C8178" }}>Precio</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.botonQuitarDetalle}
          onPress={() => quitarDetalle(detalle.id)}
          disabled={guardando}
        >
          <Text style={styles.textoQuitarDetalle}>×</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.contenedor}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        refreshControl={<RefreshControl refreshing={false} onRefresh={cargarDatos} />}
      >
        <View style={styles.encabezado}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.flecha}>←</Text>
          </TouchableOpacity>
          <Text style={styles.titulo}>Órdenes de compra</Text>
        </View>
        <Text style={styles.subtitulo}>Gestión de compras</Text>
        <TextInput
          style={styles.buscador}
          placeholder="Buscar por proveedor o número..."
          placeholderTextColor="#888"
          value={busqueda}
          onChangeText={setBusqueda}
        />
        <TouchableOpacity
          style={styles.botonAgregar}
          onPress={() => setMostrarFormulario(true)}
        >
          <Text style={styles.textoBoton}>+ Nueva orden de compra</Text>
        </TouchableOpacity>

        {mostrarFormulario && (
          <View style={styles.tarjeta}>
            <Text style={styles.numeroOrden}>Nueva orden de compra</Text>
            <Dropdown
              opciones={proveedores}
              valor={proveedorNuevo}
              onChange={cambiarProveedor}
              placeholder="Seleccioná un proveedor"
              disabled={guardando}
            />
            {detallesNuevos.map(renderDetalleFormulario)}
            <TouchableOpacity style={styles.botonAgregar} onPress={agregarDetalle} disabled={guardando}>
              <Text style={styles.textoBoton}>+ Agregar producto</Text>
            </TouchableOpacity>
            <Text style={styles.textoTotalFormulario}>
              Total: $ {totalNuevo.toLocaleString("es-AR")}
            </Text>
            <TouchableOpacity
              style={[styles.botonAgregar, guardando && styles.botonGuardarDeshabilitado]}
              onPress={handleCrear}
              disabled={guardando}
            >
              {guardando ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.textoBoton}>Guardar orden</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.botonCancelar} onPress={() => setMostrarFormulario(false)}>
              <Text style={styles.textoCancelar}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}

        {cargando ? (
          <ActivityIndicator size="large" color="#F15A29" style={styles.indicadorCarga} />
        ) : (
          <View style={styles.lista}>
            {ordenesFiltradas.length === 0 ? (
              <Text style={styles.textoVacio}>No hay órdenes de compra registradas.</Text>
            ) : (
              ordenesFiltradas.map((item) => (
                <OrdenCompraCard
                  key={String(item.id)}
                  orden={item}
                  nombreProveedor={obtenerNombreProveedor(item)}
                  onEliminar={handleEliminar}
                />
              ))
            )}
          </View>
        )}
      </ScrollView>

      {Platform.OS === "ios" && (
        <InputAccessoryView nativeID={ID_TECLADO}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              backgroundColor: "#F1ECE6",
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}
          >
            <TouchableOpacity onPress={() => Keyboard.dismiss()}>
              <Text style={{ color: "#F15A29", fontWeight: "bold", fontSize: 16 }}>Listo</Text>
            </TouchableOpacity>
          </View>
        </InputAccessoryView>
      )}
    </KeyboardAvoidingView>
  );
}
