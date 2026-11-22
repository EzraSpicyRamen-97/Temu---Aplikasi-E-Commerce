// State Manajemen Temu E-Commerce (100% Fitur Berfungsi & Terintegrasi LocalStorage)

const STORAGE_KEYS = {
  CART: 'temu_cart_v2',
  WISHLIST: 'temu_wishlist_v2',
  ORDERS: 'temu_orders_v2',
  ADDRESSES: 'temu_addresses_v2',
  CITY: 'temu_city_v2'
};

// Ambil data dari LocalStorage atau default awal
function getStoredData(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
}

function saveStoredData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Gagal menyimpan ke LocalStorage', e);
  }
}

// Inisialisasi Cart awal (2 produk dari PDF)
const initialCart = [
  {
    productId: 'p1',
    product: STORE_DATA.products.find(p => p.id === 'p1'),
    qty: 1,
    selectedColor: 'Olive',
    selectedSize: 'Standard (38 x 40 cm)'
  },
  {
    productId: 'p2',
    product: STORE_DATA.products.find(p => p.id === 'p2'),
    qty: 1,
    selectedColor: 'Ivory',
    selectedSize: '350 ml'
  }
];

const AppState = {
  viewMode: 'mobile', // 'mobile' | 'desktop'
  currentView: 'home', // 'home' | 'category' | 'wishlist' | 'account' | 'orders' | 'order-detail' | 'search-results'
  activeCuratedTab: 'untukmu',
  activeCategoryPageId: 'all',
  categorySortBy: 'default',
  selectedCity: getStoredData(STORAGE_KEYS.CITY, STORE_DATA.brand.currentCity),
  searchQuery: '',
  selectedOrderId: null,
  
  cart: getStoredData(STORAGE_KEYS.CART, initialCart),
  wishlist: getStoredData(STORAGE_KEYS.WISHLIST, ['p3']),
  orders: getStoredData(STORAGE_KEYS.ORDERS, STORE_DATA.initialOrders),
  addresses: getStoredData(STORAGE_KEYS.ADDRESSES, STORE_DATA.userProfile.addresses),
  
  countdown: {
    hours: 5,
    minutes: 42,
    seconds: 18
  },
  
  appliedVoucher: null,
  shippingMethod: 'jne',
  paymentMethod: 'qris',
  orderNotes: '',
  activeModal: null,
  modalData: null
};

// Sinkronisasi data ke LocalStorage
function persistState() {
  saveStoredData(STORAGE_KEYS.CART, AppState.cart);
  saveStoredData(STORAGE_KEYS.WISHLIST, AppState.wishlist);
  saveStoredData(STORAGE_KEYS.ORDERS, AppState.orders);
  saveStoredData(STORAGE_KEYS.ADDRESSES, AppState.addresses);
  saveStoredData(STORAGE_KEYS.CITY, AppState.selectedCity);
  updateBadges();
}

// Format Rupiah
function formatIDR(amount) {
  return 'Rp' + (amount || 0).toLocaleString('id-ID');
}

// Live Countdown
function initCountdown() {
  setInterval(() => {
    if (AppState.countdown.seconds > 0) {
      AppState.countdown.seconds--;
    } else {
      if (AppState.countdown.minutes > 0) {
        AppState.countdown.minutes--;
        AppState.countdown.seconds = 59;
      } else {
        if (AppState.countdown.hours > 0) {
          AppState.countdown.hours--;
          AppState.countdown.minutes = 59;
          AppState.countdown.seconds = 59;
        }
      }
    }
    const hEl = document.getElementById('cd-hours');
    const mEl = document.getElementById('cd-minutes');
    const sEl = document.getElementById('cd-seconds');
    if (hEl && mEl && sEl) {
      hEl.textContent = String(AppState.countdown.hours).padStart(2, '0');
      mEl.textContent = String(AppState.countdown.minutes).padStart(2, '0');
      sEl.textContent = String(AppState.countdown.seconds).padStart(2, '0');
    }
  }, 1000);
}

// Update Badges di Seluruh UI
function updateBadges() {
  const count = AppState.cart.reduce((total, item) => total + item.qty, 0);
  document.querySelectorAll('.cart-badge-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });

  const favCount = AppState.wishlist.length;
  document.querySelectorAll('.fav-badge-count').forEach(el => {
    el.textContent = favCount;
    el.style.display = favCount > 0 ? 'inline-block' : 'none';
  });

  const ordersCount = AppState.orders.length;
  document.querySelectorAll('.orders-badge-count').forEach(el => {
    el.textContent = ordersCount;
  });
}

// Navigasi Tampilan (View Switcher)
function switchView(viewName, params = {}) {
  AppState.currentView = viewName;
  closeModal();

  // Sembunyikan semua kontainer view
  const views = ['home-view', 'category-view', 'wishlist-view', 'account-view', 'orders-view', 'order-detail-view', 'search-view'];
  views.forEach(v => {
    const el = document.getElementById(v);
    if (el) el.classList.add('hidden');
  });

  // Perbarui status Bottom Nav
  document.querySelectorAll('.bottom-nav-item').forEach(item => {
    const nav = item.getAttribute('data-nav');
    if (nav === viewName || (viewName === 'orders' && nav === 'akun') || (viewName === 'order-detail' && nav === 'akun')) {
      item.classList.add('text-[#1E3A2B]', 'font-semibold');
      item.classList.remove('text-stone-400');
    } else {
      item.classList.remove('text-[#1E3A2B]', 'font-semibold');
      item.classList.add('text-stone-400');
    }
  });

  // Tampilkan view yang aktif
  const targetView = document.getElementById(`${viewName}-view`);
  if (targetView) {
    targetView.classList.remove('hidden');
  }

  // Render view spesifik
  if (viewName === 'home') {
    renderFlashSaleSection();
    renderCuratedSection();
  } else if (viewName === 'category') {
    if (params.categoryId) AppState.activeCategoryPageId = params.categoryId;
    renderCategoryPageView();
  } else if (viewName === 'wishlist') {
    renderWishlistPageView();
  } else if (viewName === 'account') {
    renderAccountPageView();
  } else if (viewName === 'orders') {
    renderOrdersPageView();
  } else if (viewName === 'order-detail') {
    if (params.orderId) AppState.selectedOrderId = params.orderId;
    renderOrderDetailPageView(AppState.selectedOrderId);
  } else if (viewName === 'search') {
    renderSearchResultsView();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
  lucide.createIcons();
}

// Beralih Mode Bingkai (Mobile vs Desktop)
function setViewportMode(mode) {
  AppState.viewMode = mode;
  const container = document.getElementById('app-viewport');
  const btnMobile = document.getElementById('btn-view-mobile');
  const btnDesktop = document.getElementById('btn-view-desktop');
  const statusBar = document.getElementById('mobile-status-bar');
  
  if (mode === 'mobile') {
    container.className = 'viewport-mobile';
    statusBar.classList.remove('hidden');
    btnMobile.classList.add('bg-stone-900', 'text-white');
    btnMobile.classList.remove('bg-white', 'text-stone-700');
    btnDesktop.classList.remove('bg-stone-900', 'text-white');
    btnDesktop.classList.add('bg-white', 'text-stone-700');
  } else {
    container.className = 'viewport-desktop';
    statusBar.classList.add('hidden');
    btnDesktop.classList.add('bg-stone-900', 'text-white');
    btnDesktop.classList.remove('bg-white', 'text-stone-700');
    btnMobile.classList.remove('bg-stone-900', 'text-white');
    btnMobile.classList.add('bg-white', 'text-stone-700');
  }
  lucide.createIcons();
}

// Toast Notifikasi
function showToast(message, type = 'success') {
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = `flex items-center gap-2.5 px-4 py-3 rounded-full text-xs font-semibold shadow-2xl text-white transform transition-all duration-300 translate-y-4 opacity-0 ${
    type === 'error' ? 'bg-red-800' : 'bg-[#1E3A2B]'
  }`;
  toast.innerHTML = `<span>${message}</span>`;
  
  toastContainer.appendChild(toast);
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}

// Toggle Wishlist
function toggleWishlist(productId, event) {
  if (event) event.stopPropagation();
  const idx = AppState.wishlist.indexOf(productId);
  if (idx > -1) {
    AppState.wishlist.splice(idx, 1);
    showToast('Dihapus dari daftar favorit');
  } else {
    AppState.wishlist.push(productId);
    showToast('Ditambahkan ke daftar favorit ❤️');
  }
  persistState();
  renderFlashSaleSection();
  renderCuratedSection();
  if (AppState.currentView === 'wishlist') renderWishlistPageView();
}

// Perhitungan Keranjang Belanja
function getCartCalculations() {
  const subtotal = AppState.cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);
  const freeThreshold = STORE_DATA.brand.freeShippingThreshold;
  const isFreeShipping = subtotal >= freeThreshold;
  const remainingForFree = Math.max(0, freeThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeThreshold) * 100);
  
  let discount = 0;
  if (AppState.appliedVoucher === 'TEMUHEMAT') {
    discount = Math.round(subtotal * 0.1);
  } else if (AppState.appliedVoucher === 'DISKON20K') {
    discount = 20000;
  }
  
  const courier = STORE_DATA.shippingOptions.find(o => o.id === AppState.shippingMethod) || STORE_DATA.shippingOptions[0];
  const shippingFee = (isFreeShipping || AppState.appliedVoucher === 'GRATISONGKIR') ? 0 : courier.price;
  const total = Math.max(0, subtotal - discount + shippingFee);
  
  return {
    subtotal,
    freeThreshold,
    isFreeShipping,
    remainingForFree,
    progressPercent,
    discount,
    shippingFee,
    courier,
    total
  };
}

