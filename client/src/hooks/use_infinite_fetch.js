import React from 'react';
import { useSWRInfinite } from 'swr';

const LIMIT = 10;

/**
 * @template T
 * @typedef {object} ReturnValues
 * @property {Array<T>} data
 * @property {Error | null} error
 * @property {boolean} isLoading
 * @property {() => Promise<void>} fetchMore
 */

/**
 * @template T
 * @param {string} apiPath
 * @param {(apiPath: string) => Promise<T[]>} fetcher
 * @returns {ReturnValues<T>}
 */
// export function useInfiniteFetch(apiPath, fetcher) {
//   const internalRef = React.useRef({ isLoading: false, offset: 0 });

//   const [result, setResult] = React.useState({
//     data: [],
//     error: null,
//     isLoading: true,
//   });

//   const fetchMore = React.useCallback(async () => {
//     const { isLoading, offset } = internalRef.current;
//     if (isLoading) {
//       return;
//     }

//     setResult((cur) => ({
//       ...cur,
//       isLoading: true,
//     }));
//     internalRef.current = {
//       isLoading: true,
//       offset,
//     };

//     try {
//       const allData = await fetcher(apiPath);

//       setResult((cur) => ({
//         ...cur,
//         data: [...cur.data, ...allData.slice(offset, offset + LIMIT)],
//         isLoading: false,
//       }));
//       internalRef.current = {
//         isLoading: false,
//         offset: offset + LIMIT,
//       };
//     } catch (error) {
//       setResult((cur) => ({
//         ...cur,
//         error,
//         isLoading: false,
//       }));
//       internalRef.current = {
//         isLoading: false,
//         offset,
//       };
//     }
//   }, [apiPath]);

//   React.useEffect(() => {
//     setResult(() => ({
//       data: [],
//       error: null,
//       isLoading: true,
//     }));
//     internalRef.current = {
//       isLoading: false,
//       offset: 0,
//     };

//     fetchMore();
//   }, [fetchMore]);

//   return {
//     ...result,
//     fetchMore,
//   };
// }
//

export const useInfiniteFetch = (url, fetcher) => {
  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.length) return null;

    if (pageIndex === 0) return `${url}?limit=${LIMIT}`;

    return `${url}?limit=${LIMIT}&offset=${pageIndex}`;
  };

  const result = useSWRInfinite(getKey, fetcher);

  const fetchMore = React.useCallback(() => {
    result.setSize(result.size + LIMIT);
  }, [result]);

  const data = [];
  if (result.data && result.data.length) {
    result.data.forEach((d) => data.push(...d));
  }

  return {
    ...result,
    data,
    fetchMore,
  };
};
