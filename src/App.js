import React, { useState, useEffect } from 'react';
import { ArrowDown, Search, Heart, User, ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';

// --- Dữ liệu giả lập (Mock Data) ---
const products = [
  {
    id: 1,
    category: "Áo Thun",
    name: "ASH CLOUD TEE",
    price: "2.500.000₫",
    imageUrl: "https://cdn.hstatic.net/products/1000306633/_dsf0625_b15cc444a3df492db7e4d1024f38a0b9.jpg",
    imageUrlBack: "https://cdn.hstatic.net/products/1000306633/_dsf0641_0980cee6ad6c49538a1fa358abec8f29.jpg",
    color: 'đen',
    size: 'M',
    tags: [
        { text: 'New Arrival', color: 'bg-black' },
    ]
  },
  {
    id: 2,
    category: "Áo Thun",
    name: "FADE OUT WOVEN SHIRT",
    price: "2.300.000₫",
    imageUrl: "https://cdn.hstatic.net/products/1000306633/v_q00068_eb92df24aff647ad8da5c781450dabb7.jpg",
    imageUrlBack: "https://cdn.hstatic.net/products/1000306633/v_q00082_68cffa63a094472da0663028161b45e1.jpg",
    color: 'đen',
    size: 'L',
    tags: [
        { text: 'New Arrival', color: 'bg-black' },
        { text: 'Best Seller', color: 'bg-red-600' }
    ]
  },
  {
    id: 3,
    category: "Áo Hoodie",
    name: "HEAVEN’S CALL HOODIE ZIP",
    price: "4.800.000₫",
    imageUrl: "https://cdn.hstatic.net/products/1000306633/_dsf0923_a8c8dadacc63469b8add85972415a052.jpg",
    imageUrlBack: "https://cdn.hstatic.net/products/1000306633/_dsf0943_99e992b7d7ee430a8271f613ba648bb4.jpg",
    color: 'xám',
    size: 'XL',
    tags: []
  },
  {
    id: 4,
    category: "Áo Thun",
    name: "REFINEMENT FLANNEL SHIRT",
    price: "1.235.000₫",
    originalPrice: "1.900.000₫",
    imageUrl: "https://cdn.hstatic.net/products/1000306633/080425.hd5735_c6dea31826274ac9ba85751b2b4f313b.jpg",
    imageUrlBack: "https://cdn.hstatic.net/products/1000306633/080425.hd5752_3987df81927f48afa3bf69730952b49b.jpg",
    color: 'trắng',
    size: 'S',
    tags: [
        { text: 'Sale', color: 'bg-red-600' }
    ]
  },
  {
    id: 5,
    category: "Áo Thun",
    name: "SPLICE POLO",
    price: "2.500.000₫",
    imageUrl: "https://product.hstatic.net/1000306633/product/untitled_session0156_c644f3db69f74052bef5b087ebe22e2e.jpg",
    imageUrlBack: "https://product.hstatic.net/1000306633/product/untitled_session0174_ed22cd5050f5403d85d7691eb89eaa30.jpg",
    color: 'đen',
    size: 'M',
    tags: [
        { text: 'New Arrival', color: 'bg-black' }
    ]
  },
  {
    id: 6,
    category: "Áo Thun",
    name: "VOID DRIFTER ZIP HOODIE",
    price: "2.300.000₫",
    imageUrl: "https://cdn.hstatic.net/products/1000306633/_dsf0967_3c4b1ab50b9545cbae6c5efe4f7bb7d5.jpg",
    imageUrlBack: "https://cdn.hstatic.net/products/1000306633/_dsf0986_0199361896ac4573a14383e451c2e9ac.jpg",
    color: 'đen',
    size: 'L',
    tags: []
  },
  {
    id: 7,
    category: "Áo Hoodie",
    name: "COZY STRIPE POLO SWEATER",
    price: "4.800.000₫",
    imageUrl: "https://product.hstatic.net/1000306633/product/untitled_session0086_294407cbb3e84ecd9c8908341f2913f2.jpg",
    imageUrlBack: "https://product.hstatic.net/1000306633/product/untitled_session0094_47a82ce475c049daacbe17399332314b.jpg",
    color: 'xám',
    size: 'XL',
    tags: []
  },
  {
    id: 8,
    category: "Áo Thun",
    name: "BLACK WAX BIKER JACKET",
    price: "1.900.000₫",
    imageUrl: "https://product.hstatic.net/1000306633/product/untitled_session0200_abd01f6cede142f09d32917a9f7475fa.jpg",
    imageUrlBack: "https://product.hstatic.net/1000306633/product/untitled_session0217_ea1a74e1f9b249f9980fb4fb5f4f26d9.jpg",
    color: 'trắng',
    size: 'S',
    tags: []
  },
];

const filterOptions = {
    colors: [
        { name: 'trắng', hex: '#FFFFFF' }, { name: 'xanh lá', hex: '#16A34A' }, { name: 'đỏ', hex: '#DC2626' },
        { name: 'đen', hex: '#111827' }, { name: 'xám', hex: '#6B7280' }, { name: 'vàng', hex: '#FBBF24' },
        { name: 'nâu', hex: '#78350F' }, { name: 'xanh dương', hex: '#3B82F6' },
    ],
    sizes: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'FREESIZE'],
};

