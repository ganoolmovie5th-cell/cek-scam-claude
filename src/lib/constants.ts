// ============================================================
// SINGLE SOURCE OF TRUTH — CekScam.id
// Update semua data statistik di sini
// ============================================================

export const SITE = {
  name: "cek-scam.id",
  tagline: "Lindungi Dirimu dari Penipuan Online",
  description:
    "Platform komunitas Indonesia untuk deteksi penipuan online, cek keamanan website, dan edukasi digital. Bersama kita lebih aman.",
  url: "https://cek-scam.web.id",
  email: "lapor@cek-scam.id",
  social: {
    twitter: "https://twitter.com/cekscamid",
    instagram: "https://instagram.com/cekscamid",
  },
};

export const STATS = {
  totalReports: 12847,
  sitesBlocked: 3291,
  usersSaved: 8654,
  totalLossPrevented: "Rp 47,3 Miliar",
  activeSince: "2024",
  communityMembers: 21000,
};

export const RISK_LEVELS = {
  SAFE: {
    label: "Aman",
    color: "green",
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    badge: "bg-green-100 text-green-800",
    icon: "✅",
  },
  WARNING: {
    label: "Waspada",
    color: "yellow",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-700",
    badge: "bg-yellow-100 text-yellow-800",
    icon: "⚠️",
  },
  DANGER: {
    label: "Berbahaya",
    color: "red",
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    badge: "bg-red-100 text-red-800",
    icon: "🚨",
  },
};

export const SCAM_CATEGORIES = [
  { id: "belanja_online", label: "Penipuan Belanja Online", icon: "🛒" },
  { id: "investasi", label: "Investasi / Kripto Palsu", icon: "📈" },
  { id: "phishing", label: "Phishing / Link Palsu", icon: "🎣" },
  { id: "pinjol", label: "Pinjol Ilegal", icon: "💸" },
  { id: "lowongan_kerja", label: "Lowongan Kerja Palsu", icon: "📋" },
  { id: "romance_scam", label: "Romance Scam", icon: "💔" },
  { id: "hadiah_palsu", label: "Hadiah / Undian Palsu", icon: "🎁" },
  { id: "impersonasi", label: "Impersonasi (Penyamaran)", icon: "🎭" },
  { id: "lainnya", label: "Lainnya", icon: "❓" },
];

export const SCAM_DATABASE: ScamEntry[] = [
  {
    id: "1",
    name: "tokobagus-promo.shop",
    type: "belanja_online",
    risk: "DANGER",
    reports: 143,
    date: "2025-06-01",
    description: "Toko online palsu mengatasnamakan Tokobagus, menjual elektronik dengan harga sangat murah namun barang tidak pernah dikirim.",
    platform: "Website",
  },
  {
    id: "2",
    name: "invest-cepat-kaya.com",
    type: "investasi",
    risk: "DANGER",
    reports: 287,
    date: "2025-05-28",
    description: "Website investasi bodong menjanjikan return 50% per bulan, menggunakan skema Ponzi.",
    platform: "Website",
  },
  {
    id: "3",
    name: "bca-update-akun.info",
    type: "phishing",
    risk: "DANGER",
    reports: 512,
    date: "2025-05-25",
    description: "Situs phishing yang menyamar sebagai BCA, mencuri data login dan OTP pengguna.",
    platform: "Website",
  },
  {
    id: "4",
    name: "dana-pinjaman-cepat.id",
    type: "pinjol",
    risk: "DANGER",
    reports: 98,
    date: "2025-05-20",
    description: "Pinjol ilegal tidak terdaftar OJK dengan bunga harian 5%, penagihan dengan ancaman dan intimidasi.",
    platform: "Website & WhatsApp",
  },
  {
    id: "5",
    name: "job-hiring-singapore.com",
    type: "lowongan_kerja",
    risk: "DANGER",
    reports: 67,
    date: "2025-05-15",
    description: "Lowongan kerja palsu ke Singapore/Malaysia, meminta biaya administrasi jutaan rupiah.",
    platform: "Website & Telegram",
  },
  {
    id: "6",
    name: "shopee-flash-sale-murah.net",
    type: "belanja_online",
    risk: "WARNING",
    reports: 34,
    date: "2025-06-03",
    description: "Dicurigai sebagai toko palsu yang mengatasnamakan Shopee flash sale. Masih dalam investigasi.",
    platform: "Website",
  },
  {
    id: "7",
    name: "kripto-profit-harian.xyz",
    type: "investasi",
    risk: "WARNING",
    reports: 22,
    date: "2025-06-02",
    description: "Platform kripto mencurigakan dengan klaim profit tidak realistis. Belum terverifikasi OJK.",
    platform: "Website & Telegram",
  },
  {
    id: "8",
    name: "tokopedia.com",
    type: "belanja_online",
    risk: "SAFE",
    reports: 0,
    date: "2025-06-08",
    description: "Platform e-commerce resmi terdaftar dan terverifikasi aman.",
    platform: "Website & App",
  },
];

