import React, {useState, useEffect} from 'react';
import { View, TextInput, ScrollView, Button, Text, Alert, StyleSheet } from 'react-native';
import { salvarPersonagem } from '../services/database';

const CriarPersonagemScreen = ({ route, navigation }) => {
    const {userId} = route.params;
    const [personagem, setPersonagem] = useState({
        NOME: '',
        CLASSE: '',
        NIVEL: 1,
        ATRIBUTOS: {
            FORCA: 0,
            DESTREZA: 0,
            CONSTITUICAO: 0,
            INTELIGENCIA: 0,
            AGILIDADE: 0,
            CARISMA: 0
        },
    });

    const botaoSalvar = async() =>{
        try {
            if(!personagem.NOME.trim()){
                Alert('Por favor, insira um nome');
                return;
            }else{
                await salvarPersonagem(personagem, userId);
                if(route.params?.onGoBack) route.params.onGoBack();

                navigation.navigate('ListaDePersonagens', {ID: userId});
            }
        } catch (error) {
            console.error('Erro ao salvar personagem: ', error);
            alert('Ocorreu um erro ao salvar o personagem');
        }
    };

    return(
        <ScrollView style={{padding: 20}}>
                <Text style={{fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 20}}> Crie seu personagem!</Text>
                
                <View style={styles.ParteDeCima}>
                    
                    <TextInput style={styles.inputNome} placeholder='Nome personagem' value={personagem.NOME} onChangeText={(text) => setPersonagem({...personagem, NOME: text})}></TextInput>
                    
                    <View style={styles.classeNivelContainer}>
                        <View style={styles.classeNivelItem}>
                            <Text style={styles.rotulo}>Nivel: </Text>
                            <TextInput style={styles.inputH} placeholder='Nível' value={personagem.NIVEL} onChangeText={(text) => setPersonagem({...personagem, NIVEL: parseInt(text) || 1})}></TextInput>
                        </View>
                        <View style={styles.classeNivelItem}>
                            <Text style={styles.rotulo}>Classe: </Text>
                            <TextInput style={styles.inputH} placeholder='Classe' value={personagem.CLASSE} onChangeText={(text) => setPersonagem({...personagem, CLASSE: text})}></TextInput>
                        </View>
                    </View>
                </View>
                
                <Text style={styles.tituloAtributos}>Atributos</Text>
                
                <View style={styles.containerAtributos}>
                    <View style={styles.colunaAtributos}>
                        
                        <TextInput style={styles.Atributos}placeholder='FORÇA' value={personagem.ATRIBUTOS.FORCA} onChangeText={(text) => setPersonagem({...personagem, ATRIBUTOS: {...personagem.ATRIBUTOS, FORCA: parseInt(text) || 1}})}></TextInput>
                        <TextInput style={styles.Atributos} placeholder='DESTREZA' value={personagem.ATRIBUTOS.DESTREZA} onChangeText={(text) => setPersonagem({...personagem, ATRIBUTOS: {...personagem.ATRIBUTOS, DESTREZA: parseInt(text) || 1}})}></TextInput>
                        <TextInput style={styles.Atributos} placeholder='CONSTITUICAO' value={personagem.ATRIBUTOS.CONSTITUICAO} onChangeText={(text) => setPersonagem({...personagem, ATRIBUTOS: {...personagem.ATRIBUTOS, CONSTITUICAO: parseInt(text) || 1}})}></TextInput>
                    
                    </View>
                    
                    <View style={styles.colunaAtributos}>
                        
                        <TextInput style={styles.Atributos} placeholder='INTELIGENCIA' value={personagem.ATRIBUTOS.INTELIGENCIA} onChangeText={(text) => setPersonagem({...personagem, ATRIBUTOS: {...personagem.ATRIBUTOS, INTELIGENCIA: parseInt(text) || 1}})}></TextInput>
                        <TextInput style={styles.Atributos} placeholder='AGILIDADE' value={personagem.ATRIBUTOS.AGILIDADE} onChangeText={(text) => setPersonagem({...personagem, ATRIBUTOS: {...personagem.ATRIBUTOS, Agilidade: parseInt(text) || 1}})}></TextInput>
                        <TextInput style={styles.Atributos} placeholder='CARISMA' value={personagem.ATRIBUTOS.CARISMA} onChangeText={(text) => setPersonagem({...personagem, ATRIBUTOS: {...personagem.ATRIBUTOS, CARISMA: parseInt(text) || 1}})}></TextInput>
                    
                    </View>
                </View>
                
                <Button title='Salvar' onPress={botaoSalvar}></Button>

                <View style={styles.containerAtributos}>
                    <View style={styles.colunaAtributos}>
                        <Text style={{backgroundColor:'#FF8C00', borderRadius: 10, textAlign: 'center', color: 'white', fontWeight: 'bold'}}>Dano Fisíco : {(parseInt(personagem.ATRIBUTOS.FORCA) * 2)}</Text>
                        <Text style={{backgroundColor:'#9370DB', borderRadius: 10, textAlign: 'center', color: 'white', fontWeight: 'bold'}}>Dano Mágico : {(parseInt(personagem.ATRIBUTOS.DESTREZA) * 2)}</Text>
                        <Text style={{backgroundColor:'#FFD700', borderRadius: 10, textAlign: 'center', color: 'white', fontWeight: 'bold'}}>Esquvia: {(parseInt(personagem.ATRIBUTOS.AGILIDADE) * 2)}</Text>
                    </View>
                    <View style={styles.colunaAtributos}>
                        <Text style={{backgroundColor:'#000080', borderRadius: 10, textAlign: 'center', color: 'white', fontWeight: 'bold'}}>Rêsistência: {(parseInt(personagem.ATRIBUTOS.CONSTITUICAO) * 2)}</Text>
                        <Text style={{backgroundColor:'#8A2BE2', borderRadius: 10, textAlign: 'center', color: 'white', fontWeight: 'bold'}}>Magia: {(parseInt(personagem.ATRIBUTOS.INTELIGENCIA) * 2)}</Text>
                        <Text style={{backgroundColor:'#DB7093', borderRadius: 10, textAlign: 'center', color: 'white', fontWeight: 'bold'}}>Persuasão: {(parseInt(personagem.ATRIBUTOS.CARISMA) * 2)}</Text>
                    </View>
                </View>
                <View style={{height: 20, backgroundColor:'#228B22', borderRadius: 10, overflow: 'hidden'}}>
                       <Text style={{textAlign: 'center', color: 'white', fontWeight: 'bold'}}>
                            HP: {(parseInt((personagem.ATRIBUTOS.CONSTITUICAO) * 100) + personagem.NIVEL)}</Text>
                </View>
                <View style={{height: 20, backgroundColor:'#DAA520', borderRadius: 10, overflow: 'hidden'}}>
                    <Text style={{textAlign: 'center', color: 'white', fontWeight: 'bold'}}>
                        Estamina: {(parseInt((personagem.ATRIBUTOS.CONSTITUICAO) + 
                            parseInt(personagem.ATRIBUTOS.AGILIDADE) + 5) * personagem.NIVEL)}</Text>
                </View>

        </ScrollView>
    )
}



const styles = StyleSheet.create({

    ParteDeCima:{
        mariginBottom: 20
    },
    inputNome:{
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16
    },
    linha:{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    classeNivelContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    classeNivelItem:{
        width: '38%',
    },
    classeNivelInput:{
        height: 40,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        borderRadius: 5
    },
    rotulos:{
        width: 80,
        fontSize: 16,
        marginRight: 10
    },
    inputH:{
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    containerAtributos:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    colunaAtributos: {
        width: '40%',
        marginTop: 20
    },
    Atributos:{
        height: 40,
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 10,
        borderRadius: 5
    },
    tituloAtributos: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        fontStyle: 'italic',
        marginVertical: 10,
        marginTop: 50,
        width: '100%',
    }


});
export default CriarPersonagemScreen;