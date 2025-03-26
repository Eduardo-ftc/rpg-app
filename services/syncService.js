import Wifi from 'react-native-wifi-reborn';
import dgram from 'react-native-udp';
import { markSync, pegarPersonagemUnSync } from './database';
import AsyncStorage from '@react-native-async-storage/async-storage';


const SYNC_PORT = 9000;
const SYNC_HEADER = 'PERSONAGEM-SYNC';

let socket = null;
let isSync = false;

const startSyncServer = (onNewData) => {
    socket = dgram.createSocket('udp4');

    socket.bind(SYNC_PORT, () => {
        console.log('Servidor de sincronização iniciado', SYNC_PORT);
        socket.setBroadcast(true);
    });

    socket.on('message', async (msg, info) => {
        const message = msg.toString();

        if(message.startsWith(SYNC_HEADER)) {
            const data = JSON.parse(message.substring(SYNC_HEADER.length));

            if(data.type === 'request'){
                const unSync = await pegarPersonagemUnSync();
                if(unSync.length > 0){
                    sendSyncData(unSync, info.address);
                }
            }else if(data.type === 'data'){
                if(onDataReceivedCallback){
                    onDataReceivedCallback(data.personagens);
                }
                if(data.syncIdS && data.syncIdS.length > 0){
                    await markSync(data.syncIdS);
                }
            }
        }
    });
};

const pararServer = () => {
    if(socket){
        socket.close();
        socket = null;
    }
};

const sendSyncData = (personagens) => {
    return new Promise((resolve, reject) => {
        if(!socket){
            return reject('Servidor de sincronização não iniciado');
        }

    const syncIds = personagens.map(p => p.id);
    const message = JSON.stringify({type: 'data', personagens, syncIds});

    socket.send(
        SYNC_HEADER + message,
        0,
        (SYNC_HEADER + message).length,
        SYNC_PORT,
        '255.255.255.255',
        (err) => {
            if(err){
                console.error('Sincronização falhou', err);
                reject(err);
            }else{
                console.log('Dados enviados')
                resolve();
            }
        }
    );
    });
};

const acharEsincronizar = async () => {
    if(isSync){
        console.log('Sincronização em andamento, aguarde...');
        return {success: false, error: 'Sincronização em andamento, aguarde...'}
    };

    isSync = true;
    
    try {
        const {ssid} = await Wifi.getCurrentWifiSSID();
        if(!ssid) {
            throw new Error('Sem conexão wifi')
        };
        const message = JSON.stringify({type: 'request'});
        await new Promise((resolve, reject) => {
            socket.send(
                SYNC_HEADER + message,
                0,
                (SYNC_HEADER + message).length,
                SYNC_PORT,
                '255.255.255.255',
                (err) => {
                    if(err){
                        if(err) reject(err);
                        else resolve();
                    }
                }
            );
        })

        console.log('Sincronização iniciada');
        

        const unSync = await pegarPersonagemUnSync();
        let sentCount = 0;

        if(unSync.length > 0){
            await sendSyncData(unSync);
            sentCount = unSync.length;
        }
        
        return {success: true, sent: unSync.length};
    
    } catch (error) {
        
        console.error('Erro de sincronização', error);
        return{success: false, error: error.message};
    
    }finally{
        sincronizado = false;
    }
}

export { startSyncServer, pararServer, sendSyncData, acharEsincronizar }