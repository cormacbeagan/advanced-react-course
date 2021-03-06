import { useUser } from './User';

export default function PleaseSignIn({ children }) {
  const me = useUser();
  if (!me) return null;
  return children;
}
