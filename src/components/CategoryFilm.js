import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { Button, Spin } from "antd";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faChevronLeft, faChevronRight, faTools } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet-async";

const APP_DOMAIN_CDN_IMAGE = "https://phimimg.com";

const CategoryFilm = () => {
  const { type_list } = useParams();
  const [films, setFilms] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const filmCache = useMemo(() => new Map(), []);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;

  const fetchFilms = useCallback(async (currentPage) => {
    if (filmCache.has(`${type_list}-${currentPage}`)) {
      setFilms(filmCache.get(`${type_list}-${currentPage}`));
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`https://phimapi.com/v1/api/the-loai/${type_list}?page=${currentPage}`);
      const data = response.data.data;
      setFilms(data.items);
      setTotalPages(data.params.pagination.totalPages);
      filmCache.set(`${type_list}-${currentPage}`, data.items);
    } catch (error) {
      console.error("Error fetching films:", error);
    }
    setLoading(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [type_list, filmCache]);

  useEffect(() => {
    fetchFilms(page);
  }, [type_list, page, fetchFilms]);

  useEffect(() => {
    axios.get("https://phimapi.com/the-loai")
      .then(response => setCategories(response.data))
      .catch(error => console.error("Error fetching categories:", error));
  }, []);

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  const visiblePages = useMemo(() => {
    const pages = new Set([1, totalPages, page]);
    if (page > 1) pages.add(page - 1);
    if (page < totalPages) pages.add(page + 1);
    return [...pages].sort((a, b) => a - b);
  }, [page, totalPages]);

  const categoryName = useMemo(() => {
    const category = categories.find(cat => cat.slug === type_list);
    return category ? category.name : "Không xác định";
  }, [categories, type_list]);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-900">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="w-full px-2 md:px-8 py-4 bg-gray-900 pt-8">
      <Helmet>
        <title>BeroFlix - Phim {categoryName}</title>
        <meta name="description" content={`Xem phim ${categoryName} mới nhất, miễn phí trên BeroFlix. Trang ${page}.`} />
        <meta property="og:title" content={`BeroFlix - Phim ${categoryName}`} />
        <meta property="og:description" content={`Xem phim ${categoryName} miễn phí trên BeroFlix. Trang ${page}.`} />
        <meta property="og:image" content="URL_ẢNH_COVER" />
        <meta property="og:type" content="website" />
      </Helmet>

      {films.length > 0 ? (
        <>
          {page === 1 && (
            <div className="relative h-[60vh] sm:h-dvh overflow-hidden mb-6 sm:mb-8 mt-6 sm:mt-8">
              {films.slice(0, 5).map((film) => (
                <div
                  key={film._id}
                  onClick={() => navigate(`/film/${film.slug}`)}
                  className="absolute top-0 left-0 w-full h-full transition-opacity duration-1000 cursor-pointer"
                  style={{
                    backgroundImage: `url(${APP_DOMAIN_CDN_IMAGE}/${film.poster_url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="w-full h-full bg-gradient-to-b from-transparent to-gray-900 flex items-end p-4 sm:p-6">
                    <div className="text-white">
                      <h2 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2 truncate">{film.name}</h2>
                      <p className="text-xs sm:text-sm text-gray-300">{film.origin_name}</p>
                      <p className="text-xs sm:text-sm text-gray-300">Năm: {film.year}</p>
                      <button className="rounded-full bg-green-800 px-3 sm:px-4 py-1.5 sm:py-2 mt-3 sm:mt-4 flex items-center space-x-2 text-sm sm:text-base">
                        <FontAwesomeIcon icon={faPlay} />
                        <span><b>Xem ngay</b></span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <h1 className="text-2xl font-bold mb-4 text-white pl-4 mt-16">
            {categoryName} - Trang {page}
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {films.map((film) => (
              <div
                key={film._id}
                className="md:bg-gray-800 text-white sm:p-2 rounded hover:bg-gray-700 cursor-pointer"
                onClick={() => navigate(`/film/${film.slug}`)}
              >
                <img
                  src={`${APP_DOMAIN_CDN_IMAGE}/${film.poster_url}`}
                  alt={film.name}
                  className="w-full h-32 sm:h-48 md:h-64 object-cover rounded"
                  loading="lazy"
                />
                <h2 className="ml-1 text-sm sm:text-base md:text-lg font-semibold mt-1 sm:mt-2">
                  {film.name}
                </h2>
                <p className="ml-1 mb-1 text-xs sm:text-sm text-gray-400">
                  {film.episode_current} - {film.quality}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-4 gap-2">
            <Button onClick={() => handlePageChange(Math.max(1, page - 1))} disabled={page === 1} className="bg-gray-800 text-white hover:bg-gray-700 border-none">
              <FontAwesomeIcon icon={faChevronLeft} />
            </Button>
            {visiblePages.map((num, index, arr) => (
              <span key={num}>
                {index > 0 && num - arr[index - 1] > 1 && <span className="text-white">...</span>}
                <Button
                  onClick={() => handlePageChange(num)}
                  className={`bg-gray-800 text-white hover:bg-red-500 border-none ${page === num ? "bg-gray-700 font-bold" : ""}`}
                >
                  {num}
                </Button>
              </span>
            ))}
            <Button onClick={() => handlePageChange(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="bg-gray-800 text-white hover:bg-red-700 border-none">
              <FontAwesomeIcon icon={faChevronRight} />
            </Button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-64 text-white">
          <FontAwesomeIcon icon={faTools} size="3x" className="text-yellow-400 mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-400">Xin lỗi, danh mục này hiện đang cập nhật</h2>
        </div>
      )}
    </div>
  );
};

export default CategoryFilm;
