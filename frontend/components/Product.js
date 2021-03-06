import PropTypes from 'prop-types';
import Link from 'next/link';
import ItemStyles from './styles/ItemStyles';
import Title from './styles/Title';
import PriceTag from './styles/PriceTag';
import formatMoney from '../lib/money';
import DeleteProduct from './DeleteProduct';
import AddToCart from './AddToCart';
import SignInCheck from './SignInCheck';
import { useUser } from './User';

export default function Product({ product }) {
  const me = useUser();
  return (
    <ItemStyles>
      <img
        src={product?.photo?.image?.publicUrlTransformed}
        alt={product.name}
      />
      <Title>
        <Link href={`/product/${product.id}`}>{product.name}</Link>
      </Title>
      <PriceTag>{formatMoney(product.price)}</PriceTag>
      <p>{product.description}</p>
      <div className="buttonList">
        <SignInCheck>
          <Link
            href={{
              pathname: '/update',
              query: {
                id: product.id,
              },
            }}
          >
            Edit
          </Link>
        </SignInCheck>

        {me ? (
          <AddToCart id={product.id} />
        ) : (
          <Link href="/signin">Please Sign In To Buy</Link>
        )}
        <SignInCheck>
          <DeleteProduct id={product.id}>Delete</DeleteProduct>
        </SignInCheck>
      </div>
    </ItemStyles>
  );
}
Product.propTypes = {
  product: PropTypes.shape({
    description: PropTypes.any,
    id: PropTypes.any,
    name: PropTypes.any,
    photo: PropTypes.shape({
      image: PropTypes.shape({
        publicUrlTransformed: PropTypes.any,
      }),
    }),
    price: PropTypes.any,
  }),
};