const menuData = [
  {
    title: "TOPS",
    subItems: ["ÁO THUN & POLOS", "SƠ MI", "HOODIES & SWEATERS", "ÁO KHOÁC"]
  },
  {
    title: "BOTTOMS",
    subItems: ["JEANS", "PANTS", "QUẦN SHORT", "VÁY"]
  },
  {
    title: "ACCESSORIES",
    subItems: ["NÓN", "THẮT LƯNG", "VỚ", "TRANG SỨC"]
  },
  {
    title: "BAGS",
    subItems: ["BALO", "TÚI ĐEO CHÉO", "TÚI TOTE", "VÍ"]
  },
  {
    title: "SALE",
    subItems: []
  }
];

// --- Thành phần (Components) ---

const ProductCard = ({ product }) => {
    const isSale = product.originalPrice && product.price;
    let salePercentage = 0;
    if (isSale) {
        const original = parseFloat(product.originalPrice.replace(/[^0-9.-]+/g,""));
        const sale = parseFloat(product.price.replace(/[^0-9.-]+/g,""));
        if (original > 0) {
            salePercentage = Math.round(((original - sale) / original) * 100);
        }
    }

    return (
        <div className="group text-left">
          <div className="relative rounded-lg mb-3 overflow-hidden aspect-[3/4] bg-gray-100">
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
            <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="flex-grow bg-black/80 backdrop-blur-sm text-white text-xs font-bold py-2.5 rounded-md hover:bg-black transition-colors">MUA NGAY</button>
                <button className="p-2.5 bg-black/80 backdrop-blur-sm text-white rounded-md hover:bg-black transition-colors">
                    <ShoppingCart size={16} />
                </button>
            </div>
          </div>
          
          <div>
              <h3 className="text-sm font-bold text-gray-800 truncate px-2 w-full uppercase" title={product.name}>
                  {product.name}
              </h3>
              {isSale ? (
                <div className="flex items-center gap-2 px-2 mt-1">
                    <p className="text-sm text-red-600 font-bold">{product.price}</p>
                    <p className="text-xs text-gray-500 line-through">{product.originalPrice}</p>
                    <p className="text-xs text-red-600">(-{salePercentage}%)</p>
                </div>
              ) : (
                <p className="text-sm text-gray-600 mt-1 px-2">{product.price}</p>
              )}
          </div>
        </div>
    );
};

