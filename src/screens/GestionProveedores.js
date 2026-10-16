import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ImageBackground,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import {
  actualizarProveedor,
  crearProveedor,
  eliminarProveedor,
  obtenerProveedores,
} from "../services/proveedoresService";
import styles from "../styles/gestionProveedoresStyles";

const FONDO_ANDINO = require("../../assets/Splashscreen/fondo_paisaje_andino_1080x2524.jpg");

export default function GestionProveedores({ navigation }) {
  const [proveedores, setProveedores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [proveedorEditando, setProveedorEditando] = useState(null);
  const [nombre, setNombre] = useState("");
  const [contacto, setContacto] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rubro, setRubro] = useState("");

  const cargarProveedores = useCallback(async () => {
    try {
      setCargando(true);
      setError("");
      setProveedores(await obtenerProveedores());
    } catch (err) {
      console.error("Error al cargar proveedores:", err);
      setError(err?.message || "No se pudieron cargar los proveedores.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarProveedores();
  }, [cargarProveedores]);

  const limpiarFormulario = () => {
    setProveedorEditando(null);
    setNombre("");
    setContacto("");
    setTelefono("");
    setRubro("");
  };

  const mostrarMensaje = (titulo, mensaje) => {
    if (Platform.OS === "web") globalThis.alert(`${titulo}\n\n${mensaje}`);
    else Alert.alert(titulo, mensaje);
  };

  const abrirNuevoProveedor = () => {
    limpiarFormulario();
    setModalVisible(true);
  };

  const abrirEdicion = (proveedor) => {
    setProveedorEditando(proveedor);
    setNombre(proveedor.nombre || "");
    setContacto(proveedor.contacto || "");
    setTelefono(proveedor.telefono || "");
    setRubro(proveedor.rubro || "");
    setModalVisible(true);
  };

  const guardarProveedor = async () => {
    if (!nombre.trim() || !contacto.trim() || !telefono.trim()) {
      mostrarMensaje("Campos incompletos", "Completá el nombre de la empresa, el nombre del proveedor y el teléfono.");
      return;
    }

    try {
      setGuardando(true);
      const datos = {
        nombre: nombre.trim(),
        contacto: contacto.trim(),
        telefono: telefono.trim(),
        rubro: rubro.trim(),
      };
      if (proveedorEditando) await actualizarProveedor(proveedorEditando.id, datos);
      else await crearProveedor(datos);
      setModalVisible(false);
      limpiarFormulario();
      await cargarProveedores();
      mostrarMensaje(
        "Operación exitosa",
        proveedorEditando
          ? "El proveedor se actualizó correctamente."
          : "El proveedor se agregó correctamente.",
      );
    } catch (err) {
      console.error("Error al guardar proveedor:", err);
      mostrarMensaje("Error", err?.message || "No se pudo guardar el proveedor.");
    } finally {
      setGuardando(false);
    }
  };

  const solicitarEliminacion = (proveedor) => {
    const ejecutar = async () => {
      try {
        setCargando(true);
        await eliminarProveedor(proveedor.id);
        await cargarProveedores();
        mostrarMensaje("Proveedor eliminado", "El proveedor se eliminó correctamente.");
      } catch (err) {
        console.error("Error al eliminar proveedor:", err);
        mostrarMensaje("Error al eliminar", err?.message || "No se pudo eliminar el proveedor.");
      } finally {
        setCargando(false);
      }
    };
    const mensaje = `¿Seguro que querés eliminar a ${proveedor.nombre}? Esta acción no se puede deshacer.`;
    if (Platform.OS === "web") {
      if (globalThis.confirm(mensaje)) ejecutar();
      return;
    }
    Alert.alert("Eliminar proveedor", mensaje, [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: ejecutar },
    ]);
  };

  const renderProveedor = ({ item }) => (
    <View style={styles.tarjeta}>
      {/* id del proveedor arriba de todo */}
      <Text style={{ color: "#F15A29", fontWeight: "bold", marginBottom: 6 }}>
        ID: {item.id}
      </Text>
      <Text style={styles.textoInfo}>
        <Text style={{ fontWeight: "bold" }}>Nombre de la empresa: </Text>
        {item.nombre || "Sin nombre"}
      </Text>
      <Text style={styles.textoInfo}>
        <Text style={{ fontWeight: "bold" }}>Catálogo: </Text>
        {item.rubro || "Sin catálogo"}
      </Text>
      <Text style={styles.textoInfo}>
        <Text style={{ fontWeight: "bold" }}>Nombre del proveedor: </Text>
        {item.contacto || "No especificado"}
      </Text>
      <Text style={styles.textoInfo}>
        <Text style={{ fontWeight: "bold" }}>Número de teléfono: </Text>
        {item.telefono || "No especificado"}
      </Text>
      <View style={styles.acciones}>
        <TouchableOpacity onPress={() => abrirEdicion(item)} style={styles.botonEditar}>
          <Ionicons name="create-outline" size={20} color="#2c2119" />
          <Text style={styles.textoEditar}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => solicitarEliminacion(item)} style={styles.botonEliminar}>
          <Ionicons name="trash-outline" size={20} color="#B94C43" />
          <Text style={styles.textoEliminar}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.contenedor}>
      <ImageBackground
        source={FONDO_ANDINO}
        resizeMode="cover"
        style={styles.encabezado}
        imageStyle={styles.imagenEncabezado}
      >
        <View style={styles.filaEncabezado}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.botonVolver}>
            <Ionicons name="chevron-back" size={26} color="#25344A" />
          </TouchableOpacity>
          <Text style={styles.titulo}>Gestión de Proveedores</Text>
          <MaterialCommunityIcons
            name="truck-outline"
            size={24}
            color="#25344A"
            style={styles.iconoEncabezado}
          />
        </View>
      </ImageBackground>

      <TouchableOpacity onPress={abrirNuevoProveedor} style={styles.botonAgregar}>
        <Text style={styles.textoBotonAgregar}>+ Agregar proveedor</Text>
      </TouchableOpacity>

      {cargando ? (
        <ActivityIndicator size="large" color="#F15B2A" />
      ) : error ? (
        <View style={styles.errorContenedor}>
          <Text style={styles.textoError}>{error}</Text>
          <TouchableOpacity onPress={cargarProveedores} style={styles.botonReintentar}>
            <Text style={styles.textoReintentar}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={proveedores}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderProveedor}
          contentContainerStyle={styles.lista}
          refreshing={cargando}
          onRefresh={cargarProveedores}
          ListEmptyComponent={<Text style={styles.textoVacio}>No hay proveedores registrados.</Text>}
        />
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalFondo}>
          <View style={styles.modalTarjeta}>
            <Text style={styles.tituloModal}>
              {proveedorEditando ? "Editar proveedor" : "Agregar proveedor"}
            </Text>
            {/* el id solo se muestra al editar (al agregar se crea solo) */}
            {proveedorEditando ? (
              <Text style={{ color: "#F15A29", fontWeight: "bold", marginBottom: 10 }}>
                ID: {proveedorEditando.id}
              </Text>
            ) : null}

            <Text style={{ fontWeight: "600", marginBottom: 4 }}>Nombre de la empresa:</Text>
            <TextInput
              placeholder="Ej: Dulces de la Quebrada"
              value={nombre}
              onChangeText={setNombre}
              style={styles.campo}
            />

            <Text style={{ fontWeight: "600", marginTop: 10, marginBottom: 4 }}>Catálogo:</Text>
            <TextInput
              placeholder="Ej: Dulces"
              value={rubro}
              onChangeText={setRubro}
              style={styles.campo}
            />

            <Text style={{ fontWeight: "600", marginTop: 10, marginBottom: 4 }}>Nombre del proveedor:</Text>
            <TextInput
              placeholder="Ej: Rosa Cruz"
              value={contacto}
              onChangeText={setContacto}
              style={styles.campo}
            />

            <Text style={{ fontWeight: "600", marginTop: 10, marginBottom: 4 }}>Número de teléfono:</Text>
            <TextInput
              placeholder="Ej: 3874889900"
              value={telefono}
              onChangeText={setTelefono}
              keyboardType="phone-pad"
              style={styles.campo}
            />
            <View style={styles.botonesModal}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                disabled={guardando}
                style={styles.botonCancelar}
              >
                <Text style={styles.textoCancelar}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={guardarProveedor}
                disabled={guardando}
                style={[styles.botonGuardar, guardando && styles.botonGuardarDeshabilitado]}
              >
                {guardando ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.textoGuardar}>
                    {proveedorEditando ? "Guardar cambios" : "Agregar proveedor"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}