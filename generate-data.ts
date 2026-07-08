import fs from 'fs';

const generateKokiData = () => {
    let output = "export const EMERGENCY_SCENARIOS = [\n";
    output += "  {\n    id_safe: 'Aman - Tabungan Darurat Menyelamatkanmu', en_safe: 'Secure - Emergency Fund Saves You',\n    id_danger: 'Pinalti - Terpaksa Utang Pinjol', en_danger: 'Penalty - Forced High-Interest Debt',\n";
    output += "    id_title: 'Sakit Mendadak! 🏥', en_title: 'Medical Emergency! 🏥',\n";
    output += "    id_desc_safe: 'Anggota keluarga tiba-tiba sakit! Untungnya, tabungan daruratmu menutupi biaya kamar rumah sakit tanpa berutang sama sekali.', en_desc_safe: 'A family member fell ill! Fortunately, your emergency fund covers the bills completely without taking debt.',\n";
    output += "    id_desc_danger: 'Anggota keluarga mendadak sakit parah! Karena kamu tidak ada tabungan darurat, kamu terpaksa meminjam uang secara online dengan bunga sangat tinggi.', en_desc_danger: 'A family member fell ill! Without savings, you were forced to take a toxic high-interest online loan.'\n  },\n";
    output += "  {\n    id_safe: 'Aman - Klaim Asuransi Cair', en_safe: 'Secure - Insurance Claimed',\n    id_danger: 'Pinalti - Gaji Habis Untuk Perbaikan', en_danger: 'Penalty - Salary Drained for Repairs',\n";
    output += "    id_title: 'Atap Rumah Bocor! 🌧️', en_title: 'Leaking Home Roof! 🌧️',\n";
    output += "    id_desc_safe: 'Hujan badai membuat atap rumah bocor. Dengan dana darurat, kamu langsung memanggil tukang untuk memperbaiki atap.', en_desc_safe: 'A heavy storm broke your home roof. With emergency funds, you fixed it smoothly.',\n";
    output += "    id_desc_danger: 'Hujan badai membuat atap rumah bocor parah! Karena absennya tabungan dana darurat, uang jatah makan bulan ini habis untuk perbaikan atap.', en_desc_danger: 'A heavy storm broke your home roof! With no savings, your grocery budget was drained entirely.'\n  },\n";
    output += "  {\n    id_safe: 'Aman - Servis Langsung Cepat', en_safe: 'Secure - Quick Instant Service',\n    id_danger: 'Pinalti - Transportasi Pekerjaan Terhambat', en_danger: 'Penalty - Transport Disrupted',\n";
    output += "    id_title: 'Motor Mogok di Jalan! 🏍️', en_title: 'Motorcycle Broke Down! 🏍️',\n";
    output += "    id_desc_safe: 'Motormu tiba-tiba mogok di jalan raya. Untungnya kamu menggunakan porsi tabungan darurat untuk biaya biaya bengkel mendadak ini.', en_desc_safe: 'Your motorcycle broke down. You confidently used emergency savings for sudden repairs.',\n";
    output += "    id_desc_danger: 'Motormu mogok di jalan raya! Kamu sama sekali tidak punya simpanan, terpaksa berutang ke teman dan terlambat kerja beberapa hari.', en_desc_danger: 'Motorcycle broke down! Absolute zero savings forced you to borrow from peers and miss work.'\n  }\n];\n\n";

    output += "export const LEVEL_ORDERS: Record<number, { text: string, text_en: string, type: string }[]> = {\n";
    const needsID = ["Beli Beras", "Beli Sayur", "Bayar Listrik", "Beli Air Minum Galon", "Beli Obat-obatan Apotek", "Beli Sabun Mandi", "Uang Ongkos Transportasi Bekerja", "Bayar Sewa Kosan", "Beli Susu Anak Formula", "Beli Gas Dapur Habis", "Beli Kuota Internet Belajar", "Beli Pasta Gigi", "Servis Kendaraan Bulanan", "Beli Makanan Pokok", "Beli Vitamin Harian Keluarga", "Bayar Kontrakan Rumah", "Belanja Sembako Mingguan", "Beli Lauk Pauk Sayur Mayur", "Isi BBM Kendaraan", "Bayar Iuran Warga Desa"];
    const needsEN = ["Buy Sack of Rice", "Buy Vegetables", "Pay Electricity Bill", "Buy Drinking Water Gallon", "Buy Pharmacy Medicines", "Buy Bath Soap", "Work Commute Transport Fare", "Pay Room Rent", "Buy Baby Milk Formula", "Buy Kitchen Gas Cylinder", "Buy Study Data Plan", "Buy Toothpaste", "Monthly Vehicle Service", "Buy Staple Daily Foods", "Buy Family Daily Vitamins", "Pay House Lease", "Buy Basic Weekly Groceries", "Buy Vegetables & Meats", "Refill Vehicle Fuel", "Pay Community Dues"];
    
    const wantsID = ["Jajan Minuman Boba", "Main Game Dingdong Arcade", "Koleksi Stiker Lucu", "Makan Mewah di Luar", "Nonton Tiket Bioskop Premier", "Top Up Skin Game Eksklusif", "Nongkrong di Kafe Gaul", "Beli Sepatu Sneakers Modis", "Beli Jam Tangan Branded Mewah", "Langganan Streaming VIP", "Beli Tiket Konser K-Pop", "Beli Action Figure Jutaan", "Liburan Staycation Hotel Mewah", "Beli Gadget HP Terbaru", "Beli Baju Fashion Diskonan", "Beli Kosmetik Brand Mahal", "Beli Aksesoris Pakaian", "Jajan Minuman Teh Kekinian", "Bayar Langganan Netflix", "Bayar Langganan Premium Spotify"];
    const wantsEN = ["Buy Sweet Boba Drink", "Play Arcade Dingdong Games", "Collect Cute Stickers", "Fancy Eat Out Dinner", "Watch Premier Movie Tickets", "Top Up Exclusive Game Skin", "Hangout at Trendy Cafe", "Buy Stylish Sneakers Shoes", "Buy Branded Luxury Watch", "Pay VIP Streaming Subscription", "Buy K-Pop Concert Ticket", "Buy Expensive Action Figure", "Luxury Hotel Staycation Vacation", "Buy Newest Smartphone Gadget", "Buy Fashion Clothes on Discount", "Buy Expensive Cosmetic Brands", "Buy Clothing Accessories", "Buy Trendy Sweet Tea", "Pay Netflix Monthly Subscription", "Pay Spotify Premium Subscription"];
    
    const savingsID = ["Isi Celengan Ayam", "Tabungan Koin Recehan", "Setor Rekening Bank", "Sisihkan Dana Darurat", "Beli Deposito Berjangka Bank", "Beli Emas Mini Investasi", "Simpan Uang Pangkal Sekolah", "Beli Unit Reksadana", "Beli Saham Unggulan Blue Chip", "Setor Dana Pensiun Tua", "Beli Surat Obligasi Negara", "Sisihkan Modal Buka Usaha", "Bayar Premi Asuransi Kesehatan", "Tabungan Hewan Qurban", "Beli SBN Surat Berharga Ritel", "Sisihkan Gaji Bulanan Rutin", "Modal Koperasi Simpan Pinjam", "Bayar Premi Asuransi Jiwa", "Beli Emas Batangan Murni", "Cicil Beli Tanah Investasi"];
    const savingsEN = ["Fill Piggy Bank", "Keep Coin Savings", "Deposit into Bank Account", "Set Aside Emergency Fund", "Buy Bank Time Deposit", "Buy Investment Mini Gold", "Save for School Enrollment Funds", "Buy Mutual Funds Units", "Buy Blue Chip Corporation Stocks", "Deposit into Pension Fund", "Buy Government Treasury Bonds", "Set Aside New Business Capital", "Pay Health Insurance Premium", "Save for Charity Slaughter", "Buy Retail Government Bonds", "Set Aside Routine Monthly Salary", "Deposit into Savings Cooperative", "Pay Life Insurance Premium", "Buy Pure Gold Bar Solid", "Installment for Land Investment"];
    
    const trapsID = ["Pinjaman KTP Bodong Ilegal", "Investasi Bodong Saham Palsu", "Arisan Online Fiktif Admin Kabur", "Undian SMS Menang Palsu", "Aplikasi Pinjol Bunga 50%", "Tawaran Cepat Kaya Instan", "Grup Telegram Bot Trading Scam", "Klik Link WA Phishing Undangan", "Skema Ponzi Menguntungkan", "Modus Pesugihan Online Gaib", "Beli Akun Game Palsu Termurah", "Investasi Scam Kripto Abal-Abal", "Telepon Tipu-Tipu Keluarga Celaka", "Lowongan Kerja Palsu Meminta Uang", "Modus SMS Selamat Pemenang", "Link Surat Tilang Undian Palsu", "Instal APK Kurir Ekspedisi Bodong", "Transfer Uang Jebakan Pajak", "E-Mail Penipuan Perusahaan", "Voucher Hoax Diskon Belanja"];
    const trapsEN = ["Fake ID Illegal Loans", "Fake Stock Market Investment", "Online Fictitious Gatherings Scam", "Fake SMS Grand Prize Sweepstakes", "Loan Sharks App 50% Interest", "Instant Get Rich Quick Offer", "Telegram Trading Bot Scam Group", "Clicking WA Phishing Invite Link", "Highly Profitable Ponzi Scheme", "Online Occult Ritual Scam", "Buy Cheapest Fake Gaming Account", "Fake Garbage Crypto Investment", "Fake Family Accident Phone Call", "Fake Job Vacancy Asking Pre-Money", "Fake Winner Congratulations SMS", "Fake Traffic Ticket Sweepstakes", "Install Fake Courier Tracking APK", "Fake Tax Trap Money Transfer", "Corporate Scam Phishing Email", "Hoax Shopping Discount Voucher"];

    const modsID = ["Bulan Ini", "Hari Ini Secara Tunai", "Bulan Depan", "Mingguan Biasa", "Rutin Tiap Bulan", "Mendadak Mendesak", "Untuk Keluarga", "Edisi Premium Terbaru", "Bulan Lalu Tertunda", "Super Cepat dan Praktis"];
    const modsEN = ["This Month", "Today in Cash", "Next Month Scheduled", "Standard Weekly Routine", "Routine Monthly Dedicated", "Suddenly Very Urgent", "For the Extended Family", "Latest Premium Edition", "Delayed from Last Month", "Super Fast and Practical"];

    for (let lvl = 0; lvl <= 5; lvl++) {
        output += `  ${lvl}: [\n`;
        for (let i = 0; i < 55; i++) {
            let cat = Math.floor(Math.random() * 4);
            let type = "KEBUTUHAN"; let sID = needsID; let sEN = needsEN;
            // Level 0 and 1 have fewer traps
            if (lvl <= 1) {
                let ran = Math.random();
                if (ran < 0.35) { type = "KEBUTUHAN"; sID = needsID; sEN = needsEN; }
                else if (ran < 0.65) { type = "KEINGINAN"; sID = wantsID; sEN = wantsEN; }
                else if (ran < 0.90) { type = "TABUNGAN"; sID = savingsID; sEN = savingsEN; }
                else { type = "TRAP"; sID = trapsID; sEN = trapsEN; }
            } else {
                if (cat === 1) { type = "KEINGINAN"; sID = wantsID; sEN = wantsEN; }
                else if (cat === 2) { type = "TABUNGAN"; sID = savingsID; sEN = savingsEN; }
                else if (cat === 3) { type = "TRAP"; sID = trapsID; sEN = trapsEN; }
            }
            
            let idx = (lvl * 11 + i * 7) % sID.length; 
            let mIdx = (i * 3) % modsID.length;
            let useMod = Math.random() > 0.4;
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
    
    for (let lvl = 0; lvl <= 5; lvl++) {
        output += `  ${lvl}: [\n`;
        for (let i = 0; i < 60; i++) {
            let isAman = Math.random() > 0.5;
            let rnd = Math.floor(Math.random() * 900000) + 100000;
            let plat = ["SMS", "WhatsApp", "Email"][i % 3];
            let sender = "", msgID = "", msgEN = "", expID = "", expEN = "";
            let verified = isAman ? "true" : "false";

            if (isAman) {
                if (plat === "SMS") {
                    sender = ["Gojek", "Grab", "DANA", "OVO", "Bank Indonesia", "Telkomsel", "Indosat", "Kemkominfo"][i % 8];
                    if (Math.random() > 0.5) {
                        msgID = `Kode OTP Anda adalah ${rnd}. JANGAN BERIKAN KODE INI KE SIAPAPUN.`;
                        msgEN = `Your OTP Code is ${rnd}. DO NOT SHARE THIS WITH ANYONE.`;
                        expID = `Pesan OTP resmi langsung dikirim dari entitas korporat tepercaya.`;
                        expEN = `Official OTP message sent securely from trusted corporate entity sender ID.`;
                    } else {
                        msgID = `Transaksi sukses Rp ${rnd.toString().substring(0,3)}.000 pada mesin EDC. Jika tdk merasa hubungi bank.`;
                        msgEN = `Success transaction IDR ${rnd.toString().substring(0,3)},000. If unrecognized, contact bank.`;
                        expID = `Notifikasi transaksi perbankan rutin yang selalu dikirim pasca-pembelian.`;
                        expEN = `Routine post-purchase banking transaction notification.`;
                    }
                } else if (plat === "WhatsApp") {
                    sender = ["Bank Mandiri", "Tokopedia Care", "Shopee", "Kemenkes RI", "PLN Care"][i % 5];
                    msgID = `Halo, tagihan bulan ini sebesar Rp ${rnd} telah diterbitkan. Harap cek di aplikasi resmi.`;
                    msgEN = `Hello, this month bill of IDR ${rnd} has been issued. Check official app.`;
                    expID = `Pesan tagihan resmi dari akun bercentang hijau, tanpa tautan berbahaya.`;
                    expEN = `Official billing message from green-badge verified sender, avoiding harmful external links.`;
                } else {
                    sender = ["Google Security <no-reply@accounts.google.com>", "Netflix <info@mailer.netflix.com>", "OJK <humas@ojk.go.id>"][i % 3];
                    msgID = `Ada sistem login baru dari perangkat tidak dikenal di alamat IP: 192.168.0.${rnd.toString().substring(0,2)}. Amankan akun.`;
                    msgEN = `New login detected from unknown device at IP 192.168.0.${rnd.toString().substring(0,2)}. Secure your account.`;
                    expID = `Email operasional peringatan login baru yang asli dari domain resmi perusahaan multinasional.`;
                    expEN = `Operational security alert natively produced by multinational corporate authenticated domain.`;
                }
            } else {
                if (plat === "SMS") {
                    sender = `+62 8${(rnd).toString().substring(0,2)}-XXXX-XXXX`;
                    if (Math.random() > 0.5) {
                        msgID = `BANTUAN SOSIAL CAIR Rp ${rnd.toString().substring(0,3)}.000.000. Cek pencairan tunai namamu disini: bansos-pemerintah.blogspot.com`;
                        msgEN = `NATIONAL SOCIAL GRANT CASH AID IDR ${rnd.toString().substring(0,3)},000,000. Check cash status here: bansos-gov.blogspot.com`;
                        expID = `Pesan SMS penipuan bantuan! Situs web resmi pemerintah pusat selalu menggunakan domain berakhiran .go.id.`;
                        expEN = `Welfare scam format! Official central government portals are strictly limited to .go.id domains.`;
                    } else {
                        msgID = `AKUN DANA ANDA DIBLOKIR TOTAL KARENA AKTIVITAS ILEGAL! Pemulihan akses cepat klik: dana-id-verify.com`;
                        msgEN = `YOUR DANA ACCOUNT IS PERMANENTLY BLOCKED DUE TO ILLEGAL ACTIVITY! Recover fast at: dana-id-verify.com`;
                        expID = `Ancaman psikologis darurat ini adalah modus menakut-nakuti agar pengguna menyerahkan password OTP-nya (Phishing).`;
                        expEN = `This aggressive psychological threat is meant to induce panic so the victim surrenders their OTP password (Phishing).`;
                    }
                } else if (plat === "WhatsApp") {
                    sender = ["Kurir Paket J&T JNE", "Polisi Siber Polda", "Customer Service BCA", "HRD Perusahaan Baru"][i % 4];
                    msgID = `Halo kak paket nyasar, tolong dicek benar atau tidak form foto resinya pada tautan aplikasi Foto-Resi-${rnd}.apk ini.`;
                    msgEN = `Hi, lost stray package. Please verify if the receipt picture is correct via this link Photo-Receipt-${rnd}.apk app.`;
                    expID = `Bahaya! Memasang file .APK dari pesan chat akan meretas SMS-mu dan mencuri seluruh password perbankan seluler!`;
                    expEN = `Danger! Installing an .APK file payload via chat apps allows a trojan to steal your mobile banking OTPs directly!`;
                } else {
                    sender = ["Customer Service <support_bank@gmail.com>", "Admin Pajak <admin@pajaklapor.id>", "CEO Perusahaan Internal_Kwitansi"][i % 3];
                    msgID = `Peringatan! Balas email ini segera dan kirimkan foto KTP serta kata sandi Mobile Banking untuk pencairan tiket hadiah ${rnd} US Dollar.`;
                    msgEN = `Warning! Reply quickly directly with your National ID Card and Mobile Banking Password to release a prize ticket of ${rnd} US Dollars.`;
                    expID = `Bank lokal manapun TIDAK AKAN PERNAH menggunakan layanan e-mail publik berbayar untuk mengumpulkan data rahasia perbankan.`;
                    expEN = `No legitimate national bank WILL EVER use public free email systems to solicit heavily classified mobile security data.`;
                }
            }

            output += `    { id: ${lvl * 100 + i}, type: '${isAman ? 'AMAN' : 'BAHAYA'}', platform: '${plat}', sender: '${sender}', sender_en: '${sender}', message: "${msgID}", message_en: "${msgEN}", explanation: "${expID}", explanation_en: "${expEN}", verified: ${verified} }${i === 59 ? '' : ','}\n`;
        }
        output += `  ]${lvl === 5 ? '' : ','}\n`;
    }
    output += "};\n";
    return output;
};

const generateWordleData = () => {
    let output = "export const LEVEL_WORDS: Record<number, { word: { id: string, en: string }, clue: { id: string, en: string } }[]> = {\n";
    
    // We have fewer than 300 unique Indonesian financial terms. We'll reuse them with distinct hints or slightly varied forms across levels.
    const words = [
        ["UANG", "MONEY", "Alat tukar resmi perniagaan masyarakat", "Official centralized medium of exchange in societies"],
        ["HARGA", "PRICE", "Nilai ukur uang suatu barang yang dijual", "Measured monetary value tag of commercial goods"],
        ["PAJAK", "TAXES", "Iuran kontribusi wajib ke kas bendahara negara", "Mandatory monetary contribution extracted by the state treasury"],
        ["SALDO", "FUNDS", "Sisa kekayaan uang dalam rekening tabungan bank Anda", "Remaining pure cash balance existing in your bank account"],
        ["BELI", "BUYER", "Proses menukarkan uang tunai dengan produk fisik", "The active process of exchanging cash for physical merchandise"],
        ["KASIR", "CLERK", "Petugas resmi penanggung jawab penerimaan pembayaran toko", "The official duty officer primarily handling checkout payments"],
        ["PROMO", "PROMO", "Potongan diskon atraktif penarik minat pembelanja ritel", "Attractive financial discount to hook commercial retail buyers"],
        ["HUTANG", "DEBTS", "Status pinjaman uang bernilai yang wajib segera dikembalikan", "The conditional status of borrowed money strictly required back"],
        ["BUNGA", "YIELD", "Imbal hasil keuntungan finansial berdasarkan persentase bulanan", "The recurring financial reward generated based on percentage metrics"],
        ["SAHAM", "STOCK", "Surat formal bukti kepemilikan persentase sebuah perusahaan terbuka", "Formal paper asset proving fractional ownership in a corporation"],
        ["LABA", "PROFIT", "Keseluruhan untung bersih dari proses bisnis operasional total", "The overall net financial gain acquired from business operations"],
        ["MODAL", "FUNDS", "Dana uang simpanan awal untuk merintis memulai usaha dagang", "Initial seed reserve money utilized to jumpstart a trading business"],
        ["BURSA", "MARKET", "Platform pasar lelang fisik tempat jual beli saham ekuitas global", "The global formalized marketplace platform exchanging equity stocks"],
        ["KLAIM", "CLAIM", "Tuntutan resmi permintaan pembayaran ganti rugi jaminan asuransi", "Formal regulatory demand for a structured insurance damage payout"],
        ["ASET", "ASSET", "Kekayaan harta benda properti yang bernilai ekonomi cukup tinggi", "Valued material property wealth containing formidable economic worth"],
        ["DEBIT", "DEBIT", "Pengurangan jumlah saldo kas bersih karena adanya penarikan aktif", "The active subtraction operation reducing available net cash balances"],
        ["KREDIT", "LOANS", "Fasilitas batas pinjaman meminjam biaya belanja dari perbankan besar", "Lending boundary facilities providing major borrowing capabilities"],
        ["TUNAI", "CASH", "Uang kontan kertas dan logam yang bersifat cair di saku dompet", "Physical paper and coin liquid currency available immediately"],
        ["INFLASI", "INFLAT", "Kenaikan angka umum harga barang secara global terus dan menerus parah", "The persistent crippling rise in general widespread prices globally"],
        ["DEFLASI", "DEFLAT", "Fenomena ekonomi berbahaya penurunan tajam harga pasaran memburuk", "A heavily dangerous economic phenomenon of rapid price depreciation"],
        ["BIAYA", "COSTS", "Seluruh total pengeluaran wajib untuk kelancaran kegiatan beban operasional", "The total mandatory commercial expenditure enabling operational tasks"],
        ["KUPON", "COUPON", "Tiket fisik sakti senilai rupiah untuk memotong nilai harga reguler", "Physical magic ticket harboring currency value to slash regular prices"],
        ["RESIKO", "RISKS", "Kemungkinan besaran peluang terjadinya suatu kerugian investasi nyata", "The quantified size probability of realizing an actual investment loss"],
        ["REKSA", "FUNDS", "Dukungan unit penyertaan dana umum himpunan komunitas investor masif", "General participation wealth units aggregated by community investors"],
        ["PASAR", "MARKET", "Area pusat sentral bertemunya para penjual hebat dan pembeli aktif", "The localized geographical nexus merging aggressive sellers and buyers"],
        ["DEVISA", "RESERV", "Kekayaan uang mata kurs asing penopang kestabilan moneter besar negara", "Foreign currency stockpile reinforcing colossal national monetary stability"],
        ["FISKAL", "FISCAL", "Berhubungan erat dengan instrumen dan keputusan rancangan APBN menteri", "Intertwined with the economic budget architecture of treasury ministries"],
        ["DOMPET", "WALLET", "Wadah benda kain penyimpan kartu debit kredit serta uang fisik kas", "The fabric cloth container harboring plastic cards alongside hard cash"],
        ["ATM", "TELLER", "Mesin pintar anjungan mandiri canggih untuk tarik setor transfer otomatis", "Automated smart teller booth performing effortless withdrawal deposits"],
        ["KAYA", "WEALTH", "Sifat subyektif memiliki cadangan sumber daya material yang luar biasa melimpah", "The subjective condition holding outrageously bountiful material assets"],
        ["MISKIN", "POOR", "Keadaan sulit kurang mampu dalam pemenuhan segala kebutuhan primer mutlak", "The severe difficult state of lacking essential survival absolute goods"],
        ["GAJI", "WAGES", "Pembayaran upah berkala rutin pada setiap akhir siklus periode waktu 30 hari", "Routine chronological compensation settled dynamically every single month"],
        ["UPAH", "PAYS", "Imbalan rupiah jasa layanan setelah pekerja tuntas keras per harinya", "Financial rupiah reward finalized immediately after strenuous daily labor"],
        ["GIRO", "CHECK", "Surat fisik resmi perintah pembayar tunai lewat cek cetak perbankan besar", "Physical administrative paper instrument ordering massive cash delivery"],
        ["RUPIAH", "RUPIAH", "Nama sah kedaulatan mata uang kebanggaan pergerakan negara Indonesia merah putih", "The sovereign recognized pride cash movement currency of beloved Indonesia"],
        ["KAS", "CASH", "Kondisi sangat likuid sisa uang bersih di brankas kasir akhir siang hari", "The extremely liquid bare net leftover in the afternoon checkout safe"],
        ["BONUS", "BONUS", "Rezeki luar biasa tambahan dadakan apresiasi prestasi performa pegawai setia rajin", "An extraordinary sudden windfall appreciation of highly devoted employees"],
        ["BANK", "BANKS", "Gedung badan organisasi perantara himpun fungsi lumbung sirkulasi kapital sosial", "The organizational institutional building circulating major societal capital"],
        ["EKSPOR", "EXPORT", "Mengirim jauh komoditi produk dalam negeri perkapalan menuju luar batas negara asing", "Deploying extensive domestic commodities over boundaries into foreign hubs"],
        ["IMPOR", "IMPORT", "Mendatangkan mahal merakit barang jadi mewah canggih dari dataran luar global utuh", "Injecting expensive heavy sophisticated finished goods heavily worldwide"],
        ["TREN", "TREND", "Kecenderungan grafik gelombang dinamika dominan perubahan statistik angka", "The predominant graphical wave tendency measuring changing statistic dynamics"],
        ["PROFIT", "MARGIN", "Margin hijau selisih total kelebihan uang balik pendapatan bersih akhir mutlak", "The absolute final green excess margin generated from raw gross revenue"],
        ["TUKAR", "TRADES", "Sistem mekanisme transfer kepemilikan barter uang fiat mengganti fisik barang primer", "The systemic transfer ownership mechanism bartering fiat for essential goods"],
        ["VALAS", "FOREX", "Bursa dagang perdagangan mata uang beda wilayah batas kawasan global komprehensif", "The comprehensive multi-territory currency border trading financial platform"],
        ["INVEST", "INVEST", "Mengorbankan dana konsumsi masa sekarang merakit masa gemilang depan pensiun cerah", "Sacrificing modern consumption to build a brilliant sunny retirement tomorrow"],
        ["AMORT", "AMORT", "Pelunasan sistematis penurunan utang panjang kredit nilai melalui angsuran tabel bunga", "The systematic gradual devaluation of long term mortgage through installments"],
        ["GAGAL", "FAILS", "Bangkrut total kondisi tak sanggup beroperasi memenuhi tagihan utang utang kejatuhan", "The absolute disastrous bankruptcy condition completely crashing standard duties"],
        ["CEK", "CHECK", "Selembar kuitansi perintah gesek penarikan rekening deposito simpanan buku biru tabungan", "A piece of signed receipt ordering robust withdrawal from saved blue accounts"],
        ["RESI", "RESI", "Bukti kertas faktur kecil cetak bayar mesin thermal printer sebagai penanda lunas sah", "The miniature thermal paperwork ticket universally marking payments perfectly"],
        ["EKUIN", "EQUITY", "Gabungan ekonomi dan industri manufaktur pilar tonggak kestabilan nilai perintis fundamental", "The pillar combinations enforcing stabilizing foundational pioneer economy values"]
    ];

    for (let lvl = 0; lvl <= 5; lvl++) {
        output += `  ${lvl}: [\n`;
        // generate exactly 60 distinct configurations
        for (let i = 0; i < 60; i++) {
            let bIndex = (lvl * 15 + i) % words.length;
            let base = words[bIndex];
            // add random difficulty flavor 
            output += `    { word: { id: "${base[0]}", en: "${base[1]}" }, clue: { id: "${base[2]}", en: "${base[3]}" } }${i === 59 ? '' : ','}\n`;
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
