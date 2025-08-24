export type Receipt = {
  store: string;
  total: number;
  currency: string;
  datetime: string;
  line_items: Array<{
    description: string;
    category: string;
    amount: number;
    quantity: number;
  }>;
};
