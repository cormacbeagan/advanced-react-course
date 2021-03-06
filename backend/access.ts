import { permissionsList } from './schemas/fields';
import { ListAccessArgs } from './types';

export function isSignedIn({ session }: ListAccessArgs) {
  return !!session; //* !! returns false for undefined
}

const generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function ({ session }: ListAccessArgs) {
      return !!session?.data.role?.[permission];
    },
  ])
);

export const permissions = {
  ...generatedPermissions,
  // you can also add your own here
  isAwesome({ session }: ListAccessArgs) {
    return session?.data.name.includes('Mac');
  },
};

//* rules can return a boolean or a filter which limits which products they can update or delete

export const rules = {
  canManageProducts({ session }: ListAccessArgs) {
    //* 1. Do they have the canManageProducts permission ie are they an admin
    if (permissions.canManageProducts({ session })) {
      return true;
    }
    //* 2. If not do they own the product
    //* graphQL 'where' filter - where user id = item.user.id
    return { user: { id: session.itemId } };
  },
  canReadProducts({ session }: ListAccessArgs) {
    if (permissions.canManageProducts({ session })) {
      return true; // can read everything
    }
    //* otherwise they should only be able to see products which are 'available'
    return { status: 'AVAILABLE' };
  },
  canOrder({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    if (permissions.canManageCart({ session })) {
      return true;
    }
    return { user: { id: session.itemId } };
  },
  canManageOrderItem({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    if (permissions.canManageProducts({ session })) {
      return true; // can read everything
    }
    return { order: { user: { id: session.itemId } } };
  },
  canManageUsers({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    if (permissions.canManageUsers({ session })) {
      return true;
    }
    // * otherwise they can only update themselves
    return { id: session.itemId };
  },
};
