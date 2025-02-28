import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import FilmList from "./FilmList";

const SortFilm = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialKeyword = searchParams.get("keyword") || "";

  const [keyword, setKeyword] = useState(initialKeyword);
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    setKeyword(initialKeyword);
  }, [initialKeyword]);

  const fetchFilms = useCallback(async (currentPage = 1) => {
    if (!keyword.trim()) {
      setResults([]);
      return;
    }
    try {
      const response = await axios.get(
        `https://phimapi.com/v1/api/tim-kiem?keyword=${keyword}&page=${currentPage}`
      );
      setResults(response.data.data?.items || []);
      setTotalPages(response.data.data?.params?.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Lỗi khi tải phim:", error);
    }
  }, [keyword]);

  useEffect(() => {
    fetchFilms(page);
  }, [page, fetchFilms]);

  const handleSearch = () => {
    if (keyword.trim()) {
      navigate(`/sortfilm?keyword=${encodeURIComponent(keyword)}`);
    }
  };

  return (
    <div className="w-full p-4 bg-gray-900 text-white">
      <Helmet>
        <title>
          {results.length > 0
            ? `BeroFlix - Kết quả tìm kiếm cho ${keyword}`
            : "BeroFlix - Tìm kiếm phim"}
        </title>
      </Helmet>

      <h2 className="text-xl font-bold mb-4 mt-20">Tìm kiếm phim</h2>
      <div className="relative md:w-1/4 w-full">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full p-2 pr-10 rounded bg-gray-800 text-white focus:outline-none"
          placeholder="Nhập tên phim..."
        />
        <button
          onClick={handleSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        >
          <FaSearch />
        </button>
      </div>

      {results.length > 0 ? (
        <>
          <h3 className="text-xl font-bold mt-6 mb-4">
            Kết quả tìm kiếm cho: {keyword}
          </h3>
          <FilmList results={results} />
        </>
      ) : (
        <div className="flex flex-col items-center mt-10 text-gray-400 p-32">
          <FaSearch className="text-6xl mb-4 " />
          <p className="text-lg font-semibold">Vui lòng nhập từ khóa</p>
        </div>
      )}
    </div>
  );
};

export default SortFilm;
