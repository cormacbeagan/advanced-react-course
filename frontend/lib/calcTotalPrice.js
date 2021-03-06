export default function calcTotalPrice(cart) {
  return cart.reduce((tally, item) => {
    if (!item.product) return tally; // product can be deleted from cart
    return tally + item.quantity * item.product.price;
  }, 0);
}
