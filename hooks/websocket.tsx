import { Limit, Trade, UserInfo } from '@/Types/types';
import {Client} from '@stomp/stompjs'
import { Dispatch, SetStateAction } from 'react';


const startWebSocket = (address:string | undefined,
     setUserInfo:Dispatch<SetStateAction<UserInfo | undefined>> ,
     setAsks:Dispatch<SetStateAction<Limit[]>> | null,setBuys:Dispatch<SetStateAction<Limit[]>> | null,setTrades:Dispatch<SetStateAction<Trade[]|undefined>>) =>{

    const client = new Client({
        brokerURL: 'ws://localhost:8080/ws',
        onConnect: ()=>{
            // client.publish({destination:'/app/getUser',body:userId)
            if(setAsks){
                client.subscribe('/orderbook/asks', message =>{
                    setAsks(JSON.parse(message.body));
                })
            }
            if(setBuys) {
                client.subscribe('/orderbook/bids', message => {
                    setBuys(JSON.parse(message.body));
                })
            }
            client.subscribe('/orderbook/trades', message =>{
                setTrades(JSON.parse(message.body));
            })
            client.subscribe("/orderbook/user", message =>{
                setUserInfo(JSON.parse(message.body));
            })
            client.publish({destination: "/app/getuser", body:address});
        },
    });
    console.log("connected!");
    client.activate();
    return client;
}

export default startWebSocket ;
