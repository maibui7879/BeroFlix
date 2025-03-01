import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { Button, Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faChevronLeft, faChevronRight, faTools } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet-async";
const APP_DOMAIN_CDN_IMAGE = "https://phimimg.com";

const RegionFilm = () => {
  const { type_list } = useParams();
  const [films, setFilms] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [regionName, setRegionName] = useState("");
  const navigate = useNavigate();
  const filmCache = useMemo(() => new Map(), []);

  const fetchRegionName = useCallback(async () => {
    try {
      const response = await axios.get("https://phimapi.com/quoc-gia");
      const regions = response.data;
      const matchedRegion = regions.find((region) => region.slug === type_list);
      setRegionName(matchedRegion ? matchedRegion.name : type_list);
    } catch (error) {
      setRegionName(type_list);
    }
  }, [type_list]);

  useEffect(() => {
    fetchRegionName();
  }, [fetchRegionName]);

  const fetchFilms = useCallback(async (currentPage) => {
    setLoading(true);
    try {
      const pagesToFetch = currentPage === 1 ? [currentPage] : [currentPage, currentPage + 1].filter(p => p <= totalPages);
      const requests = pagesToFetch.map(p =>
        axios.get(`https://phimapi.com/v1/api/quoc-gia/${type_list}?page=${p}`)
      );
      const responses = await Promise.all(requests);
      const data = responses.flatMap(res => res.data?.data?.items || []);
      setFilms(data);
      setTotalPages(responses[0]?.data?.data?.params?.pagination?.totalPages || 1);
    } catch {
      setFilms([]);
    }
    setLoading(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [type_list, totalPages]);

  useEffect(() => {
    fetchFilms(page);
  }, [type_list, page, fetchFilms]);

  useEffect(() => {
    setCurrentSlide(0);
    if (page === 1 && films.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % Math.min(5, films.length));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [films, page]);

  const visiblePages = useMemo(() => {
    let pages = new Set([1, page - 1, page, page + 1, totalPages]);
    pages = [...pages].filter(p => p > 0 && p <= totalPages);
    return pages;
  }, [page, totalPages]);

  return (
    <div className="w-full px-8 py-4 bg-gray-900 pt-8">
      <Helmet>
        <title>BeroFlix - Phim {regionName}</title>
      </Helmet>
      {loading ? (
        <div className="w-full h-screen flex justify-center items-center bg-gray-900">
          <Spin size="large" />
        </div>
      ) : films.length > 0 ? (
        <>
          {page === 1 && (
            <div className="slider relative h-dvh overflow-hidden mb-8 hover:text-gray-700 mt-8">
              {films.slice(0, 5).map((film, index) => (
                <div
                  key={film._id}
                  onClick={() => navigate(`/film/${film.slug}`)}
                  className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
                    index === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    backgroundImage: `url(${APP_DOMAIN_CDN_IMAGE}/${film.poster_url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="w-full h-full bg-gradient-to-b from-transparent to-gray-900 flex items-end p-6">
                    <div className="text-white">
                      <h2 className="text-3xl font-bold mb-2 truncate">{film.name}</h2>
                      <p className="text-sm text-gray-300">{film.origin_name}</p>
                      <p className="text-sm text-gray-300">Năm: {film.year}</p>
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
          <h1 className="text-2xl font-bold mb-4 text-white pl-4 mt-12">
            Quốc gia: "{regionName}" - Trang {page}
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {films.map((film) => (
              <div
                key={film._id}
                className="bg-gray-800 text-white p-2 rounded hover:bg-gray-700 cursor-pointer"
                onClick={() => navigate(`/film/${film.slug}`)}
              >
                <img
                  src={`${APP_DOMAIN_CDN_IMAGE}/${film.poster_url}`}
                  alt={film.name}
                  className="w-full h-64 object-cover rounded"
                  loading="lazy"
                />
                <h2 className="text-lg font-semibold mt-2">{film.name}</h2>
                <p className="text-sm text-gray-400">{film.episode_current} - {film.quality}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 gap-2">
          <Button onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page === 1} className="bg-gray-800 text-white hover:bg-gray-700 border-none">
              <FontAwesomeIcon icon={faChevronLeft} />
            </Button>
            {visiblePages.map((num, index, arr) => (
              <span key={num}>
                {index > 0 && num - arr[index - 1] > 1 && <span className="text-white">...</span>}
                <Button
                  onClick={() => setPage(num)}
                  className={`bg-gray-800 text-white hover:bg-red-500 border-none ${page === num ? "bg-gray-700 font-bold" : ""}`}
                >
                  {num}
                </Button>
              </span>
            ))}
            <Button onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} disabled={page === totalPages} className="bg-gray-800 text-white hover:bg-red-700 border-none">
              <FontAwesomeIcon icon={faChevronRight} />
            </Button>
          </div>
        </>
      ) : (
        <div className="text-white text-center py-64">
          <FontAwesomeIcon icon={faTools} size="3x" />
          <h2 className="text-2xl">Xin lỗi, danh mục này hiện đang cập nhật</h2>
        </div>
      )}
    </div>
  );
};

export default RegionFilm;