// Tambah Produk ke Keranjang
function addToCart(productId, qty = 1, color = null, size = null) {
  const prod = STORE_DATA.products.find(p => p.id === productId);
  if (!prod) return;

  const existing = AppState.cart.find(item => item.productId === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    AppState.cart.push({
      productId: prod.id,
      product: prod,
      qty: qty,
      selectedColor: color || (prod.colors ? prod.colors[0] : null),
      selectedSize: size || (prod.sizes ? prod.sizes[0] : null)
    });
  }

  persistState();
  showToast(`"${prod.name}" ditambahkan ke tas belanja! 🛍️`);
}

// Update Kuantitas Item
function updateCartQty(productId, delta) {
  const item = AppState.cart.find(i => i.productId === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    AppState.cart = AppState.cart.filter(i => i.productId !== productId);
    showToast('Produk dihapus dari tas belanja');
  }
  persistState();
  renderCartDrawer();
}

// Hapus Item dari Keranjang
function removeFromCart(productId) {
  AppState.cart = AppState.cart.filter(i => i.productId !== productId);
  persistState();
  renderCartDrawer();
  showToast('Produk dihapus dari tas belanja');
}

// Pasang Voucher
function applyVoucherCode() {
  const input = document.getElementById('voucher-input');
  if (!input) return;
  const code = input.value.trim().toUpperCase();
  const found = STORE_DATA.vouchers.find(v => v.code === code);
  
  if (found) {
    const calc = getCartCalculations();
    if (calc.subtotal < found.minSpend) {
      showToast(`Minimum belanja ${formatIDR(found.minSpend)} untuk voucher ini`, 'error');
      return;
    }
    AppState.appliedVoucher = found.code;
    showToast(`Voucher ${found.code} berhasil dipasang! 🎉`);
    renderCartDrawer();
  } else {
    showToast('Kode voucher tidak ditemukan', 'error');
  }
}

