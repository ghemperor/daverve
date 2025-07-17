   import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ArrowDown, Search, Heart, User, ShoppingCart, Menu, X, ChevronDown, Mail, Plus, Minus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';

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
        { name: 'Nâu', hex: '#78350F' }, { name: 'Xanh', hex: '#3B82F6' },
    ],
    sizes: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'FREESIZE'],
};


// --- Thành phần (Components) ---

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

// Sửa ProductCard để click vào ảnh sẽ chuyển route
const ProductCard = ({ product, onAddToWishlist, wishlist, onAddToCart, onQuickViewOpen }) => {
    const hasOutOfStockSize = useMemo(() => {
        return product.variants.some(s => !s.inStock);
    }, [product.variants]);
    
    const isCompletelyOutOfStock = useMemo(() => {
        return product.variants.every(v => !v.inStock);
    }, [product.variants]);
    
    const isInWishlist = wishlist.includes(product.id);

    const isSale = product.originalPrice && product.price;
    let salePercentage = 0;
    if (isSale) {
        if (product.originalPrice > 0) {
            salePercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
        }
    }

    const handleAddToCartClick = (e) => {
        e.stopPropagation();
        const firstAvailableVariant = product.variants.find(v => v.inStock);
        if (firstAvailableVariant) {
            onAddToCart(product, firstAvailableVariant);
        }
    };

    // Thêm navigate
    const navigate = useNavigate();
    const handleCardClick = () => {
      navigate(`/product/${product.id}`);
    };

    return (
        <div className="group text-left cursor-pointer" onClick={handleCardClick}>
          <div className="relative rounded-lg mb-3 overflow-hidden aspect-[3/4] bg-gray-100">
            {hasOutOfStockSize && (
                <button onClick={e => { e.stopPropagation(); onAddToWishlist(product.id); }} className="absolute top-3 right-3 z-10 p-1.5 bg-white/60 backdrop-blur-sm rounded-sm transition-all hover:scale-110">
                    <Heart className={`w-5 h-5 transition-all ${isInWishlist ? 'text-red-500 fill-current' : 'text-black'}`} />
                </button>
            )}
            {product.tags && product.tags.length > 0 && (
                <div className="absolute top-3 left-3 z-10 flex flex-row flex-wrap items-start gap-1.5">
                    {product.tags.map((tag, index) => (
                        <div key={index} className={`${tag.color} text-white text-[10px] font-bold px-2 py-1 rounded-sm`}>
                            {tag.text}
                        </div>
                    ))}
                </div>
            )}
            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-contain transition-opacity duration-500 ease-in-out group-hover:opacity-0" />
            <img src={product.imageUrlBack} alt={`${product.name} (mặt sau)`} className="absolute inset-0 h-full w-full object-contain opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out" />
            <div className="absolute bottom-4 left-0 right-0 px-4 flex flex-col sm:flex-row items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <button onClick={e => { e.stopPropagation(); onQuickViewOpen(product); }} className="w-full sm:w-32 bg-black text-white text-xs font-bold py-2.5 min-h-[44px] rounded-sm text-center">XEM NHANH</button>
                <button onClick={e => { e.stopPropagation(); onQuickViewOpen(product); }} disabled={isCompletelyOutOfStock} className="w-full sm:flex-grow sm:w-32 bg-black text-white text-xs font-bold py-2.5 min-h-[44px] rounded-sm text-center hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">MUA NGAY</button>
                <button onClick={handleAddToCartClick} disabled={isCompletelyOutOfStock} className="w-full sm:w-12 bg-black text-white text-xs font-bold py-2.5 min-h-[44px] rounded-sm flex items-center justify-center hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
                    <ShoppingCart size={16} />
                </button>
            </div>
          </div>
          
          <div className="px-2">
              <h3 className="text-sm font-bold text-gray-800 truncate w-full uppercase" title={product.name}>
                  {product.name}
              </h3>
              {isSale ? (
                <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-red-600 font-bold">{formatPrice(product.price)}</p>
                    <p className="text-xs text-gray-500 line-through">{formatPrice(product.originalPrice)}</p>
                    <p className="text-xs text-red-600">(-{salePercentage}%)</p>
                </div>
              ) : (
                <p className="text-sm text-gray-600 mt-1">{formatPrice(product.price)}</p>
              )}
          </div>
        </div>
    );
};

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
                                    <a href="#" className="text-xl font-bold">{item.title}</a>
                                    {item.subItems.length > 0 && <ChevronDown size={20} className={`transition-transform ${openSubMenu === item.title ? 'rotate-180' : ''}`} />}
                                </div>
                                {item.subItems.length > 0 && <div className={`overflow-hidden transition-all duration-300 ${openSubMenu === item.title ? 'max-h-screen' : 'max-h-0'}`}><ul className="pl-4 py-2">{item.subItems.map(subItem => <li key={subItem} className="py-1.5"><a href="#" className="text-gray-600 text-sm">{subItem}</a></li>)}</ul></div>}
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
};

