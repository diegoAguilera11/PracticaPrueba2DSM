
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Modal,
  FlatList,
  Image,
  TextInput,
  Pressable
} from 'react-native';

import axios from 'axios';
import { Button } from 'react-native-paper';


const App = () => {

  const [modalCliente, setModalCliente] = useState(false);
  const [modalMesero, setModalMesero] = useState(false);
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [modalDetalle, setModalDetalle] = useState(false);

  const [mesa, setMesa] = useState('');
  const [nombre, setNombre] = useState('');
  const [rut, setRut] = useState('');
  const [email, setEmail] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState(new Date());


  useEffect(() => {
    const obtenerProductosAPI = async () => {

      try {
        if (Platform.OS === "android") {
          const url = 'https://dummyjson.com/products';
          const resultado = await fetch(url);
          const response = await resultado.json();
          setProductos(response.products)
        }

      } catch (error) {
        // console.log(error)
      }
    }
    obtenerProductosAPI();
  }, [])


  const activarModalDetalle = () => {
    setModalDetalle(true)
  }

  const activarModalCliente = () => {
    setModalCliente(true)
  }

  const activarModalMesero = () => {
    setModalMesero(true)
  }

  const ingresarOrden = () => {

    const orden = {
      id: Date.now(),
      mesa,
      nombre,
      rut,
      email,
      descripcion,
      fecha,
      estado: 'INGRESADA'
    }

    if (Object.values(orden).includes('')) {
      Alert.alert('Error', 'Todos los campos son obligatorios')
      return
    }

    setPedidos([...pedidos, orden])

    setMesa('')
    setNombre('')
    setRut('')
    setEmail('')
    setDescripcion('')
    setFecha(new Date())
    setModalDetalle(false)
    console.log(orden)


  }

  const eliminarPedido = (id) => {
    console.log(id)

    setPedidos(pedidos.filter(pedido => pedido.id !== id))
  }

  const cambiarEntregado = (item) => {
    item.estado = 'ENTREGADO';
    setModalMesero(false);
  }

  const cambiarEliminado = (item) => {
    item.estado = 'ELIMINADO';
    setModalMesero(false);
  }



  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Prueba 2 - React native</Text>

      <Button style={{ marginHorizontal: 30, marginBottom: 20, paddingVertical: 20 }}
        labelStyle={{ color: '#000' }}
        mode="contained"
        onPress={() => activarModalCliente()}
      >
        Ingresar Pedido
      </Button>

      <Button style={{ marginHorizontal: 30, paddingVertical: 20 }} labelStyle={{ color: '#000' }}
        mode="contained"
        onPress={() => activarModalMesero()}
      >
        Ver Pedidos
      </Button>


      {modalCliente && (
        <Modal animationType='slide' visible={modalCliente}>
          <View style={styles.contenedor}>
            <Button style={{ marginHorizontal: 50, paddingVertical: 10, marginTop: 15 }}
              labelStyle={{ color: '#000', fontSize: 20 }}
              mode='contained'
              onPress={() => setModalCliente(!modalCliente)}
            >

              Cerrar

            </Button>
            <Text style={styles.titulo}>Bienvenido Cliente</Text>

            <Button style={{ marginHorizontal: 50, paddingVertical: 10, marginTop: 15 }}
              labelStyle={{ color: '#000', fontSize: 20 }}
              mode='contained'
              onPress={() => activarModalDetalle()}
            >

              Nuevo Detalle

            </Button>

            <View style={styles.contenedorFlatList}>
              <FlatList
                style={{ marginVertical: 20 }}
                data={productos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  return (
                    <View style={styles.contenidoFlatList}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: '500', color: '#000', fontSize: 20, textTransform: 'uppercase' }}> {item.title}</Text>

                        <Text style={styles.tituloBold}>Description:
                          <Text style={{ color: '#000', fontSize: 15 }}>{item.description}</Text>
                        </Text>
                        <Text style={styles.tituloBold}>Price:
                          <Text style={{ color: '#000', fontSize: 25 }}>{item.price}</Text>
                        </Text>
                      </View>
                      <Image style={{ height: 100, width: 100 }} source={{ uri: item.images[0] }} />
                    </View>
                  )

                }}
              />
            </View>

            {modalDetalle && (
              <Modal animationType='slide' visible={modalDetalle}>
                <ScrollView style={styles.contenedor}>
                  <Button style={{ marginHorizontal: 50, paddingVertical: 10, marginTop: 15, borderRadius: 25 }}
                    labelStyle={{ color: '#000', fontSize: 20 }}
                    mode='contained'
                    color='#14CE90'
                    onPress={() => setModalDetalle(!modalDetalle)}
                  >
                    Cerrar
                  </Button>
                  <View style={styles.contenedorformulario} >
                    <Text style={styles.titulo}>Nueva Orden</Text>

                    <View style={styles.campo}>
                      <Text style={styles.label}>Número de Mesa</Text>
                      <TextInput
                        style={styles.input}
                        placeholder='ingresa el numero de mesa .Ej: 5'
                        keyboardType='numeric'
                        value={mesa}
                        onChangeText={setMesa}
                      />
                    </View>

                    <View style={styles.campo}>
                      <Text style={styles.label}>Nombre de Cliente</Text>
                      <TextInput
                        style={styles.input}
                        placeholder='ingresa el numero de mesa .Ej: 5'
                        value={nombre}
                        onChangeText={setNombre}
                      />
                    </View>

                    <View style={styles.campo}>
                      <Text style={styles.label}>RUT</Text>
                      <TextInput
                        style={styles.input}
                        placeholder='XXX.XXX.XXX-X'
                        value={rut}
                        onChangeText={setRut}
                      />
                    </View>

                    <View style={styles.campo}>
                      <Text style={styles.label}>Correo Eléctronico</Text>
                      <TextInput
                        style={styles.input}
                        placeholder='correo@correo.com'
                        keyboardType='email-address'
                        value={email}
                        onChangeText={setEmail}
                      />
                    </View>

                    <View style={styles.campo}>
                      <Text style={styles.label}>Descripción de la Orden</Text>
                      <TextInput
                        style={styles.inputDescripcion}
                        placeholder='Ej: 3 platillos de fideos con salsa'
                        multiline={true}
                        maxLength={200}
                        value={descripcion}
                        onChangeText={setDescripcion}
                      />
                    </View>

                    <Button style={{ marginHorizontal: 50, marginVertical: 10, borderRadius: 20, paddingVertical: 10, marginTop: 15 }}
                      labelStyle={{ color: '#000', fontSize: 20 }}
                      mode='contained'
                      color='#09B0B8'
                      onPress={() => ingresarOrden()}
                    >
                      Enviar Orden
                    </Button>
                  </View>
                </ScrollView>
              </Modal>
            )}
          </View>
        </Modal>

      )}

      {modalMesero && (
        <Modal animationType='slide' visible={modalMesero}>
          <View style={styles.contenedor}>
            <Button
              style={{ marginHorizontal: 50, paddingVertical: 10, marginTop: 15 }}
              labelStyle={{ color: '#000', fontSize: 20 }}
              mode='contained'
              onPress={() => setModalMesero(!modalMesero)}
            >
              Cerrar
            </Button>
            <Text>Desde Mesero</Text>
            <View style={styles.contenedorFlatList}>
              <FlatList
                style={{ marginVertical: 20 }}
                data={pedidos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  return (
                    <View style={styles.contenidoFlatList}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: '500', color: '#000', fontSize: 20, textTransform: 'uppercase' }}> {item.nombre}</Text>

                        <Text style={styles.tituloBold}>Descripcion:
                          <Text style={{ color: '#000', fontSize: 15 }}>{item.descripcion}</Text>
                        </Text>
                        <Text style={styles.tituloBold}>Estado:
                          <Text style={{ color: '#000', fontSize: 15 }}> {item.estado}</Text>
                        </Text>
                      </View>
                      <View>
                        <Pressable onPress={() => cambiarEliminado(item)}>
                          <Text>Cancelar</Text>
                        </Pressable>
                        <Pressable onPress={() => cambiarEntregado(item)}>
                          <Text>Entregado</Text>
                        </Pressable>
                        <Pressable onPress={() => eliminarPedido(item.id)}>
                          <Text>Eliminar</Text>
                        </Pressable>
                      </View>
                    </View>
                  )

                }}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#B66',
  },
  titulo: {
    fontSize: 30,
    textAlign: 'center',
    marginVertical: 40,
    color: '#000'
  },
  boton: {
    marginHorizontal: 30,
    marginBottom: 20,
    paddingVertical: 20
  },
  contenedorFlatList: {
    flex: 1,
    backgroundColor: '#FFF',
    marginVertical: 20,
    marginHorizontal: 30,
    borderRadius: 20
  },
  contenidoFlatList: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#000',
    borderBottomWidth: 1
  },
  tituloBold: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#FF5D00',
    marginRight: 5
  },
  contenedorformulario: {
    backgroundColor: '#FFF',
    marginVertical: 20,
    marginHorizontal: 10,
    borderRadius: 20
  },
  input: {
    borderRadius: 20,
    backgroundColor: '#C8AE9F',
    paddingLeft: 15
  },
  label: {
    marginBottom: 5,
    paddingLeft: 15
  },
  campo: {
    marginBottom: 20,
    marginHorizontal: 20
  },
  inputDescripcion: {
    borderRadius: 20,
    backgroundColor: '#C8AE9F',
    paddingLeft: 15,
    paddingVertical: 30
  }
});

export default App;
