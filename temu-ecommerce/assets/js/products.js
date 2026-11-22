// Basis Data Katalog Lengkap Temu E-Commerce
const STORE_DATA = {
  brand: {
    name: "temu",
    tagline: "Konsep toko lifestyle sehari-hari",
    copyright: "© 2026 Temu · Konsep toko lifestyle sehari-hari",
    promoPeriod: "2–8 November 2026 · Produk pilihan",
    freeShippingThreshold: 150000,
    currentCity: "Surabaya"
  },

  cities: [
    { id: "sby", name: "Surabaya", province: "Jawa Timur", eta: "1-2 hari", postalCode: "60189" },
    { id: "jkt", name: "Jakarta", province: "DKI Jakarta", eta: "1-2 hari", postalCode: "10110" },
    { id: "bdg", name: "Bandung", province: "Jawa Barat", eta: "2-3 hari", postalCode: "40115" },
    { id: "smg", name: "Semarang", province: "Jawa Tengah", eta: "1-2 hari", postalCode: "50134" },
    { id: "ygy", name: "Yogyakarta", province: "DI Yogyakarta", eta: "1-2 hari", postalCode: "55221" },
    { id: "mlg", name: "Malang", province: "Jawa Timur", eta: "1 hari", postalCode: "65111" },
    { id: "dps", name: "Denpasar", province: "Bali", eta: "2-3 hari", postalCode: "80111" },
    { id: "mdn", name: "Medan", province: "Sumatera Utara", eta: "3-4 hari", postalCode: "20111" },
    { id: "mks", name: "Makassar", province: "Sulawesi Selatan", eta: "3-4 hari", postalCode: "90111" }
  ],

  shippingOptions: [
    { id: "jne", name: "JNE Reguler", desc: "Layanan reguler andal", price: 15000, eta: "1-2 hari" },
    { id: "sicepat", name: "SiCepat BEST", desc: "Besok sampai tujuan", price: 18000, eta: "1 hari" },
    { id: "jnt", name: "J&T Express", desc: "Pengiriman cepat setiap hari", price: 16000, eta: "1-2 hari" },
    { id: "gosend", name: "GoSend Instant", desc: "Langsung sampai dalam 2-3 jam", price: 25000, eta: "2-3 jam" }
  ],

  vouchers: [
    { code: "TEMUHEMAT", type: "percent", value: 10, minSpend: 50000, desc: "Diskon 10% untuk semua produk" },
    { code: "GRATISONGKIR", type: "shipping", value: 15000, minSpend: 100000, desc: "Potongan ongkos kirim Rp15.000" },
    { code: "DISKON20K", type: "nominal", value: 20000, minSpend: 150000, desc: "Potongan langsung Rp20.000" }
  ],

  categories: [
    {
      id: "fashion",
      name: "Fashion",
      icon: "shirt",
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
      description: "Pakaian bernapas dari bahan katun dan serat linen murni bersahaja."
    },
    {
      id: "rumah",
      name: "Rumah",
      icon: "sofa",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
      description: "Perabot dan dekorasi rumah bernuansa hangat untuk ketenangan istirahat."
    },
    {
      id: "aksesori",
      name: "Aksesori",
      icon: "footprints",
      image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=600&q=80",
      description: "Pelengkap gaya minimalis dengan ketahanan maksimal untuk mobilitas."
    },
    {
      id: "dapur",
      name: "Dapur",
      icon: "utensils",
      image: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=600&q=80",
      description: "Peralatan masak dan wadah keramik untuk sajian santapan hangat keluarga."
    },
    {
      id: "tas",
      name: "Tas",
      icon: "briefcase",
      image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80",
      description: "Tas jinjing dan ransel kanvas tebal untuk menampung seluruh kebutuhanmu."
    },
    {
      id: "aktivitas",
      name: "Aktivitas",
      icon: "activity",
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80",
      description: "Tumbler insulasi dan perlengkapan penunjang aktivitas produktif di luar rumah."
    }
  ],

  // Seluruh Katalog Produk (Termasuk 8 Produk Utama dari Dokumen PDF + Produk Tambahan)
  products: [
    // 1. Flash Sale 1 (PDF)
    {
      id: "p1",
      name: "Tote Kanvas Everyday",
      subtitle: "Olive · Kanvas tebal",
      category: "tas",
      categoryLabel: "Tas",
      price: 89000,
      originalPrice: 129000,
      discount: "-31%",
      rating: 4.8,
      ratingCount: 142,
      soldCount: 389,
      stock: 18,
      isFlashSale: true,
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=800&q=80"
      ],
      description: "Tote bag kanvas tebal 14oz yang awet, ramah lingkungan, dengan kompartemen luas yang muat laptop hingga 14 inci, buku catatan, botol minum, dan barang harian Anda. Dilengkapi kancing magnet serta saku ritsleting rahasia.",
      colors: ["Olive", "Sand", "Natural Ecru", "Charcoal"],
      sizes: ["Standard (38 x 40 cm)"],
      specs: [
        { label: "Bahan", val: "100% Kanvas Katun Tebal 14oz" },
        { label: "Dimensi", val: "38 cm x 40 cm x 10 cm" },
        { label: "Kapasitas", val: "Hingga 15 Liter" },
        { label: "Penutup", val: "Kancing magnetik & saku ritsleting dalam YKK" }
      ],
      reviews: [
        { user: "Rara Anindya", rating: 5, date: "18 Nov 2026", comment: "Bahan kanvasnya benar-benar tebal dan jahitan rapi sekali. Muat laptop 14 inch dengan aman." },
        { user: "Budi Santoso", rating: 5, date: "15 Nov 2026", comment: "Warna olive sangat elegan, senada dengan gaya kasual kantor harian saya." }
      ]
    },

    // 2. Flash Sale 2 (PDF)
    {
      id: "p2",
      name: "Mug Keramik Nala",
      subtitle: "Ivory · 350 ml",
      category: "dapur",
      categoryLabel: "Dapur",
      price: 59000,
      originalPrice: 79000,
      discount: "-25%",
      rating: 4.9,
      ratingCount: 215,
      soldCount: 520,
      stock: 35,
      isFlashSale: true,
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=800&q=80"
      ],
      description: "Cangkir keramik berlapis matte glasir lembut. Nyaman digenggam untuk kopi pagi atau teh hangat sore hari. Tahan panas microwave dan mesin pencuci piring.",
      colors: ["Ivory", "Soft Sage", "Warm Oat"],
      sizes: ["350 ml"],
      specs: [
        { label: "Material", val: "Keramik Stoneware Berkualitas Tinggi" },
        { label: "Kapasitas", val: "350 ml" },
        { label: "Finishing", val: "Matte Glaze Food-grade Aman Konsumsi" },
        { label: "Ketahanan", val: "Microwave & Dishwasher Safe" }
      ],
      reviews: [
        { user: "Siti Rahma", rating: 5, date: "19 Nov 2026", comment: "Tekstur doff nya sangat nyaman dipegang, kopi jadi terasa lebih nikmat." }
      ]
    },

    // 3. Flash Sale 3 (PDF)
    {
      id: "p3",
      name: "Kemeja Linen Rileks",
      subtitle: "Ivory · S–XL",
      category: "fashion",
      categoryLabel: "Fashion",
      price: 149000,
      originalPrice: 199000,
      discount: "-25%",
      rating: 4.8,
      ratingCount: 98,
      soldCount: 210,
      stock: 12,
      isFlashSale: true,
      image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80"
      ],
      description: "Kemeja lengan pendek berpotongan santai dari serat linen murni. Adem, menyerap keringat dengan sangat baik, dan memberikan tampilan kasual elegan yang tak lekang oleh waktu.",
      colors: ["Ivory", "Sage Green", "Charcoal Gray"],
      sizes: ["S", "M", "L", "XL"],
      specs: [
        { label: "Bahan", val: "Pure Blended Linen 100%" },
        { label: "Kerah", val: "Camp Collar / Kerah Terbuka Rileks" },
        { label: "Kancing", val: "Batok Kelapa Alami Ramah Lingkungan" },
        { label: "Perawatan", val: "Cuci air dingin, jemur di tempat teduh" }
      ],
      reviews: [
        { user: "Eko Pratama", rating: 5, date: "12 Nov 2026", comment: "Kualitas linen asli, adem dipakai di cuaca Surabaya yang panas." }
      ]
    },

    // 4. Flash Sale 4 (PDF)
    {
      id: "p4",
      name: "Botol Minum Daily",
      subtitle: "Sage · 500 ml",
      category: "aktivitas",
      categoryLabel: "Aktivitas",
      price: 99000,
      originalPrice: 139000,
      discount: "-29%",
      rating: 4.7,
      ratingCount: 88,
      soldCount: 195,
      stock: 24,
      isFlashSale: true,
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80"
      ],
      description: "Tumbler insulasi berdinding ganda (double-wall vacuum). Menjaga minuman dingin hingga 24 jam dan panas hingga 12 jam tanpa embun di bagian luar botol.",
      colors: ["Sage Green", "Ivory White", "Matte Black"],
      sizes: ["500 ml"],
      specs: [
        { label: "Material", val: "Stainless Steel 304 Food Grade Anti Karat" },
        { label: "Insulasi", val: "Double-wall vacuum insulation" },
        { label: "Tutup", val: "Leak-proof dengan pegangan ergonomis" }
      ],
      reviews: [
        { user: "Fiona Tan", rating: 5, date: "10 Nov 2026", comment: "Es batu masih utuh setelah 18 jam! Desainnya juga sangat minimalis estetik." }
      ]
    },

    // 5. Pilihan Keseharian 1 (PDF)
    {
      id: "p5",
      name: "Keranjang Rotan Rapi",
      subtitle: "Natural · 30 × 20 cm",
      category: "rumah",
      categoryLabel: "Rumah",
      price: 119000,
      originalPrice: null,
      discount: null,
      rating: 4.8,
      ratingCount: 167,
      soldCount: 412,
      stock: 14,
      isFlashSale: false,
      image: "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=600&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=800&q=80"
      ],
      description: "Anyaman rotan alami karya perajin lokal untuk menyimpan selimut, handuk, majalah, atau perlengkapan kamar mandi dengan sentuhan estetika organik alami.",
      colors: ["Natural", "Honey Bleached"],
      sizes: ["30 × 20 × 18 cm"],
      specs: [
        { label: "Material", val: "Rotan Alami Indonesia Pilihan" },
        { label: "Anyaman", val: "Handmade Woven Tradisional" },
        { label: "Finishing", val: "Eco-friendly Waterbased Clear Coat" }
      ],
      reviews: [
        { user: "Dewi Lestari", rating: 5, date: "14 Nov 2026", comment: "Anyamannya rapi sekali dan tidak ada serat tajam. Ruang tamu jadi keliatan hangat." }
      ]
    },

    // 6. Pilihan Keseharian 2 (PDF)
    {
      id: "p6",
      name: "Sandal Santai Dua Tali",
      subtitle: "Tan · 36–41",
      category: "aksesori",
      categoryLabel: "Aksesori",
      price: 129000,
      originalPrice: null,
      discount: null,
      rating: 4.7,
      ratingCount: 124,
      soldCount: 330,
      stock: 20,
      isFlashSale: false,
      image: "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=600&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=800&q=80"
      ],
      description: "Sandal slide dua tali dengan insole empuk anatomis berbahan gabus sintetis yang menopang telapak kaki untuk kenyamanan berjalan santai seharian penuh.",
      colors: ["Tan & Ivory", "All Black", "Olive Earth"],
      sizes: ["36", "37", "38", "39", "40", "41"],
      specs: [
        { label: "Upper", val: "Soft Vegan Leather / Linen Strap" },
        { label: "Footbed", val: "Ergonomic Cushion Cork Sole" },
        { label: "Outsole", val: "Anti-slip Rubber TPR" }
      ],
      reviews: [
        { user: "Nadya Putri", rating: 5, date: "16 Nov 2026", comment: "Bantalannya sangat empuk, tidak bikin lecet sama sekali saat dipakai jalan lama." }
      ]
    },

    // 7. Pilihan Keseharian 3 (PDF)
    {
      id: "p7",
      name: "Lampu Meja Senja",
      subtitle: "Oak · Cahaya hangat",
      category: "rumah",
      categoryLabel: "Rumah",
      price: 229000,
      originalPrice: null,
      discount: null,
      rating: 4.9,
      ratingCount: 76,
      soldCount: 180,
      stock: 8,
      isFlashSale: false,
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80"
      ],
      description: "Lampu meja dengan kaki kayu oak solid dan tudung kain linen bertekstur. Memancarkan cahaya temaram 2700K yang menenangkan untuk meja kerja atau nakas samping tempat tidur.",
      colors: ["Oak Wood & Cream Shade", "Walnut & Sand Shade"],
      sizes: ["Tinggi 32 cm"],
      specs: [
        { label: "Basis", val: "Kayu Oak Solid Bersertifikasi" },
        { label: "Tudung", val: "Kain Linen Natural Fabric" },
        { label: "Bohlam", val: "LED E27 Warm White 5W (Termasuk)" }
      ],
      reviews: [
        { user: "Hendra Wijaya", rating: 5, date: "17 Nov 2026", comment: "Cahayanya lembut banget, sangat pas untuk lampu tidur dan membaca buku malam hari." }
      ]
    },

    // 8. Pilihan Keseharian 4 (PDF)
    {
      id: "p8",
      name: "Pouch Kanvas Serbaguna",
      subtitle: "Sand · 22 × 15 cm",
      category: "aksesori",
      categoryLabel: "Aksesori",
      price: 49000,
      originalPrice: null,
      discount: null,
      rating: 4.8,
      ratingCount: 203,
      soldCount: 540,
      stock: 40,
      isFlashSale: false,
      image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80"
      ],
      description: "Pouch serbaguna berukuran kompak untuk alat tulis, kosmetik, kabel charger, dan barang kecil lainnya agar tas Anda selalu rapi tertata.",
      colors: ["Sand", "Olive", "Mustard", "Ivory"],
      sizes: ["22 × 15 cm"],
      specs: [
        { label: "Material", val: "Katun Kanvas 12oz" },
        { label: "Ritsleting", val: "YKK Metal Zipper Brass" },
        { label: "Lapisan", val: "Water-repellent Furing Lining" }
      ],
      reviews: [
        { user: "Anita Salim", rating: 5, date: "18 Nov 2026", comment: "Simpel, fungsional, dan resletingnya licin tidak seret. Suka sekali!" }
      ]
    },

    // Produk Tambahan Fashion
    {
      id: "p9",
      name: "Kaos Katun Polos Organik",
      subtitle: "Putih Bersih · Katun Combed 24s",
      category: "fashion",
      categoryLabel: "Fashion",
      price: 79000,
      originalPrice: 99000,
      discount: "-20%",
      rating: 4.9,
      ratingCount: 310,
      soldCount: 890,
      stock: 50,
      isFlashSale: false,
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
      ],
      description: "Kaos oblong polos dari katun combed 24s organik bersertifikasi. Halus di kulit, tidak menerawang, dan mempertahankan bentuk meski dicuci berulang kali.",
      colors: ["White", "Charcoal", "Sage Green", "Oatmeal"],
      sizes: ["S", "M", "L", "XL", "XXL"],
      specs: [
        { label: "Bahan", val: "100% Organic Cotton 24s" },
        { label: "Jahitan", val: "Rantai Standar Ekspor Tiga Jarum" },
        { label: "Potongan", val: "Regular Fit Unisex" }
      ],
      reviews: [
        { user: "Arief H.", rating: 5, date: "20 Nov 2026", comment: "Kaos ternyaman yang pernah saya beli. Bahannya tebal tapi tidak gerah." }
      ]
    },

    // Produk Tambahan Rumah
    {
      id: "p10",
      name: "Sofa Minimalis Lumut",
      subtitle: "Olive · 2 Seater Nyaman",
      category: "rumah",
      categoryLabel: "Rumah",
      price: 1850000,
      originalPrice: 2200000,
      discount: "-16%",
      rating: 4.9,
      ratingCount: 42,
      soldCount: 85,
      stock: 5,
      isFlashSale: false,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80"
      ],
      description: "Sofa 2 dudukan dengan bantalan busa berdensitas tinggi dilapisi kain tenun tahan gores bernuansa hijau zaitun alami. Rangka kayu jati solid kokoh.",
      colors: ["Olive Green", "Warm Sand", "Oatmeal Grey"],
      sizes: ["160 x 85 x 78 cm"],
      specs: [
        { label: "Rangka", val: "Kayu Jati Solid & Plywood Meranti" },
        { label: "Busa", val: "High-Resilience Density 32" },
        { label: "Kain", val: "Linen-Blended Textured Weave" }
      ],
      reviews: [
        { user: "Maya K.", rating: 5, date: "11 Nov 2026", comment: "Sangat kokoh dan estetik! Ruang tamu langsung keliatan seperti di majalah arsitektur." }
      ]
    },

    // Produk Tambahan Dapur
    {
      id: "p11",
      name: "Set Spatula Stainless Alami",
      subtitle: "Set 4 Pcs · Gagang Kayu Mahoni",
      category: "dapur",
      categoryLabel: "Dapur",
      price: 135000,
      originalPrice: 175000,
      discount: "-23%",
      rating: 4.8,
      ratingCount: 118,
      soldCount: 290,
      stock: 22,
      isFlashSale: false,
      image: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=600&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80"
      ],
      description: "Set peralatan masak esensial berisi sutil berlubang, sendok sup, capit masak, dan sendok saji dari baja tahan karat 304 dengan pegangan kayu mahoni ergonomis.",
      colors: ["Stainless & Mahoni"],
      sizes: ["Set 4 Buah"],
      specs: [
        { label: "Baja", val: "SUS 304 Food-Grade Anti Karat" },
        { label: "Pegangan", val: "Kayu Mahoni Terinsulasi Panas" }
      ],
      reviews: [
        { user: "Rudi H.", rating: 5, date: "09 Nov 2026", comment: "Tidak gampang panas dan sangat kokoh saat membalik daging panggang." }
      ]
    },

    // Produk Tambahan Tas
    {
      id: "p12",
      name: "Tas Bahu Minimalis Kulit Vegan",
      subtitle: "Hitam Pekat · Ritsleting Ganda",
      category: "tas",
      categoryLabel: "Tas",
      price: 199000,
      originalPrice: 259000,
      discount: "-23%",
      rating: 4.7,
      ratingCount: 89,
      soldCount: 215,
      stock: 16,
      isFlashSale: false,
      image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80"
      ],
      description: "Tas bahu siluet terstruktur dari kulit sintetis vegan premium bertekstur kerikil lembut. Tahan percikan air dan dilengkapi tali selempang yang dapat dilepas pasang.",
      colors: ["Hitam", "Cokelat Tan", "Burgundy"],
      sizes: ["30 x 24 x 12 cm"],
      specs: [
        { label: "Material", val: "Premium PU Vegan Leather" },
        { label: "Tali", val: "Adjustable & Detachable Crossbody Strap" }
      ],
      reviews: [
        { user: "Melisa G.", rating: 5, date: "15 Nov 2026", comment: "Kelihatan mahal dan sangat rapi. Cocok untuk ke kantor maupun jalan-jalan." }
      ]
    }
  ],

  // Cerita dalam Koleksi
  collections: [
    {
      id: "c1",
      tag: "RUMAH YANG HANGAT",
      title: "Rumah, tempat paling nyaman.",
      subtitle: "Sentuhan natural untuk sudut favoritmu.",
      image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1000&q=80",
      description: "Koleksi perabot kayu ramah lingkungan, tekstil linen lembut, dan tanaman dalam ruangan yang menghadirkan ketenangan di tengah hiruk pikuk keseharian.",
      productCount: 18
    },
    {
      id: "c2",
      tag: "PILIHAN SEHARI-HARI",
      title: "Siap untuk ke mana saja.",
      subtitle: "Pilihan simpel untuk hari yang bergerak.",
      image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1000&q=80",
      description: "Koleksi esensial pakaian adem, tas kanvas tahan banting, dan sandal ergonomis yang siap menemani mobilitas harian Anda dengan nyaman dan percaya diri.",
      productCount: 24
    }
  ],

  // Nilai / Janji Layanan
  benefits: [
    {
      icon: "truck",
      title: "Ongkir lebih ringan",
      desc: "Gratis ongkir min. Rp150.000*"
    },
    {
      icon: "shield-check",
      title: "Bayar dengan tenang",
      desc: "Pilihan pembayaran yang aman"
    },
    {
      icon: "rotate-ccw",
      title: "Ada yang kurang pas?",
      desc: "Ajukan retur dalam 7 hari*"
    },
    {
      icon: "headphones",
      title: "Kami siap membantu",
      desc: "Temukan jawaban di Pusat Bantuan"
    }
  ],

  // Profil Pengguna Awal
  userProfile: {
    name: "Dimas Pratama",
    email: "dimas.pratama@example.com",
    phone: "+62 812-3456-7890",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    memberSince: "November 2025",
    addresses: [
      {
        id: "addr-1",
        label: "Rumah (Utama)",
        receiver: "Dimas Pratama",
        phone: "+62 812-3456-7890",
        street: "Jl. Raya Darmo Permai III No. 42, RT 04 / RW 02",
        subdistrict: "Sukomanunggal",
        city: "Surabaya",
        province: "Jawa Timur",
        postalCode: "60189",
        isDefault: true
      },
      {
        id: "addr-2",
        label: "Kantor",
        receiver: "Dimas Pratama",
        phone: "+62 812-3456-7890",
        street: "Gedung Graha Pena Lt. 8, Jl. Ahmad Yani No. 88",
        subdistrict: "Gayungan",
        city: "Surabaya",
        province: "Jawa Timur",
        postalCode: "60234",
        isDefault: false
      }
    ]
  },

  // Riwayat Pesanan Awal (Untuk Halaman Akun & Pesanan Saya)
  initialOrders: [
    {
      id: "TEMU-821940",
      date: "14 November 2026",
      status: "Selesai",
      statusCode: "completed",
      courier: "JNE Reguler (Resi: JNE-SUB-982141)",
      destinationCity: "Surabaya",
      shippingFee: 0,
      total: 148000,
      paymentMethod: "Transfer Bank BCA",
      items: [
        {
          productId: "p1",
          name: "Tote Kanvas Everyday",
          subtitle: "Olive · Kanvas tebal",
          price: 89000,
          qty: 1,
          image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=300&q=80"
        },
        {
          productId: "p2",
          name: "Mug Keramik Nala",
          subtitle: "Ivory · 350 ml",
          price: 59000,
          qty: 1,
          image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=300&q=80"
        }
      ],
      timeline: [
        { time: "14 Nov 2026, 09:30", text: "Pesanan berhasil dibuat & diverifikasi" },
        { time: "14 Nov 2026, 14:15", text: "Paket dikemas dan diserahkan ke JNE Surabaya" },
        { time: "15 Nov 2026, 10:20", text: "Kurir sedang mengantar paket ke alamat tujuan" },
        { time: "15 Nov 2026, 13:45", text: "Paket telah diterima oleh Dimas Pratama" }
      ]
    }
  ],

  // FAQ Pusat Bantuan
  faqs: [
    {
      q: "Bagaimana cara mendapatkan Gratis Ongkir?",
      a: "Belanja produk apa saja dengan total minimum Rp150.000 setelah potongan diskon. Gratis ongkir otomatis terpasang saat checkout tanpa perlu klaim voucher."
    },
    {
      q: "Bagaimana prosedur retur barang dalam 7 hari?",
      a: "Buka menu Akun > Pesanan Saya > Ajukan Retur. Anda dapat menukar ukuran/warna atau meminta pengembalian dana penuh jika produk mengalami cacat produksi."
    },
    {
      q: "Berapa lama estimasi pengiriman pesanan?",
      a: "Untuk area Surabaya dan Jawa Timur estimasi 1-2 hari kerja. Untuk wilayah Jakarta, Bandung, dan Bali estimasi 2-3 hari. Layanan GoSend Instant tiba dalam 2-3 jam."
    },
    {
      q: "Apakah pesanan bisa dibayar di tempat (COD)?",
      a: "Ya! Anda dapat memilih metode pembayaran 'Bayar di Tempat (COD)' saat checkout tanpa biaya tambahan."
    }
  ]
};
