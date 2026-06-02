const fs = require('fs');

const generateKokiData = () => {
    let output = "export const EMERGENCY_SCENARIOS = [\n";
    output += "  {\n    id_safe: 'Aman - Tabungan Darurat Menyelamatkanmu', en_safe: 'Secure - Emergency Fund Saves You',\n    id_danger: 'Pinalti - Terpaksa Utang Pinjol', en_danger: 'Penalty - Forced High-Interest Debt',\n";
    output += "    id_title: 'Sakit Mendadak! 🏥', en_title: 'Medical Emergency! 🏥',\n";
    output += "    id_desc_safe: 'Anggota keluarga tiba-tiba sakit! Untungnya, tabungan daruratmu menutupi biaya rumah sakit.', en_desc_safe: 'A family member fell ill! Fortunately, your emergency fund covers the bills.',\n";
    output += "    id_desc_danger: 'Anggota keluarga sakit! Karena tidak ada tabungan, kamu meminjam uang secara online dengan bunga tinggi.', en_desc_danger: 'A family member fell ill! Without savings, you took a high-interest online loan.'\n  },\n";
    output += "  {\n    id_safe: 'Aman - Klaim Asuransi Cair', en_safe: 'Secure - Insurance Claimed',\n    id_danger: 'Pinalti - Gaji Habis Untuk Perbaikan', en_danger: 'Penalty - Salary Drained for Repairs',\n";
    output += "    id_title: 'Atap Bocor! 🌧️', en_title: 'Leaking Roof! 🌧️',\n";
    output += "    id_desc_safe: 'Hujan badai membuat atap bocor. Dengan dana darurat, kamu langsung memanggil tukang.', en_desc_safe: 'A heavy storm broke your roof. With emergency funds, you fixed it.',\n";
    output += "    id_desc_danger: 'Hujan badai atap bocor! Kamu tak punya tabungan, uang makan bulan ini habis untuk perbaikan.', en_desc_danger: 'A storm broke your roof! With no savings, your grocery budget was drained.'\n  },\n";
    output += "  {\n    id_safe: 'Aman - Servis Cepat', en_safe: 'Secure - Quick Service',\n    id_danger: 'Pinalti - Transportasi Terhambat', en_danger: 'Penalty - Transport Disrupted',\n";
    output += "    id_title: 'Motor Mogok! 🏍️', en_title: 'Motorcycle Broken! 🏍️',\n";
    output += "    id_desc_safe: 'Motormu mogok di jalan. Kamu menggunakan tabungan darurat untuk biaya bengkel.', en_desc_safe: 'Your motorcycle broke down. You used emergency savings for repairs.',\n";
    output += "    id_desc_danger: 'Motormu mogok! Kamu tak punya simpanan, terpaksa berutang ke teman dan terlambat kerja.', en_desc_danger: 'Motorcycle broke down! Zero savings forced you to borrow and miss work.'\n  },\n";
    output += "  {\n    id_safe: 'Aman - Bencana Teratasi', en_safe: 'Secure - Disaster Handled',\n    id_danger: 'Pinalti - Jual Barang Murah', en_danger: 'Penalty - Fire Sale',\n";
    output += "    id_title: 'Laptop Rusak! 💻', en_title: 'Broken Laptop! 💻',\n";
    output += "    id_desc_safe: 'Laptop kerjamu mati total. Dana tabunganmu menyelamatkan hari.', en_desc_safe: 'Work laptop died. Your savings saved the day.',\n";
    output += "    id_desc_danger: 'Laptop kerjamu mati! Tanpa dana darurat, kamu terpaksa menjual HP murah untuk biaya servis.', en_desc_danger: 'Work laptop died! Without funds, you sold your phone cheap to pay for repairs.'\n  },\n";
    output += "  {\n    id_safe: 'Aman - Bertahan Hidup', en_safe: 'Secure - Survival Mode',\n    id_danger: 'Pinalti - Utang Rentenir', en_danger: 'Penalty - Loan Shark Debt',\n";
    output += "    id_title: 'PHK Mendadak! 📉', en_title: 'Sudden Layoff! 📉',\n";
    output += "    id_desc_safe: 'Perusahaan tutup mendadak. Namun tabungan darurat membuatmu tenang mencari kerja baru.', en_desc_safe: 'Company closed abruptly. But your emergency fund keeps you calm while job hunting.',\n";
    output += "    id_desc_danger: 'Perusahaan tutup! Karena 0 tabungan, kamu terjerat utang rentenir minggu ini.', en_desc_danger: 'Company closed! With 0 savings, you fell into loan shark debt today.'\n  }\n];\n\n";

    output += "export const LEVEL_ORDERS: Record<number, { text: string, text_en: string, type: string }[]> = {\n";
    const needsID = ["Beli Beras", "Beli Sayur", "Bayar Listrik", "Beli Air Minum", "Obat-obatan", "Sabun Mandi", "Ongkos Kerja", "Sewa Rumah", "Beli Susu Anak", "Gas Dapur", "Kuota Belajar", "Pasta Gigi", "Servis Kendaraan", "Makanan Pokok", "Vitamin Harian", "Bayar Kontrakan", "Sembako", "Sayur Mayur", "BBM Kendaraan", "Iuran Warga"];
    const needsEN = ["Buy Rice", "Buy Vegetables", "Pay Electricity", "Buy Drinking Water", "Medicines", "Bath Soap", "Work Commute", "House Rent", "Baby Milk", "Kitchen Gas", "Study Data Plan", "Toothpaste", "Vehicle Service", "Staple Foods", "Daily Vitamins", "Pay Lease", "Basic Groceries", "Vegetables", "Vehicle Fuel", "Community Dues"];
    
    const wantsID = ["Jajan Boba", "Main Game Dingdong", "Koleksi Stiker", "Makan di Luar", "Nonton Bioskop", "Top Up Skin Game", "Kafe Gaul", "Sepatu Modis", "Jam Tangan Mewah", "Langganan VIP", "Konser K-Pop", "Action Figure", "Staycation", "Gadget Terbaru", "Baju Diskonan", "Kosmetik Mahal", "Aksesoris", "Minuman Kekinian", "Netflix", "Spotify"];
    const wantsEN = ["Buy Boba", "Arcade Games", "Collect Stickers", "Eat Out", "Watch Movie", "Top Up Game Skin", "Trendy Cafe", "Stylish Shoes", "Luxury Watch", "VIP Subscription", "K-Pop Concert", "Action Figure", "Staycation", "New Gadget", "Discounted Clothes", "Expensive Cosmetics", "Accessories", "Trendy Drink", "Netflix", "Spotify"];
    
    const savingsID = ["Celengan Ayam", "Tabungan Koin", "Rekening Bank", "Dana Darurat", "Deposito Berjangka", "Beli Emas Mini", "Uang Pangkal", "Reksadana", "Saham Unggulan", "Dana Pensiun", "Obligasi Negara", "Modal Usaha", "Asuransi Kesehatan", "Tabungan Qurban", "SBN Ritel", "Sisihkan Gaji", "Koperasi", "Asuransi Jiwa", "Emas Batangan", "Tanah"];
    const savingsEN = ["Piggy Bank", "Coin Savings", "Bank Account", "Emergency Fund", "Time Deposit", "Buy Mini Gold", "Enrollment Funds", "Mutual Funds", "Blue Chip Stocks", "Pension Fund", "Government Bonds", "Business Capital", "Health Insurance", "Charity Savings", "Retail Bonds", "Set Aside Salary", "Cooperative", "Life Insurance", "Gold Bar", "Land Investment"];
    
    const trapsID = ["Pinjaman KTP Bodong", "Investasi Bodong", "Arisan Fiktif", "Undian SMS Palsu", "Aplikasi Pinjol", "Tawaran Cepat Kaya", "Trading Bot Scam", "Link WA Phishing", "Skema Ponzi", "Pesugihan Online", "Beli Akun Palsu", "Cryptocoin Scam", "Telepon Tipu Keluarga", "Lowongan Kerja Palsu", "Modus SMS Pemenang", "Link Undian Palsu", "APK Kurir Bodong", "Transfer Jebakan", "E-Mail Penipuan", "Voucher Hoax"];
    const trapsEN = ["Fake ID Loans", "Fake Investment", "Fictitious Gatherings", "Fake SMS Sweepstakes", "Loan Sharks App", "Get Rich Quick Offer", "Trading Bot Scam", "WA Phishing Link", "Ponzi Scheme", "Online Occult Scam", "Buy Fake Account", "Scam Cryptocoin", "Fake Family Call", "Fake Job Vacancy", "Winner SMS Scam", "Fake Sweepstakes Link", "Fake Courier APK", "Trap Transfer", "Scam Email", "Hoax Voucher"];

    const modsID = ["Bulan Ini", "Hari Ini", "Darurat", "Mingguan", "Rutin", "Mendadak", "Keluarga", "Premium", "Baru", "Super"];
    const modsEN = ["This Month", "Today", "Emergency", "Weekly", "Routine", "Sudden", "Family", "Premium", "New", "Super"];

    for (let lvl = 0; lvl <= 5; lvl++) {
        output += `  ${lvl}: [\n`;
        for (let i = 0; i < 55; i++) {
            let cat = Math.floor(Math.random() * 4);
            let type = "KEBUTUHAN"; let sID = needsID; let sEN = needsEN;
            if (cat === 1) { type = "KEINGINAN"; sID = wantsID; sEN = wantsEN; }
            else if (cat === 2) { type = "TABUNGAN"; sID = savingsID; sEN = savingsEN; }
            else if (cat === 3) { type = "TRAP"; sID = trapsID; sEN = trapsEN; }
            
            let idx = Math.floor(Math.random() * sID.length);
            let mIdx = Math.floor(Math.random() * modsID.length);
            let useMod = Math.random() > 0.5;
            let finalID = useMod ? `${sID[idx]} ${modsID[mIdx]}` : sID[idx];
            let finalEN = useMod ? `${modsEN[mIdx]} ${sEN[idx]}` : sEN[idx];
            
            output += `    { text: "${finalID}", text_en: "${finalEN}", type: "${type}" }${i === 54 ? '' : ','}\n`;
        }
        output += `  ]${lvl === 5 ? '' : ','}\n`;
    }
    output += "};\n";
    return output;
};

