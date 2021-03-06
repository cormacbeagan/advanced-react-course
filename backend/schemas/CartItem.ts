import { integer, relationship, select, text } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import { ProductImage } from './ProductImage';

export const CartItem = list({
  // todo custom label
  ui: {
    listView: {
      initialColumns: ['user', 'quantity', 'product'],
    },
  },
  fields: {
    quantity: integer({
      defaultValue: 1,
      isRequired: true,
    }),
    product: relationship({ ref: 'Product' }),
    user: relationship({ ref: 'User.cart' }),
  },
});
