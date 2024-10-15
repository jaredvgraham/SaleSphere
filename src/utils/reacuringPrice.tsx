export async function createRecurringPrice(plan: string) {
  let price: number;
  switch (plan) {
    case "basic":
      price = 1000;
      break;
    case "standard":
      price = 5000;
      break;
    case "premium":
      price = 10000;
      break;
    default:
      price = 0;
  }
  return price;
}