// Render Bagian Flash Sale Beranda
function renderFlashSaleSection() {
  const container = document.getElementById('flash-sale-grid');
  if (!container) return;

  const products = STORE_DATA.products.filter(p => p.isFlashSale);
  container.innerHTML = products.map(p => {
    const isFav = AppState.wishlist.includes(p.id);
    return `
      <div class="group flex flex-col bg-white rounded-2xl p-2.5 cursor-pointer border border-[#EFECE6] hover:border-[#D5D2CB] hover:shadow-xs transition-all"
           onclick="openProductDetail('${p.id}')">
        <div class="relative w-full aspect-square bg-[#F8F7F4] rounded-xl overflow-hidden mb-2.5">
          <img src="${p.image}" alt="${p.name}" class="product-card-img w-full h-full object-cover">
          <button class="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-stone-600 hover:text-red-500 shadow-xs transition-colors"
                  onclick="toggleWishlist('${p.id}', event)" title="Favorit">
            <i data-lucide="heart" class="w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}"></i>
          </button>
        </div>

        <div class="flex-1 flex flex-col justify-between">
          <div>
            <h3 class="text-sm font-semibold text-[#181A18] line-clamp-1 group-hover:text-[#1E3A2B] transition-colors">
              ${p.name}
            </h3>
            <p class="text-[11px] text-[#646864] mt-0.5">${p.subtitle}</p>
          </div>

          <div class="mt-2.5">
            <div class="text-sm font-bold text-[#181A18] tracking-tight">
              ${formatIDR(p.price)}
            </div>
            <div class="flex items-center gap-1.5 mt-0.5">
              <span class="text-[11px] text-[#8C908C] line-through">
                ${formatIDR(p.originalPrice)}
              </span>
              <span class="text-[10px] font-semibold text-[#D9483B] bg-[#FDE8E6] px-1.5 py-0.5 rounded">
                ${p.discount}
              </span>
            </div>

            <div class="flex items-center gap-1 mt-1 text-[11px] text-[#646864]">
              <i data-lucide="star" class="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]"></i>
              <span>${p.rating.toString().replace('.', ',')} / 5</span>
              <span class="text-[10px] text-stone-400">(${p.soldCount} terjual)</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();
}

// Render Bagian Kurasi Beranda
function renderCuratedSection() {
  const container = document.getElementById('curated-grid');
  if (!container) return;

  let products = STORE_DATA.products.filter(p => !p.isFlashSale);
  if (AppState.activeCuratedTab !== 'untukmu') {
    products = products.filter(p => p.category === AppState.activeCuratedTab);
  }

  container.innerHTML = products.map(p => {
    const isFav = AppState.wishlist.includes(p.id);
    return `
      <div class="group flex flex-col bg-white rounded-2xl p-2.5 cursor-pointer border border-[#EFECE6] hover:border-[#D5D2CB] hover:shadow-xs transition-all"
           onclick="openProductDetail('${p.id}')">
        <div class="relative w-full aspect-square bg-[#F8F7F4] rounded-xl overflow-hidden mb-2.5">
          <img src="${p.image}" alt="${p.name}" class="product-card-img w-full h-full object-cover">
          <button class="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-stone-600 hover:text-red-500 shadow-xs transition-colors"
                  onclick="toggleWishlist('${p.id}', event)">
            <i data-lucide="heart" class="w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}"></i>
          </button>
        </div>

        <div class="flex-1 flex flex-col justify-between">
          <div>
            <h3 class="text-sm font-semibold text-[#181A18] line-clamp-1 group-hover:text-[#1E3A2B] transition-colors">
              ${p.name}
            </h3>
            <p class="text-[11px] text-[#646864] mt-0.5">${p.subtitle}</p>
          </div>

          <div class="mt-2.5">
            <div class="text-sm font-bold text-[#181A18] tracking-tight">
              ${formatIDR(p.price)}
            </div>

            <div class="flex items-center gap-1 mt-1 text-[11px] text-[#646864]">
              <i data-lucide="star" class="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]"></i>
              <span>${p.rating.toString().replace('.', ',')} / 5</span>
              <span class="text-[10px] text-stone-400">(${p.soldCount} terjual)</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Perbarui tombol tab
  document.querySelectorAll('.curated-tab-pill').forEach(tab => {
    const key = tab.getAttribute('data-tab');
    if (key === AppState.activeCuratedTab) {
      tab.className = 'curated-tab-pill px-4 py-1.5 rounded-full text-xs font-semibold bg-[#1E3A2B] text-white shadow-xs transition-all';
    } else {
      tab.className = 'curated-tab-pill px-4 py-1.5 rounded-full text-xs font-medium bg-[#F1EFEA] text-[#585B58] hover:bg-[#E7E5DF] transition-all';
    }
  });

  lucide.createIcons();
}

function setCuratedTab(tab) {
  AppState.activeCuratedTab = tab;
  renderCuratedSection();
}

// ----------------------------------------------------
// 2. HALAMAN KATEGORI (CATEGORY PAGE VIEW)
// ----------------------------------------------------
function renderCategoryPageView() {
  const container = document.getElementById('category-page-content');
  if (!container) return;

  let currentCategory = null;
  let filteredProducts = STORE_DATA.products;

  if (AppState.activeCategoryPageId !== 'all') {
    currentCategory = STORE_DATA.categories.find(c => c.id === AppState.activeCategoryPageId);
    filteredProducts = filteredProducts.filter(p => p.category === AppState.activeCategoryPageId);
  }

  // Sorting
  if (AppState.categorySortBy === 'price-low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (AppState.categorySortBy === 'price-high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (AppState.categorySortBy === 'rating') {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  container.innerHTML = `
    <!-- Category Horizontal Scroll Pills -->
    <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-stone-100 mb-4">
      <button onclick="setCategoryFilter('all')" 
              class="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${AppState.activeCategoryPageId === 'all' ? 'bg-[#1E3A2B] text-white shadow-xs' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}">
        Semua Koleksi (${STORE_DATA.products.length})
      </button>
      ${STORE_DATA.categories.map(c => `
        <button onclick="setCategoryFilter('${c.id}')" 
                class="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${AppState.activeCategoryPageId === c.id ? 'bg-[#1E3A2B] text-white shadow-xs' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}">
          ${c.name}
        </button>
      `).join('')}
    </div>

    <!-- Active Category Header Card -->
    ${currentCategory ? `
      <div class="p-4 rounded-2xl bg-[#E4ECE2] flex items-center justify-between mb-4">
        <div>
          <span class="text-[10px] font-bold uppercase tracking-wider text-[#1E3A2B]">Katalog Pilihan</span>
          <h2 class="text-base font-bold text-stone-900 mt-0.5">${currentCategory.name}</h2>
          <p class="text-xs text-stone-600 mt-1 max-w-sm">${currentCategory.description}</p>
        </div>
        <img src="${currentCategory.image}" class="w-16 h-16 rounded-xl object-cover bg-white shadow-xs">
      </div>
    ` : ''}

    <!-- Filter & Sort Bar -->
    <div class="flex items-center justify-between py-2 mb-3 text-xs">
      <span class="text-stone-500 font-medium">Menampilkan <b>${filteredProducts.length}</b> produk</span>
      <select onchange="setCategorySort(this.value)" class="bg-stone-100 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-800 font-medium focus:outline-none focus:border-[#1E3A2B]">
        <option value="default" ${AppState.categorySortBy === 'default' ? 'selected' : ''}>Urutkan: Rekomendasi</option>
        <option value="price-low" ${AppState.categorySortBy === 'price-low' ? 'selected' : ''}>Harga: Terendah</option>
        <option value="price-high" ${AppState.categorySortBy === 'price-high' ? 'selected' : ''}>Harga: Tertinggi</option>
        <option value="rating" ${AppState.categorySortBy === 'rating' ? 'selected' : ''}>Rating Tertinggi</option>
      </select>
    </div>

    <!-- Product Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
      ${filteredProducts.map(p => {
        const isFav = AppState.wishlist.includes(p.id);
        return `
          <div class="group flex flex-col bg-white rounded-2xl p-2.5 cursor-pointer border border-[#EFECE6] hover:border-[#D5D2CB] hover:shadow-xs transition-all"
               onclick="openProductDetail('${p.id}')">
            <div class="relative w-full aspect-square bg-[#F8F7F4] rounded-xl overflow-hidden mb-2.5">
              <img src="${p.image}" alt="${p.name}" class="product-card-img w-full h-full object-cover">
              <button class="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-stone-600 hover:text-red-500 shadow-xs transition-colors"
                      onclick="toggleWishlist('${p.id}', event)">
                <i data-lucide="heart" class="w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}"></i>
              </button>
            </div>
            <div class="flex-1 flex flex-col justify-between">
              <div>
                <h3 class="text-xs font-semibold text-[#181A18] line-clamp-1 group-hover:text-[#1E3A2B]">${p.name}</h3>
                <p class="text-[10px] text-[#646864] mt-0.5">${p.subtitle}</p>
              </div>
              <div class="mt-2">
                <div class="text-xs font-bold text-[#181A18]">${formatIDR(p.price)}</div>
                <div class="flex items-center gap-1 mt-0.5 text-[10px] text-[#646864]">
                  <i data-lucide="star" class="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]"></i>
                  <span>${p.rating.toString().replace('.', ',')} / 5</span>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  lucide.createIcons();
}

function setCategoryFilter(catId) {
  AppState.activeCategoryPageId = catId;
  renderCategoryPageView();
}

function setCategorySort(sortBy) {
  AppState.categorySortBy = sortBy;
  renderCategoryPageView();
}

// ----------------------------------------------------
// 3. HALAMAN WISHLIST (FAVORIT VIEW)
// ----------------------------------------------------
function renderWishlistPageView() {
  const container = document.getElementById('wishlist-page-content');
  if (!container) return;

  const favItems = STORE_DATA.products.filter(p => AppState.wishlist.includes(p.id));

  if (favItems.length === 0) {
    container.innerHTML = `
      <div class="py-16 text-center">
        <div class="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
          <i data-lucide="heart" class="w-7 h-7"></i>
        </div>
        <h3 class="text-sm font-bold text-stone-800">Daftar Favorit Kosong</h3>
        <p class="text-xs text-stone-500 mt-1 max-w-xs mx-auto">Klik ikon hati pada produk yang Anda sukai untuk menyimpannya di sini.</p>
        <button onclick="switchView('home')" class="mt-5 px-6 py-2.5 rounded-full bg-[#1E3A2B] text-white text-xs font-semibold hover:bg-[#15291E]">
          Eksplorasi Produk
        </button>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  container.innerHTML = `
    <div class="flex items-center justify-between mb-4">
      <span class="text-xs text-stone-500 font-medium">${favItems.length} Produk tersimpan</span>
      <button onclick="addAllWishlistToCart()" class="text-xs font-semibold text-[#1E3A2B] hover:underline flex items-center gap-1">
        <i data-lucide="shopping-bag" class="w-3.5 h-3.5"></i>
        Pindahkan Semua ke Tas Belanja
      </button>
    </div>

    <div class="space-y-3">
      ${favItems.map(p => `
        <div class="flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
          <img src="${p.image}" alt="${p.name}" class="w-20 h-20 rounded-xl object-cover bg-stone-100 cursor-pointer"
               onclick="openProductDetail('${p.id}')">
          <div class="flex-1 cursor-pointer" onclick="openProductDetail('${p.id}')">
            <h4 class="text-xs font-bold text-stone-900">${p.name}</h4>
            <p class="text-[11px] text-stone-500">${p.subtitle}</p>
            <p class="text-xs font-bold text-[#1E3A2B] mt-1">${formatIDR(p.price)}</p>
          </div>
          <div class="flex flex-col gap-2">
            <button onclick="addToCart('${p.id}'); showToast('Produk dimasukkan ke tas belanja!');" 
                    class="p-2.5 rounded-full bg-[#1E3A2B] text-white hover:bg-[#15291E] shadow-xs" title="Tambah ke keranjang">
              <i data-lucide="shopping-bag" class="w-4 h-4"></i>
            </button>
            <button onclick="toggleWishlist('${p.id}')" 
                    class="p-2.5 rounded-full bg-stone-100 text-stone-400 hover:text-red-500" title="Hapus">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  lucide.createIcons();
}

function addAllWishlistToCart() {
  const favItems = STORE_DATA.products.filter(p => AppState.wishlist.includes(p.id));
  favItems.forEach(p => {
    addToCart(p.id, 1);
  });
  showToast(`Semua produk favorit (${favItems.length}) dimasukkan ke tas belanja! 🛍️`);
}

// ----------------------------------------------------
// 4. HALAMAN AKUN & PROFIL (ACCOUNT VIEW)
// ----------------------------------------------------
function renderAccountPageView() {
  const container = document.getElementById('account-page-content');
  if (!container) return;

  const defaultAddr = AppState.addresses.find(a => a.isDefault) || AppState.addresses[0];

  container.innerHTML = `
    <!-- User Profile Header Card -->
    <div class="p-5 rounded-3xl bg-[#FAF9F5] border border-stone-200 flex items-center gap-4 mb-5">
      <img src="${STORE_DATA.userProfile.avatar}" alt="${STORE_DATA.userProfile.name}" 
           class="w-16 h-16 rounded-full object-cover ring-4 ring-[#E4ECE2]">
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <h3 class="text-base font-bold text-stone-900">${STORE_DATA.userProfile.name}</h3>
          <span class="text-[10px] font-bold uppercase tracking-wider bg-[#E4ECE2] text-[#1E3A2B] px-2 py-0.5 rounded-full">Member</span>
        </div>
        <p class="text-xs text-stone-500 mt-0.5">${STORE_DATA.userProfile.email}</p>
        <p class="text-xs text-stone-500">${STORE_DATA.userProfile.phone}</p>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-3 gap-3 mb-5 text-center">
      <div class="p-3 bg-white rounded-2xl border border-stone-200/80 cursor-pointer hover:border-[#1E3A2B]" onclick="switchView('orders')">
        <div class="text-lg font-bold text-[#1E3A2B]">${AppState.orders.length}</div>
        <div class="text-[11px] text-stone-500 mt-0.5">Pesanan</div>
      </div>
      <div class="p-3 bg-white rounded-2xl border border-stone-200/80 cursor-pointer hover:border-[#1E3A2B]" onclick="switchView('wishlist')">
        <div class="text-lg font-bold text-[#1E3A2B]">${AppState.wishlist.length}</div>
        <div class="text-[11px] text-stone-500 mt-0.5">Favorit</div>
      </div>
      <div class="p-3 bg-white rounded-2xl border border-stone-200/80">
        <div class="text-lg font-bold text-[#1E3A2B]">${STORE_DATA.vouchers.length}</div>
        <div class="text-[11px] text-stone-500 mt-0.5">Voucher Promo</div>
      </div>
    </div>

    <!-- Menu List -->
    <div class="bg-white rounded-2xl border border-stone-200/80 divide-y divide-stone-100 overflow-hidden mb-5">
      
      <!-- Pesanan Saya -->
      <button onclick="switchView('orders')" class="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-stone-50 transition-colors">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full bg-[#EBF1EA] text-[#1E3A2B] flex items-center justify-center">
            <i data-lucide="package" class="w-4 h-4"></i>
          </div>
          <div>
            <h4 class="text-xs font-bold text-stone-900">Pesanan Saya</h4>
            <p class="text-[11px] text-stone-500">Lihat status & lacak resi pengiriman</p>
          </div>
        </div>
        <div class="flex items-center gap-1.5 text-xs text-stone-400">
          <span class="w-5 h-5 rounded-full bg-[#1E3A2B] text-white text-[10px] flex items-center justify-center font-bold">${AppState.orders.length}</span>
          <i data-lucide="chevron-right" class="w-4 h-4"></i>
        </div>
      </button>

      <!-- Buku Alamat -->
      <button onclick="openAddressBookModal()" class="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-stone-50 transition-colors">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full bg-[#FAF9F5] text-stone-700 flex items-center justify-center border border-stone-200">
            <i data-lucide="map-pin" class="w-4 h-4"></i>
          </div>
          <div>
            <h4 class="text-xs font-bold text-stone-900">Buku Alamat</h4>
            <p class="text-[11px] text-stone-500">${defaultAddr ? defaultAddr.city + ', ' + defaultAddr.province : 'Atur alamat kirim'}</p>
          </div>
        </div>
        <i data-lucide="chevron-right" class="w-4 h-4 text-stone-400"></i>
      </button>

      <!-- Pusat Bantuan & FAQ -->
      <button onclick="openHelpCenter()" class="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-stone-50 transition-colors">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full bg-[#FAF9F5] text-stone-700 flex items-center justify-center border border-stone-200">
            <i data-lucide="help-circle" class="w-4 h-4"></i>
          </div>
          <div>
            <h4 class="text-xs font-bold text-stone-900">Pusat Bantuan & Syarat</h4>
            <p class="text-[11px] text-stone-500">FAQ, Kebijakan Retur 7 Hari, Kontak CS</p>
          </div>
        </div>
        <i data-lucide="chevron-right" class="w-4 h-4 text-stone-400"></i>
      </button>

    </div>

    <!-- Accordion FAQ Singkat -->
    <div class="p-4 rounded-2xl bg-[#EBF1EA] space-y-3">
      <h4 class="text-xs font-bold text-[#1E3A2B] uppercase tracking-wide">Pertanyaan Umum (FAQ)</h4>
      <div class="space-y-2">
        ${STORE_DATA.faqs.map(faq => `
          <details class="bg-white rounded-xl p-3 text-xs border border-stone-200/60 transition-all">
            <summary class="font-bold text-stone-800 cursor-pointer flex justify-between items-center select-none">
              <span>${faq.q}</span>
              <i data-lucide="chevron-down" class="w-4 h-4 text-stone-400 chevron-arrow transition-transform"></i>
            </summary>
            <p class="mt-2 text-stone-600 leading-relaxed border-t border-stone-100 pt-2">${faq.a}</p>
          </details>
        `).join('')}
      </div>
    </div>
  `;

  lucide.createIcons();
}

// ----------------------------------------------------
// 5. HALAMAN PESANAN SAYA (ORDERS VIEW)
// ----------------------------------------------------
function renderOrdersPageView() {
  const container = document.getElementById('orders-page-content');
  if (!container) return;

  if (AppState.orders.length === 0) {
    container.innerHTML = `
      <div class="py-16 text-center">
        <div class="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
          <i data-lucide="package" class="w-7 h-7"></i>
        </div>
        <h3 class="text-sm font-bold text-stone-800">Belum Ada Riwayat Pesanan</h3>
        <p class="text-xs text-stone-500 mt-1">Seluruh pesanan yang Anda buat akan tercatat di sini.</p>
        <button onclick="switchView('home')" class="mt-5 px-6 py-2.5 rounded-full bg-[#1E3A2B] text-white text-xs font-semibold hover:bg-[#15291E]">
          Mulai Belanja
        </button>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  container.innerHTML = `
    <div class="space-y-4">
      ${AppState.orders.map(order => `
        <div class="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs">
          <!-- Order Card Header -->
          <div class="flex items-center justify-between border-b border-stone-100 pb-2.5 text-xs">
            <div>
              <span class="font-mono font-bold text-stone-900">${order.id}</span>
              <span class="text-stone-400 mx-1">·</span>
              <span class="text-stone-500 text-[11px]">${order.date}</span>
            </div>
            <span class="px-2.5 py-0.5 rounded-full font-semibold text-[10px] ${
              order.statusCode === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }">
              ${order.status}
            </span>
          </div>

          <!-- Items Preview -->
          <div class="py-3 divide-y divide-stone-50">
            ${order.items.map(it => `
              <div class="flex items-center gap-3 py-1.5">
                <img src="${it.image || (it.product && it.product.image)}" class="w-12 h-12 rounded-lg object-cover bg-stone-50">
                <div class="flex-1">
                  <h5 class="text-xs font-bold text-stone-800 line-clamp-1">${it.name || (it.product && it.product.name)}</h5>
                  <p class="text-[10px] text-stone-500">${it.qty} barang × ${formatIDR(it.price || (it.product && it.product.price))}</p>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Order Card Footer -->
          <div class="pt-2.5 border-t border-stone-100 flex items-center justify-between">
            <div>
              <span class="text-[10px] text-stone-400 block">Total Transaksi</span>
              <span class="text-xs font-bold text-[#1E3A2B]">${formatIDR(order.total)}</span>
            </div>
            <div class="flex gap-2">
              <button onclick="switchView('order-detail', { orderId: '${order.id}' })" 
                      class="px-4 py-1.5 rounded-full border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50">
                Lacak Paket
              </button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  lucide.createIcons();
}

// ----------------------------------------------------
// 6. DETAIL PESANAN & TRACKING RESI (ORDER DETAIL VIEW)
// ----------------------------------------------------
function renderOrderDetailPageView(orderId) {
  const container = document.getElementById('order-detail-page-content');
  if (!container) return;

  const order = AppState.orders.find(o => o.id === orderId) || AppState.orders[0];
  if (!order) return;

  container.innerHTML = `
    <!-- Status & Courier Banner -->
    <div class="p-4 rounded-2xl bg-[#FAF9F5] border border-stone-200 mb-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-mono font-bold text-stone-900">${order.id}</span>
        <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
          ${order.status}
        </span>
      </div>
      <p class="text-xs text-stone-600 font-medium">${order.courier}</p>
      <p class="text-[11px] text-stone-400 mt-0.5">Tujuan: Kota ${order.destinationCity}</p>
    </div>

    <!-- Live Tracking Timeline -->
    <div class="p-4 rounded-2xl bg-white border border-stone-200 mb-4">
      <h4 class="text-xs font-bold uppercase tracking-wider text-stone-900 mb-3 flex items-center gap-1.5">
        <i data-lucide="truck" class="w-4 h-4 text-[#1E3A2B]"></i>
        Perjalanan Paket (Resi JNE)
      </h4>
      <div class="space-y-4">
        ${order.timeline.map((step, idx) => `
          <div class="timeline-item flex gap-3">
            <div class="timeline-dot pt-0.5">
              <span class="w-3.5 h-3.5 rounded-full flex items-center justify-center ${idx === order.timeline.length - 1 ? 'bg-emerald-600 text-white' : 'bg-stone-300'}">
                <span class="w-1.5 h-1.5 rounded-full bg-white"></span>
              </span>
            </div>
            <div>
              <p class="text-xs font-bold text-stone-800">${step.text}</p>
              <p class="text-[10px] text-stone-400 mt-0.5">${step.time}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Items Detail -->
    <div class="p-4 rounded-2xl bg-white border border-stone-200 mb-4 space-y-3">
      <h4 class="text-xs font-bold uppercase tracking-wider text-stone-900">Rincian Barang</h4>
      ${order.items.map(it => `
        <div class="flex items-center gap-3 py-1">
          <img src="${it.image || (it.product && it.product.image)}" class="w-14 h-14 rounded-xl object-cover bg-stone-50">
          <div class="flex-1">
            <h5 class="text-xs font-bold text-stone-800">${it.name || (it.product && it.product.name)}</h5>
            <p class="text-[11px] text-stone-500">${it.qty} × ${formatIDR(it.price || (it.product && it.product.price))}</p>
          </div>
          <span class="text-xs font-bold text-stone-900">${formatIDR((it.price || (it.product && it.product.price)) * it.qty)}</span>
        </div>
      `).join('')}

      <div class="pt-3 border-t border-stone-100 space-y-1.5 text-xs">
        <div class="flex justify-between text-stone-500">
          <span>Metode Pembayaran</span>
          <span class="font-medium text-stone-800">${order.paymentMethod}</span>
        </div>
        <div class="flex justify-between font-bold text-stone-900 text-sm pt-1">
          <span>Total Pesanan</span>
          <span class="text-[#1E3A2B]">${formatIDR(order.total)}</span>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-2">
      <button onclick="window.print()" class="flex-1 py-3 rounded-full border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center justify-center gap-2">
        <i data-lucide="printer" class="w-4 h-4"></i>
        Cetak Struk
      </button>
      <button onclick="switchView('orders')" class="flex-1 py-3 rounded-full bg-[#1E3A2B] text-white text-xs font-semibold hover:bg-[#15291E]">
        Kembali ke Pesanan
      </button>
    </div>
  `;

  lucide.createIcons();
}

// ----------------------------------------------------
// 7. PENCARIAN REAL-TIME & AUTOCOMPLETE
// ----------------------------------------------------
function handleLiveSearchInput(val) {
  AppState.searchQuery = val.trim();
  const dropdown = document.getElementById('search-dropdown');
  if (!dropdown) return;

  if (AppState.searchQuery.length < 1) {
    dropdown.classList.add('hidden');
    dropdown.innerHTML = '';
    return;
  }

  const q = AppState.searchQuery.toLowerCase();
  const matches = STORE_DATA.products.filter(p => 
    p.name.toLowerCase().includes(q) || 
    p.subtitle.toLowerCase().includes(q) || 
    p.category.toLowerCase().includes(q)
  );

  if (matches.length === 0) {
    dropdown.classList.remove('hidden');
    dropdown.innerHTML = `
      <div class="p-3 text-center text-xs text-stone-500">
        Tidak ditemukan produk dengan kata kunci "<b>${val}</b>"
      </div>
    `;
    return;
  }

  dropdown.classList.remove('hidden');
  dropdown.innerHTML = `
    <div class="p-2 space-y-1">
      ${matches.slice(0, 5).map(m => `
        <div class="flex items-center gap-3 p-2 hover:bg-stone-50 rounded-xl cursor-pointer transition-colors"
             onclick="openProductDetail('${m.id}'); document.getElementById('search-dropdown').classList.add('hidden');">
          <img src="${m.image}" class="w-10 h-10 rounded-lg object-cover">
          <div class="flex-1">
            <h5 class="text-xs font-bold text-stone-900">${m.name}</h5>
            <p class="text-[10px] text-stone-500">${m.subtitle}</p>
          </div>
          <span class="text-xs font-bold text-[#1E3A2B]">${formatIDR(m.price)}</span>
        </div>
      `).join('')}
    </div>
  `;
  lucide.createIcons();
}

// ----------------------------------------------------
// 8. MODAL DETAIL PRODUK LENGKAP (DENGAN ULASAN & VARIAN)
// ----------------------------------------------------
function openProductDetail(productId) {
  const prod = STORE_DATA.products.find(p => p.id === productId);
  if (!prod) return;

  AppState.modalData = {
    product: prod,
    selectedColor: prod.colors ? prod.colors[0] : null,
    selectedSize: prod.sizes ? prod.sizes[0] : null,
    selectedImage: prod.image,
    qty: 1
  };

  const isFav = AppState.wishlist.includes(prod.id);
  const modalContainer = document.getElementById('modal-container');

  modalContainer.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 modal-backdrop"
         onclick="if(event.target === this) closeModal()">
      <div class="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200">
        
        <!-- Modal Top Bar -->
        <div class="sticky top-0 bg-white/95 backdrop-blur-md px-5 py-3.5 border-b border-stone-100 flex items-center justify-between z-20">
          <span class="text-xs uppercase tracking-wider font-bold text-[#1E3A2B]">Detail Produk</span>
          <button onclick="closeModal()" class="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
        </div>

        <!-- Image Main + Gallery Thumbnails -->
        <div class="relative bg-[#F8F7F4]">
          <div class="w-full aspect-square overflow-hidden">
            <img id="detail-main-img" src="${prod.image}" alt="${prod.name}" class="w-full h-full object-cover">
          </div>
          <button class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-stone-600 hover:text-red-500 shadow"
                  onclick="toggleWishlist('${prod.id}'); openProductDetail('${prod.id}')">
            <i data-lucide="heart" class="w-5 h-5 ${isFav ? 'fill-red-500 text-red-500' : ''}"></i>
          </button>

          <!-- Gallery Thumbnails -->
          ${prod.gallery && prod.gallery.length > 1 ? `
            <div class="absolute bottom-3 left-4 flex gap-2 z-10">
              ${prod.gallery.map((img, i) => `
                <img src="${img}" class="w-10 h-10 rounded-lg object-cover border-2 border-white cursor-pointer shadow-sm hover:scale-105 transition-transform"
                     onclick="document.getElementById('detail-main-img').src = '${img}'">
              `).join('')}
            </div>
          ` : ''}
        </div>

        <!-- Info & Details -->
        <div class="p-5 flex-1 space-y-4">
          <div>
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#E4ECE2] text-[#1E3A2B] uppercase">
                ${prod.categoryLabel}
              </span>
              <div class="flex items-center gap-1 text-xs text-stone-600 font-semibold">
                <i data-lucide="star" class="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]"></i>
                <span>${prod.rating.toString().replace('.', ',')} / 5</span>
                <span class="text-stone-400 font-normal">(${prod.ratingCount} ulasan)</span>
              </div>
            </div>
            <h2 class="text-xl font-bold text-[#181A18] mt-2">${prod.name}</h2>
            <p class="text-xs text-[#646864] mt-0.5">${prod.subtitle}</p>
          </div>

          <!-- Price Box & Stock -->
          <div class="p-3.5 bg-[#FAF9F5] rounded-2xl flex items-center justify-between">
            <div>
              <div class="flex items-baseline gap-2">
                <span class="text-2xl font-bold text-[#181A18] tracking-tight">${formatIDR(prod.price)}</span>
                ${prod.originalPrice ? `
                  <span class="text-xs text-stone-400 line-through">${formatIDR(prod.originalPrice)}</span>
                  <span class="text-[10px] font-bold text-[#D9483B] bg-[#FDE8E6] px-1.5 py-0.5 rounded">${prod.discount}</span>
                ` : ''}
              </div>
            </div>
            <span class="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
              Sisa ${prod.stock} barang
            </span>
          </div>

          <!-- Description -->
          <div>
            <h4 class="text-xs font-bold text-[#181A18] uppercase tracking-wide">Deskripsi</h4>
            <p class="text-xs text-stone-600 mt-1 leading-relaxed">${prod.description}</p>
          </div>

          <!-- Color Variants -->
          ${prod.colors && prod.colors.length > 0 ? `
            <div>
              <div class="flex justify-between text-xs mb-1.5">
                <span class="font-bold text-[#181A18] uppercase">Pilihan Warna:</span>
                <span class="text-[#1E3A2B] font-semibold" id="selected-color-label">${prod.colors[0]}</span>
              </div>
              <div class="flex flex-wrap gap-2">
                ${prod.colors.map((c, i) => `
                  <button type="button" 
                          class="px-3.5 py-1.5 text-xs rounded-full border transition-all ${i === 0 ? 'border-[#1E3A2B] bg-[#1E3A2B] text-white font-medium' : 'border-stone-200 text-stone-700 hover:bg-stone-50'}"
                          onclick="selectVariantColor(this, '${c}')">
                    ${c}
                  </button>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Size Variants -->
          ${prod.sizes && prod.sizes.length > 0 ? `
            <div>
              <div class="flex justify-between text-xs mb-1.5">
                <span class="font-bold text-[#181A18] uppercase">Ukuran / Varian:</span>
                <span class="text-[#1E3A2B] font-semibold" id="selected-size-label">${prod.sizes[0]}</span>
              </div>
              <div class="flex flex-wrap gap-2">
                ${prod.sizes.map((s, i) => `
                  <button type="button" 
                          class="px-3.5 py-1.5 text-xs rounded-full border transition-all ${i === 0 ? 'border-[#1E3A2B] bg-[#1E3A2B] text-white font-medium' : 'border-stone-200 text-stone-700 hover:bg-stone-50'}"
                          onclick="selectVariantSize(this, '${s}')">
                    ${s}
                  </button>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Spesifikasi -->
          ${prod.specs ? `
            <div class="pt-2 border-t border-stone-100">
              <h4 class="text-xs font-bold text-[#181A18] uppercase mb-2">Spesifikasi Material</h4>
              <div class="space-y-1.5 text-xs">
                ${prod.specs.map(sp => `
                  <div class="flex justify-between py-1 border-b border-stone-50">
                    <span class="text-stone-500">${sp.label}</span>
                    <span class="font-medium text-stone-800">${sp.val}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Customer Reviews Section -->
          <div class="pt-3 border-t border-stone-100">
            <h4 class="text-xs font-bold text-[#181A18] uppercase mb-2.5">Ulasan Pembeli Terverifikasi</h4>
            <div class="space-y-2.5">
              ${(prod.reviews || []).map(r => `
                <div class="p-3 rounded-xl bg-stone-50 text-xs space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-stone-900">${r.user}</span>
                    <span class="text-[10px] text-stone-400">${r.date}</span>
                  </div>
                  <div class="flex items-center gap-0.5 text-amber-500">
                    ${Array(r.rating).fill('★').join('')}
                  </div>
                  <p class="text-stone-600">${r.comment}</p>
                </div>
              `).join('')}
            </div>

            <!-- Form Tulis Ulasan Sederhana -->
            <div class="mt-3 p-3 rounded-xl border border-stone-200/80 bg-white">
              <label class="block text-[11px] font-bold text-stone-700 mb-1">Beri Ulasan Produk Ini</label>
              <div class="flex gap-2">
                <input type="text" id="review-input-${prod.id}" placeholder="Tulis kepuasanmu..." 
                       class="flex-1 px-3 py-1.5 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-[#1E3A2B]">
                <button onclick="submitReview('${prod.id}')" class="px-3 py-1.5 rounded-lg bg-[#1E3A2B] text-white text-xs font-semibold">
                  Kirim
                </button>
              </div>
            </div>
          </div>

        </div>

        <!-- Sticky Footer CTA -->
        <div class="sticky bottom-0 bg-white border-t border-stone-100 p-4 flex gap-3 z-20 safe-bottom">
          <button onclick="addToCart('${prod.id}', 1); closeModal(); openCartDrawer();" 
                  class="flex-1 py-3 px-4 rounded-full border-2 border-[#1E3A2B] text-[#1E3A2B] text-xs font-bold hover:bg-[#F2F6F1] transition-all flex items-center justify-center gap-2">
            <i data-lucide="shopping-bag" class="w-4 h-4"></i>
            + Keranjang
          </button>
          <button onclick="addToCart('${prod.id}', 1); closeModal(); openCheckoutModal();" 
                  class="flex-1 py-3 px-4 rounded-full bg-[#1E3A2B] text-white text-xs font-bold hover:bg-[#15291E] shadow-md transition-all flex items-center justify-center gap-2">
            Beli Sekarang
            <i data-lucide="arrow-right" class="w-4 h-4"></i>
          </button>
        </div>

      </div>
    </div>
  `;

  AppState.activeModal = 'product-detail';
  lucide.createIcons();
}

function selectVariantColor(btn, color) {
  const parent = btn.parentElement;
  parent.querySelectorAll('button').forEach(b => {
    b.className = 'px-3.5 py-1.5 text-xs rounded-full border border-stone-200 text-stone-700 hover:bg-stone-50 transition-all';
  });
  btn.className = 'px-3.5 py-1.5 text-xs rounded-full border border-[#1E3A2B] bg-[#1E3A2B] text-white font-medium transition-all';
  document.getElementById('selected-color-label').textContent = color;
  if (AppState.modalData) AppState.modalData.selectedColor = color;
}

function selectVariantSize(btn, size) {
  const parent = btn.parentElement;
  parent.querySelectorAll('button').forEach(b => {
    b.className = 'px-3.5 py-1.5 text-xs rounded-full border border-stone-200 text-stone-700 hover:bg-stone-50 transition-all';
  });
  btn.className = 'px-3.5 py-1.5 text-xs rounded-full border border-[#1E3A2B] bg-[#1E3A2B] text-white font-medium transition-all';
  document.getElementById('selected-size-label').textContent = size;
  if (AppState.modalData) AppState.modalData.selectedSize = size;
}

function submitReview(productId) {
  const input = document.getElementById(`review-input-${productId}`);
  if (!input || !input.value.trim()) return;

  const prod = STORE_DATA.products.find(p => p.id === productId);
  if (!prod) return;

  if (!prod.reviews) prod.reviews = [];
  prod.reviews.unshift({
    user: STORE_DATA.userProfile.name,
    rating: 5,
    date: 'Hari ini',
    comment: input.value.trim()
  });

  showToast('Terima kasih! Ulasan Anda telah diterbitkan ⭐');
  openProductDetail(productId);
}

// ----------------------------------------------------
// 9. KERANJANG BELANJA (CART DRAWER)
// ----------------------------------------------------
function openCartDrawer() {
  const modalContainer = document.getElementById('modal-container');
  modalContainer.innerHTML = `
    <div class="fixed inset-0 z-50 flex justify-end modal-backdrop"
         onclick="if(event.target === this) closeModal()">
      <div class="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        <div class="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i data-lucide="shopping-bag" class="w-5 h-5 text-[#1E3A2B]"></i>
            <h3 class="text-sm font-bold text-stone-900">Tas Belanja Saya</h3>
            <span class="text-xs px-2 py-0.5 rounded-full bg-[#EBF1EA] text-[#1E3A2B] font-semibold cart-badge-count">
              ${AppState.cart.reduce((t, i) => t + i.qty, 0)}
            </span>
          </div>
          <button onclick="closeModal()" class="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
        </div>

        <div id="cart-drawer-content" class="flex-1 flex flex-col overflow-hidden">
        </div>
      </div>
    </div>
  `;

  AppState.activeModal = 'cart';
  renderCartDrawer();
  lucide.createIcons();
}

function renderCartDrawer() {
  const calc = getCartCalculations();
  const drawerContent = document.getElementById('cart-drawer-content');
  if (!drawerContent) return;

  if (AppState.cart.length === 0) {
    drawerContent.innerHTML = `
      <div class="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div class="w-20 h-20 rounded-full bg-[#F5F4F0] flex items-center justify-center text-stone-400 mb-4">
          <i data-lucide="shopping-bag" class="w-8 h-8"></i>
        </div>
        <h3 class="text-base font-bold text-stone-800">Tas Belanja Masih Kosong</h3>
        <p class="text-xs text-stone-500 mt-1 max-w-xs">Yuk temukan barang harian favoritmu untuk melengkapi harimu.</p>
        <button onclick="closeModal(); switchView('home');" class="mt-6 px-6 py-2.5 rounded-full bg-[#1E3A2B] text-white text-xs font-semibold hover:bg-[#15291E]">
          Mulai Belanja
        </button>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  drawerContent.innerHTML = `
    <!-- Free Shipping Bar -->
    <div class="p-4 bg-[#EBF1EA] border-b border-[#DDE7DC]">
      <div class="flex items-center justify-between text-xs font-semibold text-[#1E3A2B] mb-1.5">
        <div class="flex items-center gap-1.5">
          <i data-lucide="truck" class="w-4 h-4"></i>
          <span>${calc.isFreeShipping ? '🎉 Selamat! Kamu dapat Gratis Ongkir' : `Kurang ${formatIDR(calc.remainingForFree)} untuk Gratis Ongkir`}</span>
        </div>
        <span>${Math.round(calc.progressPercent)}%</span>
      </div>
      <div class="w-full h-1.5 bg-white/70 rounded-full overflow-hidden">
        <div class="h-full bg-[#1E3A2B] rounded-full transition-all duration-500" style="width: ${calc.progressPercent}%"></div>
      </div>
    </div>

    <!-- Items List -->
    <div class="flex-1 overflow-y-auto p-4 space-y-3.5">
      ${AppState.cart.map(item => `
        <div class="flex gap-3.5 p-3 rounded-2xl bg-[#FAF9F5] border border-stone-100">
          <img src="${item.product.image}" alt="${item.product.name}" class="w-20 h-20 rounded-xl object-cover bg-white">
          <div class="flex-1 flex flex-col justify-between">
            <div>
              <div class="flex items-start justify-between">
                <h4 class="text-xs font-bold text-stone-900 line-clamp-1">${item.product.name}</h4>
                <button onclick="removeFromCart('${item.productId}')" class="text-stone-400 hover:text-red-500 p-0.5">
                  <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                </button>
              </div>
              <p class="text-[11px] text-stone-500">${item.selectedColor ? item.selectedColor : ''} ${item.selectedSize ? '· ' + item.selectedSize : ''}</p>
            </div>

            <div class="flex items-center justify-between mt-2">
              <span class="text-xs font-bold text-[#1E3A2B]">${formatIDR(item.product.price * item.qty)}</span>
              <div class="flex items-center gap-2 bg-white px-2 py-0.5 rounded-full border border-stone-200">
                <button onclick="updateCartQty('${item.productId}', -1)" class="text-stone-500 hover:text-black font-bold text-xs w-4 text-center">−</button>
                <span class="text-xs font-semibold text-stone-800 w-4 text-center">${item.qty}</span>
                <button onclick="updateCartQty('${item.productId}', 1)" class="text-stone-500 hover:text-black font-bold text-xs w-4 text-center">+</button>
              </div>
            </div>
          </div>
        </div>
      `).join('')}

      <!-- Voucher Code -->
      <div class="p-3.5 rounded-2xl bg-white border border-stone-200">
        <label class="block text-[11px] font-bold text-stone-700 uppercase mb-1.5">Gunakan Kode Voucher</label>
        <div class="flex gap-2">
          <input type="text" id="voucher-input" placeholder="Cth: TEMUHEMAT" value="${AppState.appliedVoucher || ''}"
                 class="flex-1 px-3 py-1.5 text-xs rounded-xl border border-stone-200 uppercase tracking-wider focus:outline-none focus:border-[#1E3A2B]">
          <button onclick="applyVoucherCode()" class="px-3.5 py-1.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-black transition-colors">
            Pasang
          </button>
        </div>
        ${AppState.appliedVoucher ? `
          <div class="flex items-center justify-between mt-2 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg">
            <span>Voucher ${AppState.appliedVoucher} Terpasang!</span>
            <button onclick="AppState.appliedVoucher = null; renderCartDrawer();" class="text-stone-400 hover:text-red-500 underline text-[10px]">Hapus</button>
          </div>
        ` : `
          <p class="text-[10px] text-stone-400 mt-1">Kode aktif: <b class="text-stone-600">TEMUHEMAT</b> (10%) & <b class="text-stone-600">DISKON20K</b></p>
        `}
      </div>
    </div>

    <!-- Summary & Checkout Footer -->
    <div class="p-4 bg-white border-t border-stone-100 space-y-2 safe-bottom">
      <div class="space-y-1 text-xs">
        <div class="flex justify-between text-stone-600">
          <span>Subtotal Produk</span>
          <span>${formatIDR(calc.subtotal)}</span>
        </div>
        ${calc.discount > 0 ? `
          <div class="flex justify-between text-emerald-600 font-medium">
            <span>Potongan Voucher</span>
            <span>-${formatIDR(calc.discount)}</span>
          </div>
        ` : ''}
        <div class="flex justify-between text-stone-600">
          <span>Estimasi Ongkir</span>
          <span class="${calc.shippingFee === 0 ? 'text-emerald-700 font-bold' : ''}">
            ${calc.shippingFee === 0 ? 'GRATIS' : formatIDR(calc.shippingFee)}
          </span>
        </div>
        <div class="flex justify-between text-sm font-bold text-stone-900 pt-1.5 border-t border-stone-100">
          <span>Total Pembayaran</span>
          <span class="text-[#1E3A2B]">${formatIDR(calc.total)}</span>
        </div>
      </div>

      <button onclick="closeModal(); openCheckoutModal();" 
              class="w-full py-3.5 rounded-full bg-[#1E3A2B] text-white text-xs font-bold hover:bg-[#15291E] shadow-md transition-all flex items-center justify-center gap-2 mt-2">
        Lanjut ke Checkout (${AppState.cart.reduce((s,i) => s + i.qty, 0)} Barang)
        <i data-lucide="arrow-right" class="w-4 h-4"></i>
      </button>
    </div>
  `;

  lucide.createIcons();
}

// ----------------------------------------------------
// 10. ALUR CHECKOUT & SELESAI PESANAN (TANPA PAYMENT GATEWAY)
// ----------------------------------------------------
function openCheckoutModal() {
  const calc = getCartCalculations();
  const defaultAddr = AppState.addresses.find(a => a.isDefault) || AppState.addresses[0];
  const modalContainer = document.getElementById('modal-container');

  modalContainer.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 modal-backdrop"
         onclick="if(event.target === this) closeModal()">
      <div class="bg-white w-full max-w-xl rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200">
        
        <!-- Header -->
        <div class="sticky top-0 bg-white/95 backdrop-blur-md px-5 py-4 border-b border-stone-100 flex items-center justify-between z-10">
          <div class="flex items-center gap-2">
            <button onclick="openCartDrawer()" class="p-1 -ml-1 text-stone-500 hover:text-black">
              <i data-lucide="chevron-left" class="w-5 h-5"></i>
            </button>
            <h3 class="text-sm font-bold text-stone-900">Checkout Pesanan</h3>
          </div>
          <button onclick="closeModal()" class="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
        </div>

        <div class="p-5 space-y-5 flex-1">
          
          <!-- Alamat Pengiriman -->
          <div class="p-4 rounded-2xl bg-[#FAF9F5] border border-stone-200/80">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2 text-xs font-bold text-[#1E3A2B] uppercase">
                <i data-lucide="map-pin" class="w-4 h-4"></i>
                <span>Alamat Tujuan (${defaultAddr.label})</span>
              </div>
              <button onclick="openAddressBookModal()" class="text-[11px] font-semibold text-[#1E3A2B] hover:underline">
                Ganti Alamat
              </button>
            </div>
            <p class="text-xs font-bold text-stone-900">${defaultAddr.receiver} <span class="font-normal text-stone-500">(${defaultAddr.phone})</span></p>
            <p class="text-xs text-stone-600 mt-1 leading-relaxed">
              ${defaultAddr.street}, Kec. ${defaultAddr.subdistrict}, Kota ${defaultAddr.city}, ${defaultAddr.province} ${defaultAddr.postalCode}
            </p>
          </div>

          <!-- Pilihan Ekspedisi -->
          <div>
            <label class="block text-xs font-bold text-stone-900 uppercase mb-2">Pilih Jasa Pengiriman</label>
            <div class="grid grid-cols-2 gap-2.5">
              ${STORE_DATA.shippingOptions.map(opt => `
                <label class="p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${AppState.shippingMethod === opt.id ? 'border-[#1E3A2B] bg-[#F3F7F2]' : 'border-stone-200 hover:bg-stone-50'}">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-stone-900">${opt.name}</span>
                    <input type="radio" name="shipping" value="${opt.id}" ${AppState.shippingMethod === opt.id ? 'checked' : ''} onchange="setShipping('${opt.id}')" class="accent-[#1E3A2B]">
                  </div>
                  <span class="text-[11px] text-stone-500 mt-1">${opt.desc}</span>
                  <span class="text-xs font-bold text-[#1E3A2B] mt-2">${calc.isFreeShipping ? 'GRATIS' : formatIDR(opt.price)}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <!-- Pilihan Metode Pembayaran (Langsung / COD / Transfer) -->
          <div>
            <label class="block text-xs font-bold text-stone-900 uppercase mb-2">Metode Pembayaran</label>
            <div class="space-y-2">
              
              <!-- COD / Bayar di Tempat -->
              <label class="p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${AppState.paymentMethod === 'cod' ? 'border-[#1E3A2B] bg-[#F3F7F2]' : 'border-stone-200 hover:bg-stone-50'}">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-7 rounded bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center">
                    COD
                  </div>
                  <div>
                    <p class="text-xs font-bold text-stone-900">Bayar di Tempat (COD)</p>
                    <p class="text-[10px] text-stone-500">Bayar tunai ke kurir saat paket sampai di rumah</p>
                  </div>
                </div>
                <input type="radio" name="payment" value="cod" ${AppState.paymentMethod === 'cod' ? 'checked' : ''} onchange="setPayment('cod')" class="accent-[#1E3A2B]">
              </label>

              <!-- QRIS Instan -->
              <label class="p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${AppState.paymentMethod === 'qris' ? 'border-[#1E3A2B] bg-[#F3F7F2]' : 'border-stone-200 hover:bg-stone-50'}">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-7 rounded bg-red-600 text-white font-bold text-[10px] flex items-center justify-center">
                    QRIS
                  </div>
                  <div>
                    <p class="text-xs font-bold text-stone-900">QRIS Instan</p>
                    <p class="text-[10px] text-stone-500">Scan QR Code semua e-wallet & mobile banking</p>
                  </div>
                </div>
                <input type="radio" name="payment" value="qris" ${AppState.paymentMethod === 'qris' ? 'checked' : ''} onchange="setPayment('qris')" class="accent-[#1E3A2B]">
              </label>

              <!-- Transfer Bank Virtual Account -->
              <label class="p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${AppState.paymentMethod === 'bank-transfer' ? 'border-[#1E3A2B] bg-[#F3F7F2]' : 'border-stone-200 hover:bg-stone-50'}">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-7 rounded bg-blue-700 text-white font-bold text-[9px] flex items-center justify-center">
                    TRANSFER
                  </div>
                  <div>
                    <p class="text-xs font-bold text-stone-900">Transfer Bank Otomatis (BCA / Mandiri)</p>
                    <p class="text-[10px] text-stone-500">Verifikasi instan tanpa perlu unggah bukti transfer</p>
                  </div>
                </div>
                <input type="radio" name="payment" value="bank-transfer" ${AppState.paymentMethod === 'bank-transfer' ? 'checked' : ''} onchange="setPayment('bank-transfer')" class="accent-[#1E3A2B]">
              </label>
            </div>
          </div>

          <!-- Catatan Pembeli -->
          <div>
            <label class="block text-xs font-bold text-stone-900 uppercase mb-1">Catatan untuk Penjual (Opsional)</label>
            <input type="text" id="order-notes" placeholder="Cth: Tolong packing dengan kardus tebal..." 
                   class="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#1E3A2B]">
          </div>

          <!-- Ringkasan Tagihan -->
          <div class="p-4 rounded-2xl bg-[#FAF9F5] border border-stone-200 space-y-1.5 text-xs">
            <h4 class="font-bold text-stone-900 uppercase text-[11px] mb-2">Ringkasan Tagihan</h4>
            <div class="flex justify-between text-stone-600">
              <span>Total Harga (${AppState.cart.reduce((s,i) => s + i.qty, 0)} barang)</span>
              <span>${formatIDR(calc.subtotal)}</span>
            </div>
            ${calc.discount > 0 ? `
              <div class="flex justify-between text-emerald-600 font-medium">
                <span>Diskon Promo (${AppState.appliedVoucher})</span>
                <span>-${formatIDR(calc.discount)}</span>
              </div>
            ` : ''}
            <div class="flex justify-between text-stone-600">
              <span>Ongkos Kirim (${calc.courier.name})</span>
              <span>${calc.shippingFee === 0 ? 'GRATIS' : formatIDR(calc.shippingFee)}</span>
            </div>
            <div class="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
              <span>Total Akhir</span>
              <span class="text-[#1E3A2B] text-base">${formatIDR(calc.total)}</span>
            </div>
          </div>

        </div>

        <!-- Sticky Footer Action -->
        <div class="sticky bottom-0 bg-white border-t border-stone-100 p-4 safe-bottom">
          <button onclick="confirmAndPlaceOrder()" 
                  class="w-full py-3.5 rounded-full bg-[#1E3A2B] text-white text-xs font-bold hover:bg-[#15291E] shadow-md transition-all flex items-center justify-center gap-2">
            Konfirmasi & Buat Pesanan (${formatIDR(calc.total)})
            <i data-lucide="check-circle" class="w-4 h-4"></i>
          </button>
        </div>

      </div>
    </div>
  `;

  AppState.activeModal = 'checkout';
  lucide.createIcons();
}

function setShipping(method) {
  AppState.shippingMethod = method;
  openCheckoutModal();
}

function setPayment(method) {
  AppState.paymentMethod = method;
  openCheckoutModal();
}

// Eksekusi Pembuatan Pesanan Langsung Jadi (100% Selesai)
function confirmAndPlaceOrder() {
  const calc = getCartCalculations();
  const defaultAddr = AppState.addresses.find(a => a.isDefault) || AppState.addresses[0];
  const orderId = 'TEMU-' + Math.floor(100000 + Math.random() * 900000);
  const resi = 'JNE-' + defaultAddr.city.substring(0, 3).toUpperCase() + '-' + Math.floor(100000 + Math.random() * 900000);

  const newOrder = {
    id: orderId,
    date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    status: 'Diproses',
    statusCode: 'processing',
    courier: `${calc.courier.name} (Resi: ${resi})`,
    destinationCity: defaultAddr.city,
    shippingFee: calc.shippingFee,
    total: calc.total,
    paymentMethod: AppState.paymentMethod === 'cod' ? 'Bayar di Tempat (COD)' : (AppState.paymentMethod === 'qris' ? 'QRIS Instan' : 'Transfer Bank Otomatis'),
    items: AppState.cart.map(item => ({
      productId: item.productId,
      name: item.product.name,
      subtitle: item.product.subtitle,
      price: item.product.price,
      qty: item.qty,
      image: item.product.image
    })),
    timeline: [
      { time: 'Hari ini, Baru saja', text: 'Pesanan berhasil dikonfirmasi dan masuk ke sistem toko' },
      { time: 'Hari ini', text: `Gudang Temu Surabaya sedang menyiapkan & mempacking pesanan` }
    ]
  };

  // Simpan pesanan ke riwayat
  AppState.orders.unshift(newOrder);

  // Kosongkan keranjang
  AppState.cart = [];
  AppState.appliedVoucher = null;
  persistState();

  // Tampilkan modal sukses
  const modalContainer = document.getElementById('modal-container');
  modalContainer.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
      <div class="bg-white w-full max-w-md rounded-3xl p-6 text-center shadow-2xl animate-in zoom-in-95 duration-200">
        
        <div class="w-16 h-16 rounded-full bg-[#EBF1EA] text-[#1E3A2B] flex items-center justify-center mx-auto mb-4">
          <i data-lucide="check" class="w-8 h-8 stroke-[3]"></i>
        </div>

        <h3 class="text-lg font-bold text-stone-900">Pesanan Berhasil Dibuat!</h3>
        <p class="text-xs text-stone-500 mt-1">Nomor pesanan Anda telah diterbitkan. Paket sedang disiapkan oleh tim gudang kami.</p>

        <!-- Ringkasan Box -->
        <div class="my-5 p-4 rounded-2xl bg-[#FAF9F5] border border-stone-200/80 text-left text-xs space-y-2">
          <div class="flex justify-between border-b border-stone-200/60 pb-2">
            <span class="text-stone-500">Nomor Pesanan</span>
            <span class="font-mono font-bold text-stone-800">${newOrder.id}</span>
          </div>
          <div class="flex justify-between border-b border-stone-200/60 pb-2">
            <span class="text-stone-500">Tujuan</span>
            <span class="font-medium text-stone-800">${newOrder.destinationCity}</span>
          </div>
          <div class="flex justify-between border-b border-stone-200/60 pb-2">
            <span class="text-stone-500">Metode</span>
            <span class="font-medium text-stone-800">${newOrder.paymentMethod}</span>
          </div>
          <div class="flex justify-between pt-1 font-bold">
            <span class="text-stone-700">Total Pembayaran</span>
            <span class="text-[#1E3A2B]">${formatIDR(newOrder.total)}</span>
          </div>
        </div>

        <div class="flex gap-2.5">
          <button onclick="closeModal(); switchView('order-detail', { orderId: '${newOrder.id}' });" 
                  class="flex-1 py-3 rounded-full bg-[#1E3A2B] text-white text-xs font-bold hover:bg-[#15291E]">
            Lacak Pengiriman
          </button>
          <button onclick="closeModal(); switchView('home');" 
                  class="px-5 py-3 rounded-full border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50">
            Beranda
          </button>
        </div>

      </div>
    </div>
  `;

  AppState.activeModal = 'order-success';
  lucide.createIcons();
}

// ----------------------------------------------------
// 11. BUKU ALAMAT (ADDRESS BOOK MANAGEMENT)
// ----------------------------------------------------
function openAddressBookModal() {
  const modalContainer = document.getElementById('modal-container');
  modalContainer.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 modal-backdrop"
         onclick="if(event.target === this) closeModal()">
      <div class="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto flex flex-col shadow-2xl">
        
        <div class="p-4 border-b border-stone-100 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i data-lucide="map-pin" class="w-4 h-4 text-[#1E3A2B]"></i>
            <h3 class="text-xs font-bold uppercase tracking-wider text-stone-900">Buku Alamat Pengiriman</h3>
          </div>
          <button onclick="closeModal()" class="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
            <i data-lucide="x" class="w-3.5 h-3.5"></i>
          </button>
        </div>

        <div class="p-4 space-y-3 flex-1 overflow-y-auto">
          ${AppState.addresses.map(a => `
            <div class="p-3.5 rounded-2xl border transition-all ${a.isDefault ? 'border-[#1E3A2B] bg-[#F7FAF6]' : 'border-stone-200 bg-white'}">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-bold text-stone-900">${a.label}</span>
                ${a.isDefault ? `
                  <span class="text-[10px] font-bold bg-[#1E3A2B] text-white px-2 py-0.5 rounded-full">Utama</span>
                ` : `
                  <button onclick="setDefaultAddress('${a.id}')" class="text-[11px] text-stone-500 hover:text-[#1E3A2B] underline">Jadikan Utama</button>
                `}
              </div>
              <p class="text-xs font-semibold text-stone-800">${a.receiver} (${a.phone})</p>
              <p class="text-xs text-stone-600 mt-1">${a.street}, Kec. ${a.subdistrict}, ${a.city}, ${a.province} ${a.postalCode}</p>
            </div>
          `).join('')}

          <!-- Form Tambah Alamat Baru -->
          <div class="pt-3 border-t border-stone-100">
            <h4 class="text-xs font-bold text-stone-900 mb-2">+ Tambah Alamat Baru</h4>
            <div class="space-y-2 text-xs">
              <input type="text" id="new-addr-label" placeholder="Label Alamat (Cth: Rumah / Kantor / Kos)" class="w-full px-3 py-2 border rounded-xl">
              <input type="text" id="new-addr-receiver" placeholder="Nama Penerima" class="w-full px-3 py-2 border rounded-xl">
              <input type="text" id="new-addr-phone" placeholder="Nomor Telepon / WhatsApp" class="w-full px-3 py-2 border rounded-xl">
              <textarea id="new-addr-street" placeholder="Alamat Lengkap (Nama Jalan, Nomor, RT/RW)" class="w-full px-3 py-2 border rounded-xl h-16"></textarea>
              <div class="grid grid-cols-2 gap-2">
                <input type="text" id="new-addr-subdistrict" placeholder="Kecamatan" class="w-full px-3 py-2 border rounded-xl">
                <select id="new-addr-city" class="w-full px-3 py-2 border rounded-xl bg-white">
                  ${STORE_DATA.cities.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
                </select>
              </div>
              <button onclick="saveNewAddress()" class="w-full py-2.5 rounded-xl bg-[#1E3A2B] text-white font-semibold mt-1">
                Simpan Alamat
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;

  AppState.activeModal = 'address-book';
  lucide.createIcons();
}

function setDefaultAddress(id) {
  AppState.addresses.forEach(a => a.isDefault = (a.id === id));
  const newDef = AppState.addresses.find(a => a.id === id);
  if (newDef) {
    AppState.selectedCity = newDef.city;
    const label = document.getElementById('location-city-label');
    if (label) label.textContent = newDef.city;
  }
  persistState();
  openAddressBookModal();
  showToast('Alamat utama berhasil diperbarui');
}

function saveNewAddress() {
  const label = document.getElementById('new-addr-label').value.trim() || 'Alamat Baru';
  const receiver = document.getElementById('new-addr-receiver').value.trim() || STORE_DATA.userProfile.name;
  const phone = document.getElementById('new-addr-phone').value.trim() || STORE_DATA.userProfile.phone;
  const street = document.getElementById('new-addr-street').value.trim();
  const subdistrict = document.getElementById('new-addr-subdistrict').value.trim() || 'Pusat';
  const city = document.getElementById('new-addr-city').value;

  if (!street) {
    showToast('Mohon lengkapi alamat jalan', 'error');
    return;
  }

  const newId = 'addr-' + Date.now();
  AppState.addresses.push({
    id: newId,
    label: label,
    receiver: receiver,
    phone: phone,
    street: street,
    subdistrict: subdistrict,
    city: city,
    province: 'Jawa Timur',
    postalCode: '60189',
    isDefault: false
  });

  persistState();
  openAddressBookModal();
  showToast('Alamat baru berhasil ditambahkan! 🏡');
}

// ----------------------------------------------------
// 12. MODAL PUSAT BANTUAN & KOTA
// ----------------------------------------------------
function openCityModal() {
  const modalContainer = document.getElementById('modal-container');
  modalContainer.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 modal-backdrop"
         onclick="if(event.target === this) closeModal()">
      <div class="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-3xl max-h-[80vh] overflow-y-auto flex flex-col shadow-2xl">
        <div class="p-4 border-b border-stone-100 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i data-lucide="map-pin" class="w-4 h-4 text-[#1E3A2B]"></i>
            <h3 class="text-xs font-bold uppercase tracking-wider text-stone-900">Pilih Kota Pengiriman</h3>
          </div>
          <button onclick="closeModal()" class="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
            <i data-lucide="x" class="w-3.5 h-3.5"></i>
          </button>
        </div>

        <div class="p-3 divide-y divide-stone-100">
          ${STORE_DATA.cities.map(c => `
            <button onclick="selectDeliveryCity('${c.name}')" 
                    class="w-full px-3 py-3 flex items-center justify-between text-left hover:bg-[#F5F8F4] rounded-xl transition-colors">
              <div>
                <p class="text-xs font-semibold ${c.name === AppState.selectedCity ? 'text-[#1E3A2B]' : 'text-stone-800'}">${c.name}</p>
                <p class="text-[10px] text-stone-500">${c.province} · Estimasi ${c.eta}</p>
              </div>
              ${c.name === AppState.selectedCity ? `
                <i data-lucide="check" class="w-4 h-4 text-[#1E3A2B]"></i>
              ` : ''}
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  AppState.activeModal = 'city-selector';
  lucide.createIcons();
}

function selectDeliveryCity(cityName) {
  AppState.selectedCity = cityName;
  persistState();
  const label = document.getElementById('location-city-label');
  if (label) label.textContent = cityName;
  closeModal();
  showToast(`Tujuan pengiriman diperbarui ke ${cityName} 📍`);
}

function openHelpCenter() {
  const modalContainer = document.getElementById('modal-container');
  modalContainer.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 modal-backdrop"
         onclick="if(event.target === this) closeModal()">
      <div class="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto flex flex-col shadow-2xl">
        <div class="p-4 border-b border-stone-100 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i data-lucide="headphones" class="w-4 h-4 text-[#1E3A2B]"></i>
            <h3 class="text-xs font-bold uppercase tracking-wider text-stone-900">Pusat Bantuan & Layanan</h3>
          </div>
          <button onclick="closeModal()" class="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
            <i data-lucide="x" class="w-3.5 h-3.5"></i>
          </button>
        </div>

        <div class="p-5 space-y-4 text-xs">
          <div>
            <h4 class="font-bold text-stone-900 mb-1">📦 Syarat Gratis Ongkir</h4>
            <p class="text-stone-600 leading-relaxed">Gratis ongkir berlaku untuk seluruh pengiriman ke kota besar di Indonesia dengan minimum belanja Rp150.000.</p>
          </div>

          <div>
            <h4 class="font-bold text-stone-900 mb-1">🔄 Kebijakan Retur 7 Hari</h4>
            <p class="text-stone-600 leading-relaxed">Jika produk tidak sesuai, cacat, atau salah ukuran, Anda dapat mengajukan penukaran atau pengembalian dana penuh dalam waktu 7 hari setelah barang diterima.</p>
          </div>

          <div>
            <h4 class="font-bold text-stone-900 mb-1">💳 Keamanan Belanja</h4>
            <p class="text-stone-600 leading-relaxed">Seluruh proses belanja dan data pribadi Anda tersimpan secara privat dan aman.</p>
          </div>

          <div class="pt-3 border-t border-stone-100">
            <button onclick="showToast('Menghubungkan ke Tim Layanan Pelanggan WhatsApp Temu...'); closeModal();" 
                    class="w-full py-3 rounded-full bg-emerald-700 text-white font-semibold flex items-center justify-center gap-2 hover:bg-emerald-800">
              <i data-lucide="message-circle" class="w-4 h-4"></i>
              Hubungi CS via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  AppState.activeModal = 'help';
  lucide.createIcons();
}

function openNotifications() {
  showToast('Tidak ada notifikasi baru hari ini');
}

function openStoryDetail(storyId) {
  const story = STORE_DATA.collections.find(c => c.id === storyId);
  if (!story) return;

  const modalContainer = document.getElementById('modal-container');
  modalContainer.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 modal-backdrop"
         onclick="if(event.target === this) closeModal()">
      <div class="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[88vh] overflow-y-auto flex flex-col shadow-2xl">
        <div class="relative w-full aspect-[16/10] bg-stone-100">
          <img src="${story.image}" alt="${story.title}" class="w-full h-full object-cover">
          <button onclick="closeModal()" class="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-stone-700 shadow">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
        </div>

        <div class="p-6 space-y-4">
          <span class="text-[11px] font-bold text-[#1E3A2B] uppercase tracking-wider bg-[#E4ECE2] px-2.5 py-1 rounded-full">
            ${story.tag}
          </span>
          <h2 class="text-xl font-bold text-[#181A18]">${story.title}</h2>
          <p class="text-xs text-stone-600 leading-relaxed">${story.description}</p>
          
          <div class="pt-4 border-t border-stone-100 flex items-center justify-between">
            <span class="text-xs text-stone-500">${story.productCount} Produk dalam kurasi ini</span>
            <button onclick="closeModal(); switchView('category', { categoryId: 'rumah' });"
                    class="px-5 py-2.5 rounded-full bg-[#1E3A2B] text-white text-xs font-semibold hover:bg-[#15291E]">
              Lihat Koleksi
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  AppState.activeModal = 'story';
  lucide.createIcons();
}

function closeModal() {
  const modalContainer = document.getElementById('modal-container');
  if (modalContainer) modalContainer.innerHTML = '';
  AppState.activeModal = null;
}

// Inisialisasi saat window dimuat
window.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  renderFlashSaleSection();
  renderCuratedSection();
  updateBadges();

  const cityLabel = document.getElementById('location-city-label');
  if (cityLabel) cityLabel.textContent = AppState.selectedCity;

  // Search input live handler
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      handleLiveSearchInput(e.target.value);
    });
  }

  lucide.createIcons();
});
