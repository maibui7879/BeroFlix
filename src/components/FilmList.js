import React from "react";
import { useNavigate } from "react-router-dom";
const FilmList = ({ results }) => {
    const navigate = useNavigate();
  return (
    results.length > 0 && (
      <div className="mt-6 grid grid-cols-5 gap-4">
        {results.map((film) => (
          <div key={film._id} className="bg-gray-800 p-4 rounded-lg" onClick={() => navigate(`/film/${film.slug}`)}>
            <img
              src={`https://phimimg.com/${film.thumb_url}`}
              alt={film.name}
              className="w-full h-64 object-cover rounded"
              loading="lazy"
            />
            <h3 className="text-lg font-bold">{film.name}</h3>
            <p className="text-sm text-gray-400">{film.year}</p>
          </div>
        ))}
      </div>
    )
  );
};

export default FilmList;
