import { useEffect, useState } from "react";
import { Button, StyleSheet, TouchableOpacity, View, Text, ActivityIndicator, ImageBackground } from "react-native";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import { pegarPersonagem, acharEsincronizar, salvarPersonagem, pegarPersonagemUnSync } from "../services/database";
import PersonagemCard from "../components/personagemCard";
import { pararServer, startSyncServer } from "../services/syncService";

const ListaPersonagemScreen = ({route, navigation}) => {
    const { userId } = route.params;
    const [personagens, setPersonagens] = useState([]);
    const [networkPersonagens, setNetworkPersonagens] = useState([]);
    const [sync, setSync] = useState(false);
    const [carregar, setCarregar] = useState(false);
    const [atualizar, setAtualizar] = useState(false);


    //Traz os personagens do banco de dados
    const carregarPersonagens = async () => {
        setAtualizar(true);
        try {

            const personagensLoaded = await pegarPersonagem(userId);
            console.log('Personagens carregados', personagensLoaded);
            setPersonagens(personagensLoaded); //Atualiza o estado como os personagens

        } catch (error) {
            console.log('Erro ao carregar personagens', error);
        }finally{
            setAtualizar(false); //Desativa a atualização
        }
    };

    useEffect(() => {

        carregarPersonagens();

        const unsub = navigation.addListener('focus', carregarPersonagens);
        //Inícia o servidor para sincronizar
        try{
            startSyncServer(novoPersonagemRecebido);
        }catch(error){
          console.error('Erro ao iniciar sincronização', error);  
        }

        return() =>{
            unsub();
            pararServer();
        }
    }, [navigation, userId]);

    //Callback para novos personagens recebidos
    const novoPersonagemRecebido = (novosPersonagem) =>{
        if(!Array.isArray(novosPersonagem)){
            console.error('Novos personagens recebidos não são válidos', novosPersonagem);
            return;
        }
        console.log('Novos personagens recebidos', novosPersonagem);

        //Filtra os personagens novos
        setNetworkPersonagens(prev => {
            const personagensUnicos = novosPersonagem.filter(newPerson => 
                !prev.some(existingPerson => existingPerson.id === newPerson.id) &&
                    !personagens.some(existingPerson => existingPerson.id === newPerson.id)
            );
            return [...prev, ...personagensUnicos];
        })
    }
    
    const botaoAddPersonagem = () => {
        navigation.navigate('Criação de Personagem', {userId,
            onGoBack: carregarPersonagens
        });
    }

    const atualizarista = async() => {
        try {
            const personagensAtualizados = await pegarPersonagem(userId);
            setPersonagens(personagensAtualizados);
        } catch (error) {
            console.error('Erro ao atualizar lista de personagens', error);
        }
    }

    //Aqui atualiza a lista dos personagens
    const botaoSincronizar = async () => {
        console.log('Botão sincrozinar pressionado');
        setSync(true);
        console.log('Sincronização defina como true');
        try {
            const unSync = await pegarPersonagemUnSync();
            console.log('Resultado de sincronização', unSync);

            const result = await acharEsincronizar(unSync);
            console.log('Resultado de sincronização', result);

            const atualizarPersonagens = await pegarPersonagem(userId);
            setPersonagens(atualizarPersonagens);

            if(result && Array.isArray(result)){
                setNetworkPersonagens(prev => {
                    const novos = result.filter(p =>
                        (!prev.some(ep => ep.id === p.id) &&
                        !atualizarPersonagens.some(ep => ep.id === p.id)
                    ))
                    return [...prev, ...novos];
                });
            }
        } catch (error) {
            console.error('Erro ao sincronizar',{
                error: error.message,
                stack: error.stack
            });
        }finally{
            setSync(false);
        }
    };

    const botaoEditarPersonagem = (personagemId) => {
        navigation.navigate('EditarPersonagem', {personagemId, userId,
            onGoBack: carregarPersonagens
        });
    };

    if(carregar){
        return(
            <View>
                <ActivityIndicator size="large"/>
            </View>
        );
    };

    return(
            <View style={styles.listaPersonagem}>
                <Text style={{fontSize: 20, fontWeight: 'bold', fontStyle: 'italic'}}>Lista de Personagens</Text>

                <FlatList style={{alignContent: 'center', width: '100%', marginVertical: 10}}
                    data={personagens}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({item}) => {
                        if(!item || !item.id){
                            console.warn('Item inválido', item);
                            return null;
                        }
                        return(
                            <TouchableOpacity onPress={() => botaoEditarPersonagem(item.id)}>
                                <PersonagemCard personagem={item} />
                            </TouchableOpacity>
                        )
                    }}
                    ListEmptyComponent={<Text>Nenhum personagem criado</Text>}
                    refreshControl={
                        <RefreshControl
                            refreshing={atualizar}
                            onRefresh={carregarPersonagens}
                        />
                    }
                />

                <Button styles={styles.button} title="Adicionar Personagem" onPress={botaoAddPersonagem} />

                <View style={styles.listaPersonagemRede}>
                    <Text style={{fontSize: 20, fontWeight: 'bold', fontStyle: 'italic'}}>Personagens da Rede</Text>
                    <FlatList style={{alignContent: 'center', width: '100%', marginVertical: 10}}
                        data={networkPersonagens}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({item}) => {
                            return <PersonagemCard personagem={item} />}}
                        ListEmptyComponent={<Text>Nenhum personagem sincronizado</Text>}
                    />
                    <TouchableOpacity style={styles.button} onPress={botaoSincronizar}>
                        <Text style={{textAlign: 'center', fontSize: 20, fontWeight: 'bold', fontStyle: 'italic', fontColor: 'white'}}>Sincronizar</Text>
                    </TouchableOpacity>
                    {sync && <ActivityIndicator/>}
                </View>
            </View>
    )
}

const styles = StyleSheet.create({
    button:{
        width: '80%',
        height: 40,
        fontColor: 'white',
        alignContent: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: '#ADFF2F',
    },
    listaPersonagem:{
        flex: 0.5,
        padding: 20,
    },
    listaPersonagemRede:{
        flex: 1,
        padding: 20,
        alignItems: 'center',
    }
});

export default ListaPersonagemScreen;
