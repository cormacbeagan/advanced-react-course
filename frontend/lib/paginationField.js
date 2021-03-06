/* eslint-disable no-plusplus */
import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, //* this notifies apollo that we will handle all cache data
    //* existing is the items in the cache, args is the first and skip values(variables) the cache is the cache itself with methods eg evict()
    read(existing = [], { args, cache }) {
      const { skip, first } = args;
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      //* check if we have existing items
      const items = existing.slice(skip, skip + first).filter((x) => x);
      //* if there are items but not enough to fill a whole page nad we are on the last page - THEN just send them
      if (items.length && items.length !== first && page === pages) {
        return items;
      }

      if (items.length !== first) {
        //* we don't have the items
        return false;
      }

      //* if there are items we return them
      if (items.length) {
        console.log(`There are ${items.length} items`);
        return items;
      }

      return false; //* fall back option is to get apollo to fetch from network

      //* appollo first asks the read function if it has them already
      //* 1, you can return the items if they are already in the cache
      //* or you can return false and apollo will make a network request
    },
    //* after network request you get the existing cache the incoming items in an [] and the args {} - variables with which the request was made
    merge(existing, incoming, { args }) {
      const { skip, first } = args;
      console.log(
        `Merging items from the network, ${incoming.length} new items`
      );
      //* after apollo makes a network request it sends the items here
      //* and they then need to be sorted into the cache
      const merged = existing ? existing.slice(0) : [];
      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      //* apollo goes back to the read method and request the data again - it should be there after we have merged it in
      return merged;
    },
  };
}
