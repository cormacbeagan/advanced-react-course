import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { CURRENT_USER_QUERY } from './User';

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: var(--red);
    cursor: pointer;
  }
`;

const DELETE_CART_ITEM_MUTATION = gql`
  mutation DELETE_CART_ITEM_MUTATION($id: ID!) {
    deleteCartItem(id: $id) {
      id
    }
  }
`;

function update(cache, payload) {
  cache.evict(cache.identify(payload.data.deleteCartItem));
}

export default function RemoveFromCart({ id }) {
  const [deleteCartItem, { loading }] = useMutation(DELETE_CART_ITEM_MUTATION, {
    variables: { id },
    update,
    //* this is refetching all request from the backend and causing the pagination query to throw and error
    // optimisticResponse: {
    //   deleteCartItem: {
    //     __typename: 'CartItem',
    //     id,
    //   },
    // },
  });

  return (
    <BigButton
      disabled={loading}
      type="button"
      onClick={deleteCartItem}
      title="Remove this item from cart"
    >
      &times;
    </BigButton>
  );
}
