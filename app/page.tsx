'use client'

import {JSX, useEffect, useState} from "react";
import startWebSocket from "@/hooks/websocket";
import Switcher from "@/components/Switcher";
import AssetInfo from "@/components/AssetInfo";
import Navigation from "@/components/Navigation";
import {Trade, Limit, UserInfo} from "@/Types/types";
import PriceChart from "@/components/chart";
import {ApexOptions} from "apexcharts";

const Spacer = () =>{
    return <div className="py-2"></div>
}

const Card = ({children,title}:{children: JSX.Element, title:string}) =>{
    return (
        <div className="p-6 bg-teal-400 rounded-xl">
            <h1 className="text-grey-900 font-bold text-2xl mb-3 text-center">{title}</h1>
            {children}
        </div>
    )
}


const Orderbook = ({limits}:{limits: Limit[]}) =>{
    const indents = [];
    let i=0;
    while(i<30 && i<limits.length){
        indents.push(<div key={i} className="grid grid-cols-2 gap-4 place-items-center">
            <div>
                {limits[i].totalVolume.toFixed(2)}
            </div>
            <div>
                {limits[i].price.toFixed(2)}
            </div>
        </div>)
        i++;
    }
    return indents;
}

const MarketTrades = ({trades}:{trades: Trade[]}) =>{
    const indents = [];
    let i=0;
    while(i<30 && i<trades.length){
        indents.push(<div key={i} className="grid grid-cols-2 gap-4 place-items-center">
            <div>
                {trades[i].price.toFixed(2)}
            </div>
            <div>
                {trades[i].size.toFixed(2)}
            </div>
        </div>)
        i++;
    }
    return indents;
}

export default function Home() {
    const address = process.env.NEXT_PUBLIC_WALLET_ADDRESS;
    const [asks,setAsks] = useState<Limit[]>([]);
    const [buys,setBuys] = useState<Limit[]>([]);
    const [trades,setTrades] = useState<Trade[]>([]);
    const [orderSize,setOrderSize] = useState<string>("0");
    const [orderPrice,setOrderPrice]  = useState<string>("0");
    const [isLimit, setIsLimit] = useState(false);
    const [userInfo, setUserInfo] = useState<UserInfo>();
    const [candles, setCandles] = useState<ApexOptions>({
            series: [{
                data: []
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

    });

    useEffect(() => {
        startWebSocket(address,setUserInfo,setAsks,setBuys,setTrades,setCandles);
    }, [address]);


    const placeOrder = async(bid:boolean)=>{
        const url = 'http://' +  process.env.NEXT_PUBLIC_ORDERBOOKIP + '/order';
        let orderType = "MARKET";
        if(isLimit){
            orderType = "LIMIT";
        }
        const order = {
            userId: address,
            market: "ETH",
            orderType: orderType,
            price: orderPrice,
            size: orderSize,
            bid: bid
        }
        if(parseFloat(orderSize) <= 0){
            alert("Please Enter Valid Amount");
            return;
        }
        if(address == "" || address == undefined){
            alert("Please First Connect Your Wallet");
            return;
        }
        if(userInfo && bid && userInfo.balance < parseFloat(orderSize)*parseFloat(orderPrice)){
            alert("Insufficient Funds!");
            return;
        }
        if(userInfo == null || !bid && parseFloat(orderSize)>userInfo.shares){
            alert("Insufficient BTC!");
            return;
        }
        await fetch(url,{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        }).then(()=>alert("Order Placed!"));
    }


    return (
      <div className="container mx-auto tex-2xl">
        <Navigation address={address}/>
          <div className="container mx-auto">
              {trades.length === 0 || userInfo == null ? <></> : <AssetInfo userInfo={userInfo} price={parseFloat(trades[0].price.toFixed(2))}/>}
              <PriceChart candles={candles}/>
              <div className="flex space-x-10 flex-wrap gap-5">
                      <Card title="Orderbook">
                          <div className="flex">
                              <div>
                                  <h1 className="text-xl text-center">Buy Order</h1>
                                  <div className="grid grid-cols-2 gap-4 p-2 place-items-center">
                                      <div>
                                          AMOUNT
                                      </div>
                                      <div>
                                          PRICE
                                      </div>
                                  </div>
                                  {
                                      (buys === undefined || buys.length == 0 ? <div>Data Unavailable</div>: <Orderbook limits={buys}/>)
                                  }
                              </div>
                              <div className="p-5"></div>
                              <div>
                                  <h1 className="text-xl text-center">Sell Order</h1>
                                  <div className="grid grid-cols-2 gap-4 p-2 place-items-center">
                                      <div>
                                          AMOUNT
                                      </div>
                                      <div>
                                          PRICE
                                      </div>
                                  </div>
                                  {
                                      (asks === undefined || asks.length == 0 ? <div>Data Unavailable</div>: <Orderbook limits={asks}/>)
                                  }
                              </div>
                          </div>
                      </Card>
                      <Card title="Trades">
                          <>
                          <h1 className="text-xl text-center">
                              Current Price: {(trades.length == 0 ? <div>Data Unavailable</div>: <div> {trades[0].price.toFixed(2)}</div>)}
                          </h1>
                              <div className="grid grid-cols-2 gap-4 p-2 place-items-center">
                                  <div>
                                      PRICE
                                  </div>
                                  <div>
                                      AMOUNT
                                  </div>
                              </div>
                          {(trades.length == 0 ? <div>Data Unavailable</div>: <MarketTrades trades={trades}/>)}
                          </>
                      </Card>
                      <Card title="Place Order">
                          <div>
                              <div className="flex justify-center">
                                  <div className="text-center p-3">Market Order</div><Switcher isLimit={isLimit} setIsLimit={setIsLimit}/><div className="text-center p-3">Limit Order</div>
                              </div>
                              <div className="flex items-center justify-end">
                                  <div className="p-3">Amount:</div>
                                      <input type="number" onChange={(e)=>setOrderSize(e.target.value)} className="w-2/3 py-2 px-4 bg-white rounded-xl appearance-none outline-none text-gray-900"/>
                              </div>
                              {isLimit ?
                                  <div className="flex items-center justify-end">
                                      <div className="p-3">Price:</div>
                                      <input type="number" onChange={(e)=>setOrderPrice(e.target.value)} className="w-2/3 py-2 px-4 bg-white rounded-xl appearance-none outline-none text-gray-900"/>
                                  </div>:<></>
                              }
                              <Spacer/>
                              <div className="grid grid-cols-2 gap-4 place-items-center">
                                  <button onClick={()=>placeOrder(true)} className="p-3 bg-blue-500 font-bold rounded-lg text-white">Buy</button>
                                  <button onClick={()=>placeOrder(false)} className="p-3 bg-red-500 font-bold rounded-lg text-white">Sell</button>
                              </div>
                          </div>
                      </Card>
                  </div>
          </div>
      </div>
  );
}

