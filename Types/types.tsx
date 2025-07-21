export type Order = {
    userId: string,
    orderId: string,
    size: number,
    orderSize: number,
    price: number,
    timestamp: string,
    bid: boolean,
    filled: boolean,
}

export type Limit = {
    price: number;
    totalVolume: number;
}

export type Trade = {
    price: number;
    size: number;
}

export type UserInfo = {
    shares: number;
    purchasedAmount: number;
    address: string;
    orders: Order[];
    balance: number;
}

export type Candle = {
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
}
