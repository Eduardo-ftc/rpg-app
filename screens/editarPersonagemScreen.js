import React, { useState, useEffect } from 'react';
import { View, TextInput, ScrollView, Button, Text } from 'react-native';
import { pegarPersonagem, editPersonagem } from '../services/database';

const EditarPersonagemScreen = ({ route, navigation }) => {
    const {personagemId, userId} = route.params;
    const [personagem, setPersonagem] = useState(null);

    useEffect(() => {
        const carregarPersonagem = async () => {
            const PersonagemLoaded = await pegarPersonagem(personagemId);
            setPersonagem({
                ...PersonagemLoaded,
                atributos: JSON.parse(PersonagemLoaded.ATRIBUTOS)
            });
        };

        carregarPersonagem();
    },[personagemId]);

    const botaoEditar = async() =>{
        if(personagem && personagem.NOME.trim()){
            await editPersonagem(personagemId, personagem, userId);
            navigation.navigate('ListaDePersonagens', {ID: userId});
        };
    };
    
    if(!personagem){
        return(
            <View>
                <Text>Carregando...</Text>
            </View>
        )
    }

    return(
        <ScrollView>
            <Text> Edite seu personagem!</Text>

            <TextInput placeholder='Insira seu nome' value={personagem.NOME} onChangeText={(text) => setPersonagem({...personagem, NOME: text})}></TextInput>
            <TextInput placeholder='Insira seu nivel' value={personagem.NIVEL} onChangeText={(text) => setPersonagem({...personagem, NIVEL: parseInt(text) || 1})}></TextInput>
            <TextInput placeholder='Insira sua classe' value={personagem.CLASSE} onChangeText={(text) => setPersonagem({...personagem, CLASSE: text})}></TextInput>
            <TextInput placeholder='Insira sua forca' value={personagem.atributos.FORCA} onChangeText={(text) => setPersonagem({...personagem, atributos: {...personagem.atributos, FORCA: parseInt(text) || 0}})}></TextInput>
            <TextInput placeholder='Insira sua destreza' value={personagem.atributos.DESTREZA} onChangeText={(text) => setPersonagem({...personagem, atributos: {...personagem.atributos, DESTREZA: parseInt(text) || 0}})}></TextInput>
            <TextInput placeholder='Insira sua Agilidade' value={personagem.atributos.Agilidade} onChangeText={(text) => setPersonagem({...personagem, atributos: {...personagem.atributos, Agilidade: parseInt(text) || 0}})}></TextInput>
            <TextInput placeholder='Insira sua constituicao' value={personagem.atributos.CONSTITUICAO} onChangeText={(text) => setPersonagem({...personagem, atributos: {...personagem.atributos, CONSTITUICAO: parseInt(text) || 0}})}></TextInput>
            <TextInput placeholder='Insira sua inteligencia' value={personagem.atributos.INTELIGENCIA} onChangeText={(text) => setPersonagem({...personagem, atributos: {...personagem.atributos, INTELIGENCIA: parseInt(text) || 0}})}></TextInput>
            <TextInput placeholder='Insira sua carisma' value={personagem.atributos.CARISMA} onChangeText={(text) => setPersonagem({...personagem, atributos: {...personagem.atributos, CARISMA: parseInt(text) || 0}})}></TextInput>

            <Button title='Salvar' onPress={botaoEditar}></Button>
        </ScrollView>
    );
}