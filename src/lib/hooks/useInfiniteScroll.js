import { useRef, useCallback } from "react";

export function useInfiniteScroll({ isFetching, hasMore, onLoadMore }) {
  const observer = useRef();

  const lastElementRef = useCallback(
    (node) => {
      // If we are already fetching, don't set up a new observer.
      if (isFetching) return;

      // If the observer is already set, disconnect it to avoid memory leaks.
      if (observer.current) {
        observer.current.disconnect();
      }

      // Create a new IntersectionObserver.
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore();
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [isFetching, hasMore, onLoadMore]
  );

  return lastElementRef;
}