const MobileMenu = ({ isOpen, onClose }) => {
    const [openSubMenu, setOpenSubMenu] = useState(null);
    if (!isOpen) return null;
    const toggleSubMenu = (title) => setOpenSubMenu(openSubMenu === title ? null : title);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] lg:hidden" onClick={onClose}>
            <div className="absolute top-0 left-0 h-full w-4/5 max-w-sm bg-white shadow-xl animate-slide-in" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b"><h2 className="text-2xl font-bold">MENU</h2><button onClick={onClose}><X size={24} /></button></div>
                <nav className="p-4">
                    <ul>
                        {menuData.map(item => (
                            <li key={item.title} className="border-b">
                                <div className="flex justify-between items-center py-3" onClick={() => item.subItems.length > 0 && toggleSubMenu(item.title)}>
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

const Header = ({ onMobileMenuOpen, setIsMegaMenuOpen }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    
    const activeItemData = menuData.find(item => item.title === activeMenu);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const showSolidHeader = activeMenu || isScrolled;
    
    const handleMouseEnterMenu = (menuTitle) => {
        setActiveMenu(menuTitle);
        setIsMegaMenuOpen(true);
    };

    const handleMouseLeaveHeader = () => {
        setActiveMenu(null);
        setIsMegaMenuOpen(false);
    };

    return (
        <header onMouseLeave={handleMouseLeaveHeader} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${showSolidHeader ? 'bg-white shadow-md' : 'bg-transparent'}`}>
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="relative flex justify-between items-center h-14">
                    <div className="flex-1 flex justify-start items-center">
                        <button onClick={onMobileMenuOpen} className="lg:hidden">
                            <Menu className={`transition-colors duration-300 ${showSolidHeader ? 'text-black' : 'text-white'}`} />
                        </button>
                        <div className="hidden lg:flex items-center gap-10">
                            <a href="#" className={`text-3xl font-bold transition-colors duration-300 ${showSolidHeader ? 'text-black' : 'text-white'}`}>MEVY</a>
                            <nav className="flex items-center gap-8">
                                {menuData.map(item => 
                                    <div key={item.title} onMouseEnter={() => handleMouseEnterMenu(item.title)} className="h-14 flex items-center">
                                        <a href="#" className={`text-lg font-bold transition-colors duration-300 ${showSolidHeader ? 'text-black' : 'text-white'}`}>{item.title}</a>
                                    </div>
                                )}
                            </nav>
                        </div>
                    </div>

                    <div className="lg:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <a href="#" className={`text-3xl font-bold transition-colors duration-300 ${showSolidHeader ? 'text-black' : 'text-white'}`}>MEVY</a>
                    </div>
                    
                    <div className="flex-1 flex justify-end items-center gap-4">
                        <Search className={`transition-colors duration-300 ${showSolidHeader ? 'text-black' : 'text-white'}`} />
                        <Heart className={`hidden sm:block transition-colors duration-300 ${showSolidHeader ? 'text-black' : 'text-white'}`} />
                        <User className={`hidden sm:block transition-colors duration-300 ${showSolidHeader ? 'text-black' : 'text-white'}`} />
                        <ShoppingCart className={`transition-colors duration-300 ${showSolidHeader ? 'text-black' : 'text-white'}`} />
                    </div>
                </div>
            </div>
            <div className={`hidden lg:block absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-xl transition-all duration-300 overflow-hidden ${activeMenu ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="max-w-screen-2xl mx-auto px-6 py-8">
                    {activeItemData && activeItemData.subItems.length > 0 && <div className="grid grid-cols-5 gap-8"><div className="col-span-1"><h3 className="text-2xl font-bold text-black">{activeItemData.title}</h3></div><div className="col-span-4"><ul className="columns-2 md:columns-3 gap-8">{activeItemData.subItems.map(subItem => <li key={subItem} className="mb-2"><a href="#" className="text-gray-600 hover:text-black hover:underline">{subItem}</a></li>)}</ul></div></div>}
                </div>
            </div>
        </header>
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

const Marquee = () => (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black text-white py-2 overflow-hidden">
        <div className="marquee-content flex">
            {[...Array(6)].map((_, i) => (
                <span key={i} className="text-lg font-bold whitespace-nowrap px-6">
                    <span className="text-cyan-400">GET TO KNOW ABOUT OUR VIBE</span> - MEVY STUDIO 2025
                </span>
            ))}
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

export default function App() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  const filteredProducts = products.filter(p => 
      (selectedColors.length === 0 || selectedColors.includes(p.color)) &&
      (selectedSizes.length === 0 || selectedSizes.includes(p.size))
  );

  const activeFilterCount = selectedColors.length + selectedSizes.length;

  const style = `
    @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;700&display=swap');
    body { font-family: 'Roboto Condensed', sans-serif; }
    @keyframes fade-in{from{opacity:0}to{opacity:1}}.animate-fade-in{animation:fade-in .3s ease-in-out}
    @keyframes fade-in-down{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}.animate-fade-in-down{animation:fade-in-down .3s ease-in-out}
    @keyframes bounce{0%,100%{transform:translateY(-25%);animation-timing-function:cubic-bezier(.8,0,1,1)}50%{transform:translateY(0);animation-timing-function:cubic-bezier(0,0,.2,1)}}.animate-bounce-slow{animation:bounce 2s infinite}
    @keyframes slide-in{from{transform:translateX(-100%)}to{transform:translateX(0)}}.animate-slide-in{animation:slide-in .3s ease-out}
    @keyframes marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-25%); }
    }
    .marquee-content {
        animation: marquee 20s linear infinite;
        display: inline-flex;
    }
  `;

  return (
    <>
      <style>{style}</style>
      <div className="bg-white min-h-screen pb-12">
        <Header onMobileMenuOpen={() => setIsMobileMenuOpen(true)} setIsMegaMenuOpen={setIsMegaMenuOpen} />
        <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        
        <div className={`transition-filter duration-300 ${isMegaMenuOpen ? 'blur-sm pointer-events-none' : ''}`}>
            <main>
              <section id="top-banner" className="relative w-full bg-black">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto"
                >
                  <source src="https://rr5---sn-5hne6nzd.googlevideo.com/videoplayback?expire=1752052251&ei=u91taL28AoD3xN8P9-eAkQo&ip=193.189.137.230&id=o-AOsJHq7EJOly9VdugABNSdDx-RsnEHQE2teiGsVG5_dt&itag=137&aitags=134%2C136%2C137%2C160%2C243&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&siu=1&bui=AY1jyLO-k_2j61wB0IJWADzB-QtFA8hbyHhd3o7DfuXp283ELuFAzCcynZnMxbJqvoiir96PWw&spc=l3OVKZdxII4n&vprv=1&svpuc=1&mime=video%2Fmp4&ns=HrL7053Wub0sV1RbapH7nYcQ&rqh=1&gir=yes&clen=6969876&dur=54.666&lmt=1728351145820450&keepalive=yes&c=TVHTML5_SIMPLY_EMBEDDED_PLAYER&sefc=1&txp=6209224&n=gCQyhCgolg9I5Q&sparams=expire%2Cei%2Cip%2Cid%2Caitags%2Csource%2Crequiressl%2Cxpc%2Csiu%2Cbui%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Crqh%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJfQdSswRgIhAI_Eo86YTR5e6fDhpVGXQ2O1sbtj8kbG0Libkg3mekqWAiEA1C-PtNXvFf-5vbtmj1Rgf8cGEFuqQowWCwfZfiPenrc%3D&title=Thug+Club+Video+Campaign%3A+Spring%2FSummer+2024+Collection&redirect_counter=1&cm2rm=sn-25grs7s&rrc=80&fexp=24350590,24350737,24350827,24350961,24351316,24351318,24351528,24351907,24352220,24352236,24352293,24352295,24352322,24352334,24352335,24352394,24352396,24352398,24352400,24352457,24352460,24352466,24352467,24352517,24352519,24352535,24352537,24352559&req_id=132d4d10f954a3ee&cms_redirect=yes&cmsv=e&met=1752030662,&mh=Wd&mip=2405:4802:3d:8420:fc19:d68c:274c:9edc&mm=34&mn=sn-5hne6nzd&ms=ltu&mt=1752030004&mv=D&mvi=5&pl=0&rms=ltu,au&lsparams=met,mh,mip,mm,mn,ms,mv,mvi,pl,rms&lsig=APaTxxMwRAIgf_emlaKOVKznum2CKPTs9rCTTrGhnexvVjhWaq4DtuoCIEEsqUWJuu6dmJc8V4757gUGZsf1lyFnqy04dt9kBDLI" type="video/mp4" />
                  Trình duyệt của bạn không hỗ trợ thẻ video.
                </video>
                <div className="absolute z-10 bottom-10 left-1/2 -translate-x-1/2">
                    <a href="#product-grid" className="text-white animate-bounce-slow"><ArrowDown size={32} /></a>
                </div>
              </section>

              <div className="sticky top-14 z-30 bg-white shadow-sm">
                <div className="w-full flex justify-end items-center px-4 sm:px-6 lg:px-8 py-4">
                    <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="relative border border-black rounded-full px-4 py-1 font-semibold">
                        Bộ lọc
                        {activeFilterCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-xs text-white">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                </div>
                <FilterPanel isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} selectedColors={selectedColors} setSelectedColors={setSelectedColors} selectedSizes={selectedSizes} setSelectedSizes={setSelectedSizes} />
              </div>

              <section id="product-grid" className="py-16 px-4 sm:px-6 lg:px-8">
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12">
                        {filteredProducts.map(product => <ProductCard key={product.id} product={product} />)}
                    </div>
                ) : (
                    <div className="text-center py-20"><p className="text-xl text-gray-500">Không tìm thấy sản phẩm phù hợp.</p></div>
                )}
              </section>
            </main>
            
            <Footer />
        </div>
        <Marquee />
      </div>
    </>
  );
}
