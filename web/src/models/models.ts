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
    cancelled: boolean;
    fromChainId: string;
    toChainId: string;
    filled: boolean;
}