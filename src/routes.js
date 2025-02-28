import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import NewFilm from "./components/NewFilm";
import MovieDetail from "./components/FilmDetail";
import Category from "./components/Category";
import CategoryFilm from "./components/CategoryFilm";
import RegionFilm from "./components/RegionFilm";
import SortFilm from "./components/SortFilm";
import HomePage from "./components/HomePage";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/new-films" element={<Layout><NewFilm /></Layout>} />
        <Route path="/film/:slug" element={<Layout><MovieDetail /></Layout>} />
        <Route path="/category" element={<Layout><Category /></Layout>} />
        <Route path="/category/:type_list" element={<Layout><CategoryFilm /></Layout>} />
        <Route path="/region/:type_list" element={<Layout><RegionFilm /></Layout>} />
        <Route path="/sortfilm" element={<Layout><SortFilm /></Layout>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
