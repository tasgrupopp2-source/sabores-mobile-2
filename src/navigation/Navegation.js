import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Importamos las pantallas de la aplicación.
import Clientes from "../screens/Clientes";
import GestionProductos from "../screens/GestionProductos";
import GestionProveedores from "../screens/GestionProveedores";
import Home from "../screens/Home";
import OrdenesCompra from "../screens/OrdenesCompra";
import ListaPedidos from "../screens/ListaPedidos";
import NuevoPedido from "../screens/NuevoPedido";
import Login from "../screens/Login";
import NuevaPassword from "../screens/NuevaPassword";
import NuevosProductos from "../screens/nuevosProductos";
import Perfil from "../screens/Perfil";
import ProductosCriticosCliente from "../screens/ProductosCriticosCliente";
import RecuperarPassword from "../screens/RecuperarPassword";
import SignUp from "../screens/SignUp";
import SplashScreen from "../screens/SplashScreen";
import VerificarCorreo from "../screens/VerificarCorreo";

// Creamos el navegador de pantallas.
const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        {/* Pantallas de inicio de sesión y registro */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />

        {/* Recuperación de contraseña */}
        <Stack.Screen name="RecuperarPassword" component={RecuperarPassword} />
        <Stack.Screen name="VerificarCorreo" component={VerificarCorreo} />
        <Stack.Screen name="NuevaPassword" component={NuevaPassword} />

        {/* Pantallas principales */}
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="GestionProductos" component={GestionProductos} />
        <Stack.Screen name="NuevosProductos" component={NuevosProductos} />
        <Stack.Screen name="Perfil" component={Perfil} />
        <Stack.Screen name="Clientes" component={Clientes} />

        {/* Gestión de proveedores */}
        <Stack.Screen
          name="GestionProveedores"
          component={GestionProveedores}
        />
        {/* Gestion lista pedidos */}
        <Stack.Screen name="ListaPedidos" component={ListaPedidos} />
        <Stack.Screen name="NuevoPedido" component={NuevoPedido} />

        {/* Órdenes de compra */}
        <Stack.Screen name="OrdenesCompra" component={OrdenesCompra} />

        {/* Productos con stock crítico para clientes */}
        <Stack.Screen
          name="ProductosCriticosCliente"
          component={ProductosCriticosCliente}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
