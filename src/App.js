import React, { useState, useEffect, useMemo, useRef, memo, useCallback } from 'react';
import { ArrowDown, Search, Heart, ShoppingCart, Menu, X, ChevronDown, Plus, Minus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Routes, Route, useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';
import SizeChatBot from './SizeChatBot';
import Select from 'react-select';
import ErrorBoundary from './components/ErrorBoundary';
import OptimizedImage from './components/OptimizedImage';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useDebounce } from './hooks/useDebounce';
// import { ProductCardSkeleton } from './components/LoadingSpinner';


// --- Dữ liệu giả lập (Mock Data) ---
const products = [
  {
    id: 1,
    name: "ASH CLOUD TEE",
    price: "2500000",
    imageUrl: "https://cdn.hstatic.net/products/1000306633/_dsf0625_b15cc444a3df492db7e4d1024f38a0b9.jpg",
    imageUrlBack: "https://cdn.hstatic.net/products/1000306633/_dsf0641_0980cee6ad6c49538a1fa358abec8f29.jpg",
    date: '2025-07-10',
    tags: [{ text: 'New Arrival', color: 'bg-black' }],
    variants: [
        { colorName: 'Đen', colorHex: '#000000', size: 'S', inStock: true },
        { colorName: 'Đen', colorHex: '#000000', size: 'M', inStock: false },
        { colorName: 'Đen', colorHex: '#000000', size: 'L', inStock: true },
        { colorName: 'Trắng', colorHex: '#FFFFFF', size: 'S', inStock: true },
        { colorName: 'Trắng', colorHex: '#FFFFFF', size: 'M', inStock: true },
    ]
  },
  {
    id: 2,
    name: "FADE OUT WOVEN SHIRT",
    price: "2300000",
    imageUrl: "https://cdn.hstatic.net/products/1000306633/v_q00068_eb92df24aff647ad8da5c781450dabb7.jpg",
    imageUrlBack: "https://cdn.hstatic.net/products/1000306633/v_q00082_68cffa63a094472da0663028161b45e1.jpg",
    date: '2025-07-09',
    tags: [{ text: 'New Arrival', color: 'bg-black' }, { text: 'Best Seller', color: 'bg-red-600' }],
    variants: [
        { colorName: 'Xám', colorHex: '#808080', size: 'M', inStock: true },
        { colorName: 'Xám', colorHex: '#808080', size: 'L', inStock: false },
        { colorName: 'Xám', colorHex: '#808080', size: 'XL', inStock: true },
    ]
  },
  {
    id: 3,
    name: "HEAVEN'S CALL HOODIE ZIP",
    price: "4800000",
    imageUrl: "https://cdn.hstatic.net/products/1000306633/_dsf0923_a8c8dadacc63469b8add85972415a052.jpg",
    imageUrlBack: "https://cdn.hstatic.net/products/1000306633/_dsf0943_99e992b7d7ee430a8271f613ba648bb4.jpg",
    date: '2025-06-20',
    tags: [{ text: 'Hết hàng', color: 'bg-gray-500' }],
    variants: [
        { colorName: 'Đen', colorHex: '#000000', size: 'S', inStock: false },
        { colorName: 'Đen', colorHex: '#000000', size: 'M', inStock: false },
        { colorName: 'Đen', colorHex: '#000000', size: 'L', inStock: false },
    ]
  },
  {
    id: 4,
    name: "REFINEMENT FLANNEL SHIRT",
    price: "1235000",
    originalPrice: "1900000",
    imageUrl: "https://cdn.hstatic.net/products/1000306633/080425.hd5735_c6dea31826274ac9ba85751b2b4f313b.jpg",
    imageUrlBack: "https://cdn.hstatic.net/products/1000306633/080425.hd5752_3987df81927f48afa3bf69730952b49b.jpg",
    date: '2025-05-15',
    tags: [{ text: 'Sale', color: 'bg-red-600' }],
     variants: [
        { colorName: 'Xanh', colorHex: '#3B82F6', size: 'S', inStock: true },
        { colorName: 'Xanh', colorHex: '#3B82F6', size: 'M', inStock: true },
    ]
  },
  {
    id: 5,
    name: "ASTRAL DENIM JACKET",
    price: "3200000",
    imageUrl: "https://cdn.hstatic.net/products/1000306633/_dsf0818_9a539921420d4f288fc58fd1fc3e2bab.jpg",
    imageUrlBack: "https://cdn.hstatic.net/products/1000306633/_dsf0816_9cd0c216eb4c40e3802e2be8c542fb6d.jpg",
    date: '2025-07-15',
    tags: [{ text: 'New Arrival', color: 'bg-black' }],
    variants: [
        { colorName: 'Xanh', colorHex: '#3B82F6', size: 'S', inStock: true },
        { colorName: 'Xanh', colorHex: '#3B82F6', size: 'M', inStock: true },
        { colorName: 'Xanh', colorHex: '#3B82F6', size: 'L', inStock: true },
        { colorName: 'Xanh', colorHex: '#3B82F6', size: 'XL', inStock: false },
    ]
  },
  {
    id: 6,
    name: "DARK MATTER DENIM PANTS",
    price: "2800000",
    imageUrl: "https://product.hstatic.net/1000306633/product/untitled_session0288_e19243cabc424e92bd033e3cdac78636.jpg",
    imageUrlBack: "https://product.hstatic.net/1000306633/product/untitled_session0294_f3f10116e1ad478383d63fc4acec43ec.jpg",
    date: '2025-07-14',
    tags: [{ text: 'New Arrival', color: 'bg-black' }, { text: 'Best Seller', color: 'bg-red-600' }],
    variants: [
        { colorName: 'Đen', colorHex: '#000000', size: 'S', inStock: true },
        { colorName: 'Đen', colorHex: '#000000', size: 'M', inStock: true },
        { colorName: 'Đen', colorHex: '#000000', size: 'L', inStock: true },
        { colorName: 'Đen', colorHex: '#000000', size: 'XL', inStock: true },
    ]
  },
  {
    id: 7,
    name: "RANGER KHAKI CAMO PANTS",
    price: "2600000",
    imageUrl: "https://product.hstatic.net/1000306633/product/pandemos0035_1_ca386ec176374735ba6f8d8102bc49b7.jpg",
    imageUrlBack: "https://product.hstatic.net/1000306633/product/pandemos0036_1_f8a64edf2f204969beba529c38a13dc5.jpg",
    date: '2025-07-13',
    tags: [{ text: 'New Arrival', color: 'bg-black' }],
    variants: [
        { colorName: 'Camo', colorHex: '#4A5D23', size: 'S', inStock: true },
        { colorName: 'Camo', colorHex: '#4A5D23', size: 'M', inStock: false },
        { colorName: 'Camo', colorHex: '#4A5D23', size: 'L', inStock: true },
        { colorName: 'Camo', colorHex: '#4A5D23', size: 'XL', inStock: true },
    ]
  },
  {
    id: 8,
    name: "BLACK BLOCK BACKPACK",
    price: "1890000",
    imageUrl: "https://cdn.hstatic.net/products/1000306633/black_block__5ef61fb817fa4ae294f757ed28662eaf.jpg",
    imageUrlBack: "https://cdn.hstatic.net/products/1000306633/black_block_1_924433fb951f4962a8e24f52b13b2196.jpg",
    date: '2025-07-12',
    tags: [{ text: 'New Arrival', color: 'bg-black' }],
    variants: [
        { colorName: 'Đen', colorHex: '#000000', size: 'FREESIZE', inStock: true },
    ]
  },
  {
    id: 9,
    name: "TATTOO FLASH LONGSLEEVE",
    price: "2200000",
    imageUrl: "https://product.hstatic.net/1000306633/product/untitled_capture0480_496ad2df85ac47a2b6f8c35e5132e2bb.jpg",
    imageUrlBack: "https://product.hstatic.net/1000306633/product/untitled_capture0493_e58fd49910ef46319fbe2700640ebbdd.jpg",
    date: '2025-07-11',
    tags: [{ text: 'New Arrival', color: 'bg-black' }],
    variants: [
        { colorName: 'Trắng', colorHex: '#FFFFFF', size: 'S', inStock: true },
        { colorName: 'Trắng', colorHex: '#FFFFFF', size: 'M', inStock: true },
        { colorName: 'Trắng', colorHex: '#FFFFFF', size: 'L', inStock: false },
        { colorName: 'Trắng', colorHex: '#FFFFFF', size: 'XL', inStock: true },
    ]
  },
  {
    id: 10,
    name: "CAMO LONGSLEEVE JERSEY",
    price: "2100000",
    imageUrl: "https://product.hstatic.net/1000306633/product/untitled_capture0545_a475c7927af146009f6c6b4e2dc5eacf.jpg",
    imageUrlBack: "https://product.hstatic.net/1000306633/product/untitled_capture0554_39375491b5304614b218128599aa796d.jpg",
    date: '2025-07-10',
    tags: [{ text: 'New Arrival', color: 'bg-black' }],
    variants: [
        { colorName: 'Camo', colorHex: '#4A5D23', size: 'S', inStock: true },
        { colorName: 'Camo', colorHex: '#4A5D23', size: 'M', inStock: true },
        { colorName: 'Camo', colorHex: '#4A5D23', size: 'L', inStock: true },
        { colorName: 'Camo', colorHex: '#4A5D23', size: 'XL', inStock: false },
    ]
  },
  {
    id: 11,
    name: "LASSO CHAMPION TEE",
    price: "1750000",
    originalPrice: "2200000",
    imageUrl: "https://product.hstatic.net/1000306633/product/dsc04838_7ae162cf7ce943c8a2fd734377c2ee68.jpg",
    imageUrlBack: "https://product.hstatic.net/1000306633/product/dsc04844_127a35d08ed14e52bbc96a94c156d104.jpg",
    date: '2025-07-09',
    tags: [{ text: 'Sale', color: 'bg-red-600' }],
    variants: [
        { colorName: 'Trắng', colorHex: '#FFFFFF', size: 'S', inStock: true },
        { colorName: 'Trắng', colorHex: '#FFFFFF', size: 'M', inStock: true },
        { colorName: 'Trắng', colorHex: '#FFFFFF', size: 'L', inStock: true },
        { colorName: 'Trắng', colorHex: '#FFFFFF', size: 'XL', inStock: true },
    ]
  },
  {
    id: 12,
    name: "777 JERSEY MESH",
    price: "1950000",
    imageUrl: "https://product.hstatic.net/1000306633/product/dsc09179_dfadf76009324a92a77ce6e572699553.jpg",
    imageUrlBack: "https://product.hstatic.net/1000306633/product/dsc09189_c4e1e34ba757446297ca19e1d3b9ddb2.jpg",
    date: '2025-07-08',
    tags: [{ text: 'Hết hàng', color: 'bg-gray-500' }],
    variants: [
        { colorName: 'Đen', colorHex: '#000000', size: 'S', inStock: false },
        { colorName: 'Đen', colorHex: '#000000', size: 'M', inStock: false },
        { colorName: 'Đen', colorHex: '#000000', size: 'L', inStock: false },
        { colorName: 'Đen', colorHex: '#000000', size: 'XL', inStock: false },
    ]
  },
];

const menuData = [
  {
    title: "NEW COLLECTION",
    subItems: []
  },
  {
    title: "TOPS",
    subItems: ["Áo thun & Polo", "Sơ mi", "Áo len", "Hoodie & Sweatshirt", "Áo khoác"]
  },
  {
    title: "BOTTOMS",
    subItems: ["Quần Jeans", "Quần dài", "Quần short", "Chân váy"]
  },
  {
    title: "ACCESSORIES",
    subItems: ["Nón", "Thắt lưng", "Vớ", "Trang sức", "Khăn choàng"]
  },
  {
    title: "SALE",
    subItems: []
  },
  {
      title: "ABOUT US",
      subItems: []
  }
];