const generateDetektifData = () => {
    let output = "export const LEVEL_SCENARIOS: Record<number, any[]> = {\n";
    
    const amanTpl = [
        { plat: "SMS", sndID: "Gojek", sndEN: "Gojek", msgID: "OTP Anda: [RND]. Jangan berikan ke siapapun.", msgEN: "Your OTP: [RND]. Do not share.", expID: "SMS OTP resmi tepercaya.", expEN: "Official OTP." },
        { plat: "Email", sndID: "PLN <info@pln.co.id>", sndEN: "PLN <info@pln.id>", msgID: "Tagihan Anda Rp[RND] telah terbit.", msgEN: "Your bill Rp[RND] is ready.", expID: "Domain asli terpercaya.", expEN: "Original trusted domain." },
        { plat: "WhatsApp", sndID: "Bank Mandiri", sndEN: "Bank Mandiri", msgID: "Transaksi berhasil Rp[RND] di Merchant.", msgEN: "Success tx IDR [RND] at Merchant.", expID: "Akun centang hijau verifikasi.", expEN: "Verified green tick account." },
        { plat: "SMS", sndID: "Telkomsel", sndEN: "Telkomsel", msgID: "Sisa kuota internet Anda [RND] GB.", msgEN: "Remaining data [RND] GB.", expID: "Notifikasi standar operator.", expEN: "Standard telecom notification." },
        { plat: "Email", sndID: "Google Security", sndEN: "Google Security", msgID: "Login baru di perangkat. Kode [RND].", msgEN: "New login on device. Code [RND].", expID: "Email sekuriti sah Google.", expEN: "Valid Google security email." }
    ];
    
    const bahayaTpl = [
        { plat: "WhatsApp", sndID: "+62812XXXX", sndEN: "+62812XXXX", msgID: "Paket nyasar, cek resi: resi-[RND].apk", msgEN: "Lost package, check: rec-[RND].apk", expID: "APK mencuri data OTP.", expEN: "APK steals OTP data." },
        { plat: "SMS", sndID: "+62851XXXX", sndEN: "+62851XXXX", msgID: "Anda menang undian Rp[RND] Juta. Klik bit.ly/win", msgEN: "You won IDR [RND] M. Click bit.ly/win", expID: "Modus undian link phishing.", expEN: "Sweepstakes phishing link." },
        { plat: "Email", sndID: "Admin <tax@pajakk-id.com>", sndEN: "Tax <tax@gov-id.com>", msgID: "Denda pajak Anda lunas? Unduh doc[RND].exe", msgEN: "Tax fine clear? Download doc[RND].exe", expID: "Pemerintah tidak pakai file .exe.", expEN: "Gov avoids .exe files." },
        { plat: "WhatsApp", sndID: "Teman SMA", sndEN: "Highschool Friend", msgID: "Pinjam saldo [RND] ribu dong, sangat darurat.", msgEN: "Lend me [RND]k, very urgent.", expID: "Social engineering akun dibajak.", expEN: "Hijacked account engineering." },
        { plat: "SMS", sndID: "Info Bank", sndEN: "Bank Info", msgID: "Akun DIBLOKIR! Verifikasi di bank-id-[RND].com", msgEN: "Account BLOCKED! bank-id-[RND].com", expID: "Domain palsu untuk panik phishing.", expEN: "Fake domain panic phishing." }
    ];

    for (let lvl = 0; lvl <= 5; lvl++) {
        output += `  ${lvl}: [\n`;
        for (let i = 0; i < 55; i++) {
            let isAman = Math.random() > 0.5;
            let tpl = isAman ? amanTpl[Math.floor(Math.random() * amanTpl.length)] : bahayaTpl[Math.floor(Math.random() * bahayaTpl.length)];
            let rnd = Math.floor(Math.random() * 900) + 100;
            let msgID = tpl.msgID.replace("[RND]", rnd);
            let msgEN = tpl.msgEN.replace("[RND]", rnd);
            output += `    { id: ${lvl * 100 + i}, type: '${isAman ? 'AMAN' : 'BAHAYA'}', platform: '${tpl.plat}', sender: '${tpl.sndID}', sender_en: '${tpl.sndEN}', message: "${msgID}", message_en: "${msgEN}", explanation: "${tpl.expID}", explanation_en: "${tpl.expEN}", verified: ${isAman} }${i === 54 ? '' : ','}\n`;
        }
        output += `  ]${lvl === 5 ? '' : ','}\n`;
    }
    output += "};\n";
    return output;
};

