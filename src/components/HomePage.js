import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet-async";
const HomePage = () => {
  const [films, setFilms] = useState([]);
  const [singleFilms, setSingleFilms] = useState([]);
  const [seriesFilms, setSeriesFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const getFullImageUrl = (thumbUrl) => `https://phimimg.com/${thumbUrl}`;

  const fetchFilms = useCallback(async () => {
    setLoading(true);
    try {
      const [newFilmsRes, singleFilmsRes, seriesFilmsRes] = await Promise.all([
        axios.get("https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=1"),
        axios.get("https://phimapi.com/v1/api/danh-sach/phim-le"),
        axios.get("https://phimapi.com/v1/api/danh-sach/phim-bo"),
      ]);
      setFilms(newFilmsRes.data.items);
      setSingleFilms(singleFilmsRes.data.data.items.slice(0, 10));
      setSeriesFilms(seriesFilmsRes.data.data.items.slice(0, 10));
    } catch (error) {
      console.error("Lỗi tải phim:", error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchFilms();
  }, [fetchFilms]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.min(5, films.length));
    }, 3000);
    return () => clearInterval(interval);
  }, [films]);

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
        <title>BeroFlix - Xem phim online miễn phí</title>
        <meta name="description" content="Xem phim mới nhất, phim bộ, phim lẻ miễn phí trên BeroFlix." />
        <meta property="og:title" content="BeroFlix - Xem phim online miễn phí" />
        <meta property="og:description" content="Xem phim mới nhất, phim bộ, phim lẻ miễn phí trên BeroFlix." />
        <meta property="og:image" content="URL_ẢNH_COVER" />
        <meta property="og:type" content="website" />
      </Helmet>
      {films.length > 0 && (
  <div
    className="relative h-[60vh] sm:h-dvh overflow-hidden mb-6 sm:mb-8 mt-6 sm:mt-8"
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
        <div className="w-full h-full bg-gradient-to-b from-transparent to-gray-900 flex items-end p-4 sm:p-6">
          <div className="text-white">
            <h2 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2 truncate">
              {film.name}
            </h2>
            <p className="text-xs sm:text-sm text-gray-300">{film.year}</p>
            <button className="rounded-full bg-green-800 px-3 sm:px-4 py-1.5 sm:py-2 mt-3 sm:mt-4 flex items-center space-x-2 text-sm sm:text-base">
              <FontAwesomeIcon icon={faPlay} />
              <span>
                <b>Xem ngay</b>
              </span>
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
)}


      <h1 className="text-2xl font-bold mb-4 text-white">Phim Mới Cập Nhật</h1>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
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

<h1 className="text-2xl font-bold mt-8 mb-4 text-white">Phim Lẻ</h1>
<div className="grid grid-cols-3 md:grid-cols-5 gap-4">
  {singleFilms.map((film) => (
    <div
      key={film._id}
      className="bg-gray-800 text-white p-1 sm:p-2 rounded hover:bg-gray-700 cursor-pointer"
      onClick={() => navigate(`/film/${film.slug}`)}
    >
      <img
        src={getFullImageUrl(film.thumb_url)}
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


<h1 className="text-2xl font-bold mt-8 mb-4 text-white">Phim Bộ</h1>
<div className="grid grid-cols-3 md:grid-cols-5 gap-4">
  {seriesFilms.map((film) => (
    <div
      key={film._id}
      className="bg-gray-800 text-white p-1 sm:p-2 rounded hover:bg-gray-700 cursor-pointer"
      onClick={() => navigate(`/film/${film.slug}`)}
    >
      <img
        src={getFullImageUrl(film.thumb_url)}
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

    </div>
  );
};

export default HomePage;
