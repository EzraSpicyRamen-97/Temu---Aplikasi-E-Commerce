# temu — Konsep Toko Lifestyle Sehari-hari (E-Commerce Web)

Website *e-commerce lifestyle* modern dan minimalis yang dibangun berdasarkan rancangan desain mockup PDF dengan prinsip **konsistensi visual 100%**, estetika bernuansa hangat (*earth & sage tone*), tipografi bersih, dan fungsionalitas belanja lengkap.

---

## 🎨 Konsistensi Desain Sesuai Dokumen Acuan

| Elemen Desain | Implementasi & Konsistensi |
| :--- | :--- |
| **Identitas Brand** | Logo `temu` huruf kecil (*lowercase*), bersih dan berkarakter, dengan *tagline* `"Konsep toko lifestyle sehari-hari"`. |
| **Palet Warna** | Menggunakan gradasi *soft sage green* (`#E4ECE2`, `#EBF1EA`), *deep forest green* (`#1E3A2B`) untuk tombol & aksen utama, krem hangat (`#F8F7F4`), serta aksen merah koral promo (`#D9483B`). |
| **Tipografi** | Font *Plus Jakarta Sans* berkarakter modern, geometris dengan sentuhan humanis yang nyaman dibaca di layar mobile maupun desktop. |
| **Navigasi Atas** | Ikon Notifikasi (dengan tanda lonceng merah) & Tas Belanja (dengan *badge* item aktif `2`). |
| **Bilah Pencarian & Lokasi** | Formulir pencarian *"Cari favorit sehari-hari"* dan pengatur kota tujuan *"Kirim ke Surabaya"* yang interaktif. |
| **Hero Banner** | Kartu sage dengan badge *"TEMUKAN YANG DEKAT DENGANMU"*, judul *"Hal kecil, bikin hari lebih baik."*, deskripsi diskon hingga 40%, tombol *"Temukan favoritmu"*, dan foto estetika sudut rumah. |
| **Kategori Belanja** | 6 Kategori lengkap: **Fashion, Rumah, Aksesori, Dapur, Tas, dan Aktivitas**. |
| **Flash Sale ("Temu hemat hari ini")** | Timer hitung mundur (*countdown*) dinamis: *"Berakhir dalam 05 : 42 : 18 jam : menit : detik"*, diskon -31%, -25%, -29%, dan rating bintang. |
| **Koleksi ("Pilihan untuk keseharianmu")** | Tab filter dinamis (*Untukmu, Fashion, Rumah, Aksesori*) dengan produk rotan, sandal dua tali, lampu meja senja, dan pouch kanvas. |
| **Cerita dalam Koleksi** | Kartu narasi visual: *"RUMAH YANG HANGAT"* dan *"PILIHAN SEHARI-HARI"*. |
| **Jaminan Layanan ("Belanja tanpa ribet")** | 4 pilar: Ongkir lebih ringan (Min. Rp150.000*), Bayar dengan tenang, Retur 7 hari, dan Pusat Bantuan. |
| **Navigasi Bawah (Bottom Bar)** | 4 Menu: **Beranda, Kategori, Favorit, dan Akun**. |

---

## 🚀 Fitur Interaktif Lengkap

1. **Pengalih Tampilan (Device Viewport Switcher)**:
   - **Tampilan Mobile**: Bingkai HP elegan (rasio layar, *status bar* 9:41, *safe-area*) persis seperti di PDF.
   - **Tampilan Web Luas (Desktop/Tablet)**: Tata letak responsif penuh untuk layar monitor besar dengan estetika yang tetap konsisten.

2. **Sistem Tas Belanja (Cart Drawer)**:
   - Terisi 2 produk awal sesuai badge PDF (Tote Kanvas Everyday + Mug Keramik Nala).
   - Bilah progres Gratis Ongkir dinamis (*"Kurang Rp2.000 untuk Gratis Ongkir!"*).
   - Penambahan/pengurangan kuantitas (*stepper* +/-) dan kalkulasi subtotal instan.
   - Input voucher promo (Gunakan kode: `TEMUHEMAT` untuk diskon 10%).

3. **Detail Produk (Product Modal)**:
   - Foto resolusi tinggi, pilihan varian warna & ukuran, spesifikasi lengkap, dan tombol *Tambah ke Keranjang* / *Beli Sekarang*.

4. **Alur Checkout & Pembayaran Lokal Indonesia**:
   - Pilihan kurir: **JNE Reguler** & **GoSend Instant**.
   - Metode pembayaran lokal: **QRIS**, **BCA Virtual Account**, dan **Mandiri Livin' VA**.
   - Simulasi penerbitan struk pesanan & nomor resi pengiriman.

5. **Pencarian Real-Time & Filter**:
   - Mengetik di bilah pencarian langsung menyaring katalog produk secara instan.

6. **Pilihan Kota Pengiriman**:
   - Modal pilihan kota (Surabaya, Jakarta, Bandung, Semarang, Medan, Bali, dll).

---

## 💻 Struktur Folder

```
temu-ecommerce/
├── index.html              # Halaman utama aplikasi web
├── assets/
│   ├── css/
│   │   └── style.css       # Styling, palet warna kustom, dan animasi
│   └── js/
│       ├── products.js     # Data katalog produk, kategori, & spesifikasi
│       └── app.js          # Logika aplikasi (cart, wishlist, countdown, filter)
├── server.py               # Server lokal Python
├── run.bat                 # Shortcut Windows untuk menjalankan website
└── README.md               # Dokumentasi proyek
```

---

## 🛠️ Cara Menjalankan

### Cara 1 (Paling Mudah):
Klik dua kali file `run.bat` di dalam folder ini, atau klik dua kali langsung pada file `index.html` di browser Anda (Google Chrome, Microsoft Edge, Mozilla Firefox).

### Cara 2 (Menggunakan Python Server):
```bash
python server.py
```
Lalu buka browser di alamat: **`http://localhost:3000`**
