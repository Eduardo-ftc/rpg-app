import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput,  ImageBackground,TouchableOpacity } from 'react-native';

const AutenticacaoScreen = ({ navigation }) => {
    const [userName, setUserName] = useState('');

    const botãoSalvar = () => {
        if(userName.trim()){
            navigation.navigate('ListaDePersonagens', {ID: userName});
        }
    };

    return(
        <ImageBackground source={require('../assets/imgAuth.jpg')} style={{width: '100%', height: '100%'}}>
            <View style={styles.container}>
                <View style={{marginBottom: 100}}>
                    <Text style={styles.texto}>Sincronização de personagem</Text>
                </View>
                <View style={styles.input}>
            
                    <TextInput style={{backgroundColor: '#F5DEB3', borderRadius: 10}}  placeholder='Insira seu nome' value={userName} onChangeText={setUserName}></TextInput>
            
                </View>
                <View style={styles.containerButton}>
                    <TouchableOpacity style={styles.button} onPress={botãoSalvar}>
                        <Text style={{fontColor: 'white', alignContent: 'center', alignItems: 'center' ,fontSize: 20}}>ENTRAR</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    )
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 100
    },
    texto: {
        fontSize: 20,
        fontWeight: 'bold',
        fontStyle: 'italic',
        alignContent: 'center',
        textAlign: 'center'
    },
    input:{
        width: '80%',
        height: 40,
        borderWidth: 0.5,
        borderRadius: 10,
        marginBottom: 20
    },
    containerButton:{
        width: '70%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button:{
        width: '80%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: 0.5,
        backgroundColor:'#808000',
    }
})
export default AutenticacaoScreen;