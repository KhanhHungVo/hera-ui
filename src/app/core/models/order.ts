import { Resource } from './resource';

export class Order extends Resource{
    orderDate: string;
    name: string;
    symbol: string;
    volume : number;
    reason : string;
    investmentValue : number;
    orderPrice : string;
    currentPrice: number;
    marketValue : number;
    gainLossPercentage : string;
    gainLoss : string;
    done: boolean;
}