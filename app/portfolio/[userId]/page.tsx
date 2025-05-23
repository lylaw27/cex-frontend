'use client'
import useEthereum from "@/hooks/useEthereum";
import {JSX, useEffect, useState} from "react";
import AssetInfo from "@/components/AssetInfo";
import startWebSocket from "@/hooks/websocket";
import Navigation from "@/components/Navigation";
import {Trade, Order, UserInfo} from "@/Types/types";


const Card = ({children,title}:{children: JSX.Element, title:string}) =>{
    return (
        <div className="p-6 bg-teal-400 rounded-xl">
            <h1 className="text-grey-900 font-bold text-2xl mb-3 text-center">{title}</h1>
            {children}
        </div>
    )
}

const MyOrders = ({cancelOrder,orders}:{cancelOrder: (arg0: string)=>void,orders: Order[]}) =>{
    const indents = [];
    for(let i=orders.length-1;i>=0;i--){
        indents.push(
        <div key={i} className="grid grid-cols-6 gap-4 place-items-center py-2">
            <div>
                {(Math.round(orders[i].size * 100) / 100).toFixed(2)}
            </div>
            <div>
                {(Math.round((orders[i].orderSize - orders[i].size) * 100) / 100).toFixed(2)}
            </div>
            <div>
                {orders[i].price}
            </div>
            <div>
                {orders[i].bid ? "BUY" : "SELL"}
            </div>
            <div>
                {orders[i].filled ? "Filled" : "Pending"}
            </div>
            {!orders[i].filled ?
            <div>
                <div onClick={()=>cancelOrder(orders[i].orderId)} className="underline text-center text-blue-500 hover:text-black hover:cursor-pointer">Cancel</div>
            </div>:<></>
            }
        </div>
        )
    }
    return indents;
}

export default function Portfolio() {
    const {connect,address,balance, getBalance} = useEthereum();
    // const [orders, setOrders] = useState<Order[]>([]);
    const [trades,setTrades] = useState<Trade[]>();
    const [userInfo, setUserInfo] = useState<UserInfo>();

    useEffect(() => {
        connect()
        .then((address)=>startWebSocket(address,setUserInfo,null,null,setTrades))
        .then(getBalance)
    }, [address]);

    const cancelOrder = async(orderId:string)=>{
        const url = `http://localhost:8080/book/ETH/${orderId}`;
        if(confirm("Cancel Order?")){
        await fetch(url,{method: 'DELETE',})
            .then((res)=>res.text())
            .then((msg)=>alert(msg))
        // await getUserInfo(address)
        }
    }

    // const getUserInfo = async(add:string | undefined)=>{
    //     if(add == "" || add == undefined){
    //         alert("Please First Connect Your Wallet");
    //         return;
    //     }
    //     const url = `http://127.0.0.1:8080/order/${add}`;
    //     return fetch(url,{method: 'GET',})
    //     .then((res)=>res.json())
    //     .then((userData)=>{
    //         setOrders(userData.orders)
    //     });
    // }

    return (
        <div className="container mx-auto tex-2xl">
            <Navigation connect={connect} address={address}/>
            <div className="container mx-auto">
                {trades == null || balance == null || userInfo == null ? <></> : <AssetInfo balance={balance} userInfo={userInfo} price={trades[0].price}/>}
                <div className="flex space-x-10">
                    <Card title="My Orders">
                            <div>
                                <h1 className="text-xl text-center"></h1>
                                <div className="grid grid-cols-6 gap-4 p-2 place-items-center">
                                    <div>
                                        AMOUNT
                                    </div>
                                    <div>
                                        FILLED
                                    </div>
                                    <div>
                                        PRICE
                                    </div>
                                    <div>
                                        TYPE
                                    </div>
                                    <div>
                                        STATUS
                                    </div>
                                    <div>
                                        ACTION
                                    </div>
                                </div>
                        {userInfo == null ? <></>:
                            <MyOrders cancelOrder={cancelOrder} orders={userInfo.orders}/>}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

