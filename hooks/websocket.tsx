import {Limit, Trade, UserInfo} from '@/Types/types';
import {Client} from '@stomp/stompjs'
import {Candle} from "@/Types/types";
import { Dispatch, SetStateAction } from 'react';
import {ApexOptions} from "apexcharts";

const startWebSocket = (address:string | undefined,
     setUserInfo:Dispatch<SetStateAction<UserInfo | undefined>> ,
     setAsks:Dispatch<SetStateAction<Limit[]>> | null,setBuys:Dispatch<SetStateAction<Limit[]>> | null,setTrades:Dispatch<SetStateAction<Trade[]>>,
     setCandles:Dispatch<SetStateAction<ApexOptions>> | null) =>{

    const client = new Client({
        brokerURL: 'wss://' + process.env.NEXT_PUBLIC_ORDERBOOKIP + '/ws',
        onConnect: ()=>{
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
            client.subscribe(`/orderbook/user/${address}`, message =>{
                setUserInfo(JSON.parse(message.body));
            })
            client.subscribe("/orderbook/candles", message =>{
                if(setCandles){
                const data = JSON.parse(message.body).map((res:Candle)=>{
                    return {
                        x: new Date(res.timestamp),
                        y: [res.open,res.high,res.low,res.close]
                    }
                })
                    setCandles({
                            series: [{
                                data: data
                            }],
                            chart: {
                                type: 'candlestick',
                                height: 350,
                                animations: {
                                    enabled: false,
                                },
                            },
                            title: {
                                text: 'ExchangeGG Chart',
                                align: 'left'
                            },
                            xaxis: {
                                type: 'datetime'
                            },
                            yaxis: {
                                tooltip: {
                                    enabled: true
                                }
                            }
                    })
                }
            })
        },
    });
    console.log("connected!");
    client.activate();
    return client;
}

export default startWebSocket ;
