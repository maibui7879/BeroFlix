import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Cột 1: Logo & Giới thiệu */}
        <div>
          <img src="logo.png" className="h-16"></img>
          <h2 className="text-2xl font-bold">Bero<span className="text-red-500">Flix</span></h2>
          <p className="mt-2 text-sm">Đô nết tại <span className="text-red-500">VietinBank - 0329556941</span> để assmin có tiền roll Castorice E6S5</p>
        </div>

        {/* Cột 2: Hỗ trợ */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Bạn cần <span className="text-red-500">hỗ trợ ?</span></h3>
          <p className="text-xl font-bold text-red-500">0329556941</p>
          <p className="text-sm mt-1"><span className="text-red-500 font-bold">Địa chỉ:</span> Lorem ipsum odor?!</p>
          <p className="text-sm"><span className="text-red-500 font-bold">Email:</span> maibui7879@gmail.com</p>
          <div className="flex space-x-3 mt-3">
          <div className="hover:text-red-500"><a href="https://www.facebook.com/VanciadelaProvenceXVIII/?locale=vi_VN"><FaFacebook size={20} /></a></div>
          <div className="hover:text-red-500"><FaTwitter size={20} /></div>
          <div className="hover:text-red-500"><FaInstagram size={20} /></div>
          <div className="hover:text-red-500"><FaYoutube size={20} /></div>
          </div>
        </div>

        
        <div>
          <h3 className="font-semibold text-lg mb-3">Danh mục <span className="text-red-500">phim</span></h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/new-films" className="hover:text-red-500">Phim mới</a></li>
            <li><a href="/category/hanh-dong" className="hover:text-red-500">Hành Động</a></li>
            <li><a href="/category/tinh-cam" className="hover:text-red-500">Tình Cảm</a></li>
            <li><a href="/category/co-trang" className="hover:text-red-500">Cổ Trang</a></li>
            <li><a href="/region/nhat-ban" className="hover:text-red-500">Anime</a></li>
          </ul>
        </div>

        
        <div>
          <h3 className="font-semibold text-lg mb-3">Hỗ trợ <span className="text-red-500">khách hàng</span></h3>
          <ul className="space-y-2 text-sm">
            <li><a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="hover:text-red-500">Trang chủ</a></li>
            <li><a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="hover:text-red-500">Giới thiệu</a></li>
            <li><a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="hover:text-red-500">Danh mục</a></li>
            <li><a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="hover:text-red-500">Liên hệ</a></li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-6 text-center text-sm text-gray-400">
        © BeroFlix - 2025 All right giggity
      </div>
    </footer>
  );
};

export default Footer;
