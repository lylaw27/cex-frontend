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
    fmv: number;
    address: string;
    orders: Order[];
}