const generateWordleData = () => {
    let output = "export const LEVEL_WORDS: Record<number, { word: { id: string, en: string }, clue: { id: string, en: string } }[]> = {\n";
    
    const words = [
        ["UANG", "MONEY", "Alat tukar resmi", "Official medium of exchange"],
        ["HARGA", "PRICE", "Nilai barang", "Value of goods"],
        ["PAJAK", "TAXES", "Iuran ke negara", "Fee to the state"],
        ["SALDO", "FUNDS", "Sisa rekening", "Remaining bank balance"],
        ["BELI", "PURCHASE", "Tukar barang", "Exchange for goods"],
        ["KASIR", "CLERK", "Petugas pembayaran", "Payment officer"],
        ["PROMO", "PROMO", "Diskon belanja", "Shopping discount"],
        ["HUTANG", "DEBT", "Pinjaman uang", "Loaned money"],
        ["BUNGA", "YIELD", "Imbal hasil", "Return yield"],
        ["SAHAM", "STOCK", "Bukti kepemilikan", "Ownership proof"],
        ["LABA", "PROFIT", "Untung bisnis", "Business gain"],
        ["MODAL", "CAPITAL", "Dana usaha", "Business funds"],
        ["BURSA", "MARKET", "Pasar saham", "Stock market"],
        ["KLAIM", "CLAIM", "Tuntutan asuransi", "Insurance demand"],
        ["ASET", "ASSET", "Kekayaan", "Wealth and property"],
        ["BANK", "BANK", "Lembaga keuangan", "Financial institution"],
        ["TUNAI", "CASH", "Uang kontan", "Liquid physical money"],
        ["GIRO", "GIRO", "Cek bank", "Bank check"],
        ["SURAT", "BOND", "Surat utang", "Debt paper"],
        ["KAYA", "RICH", "Banyak harta", "Having lots of wealth"],
        ["CEK", "CHECK", "Perintah bayar", "Payment order"],
        ["BIAYA", "COST", "Pengeluaran", "Expenditure"],
        ["RUGI", "LOSS", "Kerugian bisnis", "Business loss"],
        ["GAJI", "WAGE", "Upah pekerja", "Worker salary"],
        ["KURS", "RATE", "Nilai tukar", "Exchange rate"],
        ["EMAS", "GOLD", "Logam mulia", "Precious metal"],
        ["BONUS", "BONUS", "Tambahan gaji", "Extra wage"],
        ["DISKON", "DISCOUNT", "Potongan harga", "Price cut"],
        ["UNTUNG", "GAIN", "Laba untung", "Profit gain"],
        ["VALAS", "FOREX", "Mata uang asing", "Foreign exchange"],
        ["INFLASI", "INFLATION", "Kenaikan harga", "Price rise"],
        ["DEFLASI", "DEFLATION", "Penurunan harga", "Price drop"],
        ["EKUITAS", "EQUITY", "Nilai bersih", "Net value"],
        ["RESIKO", "RISK", "Potensi rugi", "Loss potential"],
        ["TREN", "TREND", "Kecenderungan", "Market tendency"]
    ];

    for (let lvl = 0; lvl <= 5; lvl++) {
        output += `  ${lvl}: [\n`;
        for (let i = 0; i < 55; i++) {
            // Pick a word randomly, but add some variations to make them unique
            let base = words[Math.floor(Math.random() * words.length)];
            let variation = ""; // Math.random() > 0.5 ? "S" : ""; // avoid destroying real words
            
            let idW = base[0];
            let enW = base[1];
            output += `    { word: { id: "${idW}", en: "${enW}" }, clue: { id: "${base[2]}", en: "${base[3]}" } }${i === 54 ? '' : ','}\n`;
        }
        output += `  ]${lvl === 5 ? '' : ','}\n`;
    }
    output += "};\n";
    return output;
};

fs.writeFileSync('src/components/KokiAnggaranData.ts', generateKokiData());
fs.writeFileSync('src/components/DetektifCuanData.ts', generateDetektifData());
fs.writeFileSync('src/components/FinWordleData.ts', generateWordleData());

console.log("SUCCESS");