export const EDUCATION_ARTICLES = [
  {
    id: "1",
    slug: "kenali-ciri-website-scam",
    title: "10 Ciri-ciri Website Scam yang Wajib Kamu Ketahui",
    excerpt: "Sebelum belanja online, pastikan kamu tahu cara membedakan website asli dan palsu. Berikut 10 tanda bahaya yang harus diwaspadai.",
    category: "Belanja Online",
    readTime: "5 menit",
    date: "2025-06-05",
    icon: "🛒",
    tips: [
      "Periksa URL — pastikan tidak ada typo seperti 'tok0pedia' atau 'sh0pee'",
      "Cek HTTPS dan ikon gembok di browser",
      "Harga terlalu murah? Waspadai!",
      "Tidak ada kontak resmi atau alamat jelas",
      "Desain website amatir dan penuh typo",
    ],
  },
  {
    id: "2",
    slug: "hindari-phishing-link",
    title: "Cara Mengenali dan Menghindari Link Phishing",
    excerpt: "Link phishing makin canggih dan sulit dibedakan. Pelajari cara kerja mereka dan bagaimana melindungi dirimu.",
    category: "Keamanan Digital",
    readTime: "7 menit",
    date: "2025-06-03",
    icon: "🎣",
    tips: [
      "Jangan klik link dari SMS/WhatsApp tidak dikenal",
      "Hover link sebelum klik untuk lihat URL aslinya",
      "Bank TIDAK pernah minta OTP lewat link",
      "Gunakan password manager untuk deteksi phishing",
      "Aktifkan 2FA di semua akun penting",
    ],
  },
  {
    id: "3",
    slug: "waspada-investasi-bodong",
    title: "Investasi Bodong: Kenali Skema Ponzi dan Cara Menghindarinya",
    excerpt: "Ratusan ribu orang Indonesia telah menjadi korban investasi bodong. Pelajari red flags-nya sebelum terlambat.",
    category: "Investasi",
    readTime: "8 menit",
    date: "2025-06-01",
    icon: "📈",
    tips: [
      "Return tidak realistis (>10% per bulan) = red flag",
      "Selalu cek izin OJK di ojk.go.id",
      "Skema rekrut anggota = tanda Ponzi",
      "Tidak ada produk/jasa nyata = berbahaya",
      "Tekanan untuk invest segera = manipulasi",
    ],
  },
  {
    id: "4",
    slug: "keamanan-akun-media-sosial",
    title: "Panduan Lengkap Keamanan Akun Media Sosial",
    excerpt: "Akun Instagram/Facebook kamu bisa diretas dalam hitungan menit. Ini cara melindunginya dengan benar.",
    category: "Keamanan Akun",
    readTime: "6 menit",
    date: "2025-05-28",
    icon: "🔐",
    tips: [
      "Aktifkan 2FA (Two-Factor Authentication)",
      "Gunakan password unik di setiap platform",
      "Jangan login di perangkat orang lain",
      "Cek 'login activity' secara rutin",
      "Jangan share kode OTP ke siapapun",
    ],
  },
  {
    id: "5",
    slug: "pinjol-ilegal-bahaya",
    title: "Bahaya Pinjol Ilegal: Kenali dan Laporkan",
    excerpt: "Pinjol ilegal tidak hanya menguras kantong tapi bisa mengancam jiwa. Ketahui cara mengenali dan melaporkannya ke OJK.",
    category: "Pinjaman Online",
    readTime: "6 menit",
    date: "2025-05-25",
    icon: "💸",
    tips: [
      "Cek daftar pinjol legal di ojk.go.id",
      "Hindari pinjol yang minta akses kontak HP",
      "Bunga legal max 0.4% per hari",
      "Penagihan dengan ancaman = ILEGAL",
      "Laporkan ke OJK: 157 atau waspadai.ojk.go.id",
    ],
  },
  {
    id: "6",
    slug: "romance-scam-modus-baru",
    title: "Romance Scam: Modus Baru yang Mengincar Korban di Indonesia",
    excerpt: "Pelaku romance scam kini pakai AI untuk buat profil palsu yang meyakinkan. Waspadai tanda-tandanya.",
    category: "Penipuan Sosial",
    readTime: "7 menit",
    date: "2025-05-20",
    icon: "💔",
    tips: [
      "Reverse image search foto profil mereka",
      "Selalu minta video call — scammer menghindarinya",
      "Tidak pernah minta uang ke orang baru kenal online",
      "Cerita terlalu sempurna = suspicious",
      "Konsultasi ke orang terdekat sebelum transfer",
    ],
  },
];

export type ScamEntry = {
  id: string;
  name: string;
  type: string;
  risk: "SAFE" | "WARNING" | "DANGER";
  reports: number;
  date: string;
  description: string;
  platform: string;
};
