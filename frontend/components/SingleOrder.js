import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import styled from 'styled-components';
import formatMoney from '../lib/money';
import CartItemStyles from './styles/CartStyles';

const OrderItemStyles = styled.div`
  width: 50%;
  margin: 0 10rem;
  padding: 1rem;
  border-bottom: 2px solid var(--lightGrey);
  display: grid;
  grid-template-columns: 1fr 2fr;
`;

const OrderStyles = styled.div`
  margin: 0 auto;
  padding: 4rem;
`;

const ORDER_QUERY = gql`
  query ORDER_QUERY($id: ID!) {
    order: Order(where: { id: $id }) {
      id
      total
      charge
      label
      user {
        id
        name
        email
      }
      items {
        name
        price
        quantity
        photo {
          image {
            publicUrlTransformed
          }
        }
      }
    }
  }
`;

export default function SingleOrder({ id }) {
  console.log(id);
  const { data, error, loading } = useQuery(ORDER_QUERY, {
    variables: { id },
  });
  console.log(data);
  const items = data?.order.items || [];
  const order = data?.order || {};
  console.log(items);
  return (
    <div>
      <h4>Hey {order.user.name} Details of your Order:</h4>
      {items.map((item) => (
        <OrderItem key={item.name} item={item} />
      ))}
      <p>Total Price: {order.label}</p>
      <p>Details have been sent to: {order.user.email}</p>
    </div>
  );
}

function OrderItem({ item }) {
  console.log(item);
  return (
    <OrderItemStyles>
      <img
        width="100"
        src={item.photo.image.publicUrlTransformed}
        alt={item.name}
      />
      <div>
        <h3>{item.name}</h3>
        <p>
          {formatMoney(item.price * item.quantity)} -
          <em>
            {item.quantity} &times; {formatMoney(item.price)}
          </em>
        </p>
      </div>
    </OrderItemStyles>
  );
}
