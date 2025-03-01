import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaClock, FaTv, FaBars, FaArrowLeft, FaSearch } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Category from "./Category";
import Region from "./Region";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearch = () => {
    if (searchKeyword.trim()) {
      navigate(`/sortfilm?keyword=${encodeURIComponent(searchKeyword)}`);
    }
  };

  const navLinks = [
    { path: "/", label: "Home", icon: <FaHome className="mr-2" /> },
    { path: "/new-films", label: "Phim mới", icon: <FaClock className="mr-2" /> },
    { path: "/sortfilm", label: "Tìm kiếm", icon: <FaTv className="mr-2" /> },
  ];

  const getLinkClass = (path) =>
    location.pathname === path ? "font-bold text-red-700" : "hover:text-red-700 hover:font-bold";

  return (
    <>
      <header className="bg-gray-800 text-white fixed z-10 w-full shadow-lg">
        <div className="container mx-auto flex justify-between items-center py-3 px-4">
          <h1 className="text-2xl font-bold flex items-center">

            <button onClick={toggleSidebar}>Bero<span className="text-red-500">Flix</span></button>
          </h1>

          <nav className="hidden md:flex items-center space-x-8 flex-nowrap">
            {navLinks.map(({ path, label, icon }) => (
              <Link key={path} to={path} className={`flex items-center px-3 py-2 whitespace-nowrap ${getLinkClass(path)}`}>
                {icon}
                {label}
              </Link>
            ))}
            <Category isOpen={openDropdown === "category"} setOpenDropdown={setOpenDropdown} />
            <Region isOpen={openDropdown === "region"} setOpenDropdown={setOpenDropdown} />
            <div className="relative">
              <input
                type="text"
                className="bg-gray-800 text-white px-2 py-1 pr-10 rounded-lg outline-none border-2 border-red-700"
                placeholder="Tìm kiếm phim..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-white" onClick={handleSearch}>
                <FaSearch />
              </button>
            </div>
          </nav>

          <button className="md:hidden flex items-center text-white text-2xl" onClick={toggleSidebar}>
            <FaBars />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
            />
            <motion.div
              className="fixed left-0 top-0 bg-gray-800 text-white h-full w-64 shadow-lg z-30 flex flex-col"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="flex justify-between items-center px-4 py-4 border-b border-gray-700">
                <h2 className="text-xl ml-4 font-semibold">Bero<span className="text-red-500 font-bold">Flix</span></h2>
                <button onClick={toggleSidebar} className="text-white text-2xl hover:text-red-500">
                  <FaArrowLeft />
                </button>
              </div>
              <div className="overflow-y-auto max-h-full py-2 custom-scrollbar">
                <nav className="flex flex-col mt-4 space-y-2 px-4">
                  <div className="relative">
                    <input
                      type="text"
                      className="bg-gray-800 text-white px-2 py-1 pr-10 w-full rounded-lg border border-red-500"
                      placeholder="Tìm kiếm phim..."
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-white" onClick={handleSearch}>
                      <FaSearch />
                    </button>
                  </div>
                  {navLinks.map(({ path, label, icon }) => (
                    <Link key={path} to={path} className={`flex items-center px-4 py-2 whitespace-nowrap ${getLinkClass(path)}`} onClick={toggleSidebar}>
                      {icon}
                      {label}
                    </Link>
                  ))}
                  <Category isOpen={openDropdown === "category"} setOpenDropdown={setOpenDropdown} isSidebar={true} />
                  <Region isOpen={openDropdown === "region"} setOpenDropdown={setOpenDropdown} isSidebar={true} />
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
