import {UserInfo} from "@/Types/types";

export default function AssetInfo ({userInfo,price}:{userInfo: UserInfo, price: number}){

    return(
    <div className="flex justify-between mb-16">
        <div className="p-12 bg-teal-400 rounded-xl text-3xl">
            <div>
                Balance: {userInfo.balance.toFixed(2)} ETH
            </div>
            <div>
                Total Market Value: {(userInfo.balance + userInfo.shares*price).toFixed(2)} ETH
            </div>
            <div className="text-lg text-gray-500">
                Unrealized gain/lost: {userInfo.shares*price-userInfo.purchasedAmount >= 0 ?
                    <span className="text-green-600">+{(userInfo.shares*price-userInfo.purchasedAmount).toFixed(2)}</span>:
                    <span className="text-red-500">{(userInfo.shares*price-userInfo.purchasedAmount).toFixed(2)}</span>
                }
            </div>
        </div>
        <div className="px-5"/>
        <div className="p-12 bg-teal-400 rounded-xl text-3xl">
            {userInfo.shares} BTC owned
        </div>
    </div>
    )

}
