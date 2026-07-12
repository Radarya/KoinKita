# 🪙 KoinKita: Interactive Financial Literacy Game

<div align="center">
  <h3>Belajar Keuangan Secara Seru dan Edukatif</h3>
  <p><strong>KoinKita</strong> adalah aplikasi game edukasi literasi keuangan interaktif yang dirancang khusus untuk membantu pengguna memahami pengelolaan anggaran, investasi bijak, analisis kasus penipuan keuangan, serta istilah finansial global secara menyenangkan.</p>
</div>

---

## 🎮 Fitur & Mini-Games Utama

KoinKita dilengkapi dengan **4 mini-games seru** yang berorientasi pada simulasi pengambilan keputusan finansial di dunia nyata:

1. **👨‍🍳 Koki Anggaran (Budget Chef)**
   * Simulasikan pengelolaan keuangan bulanan dengan membagi pengeluaran ke dalam kategori **Kebutuhan (Needs)**, **Keinginan (Wants)**, dan **Tabungan/Investasi (Savings)**.
   * Hindari jebakan pengeluaran yang tidak perlu (*Trap*) untuk memenangkan liga mingguan.

2. **🕵️ Detektif Cuan (Profit Detective)**
   * Latih kewaspadaan Anda terhadap berbagai modus penipuan keuangan di era digital.
   * Analisis pesan, email, atau tautan mencurigakan dan tentukan mana yang merupakan **Phishing/Scam** atau **Transaksi Aman**.

3. **🌳 Pohon Aset (Asset Tree)**
   * Pelajari dinamika pertumbuhan investasi dan diversifikasi aset secara real-time.
   * Tanam dan kelola aset Anda pada cabang **Aman/Stabil** (Emas, Deposito, SBN) dan cabang **Tumbuh Cepat** (Saham, Kripto) di tengah fluktuasi cuaca ekonomi.

4. **📝 FinWordle (Financial Wordle)**
   * Uji pengetahuan kosa kata keuangan Anda dengan tebak istilah finansial 4-8 huruf berbasis petunjuk interaktif harian.

---

## 🚀 Keunggulan Teknis & Optimalisasi Performa

* **⚡ Optimized Bundle Splitting**: Menggunakan konfigurasi Vite yang dioptimalkan untuk memecah aset berat (Framer Motion, Lucide) secara dinamis, menghasilkan muatan aplikasi awal yang jauh lebih cepat.
* **📱 Native Android Integration**: Dibangun menggunakan Capacitor untuk memberikan performa native WebView di Android yang halus dengan dukungan akselerasi hardware penuh.
* **🔒 Data Security & Privacy**: Autentikasi aman terintegrasi menggunakan Google Firebase Auth, perlindungan privasi tanpa pelacak iklan pihak ketiga, serta garansi enkripsi penuh menggunakan SSL/TLS.
* **🌐 Multi-Language Support**: Dukungan penuh untuk bahasa Indonesia dan Inggris (English Localization) dengan tata bahasa yang natural dan akurat di seluruh modul.

---

## 🛠️ Panduan Menjalankan Project

### Prasyarat
* Node.js (versi 18 atau lebih baru)
* Android SDK (untuk build native)

### Langkah-Langkah

1. Clone repositori:
   ```bash
   git clone https://github.com/Radarya/KoinKita.git
   cd KoinKita
   ```

2. Instal dependensi:
   ```bash
   npm install
   ```

3. Jalankan server pengembangan lokal (web):
   ```bash
   npm run dev
   ```

4. Bangun versi produksi (web):
   ```bash
   npm run build
   ```

5. Sinkronisasi aset ke platform Android (Capacitor):
   ```bash
   npx cap sync android
   ```

6. Bangun berkas APK Android:
   ```bash
   cd android
   ./gradlew assembleDebug
   ```
   Berkas APK hasil build dapat ditemukan di direktori `android/app/build/outputs/apk/debug/app-debug.apk`.

---

## 📄 Lisensi & Hak Cipta
Aplikasi ini dikembangkan untuk tujuan edukasi literasi keuangan. Hak cipta dilindungi undang-undang.
