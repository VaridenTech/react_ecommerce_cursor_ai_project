import React from "react";
import ReactPaginate from "react-paginate";
import styles from "./Pagination.module.scss";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <ReactPaginate
      previousLabel={"Previous"}
      nextLabel={"Next"}
      breakLabel={"..."}
      pageCount={totalPages}
      forcePage={currentPage - 1} // react-paginate uses zero-based page index
      pageRangeDisplayed={5}
      onPageChange={(data) => onPageChange(data.selected + 1)} // convert back to one-based
      containerClassName={`${styles.pagination} flex gap-10`}
      activeClassName={styles.active}
      previousClassName={styles.previous}
      nextClassName={styles.next}
      disabledClassName={styles.disabled}
    />
  );
};

export default Pagination;
