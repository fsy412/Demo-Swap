export interface Order {
    orderId: number;
    sender: string;
    tokenContract: string;
    toTokenContract: string ;
    amount: number;
    toAmount: number;
    hashlock: string;
    createTime: number;
    // timelock: number; // locked UNTIL this time.
    fromChainId: string;
    toChainId: string;
    status: string;
    payee: string;
}