import { useEffect } from "react";
import { pararServer } from "../services/syncService";
import { Switch, Text } from "react-native-gesture-handler";



const NetworkSyncScreen = () => {
    const [sync, setsync] = useState(false);
    const [currentWifi, setCurrentWifi] = useState(null);

    useEffect(() => {
        //Verifica a rede wifi atual
        const checkWifi = async () => {
            try {
                const { ssid } = await wifi.getCurrentWifiSSID();
                setCurrentWifi(ssid || 'Sem conexão');
            } catch (error) {
                setCurrentWifi('Sem conexão');
            }
        };

        checkWifi();

        //Limpa o componente
        return() => {
            if(sync){
                pararServer();
            }
        };
    }, [sync]);

    //Altera o estado da sincronização
    const toggleSync = async () => {
        if(sync){
            pararServer();
            setsync(false);
        }else{
            try {
                await startSyncServer();
                setsync(true);
            } catch (error) {
                console.error('Erro ao iniciar sincronização', error);
            }
        }
    }

    return(
        <View> 
            <Text>Configurações de network</Text>
            <View>
                <Text>Current Wifi: {currentWifi}</Text>
            </View>
            <View>
                <Text> Auto Sync: </Text>
                <Switch
                    value={sync}
                    onValueChange={toggleSync}
                />
            </View>
            <Text>
                { sync ? 'Sincronização ativa' : 'Sincronização desativada'}
            </Text>
        </View>
    )
}

export default NetworkSyncScreen;
