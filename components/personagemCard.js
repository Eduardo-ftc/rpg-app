import { View, Text } from "react-native";
import React from "react";

const PersonagemCard = ({personagem}) => {
    if(!personagem){
        console.log('Personagem não encontrado');
        return null;
    }
    
    let atributos = {};
    try {
        const atributos = typeof personagem.ATRIBUTOS === 'string'
        ? JSON.parse(personagem.ATRIBUTOS)
            : personagem.ATRIBUTOS || {};
    } catch (error) {
        console.error('Erro ao converter atributos', error);
        atributos = {};
    }

    return(
        <View>
            <Text>{personagem.NOME}</Text>
            <Text>{personagem.CLASSE}</Text>
            <Text>{personagem.NIVEL}</Text>
            <Text>
                FOR: {atributos.FORCA || 0}
                AGI: {atributos.AGILIDADE || 0}
                CON: {atributos.CONSTITUICAO || 0}
                INT: {atributos.INTELIGENCIA || 0}
                CAR: {atributos.CARISMA || 0}
                DES: {atributos.DESTREZA || 0}
            </Text>
        </View>
    )
}

export default PersonagemCard;