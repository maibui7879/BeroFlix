import React from "react";
import { useNavigate } from "react-router-dom";
const FilmList = ({ results }) => {
    const navigate = useNavigate();
  return (
    results.length > 0 && (
      <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
        {results.map((film) => (
          <div
            key={film._id}
            className="md:bg-gray-800 text-white sm:p-2 rounded hover:bg-gray-700 cursor-pointer"
            onClick={() => navigate(`/film/${film.slug}`)}
          >
            <img
              src={`https://phimimg.com/${film.thumb_url}`}
              alt={film.name}
              className="w-full h-32 sm:h-52 md:h-60 object-cover rounded"
              loading="lazy"
            />
            <h3 className="ml-1 text-sm sm:text-base md:text-lg font-semibold mt-1 sm:mt-2">
              {film.name}
            </h3>
            <p className="ml-1 mb-1 text-xs sm:text-sm text-gray-400">{film.year}</p>
          </div>
        ))}
      </div>
    )
    
  );
};

export default FilmList;
