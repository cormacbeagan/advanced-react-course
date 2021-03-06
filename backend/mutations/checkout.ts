/* eslint-disable */
import { KeystoneContext } from '@keystone-next/types';
import {
  CartItemCreateInput,
  OrderCreateInput,
} from '../.keystone/schema-types';
import formatMoney from '../lib/formatMoney';
import stripeConfig from '../lib/stripe';

//* typing the token input
interface Arguments {
  token: string;
}

const graphql = String.raw;

async function checkout(
  root: any,
  { token }: Arguments,
  context: KeystoneContext
): Promise<OrderCreateInput> {
  //* 1. make sure they are signed in
  const userId = context.session.itemId;
  if (!userId) throw new Error('Sorry you have to be signed in!');
  //* 1.5 query the current user
  const user = await context.lists.User.findOne({
    where: {
      id: userId,
    },
    resolveFields: graphql`
        id
        name
        email
        cart {
          id
          quantity
          product {
            name
            price
            description
            id 
            photo {
              id
              image {
                publicUrlTransformed
              }
            }
          }
        }
      `,
  });
  //* 2. Calculate total cost
  const cartItems = user.cart.filter((cartItem) => cartItem.product);
  const amount = cartItems.reduce(function (
    tally: number,
    cartItem: CartItemCreateInput
  ) {
    return tally + cartItem.quantity * cartItem.product.price;
  },
  0);

  //* 3. create the charge with stripe lib
  const charge = await stripeConfig.paymentIntents
    .create({
      amount,
      currency: 'EUR',
      confirm: true,
      payment_method: token,
    })
    .catch((err) => {
      console.log(err);
      throw new Error(err.message);
    });

  //* 4. convert the cartItems to order Items
  const orderItems = cartItems.map((cartItem) => {
    const orderItem = {
      name: cartItem.product.name,
      description: cartItem.product.description,
      price: cartItem.product.price,
      quantity: cartItem.quantity,
      photo: { connect: { id: cartItem.product.photo.id } },
    };
    return orderItem;
  });
  //* 5. create the order and return it to save it in the db
  const order = await context.lists.Order.createOne({
    data: {
      total: charge.amount,
      charge: charge.id,
      items: { create: orderItems },
      user: { connect: { id: userId } },
    },
  });
  //* 6. clean up old cart items
  const cartItemIds = user.cart.map((cartItem) => cartItem.id);
  await context.lists.CartItem.deleteMany({
    ids: cartItemIds,
  });
  return order;
}

export default checkout;
