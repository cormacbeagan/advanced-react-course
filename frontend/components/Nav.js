import Link from 'next/link';
import { useCart } from '../lib/cartState';
import CartCount from './CartCount';
import SignOut from './SignOut';
import NavStyles from './styles/NavStyles';
import { useUser } from './User';

export default function Nav() {
  const user = useUser();
  const { openCart } = useCart();
  return (
    <NavStyles>
      <Link prefetch={false} href="/products">
        Products
      </Link>
      {user && (
        <>
          <Link prefetch={false} href="/sell">
            Sell
          </Link>
          <Link prefetch={false} href="/orders">
            Orders
          </Link>
          <Link prefetch={false} href="/account">
            Account
          </Link>
          <SignOut />
          <button type="button" onClick={openCart}>
            My Cart
            <CartCount
              count={user.cart.reduce(
                (tally, item) => tally + (item.product ? item.quantity : 0),
                0
              )}
            />
          </button>
        </>
      )}
      {!user && (
        <>
          <Link href="/signin">Sign In</Link>
        </>
      )}
    </NavStyles>
  );
}
