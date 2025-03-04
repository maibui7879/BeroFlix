import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaStar } from 'react-icons/fa';
import { Spin } from 'antd';
import { Helmet } from "react-helmet-async";
const MovieDetail = () => {
  const { slug } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [embedLink, setEmbedLink] = useState(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [parallaxOpacity, setParallaxOpacity] = useState(0.5);
  const [suggestedMovies, setSuggestedMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 });

    const fetchMovie = async () => {
      try {
        const response = await axios.get(`https://phimapi.com/phim/${slug}`);
        if (response.data?.episodes) {
          response.data.movie.episodes = response.data.episodes[0]?.server_data || [];
        }
        setMovie(response.data.movie);
        if (response.data.movie.episodes.length > 0) {
          setEmbedLink(response.data.movie.episodes[0].link_embed);
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSuggestedMovies = async () => {
      try {
        const response = await axios.get('https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=1');
        setSuggestedMovies(response.data.items.slice(0, 5));
      } catch (error) {
        console.error('Error fetching suggested movies:', error);
      }
    };

    fetchMovie();
    fetchSuggestedMovies();
  }, [slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      const opacity = Math.max(0.1, 0.5 - window.scrollY / 400);
      setParallaxOpacity(opacity);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-900">
        <Spin size="large" />
      </div>
    );
  }

  if (!movie) {
    return <div className="text-center text-white">Movie not found.</div>;
  }

  const hasSingleEpisode = movie.episodes.length === 1;
  const descriptionPreview = movie.content.slice(0, 300);
  const starCount = Math.round(movie.tmdb.vote_average / 2);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
            <Helmet>
        <title>BeroFlix - {movie.name}</title>
        <meta name="description" content={`Xem phim ${movie.name} mới nhất, miễn phí trên BeroFlix. `} />
        <meta property="og:title" content={`BeroFlix - Phim ${movie.name}`} />
        <meta property="og:description" content={`Xem phim ${movie.name} miễn phí trên BeroFlix. `} />
        
        <meta property="og:type" content="website" />
      </Helmet>
      <div 
        className="parallax w-full h-3/4 bg-fixed bg-center bg-no-repeat bg-cover flex items-end p-8 relative"
        style={{ backgroundImage: `url(${movie.thumb_url})` }}
      >
        <div className="absolute inset-0 bg-black" style={{ opacity: parallaxOpacity }}></div>
        <div className="relative text-left">
          <h1 className="text-3xl font-bold mb-2">{movie.name}</h1>
          <p className="text-sm mb-1">{movie.year}</p>
          <p className="text-sm mb-1">{movie.category.map(c => c.name).join(', ')}</p>
        </div>
      </div>
      <div className="min-h-screen bg-gray-800 text-white px-6 py-2 w-full mx-auto pt-8">
        <div className="flex flex-col md:flex-row items-start ">
          <img src={movie.poster_url} alt={movie.name} className="w-full h-128 md:w-1/4 rounded-lg shadow-lg mb-4 md:mb-0" />
          <div className="md:ml-6 flex-1">
            <h1 className="text-3xl font-bold mb-6">{movie.name}</h1>
            <p className="text-sm mb-4">
              {isDescriptionExpanded ? movie.content : descriptionPreview}
              {movie.content.length > 300 && (
                <button className="text-blue-400 ml-2" onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}>
                  {isDescriptionExpanded ? 'Thu gọn' : '...xem thêm'}
                </button>
              )}
            </p>
            <p className="text-sm mb-1 text-gray-400"><b>Năm ra mắt: </b>{movie.year}</p>
            <p className="text-sm mb-1 text-gray-400"><b>Thể loại: </b>
            {movie.category.map((c, index) => (
              <span 
                key={index} 
                className="text-gray-400 cursor-pointer hover:font-bold hover:text-red-500"
                onClick={() => navigate(`/category/${c.slug}`)}
              >
                {c.name}{index < movie.category.length - 1 ? ', ' : ''}
              </span>
            ))}
            </p>
            <p className="text-sm mb-1 text-gray-400"><b>Quốc gia: </b>
            {movie.country.map((c, index) => (
              <span 
                key={index} 
                className="text-gray-400 cursor-pointer hover:font-bold hover:text-red-500"
                onClick={() => navigate(`/region/${c.slug}`)}
              >
                {c.name}{index < movie.country.length - 1 ? ', ' : ''}
              </span>
            ))}
            </p>
            <p className="text-sm text-gray-400 mb-2"><b>Thời lượng:</b> {movie.time}</p>
            <p className="text-sm text-gray-400 mb-2"><b>Chất lượng:</b> {movie.quality}</p>
            <p className="text-sm text-gray-400 mb-2"><b>Ngôn ngữ:</b> {movie.lang}</p>
            <p className="text-sm text-gray-400 mb-2"><b>Đạo diễn:</b> {movie.director.join(', ')}</p>
            <p className="text-sm text-gray-400 mb-2"><b>Diễn viên:</b> {movie.actor.join(', ')}</p>
            <p className="text-sm text-gray-400 mb-2 flex items-center">
              <b>Đánh giá:</b>
              {Array.from({ length: 5 }, (_, index) => (
                <FaStar key={index} className={index < starCount ? 'text-yellow-500' : 'text-gray-600'} />
              ))}
            </p>
          </div>
        </div>
        {movie.episodes.length > 1 && (
          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4">Chọn tập:</h2>
            <div className="flex flex-wrap gap-2">
              {movie.episodes.map((episode, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded-lg ${embedLink === episode.link_embed ? "bg-red-500 text-white" : "bg-gray-700 hover:bg-gray-600"}`}
                  onClick={() => setEmbedLink(episode.link_embed)}
                >
                  Tập {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}
        <h2 className="text-2xl font-bold mb-6 ml-4 mt-8">Xem phim ngay:</h2>
        <div className="mt-6 mx-auto md:w-3/4" style={{ aspectRatio: "16 / 9" }}>
          <iframe src={embedLink || (hasSingleEpisode ? movie.episodes[0].link_embed : '')} frameBorder="0" width="100%" height="100%" title="Episode Video" allowFullScreen />
        </div>
        
        <h2 className="text-2xl font-bold mt-8">Gợi ý phim</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
          {suggestedMovies.map((film) => (
            <div 
              key={film._id} 
              className="bg-gray-900 text-white p-2 rounded hover:bg-gray-700 cursor-pointer"
              onClick={() => navigate('/film/${film.slug}')}
            >
              <img src={film.thumb_url} alt={film.name} className="w-full h-60 object-cover rounded" />
              <h2 className="text-lg font-semibold mt-2">{film.name}</h2>
              <p className="text-sm text-gray-400">{film.year}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
