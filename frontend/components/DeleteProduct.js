import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

const DELETE_PRODUCT_MUTATION = gql`
  mutation DELETE_PRODUCT_MUTATION($id: ID!) {
    deleteProduct(id: $id) {
      id
      name
    }
  }
`;

//* this function is part of the Apollo 3 api and is called after the useMutation
//* function has finished. the cache is the cache of data stored by apollo and the
//* payload is the data returned form graphQl (id, name) it actually needs the id and __productType
//* cache.identify finds the item in the cache and cache.evict removes it
//* this saves refreshing the get allProducts query and a trip to the backend
//* its also super fast.
function update(cache, payload) {
  console.log(payload);
  cache.evict(cache.identify(payload.data.deleteProduct));
}

export default function DeleteProduct({ id, children }) {
  const [deleteProduct, { loading }] = useMutation(DELETE_PRODUCT_MUTATION, {
    variables: { id },
    update,
  });
  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => {
        if (confirm('Are you sure you want to delete this item')) {
          console.log('deleting');
          deleteProduct().catch((err) => alert(err.message));
        }
      }}
    >
      {children}
    </button>
  );
}
