import { Link, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaChevronDown, FaGlobe } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Region = ({ isSidebar, closeSidebar }) => {
  const [regions, setRegions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await axios.get("https://phimapi.com/quoc-gia");
        setRegions(response.data);
      } catch (error) {
        console.error("Error fetching regions:", error);
      }
    };

    fetchRegions();
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        className={`flex items-center px-4 py-2 ${
          isOpen ? "text-red-500 font-bold" : "hover:text-red-400 hover:font-bold"
        } focus:outline-none w-full`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaGlobe className="mr-2" />
        <span className="whitespace-nowrap mr-2">Quốc gia</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <FaChevronDown />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`bg-gray-900 text-white mt-2 p-2 rounded shadow-lg z-50 overflow-y-auto custom-scrollbar ${
              isSidebar
                ? "w-full max-h-60 flex flex-col"
                : "absolute right-0 min-w-max grid grid-cols-4 gap-2"
            }`}
          >
            {regions.map((region) => (
              <Link
                key={region._id}
                to={`/region/${region.slug}`}
                className={`px-4 py-2 flex items-center w-full ${
                  location.pathname === `/region/${region.slug}`
                    ? "text-red-500 "
                    : "hover:text-red-500 hover:bg-gray-700 hover:font-bold"
                }`}
                onClick={() => {
                  setIsOpen(false);
                  if (isSidebar) closeSidebar();
                }}
              >
                {region.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Region;