const filterOptions = {
    colors: [
        { name: 'Trắng', hex: '#FFFFFF' }, { name: 'Xanh lá', hex: '#16A34A' }, { name: 'Đỏ', hex: '#DC2626' },
        { name: 'Đen', hex: '#111827' }, { name: 'Xám', hex: '#6B7280' }, { name: 'Vàng', hex: '#FBBF24' },
        { name: 'Nâu', hex: '#78350F' }, { name: 'Xanh', hex: '#3B82F6' }, { name: 'Camo', hex: '#4A5D23' },
    ],
    sizes: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'FREESIZE'],
};


// --- Thành phần (Components) ---

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

// Sửa ProductCard để click vào ảnh sẽ chuyển route
const ProductCard = memo(({ product, onAddToWishlist, wishlist, onAddToCart, onQuickViewOpen }) => {
    const isCompletelyOutOfStock = useMemo(() => {
        return product.variants.every(v => !v.inStock);
    }, [product.variants]);

    // Image preloading for better performance - NO UI CHANGES
    useEffect(() => {
        // Use requestIdleCallback for non-critical image preloading
        const preloadImages = () => {
            if (product.imageUrl) {
                const img = new Image();
                img.src = product.imageUrl;
            }
            if (product.imageUrlBack) {
                const imgBack = new Image();
                imgBack.src = product.imageUrlBack;
            }
        };

        if (window.requestIdleCallback) {
            window.requestIdleCallback(preloadImages);
        } else {
            // Fallback for browsers without requestIdleCallback
            setTimeout(preloadImages, 100);
        }
    }, [product.imageUrl, product.imageUrlBack]);
    
    const isInWishlist = useMemo(() => wishlist.includes(product.id), [wishlist, product.id]);

    const saleInfo = useMemo(() => {
        const isSale = product.originalPrice && product.price;
        let salePercentage = 0;
        if (isSale && product.originalPrice > 0) {
            salePercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
        }
        return { isSale, salePercentage };
    }, [product.originalPrice, product.price]);

    const firstAvailableVariant = useMemo(() => 
        product.variants.find(v => v.inStock), 
        [product.variants]
    );

    const handleAddToCartClick = useCallback((e) => {
        e.stopPropagation();
        if (firstAvailableVariant) {
            onAddToCart(product, firstAvailableVariant);
        }
    }, [firstAvailableVariant, onAddToCart, product]);

    const handleWishlistClick = useCallback((e) => {
        e.stopPropagation();
        onAddToWishlist(product.id);
    }, [onAddToWishlist, product.id]);

    // Thêm navigate
    const navigate = useNavigate();
    const handleCardClick = useCallback(() => {
      navigate(`/product/${product.id}`);
    }, [navigate, product.id]);

    return (
        <div className="group text-left cursor-pointer" onClick={handleCardClick} role="button" tabIndex="0" aria-label={`Xem chi tiết sản phẩm ${product.name}`} onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}>
          <div className="relative rounded-lg mb-2 sm:mb-4 overflow-hidden aspect-[3/4] bg-white">
            {isCompletelyOutOfStock && (
                <button onClick={handleWishlistClick} className="absolute top-3 right-3 z-10 p-1.5 bg-white/60 backdrop-blur-sm rounded-sm transition-all hover:scale-110">
                    <Heart className={`w-5 h-5 transition-all ${isInWishlist ? 'text-red-500 fill-current' : 'text-black'}`} />
                </button>
            )}
            {product.tags && product.tags.length > 0 && (
                <div className="absolute top-3 left-3 z-10 flex flex-row flex-wrap items-start gap-1.5">
                    {product.tags.map((tag, index) => (
                        <div key={index} className={`${tag.color} text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-sm`}>
                            {tag.text}
                        </div>
                    ))}
                </div>
            )}
            <OptimizedImage 
              src={product.imageUrl} 
              alt={product.name} 
              className="h-full w-full object-contain transition-opacity duration-500 ease-in-out group-hover:opacity-0"
              lazy={true}
            />
            <img 
              src={product.imageUrlBack} 
              alt={`${product.name} (mặt sau)`} 
              className="absolute inset-0 h-full w-full object-contain opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"
              loading="eager"
            />
            <div className="absolute bottom-4 left-0 right-0 px-4 flex flex-col sm:flex-row items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <button onClick={e => { e.stopPropagation(); onQuickViewOpen(product); }} className="w-full sm:w-32 bg-black text-white text-xs font-bold py-2.5 min-h-[44px] rounded-sm text-center">XEM NHANH</button>
                <button onClick={e => { e.stopPropagation(); onQuickViewOpen(product); }} disabled={isCompletelyOutOfStock} className="w-full sm:flex-grow sm:w-32 bg-black text-white text-xs font-bold py-2.5 min-h-[44px] rounded-sm text-center hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">MUA NGAY</button>
                <button onClick={handleAddToCartClick} disabled={isCompletelyOutOfStock} className="w-full sm:w-12 bg-black text-white text-xs font-bold py-2.5 min-h-[44px] rounded-sm flex items-center justify-center hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
                    <ShoppingCart size={16} />
                </button>
            </div>
          </div>
          
          <div className="px-1.5 sm:px-3">
              <h3 className="text-xs sm:text-base font-bold text-gray-800 truncate w-full uppercase" title={product.name}>
                  {product.name}
              </h3>
              {saleInfo.isSale ? (
                <div className="flex items-center gap-1.5 mt-1.5">
                    <p className="text-xs sm:text-base text-red-600 font-bold">{formatPrice(product.price)}</p>
                    <p className="text-[10px] sm:text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</p>
                    <p className="text-[10px] sm:text-sm text-red-600">(-{saleInfo.salePercentage}%)</p>
                </div>
              ) : (
                <p className="text-xs sm:text-base text-gray-600 mt-1.5 font-medium">{formatPrice(product.price)}</p>
              )}
          </div>
        </div>
    );
});

