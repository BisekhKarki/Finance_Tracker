export interface Transaction {
  _id: string;
  type: string;
  userId: string;
  Amount: number;
  Category: string;
  Description: string;
  Date: string;
}

export interface AddTransactionProps {
  type: string;
  userId: string;
  Amount: number;
  Category: string;
  Description: string;
  Date: string;
}
