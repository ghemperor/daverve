import React, { useState, useEffect, useMemo } from 'react';
import { ArrowDown, Search, Heart, User, ShoppingCart, Menu, X, ChevronDown, Mail, Plus, Minus } from 'lucide-react';

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
        { colorName: 'Đen', size: 'S', inStock: true },
        { colorName: 'Đen', size: 'M', inStock: false },
        { colorName: 'Đen', size: 'L', inStock: true },
        { colorName: 'Trắng', size: 'S', inStock: true },
        { colorName: 'Trắng', size: 'M', inStock: true },
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
        { colorName: 'Xám', size: 'M', inStock: true },
        { colorName: 'Xám', size: 'L', inStock: false },
        { colorName: 'Xám', size: 'XL', inStock: true },
    ]
  },
  {
    id: 3,
    name: "HEAVEN’S CALL HOODIE ZIP",
    price: "4800000",
    imageUrl: "https://cdn.hstatic.net/products/1000306633/_dsf0923_a8c8dadacc63469b8add85972415a052.jpg",
    imageUrlBack: "https://cdn.hstatic.net/products/1000306633/_dsf0943_99e992b7d7ee430a8271f613ba648bb4.jpg",
    date: '2025-06-20',
    tags: [{ text: 'Hết hàng', color: 'bg-gray-500' }],
    variants: [
        { colorName: 'Đen', size: 'S', inStock: false },
        { colorName: 'Đen', size: 'M', inStock: false },
        { colorName: 'Đen', size: 'L', inStock: false },
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
        { colorName: 'Xanh', size: 'S', inStock: true },
        { colorName: 'Xanh', size: 'M', inStock: true },
    ]
  },
    {
    id: 5,
    name: "DENIM CAMP CAP",
    price: "800000",
    imageUrl: "https://cdn.hstatic.net/products/1000306633/_dsf1014_9552062794e847d8aea8eab46ed2e6ef.jpg",
    imageUrlBack: "https://cdn.hstatic.net/products/1000306633/_dsf1017_e58c7e5988dc4705a48caaf4a3e0730e.jpg",
    date: '2025-06-20',
    tags: [{ text: 'New Arrival', color: 'bg-black' }],
    variants: [
        { colorName: 'Đen', size: 'S', inStock: true },
        { colorName: 'Đen', size: 'M', inStock: true },
        { colorName: 'Đen', size: 'L', inStock: true },
    ]
  },
   {
    id: 6,
    name: "BLACK WAX BIKER JACKET",
    price: "3235000",
    imageUrl: "https://product.hstatic.net/1000306633/product/untitled_session0200_abd01f6cede142f09d32917a9f7475fa.jpg",
    imageUrlBack: "https://product.hstatic.net/1000306633/product/untitled_session0217_ea1a74e1f9b249f9980fb4fb5f4f26d9.jpg",
    date: '2025-05-15',
    tags: [{ text: 'New Arrival', color: 'bg-black' }],
     variants: [
        { colorName: 'Xanh', size: 'S', inStock: true },
        { colorName: 'Xanh', size: 'M', inStock: true },
    ]
  },
     {
    id: 7,
    name: "OBSTREPEROUS VARSITY JACKET",
    price: "3235000",
    imageUrl: "https://product.hstatic.net/1000306633/product/var1_1e60f3df53744137a96de078f53bd08a.jpg",
    imageUrlBack: "https://product.hstatic.net/1000306633/product/var2_037ba1b1e896408abdde8c84959ca74d.jpg",
    date: '2025-05-15',
    tags: [{ text: 'New Arrival', color: 'bg-black' }],
     variants: [
        { colorName: 'Xanh', size: 'S', inStock: true },
        { colorName: 'Xanh', size: 'M', inStock: true },
    ]
  },
       {
    id: 8,
    name: "SPLICE POLO",
    price: "1235000",
    imageUrl: "https://product.hstatic.net/1000306633/product/untitled_session0156_c644f3db69f74052bef5b087ebe22e2e.jpg",
    imageUrlBack: "https://product.hstatic.net/1000306633/product/untitled_session0174_ed22cd5050f5403d85d7691eb89eaa30.jpg",
    date: '2025-05-15',
    tags: [{ text: 'New Arrival', color: 'bg-black' }],
     variants: [
        { colorName: 'Xanh', size: 'S', inStock: true },
        { colorName: 'Xanh', size: 'M', inStock: true },
    ]
  },
];