const MobileMenu = ({ isOpen, onClose, onNavigate }) => {
    const [openSubMenu, setOpenSubMenu] = useState(null);
    if (!isOpen) return null;
    const toggleSubMenu = (title) => setOpenSubMenu(openSubMenu === title ? null : title);

    const handleNavClick = (e, item) => {
        e.preventDefault();
        if (item.subItems.length === 0) {
            onClose();
            const page = item.title === 'NEW COLLECTION' ? 'home' : item.title.toLowerCase().replace(' ', '-');
            onNavigate(page);
        } else {
            toggleSubMenu(item.title);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] lg:hidden" onClick={onClose}>
            <div className="absolute top-0 left-0 h-full w-4/5 max-w-sm bg-white shadow-xl animate-slide-in" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b"><h2 className="text-2xl font-bold">MENU</h2><button onClick={onClose}><X size={24} /></button></div>
                <nav className="p-4">
                    <ul>
                        {menuData.map(item => (
                            <li key={item.title} className="border-b">
                                <div className="flex justify-between items-center py-3" onClick={(e) => handleNavClick(e, item)}>
                                    <button className="text-xl font-bold text-left">{item.title}</button>
                                    {item.subItems.length > 0 && <ChevronDown size={20} className={`transition-transform ${openSubMenu === item.title ? 'rotate-180' : ''}`} />}
                                </div>
                                                                  {item.subItems.length > 0 && <div className={`overflow-hidden transition-all duration-300 ${openSubMenu === item.title ? 'max-h-screen' : 'max-h-0'}`}><ul className="pl-4 py-2">{item.subItems.map(subItem => <li key={subItem} className="py-1.5"><button className="text-gray-600 text-sm text-left">{subItem}</button></li>)}</ul></div>}
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
};

const Header = ({ onMobileMenuOpen, setIsMegaMenuOpen, onSearchOpen, onWishlistOpen, onCartOpen, onNavigate, wishlistCount, cartItemCount, forceSolid, currentPage }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const activeItemData = menuData.find(item => item.title === activeMenu);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const showSolidHeader = activeMenu || isScrolled || forceSolid;

    // Smart contrast detection for transparent header
    const getContrastTextColor = () => {
        if (showSolidHeader) return 'text-black';
        
        // For transparent header, detect page background
        const isOnLightBackground = currentPage === 'cart' || currentPage === 'checkout' || currentPage === 'wishlist' ||
                                   location.pathname === '/checkout' || 
                                   (location.pathname === '/' && currentPage === 'cart');
        
        // Use dark text on light backgrounds, white text on dark backgrounds  
        return isOnLightBackground ? 'text-black' : 'text-white';
    };

    const textColorClass = getContrastTextColor();
    
    const handleMouseEnterMenu = (menuTitle) => { setIsMegaMenuOpen(true); setActiveMenu(menuTitle); };
    const handleMouseLeaveHeader = () => { setIsMegaMenuOpen(false); setActiveMenu(null); };
    
    const handleNavClick = (e, item) => {
        const page = item.title === 'NEW COLLECTION' ? 'home' : item.title.toLowerCase().replace(' ', '-');
        if (page === 'home' || page === 'about-us') {
            e.preventDefault();
            onNavigate(page);
        }
    };

    return (
        <header onMouseLeave={handleMouseLeaveHeader} className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${showSolidHeader ? 'bg-white shadow-md' : 'bg-transparent'}`} style={{minHeight:56}}>
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="relative flex justify-between items-center h-14">
                    <div className="flex-1 flex justify-start">
                        <button onClick={onMobileMenuOpen} className="lg:hidden p-2 -m-2 touch-manipulation" aria-label="Mở menu điều hướng" aria-expanded="false"><Menu className={`transition-colors duration-300 ${textColorClass}`} /></button>
                        <Link to="/" className={`hidden lg:block text-4xl font-bold transition-colors duration-300 ${textColorClass} focus:outline-none`}>MEVY</Link>
                    </div>
                    <nav className="hidden lg:flex items-center justify-center gap-10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" role="navigation" aria-label="Menu chính">
                        {menuData.map(item => <div key={item.title} onMouseEnter={() => handleMouseEnterMenu(item.title)} className="h-14 flex items-center"><a href="#" onClick={(e) => handleNavClick(e, item)} className={`text-base font-bold whitespace-nowrap transition-colors duration-300 ${textColorClass} focus:outline-none px-2 py-1`} role="menuitem">{item.title}</a></div>)}
                    </nav>
                    <div className="lg:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"><Link to="/" className={`text-3xl font-bold transition-colors duration-300 ${textColorClass} focus:outline-none`}>MEVY</Link></div>
                    <div className="flex-1 flex justify-end items-center gap-4">
                        <button onClick={onSearchOpen} aria-label="Mở tìm kiếm" className="p-2 rounded focus:outline-none touch-manipulation"><Search className={`transition-colors duration-300 ${textColorClass}`} /></button>
                        <button onClick={onWishlistOpen} className="relative hidden sm:block p-2 rounded focus:outline-none touch-manipulation" aria-label={`Danh sách yêu thích${wishlistCount > 0 ? ` (${wishlistCount} sản phẩm)` : ''}`}>
                            <Heart className={`transition-colors duration-300 ${textColorClass}`} />
                             {wishlistCount > 0 && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white" aria-hidden="true">{wishlistCount}</span>}
                        </button>
                        <button onClick={onCartOpen} className="relative p-2 rounded focus:outline-none touch-manipulation" aria-label={`Giỏ hàng${cartItemCount > 0 ? ` (${cartItemCount} sản phẩm)` : ''}`}>
                                                       <ShoppingCart className={`transition-colors duration-300 ${textColorClass}`} />
                           {cartItemCount > 0 && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white" aria-hidden="true">{cartItemCount}</span>}
                        </button>
                    </div>
                </div>
            </div>
            <div className={`hidden lg:block absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-xl transition-all duration-300 overflow-hidden ${activeMenu && activeMenu !== 'ABOUT US' && activeMenu !== 'NEW COLLECTION' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="max-w-screen-2xl mx-auto px-6 py-8">
                    {activeItemData && activeItemData.subItems.length > 0 && <div className="grid grid-cols-5 gap-8"><div className="col-span-1"><h3 className="text-2xl font-bold text-black">{activeItemData.title}</h3></div><div className="col-span-4"><ul className="columns-2 md:columns-3 gap-8">{activeItemData.subItems.map(subItem => <li key={subItem} className="mb-2"><a href="#" className="text-gray-600 hover:text-black hover:underline">{subItem}</a></li>)}</ul></div></div>}
                </div>
            </div>
        </header>
    );
};

const SearchOverlay = memo(({ isOpen, onClose, searchQuery, setSearchQuery, searchResults, isSearchActive, onQuickViewOpen, onAddToWishlist, wishlist, onAddToCart, handleClearSearch }) => {
    const inputRef = useRef(null);
    const [localQuery, setLocalQuery] = useState(searchQuery);
    
    // Debounced search for better performance
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setSearchQuery(localQuery);
        }, 300);
        
        return () => clearTimeout(timeoutId);
    }, [localQuery, setSearchQuery]);
    
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
            setLocalQuery(searchQuery);
        }
    }, [isOpen, searchQuery]);
    
    const handleInputChange = useCallback((e) => {
        setLocalQuery(e.target.value);
    }, []);
    
    const handleClearLocal = useCallback(() => {
        setLocalQuery('');
        handleClearSearch();
    }, [handleClearSearch]);
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] bg-white text-black flex flex-col animate-fade-in" style={{fontFamily: 'Roboto Condensed, sans-serif'}}>
            <button onClick={onClose} className="absolute top-8 right-10 text-gray-500 hover:text-black text-3xl font-bold z-20 transition-colors">×</button>
            <div className="flex flex-col items-center justify-start w-full h-full pt-24 px-2 sm:px-0">
                <div className="flex items-center w-full max-w-3xl mx-auto mb-12 px-4">
                    <span className="text-2xl sm:text-3xl font-extrabold tracking-widest mr-6 uppercase" style={{letterSpacing:'0.12em'}}>Search</span>
                    <div className="relative flex-1 flex items-center">
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            className="w-full bg-white border border-gray-300 rounded-full text-black text-lg sm:text-xl px-8 py-3 pr-12 focus:outline-none focus:border-black placeholder-gray-400 tracking-widest font-mono shadow-sm transition-all"
                            value={localQuery}
                            onChange={handleInputChange}
                            style={{minWidth:180, fontFamily: 'Roboto Condensed, monospace'}}
                        />
                        {localQuery && (
                            <button onClick={handleClearLocal} className="absolute right-14 text-gray-400 hover:text-black text-base font-mono tracking-widest transition-colors">CLEAR</button>
                        )}
                        {/* Nút tìm kiếm (icon kính lúp) nằm trong input */}
                        <button
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white hover:bg-gray-100 border border-gray-300 flex items-center justify-center"
                            tabIndex={-1}
                            aria-label="Tìm kiếm"
                            type="button"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <circle cx="11" cy="11" r="7" strokeWidth="2"/>
                                <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="w-full flex-1 flex flex-col items-center justify-start">
                    {isSearchActive ? (
                        <div className="w-full px-1 sm:px-6">
                            {searchResults.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-6">
                                    {searchResults.map((product, idx) => (
                                        <div key={product.id} className="flex flex-col h-[470px] bg-white relative border border-black" style={{minWidth:0}}>
                                            <ProductCardSearch
                                                product={product}
                                                onAddToCart={onAddToCart}
                                                onQuickViewOpen={onQuickViewOpen}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 text-gray-400 text-lg tracking-widest">Không tìm thấy sản phẩm phù hợp.</div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-gray-400 text-lg tracking-widest">Nhập từ khóa để tìm kiếm sản phẩm...</div>
                    )}
                </div>
            </div>
        </div>
    );
});

const WishlistPage = ({ wishlist, products, onRemoveFromWishlist, onBack }) => {
    const wishlistedProducts = products.filter(p => wishlist.includes(p.id));
    return (
        <div className="fixed inset-0 bg-white z-[70] animate-fade-in pt-14">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center border-b">
                <h1 className="text-2xl font-bold">Danh sách yêu thích</h1>
                <button onClick={onBack} className="font-semibold hover:underline">Quay lại</button>
            </div>
            <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto h-full">
                {wishlistedProducts.length > 0 ? (
                    <div className="space-y-6">
                        {wishlistedProducts.map(product => (
                            <div key={product.id} className="flex items-center gap-4 border-b pb-4">
                                <img src={product.imageUrl} alt={product.name} className="w-24 h-24 object-contain rounded-md" />
                                <div className="flex-grow">
                                    <h2 className="font-bold">{product.name}</h2>
                                    <p className="text-sm text-gray-500">Sản phẩm này hiện đang hết hàng.</p>
                                </div>
                                <button onClick={() => onRemoveFromWishlist(product.id)} className="text-red-500 hover:text-red-700"><X size={20}/></button>
                            </div>
                        ))}
                        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                            <h3 className="font-bold text-lg mb-2">Nhận thông báo khi có hàng</h3>
                            <p className="text-sm text-gray-600 mb-4">Nhập email của bạn để chúng tôi gửi thông báo ngay khi sản phẩm này được bán trở lại.</p>
                            <div className="flex gap-2">
                                <input type="email" placeholder="Nhập email của bạn..." className="flex-grow border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black" />
                                <button className="bg-black text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-800">Gửi</button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>Danh sách yêu thích của bạn đang trống.</p>
                )}
            </div>
        </div>
    );
};

const FilterPanel = ({ isOpen, onClose, selectedColors, setSelectedColors, selectedSizes, setSelectedSizes }) => {
    if(!isOpen) return null;
    const toggleColor = (colorName) => setSelectedColors(p => p.includes(colorName) ? p.filter(c => c !== colorName) : [...p, colorName]);
    const toggleSize = (sizeName) => setSelectedSizes(p => p.includes(sizeName) ? p.filter(s => s !== sizeName) : [...p, sizeName]);
    const clearFilters = () => { setSelectedColors([]); setSelectedSizes([]); };

    return (
        <div className="bg-white border-b border-gray-200 animate-fade-in-down">
            <div className="px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div><h3 className="font-semibold mb-4">MÀU SẮC</h3><div className="flex flex-wrap gap-3">{filterOptions.colors.map(c => <button key={c.name} onClick={() => toggleColor(c.name)} className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColors.includes(c.name) ? 'border-black scale-110' : 'border-gray-200'}`} style={{backgroundColor: c.hex}} />)}</div></div>
                    <div><h3 className="font-semibold mb-4">KÍCH THƯỚC</h3><div className="flex flex-wrap gap-3">{filterOptions.sizes.map(s => <button key={s} onClick={() => toggleSize(s)} className={`px-4 py-2 border rounded-md transition-colors ${selectedSizes.includes(s) ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}>{s}</button>)}</div></div>
                </div>
                <div className="flex justify-between items-center mt-6">
                    <button onClick={clearFilters} className="text-sm font-semibold text-gray-600 hover:text-black underline">Xóa bộ lọc</button>
                    <button onClick={onClose} className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800">Đóng</button>
                </div>
            </div>
        </div>
    );
};

const CartSidebar = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveFromCart, setCurrentPage, setIsCartOpen, navigate }) => {
    if (!isOpen) return null;

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[110]" onClick={onClose}>
            <div className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-xl animate-slide-in-right flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">GIỎ HÀNG</h2>
                    <button onClick={onClose}><X size={24} /></button>
                </div>
                <div className="flex-grow p-4 overflow-y-auto">
                    {cartItems.length > 0 ? (
                        <div className="space-y-4">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex gap-4">
                                    <img src={item.imageUrl} alt={item.name} className="w-14 h-14 object-contain rounded border border-gray-200" />
                                    <div className="flex-1">
                                        <div className="font-semibold text-sm text-gray-900">{item.name}</div>
                                        <div className="text-xs text-gray-500">{item.size} / {item.colorName}</div>
                                        {item.originalPrice && (
                                          <div className="text-xs text-gray-400 line-through">{formatPrice(item.originalPrice)}</div>
                                        )}
                                        <div className="text-sm text-gray-900 font-bold">{formatPrice(item.price)}</div>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <button 
                                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                          className="px-2 py-1 border border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-100 touch-manipulation" 
                                          disabled={item.quantity <= 1}
                                          aria-label="Giảm số lượng"
                                        >-</button>
                                        <span className="px-2 text-gray-900">{item.quantity}</span>
                                        <button 
                                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                          className="px-2 py-1 border border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-100 touch-manipulation"
                                          aria-label="Tăng số lượng"
                                        >+</button>
                                      </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">Chưa có sản phẩm nào.</p>
                    )}
                </div>
                {cartItems.length > 0 && (
                    <div className="p-4 border-t">
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-bold text-lg">TỔNG CỘNG</span>
                            <span className="font-bold text-lg">{formatPrice(total)}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => { navigate('/'); setCurrentPage('cart'); setIsCartOpen(false); }} className="w-full bg-gray-200 text-black font-bold py-3 rounded-md hover:bg-gray-300">XEM GIỎ HÀNG</button>
                            <button onClick={() => { navigate('/checkout'); setIsCartOpen(false); }} className="w-full bg-black text-white font-bold py-3 rounded-md hover:bg-gray-800">THANH TOÁN</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const QuickViewModal = ({ product, onClose, onAddToCart }) => {
    // Compute the default variant up front
    const defaultVariant = product.variants?.find(v => v.inStock) || product.variants?.[0] || null;
    const [selectedVariant, setSelectedVariant] = useState(defaultVariant);
    const [quantity, setQuantity] = useState(1);
    // const [currentImage, setCurrentImage] = useState(product?.imageUrl || '');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFullViewOpen, setIsFullViewOpen] = useState(false);

    const isCompletelyOutOfStock = product.variants.every(v => !v.inStock);

    // Escape key closes full view modal & scroll lock for fullscreen
    useEffect(() => {
        if (!isFullViewOpen) return;
        
        // Escape key handler
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setIsFullViewOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        
        // Additional scroll lock for fullscreen (extra security)
        const scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            
            // Restore scroll for fullscreen
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            window.scrollTo(0, scrollY);
        };
    }, [isFullViewOpen]);

    // Block scroll when Quick View modal is open
    useEffect(() => {
        // Save current scroll position
        const scrollY = window.scrollY;
        
        // Apply scroll lock styles
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
        
        // Cleanup function to restore scroll
        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            
            // Restore scroll position
            window.scrollTo(0, scrollY);
        };
    }, []); // Empty dependency array - runs on mount/unmount

    // If no valid variant is selected, show a message
    if (!selectedVariant) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-[70] flex justify-center items-center animate-fade-in" onClick={onClose}>
                <div className="bg-white rounded-lg w-full max-w-md p-6 relative" onClick={e => e.stopPropagation()}>
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black"><X size={24} /></button>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
                        <p className="text-gray-600 mb-4">Sản phẩm này hiện không có biến thể khả dụng.</p>
                        <button onClick={onClose} className="bg-black text-white font-bold py-2 px-4 rounded-md hover:bg-gray-800">Đóng</button>
                    </div>
                </div>
            </div>
        );
    }

    const handleAddToCartClick = () => {
        if (selectedVariant) {
            onAddToCart(product, { ...selectedVariant, quantity });
            onClose();
        }
    };

    const images = [product.imageUrl, product.imageUrlBack].filter(Boolean);

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[70] flex justify-center items-center animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-xl w-full max-w-5xl h-auto max-h-[92vh] flex flex-col lg:flex-row p-4 sm:p-6 relative shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 z-10 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-all duration-200 hover:scale-110 group"
                    title="Đóng"
                >
                    <X size={20} className="text-gray-600 group-hover:text-black transition-colors" />
                </button>
                <div className="w-full lg:w-1/2 lg:pr-6 mb-6 lg:mb-0 relative flex">
                    {/* Thumbnails - responsive positioning */}
                    <div className="hidden sm:flex flex-col gap-2 items-center justify-center mr-4">
                        {images.map((img, idx) => (
                            <button 
                                key={img} 
                                onClick={() => setCurrentImageIndex(idx)} 
                                className={`border rounded-lg p-1 transition-all hover:scale-105 ${
                                    currentImageIndex === idx ? 'border-black ring-2 ring-black/20' : 'border-gray-200 hover:border-gray-300'
                                }`}
                            > 
                                <img src={img} alt={`Preview ${idx+1}`} className="w-12 h-12 sm:w-14 sm:h-14 object-contain rounded" />
                            </button>
                        ))}
                    </div>
                    
                    {/* Main image container - enhanced */}
                    <div className="flex-1 flex flex-col items-center justify-center relative bg-white rounded-xl p-4">
                        <img 
                            src={images[currentImageIndex]} 
                            alt={product.name} 
                            className="w-full h-full max-h-[400px] object-contain rounded-lg" 
                        />
                        
                        {/* Navigation arrows - enhanced */}
                        {images.length > 1 && (
                            <>
                                <button 
                                    onClick={prevImage} 
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 hover:scale-110"
                                    title="Ảnh trước"
                                >
                                    <ChevronLeft size={18} className="text-gray-700" />
                                </button>
                                <button 
                                    onClick={nextImage} 
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 hover:scale-110"
                                    title="Ảnh tiếp theo"
                                >
                                    <ChevronRight size={18} className="text-gray-700" />
                                </button>
                            </>
                        )}
                        
                        {/* Full view button - redesigned & repositioned */}
                        <button 
                            onClick={() => setIsFullViewOpen(true)} 
                            className="absolute bottom-3 right-3 bg-black/80 hover:bg-black backdrop-blur-sm text-white rounded-full p-2.5 shadow-xl transition-all duration-200 hover:scale-110 group"
                            title="Xem toàn màn hình"
                        >
                            <svg xmlns='http://www.w3.org/2000/svg' className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4h4M20 8V4h-4M4 16v4h4m12-4v4h-4" />
                            </svg>
                        </button>
                        
                        {/* Mobile thumbnails - bottom dots */}
                        {images.length > 1 && (
                            <div className="sm:hidden flex justify-center gap-2 mt-4">
                                {images.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                                            currentImageIndex === idx ? 'bg-black scale-125' : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Full view modal - Enhanced */}
                {isFullViewOpen && (
                    <>
                        <div className="fixed left-0 right-0 top-16 bottom-0 z-[130] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center animate-fade-in pointer-events-auto" onClick={() => setIsFullViewOpen(false)} tabIndex={-1}>
                        
                        {/* Image navigation area */}
                        <div className="relative flex items-center justify-center w-full h-full px-16" onClick={e => e.stopPropagation()}>
                            {images.length > 1 && (
                                <button 
                                    onClick={prevImage} 
                                    className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full p-3 transition-all duration-200 hover:scale-110"
                                    title="Ảnh trước"
                                >
                                    <ChevronLeft size={28} />
                                </button>
                            )}
                            
                            <img 
                                src={images[currentImageIndex]} 
                                alt={product.name} 
                                className="max-h-[75vh] max-w-[85vw] object-contain mx-auto shadow-2xl rounded-lg" 
                            />
                            
                            {images.length > 1 && (
                                <button 
                                    onClick={nextImage} 
                                    className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full p-3 transition-all duration-200 hover:scale-110"
                                    title="Ảnh tiếp theo"
                                >
                                    <ChevronRight size={28} />
                                </button>
                            )}
                        </div>
                        
                        {/* Enhanced dot indicators */}
                        {images.length > 1 && (
                            <div className="flex justify-center gap-3 mt-8 mb-4">
                                {images.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                                            currentImageIndex === idx 
                                                ? 'bg-white scale-125' 
                                                : 'bg-white/50 hover:bg-white/80'
                                        }`}
                                        title={`Ảnh ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                        
                        {/* Product name overlay */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-6 py-2 rounded-full text-sm font-medium">
                            {product.name}
                        </div>
                    </div>
                    
                    {/* Separate close button with highest z-index */}
                    <button 
                        onClick={() => setIsFullViewOpen(false)} 
                        className="fixed top-20 right-6 z-[150] bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white rounded-full p-3 transition-all duration-200 hover:scale-110 group shadow-2xl border border-white/20"
                        title="Đóng (ESC)"
                    >
                        <X size={24} className="group-hover:rotate-90 transition-transform duration-200" />
                    </button>
                    </>
                )}

                <div className="w-full lg:w-1/2 lg:pl-6 flex flex-col overflow-y-auto">
                    <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                    <p className="text-xl text-gray-800 mb-4">{formatPrice(product.price)}</p>
                    
                    <div className="mb-4">
                        <h3 className="text-sm font-bold mb-2">MÀU SẮC: {selectedVariant.colorName}</h3>
                        <div className="flex items-center gap-2">
                            {[...new Map(product.variants.map(item => [item.colorName, item])).values()].map(colorVariant => (
                                <button key={colorVariant.colorName} onClick={() => setSelectedVariant(colorVariant)} className={`w-8 h-8 rounded-full border transition-all ${selectedVariant.colorName === colorVariant.colorName ? 'border-black scale-110' : 'border-gray-300'}`} style={{backgroundColor: colorVariant.colorHex}}></button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <h3 className="text-sm font-bold mb-2">KÍCH THƯỚC</h3>
                         <div className="flex items-center gap-2">
                            {product.variants.filter(v => v.colorName === selectedVariant.colorName).map(sizeVariant => (
                                <button key={sizeVariant.size} onClick={() => setSelectedVariant(sizeVariant)} disabled={!sizeVariant.inStock} className={`relative border rounded-md px-4 py-2 min-w-[48px] text-sm font-semibold transition-colors ${selectedVariant.size === sizeVariant.size ? 'border-black bg-black text-white' : 'border-gray-300'} disabled:bg-gray-100 disabled:text-gray-400`}>
                                    {sizeVariant.size}
                                    {!sizeVariant.inStock && <div className="absolute inset-0 flex items-center justify-center"><div className="w-full h-px bg-gray-400 transform rotate-[-20deg]"></div></div>}
                                </button>
                            ))}
                        </div>
                    </div>
                     <div className="mb-4">
                        <h3 className="text-sm font-bold mb-2">SỐ LƯỢNG</h3>
                        <div className="flex items-center border rounded-md w-fit">
                          <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-1"><Minus size={16} /></button>
                          <span className="px-4 text-lg">{quantity}</span>
                          <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-1"><Plus size={16} /></button>
                        </div>
                      </div>
                      <div className="mt-auto pt-4 space-y-2">
                         <button onClick={handleAddToCartClick} disabled={isCompletelyOutOfStock || !selectedVariant.inStock} className="w-full bg-gray-200 text-black font-bold py-3 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed">THÊM VÀO GIỎ HÀNG</button>
                         <button disabled={isCompletelyOutOfStock || !selectedVariant.inStock} className="w-full bg-black text-white font-bold py-3 rounded-md hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed">MUA NGAY</button>
                        </div>
                </div>
            </div>
        </div>
    );
};


const Marquee = () => (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black text-white py-2 overflow-hidden">
        <div className="marquee-content flex">
            {[...Array(6)].map((_, i) => <span key={i} className="text-lg font-bold whitespace-nowrap px-6"><span className="text-cyan-400">GET TO KNOW ABOUT OUR VIBE</span> - MEVY STUDIO 2025</span>)}
        </div>
    </div>
);

const Footer = () => (
    <footer className="bg-white text-black p-8 md:p-10">
      <div className="w-full px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div><h3 className="text-lg font-bold mb-4">CÔNG TY</h3><ul><li className="mb-2"><a href="#" className="hover:underline">Về chúng tôi</a></li><li className="mb-2"><a href="#" className="hover:underline">Tuyển dụng</a></li><li className="mb-2"><a href="#" className="hover:underline">Cửa hàng</a></li></ul></div>
        <div><h3 className="text-lg font-bold mb-4">HỖ TRỢ</h3><ul><li className="mb-2"><a href="#" className="hover:underline">Liên hệ</a></li><li className="mb-2"><a href="#" className="hover:underline">FAQ</a></li><li className="mb-2"><a href="#" className="hover:underline">Vận chuyển</a></li><li className="mb-2"><a href="#" className="hover:underline">Trả hàng</a></li></ul></div>
        <div><h3 className="text-lg font-bold mb-4">PHÁP LÝ</h3><ul><li className="mb-2"><a href="#" className="hover:underline">Điều khoản</a></li><li className="mb-2"><a href="#" className="hover:underline">Bảo mật</a></li></ul></div>
        <div><h3 className="text-lg font-bold mb-4">THEO DÕI</h3><ul><li className="mb-2"><a href="#" className="hover:underline">Instagram</a></li><li className="mb-2"><a href="#" className="hover:underline">Facebook</a></li><li className="mb-2"><a href="#" className="hover:underline">Tiktok</a></li></ul></div>
      </div>
      <div className="text-center mt-10 pt-5 border-t border-gray-200 text-sm text-gray-500"><p>Bản quyền © 2024 MEVY. Mọi quyền được bảo lưu.</p></div>
    </footer>
);

const AboutUsPage = ({ onBack }) => (
    <>
        <main className="pt-20">
            <div className="max-w-4xl mx-auto px-4 py-16">
                <h1 className="text-4xl font-bold text-center mb-8">ABOUT US</h1>
                <div className="text-left space-y-6">
                    <p>GOLDIE creates a new aesthetic by accessing technical fabrics, durable materials, experimental knitting techniques, and chemical dyeing treatments. From our perspective, urban streetwear is now renewed by deconstruction through raw cuts, hand distressing, combining innovative garments and asymmetrical details.</p>
                    <p>Our language represents a pov on global youth subcultures.</p>
                    <p>An opinion, a statement, even an emotion, a blurry memory, an imagination of parallel dimension.</p>
                    <p>GOLDIE expresses the chaos and contradictions of society standards, provoking more questions than answers.</p>
                    <p>We are an unexpected concept proudly **created by Vietnamese people**.</p>
                    <div className="w-12 h-px bg-gray-300 mx-auto my-8"></div>
                    <p>GOLDIE hướng đến việc sáng tạo nên thẩm mỹ mới thông qua việc tiếp cận những chất liệu tiên phong với độ bền cao, các kỹ thuật dệt thủ nghiệm, phương pháp xử lý và nhuộm hoá chất. Trang phục đường phố quen thuộc được nhìn nhận qua thương hiệu được làm mới bằng việc giải cấu trúc thông qua những đường cắt thô, tạo hình rách thủ công, kết hợp nhiều chất liệu và các chi tiết bất đối xứng.</p>
                    <p>Ngôn ngữ thiết kế của GOLDIE thể hiện các góc nhìn cá nhân về những văn hoá độc đáo trong của người trẻ. Đôi khi là quan điểm, là tuyên ngôn, là trạng thái cảm xúc, ký ức mơ hồ, hoặc thậm chí là sự tưởng tượng về 1 hình thái song song.</p>
                    <p>Các bộ sưu tập theo mùa ngoài việc phô diễn những giới hạn về sáng tạo, song vẫn luôn dán băng giữa tính thẩm mỹ truyền thống và tôn vinh những giá trị đương đại. Cách tiếp cận thời trang của Goldie nổi lên sự hỗn loạn và mâu thuẫn về những tiêu chuẩn trong xã hội, khơi gợi nhiều câu hỏi hơn là những câu trả lời.</p>
                    <p>GOLDIE là 1 hình thái vô định được **tự hào tạo nên từ những người Việt**.</p>
                    <div className="w-12 h-px bg-gray-300 mx-auto my-8"></div>
                    <div className="space-y-2">
                        <p className="font-bold">STORE LOCATOR:</p>
                        <p>Hanoi - 360 Pho Hue</p>
                        <p>Saigon - VINCOM Dong Khoi, Q1</p>
                        <p>Japan - www.sixty-percent.com/en/collections/goldie</p>
                    </div>
                    <div className="space-y-2 pt-4">
                        <p>Hotline: 0985 022 569</p>
                        <p>Email: info@goldievietnam.com</p>
                        <p>Instagram: @thenewgoldieofficial</p>
                        <p>Facebook: Goldie Vietnam</p>
                    </div>
                </div>
            </div>
        </main>
    </>
);

// Wrapper for QuickViewModal to avoid conditional hooks
function QuickViewModalWrapper(props) {
    if (!props.product) return null;
    return <QuickViewModal {...props} />;
}

const CartPage = ({ cartItems, onUpdateQuantity, onRemoveFromCart, onBack }) => {
  const navigate = useNavigate();
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return (
    <div className="min-h-screen bg-white pt-28 max-w-5xl mx-auto flex flex-col gap-6">
      {/* Title */}
      <h2 className="text-3xl font-bold text-center mb-2">GIỎ HÀNG CỦA BẠN</h2>
      {/* Main content: 2 columns */}
      <div className="w-full flex flex-col md:flex-row gap-6 items-start">
        {/* Left column: summary, product list, note */}
        <div className="w-full md:w-2/3 flex flex-col gap-6">
          <div className="bg-gray-50 rounded p-4 text-gray-700 font-semibold">
            Giỏ hàng của bạn
          </div>
          <div className="w-full">
            <div className="space-y-6">
              {cartItems.length > 0 ? cartItems.map(item => (
                <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                  <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-contain rounded-md" />
                  <div className="flex-1">
                    <div className="font-bold uppercase">{item.name}</div>
                    <div className="text-sm text-gray-500">{formatPrice(item.price)}</div>
                    <div className="text-sm text-gray-500 mt-1">{item.size}</div>
                  </div>
                  <div className="flex items-center border rounded-md bg-white">
                    <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 disabled:opacity-50" disabled={item.quantity <= 1}><Minus size={14} /></button>
                    <span className="px-3 text-sm">{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="px-2 py-1"><Plus size={14} /></button>
                  </div>
                  <div className="font-bold w-24 text-right">{formatPrice(item.price * item.quantity)}</div>
                  <button onClick={() => onRemoveFromCart(item.id)} className="ml-2 text-gray-400 hover:text-black"><X size={18} /></button>
                </div>
              )) : <div className="text-center text-gray-500">Chưa có sản phẩm nào trong giỏ hàng.</div>}
            </div>
          </div>
          {/* Order note */}
          <div className="w-full">
            <div className="bg-gray-100 px-4 py-2 rounded-t text-gray-700 font-semibold">Ghi chú đơn hàng</div>
            <textarea className="w-full border-0 rounded-b bg-gray-100 p-4 min-h-[100px] focus:outline-none resize-none" placeholder="Bạn có lưu ý gì cho shop không?" />
          </div>
        </div>
        {/* Right column: order info */}
        <div className="w-full md:w-1/3 max-w-lg flex-shrink-0">
          <div className="border rounded-lg p-6 bg-white">
            <div className="font-bold text-lg mb-2">Thông tin đơn hàng</div>
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <span className="text-gray-600">Tổng tiền:</span>
              <span className="font-bold text-red-600 text-xl">{formatPrice(total)}</span>
            </div>
            <button className="w-full bg-red-600 text-white text-center font-bold py-3 rounded mb-4" onClick={() => navigate('/checkout')}>THANH TOÁN</button>
            <div className="flex items-center text-gray-400 text-sm gap-2">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
              <button onClick={onBack} className="hover:underline disabled:opacity-50" style={{color:'#888'}}>
                Tiếp tục mua hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Card sản phẩm tối giản, tinh tế cho search overlay
const ProductCardSearch = ({ product, onAddToCart, onQuickViewOpen }) => {
    const [hovered, setHovered] = useState(false);
    const hasBack = !!product.imageUrlBack;
    return (
        <div
            className="flex flex-col h-full bg-white relative group"
            style={{minWidth:0}}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className="flex-1 flex items-center justify-center p-6 cursor-pointer" onClick={() => onQuickViewOpen(product)}>
                <img
                    src={hovered && hasBack ? product.imageUrlBack : product.imageUrl}
                    alt={product.name}
                    className="object-contain max-h-60 w-auto mx-auto transition-all duration-300"
                />
            </div>
            <div className="border-t border-black px-4 py-3 flex flex-col gap-1 items-start">
                <div className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-black truncate" title={product.name}>{product.name}</div>
                <div className="font-mono text-xs text-gray-700">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</div>
            </div>
            <button onClick={() => onAddToCart(product, product.variants[0])} className="absolute bottom-3 right-3 w-7 h-7 flex items-center justify-center border border-black bg-white text-black rounded-none hover:bg-black hover:text-white transition-colors text-lg font-bold p-0" style={{fontFamily:'inherit'}}>+</button>
        </div>
    );
};

// Product Detail Page (basic version, will improve UI later)
function ProductDetailPage({ products, onAddToCart }) {
  const { id } = useParams();
  const product = products.find(p => String(p.id) === String(id));
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [selectedColor, setSelectedColor] = React.useState(null);
  const [selectedSize, setSelectedSize] = React.useState(null);
  const [quantity, setQuantity] = React.useState(1);
  const [showDesc, setShowDesc] = React.useState(true);
  const [showDetails, setShowDetails] = React.useState(false);
  const [showSizeTable, setShowSizeTable] = React.useState(false);
  const [showFullDesc, setShowFullDesc] = React.useState(false);

  // Ảnh
  const images = React.useMemo(() => product ? [product.imageUrl, product.imageUrlBack].filter(Boolean) : [], [product]);
  const colorOptions = React.useMemo(() => product ? [...new Map(product.variants.map(v => [v.colorName, v])).values()] : [], [product]);
  const sizeOptions = React.useMemo(() => {
    if (!product) return [];
    if (selectedColor) return product.variants.filter(v => v.colorName === selectedColor.colorName);
    return product.variants;
  }, [product, selectedColor]);

  React.useEffect(() => {
    if (product && !selectedColor && colorOptions.length > 0) setSelectedColor(colorOptions[0]);
  }, [product, selectedColor, colorOptions]);
  React.useEffect(() => {
    if (product && selectedColor && (!selectedSize || !sizeOptions.some(s => s.size === selectedSize.size))) {
      const firstInStock = sizeOptions.find(s => s.inStock);
      setSelectedSize(firstInStock || sizeOptions[0]);
    }
  }, [product, selectedColor, sizeOptions, selectedSize]);

  if (!product) return <div className="pt-24 text-center">Không tìm thấy sản phẩm.</div>;

  const currentVariant = product.variants.find(v => v.colorName === selectedColor?.colorName && v.size === selectedSize?.size);
  const isOutOfStock = !currentVariant?.inStock;

  // Handler thêm vào giỏ hàng
  const handleAddToCart = () => {
    if (currentVariant && !isOutOfStock) {
      onAddToCart(product, { ...currentVariant, quantity });
    }
  };

  // Bảng size mẫu
  const sizeTable = (
    <div className="overflow-x-auto">
      <table className="min-w-[320px] w-full border border-gray-300 text-sm mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Size</th>
            <th className="border px-4 py-2">Ngực (cm)</th>
            <th className="border px-4 py-2">Dài áo (cm)</th>
            <th className="border px-4 py-2">Vai (cm)</th>
            <th className="border px-4 py-2">Tay (cm)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td className="border px-4 py-2">S</td><td className="border px-4 py-2">48</td><td className="border px-4 py-2">68</td><td className="border px-4 py-2">42</td><td className="border px-4 py-2">20</td></tr>
          <tr><td className="border px-4 py-2">M</td><td className="border px-4 py-2">50</td><td className="border px-4 py-2">70</td><td className="border px-4 py-2">44</td><td className="border px-4 py-2">21</td></tr>
          <tr><td className="border px-4 py-2">L</td><td className="border px-4 py-2">52</td><td className="border px-4 py-2">72</td><td className="border px-4 py-2">46</td><td className="border px-4 py-2">22</td></tr>
          <tr><td className="border px-4 py-2">XL</td><td className="border px-4 py-2">54</td><td className="border px-4 py-2">74</td><td className="border px-4 py-2">48</td><td className="border px-4 py-2">23</td></tr>
        </tbody>
      </table>
    </div>
  );

  // Xử lý scroll chuột để chuyển ảnh
  const handleImageWheel = (e) => {
    if (e.deltaY > 0) {
      setCurrentImageIndex(i => (i + 1) % images.length);
    } else if (e.deltaY < 0) {
      setCurrentImageIndex(i => (i - 1 + images.length) % images.length);
    }
    e.preventDefault();
  };

  // UI
  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-white pt-28 flex justify-center">
      <div className="w-full max-w-screen-lg px-2 sm:px-4 md:px-8 flex flex-col md:flex-row items-start gap-4 md:gap-12 border border-gray-200 rounded-lg shadow-sm bg-white">
        {/* Cụm thumbnail + ảnh sản phẩm */}
        <div className="flex flex-row items-start gap-2 w-full md:w-3/5 max-w-[520px] mx-auto md:mx-0">
          <div className="hidden md:flex flex-col gap-4 items-start justify-start">
=======
    <div className="min-h-screen bg-white flex justify-center items-center" style={{paddingTop: '100px', paddingBottom: '60px'}}>
      <div className="w-full max-w-[90vw] md:max-w-[75vw] h-[calc(100vh-160px)] max-h-[calc(100vh-160px)] flex flex-col md:flex-row items-stretch gap-2 md:gap-6 overflow-hidden">
        {/* Cụm thumbnail + ảnh sản phẩm */}
        <div className="flex flex-col md:flex-row items-stretch w-full md:w-3/5 max-w-full bg-white">
          <div className="hidden md:flex flex-col gap-2 items-start justify-start py-2 px-2 overflow-y-auto max-h-full">
>>>>>>> 216e6ea732df569a6eb2e423196b1f878bbcc2ad
            {images.map((img, idx) => (
              <button key={img} onClick={() => setCurrentImageIndex(idx)} className={`rounded p-1 bg-white transition-all ${currentImageIndex === idx ? 'ring-2 ring-black' : ''}`}>
                <img src={img} alt={`Preview ${idx+1}`} className="w-20 h-20 object-contain rounded" />
              </button>
            ))}
          </div>
<<<<<<< HEAD
          <div className="flex flex-col items-center justify-start w-auto max-w-[400px] group relative" onWheel={handleImageWheel} tabIndex={0} style={{outline:'none'}}>
            <img src={images[currentImageIndex]} alt={product.name} className="object-contain rounded-lg max-h-[500px] w-full bg-white" style={{maxWidth:'100%', minHeight:'320px'}} />
=======
          <div className="flex flex-col items-center justify-center flex-1 group relative overflow-y-auto max-h-full py-2">
            <img src={images[currentImageIndex]} alt={product.name} className="object-contain rounded-lg max-h-[70vh] w-full bg-white" style={{maxWidth:'100%', minHeight:'180px'}} />
>>>>>>> 216e6ea732df569a6eb2e423196b1f878bbcc2ad
            {/* Nút chuyển ảnh nằm trên ảnh, ẩn mặc định, hiện khi hover ảnh */}
            <button
              onClick={() => setCurrentImageIndex(i => (i - 1 + images.length) % images.length)}
              className="hidden group-hover:flex absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 border border-gray-300 hover:border-black shadow-lg rounded-full p-2 items-center justify-center z-10 transition-all duration-200 hover:bg-white hover:scale-110"
              aria-label="Ảnh trước"
            >
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button
              onClick={() => setCurrentImageIndex(i => (i + 1) % images.length)}
              className="hidden group-hover:flex absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 border border-gray-300 hover:border-black shadow-lg rounded-full p-2 items-center justify-center z-10 transition-all duration-200 hover:bg-white hover:scale-110"
              aria-label="Ảnh sau"
            >
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
        {/* Thông tin chi tiết */}
<<<<<<< HEAD
        <div className="w-full md:w-2/5 max-w-md flex flex-col gap-4 justify-start pt-0 mx-auto md:mx-0">
          {/* Thumbnails ngang (chỉ hiện trên mobile hoặc khi cần) */}
          <div className="flex md:hidden gap-4 items-center mb-2 justify-center">
            {images.map((img, idx) => (
              <button key={img} onClick={() => setCurrentImageIndex(idx)} className={`rounded p-1 bg-white transition-all ${currentImageIndex === idx ? 'ring-2 ring-black' : ''}`}>
                <img src={img} alt={`Preview ${idx+1}`} className="w-14 h-14 object-contain rounded" />
              </button>
            ))}
          </div>
          {/* Tên sản phẩm */}
          <div className="text-2xl md:text-3xl font-extrabold uppercase mb-2 tracking-tight break-words">{product.name}</div>
          <div className="text-lg md:text-xl font-bold mb-2">{formatPrice(product.price)}</div>
=======
        <div className={`w-full md:w-2/5 max-w-full flex flex-col gap-2 justify-start pt-0 px-3 py-2 ${showFullDesc ? 'overflow-y-auto' : 'overflow-hidden'} max-h-full`}>
          {/* Thumbnails ngang (chỉ hiện trên mobile hoặc khi cần) */}
          <div className="flex md:hidden gap-2 items-center mb-1 justify-center">
            {images.map((img, idx) => (
              <button key={img} onClick={() => setCurrentImageIndex(idx)} className={`w-2 h-2 rounded-full transition-all ${currentImageIndex === idx ? 'bg-black' : 'bg-gray-300'}`}></button>
            ))}
          </div>
          {/* Tên sản phẩm */}
          <div className="text-base md:text-2xl font-extrabold uppercase mb-1 tracking-tight break-words">{product.name}</div>
          <div className="text-sm md:text-lg font-bold mb-1">{formatPrice(product.price)}</div>
>>>>>>> 216e6ea732df569a6eb2e423196b1f878bbcc2ad
          {product.originalPrice && (
            <div className="text-xs md:text-base text-gray-500 line-through mb-1">{formatPrice(product.originalPrice)}</div>
          )}
          {/* Chọn màu */}
          <div className="mb-1">
<<<<<<< HEAD
            <div className="font-bold text-sm mb-1 tracking-widest">MÀU SẮC: <span className="font-normal">{selectedColor?.colorName}</span></div>
=======
            <div className="font-bold text-xs md:text-sm mb-1 tracking-widest">MÀU SẮC: <span className="font-normal">{selectedColor?.colorName}</span></div>
>>>>>>> 216e6ea732df569a6eb2e423196b1f878bbcc2ad
            <div className="flex gap-2 flex-wrap">
              {colorOptions.map((c, idx) => (
                <button key={c.colorName} onClick={() => setSelectedColor(c)} className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 ${selectedColor?.colorName === c.colorName ? 'border-black scale-110' : 'border-gray-200'} bg-white flex items-center justify-center transition-all`} style={{backgroundColor: c.colorHex}} title={c.colorName}></button>
              ))}
            </div>
          </div>
          {/* Chọn size + nút xem bảng size */}
          <div className="mb-1">
            <div className="flex items-center gap-2 md:gap-4 mb-1">
              <div className="font-bold text-xs md:text-sm tracking-widest">KÍCH THƯỚC</div>
              <button className="text-xs underline text-blue-600 hover:text-blue-800" onClick={() => setShowSizeTable(true)}>Xem bảng size</button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {sizeOptions.map((s) => (
<<<<<<< HEAD
                <button key={s.size} onClick={() => setSelectedSize(s)} disabled={!s.inStock} className={`min-w-[44px] w-12 px-0 py-2 border rounded text-sm font-semibold transition-colors text-center ${selectedSize?.size === s.size ? 'border-black bg-black text-white' : 'border-gray-300'} disabled:bg-gray-100 disabled:text-gray-400`}>
=======
                <button key={s.size} onClick={() => setSelectedSize(s)} disabled={!s.inStock} className={`min-w-[32px] w-8 md:min-w-[44px] md:w-12 px-0 py-1 md:py-2 border rounded text-xs md:text-sm font-semibold transition-colors text-center ${selectedSize?.size === s.size ? 'border-black bg-black text-white' : 'border-gray-300'} disabled:bg-gray-100 disabled:text-gray-400`}>
>>>>>>> 216e6ea732df569a6eb2e423196b1f878bbcc2ad
                  {s.size}
                </button>
              ))}
            </div>
          </div>
          {/* Số lượng */}
          <div className="mb-1">
            <div className="font-bold text-xs md:text-sm mb-1 tracking-widest">SỐ LƯỢNG</div>
            <div className="flex items-center border rounded-md w-fit">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-2 md:px-3 py-1">-</button>
              <span className="px-3 md:px-4 text-base md:text-lg">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="px-2 md:px-3 py-1">+</button>
            </div>
          </div>
<<<<<<< HEAD
=======
          {/* Actions trên mobile */}
          <div className="md:hidden flex gap-2 mt-2 w-full">
            <button className="w-full px-3 py-2 bg-black text-white font-bold rounded transition hover:bg-gray-900" disabled={isOutOfStock} onClick={handleAddToCart}>THÊM VÀO GIỎ</button>
            <button className="w-full px-3 py-2 border border-black text-black font-bold rounded transition hover:bg-black hover:text-white" disabled={isOutOfStock}>MUA NGAY</button>
          </div>
>>>>>>> 216e6ea732df569a6eb2e423196b1f878bbcc2ad
          {/* Shipping & Returns */}
          <div className="border-t border-black w-full mx-0 pt-1">
            <div className="font-bold text-sm md:text-lg tracking-widest mt-1 mb-1">VẬN CHUYỂN & ĐỔI TRẢ</div>
            <div className="text-xs md:text-sm text-gray-800 leading-relaxed mb-1">
              Miễn phí vận chuyển cho đơn hàng từ 40$ trở lên.<br />
              Thời gian xử lý và giao hàng từ 5-7 ngày làm việc.<br />
              Đóng gói quà tặng bao gồm hộp signature của shop.
            </div>
          </div>
          {/* Collapsible Description */}
          <div className="border-t border-black w-full mx-0 pt-1">
            <button className="flex items-center gap-2 font-extrabold text-sm md:text-lg uppercase tracking-widest mt-1 mb-1" onClick={() => setShowDesc(v => !v)}>
              MÔ TẢ SẢN PHẨM
              <span>{showDesc ? '▼' : '▲'}</span>
            </button>
            {showDesc && (
              <div className="text-xs md:text-base text-gray-800 leading-relaxed mb-1">
                {/* Desktop: Giữ nguyên scroll */}
                <div className="hidden md:block max-h-24 md:max-h-32 overflow-y-auto">
                  {product.description || 'Sản phẩm thời trang cao cấp, thiết kế hiện đại, chất liệu bền đẹp.'}
                </div>
                {/* Mobile: Hiển thị đầy đủ */}
                <div className="md:hidden">
                  {product.description || 'Sản phẩm thời trang cao cấp, thiết kế hiện đại, chất liệu bền đẹp.'}
                </div>
              </div>
            )}
          </div>
          {/* Collapsible Product Details */}
          <div className="border-t border-black w-full mx-0">
            <button className="flex items-center gap-2 font-extrabold text-sm md:text-lg uppercase tracking-widest mt-1 mb-1" onClick={() => setShowDetails(v => !v)}>
              CHI TIẾT SẢN PHẨM
              <span>{showDetails ? '▼' : '▲'}</span>
            </button>
            {showDetails && (
              <ul className="text-xs md:text-base text-gray-800 leading-relaxed list-disc pl-5">
                <li>Chất liệu: Cotton cao cấp</li>
                <li>Form: Unisex</li>
                <li>Xuất xứ: Việt Nam</li>
                <li>Hình ảnh chỉ mang tính chất minh họa, sản phẩm thực tế có thể khác đôi chút.</li>
              </ul>
            )}
          </div>
          {/* Popup bảng size */}
          {showSizeTable && (
            <div className="fixed inset-0 z-[120] bg-black bg-opacity-50 flex items-center justify-center" onClick={() => setShowSizeTable(false)}>
              <div className="bg-white rounded-lg p-6 max-w-lg w-full relative" onClick={e => e.stopPropagation()}>
                <button onClick={() => setShowSizeTable(false)} className="absolute top-3 right-3 text-gray-500 hover:text-black"><X size={24} /></button>
                <h2 className="text-xl font-bold mb-4">BẢNG SIZE</h2>
                {sizeTable}
              </div>
            </div>
          )}
          {/* Divider trước button */}
          <div className="border-t border-black w-full mx-0" />
          {/* Actions cuối cùng - chỉ hiển thị trên desktop */}
          <div className="hidden md:flex gap-2 mt-2 w-full">
            <button className="w-full px-4 py-3 bg-black text-white font-bold rounded transition hover:bg-gray-900" disabled={isOutOfStock} onClick={handleAddToCart}>THÊM VÀO GIỎ</button>
            <button className="w-full px-4 py-3 border border-black text-black font-bold rounded transition hover:bg-black hover:text-white" disabled={isOutOfStock}>MUA NGAY</button>
          </div>
          {/* Mobile: Nút XEM THÊM ở cuối giới hạn */}
          <div className="md:hidden absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2">
            <button 
              onClick={() => setShowFullDesc(!showFullDesc)} 
              className="w-full py-2 border border-black text-black font-bold text-sm uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
            >
              {showFullDesc ? 'THU GỌN' : 'XEM THÊM'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dữ liệu địa chỉ mẫu
// const addressData = {
//   'Hà Nội': {
//     'Ba Đình': ['Phúc Xá', 'Trúc Bạch', 'Vĩnh Phúc'],
//     'Hoàn Kiếm': ['Chương Dương', 'Hàng Bạc', 'Hàng Buồm'],
//     'Cầu Giấy': ['Dịch Vọng', 'Nghĩa Đô', 'Quan Hoa']
//   },
//   'TP.HCM': {
//     'Quận 1': ['Bến Nghé', 'Bến Thành', 'Cầu Kho'],
//     'Quận 3': ['Phường 1', 'Phường 2', 'Phường 3'],
//     'Quận 7': ['Tân Phong', 'Tân Quy', 'Phú Mỹ']
//   }
// };

// Hook fetch địa chỉ động
function useVietnamAddress() {
  const [provinces, setProvinces] = React.useState([]);
  const [districts, setDistricts] = React.useState([]);
  const [wards, setWards] = React.useState([]);
  const [loadingProvinces, setLoadingProvinces] = React.useState(false);
  const [loadingDistricts, setLoadingDistricts] = React.useState(false);
  const [loadingWards, setLoadingWards] = React.useState(false);

  const fetchProvinces = React.useCallback(() => {
    setLoadingProvinces(true);
    fetch('https://provinces.open-api.vn/api/p/')
      .then(res => res.json())
      .then(data => setProvinces(data))
      .finally(() => setLoadingProvinces(false));
  }, []);

  const fetchDistricts = React.useCallback((provinceCode) => {
    setLoadingDistricts(true);
    fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
      .then(res => res.json())
      .then(data => setDistricts(data.districts || []))
      .finally(() => setLoadingDistricts(false));
  }, []);

  const fetchWards = React.useCallback((districtCode) => {
    setLoadingWards(true);
    fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
      .then(res => res.json())
      .then(data => setWards(data.wards || []))
      .finally(() => setLoadingWards(false));
  }, []);

  return {
    provinces, districts, wards,
    fetchProvinces, fetchDistricts, fetchWards,
    loadingProvinces, loadingDistricts, loadingWards
  };
}

function CheckoutPage({ cartItems, onBack, setCartItems, setToastMessage }) {
  const navigate = useNavigate();
  const [shippingInfo, setShippingInfo] = React.useState({
    name: '', phone: '', email: '', address: '', ward: '', district: '', city: '', country: 'Vietnam',
  });
  const [paymentMethod, setPaymentMethod] = React.useState('cod');
  const [discountCode, setDiscountCode] = React.useState('');
  const [note, setNote] = React.useState('');
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState({});
  // Địa chỉ động
  const [selectedProvince, setSelectedProvince] = React.useState('');
  const [selectedDistrict, setSelectedDistrict] = React.useState('');
  const [selectedWard, setSelectedWard] = React.useState('');
  const {
    provinces, districts, wards,
    fetchProvinces, fetchDistricts, fetchWards,
    loadingProvinces, loadingDistricts, loadingWards
  } = useVietnamAddress();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = 0; // Placeholder
  const finalTotal = total + shippingFee;

  // Enhanced form validation
  const validateForm = () => {
    const errors = {};
    
    if (!shippingInfo.name.trim()) {
      errors.name = 'Vui lòng nhập họ tên';
    }
    
    if (!shippingInfo.phone.trim()) {
      errors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(shippingInfo.phone.replace(/\s/g, ''))) {
      errors.phone = 'Số điện thoại không hợp lệ';
    }
    
    if (!shippingInfo.email.trim()) {
      errors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingInfo.email)) {
      errors.email = 'Email không hợp lệ';
    }
    
    if (!shippingInfo.address.trim()) {
      errors.address = 'Vui lòng nhập địa chỉ giao hàng';
    }
    
    if (!selectedProvince) {
      errors.city = 'Vui lòng chọn tỉnh/thành phố';
    }
    
    if (!selectedDistrict) {
      errors.district = 'Vui lòng chọn quận/huyện';
    }
    
    return errors;
  };

  const handleOrder = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      const errors = validateForm();
      
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        setError('Vui lòng kiểm tra lại thông tin đã nhập');
        return;
      }
      
      setFieldErrors({});
      setError('');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setToastMessage && setToastMessage('Đặt hàng thành công!');
      setCartItems && setCartItems([]);
      
      setTimeout(() => {
        setSuccess(false);
        setToastMessage && setToastMessage('');
        navigate('/');
      }, 2000);
      
    } catch (error) {
      setError('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
      console.error('Order error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  React.useEffect(() => { fetchProvinces(); }, [fetchProvinces]);
  React.useEffect(() => {
    if (selectedProvince) {
      fetchDistricts(selectedProvince);
      setSelectedDistrict('');
      setSelectedWard('');
      setShippingInfo(info => ({ ...info, city: provinces.find(p => p.code === selectedProvince)?.name || '', district: '', ward: '' }));
    } else {
      setSelectedDistrict(''); setSelectedWard('');
      setShippingInfo(info => ({ ...info, city: '', district: '', ward: '' }));
    }
    // eslint-disable-next-line
  }, [selectedProvince]);
  React.useEffect(() => {
    if (selectedDistrict) {
      fetchWards(selectedDistrict);
      setSelectedWard('');
      setShippingInfo(info => ({ ...info, district: districts.find(d => d.code === selectedDistrict)?.name || '', ward: '' }));
    } else {
      setSelectedWard('');
      setShippingInfo(info => ({ ...info, district: '', ward: '' }));
    }
    // eslint-disable-next-line
  }, [selectedDistrict]);
  React.useEffect(() => {
    if (selectedWard) {
      setShippingInfo(info => ({ ...info, ward: wards.find(w => w.code === selectedWard)?.name || '' }));
    } else {
      setShippingInfo(info => ({ ...info, ward: '' }));
    }
    // eslint-disable-next-line
  }, [selectedWard]);

  // Helper chuyển dữ liệu về dạng options cho react-select
  const provinceOptions = provinces.map(p => ({ value: p.code, label: p.name }));
  const districtOptions = districts.map(d => ({ value: d.code, label: d.name }));
  const wardOptions = wards.map(w => ({ value: w.code, label: w.name }));

  // Style cho react-select
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: '0.75rem',
      borderColor: state.isFocused ? '#000' : '#D1D5DB',
      boxShadow: state.isFocused ? '0 0 0 2px #0001' : 'none',
      minHeight: '48px',
      height: '48px',
      paddingLeft: 2,
      fontSize: '1rem',
      background: '#fff',
      transition: 'border-color 0.2s',
    }),
    option: (base, state) => ({
      ...base,
      fontSize: '1rem',
      background: state.isSelected ? '#111827' : state.isFocused ? '#F3F4F6' : '#fff',
      color: state.isSelected ? '#fff' : '#111827',
      cursor: 'pointer',
    }),
    menu: base => ({ ...base, borderRadius: '0.75rem', zIndex: 20 }),
    singleValue: base => ({ ...base, color: '#111827' }),
    placeholder: base => ({ ...base, color: '#9CA3AF', fontSize: '1rem' }),
    input: base => ({ ...base, fontSize: '1rem' }),
    indicatorSeparator: () => ({ display: 'none' }),
    dropdownIndicator: base => ({ ...base, color: '#6B7280', paddingRight: 12 }),
  };

  return (
    <div className="min-h-screen bg-white py-8 px-2 md:px-0 font-sans overflow-x-auto pt-24 md:pt-20" style={{fontFamily: 'Roboto Condensed, sans-serif'}}>
      <div className="w-full flex flex-col items-center mb-8">
        <span className="text-4xl font-extrabold tracking-widest text-black mb-2" style={{letterSpacing:'0.15em'}}>MEVY</span>
      </div>
      <div className="max-w-6xl w-full mx-auto flex flex-col md:flex-row gap-4 md:gap-8">
        {/* Left: Form */}
        <div className="flex-1 min-w-0 mx-auto md:mx-0">
          {/* Thông tin giao hàng */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 max-w-4xl mx-auto">
            <h2 className="font-bold text-xl mb-6 text-gray-800">Thông tin giao hàng</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black bg-white focus:border-black focus:ring-1 focus:ring-black transition" placeholder="Nhập họ và tên" value={shippingInfo.name} onChange={e => setShippingInfo({...shippingInfo, name: e.target.value})} />
              <input className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black bg-white focus:border-black focus:ring-1 focus:ring-black transition" placeholder="Nhập số điện thoại" value={shippingInfo.phone} onChange={e => setShippingInfo({...shippingInfo, phone: e.target.value})} />
            </div>
            <div className="mb-4">
              <input className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black bg-white focus:border-black focus:ring-1 focus:ring-black transition" placeholder="Nhập email" value={shippingInfo.email} onChange={e => setShippingInfo({...shippingInfo, email: e.target.value})} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
              <div className="md:col-span-5">
                <Select
                  className="w-full"
                  styles={selectStyles}
                  isLoading={loadingProvinces}
                  isClearable
                  placeholder="Chọn Tỉnh/Thành phố"
                  options={provinceOptions}
                  value={provinceOptions.find(opt => opt.value === selectedProvince) || null}
                  onChange={opt => setSelectedProvince(opt ? opt.value : '')}
                  noOptionsMessage={() => 'Không tìm thấy'}
                />
              </div>
              <div className="md:col-span-4">
                <Select
                  className="w-full"
                  styles={selectStyles}
                  isLoading={loadingDistricts}
                  isClearable
                  placeholder="Chọn Quận/Huyện"
                  options={districtOptions}
                  value={districtOptions.find(opt => opt.value === selectedDistrict) || null}
                  onChange={opt => setSelectedDistrict(opt ? opt.value : '')}
                  isDisabled={!selectedProvince || loadingDistricts}
                  noOptionsMessage={() => 'Không tìm thấy'}
                />
              </div>
              <div className="md:col-span-3">
                <Select
                  className="w-full"
                  styles={selectStyles}
                  isLoading={loadingWards}
                  isClearable
                  placeholder="Chọn Phường/Xã"
                  options={wardOptions}
                  value={wardOptions.find(opt => opt.value === selectedWard) || null}
                  onChange={opt => setSelectedWard(opt ? opt.value : '')}
                  isDisabled={!selectedDistrict || loadingWards}
                  noOptionsMessage={() => 'Không tìm thấy'}
                />
              </div>
            </div>
            <div className="mb-4">
              <input className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black bg-white focus:border-black focus:ring-1 focus:ring-black transition" placeholder="Địa chỉ nhà, Đường cụ thể" value={shippingInfo.address} onChange={e => setShippingInfo({...shippingInfo, address: e.target.value})} />
            </div>
          </div>
          {/* Phương thức giao hàng */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
            <h2 className="font-bold text-xl mb-4 text-gray-800">Phương thức giao hàng</h2>
            <input className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-500" placeholder="Nhập địa chỉ để xem các phương thức giao hàng" disabled />
          </div>
          {/* Phương thức thanh toán */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
            <h2 className="font-bold text-xl mb-4 text-gray-800">Phương thức thanh toán</h2>
            <label className="flex items-center gap-2 cursor-pointer text-gray-700">
              <input type="radio" checked={paymentMethod==='cod'} onChange={()=>setPaymentMethod('cod')} className="accent-black" />
              <span className="inline-flex items-center gap-1"><span role="img" aria-label="cod">💵</span> Thanh toán khi nhận hàng (COD)</span>
            </label>
          </div>
          {/* Ghi chú và lỗi */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <textarea className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black bg-white focus:border-black focus:ring-1 focus:ring-black transition" placeholder="Ghi chú đơn hàng" value={note} onChange={e => setNote(e.target.value)} />
            {error && <div className="text-red-600 mt-2 font-semibold text-sm">{error}</div>}
            {success && <div className="text-green-600 mt-2 font-semibold text-sm">Đặt hàng thành công!</div>}
          </div>
        </div>
        {/* Right: Cart & Summary */}
        <div className="w-full md:max-w-md flex-shrink-0 mx-auto md:mx-0">
          {/* Giỏ hàng */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
            <h2 className="font-bold text-xl mb-4 text-gray-800">Giỏ hàng</h2>
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-3 items-center border-b border-gray-200 pb-3 last:border-b-0">
                  <img src={item.imageUrl} alt={item.name} className="w-14 h-14 object-contain rounded border border-gray-200" />
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.size} / {item.colorName}</div>
                    {item.originalPrice && (
                      <div className="text-xs text-gray-400 line-through">{formatPrice(item.originalPrice)}</div>
                    )}
                    <div className="text-sm text-gray-900 font-bold">{formatPrice(item.price)}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="px-2 py-1 border border-gray-300 rounded-xl text-gray-700 bg-white" disabled>-</button>
                    <span className="px-2 text-gray-900">{item.quantity}</span>
                    <button className="px-2 py-1 border border-gray-300 rounded-xl text-gray-700 bg-white" disabled>+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Mã khuyến mãi */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
            <h2 className="font-bold text-xl mb-4 text-gray-800">Mã khuyến mãi</h2>
            <div className="flex gap-2 mb-2">
              <input className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-black bg-white focus:border-black focus:ring-1 focus:ring-black transition" placeholder="Nhập mã khuyến mãi" value={discountCode} onChange={e => setDiscountCode(e.target.value)} />
              <button className="px-4 py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-800 transition shadow-sm">Áp dụng</button>
            </div>
          </div>
          {/* Tóm tắt đơn hàng */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
            <h2 className="font-bold text-xl mb-4 text-gray-800">Tóm tắt đơn hàng</h2>
            <div className="flex justify-between text-base mb-2 text-gray-700"><span>Tổng tiền hàng</span><span>{formatPrice(total)}</span></div>
            <div className="flex justify-between text-base mb-2 text-gray-700"><span>Phí vận chuyển</span><span>{shippingFee === 0 ? '-' : formatPrice(shippingFee)}</span></div>
            <div className="flex justify-between text-lg font-bold mb-6 text-gray-900"><span>Tổng thanh toán</span><span>{formatPrice(finalTotal)}</span></div>
            <button className="w-full py-3 rounded-2xl bg-black text-white font-semibold text-lg hover:bg-gray-800 transition shadow-sm" onClick={handleOrder} disabled={success}>Đặt hàng</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState('featured');
  const [wishlist, setWishlist] = useLocalStorage('wishlist', []);
  const [cartItems, setCartItems] = useLocalStorage('cartItems', []);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [lastAddedItem, setLastAddedItem] = useState(null);
  const [showCartBubble, setShowCartBubble] = useState(false);
  // --- Search state ---
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  // const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const navigate = useNavigate();

  const handleQuickViewOpen = (product) => {
    setQuickViewProduct(product);
  };

  const handleAddToCart = (product, variant) => {
    try {
      const cartItemId = `${product.id}-${variant.colorName}-${variant.size}`;
      const existingItem = cartItems.find(item => item.id === cartItemId);
      let newItem;
      
      if (existingItem) {
          setCartItems(cartItems.map(item => item.id === cartItemId ? { ...item, quantity: item.quantity + 1 } : item));
          newItem = { ...existingItem, quantity: existingItem.quantity + 1 };
      } else {
          newItem = { ...product, ...variant, id: cartItemId, quantity: 1 };
          setCartItems([...cartItems, newItem]);
      }
      
      setLastAddedItem(newItem);
      setShowCartBubble(true);
      setTimeout(() => setShowCartBubble(false), 2500);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setToastMessage('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };
  
  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
        handleRemoveFromCart(itemId);
        return;
    }
    setCartItems(cartItems.map(item => item.id === itemId ? { ...item, quantity: newQuantity } : item));
  };

  const handleRemoveFromCart = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  // const handleUpdateVariant = (item, newVariant) => {
  //   const productId = item.id.split('-')[0];
  //   const product = products.find(p => p.id === Number(productId));
  //   if (!product) return;
  //
  //   const allVariants = product.variants;
  //   const existingVariant = allVariants.find(v => v.colorName === newVariant.colorName && v.size === newVariant.size);
  //
  //   if (existingVariant && existingVariant.inStock) {
  //       setCartItems(cartItems.map(cartItem => {
  //           if (cartItem.id === item.id) {
  //               return { ...cartItem, colorName: newVariant.colorName, size: newVariant.size };
  //           }
  //           return cartItem;
  //       }));
  //   }
  // };


  const toggleWishlist = useCallback((productId) => {
    try {
      setWishlist(prev => {
        const isInWishlist = prev.includes(productId);
        const newWishlist = isInWishlist 
          ? prev.filter(id => id !== productId) 
          : [...prev, productId];
        
        // Show feedback message
        const message = isInWishlist 
          ? 'Đã xóa khỏi danh sách yêu thích' 
          : 'Đã thêm vào danh sách yêu thích';
        setToastMessage(message);
        setTimeout(() => setToastMessage(''), 2000);
        
        return newWishlist;
      });
    } catch (error) {
      console.error('Error updating wishlist:', error);
      setToastMessage('Có lỗi xảy ra khi cập nhật danh sách yêu thích');
      setTimeout(() => setToastMessage(''), 3000);
    }
  }, [setWishlist, setToastMessage]);

  const filteredProducts = useMemo(() => {
      let sortableProducts = [...products].filter(p => 
          (selectedColors.length === 0 || p.variants.some(v => selectedColors.includes(v.colorName))) &&
          (selectedSizes.length === 0 || p.variants.some(v => selectedSizes.includes(v.size))));

      switch (sortOrder) {
        case 'price-asc': sortableProducts.sort((a, b) => a.price - b.price); break;
        case 'price-desc': sortableProducts.sort((a, b) => b.price - a.price); break;
        case 'name-asc': sortableProducts.sort((a, b) => a.name.localeCompare(b.name)); break;
        case 'name-desc': sortableProducts.sort((a, b) => b.name.localeCompare(a.name)); break;
        case 'newest': sortableProducts.sort((a, b) => new Date(b.date) - new Date(a.date)); break;
        default: break;
      }
      return sortableProducts;
  }, [selectedColors, selectedSizes, sortOrder]);

  const activeFilterCount = selectedColors.length + selectedSizes.length;

  // Search logic
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setSearchResults([]);
      setIsSearchActive(false);
      return;
    }
    const results = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.variants && p.variants.some(v => v.colorName.toLowerCase().includes(q) || v.size.toLowerCase().includes(q)))
    );
    setSearchResults(results);
    setIsSearchActive(true);
  }, [searchQuery]);

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchActive(false);
  };

  const style = `
    @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;700&display=swap');
    body { font-family: 'Roboto Condensed', sans-serif; }
    @keyframes fade-in{from{opacity:0}to{opacity:1}}.animate-fade-in{animation:fade-in .3s ease-in-out}
    @keyframes fade-in-down{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}.animate-fade-in-down{animation:fade-in-down .3s ease-in-out}
    @keyframes bounce{0%,100%{transform:translateY(-25%);animation-timing-function:cubic-bezier(.8,0,1,1)}50%{transform:translateY(0);animation-timing-function:cubic-bezier(0,0,.2,1)}}.animate-bounce-slow{animation:bounce 2s infinite}
    @keyframes slide-in{from{transform:translateX(-100%)}to{transform:translateX(0)}}.animate-slide-in{animation:slide-in .3s ease-out}
    @keyframes slide-in-right{from{transform:translateX(100%)}to{transform:translateX(0)}}.animate-slide-in-right{animation:slide-in-right .3s ease-out}
    @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-25%); } }
    .marquee-content { animation: marquee 20s linear infinite; display: inline-flex; }
  `;
  
  const renderPage = () => {
      switch(currentPage) {
          case 'about-us':
            return <AboutUsPage onBack={() => setCurrentPage('home')} />;
          case 'wishlist':
             return <WishlistPage wishlist={wishlist} products={products} onRemoveFromWishlist={toggleWishlist} onBack={() => setCurrentPage('home')} />;
          case 'home':
          default:
            return (
                <main>
                  <section id="top-banner" className="relative w-full bg-black">
                    <video autoPlay loop muted playsInline className="w-full h-auto"><source src="./videos/background1.mp4" /></video>
                    <div className="absolute z-10 bottom-10 left-1/2 -translate-x-1/2"><a href="#product-grid" className="text-white animate-bounce-slow"><ArrowDown size={32} /></a></div>
                  </section>
                  <div className="sticky top-14 z-30 bg-white shadow-sm">
                    <div className="w-full flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center gap-2">
                            <label htmlFor="sort-by" className="font-semibold text-sm text-gray-600">Sắp xếp theo:</label>
                            <select id="sort-by" className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-black" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                                <option value="featured">Mặc định</option>
                                <option value="newest">Mới nhất</option>
                                <option value="price-asc">Giá: Tăng dần</option>
                                <option value="price-desc">Giá: Giảm dần</option>
                                <option value="name-asc">Tên: A-Z</option>
                                <option value="name-desc">Tên: Z-A</option>
                            </select>
                        </div>
                        <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="relative border border-black rounded-full px-4 py-1 font-semibold">Bộ lọc {activeFilterCount > 0 && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-xs text-white">{activeFilterCount}</span>}</button>
                    </div>
                    <FilterPanel isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} selectedColors={selectedColors} setSelectedColors={setSelectedColors} selectedSizes={selectedSizes} setSelectedSizes={setSelectedSizes} />
                  </div>
                  <section id="product-grid" className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-8">
                            {filteredProducts.map(product => <ProductCard key={product.id} product={product} onAddToWishlist={toggleWishlist} wishlist={wishlist} onAddToCart={handleAddToCart} onQuickViewOpen={handleQuickViewOpen} />)}
                        </div>
                    ) : (
                        <div className="text-center py-20"><p className="text-xl text-gray-500">Không tìm thấy sản phẩm phù hợp.</p></div>
                    )}
                  </section>
                </main>
            );
      }
  };

  return (
      <ErrorBoundary>
      <ScrollToTop />
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[90] bg-black text-white px-6 py-3 rounded shadow-lg animate-fade-in">
          {toastMessage}
        </div>
      )}
      {/* Cart bubble notification */}
      {showCartBubble && lastAddedItem && (
        <div className="fixed top-16 right-8 z-[90] bg-white border border-gray-200 shadow-xl rounded-lg w-80 animate-fade-in flex flex-col">
          <div className="flex items-center gap-3 p-4 border-b">
            <img src={lastAddedItem.imageUrl} alt={lastAddedItem.name} className="w-16 h-16 object-contain rounded-md border" />
            <div className="flex-1">
              <div className="font-bold text-sm line-clamp-2">{lastAddedItem.name}</div>
              <div className="text-xs text-gray-500 mt-1">{lastAddedItem.colorName} / {lastAddedItem.size}</div>
              <div className="text-xs text-gray-500 mt-1">Số lượng: {lastAddedItem.quantity}</div>
            </div>
            <button onClick={() => setShowCartBubble(false)} className="text-gray-400 hover:text-black"><X size={18} /></button>
          </div>
          <div className="flex items-center justify-between px-4 py-2">
            <span className="font-bold text-base text-black">{formatPrice(lastAddedItem.price * lastAddedItem.quantity)}</span>
          </div>
          <div className="flex gap-2 px-4 pb-4">
            <button onClick={() => { navigate('/'); setCurrentPage('cart'); setShowCartBubble(false); }} className="flex-1 bg-gray-200 text-black font-bold py-2 rounded hover:bg-gray-300">XEM GIỎ HÀNG</button>
                          <button onClick={() => { navigate('/checkout'); setShowCartBubble(false); }} className="flex-1 bg-black text-white font-bold py-2 rounded hover:bg-gray-800">THANH TOÁN</button>
          </div>
        </div>
      )}
      <style>{style}</style>
      <div className="bg-white min-h-screen pb-12">
        <Header onMobileMenuOpen={() => setIsMobileMenuOpen(true)} setIsMegaMenuOpen={setIsMegaMenuOpen} onSearchOpen={() => setIsSearchOpen(true)} onWishlistOpen={() => setCurrentPage('wishlist')} onCartOpen={() => setIsCartOpen(true)} onNavigate={setCurrentPage} cartItemCount={cartItems.length} wishlistCount={wishlist.length} forceSolid={!isHome} currentPage={currentPage} />
        <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} onNavigate={setCurrentPage}/>
        <SearchOverlay
          isOpen={isSearchOpen}
          onClose={() => { handleClearSearch(); setIsSearchOpen(false); }}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResults={searchResults}
          isSearchActive={isSearchActive}
          onQuickViewOpen={handleQuickViewOpen}
          onAddToWishlist={toggleWishlist}
          wishlist={wishlist}
          onAddToCart={handleAddToCart}
          handleClearSearch={handleClearSearch}
        />
        <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cartItems} onUpdateQuantity={handleUpdateQuantity} onRemoveFromCart={handleRemoveFromCart} setCurrentPage={setCurrentPage} setIsCartOpen={setIsCartOpen} navigate={navigate} />
        <QuickViewModalWrapper product={quickViewProduct} onClose={() => setQuickViewProduct(null)} onAddToCart={handleAddToCart} />
        <div className={`transition-filter duration-300 ${isMegaMenuOpen || isCartOpen || quickViewProduct ? 'blur-sm pointer-events-none' : ''}`}> 
          <Routes>
            <Route path="/" element={currentPage === 'cart' ? (
              <CartPage cartItems={cartItems} onUpdateQuantity={handleUpdateQuantity} onRemoveFromCart={handleRemoveFromCart} onBack={() => setCurrentPage('home')} />
            ) : renderPage()} />
            <Route path="/product/:id" element={<ProductDetailPage products={products} onAddToCart={handleAddToCart} />} />
            <Route path="/checkout" element={<CheckoutPage cartItems={cartItems} onBack={() => setCurrentPage('cart')} setCartItems={setCartItems} setToastMessage={setToastMessage} />} />
            {/* Có thể thêm các route khác như wishlist, about-us nếu muốn */}
          </Routes>
          <Footer />
        </div>
        <Marquee />
        <SizeChatBot products={products} />
      </div>
    </ErrorBoundary>
  );
}

