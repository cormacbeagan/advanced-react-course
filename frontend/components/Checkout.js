import { useMutation } from '@apollo/client';
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import gql from 'graphql-tag';
import { useRouter } from 'next/dist/client/router';
import nProgress from 'nprogress';
import { useState } from 'react';
import styled from 'styled-components';
import { useCart } from '../lib/cartState';
import SickButton from './styles/SickButton';
import { CURRENT_USER_QUERY } from './User';

const CheckOutFormStyles = styled.form`
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.04);
  border-radius: 5px;
  padding: 1rem;
  display: grid;
  grid-gap: 1rem;
`;

const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($token: String!) {
    checkout(token: $token) {
      id
      charge
      total
      items {
        id
        name
      }
    }
  }
`;

const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

function CheckoutForm() {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const stripe = useStripe(); // this gets made available through the Elements provider hence the 2 components
  const elements = useElements();
  const router = useRouter();
  const { closeCart } = useCart();
  const [checkout, { error: graphQLError }] = useMutation(
    CREATE_ORDER_MUTATION,
    {
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
    }
  );

  async function handleSubmit(e) {
    //* 1 stop form from submitting and activate loading state
    e.preventDefault();
    setLoading(true);

    //* 2. start the page transition
    nProgress.start();

    //* 3. create the payment method via stripe (token comes back on success)
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });
    //* 4. handle errors - CC can produce lots
    if (error) {
      setError(error);
      nProgress.done();
      return;
    }
    //* 5. send the token to keystone via custom mutation
    const order = await checkout({
      variables: {
        token: paymentMethod.id,
      },
    });
    console.log('Finished with the order');
    console.log(order);
    //* 6. change the page to view the order
    router.push({
      pathname: '/order/[id]',
      query: { id: order.data.checkout.id },
    });
    //* 7. close cart
    closeCart();
    //* 8. turn off the loading state
    setLoading(false);
    nProgress.done();
  }
  return (
    <CheckOutFormStyles onSubmit={handleSubmit}>
      {error && <p style={{ fontSize: '15px' }}>{error.message}</p>}
      {graphQLError && <p style={{ fontSize: '15px' }}>{graphQLError}</p>}
      <CardElement />
      <SickButton>Check out now</SickButton>
    </CheckOutFormStyles>
  );
}

export default function Checkout() {
  return (
    <Elements stripe={stripeLib}>
      <CheckoutForm />
    </Elements>
  );
}
