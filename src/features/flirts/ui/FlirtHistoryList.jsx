"use client";
import "./css/flirt-history.css";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useInfiniteScroll } from "@/lib/hooks/useInfiniteScroll";
import { useAuth } from "@/lib/hooks/useAuth";
import PrimarySpinner from "@/components/ui/spinners/PrimarySpinner";

import { useGetFlirtHistoryQuery } from "../api/flirtsApi";

import {
  selectActiveFlirt,
  selectAllFlirts,
  selectHasMoreFlirts,
} from "../model/flirtsSlice";
import FlirtCard from "./FlirtCard";

const FlirtHistoryList = () => {
  const { uuid } = useAuth();

  const [page, setPage] = useState(1);

  const { isLoading, isFetching, isError } = useGetFlirtHistoryQuery(
    {
      uuid,
      page,
    },
    { skip: !uuid, refetchOnMountOrArgChange: true }
  );

  const activeFlirt = useSelector(selectActiveFlirt);

  const flirts = useSelector((state) => selectAllFlirts(state, uuid, page));
  const hasMore = useSelector((state) =>
    selectHasMoreFlirts(state, uuid, page)
  );

  const lastElementRef = useInfiniteScroll({
    isFetching,
    hasMore,
    onLoadMore: () => {
      if (hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    },
  });

  const content =
    isLoading && !isFetching ? (
      <PrimarySpinner style={{ fontSize: 24, color: "var(--accent)" }} />
    ) : isError ? (
      <p>Error loading flirts. Please try again later.</p>
    ) : (
      flirts.map((flirt, index) => {
        const isLastElement = index === flirts.length - 1;
        const isSelected = activeFlirt?.id === flirt.id;

        return (
          <FlirtCard
            key={flirt.id}
            ref={isLastElement ? lastElementRef : null}
            flirt={flirt}
            isSelected={isSelected}
            hasActions={true}
          />
        );
      })
    );

  return (
    <div className="flirt-history g-bg">
      <h2>Your Firts</h2>
      <ul className="flirt-history-list">{content}</ul>
      {isFetching && (
        <PrimarySpinner
          style={{
            fontSize: 24,
            color: "var(--accent)",
            marginTop: "var(--spacing-md)",
          }}
        />
      )}
      {flirts?.length === 0 && !isLoading && <p>No flirts found.</p>}
    </div>
  );
};

export default FlirtHistoryList;
