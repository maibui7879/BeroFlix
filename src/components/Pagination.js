import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Button } from "antd";

const Pagination = ({ page, setPage, totalPages, visiblePages }) => {
  return (
    totalPages > 1 && (
      <div className="mt-6 p-2 flex justify-center space-x-2 text-white">
        <Button onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page === 1} className="bg-gray-800 text-white hover:bg-gray-700 border-none">
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>
        {visiblePages.map((num) => (
          <Button key={num} onClick={() => setPage(num)} className={`bg-gray-800 text-white hover:bg-red-500 border-none ${page === num ? "bg-gray-700 font-bold" : ""}`}>
            {num}
          </Button>
        ))}
        <Button onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} disabled={page === totalPages} className="bg-gray-800 text-white hover:bg-red-500 border-none">
          <FontAwesomeIcon icon={faChevronRight} />
        </Button>
      </div>
    )
  );
};

export default Pagination;
