export interface Transaction {
    id: number;
    productID: string;
    productName: string;
    amount: string;
    customerName: string;
    status: number;
    transactionDate: string;
    createBy: string;
    createOn: string;
    docId?: string;
  }
  
  export interface Status {
    id: number;
    name: string;
  }