const menuData = [
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

const ProductCard = ({ product, onAddToWishlist, wishlist, onAddToCart }) => {
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

    const handleAddToCartClick = () => {
        const firstAvailableVariant = product.variants.find(v => v.inStock);
        if (firstAvailableVariant) {
            onAddToCart(product, firstAvailableVariant);
        }
    };

    return (
        <div className="group text-left">
          <div className="relative rounded-lg mb-3 overflow-hidden aspect-[3/4] bg-gray-100">
            {hasOutOfStockSize && (
                <button onClick={() => onAddToWishlist(product.id)} className="absolute top-3 right-3 z-10 p-1.5 bg-white/60 backdrop-blur-sm rounded-full transition-all hover:scale-110">
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
            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-contain transition-opacity duration-500 ease-in-out" />
            <img src={product.imageUrlBack} alt={`${product.name} (mặt sau)`} className="absolute inset-0 h-full w-full object-contain opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out" />
            <div className="absolute bottom-4 left-0 right-0 px-4 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <button disabled={isCompletelyOutOfStock} className="flex-grow bg-black text-white text-xs font-bold py-2.5 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">MUA NGAY</button>
                <button onClick={handleAddToCartClick} disabled={isCompletelyOutOfStock} className="p-2.5 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
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
                        <a href="#" onClick={(e) => handleNavClick(e, {title: 'NEW COLLECTION'})} className={`hidden lg:block text-4xl font-bold transition-colors duration-300 ${showSolidHeader ? 'text-black' : 'text-white'}`}>DAVERVE</a>
                    </div>
                    <nav className="hidden lg:flex items-center justify-center gap-10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        {menuData.map(item => <div key={item.title} onMouseEnter={() => handleMouseEnterMenu(item.title)} className="h-14 flex items-center"><a href="#" onClick={(e) => handleNavClick(e, item)} className={`text-base font-bold whitespace-nowrap transition-colors duration-300 ${showSolidHeader ? 'text-black' : 'text-white'}`}>{item.title}</a></div>)}
                    </nav>
                    <div className="lg:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"><a href="#" onClick={(e) => handleNavClick(e, {title: 'NEW COLLECTION'})} className={`text-3xl font-bold transition-colors duration-300 ${showSolidHeader ? 'text-black' : 'text-white'}`}>DAVERVE</a></div>
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

const SearchOverlay = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-white shadow-md animate-fade-in-down">
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="relative flex items-center h-16">
                    <Search className="absolute left-0 text-gray-400" />
                    <input type="text" placeholder="Search" className="w-full bg-transparent text-black text-lg pl-10 focus:outline-none" autoFocus />
                    <button onClick={onClose} className="absolute right-0 text-gray-500 hover:text-black"><X size={24} /></button>
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

const CartSidebar = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveFromCart }) => {
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
                            <button className="w-full bg-gray-200 text-black font-bold py-3 rounded-md hover:bg-gray-300">XEM GIỎ HÀNG</button>
                            <button className="w-full bg-black text-white font-bold py-3 rounded-md hover:bg-gray-800">THANH TOÁN</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


const Marquee = () => (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black text-white py-2 overflow-hidden">
        <div className="marquee-content flex">
            {[...Array(6)].map((_, i) => <span key={i} className="text-lg font-bold whitespace-nowrap px-6"><span className="text-red-600">GET TO KNOW ABOUT OUR VIBE</span> - DAVERVE STUDIO 2025</span>)}
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
      {/* <div className="text-center mt-10 pt-5 border-t border-gray-200 text-sm text-gray-500"><p>Bản quyền © 2024 DAVERVE. Mọi quyền được bảo lưu.</p></div> */}
    </footer>
);

const AboutUsPage = ({ onBack }) => (
    <>
        <Header onMobileMenuOpen={()=>{}} setIsMegaMenuOpen={()=>{}} onSearchOpen={()=>{}} onWishlistOpen={()=>{}} onCartOpen={()=>{}} onNavigate={onBack} forceSolid={true} />
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

  const handleAddToCart = (product, variant) => {
    const cartItemId = `${product.id}-${variant.colorName}-${variant.size}`;
    const existingItem = cartItems.find(item => item.id === cartItemId);
    if (existingItem) {
        setCartItems(cartItems.map(item => item.id === cartItemId ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
        setCartItems([...cartItems, { ...product, ...variant, id: cartItemId, quantity: 1 }]);
    }
    setIsCartOpen(true);
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
                    <video autoPlay loop muted playsInline className="w-full h-auto"><source src="./videos/background.mp4" type="video/mp4" /></video>
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
                            {filteredProducts.map(product => <ProductCard key={product.id} product={product} onAddToWishlist={toggleWishlist} wishlist={wishlist} onAddToCart={handleAddToCart} />)}
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
      <style>{style}</style>
      <div className="bg-white min-h-screen pb-12">
        <Header onMobileMenuOpen={() => setIsMobileMenuOpen(true)} setIsMegaMenuOpen={setIsMegaMenuOpen} onSearchOpen={() => setIsSearchOpen(true)} onWishlistOpen={() => setCurrentPage('wishlist')} onCartOpen={() => setIsCartOpen(true)} onNavigate={setCurrentPage} cartItemCount={cartItems.length} wishlistCount={wishlist.length} forceSolid={currentPage !== 'home'} />
        <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} onNavigate={setCurrentPage}/>
        <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cartItems} onUpdateQuantity={handleUpdateQuantity} onRemoveFromCart={handleRemoveFromCart} />
        
        <div className={`transition-filter duration-300 ${isMegaMenuOpen || isCartOpen ? 'blur-sm pointer-events-none' : ''}`}>
            {renderPage()}
            <Footer />
        </div>
        <Marquee />
      </div>
    </>
  );
}
