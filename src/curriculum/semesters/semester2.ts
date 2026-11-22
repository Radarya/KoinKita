import { SemesterSpec } from '../types';
import {
  REG_SOURCES,
  buildUAS,
  buildUTS,
  card,
  mkDetektifLesson,
  mkKokiLesson,
  mkPairLesson,
  mkQuizLesson,
  mkStoryLesson,
  mkWordleLesson,
} from '../helpers';

export const SEMESTER_2: SemesterSpec = {
  id: 'S2',
  semesterNumber: 2,
  titleId: 'Semester 2: Perbankan, Pembayaran Digital, Pendapatan & Anggaran Harian',
  titleEn: 'Semester 2: Banking, Digital Payments, Income & Daily Budgeting',
  subtitleId: 'Kelola rekening & mutasi, BI-FAST/SKNBI/RTGS, QRIS MPM/CPM aman, hingga Sinking Fund.',
  units: [
    // ================= UNIT 6 =================
    {
      id: 'S2.U6',
      unitNumber: 6,
      semesterId: 'S2',
      titleId: 'Dunia Perbankan & Rekening Dasar',
      titleEn: 'Banking Basics & Account Statements',
      regulationMeta: REG_SOURCES.PERBANKAN_SIMPEL,
      guidebook: {
        summaryId:
          'Tabungan bank memiliki beberapa jenis: SimPel (Simpanan Pelajar bebas/rendah admin), Tabungan Reguler untuk transaksi harian, dan Tabungan Rencana/autodebit. Saldo kecil yang mengendap dapat menyusut oleh biaya admin bulanan bank. Membaca mutasi rekening (CR = uang masuk / DB = uang keluar) penting agar cepat menyadari potongan tak dikenal.',
        summaryEn: 'Bank account types, admin fee erosion on low balances, and reading CR/DB statements.',
        keyRulesId: [
          'CR (Kredit) pada mutasi tabungan berarti dana MASUK; DB (Debet) berarti dana KELUAR.',
          'Jika saldo kecil (mis. Rp150rb) dibiarkan diam di rekening berbiaya admin Rp15rb/bln, nominalnya cepat menyusut.',
          'Pilih SimPel atau tabungan berbiaya admin rendah untuk saldo awal pelajar.',
        ],
        keyRulesEn: [
          'CR marks money coming in; DB marks money going out.',
          'Monthly maintenance fees erode idle small balances.',
          'Pick low-fee accounts like SimPel when starting small.',
        ],
        disclaimerId: 'Referensi: Program SimPel OJK dan praktik administrasi tabungan perbankan umum Indonesia.',
        disclaimerEn: 'Regulatory Reference: OJK SimPel guidelines & Indonesian retail banking practices.',
      },
      stages: [
        {
          id: 'S2.U6.ST1',
          stageNumber: '6.1',
          titleId: 'Rekening Bank, Bunga vs Biaya Admin & Mutasi',
          titleEn: 'Accounts, Fees & Statements',
          skipExamId: 'SKIP.S2.U6.ST1',
          paths: [
            mkWordleLesson('S2.U6.ST1.P1', 'Kosakata Inti Rekening Bank', 'Core Banking Terms', 'Mengenal kosakata bank, saldo, mutasi, & admin.', [
              { word: 'BANK', clueId: 'Lembaga keuangan berizin tempat menyimpan dana & bertransaksi resmi.', clueEn: 'Licensed financial institution.', definitionId: 'Badan usaha penghimpun simpanan masyarakat dan penyalur kredit di bawah pengawasan OJK.', definitionEn: 'Supervised deposit-taking bank.', exampleId: 'Menabung di bank peserta LPS lebih aman untuk dana jangka panjang daripada di dompet fisik.', exampleEn: 'Keeping long-term savings in a licensed bank.' },
              { word: 'SALDO', clueId: 'Sisa jumlah uang yang tercatat tersedia di dalam rekening.', clueEn: 'Available account balance.', definitionId: 'Nilai uang aktif yang tersisa setelah seluruh pemasukan (CR) dikurangi pengeluaran (DB).', definitionEn: 'Net funds remaining in an account.', exampleId: 'Mengecek saldo sebelum menggesek kartu debit di kasir.', exampleEn: 'Checking balance before debit checkout.' },
              { word: 'MUTASI', clueId: 'Catatan riwayat seluruh uang masuk dan uang keluar di rekening.', clueEn: 'Account transaction ledger.', definitionId: 'Daftar kronologis transaksi debet dan kredit pada buku tabungan atau m-banking.', definitionEn: 'Chronological record of credits and debits.', exampleId: 'Membaca mutasi mingguan untuk mendeteksi potongan autodebit yang lupa dibatalkan.', exampleEn: 'Checking statements for forgotten autodebits.' },
              { word: 'ADMIN', clueId: 'Biaya pemeliharaan rutin bulanan atau layanan transaksi pada rekening.', clueEn: 'Monthly bank account maintenance fee.', definitionId: 'Biaya tetap bulanan bank atas pengelolaan rekening dan fasilitas kartu ATM.', definitionEn: 'Routine account servicing fee.', exampleId: 'Tabungan SimPel membantu pelajar terhindar dari potongan admin bulanan besar.', exampleEn: 'SimPel accounts reduce admin drag on student savings.' },
            ]),
            mkPairLesson('S2.U6.ST1.P2', 'Jenis Rekening & Kecocokan Kebutuhan', 'Match Bank Account Products', 'Mencocokkan produk rekening dengan kebutuhan pengguna.', {
              mode: 'pairs',
              instructionId: 'Cocokkan jenis produk tabungan bank dengan profil kebutuhan yang paling tepat.',
              instructionEn: 'Match each bank account type to its ideal purpose.',
              pairs: [
                { id: 'rk1', leftId: 'Tabungan SimPel (Simpanan Pelajar)', leftEn: 'SimPel Student Savings', rightId: 'Pelajar/siswa dengan setoran ringan & bebas/rendah biaya admin', rightEn: 'Students needing low deposit & minimal admin fee' },
                { id: 'rk2', leftId: 'Tabungan Reguler / Harian', leftEn: 'Regular Daily Account', rightId: 'Kebutuhan terima gaji, transfer rutin, & transaksi kartu debit/QRIS harian', rightEn: 'Daily payroll, transfers & debit transactions' },
                { id: 'rk3', leftId: 'Tabungan Rencana / Autodebit', leftEn: 'Scheduled Savings Plan', rightId: 'Menabung otomatis berkala tiap bulan untuk target tertentu terjadwal', rightEn: 'Automated monthly goal saving with lock discipline' },
              ],
              explanationCard: card({
                why: 'Setiap produk tabungan memiliki fitur, limit transaksi, dan struktur biaya administrasi yang berbeda.',
                type: 'dynamic_fact',
                reg: REG_SOURCES.PERBANKAN_SIMPEL,
                next: 'Jangan gunakan rekening berbiaya admin besar hanya untuk menyimpan saldo kecil yang jarang bergerak.',
              }),
            }, { st: 'dynamic_fact', reg: REG_SOURCES.PERBANKAN_SIMPEL }),
            mkQuizLesson('S2.U6.ST1.P3', 'Hitung Saldo Kecil Tergerus Biaya Admin', 'Admin Fee Erosion Math', 'Menghitung dampak biaya admin bulanan terhadap saldo kecil mengendap.', [
              {
                id: 's2u6s1p3_q1',
                promptId:
                  'Asumsi simulasi: saldo awal tabungan reguler Rp150.000, tanpa transaksi masuk/keluar baru, bunga bersih tetap Rp50/bulan, sedangkan biaya admin rekening + kartu = Rp15.000/bulan. Berapa sisa saldo setelah 6 bulan mengendap?',
                promptEn: 'Start Rp150,000, net interest Rp50/mo, admin fee Rp15,000/mo, no deposits for 6 months. Ending balance?',
                optionsId: ['Rp60.300', 'Rp150.300', 'Rp90.000', 'Rp135.000'],
                optionsEn: ['Rp60,300', 'Rp150,300', 'Rp90,000', 'Rp135,000'],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Ketika bunga tabungan ritel jauh lebih kecil daripada biaya admin tetap bulanan, saldo kecil yang mengendap pasti terkikis setiap bulan.',
                  calc: 'Perubahan/bulan = +Rp50 − Rp15.000 = -Rp14.950. Dalam 6 bln = -Rp89.700 → Rp150.000 − Rp89.700 = Rp60.300.',
                  assume: 'Simulasi mengasumsikan biaya admin & bunga neto konstan tiap bulan tanpa tambahan setoran.',
                  type: 'simulation_assumption',
                  next: 'Untuk pelajar/pemula dengan saldo kecil, pilih rekening bebas/rendah biaya admin seperti Tabungan SimPel.',
                }),
              },
            ], { st: 'simulation_assumption' }),
            mkStoryLesson('S2.U6.ST1.P4', 'Audit Mutasi Bulan Pertama', 'First Month Statement Audit', 'Membaca CR/DB, mencabut autodebit tak dikenal, & memindah saldo ke rekening rendah biaya.', {
              titleId: 'Audit Mutasi Bulan Pertama',
              subtitleId: 'Simulasi 3 Babak Membaca CR/DB & Efisiensi Biaya Rekening',
              durationLabelId: '3 Babak Simulasi',
              initialState: { cash: 3_000_000, emergencyFund: 150_000, sinkingFund: 0, debt: 0, netWorth: 3_150_000 },
              chapters: [
                {
                  id: 'u6_b1',
                  periodLabelId: 'Babak 1: Cek Kode CR vs DB',
                  narrativeId: 'Mutasi rekening menunjukkan: CR +Rp3.500.000 (Gaji), DB -Rp15.000 (Admin), DB -Rp75.000 (Autodebit App Trial), DB -Rp500.000 (Belanja). Kamu mengira ada uang masuk tambahan Rp75.000?',
                  choices: [
                    { id: 'c1', labelId: 'Sadar bahwa DB -Rp75.000 adalah UANG KELUAR (autodebit langganan) yang harus segera dicek sumbernya', feedbackId: 'Benar! CR = Kredit masuk, DB = Debet keluar dari tabunganmu.', deltas: { scoreSecurity: 25, scoreCashflow: 20 }, isRecommended: true },
                    { id: 'c2', labelId: 'Biarkan saja karena semua potongan kecil otomatis berarti tabungan bertambah', feedbackId: 'Keliru! DB berarti dana terpotong setiap bulan jika langganan tidak dibatalkan.', deltas: { cash: -75_000, scoreCashflow: -15 } },
                  ],
                },
                {
                  id: 'u6_b2',
                  periodLabelId: 'Babak 2: Hentikan Autodebit Tak Terpakai',
                  narrativeId: 'Ternyata DB -Rp75.000 itu dari langganan aplikasi hiburan yang lupa dibatalkan setelah masa uji coba gratis selesai.',
                  choices: [
                    { id: 'c1', labelId: 'Batalkan langganan lewat menu pengaturan aplikasi / hubungi CS resmi bank untuk menghentikan autodebit ke depan', feedbackId: 'Berhasil menghemat Rp75.000/bulan (Rp900.000/tahun)!', deltas: { cash: 75_000, scoreCashflow: 25, scoreGoal: 20 }, isRecommended: true },
                    { id: 'c2', labelId: 'Hapus ikon aplikasinya dari layar HP tanpa membatalkan langganan di akun/toko aplikasi', feedbackId: 'Menghapus aplikasi saja TIDAK menghentikan tagihan autodebit bulanan!', deltas: { cash: -75_000, scoreGoal: -15 } },
                  ],
                },
                {
                  id: 'u6_b3',
                  periodLabelId: 'Babak 3: Rekening Mengendap Mahasiswa',
                  narrativeId: 'Adikmu punya saldo tabungan pelajar Rp150.000 di rekening lama beradmin Rp15.000/bulan.',
                  choices: [
                    { id: 'c1', labelId: 'Pindahkan ke tabungan SimPel / tabungan rendah admin agar pokok tabungan tidak habis terpotong biaya admin', feedbackId: 'Tepat! Saldo kecil aman berkembang tanpa tergerus admin.', deltas: { scoreCashflow: 25, scoreRisk: 20 }, isRecommended: true },
                    { id: 'c2', labelId: 'Biarkan mengendap 1 tahun tanpa dicek lagi', feedbackId: 'Dalam setahun saldo Rp150.000 berisiko mendekati nol terpotong admin Rp180.000!', deltas: { netWorth: -150_000, scoreRisk: -20 } },
                  ],
                },
              ],
              explanationCard: card({
                why: 'Rajin memeriksa mutasi CR/DB dan menyesuaikan jenis rekening menyelamatkan kas dari kebocoran diam-diam.',
                type: 'dynamic_fact',
                reg: REG_SOURCES.PERBANKAN_SIMPEL,
                next: 'Jadwalkan cek mutasi minimal seminggu sekali lewat m-banking resmi.',
              }),
            }),
          ],
        },
      ],
    },

    // ================= UNIT 7 =================
    {
      id: 'S2.U7',
      unitNumber: 7,
      semesterId: 'S2',
      titleId: 'Kartu Debit, Transfer & Virtual Account',
      titleEn: 'Debit Cards, Transfers & Virtual Accounts',
      regulationMeta: REG_SOURCES.TRANSFER_BI,
      guidebook: {
        summaryId:
          'Kartu Debit memotong langsung saldo tabungan, sedangkan Kartu Kredit memakai limit pinjaman bank. Pemilihan kanal transfer antarbank di Indonesia bergantung pada kombinasi nominal, urgensi waktu, dan jam kerja: BI-FAST (real-time 24/7, batas BI maks Rp250 juta/tx tergantung kebijakan bank peserta, biaya maks Rp2.500), SKNBI (kliring terjadwal jam kerja bank s.d. Rp1 miliar/tx), dan BI-RTGS (penyelesaian seketika pada jam kerja BI untuk nominal mendesak > Rp100 juta). Virtual Account (VA) memudahkan verifikasi otomatis.',
        summaryEn: 'Debit vs credit card mechanics and picking BI-FAST, SKNBI, BI-RTGS, or Virtual Account properly.',
        keyRulesId: [
          'BI-FAST aktif 24/7 maks Rp250 juta/tx (ketentuan BI; batas transaksi harian di app dapat mengikuti limit tiap bank peserta).',
          'BI-RTGS untuk transfer besar mendesak > Rp100 juta saat jam operasional BI; SKNBI untuk kliring terjadwal non-mendesak/massal hingga Rp1 miliar.',
          'Jangan pernah melepas barang dagangan hanya karena screenshot transfer; cek saldo/notifikasi langsung di sistem/dashboard sendiri.',
        ],
        keyRulesEn: [
          'BI-FAST runs 24/7 up to Rp250M/tx subject to bank limits.',
          'BI-RTGS is for urgent >Rp100M within BI hours; SKNBI is scheduled clearing up to Rp1B.',
          'Verify incoming settlements inside your own banking app or VA dashboard, never screenshots.',
        ],
        disclaimerId: 'Referensi Regulasi: Bank Indonesia (BI-FAST, SKNBI, BI-RTGS); limit & biaya ritel dapat disesuaikan masing-masing bank peserta.',
        disclaimerEn: 'Regulatory Reference: Bank Indonesia payment rails.',
      },
      stages: [
        {
          id: 'S2.U7.ST1',
          stageNumber: '7.1',
          titleId: 'Kartu Debit & Keamanan ATM / EDC',
          titleEn: 'Debit Card & ATM/EDC Safety',
          skipExamId: 'SKIP.S2.U7.ST1',
          paths: [
            mkQuizLesson('S2.U7.ST1.P1', 'Mekanisme Debit vs Kartu Kredit', 'Debit vs Credit Mechanics', 'Membedakan sumber dana Kartu Debit vs Kartu Kredit saat transaksi.', [
              {
                id: 's2u7s1p1_q1',
                promptId: 'Dina menggesek kartu saat saldo rekeningnya Rp200.000 untuk membayar belanja Rp350.000. Kartu jenis apa yang langsung ditolak mesin EDC karena saldo tidak mencukupi?',
                promptEn: 'Saldo Rp200,000, purchase Rp350,000. Which card declines immediately for insufficient balance?',
                optionsId: [
                  'Kartu Debit reguler karena langsung menarik saldo rekening pemilik',
                  'Kartu Kredit dengan sisa limit Rp4 juta karena ditagih akhir bulan',
                  'Kartu Uang Elektronik (e-money) fisik bersaldo tersedia Rp500.000',
                  'Kartu Debit khusus karena bank otomatis memberi talangan tanpa syarat',
                ],
                optionsEn: [
                  'Regular Debit Card because it pulls directly from owner balance',
                  'Credit Card with Rp4M open limit billed at statement cycle',
                  'Stored-value e-money card holding Rp500,000 active chip balance',
                  'Priority Debit Card because banks cover overdrafts automatically',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Kartu Debit terhubung langsung dengan saldo tabungan pemilik sehingga transaksi tidak dapat melebihi dana yang tersedia.',
                  next: 'Kendalikan limit harian kartu debit agar aman jika suatu saat kartu hilang.',
                }),
              },
              {
                id: 's2u7s1p1_q2',
                promptId: 'Apa risiko finansial paling besar menggunakan Kartu Kredit bila tidak melunasi penuh setiap jatuh tempo (hanya membayar pembayaran minimum)?',
                promptEn: 'Main financial risk of paying only minimum due on a credit card?',
                optionsId: [
                  'Sisa pokok tagihan dikenai bunga berbunga bulanan hingga utang membengkak',
                  'Bunga bulanan dihapus otomatis selama pembayaran minimum dibayar tepat waktu',
                  'Masa bebas bunga (grace period) tetap berlaku penuh pada sisa tagihan pokok',
                  'Denda dan bunga baru dihitung di akhir tahun bila kartu masih belum ditutup',
                ],
                optionsEn: [
                  'Unpaid principal accumulates monthly compounding interest rapidly',
                  'Monthly interest is waived automatically when minimum payment clears on time',
                  'Zero-interest grace period stays intact on the remaining unpaid principal',
                  'Penalties and interest apply only at year-end if balance remains open',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Kartu kredit hanyalah alat bayar pinjaman jangka pendek; jika dibayar penuh tepat waktu tidak menumpuk bunga berbunga, tetapi jika dicicil minimum bunganya mahal.',
                  next: 'Gunakan kartu kredit hanya jika mampu melunasi penuh 100% setiap bulan.',
                }),
              },
            ]),
            mkKokiLesson('S2.U7.ST1.P2', 'Kebiasaan Aman di ATM & Kasir EDC', 'Safe ATM & EDC Habits', 'Memilah kebiasaan transaksi fisik aman vs berisiko.', {
              instructionId: 'Pilah perilaku bertransaksi menggunakan kartu di ATM & mesin kasir EDC ke Kebiasaan Aman vs Berisiko.',
              instructionEn: 'Sort ATM & EDC card handling actions.',
              buckets: [
                { id: 'AMAN', labelId: 'KEBIASAAN AMAN', labelEn: 'SAFE HABIT', icon: '🔒' },
                { id: 'RISIKO', labelId: 'BERISIKO / JANGAN DILAKUKAN', labelEn: 'RISKY / AVOID', icon: '🚨' },
              ],
              items: [
                { id: 'at1', contextTagId: 'Di bilik ATM', labelId: 'Menutup keypad PIN dengan tangan bebas saat menekan 6 digit PIN', labelEn: 'Covering keypad when entering PIN', correctBucketId: 'AMAN', explanationCard: card({ why: 'Mencegah kamera tersembunyi atau pengintip (shoulder surfing) merekam PIN.', next: 'Biasakan menutupi keypad setiap kali bertransaksi.' }) },
                { id: 'at2', contextTagId: 'Sebelum memasukkan kartu', labelId: 'Mengecek slot kartu ATM dari ganjalan plastik mencurigakan sebelum tap/insert', labelEn: 'Inspecting ATM card slot', correctBucketId: 'AMAN', explanationCard: card({ why: 'Alat skimming palsu sering dipasang di bibir slot kartu ATM.', next: 'Jika slot terasa longgar atau aneh, batalkan dan pindah ke ATM dalam cabang bank.' }) },
                { id: 'at3', contextTagId: 'Di meja kasir resto', labelId: 'Memastikan kasir men-tap/menggesek kartu di mesin EDC tepat di depan mata sendiri', labelEn: 'Keeping card in sight at EDC', correctBucketId: 'AMAN', explanationCard: card({ why: 'Mencegah penyalinan data kartu magnetik/foto angka CVV di belakang kartu oleh oknum.', next: 'Jangan pernah menitipkan kartu ke kasir untuk dibawa ke ruang belakang.' }) },
                { id: 'at4', contextTagId: 'Kartu tersangkut di ATM', labelId: 'Meminta bantuan orang asing di antrean ATM & memberitahu PIN agar kartu dibantu keluar', labelEn: 'Asking stranger at ATM and giving PIN', correctBucketId: 'RISIKO', explanationCard: card({ why: 'Modus ganjal ATM bekerja sama dengan pelaku berpura-pura menolong untuk menukar kartu dan mencuri PIN!', next: 'Hubungi Call Center resmi bank tertera di mesin ATM atau blokir kartu lewat aplikasi.' }) },
                { id: 'at5', contextTagId: 'Kartu hilang dicuri', labelId: 'Menulis nomor PIN 6 digit pada kertas kecil dan menyimpannya satu dompet dengan kartu ATM', labelEn: 'Keeping written PIN inside wallet with card', correctBucketId: 'RISIKO', explanationCard: card({ why: 'Bila dompet jatuh atau dicuri, pencuri langsung memiliki kartu beserta PIN-nya!', next: 'Hafalkan PIN unik yang tidak sama dengan tanggal lahir.' }) },
                { id: 'at6', contextTagId: 'Transaksi di kasir', labelId: 'Mengizinkan pelayan membawa kartu debit ke ruangan belakang jauh dari pandangan', labelEn: 'Letting staff take card out of sight', correctBucketId: 'RISIKO', explanationCard: card({ why: 'Berisiko penggandaan data kartu atau foto nomor kartu & CVV.', next: 'Datangi kasir langsung saat hendak membayar dengan kartu atau QRIS.' }) },
              ],
            }),
            mkWordleLesson('S2.U7.ST1.P3', 'Kosakata Pembayaran & Transfer', 'Payment Rails Vocabulary', 'Mengenal kosakata Debit, Transfer, Kliring, BI-FAST.', [
              { word: 'DEBIT', clueId: 'Kartu atau transaksi yang memotong langsung saldo tabungan sendiri.', clueEn: 'Card pulling directly from savings.', definitionId: 'Instrumen pembayaran elektronik yang langsung mendebet rekening nasabah saat digunakan.', definitionEn: 'Card drawing directly from deposit balance.', exampleId: 'Membayar belanja mingguan pakai kartu debit di mesin EDC.', exampleEn: 'Paying groceries directly from bank balance via debit.' },
              { word: 'TRANSFER', clueId: 'Pemindahan dana secara elektronik dari satu rekening ke rekening tujuan.', clueEn: 'Moving funds between accounts.', definitionId: 'Jasa pengiriman uang antarrekening dalam satu bank maupun antarbank.', definitionEn: 'Electronic funds movement across accounts.', exampleId: 'Mengirim biaya kuliah ke rekening anak lewat aplikasi mobile banking.', exampleEn: 'Sending tuition money via mobile banking.' },
              { word: 'KLIRING', clueId: 'Mekanisme penyelesaian transaksi antarbank terjadwal seperti pada SKNBI.', clueEn: 'Scheduled interbank settlement mechanism.', definitionId: 'Proses pertukaran data warkat atau perintah bayar antarbank pada jendela waktu tertentu (mis. SKNBI).', definitionEn: 'Batch settlement clearing cycle.', exampleId: 'Pembayaran vendor Rp400 juta tidak mendesak memakai SKNBI di hari kerja.', exampleEn: 'Sending non-urgent vendor batch payments via SKNBI.' },
              { word: 'BIFAST', clueId: 'Infrastruktur transfer antarbank Bank Indonesia yang real-time 24/7 biaya maksimal Rp2.500.', clueEn: 'BI instant 24/7 interbank rail capped at Rp2,500.', definitionId: 'Sistem pembayaran ritel nasional real-time Bank Indonesia dengan batas transaksi BI hingga Rp250 juta.', definitionEn: 'Indonesia 24/7 fast retail payment rail.', exampleId: 'Kirim Rp5 juta ke bank berbeda jam 23.00 malam tiba dalam hitungan detik pakai BI-FAST.', exampleEn: 'Instant midnight interbank transfer via BI-FAST.' },
            ]),
          ],
        },
        {
          id: 'S2.U7.ST2',
          stageNumber: '7.2',
          titleId: 'Kanal Transfer BI-FAST, SKNBI, RTGS & Bukti Bayar',
          titleEn: 'Transfer Rails & Payment Verification',
          skipExamId: 'SKIP.S2.U7.ST2',
          paths: [
            mkPairLesson('S2.U7.ST2.P1', 'Pilih Kanal Transfer Sesuai Nominal & Urgensi', 'Choose Optimal Transfer Rail', 'Memilih BI-FAST, SKNBI, BI-RTGS, & Virtual Account dengan tepat.', {
              mode: 'pairs',
              instructionId: 'Cocokkan kebutuhan pengiriman dana berikut dengan kanal pembayaran resmi yang paling tepat.',
              instructionEn: 'Match each transfer scenario with its optimal payment rail.',
              pairs: [
                { id: 'tr1', leftId: 'Kirim Rp15 juta ke keluarga jam 22.00 malam butuh cair detik itu juga', leftEn: 'Send Rp15M urgently at 10 PM', rightId: 'BI-FAST (real-time 24/7, batas BI maks Rp250jt sesuai kebijakan bank)', rightEn: 'BI-FAST (24/7 instant up to Rp250M BI limit)' },
                { id: 'tr2', leftId: 'Pelunasan aset Rp400 juta mendesak wajib cair seketika jam 11.00 hari kerja', leftEn: 'Urgent Rp400M settlement at 11 AM workday', rightId: 'BI-RTGS (nominal > Rp100jt seketika pada jam kerja BI)', rightEn: 'BI-RTGS (high value >Rp100M immediate during BI hours)' },
                { id: 'tr3', leftId: 'Transfer tagihan vendor Rp350 juta tidak mendesak di jam kerja', leftEn: 'Non-urgent Rp350M vendor transfer on workday', rightId: 'SKNBI (kliring berjadwal hari kerja hingga Rp1 miliar)', rightEn: 'SKNBI (scheduled clearing up to Rp1B)' },
                { id: 'tr4', leftId: 'Bayar tagihan e-commerce agar lunas terverifikasi otomatis tanpa kirim struk', leftEn: 'E-commerce checkout auto-verification', rightId: 'Virtual Account (VA)', rightEn: 'Virtual Account (VA)' },
              ],
              explanationCard: card({
                why: 'Kanal yang tepat menghemat biaya admin dan menjamin dana masuk tepat waktu sesuai batas nominal masing-masing sistem BI.',
                assume: 'Batas maksimal per transaksi di aplikasi mobile tiap bank peserta bisa lebih rendah daripada plafon sistem BI Rp250jt.',
                type: 'dynamic_fact',
                reg: REG_SOURCES.TRANSFER_BI,
                next: 'Periksa jam operasional dan plafon bankmu sebelum mengirim dana nominal besar.',
              }),
            }, { st: 'dynamic_fact', reg: REG_SOURCES.TRANSFER_BI }),
            mkQuizLesson('S2.U7.ST2.P2', 'Efisiensi Biaya Transfer BI-FAST Setahun', 'Annual BI-FAST Savings', 'Menghitung penghematan biaya transfer rutin antarbank.', [
              {
                id: 's2u7s2p2_q1',
                promptId:
                  'Sebuah toko kecil mengirim 20 kali transfer antarbank per bulan ke pemasok berbeda. Berapa penghematan biaya admin setahun (12 bulan) bila beralih dari transfer online biasa (Rp6.500/tx) ke BI-FAST (Rp2.500/tx)?',
                promptEn: '20 interbank transfers/mo. Annual savings switching from Rp6,500 online transfer to Rp2,500 BI-FAST?',
                optionsId: ['Rp960.000/tahun', 'Rp80.000/tahun', 'Rp480.000/tahun', 'Rp1.560.000/tahun'],
                optionsEn: ['Rp960,000/year', 'Rp80,000/year', 'Rp480,000/year', 'Rp1,560,000/year'],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Selisih biaya admin transaksi kecil tampak remeh per kali kirim, namun berlipat ganda bila rutin dilakukan.',
                  calc: 'Hemat/tx = Rp6.500 − Rp2.500 = Rp4.000. Hemat/bln = 20 × Rp4.000 = Rp80.000. Setahun = 12 × Rp80.000 = Rp960.000!',
                  type: 'dynamic_fact',
                  reg: REG_SOURCES.TRANSFER_BI,
                  next: 'Pilih kanal BI-FAST secara default di m-banking untuk kiriman ritel antarbank.',
                }),
              },
            ], { st: 'dynamic_fact', reg: REG_SOURCES.TRANSFER_BI }),
            mkDetektifLesson('S2.U7.ST2.P3', 'Audit Bukti Transfer Penjualan', 'Transfer Proof Audit', 'Memverifikasi keabsahan bukti bayar sebelum melepas barang dagangan.', [
              {
                id: 'u7_b1',
                channel: 'WhatsApp',
                senderTitle: 'Pembeli Terburu-buru Kirim Screenshot "Transfer Berhasil Rp1.200.000"',
                documentLines: [
                  '• Font angka nominal tampak lebih tebal & garis jam agak miring (editan)',
                  '• Pembeli mendesak ojol segera bawa barang sebelum cek mutasi toko',
                  '• Saldo mutasi di m-banking milikmu belum bertambah sepeser pun',
                ],
                questionId: 'Apakah kamu boleh menyerahkan barang dagangan sekarang?',
                optionsId: [
                  { id: 'o1', labelId: 'BAHAYA: Tahan barang! Hanya akui dana bila sudah masuk di mutasi rekening/dashboard resmi toko sendiri', verdict: 'BAHAYA' },
                  { id: 'o2', labelId: 'AMAN: Anggap lunas dulu karena struk bukti transfer pembeli mencantumkan logo bank resmi', verdict: 'AMAN' },
                  { id: 'o3', labelId: 'AMAN: Lepas barang sekarang dan kirim pengingat tagihan jika besok mutasi masih kosong', verdict: 'AMAN' },
                ],
                correctOptionId: 'o1',
                evidenceLevel: 'red_flag',
                explanationCard: card({
                  why: 'Tangkapan layar bukti transfer sangat mudah dimanipulasi aplikasi edit gambar. Bukti sah hanyalah mutasi masuk pada rekening penerima sendiri.',
                  next: 'Selalu cek mutasi rekening/notifikasi aplikasi penerima sebelum menyerahkan barang.',
                }),
              },
              {
                id: 'u7_b2',
                channel: 'SMS',
                senderTitle: 'Link "Klaim Dana Masuk Pembeli": bank-validasi-transfer.xyz',
                documentLines: [
                  '• Pembeli mengirim tautan website mencurigakan untuk "mencairkan dana transfer yang tertahan"',
                  '• Meminta input User ID & Password m-banking penerima',
                ],
                questionId: 'Apa status pesan link pencairan ini?',
                optionsId: [
                  { id: 'o1', labelId: 'BAHAYA (PHISHING): Transfer sah langsung masuk rekening tanpa link klaim atau input password!', verdict: 'BAHAYA' },
                  { id: 'o2', labelId: 'WASPADA: Mungkin fitur baru Virtual Account luar kota', verdict: 'WASPADA' },
                  { id: 'o3', labelId: 'AMAN: Isi password saja agar uang pembeli cair', verdict: 'AMAN' },
                ],
                correctOptionId: 'o1',
                evidenceLevel: 'red_flag',
                explanationCard: card({
                  why: 'Sistem transfer bank Indonesia tidak pernah menyuruh penerima dana login lewat tautan eksternal untuk mencairkan transfer.',
                  next: 'Tutup tautan tersebut dan blokir pengirim jika terus memaksa.',
                }),
              },
            ], { isBoss: true }),
          ],
        },
      ],
    },

    // ================= UNIT 8 (Includes P0.6 QRIS CPM fix!) =================
    {
      id: 'S2.U8',
      unitNumber: 8,
      semesterId: 'S2',
      titleId: 'Dompet Digital E-Wallet & QRIS Masa Kini',
      titleEn: 'Digital Wallets (E-Wallet) & Modern QRIS',
      regulationMeta: REG_SOURCES.QRIS_LPS,
      guidebook: {
        summaryId:
          'Dompet Digital (E-Wallet) praktis untuk jajan harian, namun tunduk pada ketentuan float fund uang elektronik BI dan TIDAK termasuk simpanan perbankan yang dijamin LPS. QRIS menyatukan transaksi QR nasional lewat moda MPM (Statis & Dinamis, pembeli memindai QR toko) serta QRIS CPM (Consumer Presented Mode: pembeli menunjukkan QR bayar di aplikasinya agar dipindai scanner kasir resmi).',
        summaryEn: 'E-wallet rules vs LPS bank deposits, plus QRIS MPM Static/Dynamic, QRIS CPM, and fake QR sticker audits.',
        keyRulesId: [
          'Jangan menumpuk seluruh tabungan besar di e-wallet; simpan porsi jajan harian saja dan letakkan tabungan utama di bank peserta LPS.',
          'Pemindaian kode QRIS CPM oleh kasir di menu bayar resmi aplikasi pelanggan adalah transaksi SAH/AMAN (bukan penipuan!).',
          'Selalu periksa NAMA MERCHANT pada layar konfirmasi HP sebelum input PIN & verifikasi status lunas di sisi penerima.',
        ],
        keyRulesEn: [
          'Keep bulk savings in LPS-insured banks, not e-wallets.',
          'QRIS CPM scanned by a cashier at checkout is a valid BI payment mode.',
          'Always verify merchant name before PIN and confirm settlement inside recipient app.',
        ],
        disclaimerId: 'Referensi Regulasi: Standar Nasional QRIS Bank Indonesia (MPM & CPM) & ketentuan LPS.',
        disclaimerEn: 'Regulatory Reference: Bank Indonesia QRIS Standards & LPS coverage scope.',
      },
      stages: [
        {
          id: 'S2.U8.ST1',
          stageNumber: '8.1',
          titleId: 'Dompet Digital & Keamanan QRIS MPM serta CPM',
          titleEn: 'E-Wallets & Safe QRIS (MPM & CPM)',
          skipExamId: 'SKIP.S2.U8.ST1',
          paths: [
            mkQuizLesson('S2.U8.ST1.P1', 'Bank LPS vs E-Wallet & Hemat Biaya Top-Up', 'Bank vs E-Wallet & Top-Up Fees', 'Menempatkan porsi uang tepat antara bank & e-wallet serta menghemat biaya top-up.', [
              {
                id: 's2u8s1p1_q1',
                promptId: 'Mengapa menumpuk tabungan darurat Rp15 juta di satu aplikasi dompet digital (e-wallet) kurang tepat dibanding rekening tabungan bank?',
                promptEn: 'Why is keeping Rp15M emergency savings purely inside an e-wallet less optimal than a bank?',
                optionsId: [
                  'Saldo dibatasi limit ritel & tidak termasuk simpanan yang dijamin LPS',
                  'Dana dompet digital dijamin LPS hingga Rp2 miliar setara bank umum',
                  'Saldo dompet digital bebas dipakai mengirim antar-akun tanpa batas saldo',
                  'Uang di aplikasi dompet digital memberi bunga tabungan lebih tinggi',
                ],
                optionsEn: [
                  'Balance faces retail caps and is not covered by LPS deposit insurance',
                  'E-wallet balances carry Rp2 billion LPS deposit insurance like banks',
                  'E-wallet balances transfer unlimited amounts even before full KYC',
                  'E-wallet apps legally yield higher fixed interest than bank deposits',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Perlindungan dana pengguna e-wallet mengikuti aturan float fund uang elektronik Bank Indonesia, bukan penjaminan simpanan bank LPS hingga Rp2 miliar.',
                  type: 'dynamic_fact',
                  reg: REG_SOURCES.QRIS_LPS,
                  next: 'Isi dompet digital sesuai kebutuhan belanja 1–2 minggu saja.',
                }),
              },
              {
                id: 's2u8s1p1_q2',
                promptId: 'Biaya admin top-up e-wallet Rp1.500 per transaksi. Jika Riko beralih dari top-up receh 20 kali/bulan ke top-up terencana 2 kali/bulan, berapa penghematannya selama 1 tahun?',
                promptEn: 'Top-up fee Rp1,500/tx. Switching from 20x/mo to 2x/mo saves how much per year?',
                optionsId: ['Rp324.000/tahun', 'Rp27.000/tahun', 'Rp360.000/tahun', 'Rp180.000/tahun'],
                optionsEn: ['Rp324,000/year', 'Rp27,000/year', 'Rp360,000/year', 'Rp180,000/year'],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Menggabungkan jadwal pengisian saldo mengurangi biaya gesekan administrasi kecil berulang.',
                  calc: '(20 − 2) × Rp1.500 = 18 × Rp1.500 = Rp27.000/bulan × 12 = Rp324.000/tahun.',
                  next: 'Gabungkan top-up di awal minggu/gajian atau pakai kanal bebas admin bank yang tersedia.',
                }),
              },
            ], { st: 'dynamic_fact', reg: REG_SOURCES.QRIS_LPS }),
            mkPairLesson('S2.U8.ST1.P2', 'QRIS MPM Statis, Dinamis, QRIS CPM & Cross-Border', 'QRIS Modes Match', 'Membedakan QRIS MPM Statis/Dinamis vs QRIS CPM & Cross-Border.', {
              mode: 'pairs',
              instructionId: 'Cocokkan jenis moda transaksi QRIS resmi Bank Indonesia dengan mekanisme kerjanya.',
              instructionEn: 'Match each official QRIS transaction mode with its workflow.',
              pairs: [
                { id: 'qr1', leftId: 'QRIS Statis (MPM)', leftEn: 'Static QRIS (MPM)', rightId: 'Stiker meja tetap; pembeli scan, ketik nominal sendiri, & wajib cek nama warung', rightEn: 'Printed store sticker; buyer inputs amount' },
                { id: 'qr2', leftId: 'QRIS Dinamis (MPM)', leftEn: 'Dynamic QRIS (MPM)', rightId: 'QR unik muncul di layar kasir/EDC per struk dengan nominal otomatis tercetak', rightEn: 'Dynamic QR generated per bill with exact amount' },
                { id: 'qr3', leftId: 'QRIS CPM (Consumer Presented Mode)', leftEn: 'QRIS CPM', rightId: 'Pembeli membuka kode QR bayar di aplikasinya agar dipindai scanner kasir resmi', rightEn: 'Merchant scans buyer app payment QR at POS' },
                { id: 'qr4', leftId: 'QRIS Cross-Border (Antarnegara)', leftEn: 'Cross-Border QRIS', rightId: 'Bayar di merchant negara mitra (mis. Malaysia/Singapura/Thailand) langsung dalam Rupiah', rightEn: 'Cross-border QR pay settled seamlessly from IDR' },
              ],
              explanationCard: card({
                why: 'Mengenali MPM (penjual tunjukkan QR) dan CPM (pembeli tunjukkan QR bayar ke scanner kasir) mencegah salah paham fitur sah sekaligus tetap waspada penipuan.',
                type: 'dynamic_fact',
                reg: REG_SOURCES.QRIS_LPS,
                next: 'Pastikan saat memakai QRIS CPM, layar HP benar berada di menu resmi "QR Bayar / QRIS CPM" aplikasi bank/e-walletmu.',
              }),
            }, { st: 'dynamic_fact', reg: REG_SOURCES.QRIS_LPS }),
            mkDetektifLesson('S2.U8.ST1.P3', 'Audit Stiker QRIS Palsu vs Aliran Sah QRIS CPM', 'Inspect QRIS Stickers & Valid CPM', 'Membedakan QRIS palsu, screenshot status pending, dan transaksi QRIS CPM yang sah.', [
              {
                id: 'u8_q1',
                channel: 'QRIS',
                senderTitle: 'Stiker QRIS di Kotak Amal Masjid: Ada Stiker Kertas Menimpa Bagian Tengah',
                documentLines: [
                  '• Di layar HP konfirmasi sebelum PIN muncul nama penerima: "TOKO ELEKTRONIK MAKMUR X"',
                  '• Stiker tampak ditempel bertumpuk menimpa cetakan stiker kotak amal lama',
                ],
                questionId: 'Apa hasil audit keamanan QRIS ini?',
                optionsId: [
                  { id: 'o1', labelId: 'BAHAYA (RED FLAG): Stiker QRIS timpaan palsu! Nama merchant tidak sesuai tujuan kotak amal', verdict: 'BAHAYA' },
                  { id: 'o2', labelId: 'AMAN: Lanjut bayar saja yang penting sudah niat berdonasi', verdict: 'AMAN' },
                  { id: 'o3', labelId: 'AMAN: Nama toko elektronik mungkin pemilik aplikasi QRIS-nya', verdict: 'AMAN' },
                ],
                correctOptionId: 'o1',
                evidenceLevel: 'red_flag',
                explanationCard: card({
                  why: 'Modus tempel stiker QRIS palsu mengalihkan transfer korban ke rekening pelaku. Nama merchant di layar HP adalah kunci verifikasi utama.',
                  type: 'dynamic_fact',
                  reg: REG_SOURCES.QRIS_LPS,
                  next: 'Batalkan pembayaran dan laporkan stiker mencurigakan kepada pengurus tempat atau otoritas.',
                }),
              },
              {
                id: 'u8_q2',
                channel: 'QRIS',
                senderTitle: 'Kasir Minimarket Resmi Memindai Kode QRIS CPM dari Menu Bayar Aplikasi Pembeli',
                documentLines: [
                  '• Pembeli sengaja membuka fitur resmi "Bayar / QRIS CPM" di e-wallet/m-banking miliknya',
                  '• Scanner kasir POS memindai barcode/QR bayar tersebut sekali untuk memotong sesuai struk kasir',
                ],
                questionId: 'Bagaimana status prosedur transaksi QRIS CPM ini?',
                optionsId: [
                  { id: 'o1', labelId: 'AMAN: Prosedur resmi QRIS CPM (Consumer Presented Mode) yang sah di ritel modern', verdict: 'AMAN' },
                  { id: 'o2', labelId: 'BAHAYA: Kasir memindai QR pelanggan pasti langsung meretas seluruh tabungan', verdict: 'BAHAYA' },
                  { id: 'o3', labelId: 'BAHAYA: QRIS hanya boleh pembeli scan penjual, tidak ada mode CPM', verdict: 'BAHAYA' },
                ],
                correctOptionId: 'o1',
                evidenceLevel: 'fakta_terobservasi',
                explanationCard: card({
                  why: 'QRIS memiliki standar resmi CPM (Consumer Presented Mode) di mana kasir memindai QR pembayaran di aplikasi pelanggan, berbeda total dengan jebakan mengirim tautan transfer/login.',
                  type: 'dynamic_fact',
                  reg: REG_SOURCES.QRIS_LPS,
                  next: 'Cek struk notifikasi sukses setelah kasir memindai QRIS CPM milikmu.',
                }),
              },
              {
                id: 'u8_q3',
                channel: 'QRIS',
                senderTitle: 'Pembeli Menunjukkan Layar HP Status "Diproses / Pending" Sambil Buru-buru Pergi',
                documentLines: [
                  '• Di aplikasi merchant kasir belum ada notifikasi masuk maupun mutasi Lunas',
                  '• Pembeli berkata: "Sudah kepotong kok kak, aku buru-buru ya!"',
                ],
                questionId: 'Apa langkah wajib dari sisi penjual/kasir?',
                optionsId: [
                  { id: 'o1', labelId: 'WASPADA / PERLU VERIFIKASI: Tolak lepas barang sebelum status BERHASIL/LUNAS muncul di aplikasi merchant sendiri!', verdict: 'WASPADA' },
                  { id: 'o2', labelId: 'AMAN: Percaya saja pada tulisan "Diproses" di HP pembeli', verdict: 'AMAN' },
                  { id: 'o3', labelId: 'AMAN: Status pending pasti berhasil dalam 100% kasus', verdict: 'AMAN' },
                ],
                correctOptionId: 'o1',
                evidenceLevel: 'perlu_verifikasi',
                explanationCard: card({
                  why: 'Status pending bisa gagal/dibatalkan atau merupakan layar palsu/rekaman video! Acuan sah hanyalah notifikasi Lunas di perangkat/merchant pemilik toko.',
                  next: 'Minta pembeli menunggu sebentar hingga konfirmasi masuk di sistem merchant.',
                }),
              },
            ], { st: 'dynamic_fact', reg: REG_SOURCES.QRIS_LPS }),
            mkWordleLesson('S2.U8.ST1.P4', 'Kosakata Pembayaran QRIS', 'QRIS Vocabulary', 'Menguasai istilah QRIS, Merchant, Topup, dan Saldo.', [
              { word: 'QRIS', clueId: 'Standar kode QR pembayaran nasional dari Bank Indonesia untuk semua bank & e-wallet.', clueEn: 'Indonesian national QR payment standard.', definitionId: 'Quick Response Code Indonesian Standard yang menyatukan kanal QR di Indonesia.', definitionEn: 'Universal national QR code framework.', exampleId: 'Satu stiker QRIS di kasir bisa dipindai lewat berbagai bank maupun e-wallet.', exampleEn: 'Scanning one merchant QRIS from any banking app.' },
              { word: 'MERCHANT', clueId: 'Nama penjual/usaha resmi yang wajib dicek di layar HP sebelum memasukkan PIN QRIS.', clueEn: 'Seller/store identity shown before PIN.', definitionId: 'Pedagang atau badan usaha pemilik akun penerima pembayaran QRIS/EDC.', definitionEn: 'Registered payment recipient business.', exampleId: 'Pastikan nama merchant "Warung Bu Ani" muncul persis sebelum tekan Bayar.', exampleEn: 'Verify merchant name matches stall name.' },
              { word: 'TOPUP', clueId: 'Pengisian ulang saldo uang elektronik dari rekening bank agar siap bertransaksi.', clueEn: 'Topping up e-wallet balance.', definitionId: 'Aktivitas menambah nominal saldo pada dompet digital atau kartu uang elektronik.', definitionEn: 'Adding funds to an e-money wallet.', exampleId: 'Lakukan top-up terencana dua kali sebulan untuk menghemat biaya admin.', exampleEn: 'Batching wallet top-ups reduces fees.' },
              { word: 'SALDO', clueId: 'Jumlah dana terverifikasi yang tercatat di dompet digital atau rekening kasir/bank setelah mutasi lunas.', clueEn: 'Verified remaining balance settled inside wallet or account.', definitionId: 'Total nilai uang yang sah tersedia dan tercatat pada rekening atau dompet digital seusai transaksi lunas.', definitionEn: 'Verified settled funds available in an account.', exampleId: 'Kasir wajib memastikan saldo mutasi sudah bertambah lunas, bukan sekadar screenshot pending.', exampleEn: 'Cashiers verify settled balance increase rather than pending screenshots.' },
            ]),
            mkStoryLesson('S2.U8.ST1.P5', '7 Hari Cashless Hemat & Aman', '7-Day Safe Cashless Week', 'Mengelola top-up e-wallet, cek nama merchant QRIS, pakai CPM, dan jaga tabungan bank.', {
              titleId: 'Tujuh Hari Transaksi Cashless Hemat & Aman',
              subtitleId: 'Simulasi Keputusan E-Wallet, MPM, QRIS CPM & Deteksi Stiker Palsu',
              durationLabelId: '3 Babak Simulasi',
              initialState: { cash: 2_000_000, emergencyFund: 1_500_000, sinkingFund: 0, debt: 0, netWorth: 3_500_000 },
              chapters: [
                {
                  id: 'u8_b1',
                  periodLabelId: 'Hari 1: Pembagian Saldo & Top-Up',
                  narrativeId: 'Kamu punya gaji Rp3.500.000 di bank LPS. Kebutuhan jajan QRIS mingguan sekitar Rp300.000.',
                  choices: [
                    { id: 'c1', labelId: 'Top-up terencana Rp300.000 ke e-wallet, biarkan sisa dana utama tetap di tabungan bank peserta LPS', feedbackId: 'Optimal! Biaya top-up hemat dan dana besar aman di rekening bank.', deltas: { cash: -1_500, scoreCashflow: 25, scoreRisk: 25 }, isRecommended: true },
                    { id: 'c2', labelId: 'Pindahkan semua Rp3.500.000 ke e-wallet atau isi Rp50.000 sebanyak 20 kali', feedbackId: 'Dana cadangan kehilangan perlindungan LPS dan boros biaya admin top-up!', deltas: { cash: -30_000, scoreRisk: -20, scoreCashflow: -15 } },
                  ],
                },
                {
                  id: 'u8_b2',
                  periodLabelId: 'Hari 4: Warung Bakso & Stiker Aneh',
                  narrativeId: 'Saat scan QRIS statis di meja Warung Bakso Pak Kumis, layar HP memunculkan nama merchant "JUAL VOUCHER GAME 88" dari kertas stiker bertumpuk.',
                  choices: [
                    { id: 'c1', labelId: 'Tahan PIN! Beritahu pemilik warung ada stiker asing menimpa QRIS dan minta QRIS asli kasir', feedbackId: 'Kejahatan stiker QRIS timpaan berhasil digagalkan!', deltas: { scoreSecurity: 30, scoreGoal: 20 }, isRecommended: true },
                    { id: 'c2', labelId: 'Tetap bayar Rp25.000 karena malas bertanya ke penjual', feedbackId: 'Uang masuk ke rekening penipu, dan kamu tetap harus membayar lagi ke Pak Kumis!', deltas: { cash: -25_000, scoreSecurity: -25 } },
                  ],
                },
                {
                  id: 'u8_b3',
                  periodLabelId: 'Hari 7: Antrean Minimarket dengan QRIS CPM',
                  narrativeId: 'Di minimarket ber-scanner POS, kasir memintamu membuka menu "Bayar QRIS CPM" di aplikasi untuk dipindai.',
                  choices: [
                    { id: 'c1', labelId: 'Buka menu QRIS CPM resmi, pastikan nominal struk Rp48.000 cocok sebelum verifikasi PIN', feedbackId: 'Cepat, aman, dan sesuai standar QRIS CPM Bank Indonesia!', deltas: { cash: -48_000, scoreSecurity: 25, scoreGoal: 20 }, isRecommended: true },
                    { id: 'c2', labelId: 'Marahi kasir dan mengira QRIS CPM adalah peretasan otomatis', feedbackId: 'QRIS CPM adalah fitur resmi BI yang sah ketika kamu membuka menu QR pembayaranmu sendiri.', deltas: { scoreGoal: -10 } },
                  ],
                },
              ],
              explanationCard: card({
                why: 'Pemisahan dana bank LPS vs saldo harian e-wallet ditambah pemahaman QRIS MPM/CPM menjadikan pembayaran non-tunai hemat dan aman.',
                type: 'dynamic_fact',
                reg: REG_SOURCES.QRIS_LPS,
                next: 'Selalu baca nama merchant dan jumlah nominal terakhir sebelum otorisasi PIN.',
              }),
            }),
          ],
        },
      ],
    },

    // ================= UNIT 9 =================
    {
      id: 'S2.U9',
      unitNumber: 9,
      semesterId: 'S2',
      titleId: 'Anatomi Pemasukan, Pengeluaran & Arus Kas',
      titleEn: 'Income, Expense & Cashflow Anatomy',
      guidebook: {
        summaryId:
          'Arus kas sehat memetakan 4 kuadran: Pemasukan Tetap vs Tidak Tetap, dan Pengeluaran Wajib Tetap vs Variabel. Net Cashflow = Total Pemasukan − Total Pengeluaran. Bila negatif (Defisit), segera pangkas pos bocor atau tambah kapasitas penghasilan sebelum memicu utang.',
        summaryEn: '4-quadrant cashflow mapping, calculating Net Cashflow, and diagnosing hidden budget leaks.',
        keyRulesId: [
          'Komitmen wajib bulanan sebaiknya bertumpu pada Pemasukan Tetap, bukan komisi fluktuatif.',
          'Surplus artinya Pemasukan > Pengeluaran; Defisit berarti Pemasukan < Pengeluaran.',
          'Pengeluaran kecil berulang seperti ongkir makanan dan langganan tak terpakai sering jadi penyumbang defisit tersembunyi.',
        ],
        keyRulesEn: [
          'Base fixed obligations only on stable recurring income.',
          'Surplus = Income > Expenses; Deficit = Income < Expenses.',
          'Audit delivery fees and unused subscriptions when fixing deficits.',
        ],
        disclaimerId: 'Pedoman literasi arus kas pribadi/keluarga (fakta konsep tetap dengan parameter simulasi).',
        disclaimerEn: 'Core personal cashflow guideline.',
      },
      stages: [
        {
          id: 'S2.U9.ST1',
          stageNumber: '9.1',
          titleId: 'Membaca Peta Arus Kas Pribadi & Keluarga',
          titleEn: 'Personal & Family Cashflow Map',
          skipExamId: 'SKIP.S2.U9.ST1',
          paths: [
            mkWordleLesson('S2.U9.ST1.P1', 'Kosakata Peta Arus Kas', 'Cashflow Terms', 'Menguasai istilah gaji, omzet, surplus, & defisit.', [
              { word: 'GAJI', clueId: 'Pemasukan tetap bulanan bagi karyawan sesuai kontrak kerja.', clueEn: 'Fixed regular employee pay.', definitionId: 'Imbalan rutin tetap yang diterima pekerja setiap periode (mingguan/bulanan).', definitionEn: 'Periodic fixed compensation.', exampleId: 'Gaji pokok menjadi dasar menyusun tagihan sewa kos dan makan bulanan.', exampleEn: 'Base salary anchors fixed rent and meals.' },
              { word: 'OMZET', clueId: 'Total uang masuk kotor dari penjualan barang/jasa sebelum dipotong modal & biaya.', clueEn: 'Total gross sales revenue.', definitionId: 'Jumlah seluruh penerimaan penjualan usaha dalam periode tertentu, belum berarti laba bersih!', definitionEn: 'Gross revenue before deducting COGS and expenses.', exampleId: 'Omzet warung Rp5 juta bukan berarti untung bersih Rp5 juta karena ada modal bahan.', exampleEn: 'Rp5M sales revenue still requires subtracting inventory cost.' },
              { word: 'SURPLUS', clueId: 'Kondisi arus kas sehat ketika total pemasukan lebih besar dari total pengeluaran.', clueEn: 'Positive Net Cashflow.', definitionId: 'Selisih positif sisa uang masuk setelah seluruh pos pengeluaran bulan berjalan terpenuhi.', definitionEn: 'Income exceeding expenses in a period.', exampleId: 'Surplus bulanan Rp1 juta dapat diarahkan ke Dana Darurat dan tabungan tujuan.', exampleEn: 'Allocating Rp1M monthly surplus to emergency reserves.' },
              { word: 'DEFISIT', clueId: 'Kondisi rawan ketika pengeluaran melebihi pemasukan dalam satu periode.', clueEn: 'Negative Net Cashflow.', definitionId: 'Kekurangan kas berjalan yang menggerus tabungan atau memicu utang jika berlangsung terus-menerus.', definitionEn: 'Expenses exceeding income.', exampleId: 'Menghindari defisit dengan mengevaluasi ongkos pesan-antar harian dan belanja FOMO.', exampleEn: 'Fixing deficit by curbing delivery fees and FOMO.' },
            ]),
            mkKokiLesson('S2.U9.ST1.P2', 'Sortir 4 Kuadran Arus Kas', 'Sort 4 Cashflow Quadrants', 'Mengelompokkan item ke Masuk Tetap, Masuk Variabel, Keluar Wajib Tetap, & Keluar Variabel.', {
              instructionId: 'Kelompokkan item keuangan pekerja/mahasiswa berikut ke 4 kuadran arus kas dengan tepat.',
              instructionEn: 'Sort each cashflow item into the 4 quadrants.',
              buckets: [
                { id: 'IN_FIX', labelId: 'MASUK TETAP', labelEn: 'FIXED INFLOW', icon: '📥' },
                { id: 'IN_VAR', labelId: 'MASUK TAK TETAP', labelEn: 'VARIABLE INFLOW', icon: '🎁' },
                { id: 'OUT_FIX', labelId: 'KELUAR WAJIB TETAP', labelEn: 'FIXED MANDATORY OUT', icon: '🏠' },
                { id: 'OUT_VAR', labelId: 'KELUAR VARIABEL', labelEn: 'VARIABLE OUTFLOW', icon: '🛍️' },
              ],
              items: [
                { id: 'cf1', contextTagId: 'Pemasukan kerja', labelId: 'Gaji pokok bulanan karyawan atau uang saku rutin pasti', labelEn: 'Monthly fixed salary', correctBucketId: 'IN_FIX', explanationCard: card({ why: 'Nominal dan jadwal masuknya terprediksi pasti tiap bulan.', next: 'Gunakan hanya Masuk Tetap untuk mengikat komitmen cicilan atau sewa.' }) },
                { id: 'cf2', contextTagId: 'Pemasukan tambahan', labelId: 'Bonus lembur, komisi penjualan, & proyek desain lepas', labelEn: 'Overtime bonus & freelance fee', correctBucketId: 'IN_VAR', explanationCard: card({ why: 'Bisa ramai di satu bulan dan kosong di bulan berikutnya.', next: 'Simpan surplus bulan ramai untuk menambal cadangan saat bulan sepi.' }) },
                { id: 'cf3', contextTagId: 'Pengeluaran rumah tangga', labelId: 'Sewa kamar kos, iuran BPJS, & biaya listrik dasar', labelEn: 'Rent, BPJS & base electricity', correctBucketId: 'OUT_FIX', explanationCard: card({ why: 'Kewajiban tetap yang harus dibayar rutin setiap bulan.', next: 'Pastikan total Out Fixed aman di bawah Masuk Tetap.' }) },
                { id: 'cf4', contextTagId: 'Gaya hidup harian', labelId: 'Makan di restoran bersama teman & belanja hobi akhir pekan', labelEn: 'Dining out & weekend hobbies', correctBucketId: 'OUT_VAR', explanationCard: card({ why: 'Besarnya fleksibel mengikuti keputusan konsumsi bulanan.', next: 'Ini pos paling mudah disesuaikan pertama kali saat kas menipis.' }) },
              ],
            }),
            mkQuizLesson('S2.U9.ST1.P3', 'Hitung Net Cashflow Lintas Profil', 'Net Cashflow Across Profiles', 'Menentukan status Surplus, Impas, atau Defisit.', [
              {
                id: 's2u9s1p3_q1',
                promptId: 'Karyawan bergaji bersih Rp5.000.000 mencatat pengeluaran wajib Rp3.400.000, belanja harian variabel Rp1.350.000, dan cicilan motor Rp600.000. Bagaimana kondisi Net Cashflow bulan ini?',
                promptEn: 'Net pay Rp5.0M, expenses total Rp5.35M. Monthly Net Cashflow status?',
                optionsId: ['Defisit -Rp350.000', 'Surplus +Rp350.000', 'Impas Rp0', 'Surplus +Rp1.600.000'],
                optionsEn: ['Deficit -Rp350,000', 'Surplus +Rp350,000', 'Break-even Rp0', 'Surplus +Rp1,600,000'],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Total Keluar melampaui Pemasukan bersih sehingga menciptakan selisih negatif (Defisit).',
                  calc: '5.000.000 − (3.400.000 + 1.350.000 + 600.000) = 5.000.000 − 5.350.000 = -Rp350.000.',
                  next: 'Evaluasi pos variabel Rp1.350.000 (mis. bawa bekal/kurangi ongkir) agar kembali surplus positif.',
                }),
              },
              {
                id: 's2u9s1p3_q2',
                promptId:
                  '[Analitik HOTS] Pada kondisi defisit -Rp350.000 tersebut (pengeluaran pokok Rp3,4jt, cicilan motor Rp600rb wajib jalan 6 bulan lagi, serta variabel Rp1,35jt berisi Rp550rb biaya pesan-antar makanan & ngopi), langkah penyeimbangan mana yang paling sehat menjaga produktivitas kerja & catatan kredit?',
                promptEn: '[HOTS] Cashflow deficit -Rp350k with Rp3.4M essentials, Rp600k bike EMI, and Rp550k delivery/coffee inside variable spend. Healthiest fix?',
                optionsId: [
                  'Turunkan pesan-antar & kopi menjadi Rp150.000/bln agar kas surplus',
                  'Tunda bayar cicilan motor Rp600.000 bulan ini supaya kas positif',
                  'Potong jatah beras & listrik pokok Rp400.000 agar jajan tetap utuh',
                  'Tarik paylater Rp500.000 tiap bulan untuk menambal defisit kas',
                ],
                optionsEn: [
                  'Cut delivery and coffee down to Rp150k/mo to restore surplus',
                  'Skip the Rp600k motorbike EMI this month so cashflow turns positive',
                  'Trim staple rice and utilities by Rp400k to keep snack spending intact',
                  'Draw Rp500k paylater monthly as a bridge for the recurring deficit',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Pemulihan defisit (C5-C6) memprioritaskan pemangkasan pos variabel fleksibel tanpa merusak kewajiban cicilan sah (denda & SLIK) maupun kebutuhan gizi/kerja utama.',
                  calc: 'Kurangi pesan-antar/kopi Rp550rb → Rp150rb menghemat Rp400.000 → Defisit -Rp350.000 berubah menjadi Surplus +Rp50.000!',
                  next: 'Alihkan surplus kecil awal itu menjadi bantalan kas agar bulan depan tidak mengandalkan utang.',
                  type: 'simulation_assumption',
                }),
              },
            ]),
            mkDetektifLesson('S2.U9.ST1.P4', 'Audit Buku Kas Keluarga Defisit', 'Household Cashflow Deficit Audit', 'Menemukan pos kebocoran kas Rp650.000 dan memulihkan surplus.', [
              {
                id: 'u9_b1',
                channel: 'Struk',
                senderTitle: 'Catatan Buku Kas Keluarga: Defisit -Rp650.000 Bulan Berjalan',
                documentLines: [
                  '• Pengeluaran Pokok (Kontrakan, Beras, BPJS, Listrik)  = Rp3.800.000 (Wajib)',
                  '• Ongkir & biaya layanan pesan-antar makanan 24x/bln    = Rp480.000 (Bocor Variabel)',
                  '• 3 Langganan streaming jarang ditonton                = Rp240.000 (Bocor Variabel)',
                  '• Total Defisit Awal = -Rp650.000 dari Penghasilan Rp5.200.000',
                ],
                questionId: 'Mana tindakan audit paling efektif mengembalikan kas ke surplus tanpa memotong gizi pokok anak?',
                optionsId: [
                  { id: 'o1', labelId: 'WASPADA / EKSEKUSI: Hentikan 3 langganan tak terpakai (-Rp240rb) & kurangi pesan-antar ke 4x/bln (-Rp400rb) + masak hemat → Surplus +Rp10.000+', verdict: 'WASPADA' },
                  { id: 'o2', labelId: 'BAHAYA: Potong iuran BPJS Kesehatan & uang makan beras anak agar streaming tetap jalan', verdict: 'BAHAYA' },
                  { id: 'o3', labelId: 'BAHAYA: Tutup defisit dengan pinjaman online setiap akhir bulan', verdict: 'BAHAYA' },
                ],
                correctOptionId: 'o1',
                evidenceLevel: 'fakta_terobservasi',
                explanationCard: card({
                  why: 'Kebocoran variabel kecil yang berulang (Rp480rb ongkir + Rp240rb langganan = Rp720rb/bln) sering lebih besar dari nilai defisit itu sendiri!',
                  calc: 'Pangkas Rp640rb–Rp720rb pos variabel non-esensial membalik defisit -Rp650rb menjadi surplus positif tanpa menyentuh utang.',
                  next: 'Lakukan audit langganan dan biaya antar minimal setiap awal bulan.',
                  type: 'simulation_assumption',
                }),
              },
            ], { isBoss: true, st: 'simulation_assumption' }),
          ],
        },
      ],
    },

    // ================= UNIT 10 =================
    {
      id: 'S2.U10',
      unitNumber: 10,
      semesterId: 'S2',
      titleId: 'Pendapatan, Karier & Kapasitas Penghasilan',
      titleEn: 'Income, Career & Earning Capacity',
      regulationMeta: REG_SOURCES.BPJS_TK,
      guidebook: {
        summaryId:
          'Selain berhemat, kapasitas menghasilkan uang (Human Capital) sama krusialnya. Bedakan Pendapatan Aktif vs Pasif, Gaji Bruto vs Gaji Neto Slip Gaji (setelah BPJS/pajak) vs Sisa Pendapatan Ekonomis Bersih Setelah Biaya Transportasi Kerja, serta kenali manfaat 5 program BPJS Ketenagakerjaan (JKK, JKM, JHT, JP, JKP sesuai syarat klaim).',
        summaryEn: 'Human capital, Active vs Passive income, Payroll Net vs Commute-Adjusted residual pay, BPJS TK & scam job detection.',
        keyRulesId: [
          'Jangan menyamakan angka Gaji Neto di slip gaji (payroll) dengan sisa uang bebas setelah ongkos transport kerja!',
          'Program JKP (Jaminan Kehilangan Pekerjaan) hanya berlaku bagi pekerja terkena PHK sah yang memenuhi masa iur & prosedur klaim.',
          'Waspadai lowongan kerja yang meminta transfer uang pelatihan/seragam/tes di muka.',
        ],
        keyRulesEn: [
          'Distinguish payroll net salary from disposable take-home pay after commute costs.',
          'JKP applies strictly to qualifying involuntary terminations.',
          'Legitimate employers never ask candidates to pay upfront fees for hiring.',
        ],
        disclaimerId: 'Referensi Regulasi: Kemnaker & BPJS Ketenagakerjaan (JKK, JKM, JHT, JP, JKP).',
        disclaimerEn: 'Regulatory Reference: Indonesian Labor & Social Security guidelines.',
      },
      stages: [
        {
          id: 'S2.U10.ST1',
          stageNumber: '10.1',
          titleId: 'Mengenal Sumber & Jenis Pendapatan',
          titleEn: 'Income Sources & Payroll Net',
          skipExamId: 'SKIP.S2.U10.ST1',
          paths: [
            mkKokiLesson('S2.U10.ST1.P1', 'Sortir Pendapatan Aktif vs Pasif', 'Active vs Passive Income', 'Memilah sumber penghasilan aktif (waktu/tenaga) vs pasif (aset).', {
              instructionId: 'Kelompokkan sumber penghasilan berikut ke Pendapatan Aktif vs Pendapatan Pasif.',
              instructionEn: 'Sort income streams into Active or Passive.',
              buckets: [
                { id: 'AKTIF', labelId: 'PENDAPATAN AKTIF (Tenaga/Waktu)', labelEn: 'ACTIVE INCOME', icon: '💼' },
                { id: 'PASIF', labelId: 'PENDAPATAN PASIF (Hasil Aset)', labelEn: 'PASSIVE INCOME', icon: '🌱' },
              ],
              items: [
                { id: 'inc1', contextTagId: 'Kerja formal', labelId: 'Gaji bulanan pegawai & uang lembur kerja', labelEn: 'Monthly salary & overtime', correctBucketId: 'AKTIF', explanationCard: card({ why: 'Mengharuskan kehadiran waktu dan tenaga kerja secara langsung.', next: 'Jaga kesehatan dan keterampilan sebagai mesin utama pendapatan aktif.' }) },
                { id: 'inc2', contextTagId: 'Pekerja lepas', labelId: 'Honor proyek desain grafis atau mengajar les privat', labelEn: 'Freelance design or tutoring fee', correctBucketId: 'AKTIF', explanationCard: card({ why: 'Dibayar berdasarkan jasa keahlian dan jam kerja aktifmu.', next: 'Pisahkan waktu kerja utama vs sampingan agar tidak kelelahan kronis.' }) },
                { id: 'inc3', contextTagId: 'Kepemilikan efek', labelId: 'Kupon bulanan SBN Ritel & bunga deposito berjangka', labelEn: 'SBN coupon & time deposit interest', correctBucketId: 'PASIF', explanationCard: card({ why: 'Berasal dari modal aset yang ditempatkan di instrumen legal (tetap kena pajak & risiko sesuai instrumen).', next: 'Bangun Dana Darurat dulu sebelum fokus membangun sumber aset pasif.' }) },
                { id: 'inc4', contextTagId: 'Kepemilikan saham/properti', labelId: 'Dividen tahunan saham atau sewa bersih rumah milik sendiri (pasca-biaya rawat)', labelEn: 'Stock dividends or net property rent', correctBucketId: 'PASIF', explanationCard: card({ why: 'Hasil pembagian keuntungan aset modal tanpa kerja harian penuh (tetap butuh pemantauan/rawat berkala).', next: 'Hitung hasil bersih setelah biaya perawatan dan pajak.' }) },
              ],
            }),
            mkPairLesson('S2.U10.ST1.P2', 'Komponen Kompensasi Kerja', 'Compensation Structure', 'Memahami kepastian Gaji Pokok vs Komisi/Lembur vs THR.', {
              mode: 'pairs',
              instructionId: 'Pasangkan komponen penghasilan pekerja dengan sifat perencanaannya dalam anggaran.',
              instructionEn: 'Match pay components with budgeting stability.',
              pairs: [
                { id: 'kp1', leftId: 'Gaji Pokok & Tunjangan Tetap', leftEn: 'Base Salary & Fixed Allowances', rightId: 'Pasti diterima tiap bulan: jadikan patokan cicilan & belanja wajib', rightEn: 'Stable base anchor for fixed obligations' },
                { id: 'kp2', leftId: 'Komisi Penjualan & Lembur', leftEn: 'Commission & Overtime', rightId: 'Tidak tetap tergantung performa/jam kerja: jangan dijadikan patokan cicilan tetap', rightEn: 'Fluctuating pay: never tie to fixed EMIs' },
                { id: 'kp3', leftId: 'THR (Tunjangan Hari Raya)', leftEn: 'Annual Holiday Allowance', rightId: 'Pemasukan tahunan untuk hari raya, mudik Sinking Fund, atau akselerasi tabungan', rightEn: 'Annual allowance for holidays or savings boost' },
              ],
              explanationCard: card({ why: 'Mengunci cicilan besar di atas asumsi lembur/komisi membuat arus kas langsung kolaps saat jam lembur dipangkas.', next: 'Gunakan Gaji Tetap sebagai fondasi kewajiban rutin.' }),
            }),
            mkQuizLesson('S2.U10.ST1.P3', 'Gaji Bruto vs Gaji Neto Slip Gaji', 'Gross vs Payroll Net Salary', 'Menghitung penghasilan neto slip gaji setelah iuran rutin.', [
              {
                id: 's2u10s1p3_q1',
                promptId:
                  'Asumsi slip gaji karyawan (sebelum PPh 21 jika di bawah PTKP): Gaji Bruto Rp4.500.000 dengan potongan pekerja BPJS Kesehatan 1% (Rp45.000), JHT 2% (Rp90.000), dan JP 1% (Rp45.000). Berapa Gaji Neto (take-home slip gaji) yang menjadi patokan anggaran?',
                promptEn: 'Gross Rp4.5M minus 4% total employee BPJS cuts (Rp180k). Payroll Net Salary?',
                optionsId: ['Rp4.320.000', 'Rp4.500.000', 'Rp4.365.000', 'Rp4.680.000'],
                optionsEn: ['Rp4,320,000', 'Rp4,500,000', 'Rp4,365,000', 'Rp4,680,000'],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Menyusun anggaran wajib memakai Gaji Neto yang benar-benar masuk ke rekening setelah iuran BPJS dan pajak, bukan Gaji Bruto di surat penawaran!',
                  calc: 'Rp4.500.000 − (Rp45.000 + Rp90.000 + Rp45.000) = Rp4.500.000 − Rp180.000 = Rp4.320.000.',
                  type: 'dynamic_fact',
                  reg: REG_SOURCES.BPJS_TK,
                  next: 'Periksa selalu baris rincian potongan pada slip gaji bulananmu.',
                }),
              },
            ], { st: 'dynamic_fact', reg: REG_SOURCES.BPJS_TK }),
            mkWordleLesson('S2.U10.ST1.P4', 'Kosakata Karier & Penghasilan', 'Career & Income Terms', 'Menguasai kosakata bruto, neto, komisi, dan karier.', [
              { word: 'BRUTO', clueId: 'Angka penghasilan kotor sebelum dikurangi pajak dan iuran BPJS.', clueEn: 'Gross pre-deduction earnings.', definitionId: 'Total kompensasi nominal sebelum potongan wajib pekerja.', definitionEn: 'Pre-tax and pre-contribution compensation.', exampleId: 'Jangan menganggarkan sewa kos memakai gaji bruto sebelum cek slip neto.', exampleEn: 'Budget using net pay, not gross offer.' },
              { word: 'NETO', clueId: 'Nilai bersih setelah potongan wajib (atau bersih setelah ongkos relevan).', clueEn: 'Net take-home pay.', definitionId: 'Penghasilan riil yang diterima masuk ke rekening setelah seluruh potongan resmi.', definitionEn: 'Earnings after mandatory deductions.', exampleId: 'Gaji neto Rp4,32jt menjadi patokan aman alokasi 50/30/20.', exampleEn: 'Using Rp4.32M net pay for 50/30/20 buckets.' },
              { word: 'KOMISI', clueId: 'Imbalan variabel yang besarannya naik-turun mengikuti target penjualan.', clueEn: 'Variable performance payout.', definitionId: 'Bagian penghasilan tidak tetap sebagai persentase pencapaian penjualan/transaksi.', definitionEn: 'Variable output-linked pay.', exampleId: 'Sisihkan komisi tinggi ke dana cadangan untuk mengantisipasi bulan sepi.', exampleEn: 'Save high commission months as buffer.' },
              { word: 'KARIER', clueId: 'Perjalanan peningkatan keahlian, pengalaman, dan nilai ekonomi pekerja jangka panjang.', clueEn: 'Long-term skill & work progression.', definitionId: 'Rangkaian perkembangan peran profesional dan kapasitas Human Capital seseorang.', definitionEn: 'Long-term professional trajectory.', exampleId: 'Mengikuti pelatihan keahlian relevan merupakan investasi karier ber-ROI baik.', exampleEn: 'Skill upskilling lifts long-term earning power.' },
            ]),
          ],
        },
        {
          id: 'S2.U10.ST2',
          stageNumber: '10.2',
          titleId: 'Dunia Kerja & Membandingkan Tawaran Kompensasi',
          titleEn: 'Job Offers & BPJS Ketenagakerjaan',
          skipExamId: 'SKIP.S2.U10.ST2',
          paths: [
            mkQuizLesson('S2.U10.ST2.P1', 'Sisa Pendapatan Pasca-Ongkos Kerja', 'Compare Net Pay After Commute', 'Membandingkan tawaran kerja berdasar sisa pendapatan setelah ongkos transport dan waktu tempuh.', [
              {
                id: 's2u10s2p1_q1',
                promptId:
                  '(Asumsi: gaji take-home slip setelah BPJS/pajak dibandingkan setara) Tawaran A: Gaji take-home Rp6.000.000 tapi jarak jauh (ongkos transport Rp950.000/bln, perjalanan 3 jam/hari). Tawaran B: Gaji take-home Rp5.500.000 dekat rumah (ongkos Rp250.000/bln, hemat 2 jam/hari) + tunjangan kesehatan & pelatihan Rp3jt/th. Berapa SISA PENDAPATAN SETELAH BIAYA TRANSPORTASI masing-masing?',
                promptEn: 'Offer A Rp6M take-home minus Rp950k commute vs Offer B Rp5.5M minus Rp250k commute. Remaining after commute?',
                optionsId: [
                  'Tawaran A Rp5.050.000 vs Tawaran B Rp5.250.000',
                  'Tawaran A Rp5.750.000 vs Tawaran B Rp5.250.000',
                  'Tawaran A Rp6.000.000 vs Tawaran B Rp5.500.000',
                  'Tawaran A Rp5.300.000 vs Tawaran B Rp4.550.000',
                ],
                optionsEn: [
                  'Offer A Rp5,050,000 vs Offer B Rp5,250,000',
                  'Offer A Rp5,750,000 vs Offer B Rp5,250,000',
                  'Offer A Rp6,000,000 vs Offer B Rp5,500,000',
                  'Offer A Rp5,300,000 vs Offer B Rp4,550,000',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Gaji Neto pada slip gaji (payroll) berbeda dari Sisa Pendapatan Ekonomis setelah ongkos transport kerja! Jarak jauh menyedot uang bensin/ojol dan waktu harian.',
                  calc: 'Sisa Pasca-Transport A = 6.000.000 − 950.000 = Rp5.050.000. Sisa B = 5.500.000 − 250.000 = Rp5.250.000!',
                  assume: 'Mengasumsikan angka awal adalah gaji take-home pasca potongan rutin sehingga perbandingan berfokus pada ongkos komuter dan tunjangan.',
                  type: 'simulation_assumption',
                  next: 'Hitung selalu biaya transport, makan kerja, tunjangan kesehatan, dan waktu tempuh saat membandingkan tawaran kerja.',
                }),
              },
            ], { st: 'simulation_assumption' }),
            mkPairLesson('S2.U10.ST2.P2', 'Manfaat BPJS Ketenagakerjaan & Kontrak', 'BPJS TK & Work Contracts', 'Mengenal JKK, JHT, JKP (bersyarat), & kontrak kerja tertulis.', {
              mode: 'pairs',
              instructionId: 'Cocokkan komponen perlindungan pekerja di Indonesia dengan hak manfaatnya.',
              instructionEn: 'Match Indonesian labor protection items to their benefits.',
              pairs: [
                { id: 'tk1', leftId: 'JKK (Jaminan Kecelakaan Kerja)', leftEn: 'Work Accident Insurance (JKK)', rightId: 'Perlindungan perawatan medis & santunan jika kecelakaan saat berangkat/pulang/bekerja', rightEn: 'Medical & compensation for work-related accidents' },
                { id: 'tk2', leftId: 'JHT (Jaminan Hari Tua)', leftEn: 'Old Age Savings (JHT)', rightId: 'Akumulasi tabungan pekerja jangka panjang saat pensiun/berhenti bekerja sesuai aturan', rightEn: 'Accumulated worker savings payout' },
                { id: 'tk3', leftId: 'JKP (Jaminan Kehilangan Pekerjaan)', leftEn: 'Job Loss Benefit (JKP)', rightId: 'Uang tunai sementara + akses info kerja & pelatihan saat terkena PHK sah (bersyarat masa iur & klaim)', rightEn: 'Cash/training aid upon qualifying involuntary layoff' },
                { id: 'tk4', leftId: 'Kontrak Kerja Tertulis', leftEn: 'Written Work Contract', rightId: 'Memastikan kejelasan gaji, jam kerja, status PKWT/PKWTT, & hak pesangon/THR', rightEn: 'Clarifies pay, status, and benefits' },
              ],
              explanationCard: card({
                why: 'Mengetahui hak BPJS TK dan kontrak kerja tertulis mencegah pelanggaran hak upah dan memberi jaring pengaman resmi saat musibah kerja.',
                type: 'dynamic_fact',
                reg: REG_SOURCES.BPJS_TK,
                next: 'Pastikan kepesertaan BPJS Kesehatan & Ketenagakerjaanmu aktif terdaftar di aplikasi resmi JMO.',
              }),
            }, { st: 'dynamic_fact', reg: REG_SOURCES.BPJS_TK }),
            mkDetektifLesson('S2.U10.ST2.P3', 'Deteksi Penipuan Lowongan Kerja Bodong', 'Job Scam Audit', 'Mendeteksi loker abal-abal berbiaya di muka & kontrak merugikan.', [
              {
                id: 'u10_dc1',
                channel: 'WhatsApp',
                senderTitle: 'HRD "PT Nusantara Mega Grup": Gaji Awal Rp12 Juta Fresh Graduate Tanpa Wawancara',
                documentLines: [
                  '• Panggilan kerja dikirim via chat WA pribadi tanpa wawancara tatap muka/video',
                  '• Mewajibkan transfer Rp1.500.000 hari ini untuk biaya "seragam & tiket diklat yang akan di-reimburse"',
                ],
                questionId: 'Apa status lowongan pekerjaan tersebut?',
                optionsId: [
                  { id: 'o1', labelId: 'BAHAYA (PENIPUAN LOKER): Perusahaan sah tidak pernah memungut transfer biaya rekrutmen/tiket dari pelamar!', verdict: 'BAHAYA' },
                  { id: 'o2', labelId: 'AMAN: Transfer saja Rp1,5jt karena dijanjikan balik modal di gaji pertama Rp12jt', verdict: 'AMAN' },
                  { id: 'o3', labelId: 'WASPADA: Boleh dicoba transfer separuh dulu', verdict: 'WASPADA' },
                ],
                correctOptionId: 'o1',
                evidenceLevel: 'red_flag',
                explanationCard: card({
                  why: 'Salah satu penipuan lowongan kerja tersering adalah menarik biaya transportasi/tiket/diklat di muka dengan janji reimbursement palsu.',
                  next: 'Verifikasi lowongan melalui situs karier resmi perusahaan dan tolak seluruh permintaan transfer uang pelamar.',
                }),
              },
            ]),
          ],
        },
        {
          id: 'S2.U10.ST3',
          stageNumber: '10.3',
          titleId: 'Mengembangkan Kapasitas Penghasilan Diri',
          titleEn: 'Human Capital & Side Hustles',
          skipExamId: 'SKIP.S2.U10.ST3',
          paths: [
            mkQuizLesson('S2.U10.ST3.P1', 'Imbal Hasil Investasi Keterampilan Diri', 'Skill Upskilling ROI', 'Menilai ROI waktu & biaya peningkatan keterampilan bagi pemula.', [
              {
                id: 's2u10s3p1_q1',
                promptId: 'Bagi pekerja muda berpenghasilan awal Rp3,5 juta dengan tabungan terbatas, mengapa meningkatkan keahlian relevan (upskilling) sering memberi hasil finansial terbesar?',
                promptEn: 'Why is targeted skill upskilling often the highest-leverage move for early-career earners?',
                optionsId: [
                  'Menaikkan kapasitas gaji aktif jauh lebih besar dibanding hasil modal kecil',
                  'Semua kursus bersertifikat umumnya gratis tanpa perlu meluangkan waktu',
                  'Imbal hasil bunga tabungan Rp2 juta selalu melampaui potensi kenaikan upah',
                  'Pelatihan singkat langsung menggantikan pengalaman kerja nyata di industri',
                ],
                optionsEn: [
                  'Growing active earning power outperforms tiny returns on small starter capital',
                  'All certified job training courses are free and require minimal study time',
                  'Bank interest on Rp2 million savings routinely exceeds potential wage raises',
                  'Short workshops immediately replace hands-on work experience in industry',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Saat modal awal masih kecil (mis. Rp2 juta), return investasi 10%/th hanya Rp200rb/th; sedangkan keahlian baru bisa menaikkan pendapatan bulanan jutaan rupiah per bulan!',
                  next: 'Pilih kursus/sertifikasi yang benar-benar dibutuhkan pasar kerja dengan biaya terukur tanpa utang konsumtif.',
                }),
              },
            ]),
            mkKokiLesson('S2.U10.ST3.P2', 'Sortir Peluang Sampingan Realistis vs Berisiko', 'Realistic vs Trap Side Hustles', 'Menilai peluang penghasilan tambahan dengan konteks pekerja.', {
              instructionId: 'Sortir peluang kerja sampingan bagi pekerja penuh waktu ke Usaha Sampingan Realistis vs Risiko Tinggi / Jebakan.',
              instructionEn: 'Sort side income choices into Realistic vs Trap/High Risk.',
              buckets: [
                { id: 'REALISTIS', labelId: 'USAHA SAMPINGAN REALISTIS', labelEn: 'REALISTIC SIDE HUSTLE', icon: '🛠️' },
                { id: 'JEBAKAN', labelId: 'RISIKO TINGGI / JEBAKAN', labelEn: 'TRAP / HIGH RISK', icon: '💣' },
              ],
              items: [
                { id: 'sh1', contextTagId: 'Pekerja malam hari', labelId: 'Jual jasa les/desain/ketik di akhir pekan memakai laptop yang sudah ada', labelEn: 'Weekend freelancing with existing gear', correctBucketId: 'REALISTIS', explanationCard: card({ why: 'Modal minimal tanpa utang stok dan memanfaatkan keahlian nyata.', next: 'Catat pemasukan sampingan ke pos terpisah.' }) },
                { id: 'sh2', contextTagId: 'Modal terbatas', labelId: 'Reseller makanan sistem pre-order agar tanpa utang menumpuk stok basi', labelEn: 'Pre-order food reseller avoiding stock debt', correctBucketId: 'REALISTIS', explanationCard: card({ why: 'Sistem pre-order meminimalkan risiko barang tak laku dan menjaga kas.', next: 'Hitung ongkos kirim dan kemasan agar margin tidak tergerus.' }) },
                { id: 'sh3', contextTagId: 'Modal hutang tinggi', labelId: 'Pinjam Rp30 juta bunga tinggi untuk buka kafe tanpa pernah menguji pembeli', labelEn: 'Borrowing Rp30M high-interest for untested cafe', correctBucketId: 'JEBAKAN', explanationCard: card({ why: 'Risiko gagal usaha sangat tinggi di awal sementara cicilan tetap berjalan tiap bulan.', next: 'Mulai skala uji pasar kecil dari tabungan surplus sebelum ekspansi.' }) },
                { id: 'sh4', contextTagId: 'Skema member', labelId: 'Ikut bisnis "bayar uang gabung Rp2 juta lalu cari anggota baru agar untung"', labelEn: 'Pay-to-recruit money game scheme', correctBucketId: 'JEBAKAN', explanationCard: card({ why: 'Ciri skema piramida/Money Game yang menipu peserta akhir ketika perekrutan jenuh.', next: 'Tolak model pendapatan dari biaya daftar member tanpa nilai produk nyata.' }) },
              ],
            }),
            mkStoryLesson('S2.U10.ST3.P3', 'Karier & Penghasilan Pertama', 'First Job Career Moves', 'Memilih tawaran kerja bersih pasca-ongkos, cek BPJS TK, dan kelola sampingan.', {
              titleId: 'Membangun Hidup Finansial dari Penghasilan Pertama',
              subtitleId: 'Simulasi 3 Babak Pilihan Karier, Kontrak BPJS TK & Human Capital',
              durationLabelId: '3 Babak Simulasi',
              initialState: { cash: 1_000_000, emergencyFund: 500_000, sinkingFund: 0, debt: 0, netWorth: 1_500_000 },
              chapters: [
                {
                  id: 'u10_b1',
                  periodLabelId: 'Babak 1: Membandingkan Dua Surat Penawaran',
                  narrativeId: 'Tawaran A memberi take-home Rp6.000.000 namun ongkos komuter Rp950.000/bln. Tawaran B Rp5.500.000 dekat rumah (ongkos Rp250.000/bln) + terdaftar BPJS TK lengkap & ada waktu belajar.',
                  choices: [
                    { id: 'c1', labelId: 'Pilih Tawaran B: sisa pasca-ongkos lebih besar (Rp5.250.000 vs Rp5.050.000), waktu hemat, & BPJS TK jelas', feedbackId: 'Pilihan strategis! Kamu memperoleh uang bersih pasca-ongkos lebih tinggi plus jaminan kerja.', deltas: { cash: 5_250_000, scoreCashflow: 30, scoreGoal: 25 }, isRecommended: true },
                    { id: 'c2', labelId: 'Pilih Tawaran A semata karena angka nominal awal terlihat lebih besar Rp500rb', feedbackId: 'Setelah dipotong transport Rp950rb, uang bersihmu justru lebih kecil Rp200rb/bln dan kehabisan energi perjalanan!', deltas: { cash: 5_050_000, scoreCashflow: 10, scoreGoal: -10 } },
                  ],
                },
                {
                  id: 'u10_b2',
                  periodLabelId: 'Babak 2: Audit Kontrak & Rekrutmen',
                  narrativeId: 'Perusahaan asing lain menghubungimu di WA menawarkan gaji Rp15jt asal kamu transfer biaya tes kesehatan Rp850.000 ke rekening pribadi recruiter.',
                  choices: [
                    { id: 'c1', labelId: 'Tolak dan laporkan! Perusahaan resmi menanggung atau menunjuk klinik resmi tanpa meminta transfer pribadi pelamar', feedbackId: 'Terhindar dari penipuan loker Rp850.000!', deltas: { scoreSecurity: 30 }, isRecommended: true },
                    { id: 'c2', labelId: 'Transfer Rp850.000 agar tidak ketinggalan peluang gaji besar', feedbackId: 'Penipu langsung memblokir nomormu setelah dana terkirim.', deltas: { cash: -850_000, scoreSecurity: -30 } },
                  ],
                },
                {
                  id: 'u10_b3',
                  periodLabelId: 'Babak 3: Menghadapi Pemangkasan Lembur',
                  narrativeId: 'Dua bulan kemudian perusahaan mengurangi jam lembur karena efisiensi. Syukur sejak awal kamu tidak mengunci cicilan di atas uang lembur dan menyisihkan waktu untuk kelas keahlian.',
                  choices: [
                    { id: 'c1', labelId: 'Manfaatkan keahlian baru untuk kerja lepas akhir pekan bersistem DP/pre-order tanpa ganggu kerja utama', feedbackId: 'Pendapatan pulih tanpa utang dan karier terus naik!', deltas: { cash: 800_000, scoreRisk: 25, scoreGoal: 25 }, isRecommended: true },
                    { id: 'c2', labelId: 'Pinjam Rp20jt untuk ikut bisnis skema ajak member demi mengganti uang lembur', feedbackId: 'Justru menambah beban utang di atas penipuan piramida.', deltas: { debt: 20_000_000, netWorth: -20_000_000, scoreRisk: -30 } },
                  ],
                },
              ],
              explanationCard: card({
                why: 'Membandingkan sisa pendapatan setelah biaya kerja, memastikan BPJS TK & kontrak sah, dan berinvestasi pada Human Capital memperkuat fondasi ekonomi.',
                type: 'dynamic_fact',
                reg: REG_SOURCES.BPJS_TK,
                next: 'Selanjutnya: hadapi Gerbang UTS Semester 2 sebelum menyusun anggaran 50/30/20 & Sinking Fund!',
              }),
            }),
          ],
        },
      ],
    },

    // ================= UNIT 11 =================
    {
      id: 'S2.U11',
      unitNumber: 11,
      semesterId: 'S2',
      titleId: 'Menyusun Anggaran Praktis & Sinking Fund',
      titleEn: 'Practical Budgeting & Sinking Funds',
      guidebook: {
        summaryId:
          'Terapkan Pay Yourself First: sisihkan tabungan/darurat segera setelah menerima pendapatan dan memenuhi kewajiban pokok, sebelum menyentuh pos keinginan! Gunakan kerangka adaptif 50/30/20 (50% Kebutuhan, 30% Keinginan, 20% Tabungan, Dana Darurat, Investasi & Pelunasan Utang Prioritas) sebagai pedoman umum yang disesuaikan realita biaya hidup, dan pisahkan 4 kantong: Dana Darurat vs Sinking Fund vs Tabungan Tujuan vs Investasi.',
        summaryEn: 'Pay Yourself First sequencing, adaptive 50/30/20 guidelines, and separating Emergency vs Sinking Funds.',
        keyRulesId: [
          'Bila kebutuhan pokok kota besar mencapai 65%, pangkas porsi Keinginan agar pos Tabungan/Darurat tetap ada (mis. 65/20/15), jangan dihapus ke 0%.',
          'Sinking Fund membiayai pengeluaran besar berkala yang JADWALNYA PASTI (pajak STNK, daftar ulang sekolah, servis berkala).',
          'Pekerja berpenghasilan tak tetap menyusun Anggaran Dasar dari patokan bulan sepi dan menabung kelebihan bulan ramai sebagai penyangga.',
        ],
        keyRulesEn: [
          'Adapt 50/30/20 to 65/20/15 in high-cost cities instead of dropping savings to 0%.',
          'Sinking Fund covers scheduled predictable irregular bills.',
          'Irregular earners budget using low-month baseline and buffer high months.',
        ],
        disclaimerId: 'Pedoman umum (rule of thumb) anggaran 50/30/20 dapat disesuaikan tanggungan keluarga & kondisi biaya lokal.',
        disclaimerEn: '50/30/20 is a flexible guideline, not a rigid law.',
      },
      stages: [
        {
          id: 'S2.U11.ST1',
          stageNumber: '11.1',
          titleId: 'Pay Yourself First & Kerangka 50/30/20 Adaptif',
          titleEn: 'Pay Yourself First & Adaptive 50/30/20',
          skipExamId: 'SKIP.S2.U11.ST1',
          paths: [
            mkPairLesson('S2.U11.ST1.P1', 'Urutan Langkah Gajian Pay Yourself First', 'Pay Yourself First Order', 'Mengurutkan langkah gajian yang konsisten menyisihkan tabungan sebelum belanja keinginan.', {
              mode: 'sequence',
              instructionId: 'Urutkan 5 langkah pengelolaan uang tepat di hari gajian sesuai prinsip Pay Yourself First!',
              instructionEn: 'Order the 5 Pay Yourself First payday steps.',
              sequenceSteps: [
                { id: 'py1', labelId: 'Terima gaji atau penghasilan bersih (Neto Slip Gaji)', labelEn: 'Receive net paycheck', order: 1 },
                { id: 'py2', labelId: 'Bayar kewajiban pokok jatuh tempo (listrik, sewa/cicilan kontrak wajib)', labelEn: 'Pay fixed mandatory bills due', order: 2 },
                { id: 'py3', labelId: 'Langsung sisihkan Dana Darurat, Sinking Fund & Tabungan di awal (Pay Yourself First)', labelEn: 'Pay Yourself First: fund Emergency & Sinking Funds before discretionary spend', order: 3 },
                { id: 'py4', labelId: 'Jalankan alokasi kebutuhan hidup rutin (makan pokok, transport kerja)', labelEn: 'Run core daily living budget', order: 4 },
                { id: 'py5', labelId: 'Nikmati pos keinginan/hiburan hanya dari sisa plafon yang memang dialokasikan', labelEn: 'Enjoy wants strictly within remaining budget cap', order: 5 },
              ],
              explanationCard: card({
                why: 'Menabung dari sisa belanja akhir bulan hampir selalu gagal karena belanja keinginan mudah melebar. Memindahkan pos tabungan ke tahap awal menjamin ketahanan kas.',
                next: 'Otomatiskan transfer ke rekening tabungan/darurat tepat pada tanggal gajian.',
              }),
            }),
            mkQuizLesson('S2.U11.ST1.P2', 'Hitung & Adaptasi Kerangka 50/30/20', 'Apply & Adapt 50/30/20', 'Menerapkan 50/30/20 dan mengadaptasinya saat biaya hidup tinggi.', [
              {
                id: 's2u11s1p2_q1',
                promptId: 'Gaji bersih Riko Rp5.000.000 memakai kerangka umum 50/30/20. Berapakah jatah untuk pos 20% (Tabungan, Darurat, Investasi & Pelunasan Utang Prioritas)?',
                promptEn: 'Net salary Rp5,000,000 with 50/30/20 rule. How much goes to the 20% savings/priority debt bucket?',
                optionsId: ['Rp1.000.000', 'Rp500.000', 'Rp2.500.000', 'Rp1.500.000'],
                optionsEn: ['Rp1,000,000', 'Rp500,000', 'Rp2,500,000', 'Rp1,500,000'],
                correctIndex: 0,
                explanationCard: card({
                  why: '50/30/20 membagi gaji bersih menjadi 50% Kebutuhan (Rp2,5jt), 30% Keinginan (Rp1,5jt), dan 20% Tabungan/Darurat/Investasi/Pelunasan Utang Prioritas.',
                  calc: '20% × Rp5.000.000 = Rp1.000.000.',
                  next: 'Gunakan aturan ini sebagai titik awal, lalu sesuaikan jika kota tempat tinggal memiliki biaya kos lebih tinggi.',
                }),
              },
              {
                id: 's2u11s1p2_q2',
                promptId: 'Jika merantau ke kota besar sehingga kos + makan pokok + transport wajib mencapai 65% gaji (Rp3.250.000), adaptasi anggaran mana yang paling sehat?',
                promptEn: 'If mandatory essentials take 65% in a big city, how should you adapt 50/30/20?',
                optionsId: [
                  'Pangkas Keinginan ke 20% dan tetap sisihkan 15% untuk Tabungan/Darurat',
                  'Turunkan Tabungan menjadi 0% sementara agar Keinginan tetap penuh 30%',
                  'Pindahkan biaya makan pokok ke pos Keinginan supaya kebutuhan jadi 50%',
                  'Gunakan paylater 15% per bulan agar nominal tabungan tercatat 20%',
                ],
                optionsEn: [
                  'Trim Wants to 20% while keeping 15% for Savings/Emergency (65/20/15)',
                  'Cut Savings to 0% temporarily so the Wants budget stays intact at 30%',
                  'Reclassify basic food into Wants so the Needs column stays at 50%',
                  'Use 15% paylater monthly so recorded savings on paper look like 20%',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Kerangka 50/30/20 adalah pedoman fleksibel (rule of thumb). Menjaga porsi tabungan tetap hidup (meski 10–15%) sangat penting bagi ketahanan krisis.',
                  next: 'Lindungi kebiasaan menabung sekalipun nominalnya dimulai dari persentase lebih kecil.',
                }),
              },
            ]),
            mkKokiLesson('S2.U11.ST1.P3', 'Mode Teliti: Sortir Pos Anggaran 50/30/20', 'Sort 50/30/20 Budget Buckets', 'Menyortir pengeluaran berkonteks ke 4 keranjang konsisten.', {
              instructionId: 'Masukkan item berdasar konteks pekerja gaji Rp5 juta ke 3 keranjang 50/30/20 + 1 pos Hindari (Jebakan).',
              instructionEn: 'Sort budgeted items into Needs, Wants, Savings/Emergency/Debt, or Avoid Trap.',
              buckets: [
                { id: 'KEBUTUHAN', labelId: '50% KEBUTUHAN', labelEn: '50% NEEDS', icon: '🍚' },
                { id: 'KEINGINAN', labelId: '30% KEINGINAN', labelEn: '30% WANTS', icon: '☕' },
                { id: 'TABUNGAN', labelId: '20% TABUNGAN, DARURAT, INVESTASI & UTANG PRIORITAS', labelEn: '20% SAVINGS/RESERVE/DEBT', icon: '🏦' },
                { id: 'JEBAKAN', labelId: 'HINDARI (JEBAKAN)', labelEn: 'AVOID (TRAP)', icon: '🚫' },
              ],
              items: [
                { id: 'kb1', contextTagId: 'Gaji Rp5jt', labelId: 'Sewa kamar kos bersih, beras, & transport berangkat kerja bulanan', labelEn: 'Rent, groceries & work commute', correctBucketId: 'KEBUTUHAN', explanationCard: card({ why: 'Kebutuhan wajib menjaga kelangsungan hidup dan kemampuan bekerja.', next: 'Usahakan porsi wajib tetap terkendali.' }) },
                { id: 'kb2', contextTagId: 'Gaji Rp5jt', labelId: 'Nonton bioskop akhir pekan & makan di luar dalam batas plafon hiburan bulanan', labelEn: 'Budgeted movie & dining out', correctBucketId: 'KEINGINAN', explanationCard: card({ why: 'Hiburan terukur masuk pos Keinginan agar anggaran realistis dijalani.', next: 'Berhenti jajan saat batas plafon keinginan bulan ini habis.' }) },
                { id: 'kb3', contextTagId: 'Gaji Rp5jt', labelId: 'Setoran rutin Dana Darurat, Sinking Fund pajak motor, & pelunasan ekstra utang berbunga', labelEn: 'Emergency Fund, Sinking Fund & extra debt paydown', correctBucketId: 'TABUNGAN', explanationCard: card({ why: 'Masuk porsi 20% pembangun ketahanan dan kekayaan bersih keluarga.', next: 'Sisihkan di awal gajian sebelum menyentuh pos keinginan.' }) },
                { id: 'kb4', contextTagId: 'Gaji Rp5jt', labelId: 'Cicil PayLater barang hobi konsumtif berbunga tinggi di luar kemampuan kas', labelEn: 'High-interest PayLater for non-essential hobby', correctBucketId: 'JEBAKAN', explanationCard: card({ why: 'Utang konsumtif berbiaya tinggi menggerus ruang tabungan bulan-bulan berikutnya.', next: 'Menabung dulu lewat Tabungan Tujuan sebelum membeli barang hobi.' }) },
              ],
            }),
          ],
        },
        {
          id: 'S2.U11.ST2',
          stageNumber: '11.2',
          titleId: 'Anggaran Pendapatan Tidak Tetap',
          titleEn: 'Irregular Income Budgeting',
          skipExamId: 'SKIP.S2.U11.ST2',
          paths: [
            mkQuizLesson('S2.U11.ST2.P1', 'Anggaran Dasar Pekerja Lepas di Bulan Sepi', 'Baseline Budget for Irregular Pay', 'Menyusun Baseline Budget dari data 3 bulan pendapatan naik-turun.', [
              {
                id: 's2u11s2p1_q1',
                promptId: 'Penghasilan seorang pekerja lepas desain 3 bulan terakhir: Bulan 1 = Rp3,2 juta, Bulan 2 = Rp6,5 juta, Bulan 3 = Rp3,5 juta. Patokan pengeluaran hidup bulanan mana yang paling aman?',
                promptEn: '3 months pay: Rp3.2M, Rp6.5M, Rp3.5M. Safest monthly lifestyle baseline?',
                optionsId: [
                  'Patokan hidup Rp3,2–3,5jt/bln lalu simpan surplus bulan ramai sebagai Buffer',
                  'Belanja rutin Rp6,5jt/bln agar standar hidup mengikuti capaian tertinggi',
                  'Mengikat cicilan tetap Rp4,4jt/bln sesuai angka rata-rata tiga bulan terakhir',
                  'Membelanjakan penuh seluruh sisa saldo di akhir bulan ramai tanpa cadangan',
                ],
                optionsEn: [
                  'Budget lifestyle at low-month baseline ~Rp3.2–3.5M and buffer spikes',
                  'Spend up to Rp6.5M regularly to match peak monthly earnings',
                  'Commit to Rp4.4M fixed installments based on the three-month average',
                  'Exhaust remaining surplus every busy month without a cash cushion',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Mengukur gaya hidup berdasar bulan paling ramai membuat arus kas langsung jebol di bulan sepi. Bulan ramai harus mensubsidi dana cadangan bulan sepi.',
                  next: 'Buat rekening Penyangga Pendapatan (Income Buffer) khusus jika kamu pekerja lepas atau pedagang.',
                }),
              },
            ]),
            mkWordleLesson('S2.U11.ST2.P2', 'Kosakata Perencanaan Anggaran', 'Budgeting Vocabulary', 'Menguasai alokasi, pos, sinking, dan prioritas.', [
              { word: 'ALOKASI', clueId: 'Pembagian jatah uang pendapatan ke berbagai pos kebutuhan sebelum dibelanjakan.', clueEn: 'Assigning money to categories.', definitionId: 'Proses penentuan porsi persentase atau nominal uang bagi setiap tujuan anggaran.', definitionEn: 'Distributing income across budget categories.', exampleId: 'Melakukan alokasi gaji di awal bulan agar dana darurat tidak terlewat.', exampleEn: 'Allocating paycheck categories right on payday.' },
              { word: 'POS', clueId: 'Kantong atau kategori spesifik dalam anggaran seperti Pos Makan atau Pos Pajak.', clueEn: 'Specific budget category bucket.', definitionId: 'Kelompok anggaran terpisah untuk mengendalikan batas belanja masing-masing kebutuhan.', definitionEn: 'Dedicated spending or saving bucket.', exampleId: 'Membuat pos listrik dan pos beras terpisah dari pos hiburan.', exampleEn: 'Separating utilities bucket from entertainment.' },
              { word: 'SINKING', clueId: 'Dana tabungan bertahap untuk tagihan besar berkala yang jadwalnya sudah pasti.', clueEn: 'Savings fund for scheduled future bills.', definitionId: 'Sinking Fund: penyisihan rutin bulanan agar tagihan tahunan/semesteran tak menjebol kas bulan tertentu.', definitionEn: 'Planned reserve for known future expenses.', exampleId: 'Menabung Rp100.000/bulan khusus untuk membayar pajak motor tahun depan.', exampleEn: 'Saving monthly for next year vehicle tax.' },
              { word: 'PRIORITAS', clueId: 'Urutan hal terpenting yang wajib didanai terlebih dahulu ketika anggaran terbatas.', clueEn: 'Top-ranked essential funding order.', definitionId: 'Penentuan urutan kebutuhan pokok, kewajiban, dan tujuan sesuai tingkat urgensi & dampak.', definitionEn: 'Ranking items by essential impact.', exampleId: 'Prioritas pertama gajian adalah kebutuhan primer dan Dana Darurat.', exampleEn: 'Primary needs and Emergency Fund come first.' },
            ]),
          ],
        },
        {
          id: 'S2.U11.ST3',
          stageNumber: '11.3',
          titleId: 'Sinking Fund & Pengeluaran Berkala',
          titleEn: 'Sinking Funds & Periodic Bills',
          skipExamId: 'SKIP.S2.U11.ST3',
          paths: [
            mkPairLesson('S2.U11.ST3.P1', 'Beda 4 Kantong Keuangan Keluarga', '4 Separate Financial Buckets', 'Membedakan Dana Darurat vs Sinking Fund vs Tabungan Tujuan vs Investasi.', {
              mode: 'pairs',
              instructionId: 'Cocokkan 4 jenis kantong keuangan agar tidak keliru membongkar pos saat tagihan muncul.',
              instructionEn: 'Match the 4 financial containers cleanly.',
              pairs: [
                { id: 'bk1', leftId: 'Dana Darurat', leftEn: 'Emergency Fund', rightId: 'Kejadian mendadak tak terduga (PHK, sakit IGD, atap bocor badai)', rightEn: 'True unexpected emergencies' },
                { id: 'bk2', leftId: 'Sinking Fund', leftEn: 'Sinking Fund', rightId: 'Tagihan berkala yang sudah pasti jadwalnya (Pajak STNK tahunan, daftar ulang sekolah, servis berkala)', rightEn: 'Predictable scheduled future bills' },
                { id: 'bk3', leftId: 'Tabungan Tujuan', leftEn: 'Goal Savings', rightId: 'Target spesifik jangka pendek–menengah (DP usaha / beli laptop kerja 1 tahun lagi)', rightEn: 'Targeted 1–2 year purchases' },
                { id: 'bk4', leftId: 'Investasi', leftEn: 'Investment', rightId: 'Pertumbuhan kekayaan jangka menengah–panjang sesuai profil risiko & fluktuasi', rightEn: 'Long-term wealth growth within risk tolerance' },
              ],
              explanationCard: card({
                why: 'Membayar pajak motor tahunan dari Dana Darurat adalah kesalahan umum! Pajak STNK jadwalnya sudah diketahui jauh hari sehingga seharusnya disiapkan di Sinking Fund.',
                next: 'Catat minimal 3 tagihan tahunan di kalendermu untuk dibuatkan iuran Sinking Fund.',
              }),
            }),
            mkQuizLesson('S2.U11.ST3.P2', 'Menghitung Iuran Bulanan Sinking Fund', 'Sinking Fund Monthly Math', 'Menghitung cicilan tabungan bulanan tagihan berkala.', [
              {
                id: 's2u11s3p2_q1',
                promptId:
                  'Keluargamu memiliki 3 agenda pasti: Pajak motor tahunan Rp1.200.000 (12 bulan lagi), uang daftar ulang sekolah Rp2.400.000 (6 bulan lagi), dan servis berkala Rp600.000 (6 bulan lagi). Berapa total iuran Sinking Fund per bulan?',
                promptEn: 'Vehicle tax Rp1.2M/12m + school fee Rp2.4M/6m + maintenance Rp600k/6m. Total monthly Sinking Fund needed?',
                optionsId: ['Rp600.000/bulan', 'Rp350.000/bulan', 'Rp700.000/bulan', 'Rp500.000/bulan'],
                optionsEn: ['Rp600,000/month', 'Rp350,000/month', 'Rp700,000/month', 'Rp500,000/month'],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Memecah tagihan tahunan/semesteran menjadi cicilan tabungan bulanan menjaga arus kas bulanan tetap datar dan tenang.',
                  calc: 'STNK = 1,2jt ÷ 12 = Rp100rb; Sekolah = 2,4jt ÷ 6 = Rp400rb; Servis = 600rb ÷ 6 = Rp100rb → Total = Rp600.000/bulan!',
                  next: 'Masukkan Rp600.000 ini di hari gajian agar tidak terasa berat saat jatuh tempo.',
                }),
              },
              {
                id: 's2u11s3p2_q2',
                promptId:
                  '[Analitik HOTS] Sisa surplus gaji bulanmu tinggal Rp750.000. Dua bulan lagi tagihan pasti STNK + masuk sekolah Rp1.200.000 jatuh tempo, dan saldo Sinking Fund sekarang Rp300.000, sementara Dana Darurat baru Rp1.000.000 (masih di bawah target). Berapa minimal alokasi bulan ini ke Sinking Fund agar jadwal pasti aman tanpa utang baru?',
                promptEn: '[HOTS] Monthly surplus Rp750k. Rp1.2M fixed bill arrives in 2 months (Rp300k already saved in Sinking Fund), while Emergency Fund sits at Rp1M. Minimum to allocate into Sinking Fund this month?',
                optionsId: [
                  'Sisihkan Rp450.000/bln ke Sinking Fund & Rp300.000/bln ke Dana Darurat',
                  'Masukkan seluruh Rp750.000 ke Dana Darurat lalu bayar sekolah dengan pinjol',
                  'Masukkan Rp150.000 ke Sinking Fund & Rp600.000 ke pos hiburan agar tidak stres',
                  'Tunda mengisi Sinking Fund karena Dana Darurat belum penuh 3 bulan belanja',
                ],
                optionsEn: [
                  'Put Rp450k/mo into Sinking Fund and Rp300k/mo into Emergency Fund',
                  'Put all Rp750k into Emergency Fund and cover school with online credit',
                  'Split Rp150k to Sinking Fund and Rp600k to recreation to relieve stress',
                  'Pause Sinking Fund completely until Emergency Fund hits 3x expenses',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Prioritas arus kas jangka pendek (C5-C6) memisahkan tagihan berjadwal pasti dari darurat tak terduga agar tidak perlu meminjam bunga tinggi saat jatuh tempo tiba.',
                  calc: 'Kekurangan Sinking Fund = Rp1.200.000 − Rp300.000 = Rp900.000 untuk 2 bulan → Rp450.000/bulan. Sisa surplus Rp300.000 tetap menumbuhkan Dana Darurat tanpa menguras cadangan!',
                  next: 'Jika jadwal tagihan berjarak dekat, tutup kekurangan Sinking Fund secara proporsional per sisa bulan sebelum jatuh tempo.',
                  type: 'simulation_assumption',
                }),
              },
            ]),
            mkKokiLesson('S2.U11.ST3.P3', 'Pilih Sumber Kantong Saat Tagihan Muncul', 'Pick Right Bucket for Bills', 'Menentukan sumber dana: Sinking Fund vs Dana Darurat vs Anggaran Rutin.', {
              instructionId: 'Saat peristiwa keuangan berikut terjadi, kantong mana yang seharusnya digunakan untuk membayarnya?',
              instructionEn: 'Choose the proper bucket to fund each event.',
              buckets: [
                { id: 'SINKING', labelId: 'SINKING FUND', labelEn: 'SINKING FUND', icon: '📅' },
                { id: 'DARURAT', labelId: 'DANA DARURAT', labelEn: 'EMERGENCY FUND', icon: '🚑' },
                { id: 'RUTIN', labelId: 'ANGGARAN BULANAN RUTIN', labelEn: 'MONTHLY BUDGET', icon: '🧾' },
              ],
              items: [
                { id: 'sk1', contextTagId: 'Jadwal tahunan', labelId: 'Membayar perpanjangan pajak STNK motor tahunan', labelEn: 'Annual vehicle registration tax', correctBucketId: 'SINKING', explanationCard: card({ why: 'Tanggal jatuh tempo STNK pasti dan berulang tiap tahun.', next: 'Siapkan 1/12 per bulan di Sinking Fund.' }) },
                { id: 'sk2', contextTagId: 'Jadwal semesteran', labelId: 'Biaya daftar ulang dan buku semester baru sekolah anak', labelEn: 'Scheduled school term fee', correctBucketId: 'SINKING', explanationCard: card({ why: 'Tahun ajaran baru sudah diketahui jadwalnya jauh hari.', next: 'Jangan tunggu bulan Juli baru mencari uang tunai.' }) },
                { id: 'sk3', contextTagId: 'Musibah mendadak', labelId: 'Anggota keluarga mendadak masuk IGD rumah sakit atau terkena PHK', labelEn: 'Sudden ER hospital visit or layoff', correctBucketId: 'DARURAT', explanationCard: card({ why: 'Tidak terduga waktunya dan bersifat mendesak.', next: 'Segera isi kembali Dana Darurat bila terpakai.' }) },
                { id: 'sk4', contextTagId: 'Kerusakan tak terduga', labelId: 'Kulkas rumah tangga tiba-tiba rusak total di luar jadwal perawatan', labelEn: 'Sudden total fridge breakdown', correctBucketId: 'DARURAT', explanationCard: card({ why: 'Kegagalan alat rumah vital tak terduga termasuk kejadian darurat wajar.', next: 'Gunakan cadangan darurat daripada menggesek utang konsumtif.' }) },
                { id: 'sk5', contextTagId: 'Konsumsi bulanan', labelId: 'Bayar tagihan listrik bulanan dan belanja beras minggu ini', labelEn: 'Monthly electricity & rice groceries', correctBucketId: 'RUTIN', explanationCard: card({ why: 'Pengeluaran rutin bulanan dibayar dari pos kebutuhan anggaran berjalan.', next: 'Jaga agar konsumsi bulanan tak melebihi plafon.' }) },
              ],
            }),
            mkStoryLesson('S2.U11.ST3.P4', 'Jangan Jebol di Bulan ke-5', 'Survive Month 5 Bills', 'Simulasi 6 bulan menjaga Sinking Fund sebelum tagihan sekolah & STNK tiba.', {
              titleId: 'Simulasi 6 Bulan Menjaga Sinking Fund',
              subtitleId: 'Uji Konsistensi Pay Yourself First & Sinking Fund',
              durationLabelId: '6 Bulan Virtual',
              initialState: { cash: 1_500_000, emergencyFund: 1_500_000, sinkingFund: 0, debt: 0, netWorth: 3_000_000 },
              chapters: [
                {
                  id: 'u11_b1',
                  periodLabelId: 'Bulan 1–2: Awal Gajian',
                  narrativeId: 'Gaji bersih Rp5.000.000/bln. Di Bulan ke-5 ada tagihan STNK + uang masuk sekolah total Rp2.400.000.',
                  choices: [
                    { id: 'c1', labelId: 'Terapkan Pay Yourself First: langsung sisihkan Rp600.000/bln ke Sinking Fund sejak Bulan 1', feedbackId: 'Disiplin hebat! Dalam 4 bulan pertama Sinking Fundmu terkumpul Rp2.400.000 utuh!', deltas: { cash: 400_000, sinkingFund: 2_400_000, scoreCashflow: 30, scoreGoal: 30 }, isRecommended: true },
                    { id: 'c2', labelId: 'Habiskan seluruh sisa gaji Bulan 1–4 untuk nongkrong, pikirkan tagihan Bulan 5 nanti saja', feedbackId: 'Sinking Fund masih Rp0 saat Bulan 5 makin dekat!', deltas: { cash: -600_000, scoreCashflow: -20 } },
                  ],
                },
                {
                  id: 'u11_b2',
                  periodLabelId: 'Bulan 5: Tagihan Rp2.400.000 Jatuh Tempo!',
                  narrativeId: 'Surat tagihan daftar ulang sekolah dan STNK total Rp2.400.000 tiba bersamaan di Bulan ke-5.',
                  choices: [
                    { id: 'c1', labelId: 'Bayar lunas menggunakan kantong Sinking Fund tanpa menyentuh Dana Darurat atau berutang', feedbackId: 'Mulus! Gaji Bulan 5 tetap aman untuk makan & kebutuhan harian dan Dana Darurat tetap utuh!', deltas: { sinkingFund: -2_400_000, scoreRisk: 30, scoreGoal: 25 }, isRecommended: true },
                    { id: 'c2', labelId: 'Bongkar seluruh Dana Darurat atau pinjam PayLater bunga tinggi untuk bayar sekolah', feedbackId: 'Akibat tak menyiapkan Sinking Fund, Dana Daruratmu habis / utang baru muncul!', deltas: { emergencyFund: -1_500_000, debt: 900_000, netWorth: -900_000, scoreRisk: -25 } },
                  ],
                },
                {
                  id: 'u11_b3',
                  periodLabelId: 'Bulan 6: Atap Bocor Mendadak',
                  narrativeId: 'Hujan badai merusak genteng (biaya perbaikan mendadak Rp600.000). Bagaimana kondisi kasmu?',
                  choices: [
                    { id: 'c1', labelId: 'Tutup dari Dana Darurat yang masih utuh lalu mulai cicil isi kembali mulai bulan depan', feedbackId: 'Sempurna! Sistem 4 kantong membuat guncangan ganda tetap terkendali.', deltas: { emergencyFund: -600_000, scoreCashflow: 20, scoreRisk: 20 }, isRecommended: true },
                    { id: 'c2', labelId: 'Mengaku menyerah dan cari pinjaman ilegal harian', feedbackId: 'Pinjaman ilegal menghancurkan keuangan rumah tangga!', deltas: { debt: 1_500_000, scoreSecurity: -35 }, illegalDebtFlag: true },
                  ],
                },
              ],
              explanationCard: card({
                why: 'Sinking Fund melindungi Dana Darurat agar Dana Darurat tetap siap menghadapi musibah tak terduga.',
                next: 'Pertahankan pemisahan 4 kantong saat menghadapi UAS Semester 2!',
                type: 'simulation_assumption',
              }),
            }, { simMonths: 6 }),
          ],
        },
      ],
    },
  ],
  uts: buildUTS('S2', 'UTS Semester 2: Perbankan, QRIS & Karier', 'Unit 6–10', ['S2.U6', 'S2.U7', 'S2.U8', 'S2.U9', 'S2.U10']),
  uas: buildUAS(
    'S2',
    'UAS Semester 2: Evaluasi Karier, Cashflow & Anggaran',
    'Unit 6–11',
    ['S2.U6', 'S2.U7', 'S2.U8', 'S2.U9', 'S2.U10', 'S2.U11'],
    'Proyek Kelola Karier, Cashflow & Sinking Fund 12 Bulan',
    12,
    {
      isPerformanceProject: true,
      titleId: 'Proyek UAS S2: Kelola Karier, Cashflow & Sinking Fund 12 Bulan',
      subtitleId: 'Bagian 2 Proyek Kinerja · Bobot 50%: Uji Pilihan Karier, QRIS Aman & Ketahanan Sinking Fund',
      durationLabelId: '12 Bulan Virtual',
      initialState: { cash: 2_000_000, emergencyFund: 1_000_000, sinkingFund: 0, debt: 0, netWorth: 3_000_000 },
      chapters: [
        {
          id: 's2_uas_1',
          periodLabelId: 'Bulan 1–3: Memilih Tawaran Kerja & Setup Rekening',
          narrativeId: 'Pilih Tawaran Kerja B (net pasca-ongkos Rp5,25jt + BPJS TK) lalu atur top-up e-wallet & Pay Yourself First Rp600rb/bln Sinking Fund.',
          choices: [
            { id: 'c1', labelId: 'Pilih Tawaran B, simpan tabungan di bank LPS, & aktifkan Sinking Fund Rp600rb/bulan sejak Bulan 1', feedbackId: 'Pondasi arus kas kuat dan Sinking Fund bertumbuh stabil!', deltas: { cash: 1_500_000, sinkingFund: 1_800_000, emergencyFund: 1_000_000, scoreCashflow: 25, scoreGoal: 25 }, isRecommended: true },
            { id: 'c2', labelId: 'Pilih tawaran gaji kotor tinggi berongkos mahal lalu habiskan sisa bulanan di e-wallet tanpa Sinking Fund', feedbackId: 'Ongkos kerja & top-up berulang menggerus sisa bersih tanpa cadangan.', deltas: { cash: -400_000, scoreCashflow: -15 } },
          ],
        },
        {
          id: 's2_uas_2',
          periodLabelId: 'Bulan 4–6: Penurunan Komisi & Audit QRIS Warung',
          narrativeId: 'Bulan 5 komisi turun, ditambah saat belanja ada stiker QRIS timpaan bermerek asing serta muncul ajakan transfer jual-beli di luar VA resmi.',
          choices: [
            { id: 'c1', labelId: 'Gunakan Baseline Budget pos variabel, verifikasi nama merchant QRIS, & bayar via VA/QRIS asli', feedbackId: 'Kas tetap solven dan terhindar dari penipuan stiker QRIS palsu!', deltas: { cash: 300_000, scoreSecurity: 30, scoreCashflow: 20 }, isRecommended: true },
            { id: 'c2', labelId: 'Abaikan cek merchant & paksa gaya hidup mewah lewat cicilan konsumtif', feedbackId: 'Kas tertekan defisit dan rugi transfer QRIS palsu!', deltas: { cash: -500_000, debt: 600_000, scoreSecurity: -25 } },
          ],
        },
        {
          id: 's2_uas_3',
          periodLabelId: 'Bulan 7–12: Jatuh Tempo STNK & Biaya Sekolah',
          narrativeId: 'Tagihan tahunan STNK & masuk sekolah total Rp3.000.000 jatuh tempo di Bulan ke-10.',
          choices: [
            { id: 'c1', labelId: 'Bayar lunas dari akumulasi Sinking Fund + jaga Dana Darurat tetap aman untuk akhir tahun', feedbackId: 'Luar biasa! Kamu lulus Semester 2 dengan arus kas sehat, cadangan kuat, & bebas utang konsumtif.', deltas: { sinkingFund: -1_800_000, netWorth: 2_000_000, scoreRisk: 30, scoreGoal: 30 }, isRecommended: true },
            { id: 'c2', labelId: 'Ambil pinjol harian ilegal karena kehabisan kas tunai di Bulan 10', feedbackId: 'Gagal Kritis: keterlibatan pinjaman ilegal menggugurkan Bagian 2.', deltas: { debt: 3_000_000, scoreSecurity: -40 }, illegalDebtFlag: true },
          ],
        },
      ],
      explanationCard: card({
        why: 'Mengelola sisa penghasilan bersih setelah biaya kerja, transaksi BI-FAST/QRIS aman, dan disiplin Sinking Fund melindungi kesehatan kas sepanjang tahun.',
        type: 'simulation_assumption',
        next: 'Semester 3 akan melatih manajemen utang sehat, SLIK OJK, benteng data rahasia, dan pemulihan siber!',
      }),
    }
  ),
};
