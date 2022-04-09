export interface Order {
    orderId: number;
    sender: string;
    tokenContract: string;
    amount: number;
    hashlock: string;
    createTime: number;
    timelock: number; // locked UNTIL this time.
    withdrawn: boolean;
    refunded: boolean;
    fromChainId: string;
    toChainId: string;
}