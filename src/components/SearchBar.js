import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

const SearchBar = ({ keyword, setKeyword, showFilters, setShowFilters }) => {
  return (
    <div className="flex items-center gap-4 w-1/4 ">
      <input
        type="text"
        placeholder="Nhập từ khóa..."
        className="p-2 border border-gray-700 rounded bg-gray-800 flex-1"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="px-2 py-1 border-2 text-red-500 border-red-500 hover:bg-red-500 hover:text-white font-bold rounded-full"
      >
        <FontAwesomeIcon icon={showFilters ? faChevronUp : faChevronDown} />
      </button>
    </div>
  );
};

export default SearchBar;
