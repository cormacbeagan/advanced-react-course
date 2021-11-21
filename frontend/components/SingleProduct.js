import { gql, useQuery } from '@apollo/client';
import Head from 'next/head';
import styled from 'styled-components';
import formatMoney from '../lib/money';
import AddToCart from './AddToCart';
import DisplayError from './ErrorMessage';
import SignInCheck from './SignInCheck';

const ProductStyles = styled.div`
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  max-width: var(--maxWidth);
  align-items: center;
  gap: 2rem;
  img {
    width: 100%;
    object-fit: contain;
  }
  button {
    background: inherit;
    border: 1px solid var(--lightGray);
    padding: 1rem 2rem;
    cursor: pointer;
    &:focus,
    &:hover {
      text-decoration: underline;
    }
  }
`;

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    Product(where: { id: $id }) {
      name
      price
      description
      id
      photo {
        altText
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

export default function SingleProduct({ id }) {
  const { data, loading, error } = useQuery(SINGLE_ITEM_QUERY, {
    variables: { id },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <DisplayError error={error} />;
  const { Product } = data;

  return (
    <ProductStyles data-testid="singleProduct">
      <Head>
        <title>Sick Fits | {Product.name}</title>
      </Head>
      <img
        src={Product.photo.image.publicUrlTransformed}
        alt={Product.photo.altText}
      />
      <div className="details">
        <h2>{Product.name}</h2>
        <p>{Product.description}</p>
        <p>{formatMoney(Product.price)}</p>
        <SignInCheck>
          <AddToCart id={Product.id} />
        </SignInCheck>
      </div>
    </ProductStyles>
  );
}

export { SINGLE_ITEM_QUERY };