const Header = ({ onMobileMenuOpen, setIsMegaMenuOpen, onSearchOpen, onWishlistOpen, onCartOpen, onNavigate, wishlistCount, cartItemCount, forceSolid }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const activeItemData = menuData.find(item => item.title === activeMenu);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const showSolidHeader = activeMenu || isScrolled || forceSolid;
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
        <header onMouseLeave={handleMouseLeaveHeader} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${showSolidHeader ? 'bg-white shadow-md' : 'bg-transparent'}`}>
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="relative flex justify-between items-center h-14">
                    <div className="flex-1 flex justify-start">
                        <button onClick={onMobileMenuOpen} className="lg:hidden"><Menu className={`transition-colors duration-300 ${showSolidHeader ? 'text-black' : 'text-white'}`} /></button>
                        <a href="#" onClick={(e) => handleNavClick(e, {title: 'NEW COLLECTION'})} className={`hidden lg:block text-4xl font-bold transition-colors duration-300 ${showSolidHeader ? 'text-black' : 'text-white'}`}>MEVY</a>
                    </div>
                    <nav className="hidden lg:flex items-center justify-center gap-10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        {menuData.map(item => <div key={item.title} onMouseEnter={() => handleMouseEnterMenu(item.title)} className="h-14 flex items-center"><a href="#" onClick={(e) => handleNavClick(e, item)} className={`text-base font-bold whitespace-nowrap transition-colors duration-300 ${showSolidHeader ? 'text-black' : 'text-white'}`}>{item.title}</a></div>)}
                    </nav>
                    <div className="lg:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"><a href="#" onClick={(e) => handleNavClick(e, {title: 'NEW COLLECTION'})} className={`text-3xl font-bold transition-colors duration-300 ${showSolidHeader ? 'text-black' : 'text-white'}`}>MEVY</a></div>
                    <div className="flex-1 flex justify-end items-center gap-4">
                        <button onClick={onSearchOpen}><Search className={`transition-colors duration-300 ${showSolidHeader ? 'text-black' : 'text-white'}`} /></button>
                        <button onClick={onWishlistOpen} className="relative hidden sm:block">
                            <Heart className={`transition-colors duration-300 ${showSolidHeader ? 'text-black' : 'text-white'}`} />
                             {wishlistCount > 0 && <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">{wishlistCount}</span>}
                        </button>
                        <button onClick={onCartOpen} className="relative">
                           <ShoppingCart className={`transition-colors duration-300 ${showSolidHeader ? 'text-black' : 'text-white'}`} />
                           {cartItemCount > 0 && <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">{cartItemCount}</span>}
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

const SearchOverlay = ({ isOpen, onClose, searchQuery, setSearchQuery, searchResults, isSearchActive, onQuickViewOpen, onAddToWishlist, wishlist, onAddToCart, handleClearSearch }) => {
    const inputRef = useRef(null);
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);
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
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            style={{minWidth:180, fontFamily: 'Roboto Condensed, monospace'}}
                        />
                        {searchQuery && (
                            <button onClick={handleClearSearch} className="absolute right-14 text-gray-400 hover:text-black text-base font-mono tracking-widest transition-colors">CLEAR</button>
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
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6">
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
};

const WishlistPage = ({ wishlist, products, onRemoveFromWishlist, onBack }) => {
    const wishlistedProducts = products.filter(p => wishlist.includes(p.id));
    return (
        <div className="fixed inset-0 bg-white z-[70] animate-fade-in">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center border-b">
                <h1 className="text-2xl font-bold">Danh sách yêu thích</h1>
                <button onClick={onBack} className="font-semibold hover:underline">Quay lại</button>
            </div>
            <div className="p-4 sm:p-6 lg:p-8">
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

const CartSidebar = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveFromCart, setCurrentPage, setIsCartOpen }) => {
    if (!isOpen) return null;

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60]" onClick={onClose}>
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
                                    <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-contain rounded-md border" />
                                    <div className="flex-grow flex flex-col">
                                        <div className="flex justify-between">
                                            <div>
                                                <h3 className="font-bold">{item.name}</h3>
                                                <p className="text-sm text-gray-500">{item.colorName} / {item.size}</p>
                                            </div>
                                            <button onClick={() => onRemoveFromCart(item.id)}><X size={18} className="text-gray-500 hover:text-black" /></button>
                                        </div>
                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex items-center border rounded-md">
                                                <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="px-2 py-1"><Minus size={14} /></button>
                                                <span className="px-3 text-sm">{item.quantity}</span>
                                                <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="px-2 py-1"><Plus size={14} /></button>
                                            </div>
                                            <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
                                        </div>
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
                            <button onClick={() => { setCurrentPage('cart'); setIsCartOpen(false); }} className="w-full bg-gray-200 text-black font-bold py-3 rounded-md hover:bg-gray-300">XEM GIỎ HÀNG</button>
                            <button className="w-full bg-black text-white font-bold py-3 rounded-md hover:bg-gray-800">THANH TOÁN</button>
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
    const [currentImage, setCurrentImage] = useState(product?.imageUrl || '');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFullViewOpen, setIsFullViewOpen] = useState(false);

    const isCompletelyOutOfStock = product.variants.every(v => !v.inStock);

    // Escape key closes full view modal
    useEffect(() => {
        if (!isFullViewOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setIsFullViewOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFullViewOpen]);

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
            <div className="bg-white rounded-lg w-full max-w-4xl h-auto max-h-[90vh] flex p-6 relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black"><X size={24} /></button>
                <div className="w-1/2 pr-4 relative flex">
                    {/* Thumbnails on the left */}
                    <div className="flex flex-col gap-2 items-center justify-center mr-4">
                        {images.map((img, idx) => (
                            <button key={img} onClick={() => setCurrentImageIndex(idx)} className={`border rounded-md p-0.5 transition-all ${currentImageIndex === idx ? 'border-black' : 'border-transparent'} border-[1px]`}> 
                                <img src={img} alt={`Preview ${idx+1}`} className="w-14 h-14 object-contain rounded" />
                            </button>
                        ))}
                    </div>
                    {/* Main image and full view button */}
                    <div className="flex-1 flex flex-col items-center justify-center relative">
                        <img src={images[currentImageIndex]} alt={product.name} className="w-full h-full object-contain rounded-md" />
                        {images.length > 1 && (
                            <>
                                <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 rounded-full p-1 hover:bg-white"><ChevronLeft size={20} /></button>
                                <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 rounded-full p-1 hover:bg-white"><ChevronRight size={20} /></button>
                            </>
                        )}
                        {/* Full view button */}
                        <button onClick={() => setIsFullViewOpen(true)} className="mt-4 bg-white border border-gray-300 rounded p-2 shadow hover:bg-gray-100 flex items-center justify-center">
                            <svg xmlns='http://www.w3.org/2000/svg' className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4h4M20 8V4h-4M4 16v4h4m12-4v4h-4" /></svg>
                        </button>
                    </div>
                </div>

                {/* Full view modal */}
                {isFullViewOpen && (
                    <div className="fixed inset-0 z-[100] bg-black bg-opacity-90 flex flex-col items-center justify-center animate-fade-in" onClick={() => setIsFullViewOpen(false)} tabIndex={-1}>
                        <button onClick={() => setIsFullViewOpen(false)} className="absolute top-6 right-8 text-white text-3xl"><X size={32} /></button>
                        <div className="relative flex items-center justify-center w-full h-full" onClick={e => e.stopPropagation()}>
                            <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/60 text-black rounded-full p-2"><ChevronLeft size={32} /></button>
                            <img src={images[currentImageIndex]} alt={product.name} className="max-h-[70vh] max-w-[80vw] object-contain mx-auto" />
                            <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/60 text-black rounded-full p-2"><ChevronRight size={32} /></button>
                        </div>
                        {/* Dot indicators */}
                        <div className="flex justify-center gap-2 mt-6">
                            {images.map((_, idx) => (
                                <span key={idx} className={`inline-block w-2 h-2 rounded-full ${currentImageIndex === idx ? 'bg-white' : 'bg-gray-500'}`}></span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="w-1/2 pl-4 flex flex-col">
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
    <div className="max-w-5xl mx-auto pt-24 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left column: product list and note */}
      <div className="md:col-span-2">
        <h2 className="text-3xl font-bold text-center mb-8">Giỏ hàng của bạn</h2>
        <div className="bg-gray-50 rounded p-4 mb-6 text-gray-700 font-semibold">
          Có <span className="text-black font-bold">{cartItems.length}</span> sản phẩm trong giỏ hàng
        </div>
        <div className="space-y-6">
          {cartItems.length > 0 ? cartItems.map(item => (
            <div key={item.id} className="flex items-center gap-4 border-b pb-4">
              <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-contain rounded-md border" />
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
        {/* Order note */}
        <div className="mt-8">
          <div className="bg-gray-100 px-4 py-2 rounded-t text-gray-700 font-semibold">Ghi chú đơn hàng</div>
          <textarea className="w-full border-0 rounded-b bg-gray-100 p-4 min-h-[100px] focus:outline-none resize-none" placeholder=""></textarea>
        </div>
      </div>
      {/* Right column: order summary */}
      <div>
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
  );
};

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
  const [showSizeTable, setShowSizeTable] = React.useState(false);

  // Đảm bảo các hook luôn được gọi, không phụ thuộc vào product
  const images = React.useMemo(() => product ? [product.imageUrl, product.imageUrlBack].filter(Boolean) : [], [product]);
  const colorOptions = React.useMemo(() => product ? [...new Map(product.variants.map(v => [v.colorName, v])).values()] : [], [product]);
  const sizeOptions = React.useMemo(() => {
    if (!product) return [];
    if (selectedColor) return product.variants.filter(v => v.colorName === selectedColor.colorName);
    return product.variants;
  }, [product, selectedColor]);

  React.useEffect(() => {
    if (product && !selectedColor && colorOptions.length > 0) setSelectedColor(colorOptions[0]);
    // eslint-disable-next-line
  }, [product, selectedColor, colorOptions]);
  React.useEffect(() => {
    if (product && selectedColor && (!selectedSize || !sizeOptions.some(s => s.size === selectedSize.size))) {
      const firstInStock = sizeOptions.find(s => s.inStock);
      setSelectedSize(firstInStock || sizeOptions[0]);
    }
    // eslint-disable-next-line
  }, [product, selectedColor, sizeOptions, selectedSize]);

  if (!product) return <div className="pt-24 text-center">Không tìm thấy sản phẩm.</div>;

  // Xác định variant hiện tại
  const currentVariant = product.variants.find(v => v.colorName === selectedColor?.colorName && v.size === selectedSize?.size);
  const isOutOfStock = !currentVariant?.inStock;

  // Sản phẩm liên quan (dựa theo tag đầu tiên)
  const relatedTag = product.tags?.[0]?.text;
  const relatedProducts = products.filter(p => p.id !== product.id && p.tags?.some(t => t.text === relatedTag)).slice(0, 4);

  // Thêm vào giỏ
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

  return (
    <>
      <ScrollToTop />
      {/* Frame chi tiết sản phẩm - vùng an toàn */}
      <div className="max-w-[1600px] mx-auto min-h-screen flex flex-col justify-center py-12 px-2 md:px-6 rounded-xl mt-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 flex-1 items-start">
          {/* Cột 1: Thumbnail dọc */}
          <div className="flex flex-col gap-2 items-start w-full min-h-[500px] md:col-span-1 h-full mt-8 md:mt-16 pr-4">
            {images.map((img, idx) => (
              <button key={img} onClick={() => setCurrentImageIndex(idx)} className={`border ${currentImageIndex === idx ? 'border-black' : 'border-gray-200'} rounded-sm p-0.5 transition-all bg-white`}> 
                <img src={img} alt={`Preview ${idx+1}`} className="w-16 h-16 object-contain rounded" />
              </button>
            ))}
          </div>
          {/* Cột 2: Ảnh lớn */}
          <div className="flex items-center justify-center w-full min-h-[500px] md:col-span-7 h-full -mt-8 md:-mt-16">
            <img src={images[currentImageIndex]} alt={product.name} className="w-full object-contain rounded-lg" />
          </div>
          {/* Cột 3: Thông tin sản phẩm */}
          <div className="flex flex-col gap-8 h-full justify-start md:col-span-4 md:pl-8 mt-8 md:mt-16">
            <div>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <div className="flex gap-2 mb-2">
                {product.tags?.map((tag, idx) => (
                  <span key={idx} className={`${tag.color} text-white text-xs font-bold px-2 py-1 rounded-sm`}>{tag.text}</span>
                ))}
              </div>
              <div className="text-2xl text-red-600 font-bold mb-2">{formatPrice(product.price)}</div>
              {product.originalPrice && (
                <div className="text-base text-gray-500 line-through mb-2">{formatPrice(product.originalPrice)}</div>
              )}
            </div>
            {/* Chọn màu */}
            <div>
              <div className="font-semibold mb-1">Màu sắc:</div>
              <div className="flex gap-2">
                {colorOptions.map((c) => (
                  <button key={c.colorName} onClick={() => setSelectedColor(c)} className={`w-8 h-8 rounded-full border transition-all ${selectedColor?.colorName === c.colorName ? 'border-black scale-110' : 'border-gray-200'}`} style={{backgroundColor: c.colorHex}} />
                ))}
              </div>
            </div>
            {/* Chọn size */}
            <div>
              <div className="font-semibold mb-1 flex items-center gap-2">Kích thước:
                <button className="text-xs underline text-blue-600 hover:text-blue-800" onClick={() => setShowSizeTable(true)}>Xem bảng size</button>
              </div>
              <div className="flex gap-2">
                {sizeOptions.map((s) => (
                  <button key={s.size} onClick={() => setSelectedSize(s)} disabled={!s.inStock} className={`min-w-[56px] w-14 px-0 py-2 border rounded-sm text-sm font-semibold transition-colors text-center ${selectedSize?.size === s.size ? 'border-black bg-black text-white' : 'border-gray-300'} disabled:bg-gray-100 disabled:text-gray-400`}>
                    {s.size}
                  </button>
                ))}
              </div>
            </div>
            {/* Số lượng */}
            <div>
              <div className="font-semibold mb-1">Số lượng:</div>
              <div className="flex items-center border rounded-md w-fit">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-1"><Minus size={16} /></button>
                <span className="px-4 text-lg">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-1"><Plus size={16} /></button>
              </div>
            </div>
            {/* Nút mua */}
            <div className="flex flex-col gap-2">
              <button onClick={handleAddToCart} disabled={isOutOfStock} className="w-full bg-black text-white font-bold py-3 rounded-sm hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed">THÊM VÀO GIỎ</button>
              <button disabled={isOutOfStock} className="w-full bg-white border border-black text-black font-bold py-3 rounded-sm hover:bg-gray-100 disabled:bg-gray-200 disabled:cursor-not-allowed">MUA NGAY</button>
            </div>
            {/* Thông tin mô tả */}
            <div className="mt-4">
              <div className="font-bold mb-2">Thông tin sản phẩm</div>
              <ul className="text-base text-gray-700 list-disc pl-5 space-y-1">
                <li>Chất liệu: Cotton cao cấp</li>
                <li>Form: Unisex</li>
                <li>Xuất xứ: Việt Nam</li>
                <li>Hình ảnh chỉ mang tính chất minh họa, sản phẩm thực tế có thể khác đôi chút.</li>
              </ul>
            </div>
          </div>
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
      </div>
      {/* Sản phẩm liên quan */}
      <div className="max-w-[1600px] mx-auto mt-12 px-2 md:px-6">
        {relatedProducts.length > 0 && (
          <>
            <h3 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(rp => (
                <div key={rp.id} className="bg-white border rounded-lg p-2">
                  <ProductCard product={rp} onAddToWishlist={() => {}} wishlist={[]} onAddToCart={() => {}} onQuickViewOpen={() => {}} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

function CheckoutPage({ cartItems, onBack, setCartItems, setToastMessage }) {
  const navigate = useNavigate();
  const [shippingInfo, setShippingInfo] = React.useState({
    name: '', phone: '', email: '', address: '', ward: '', city: '', country: 'Vietnam',
  });
  const [paymentMethod, setPaymentMethod] = React.useState('cod');
  const [discountCode, setDiscountCode] = React.useState('');
  const [note, setNote] = React.useState('');
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = 0; // Placeholder
  const finalTotal = total + shippingFee;

  const handleOrder = () => {
    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address) {
      setError('Vui lòng nhập đầy đủ họ tên, số điện thoại và địa chỉ giao hàng.');
      return;
    }
    setError('');
    setSuccess(true);
    setToastMessage && setToastMessage('Đặt hàng thành công!');
    setCartItems && setCartItems([]);
    setTimeout(() => {
      setSuccess(false);
      setToastMessage && setToastMessage('');
      navigate('/');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white py-8 px-2 md:px-0 font-sans overflow-x-auto pt-24 md:pt-20" style={{fontFamily: 'Roboto Condensed, sans-serif'}}>
+      {/* Brand/Logo */}
+      <div className="w-full flex flex-col items-center mb-8">
+        <span className="text-4xl font-extrabold tracking-widest text-black mb-2" style={{letterSpacing:'0.15em'}}>MEVY</span>
+      </div>
      <div className="max-w-6xl w-full mx-auto flex flex-col md:flex-row gap-4 md:gap-8">
        {/* Left: Form */}
        <div className="flex-1 min-w-0 mx-auto md:mx-0">
          {/* Thông tin giao hàng */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
            <h2 className="font-bold text-xl mb-6 text-gray-800">Thông tin giao hàng</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black bg-white focus:border-black focus:ring-1 focus:ring-black transition" placeholder="Nhập họ và tên" value={shippingInfo.name} onChange={e => setShippingInfo({...shippingInfo, name: e.target.value})} />
              <input className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black bg-white focus:border-black focus:ring-1 focus:ring-black transition" placeholder="Nhập số điện thoại" value={shippingInfo.phone} onChange={e => setShippingInfo({...shippingInfo, phone: e.target.value})} />
            </div>
            <div className="mb-4">
              <input className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black bg-white focus:border-black focus:ring-1 focus:ring-black transition" placeholder="Nhập email" value={shippingInfo.email} onChange={e => setShippingInfo({...shippingInfo, email: e.target.value})} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black bg-white focus:border-black focus:ring-1 focus:ring-black transition" placeholder="Tỉnh/TP" value={shippingInfo.city} onChange={e => setShippingInfo({...shippingInfo, city: e.target.value})} />
              <input className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black bg-white focus:border-black focus:ring-1 focus:ring-black transition" placeholder="Quận/Huyện" value={shippingInfo.district} onChange={e => setShippingInfo({...shippingInfo, district: e.target.value})} />
              <input className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black bg-white focus:border-black focus:ring-1 focus:ring-black transition" placeholder="Phường/Xã" value={shippingInfo.ward} onChange={e => setShippingInfo({...shippingInfo, ward: e.target.value})} />
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
  const [wishlist, setWishlist] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [lastAddedItem, setLastAddedItem] = useState(null);
  const [showCartBubble, setShowCartBubble] = useState(false);
  // --- Search state ---
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const handleQuickViewOpen = (product) => {
    setQuickViewProduct(product);
  };

  const handleAddToCart = (product, variant) => {
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

  const handleUpdateVariant = (item, newVariant) => {
    const productId = item.id.split('-')[0];
    const product = products.find(p => p.id === Number(productId));
    if (!product) return;

    const allVariants = product.variants;
    const existingVariant = allVariants.find(v => v.colorName === newVariant.colorName && v.size === newVariant.size);

    if (existingVariant && existingVariant.inStock) {
        setCartItems(cartItems.map(cartItem => {
            if (cartItem.id === item.id) {
                return { ...cartItem, colorName: newVariant.colorName, size: newVariant.size };
            }
            return cartItem;
        }));
    }
  };


  const toggleWishlist = (productId) => {
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

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
                  <section id="product-grid" className="py-16 px-4 sm:px-6 lg:px-8">
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12">
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
      <>
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[200] bg-black text-white px-6 py-3 rounded shadow-lg animate-fade-in">
          {toastMessage}
        </div>
      )}
      {/* Cart bubble notification */}
      {showCartBubble && lastAddedItem && (
        <div className="fixed top-16 right-8 z-[200] bg-white border border-gray-200 shadow-xl rounded-lg w-80 animate-fade-in flex flex-col">
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
            <button onClick={() => { setCurrentPage('cart'); setShowCartBubble(false); }} className="flex-1 bg-gray-200 text-black font-bold py-2 rounded hover:bg-gray-300">XEM GIỎ HÀNG</button>
            <button onClick={() => { setCurrentPage('cart'); setShowCartBubble(false); }} className="flex-1 bg-black text-white font-bold py-2 rounded hover:bg-gray-800">THANH TOÁN</button>
          </div>
        </div>
      )}
      <style>{style}</style>
      <div className="bg-white min-h-screen pb-12">
        <Header onMobileMenuOpen={() => setIsMobileMenuOpen(true)} setIsMegaMenuOpen={setIsMegaMenuOpen} onSearchOpen={() => setIsSearchOpen(true)} onWishlistOpen={() => setCurrentPage('wishlist')} onCartOpen={() => setIsCartOpen(true)} onNavigate={setCurrentPage} cartItemCount={cartItems.length} wishlistCount={wishlist.length} forceSolid={!isHome} />
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
        <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cartItems} onUpdateQuantity={handleUpdateQuantity} onRemoveFromCart={handleRemoveFromCart} setCurrentPage={setCurrentPage} setIsCartOpen={setIsCartOpen} />
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
      </div>
    </>
  );
}
