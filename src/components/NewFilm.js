import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { Button, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet-async";

const NewFilm = () => {
  const [films, setFilms] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const visiblePages = useMemo(() => {
    let pages = new Set([1, page - 1, page, page + 1, totalPages]);
    return [...pages].filter((p) => p > 0 && p <= totalPages);
  }, [page, totalPages]);

  const fetchFilms = useCallback(async () => {
    setLoading(true);
    try {
      if (page === 1) {
        const response = await axios.get(`https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=${page}`);
        setFilms(response.data.items);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        const [res1, res2] = await Promise.all([
          axios.get(`https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=${page * 2}`),
          axios.get(`https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=${page * 2 + 1}`)
        ]);
        setFilms([...res1.data.items, ...res2.data.items]);
        setTotalPages(Math.ceil(res2.data.pagination.totalPages / 2));
      }
    } catch (error) {
      console.error("Lỗi tải phim:", error);
    }
    setLoading(false);
  }, [page]);

  useEffect(() => {
    fetchFilms();
  }, [fetchFilms]);

  useEffect(() => {
    if (page === 1 && films.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % Math.min(5, films.length));
      }, 3000);
      return () => clearInterval(interval);
    } else {
      setCurrentSlide(0);
    }
  }, [films, page]);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-900">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="w-full px-8 py-4 bg-gray-900 pt-8">
      <Helmet>
        <title>BeroFlix - Phim Mới Cập Nhật</title>
      </Helmet>
      {page === 1 && films.length > 0 && (
        <div
          className="slider relative h-dvh overflow-hidden mb-8 hover:text-gray-700 mt-8"
          onClick={() => navigate(`/film/${films[currentSlide].slug}`)}
        >
          {films.slice(0, 5).map((film, index) => (
            <div
              key={film._id}
              className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
              style={{
                backgroundImage: `url(${film.thumb_url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="w-full h-full bg-gradient-to-b from-transparent to-gray-900 flex items-end p-6">
                <div className="text-white">
                  <h2 className="text-3xl font-bold mb-2 truncate">{film.name}</h2>
                  <p className="text-sm text-gray-300">{film.year}</p>
                  <button className="rounded-full bg-green-800 px-4 py-2 mt-4 flex items-center space-x-2">
                    <FontAwesomeIcon icon={faPlay} />
                    <span><b>Xem ngay</b></span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <h1 className="text-2xl font-bold mb-4 text-white">Phim Mới Cập Nhật</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
  {films.map((film) => (
    <div
      key={film._id}
      className="bg-gray-800 text-white p-1 sm:p-2 rounded hover:bg-gray-700 cursor-pointer"
      onClick={() => navigate(`/film/${film.slug}`)}
    >
      <img
        src={film.thumb_url}
        alt={film.name}
        className="w-full h-16 sm:h-52 md:h-60 object-cover rounded"
      />
      <h2 className="text-sm sm:text-base md:text-lg font-semibold mt-1 sm:mt-2">
        {film.name}
      </h2>
      <p className="text-xs sm:text-sm text-gray-400 font-semibold">
        {film.origin_name}
      </p>
      <p className="text-xs sm:text-sm text-gray-400">{film.year}</p>
    </div>
  ))}
</div>

      <div className="flex justify-center mt-4 gap-2">
        <Button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
          className="bg-gray-800 text-white hover:bg-red-500 border-none"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>
        {visiblePages.map((num, index, arr) => (
          <>
            {index > 0 && num - arr[index - 1] > 1 && <span className="text-white">...</span>}
            <Button
              key={num}
              onClick={() => setPage(num)}
              className={`bg-gray-800 text-white hover:bg-red-500 border-none ${page === num ? "bg-gray-700 font-bold" : ""}`}
            >
              {num}
            </Button>
          </>
        ))}
        <Button
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={page === totalPages}
          className="bg-gray-800 text-white hover:bg-red-500 border-none"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </Button>
      </div>
    </div>
  );
};

export default NewFilm;
