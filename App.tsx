import * as React from "react";
import 'react-native-gesture-handler';
import { createStackNavigator } from "@react-navigation/stack";
import { useEffect } from "react";
import { iniciarDB } from "./services/database";
import { NavigationContainer } from "@react-navigation/native";
import AutenticacaoScreen from "./screens/autenticacaoScreen";
import CriarPersonagemScreen from "./screens/criarPersonagemScreen";
import ListaPersonagemScreen from "./screens/ListaPersonagemScreen";
import NetworkSyncScreen from "./screens/networkSyncScreen";



const Stack = createStackNavigator();

const App = () => {
  useEffect(() =>{
    iniciarDB();
  },[])

  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Autênticação">
        <Stack.Screen name="Autênticação" component={AutenticacaoScreen} options={{ headerStyle:{backgroundColor: 'rgba(124, 55, 5, 0.79)'}}}/>
        <Stack.Screen name="Criação de Personagem" component={CriarPersonagemScreen} />
        <Stack.Screen name="ListaDePersonagens" component={ListaPersonagemScreen} />
        <Stack.Screen name="Edição de Personagem" component={CriarPersonagemScreen} />
        <Stack.Screen name="NetWork Screen" component={NetworkSyncScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;