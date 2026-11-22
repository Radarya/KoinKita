import { SemesterSpec } from '../types';
import {
  REG_SOURCES,
  buildUAS,
  buildUTS,
  card,
  mkDetektifLesson,
  mkKokiLesson,
  mkPairLesson,
  mkPohonLesson,
  mkQuizLesson,
  mkStoryLesson,
  mkWordleLesson,
} from '../helpers';

export const SEMESTER_6: SemesterSpec = {
  id: 'S6',
  semesterNumber: 6,
  titleId: 'Semester 6: Psikologi Investasi, Ekonomi Makro, Pajak, UMKM & Stress Test Keluarga',
  titleEn: 'Semester 6: Psychology, Macro, PP 20/2026 Tax, MSME & Family Stress Test',
  subtitleId: 'Korelasi aset, BI-Rate, Pajak UMKM PP 20/2026, Pembukuan Usaha, KPR bunga mengambang & Capstone.',
  units: [
    // ================= UNIT 27 =================
    {
      id: 'S6.U27',
      unitNumber: 27,
      semesterId: 'S6',
      titleId: 'Diversifikasi, Korelasi Aset, Psikologi & Batasan DCA',
      titleEn: 'Diversification, Correlation, Psychology & Honest DCA Limits',
      guidebook: {
        summaryId:
          'Diversifikasi sejati memperhatikan korelasi antar-aset (membeli 5 saham berbeda di 1 sektor perbankan/ritel yang jatuh serentak bukanlah diversifikasi kuat). Dengan asumsi total modal, instrumen, dan horizon yang setara, Dollar-Cost Averaging (DCA) membantu disiplin bulanan & menekan penyesalan awal, tetapi tidak menjamin untung bila kualitas aset memburuk dan cenderung tertinggal dari Lump Sum pada pasar yang naik stabil. Kendalikan Panic Selling, Overconfidence, & Herd Behavior serta kenali Skema Ponzi.',
        summaryEn: 'Asset correlation, honest equal-parameter comparison of DCA vs Lump Sum, behavioral biases, and Ponzi exposure.',
        keyRulesId: [
          'Korelasi rendah lintas kelas aset (mis. pasar uang/SBN + ekuitas/emas sesuai profil) menurunkan risiko jatuh serentak.',
          'DCA unggul membangun kebiasaan menabung dari gaji bulanan dan meredam ketakutan masuk di satu puncak, bukan jaminan untung pasti.',
          'Ciri Skema Ponzi: profit tetap tinggi tanpa model bisnis produktif riil, pembayaran anggota awal diambil dari setoran anggota baru.',
        ],
        keyRulesEn: [
          'True diversification mixes low-correlation asset classes.',
          'DCA builds salary discipline rather than guaranteeing positive returns.',
          'Ponzi schemes pay early joiners with new inflows rather than real operating cashflows.',
        ],
        disclaimerId: 'Edukasi Mekanisme: Pembahasan DCA, korelasi, dan bias psikologis tidak merekomendasikan instrumen atau saham tertentu.',
        disclaimerEn: 'Non-Investment Advice: Behavioral & allocation mechanics only.',
      },
      stages: [
        {
          id: 'S6.U27.ST1',
          stageNumber: '27.1',
          titleId: 'Korelasi Portofolio, Psikologi & Batas Jujur DCA',
          titleEn: 'Correlation, Bias & Honest DCA Limits',
          skipExamId: 'SKIP.S6.U27.ST1',
          paths: [
            mkQuizLesson('S6.U27.ST1.P1', 'Korelasi Antar-Aset & Risiko Konsentrasi 5 Saham Sektor Sama', 'Asset Correlation & Concentration', 'Memahami korelasi antar-kelas aset.', [
              {
                id: 's6u27s1p1_q1',
                promptId: 'Budi membagi modalnya merata ke 5 saham berbeda, tetapi kelimanya berada di sektor ritel/perbankan bursa yang sama. Mengapa saat sentimen makro memburuk kelimanya turun bersamaan?',
                promptEn: 'Budi splits cash across 5 stocks all in the same banking/retail sector. Why do all 5 drop together?',
                optionsId: [
                  'Korelasi intra-sektor tinggi; diversifikasi efektif perlu lintas kelas aset',
                  'Aturan BEI membatasi penguatan saham jika investor memegang lima emiten',
                  'Membagi ke lima saham menggandakan biaya manajemen tahunan bursa',
                  'Menyebar ke lima saham berbeda otomatis menurunkan risiko pasar ke nol',
                ],
                optionsEn: [
                  'High intra-sector correlation; real diversification combines distinct asset classes',
                  'Exchange limits cap price gains whenever retail investors own five tickers',
                  'Holding five stocks multiplies official annual exchange custody costs by five',
                  'Splitting capital across five stock tickers lowers systemic market risk to zero',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Memecah dana ke banyak produk serupa di satu sektor yang digerakkan faktor ekonomi yang sama tidak menurunkan risiko sistematis sektor tersebut.',
                  next: 'Gabungkan porsi defensif (kas/SBN) dan porsi bertumbuh lintas sektor sesuai tujuan horizonmu.',
                }),
              },
            ]),
            mkQuizLesson('S6.U27.ST1.P2', 'Evaluasi Jujur Strategi DCA vs Lump Sum', 'Honest Evaluation of DCA vs Lump Sum', 'Membandingkan DCA & Lump Sum dengan asumsi modal, instrumen, & horizon setara.', [
              {
                id: 's6u27s1p2_q1',
                promptId:
                  'Dengan ASUMSI total modal yang sama, instrumen sama, dan jangka waktu investasi yang sama: apakah membeli rutin tiap bulan (DCA) menjamin 100% pasti untung dan selalu mengalahkan investasi sekaligus (Lump Sum)?',
                promptEn: 'With equal total capital, asset & timeframe: does DCA guarantee profit and always beat Lump Sum?',
                optionsId: [
                  'Tidak pasti untung; pasar naik dukung Lump Sum, DCA jaga disiplin gaji & psikologi',
                  'Ya, pembelian rutin DCA menjamin untung 100% berapa pun turunnya nilai aset',
                  'Lump Sum pasti selalu merugi dibanding DCA pada semua fase pergerakan pasar',
                  'DCA langsung membebaskan biaya transaksi broker dan pajak penghasilan saham',
                ],
                optionsEn: [
                  'Not guaranteed; rising markets favor Lump Sum, while DCA fits salary discipline',
                  'Yes, scheduled DCA guarantees positive profits regardless of asset price declines',
                  'Lump Sum unconditionally underperforms monthly DCA across every market regime',
                  'DCA waives all brokerage commission fees and stock sale final tax charges',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'DCA bukan sihir anti-rugi: ia merata harga beli ketika pasar bergejolak dan cocok bagi penerima gaji bulanan yang memang baru mengumpulkan uang tiap bulan, bukan alasan menimbun uang tunai menganggur berisiko tergerus inflasi.',
                  assume: 'Perbandingan adil mengharuskan total dana awal setara, instrumen sama, dan periode waktu identik.',
                  type: 'simulation_assumption',
                  next: 'Pilih instrumen berkualitas sebelum menerapkan pembelian berkala maupun sekaligus.',
                }),
              },
            ], { st: 'simulation_assumption' }),
            mkPairLesson('S6.U27.ST1.P3', 'Mengatasi 3 Bias Psikologi Investor', '3 Behavioral Biases Match', 'Mengenali Panic Selling, Overconfidence, & Herd Behavior.', {
              mode: 'pairs',
              instructionId: 'Cocokkan 3 jebakan psikologis investor berikut dengan kesalahan tindakan nyatanya.',
              instructionEn: 'Match 3 investor behavioral traps with their real-world errors.',
              pairs: [
                { id: 'bs1', leftId: 'Panic Selling', leftEn: 'Panic Selling', rightId: 'Menjual rugi aset berfundamental baik saat turun sementara karena panik berita jangka pendek', rightEn: 'Selling good long-term assets in temporary fear' },
                { id: 'bs2', leftId: 'Overconfidence Bias', leftEn: 'Overconfidence', rightId: 'Merasa pasti benar menebak arah pasar lalu mempertaruhkan seluruh modal ke 1 aset berisiko (all-in)', rightEn: 'Betting everything on one hunch' },
                { id: 'bs3', leftId: 'Herd Behavior (FOMO)', leftEn: 'Herd Behavior / FOMO', rightId: 'Ikut-ikutan memborong aset yang sudah melonjak tinggi hanya karena semua grup membicarakannya', rightEn: 'Chasing hype purely to follow the crowd' },
              ],
              explanationCard: card({
                why: 'Kesalahan terbesar sering berasal dari emosi takut atau serakah ketimbang rumus matematika.',
                next: 'Tulis aturan alokasi sebelum membuka aplikasi transaksi agar keputusan tidak dikendalikan emosi sesaat.',
              }),
            }),
          ],
        },
        {
          id: 'S6.U27.ST2',
          stageNumber: '27.2',
          titleId: 'Membongkar Skema Ponzi & Manipulasi Pasar',
          titleEn: 'Exposing Ponzi Schemes & Market Traps',
          skipExamId: 'SKIP.S6.U27.ST2',
          paths: [
            mkWordleLesson('S6.U27.ST2.P1', 'Kosakata Diversifikasi & Skema Ponzi', 'Portfolio & Scam Terms', 'Menguasai istilah Ponzi, Korelasi, Herd, Biasing.', [
              { word: 'PONZI', clueId: 'Skema penipuan berkedok investasi yang membayar anggota lama memakai uang setoran anggota baru.', clueEn: 'Fraudulent payout model fueled by new recruits.', definitionId: 'Skema investasi ilegal tanpa keuntungan usaha riil yang tampak membayar di awal sebelum kolaps massal.', definitionEn: 'Pyramid/Ponzi fraud paying early members via inflows.', exampleId: 'Robot trading ilegal dengan janji profit tetap 1%/hari sering berakhir sebagai skema Ponzi.', exampleEn: 'Fake 1%/day trading bots often turn out to be Ponzi traps.' },
              { word: 'KORELASI', clueId: 'Ukuran keterkaitan arah gerak dua instrumen ketika kondisi pasar berubah.', clueEn: 'Statistical co-movement between two assets.', definitionId: 'Derajat kecenderungan dua aset naik atau turun bersamaan (-1 hingga +1).', definitionEn: 'Degree two assets move in tandem.', exampleId: 'Menurunkan risiko portofolio dengan memadukan kelas aset yang tidak berkorelasi penuh.', exampleEn: 'Reducing concentration by mixing imperfectly correlated classes.' },
              { word: 'HERD', clueId: 'Perilaku ikut-ikutan kerumunan tanpa analisis mandiri (FOMO / mentalitas kawanan).', clueEn: 'Crowd-following FOMO instinct.', definitionId: 'Kecenderungan meniru keputusan beli/jual orang banyak hanya karena takut tertinggal.', definitionEn: 'Mindless herd mentality overriding research.', exampleId: 'Membeli koin tak dikenal hanya karena tren viral grup chat adalah contoh herd behavior.', exampleEn: 'Buying viral hype tokens is classic herd behavior.' },
              { word: 'BIASING', clueId: 'Penyimpangan pola pikir emosional yang membuat penilaian risiko menjadi tidak objektif.', clueEn: 'Cognitive distortion skewing financial judgment.', definitionId: 'Kecenderungan psikologis sistematis seperti terlalu percaya diri (overconfidence) saat menilai aset.', definitionEn: 'Behavioral distortion affecting rational choices.', exampleId: 'Menggunakan catatan tertulis sebelum berinvestasi membantu mengurangi bias emosional.', exampleEn: 'Written allocation rules mitigate emotional biasing.' },
            ]),
            mkDetektifLesson('S6.U27.ST2.P2', 'Bongkar Anatomi Skema Ponzi & Robot Trading', 'Ponzi & Robot Trading Audit', 'Mengaudit klaim untung harian tetap dan struktur anggota-get-member.', [
              {
                id: 'u27_dc1',
                channel: 'Tawaran',
                senderTitle: 'Platform "Robot Forex Auto-Cuan 1% Pasti Setiap Hari + Bonus Rekrut Anggota 15%"',
                documentLines: [
                  '• Mengklaim teknologi AI tak pernah kalah ("Profit Fix 1%/Hari = 30%/Bulan!")',
                  '• Tidak memiliki izin OJK maupun Bappebti sebagai pialang resmi',
                  '• Pendaftar awal tampak benar-benar lancar mencairkan profit selama aliran member baru deras',
                ],
                questionId: 'Mengapa pada bulan-bulan awal skema seperti ini tampak "benar-benar membayar" dan apa risiko akhirnya?',
                optionsId: [
                  { id: 'o1', labelId: 'BAHAYA (SKEMA PONZI): Uang payout pendaftar awal berasal dari setoran anggota baru, BUKAN profit riil; saat rekrutan melambat skema langsung tutup & membawa kabur dana!', verdict: 'BAHAYA' },
                  { id: 'o2', labelId: 'AMAN: Selama 3 bulan awal lancar cair berarti legal dan aman selamanya', verdict: 'AMAN' },
                  { id: 'o3', labelId: 'WASPADA: Ajak seluruh keluarga besar agar selalu jadi pendaftar paling awal', verdict: 'WASPADA' },
                ],
                correctOptionId: 'o1',
                evidenceLevel: 'red_flag',
                explanationCard: card({
                  why: 'Pembayaran lancar di awal justru menjadi umpan utama Skema Ponzi agar korban berani menyetor uang jauh lebih besar dan merekrut kenalan sebelum pengelola menghilang.',
                  next: 'Cek legalitas pialang/investasi ke OJK 157 / Bappebti dan tolak segala tawaran profit tetap harian fantastis.',
                }),
              },
            ], { isBoss: true }),
          ],
        },
      ],
    },

    // ================= UNIT 28 =================
    {
      id: 'S6.U28',
      unitNumber: 28,
      semesterId: 'S6',
      titleId: 'Ekonomi Makro, BI-Rate, Kurs & Siklus Pasar',
      titleEn: 'Macroeconomics, BI-Rate, FX & Market Cycles',
      regulationMeta: REG_SOURCES.BI_RATE,
      guidebook: {
        summaryId:
          'Suku bunga kebijakan resmi Bank Indonesia bernama BI-Rate (penamaan standar sejak 21 Desember 2023). Perubahan BI-Rate, inflasi pangan/energi, Kurs Rupiah, serta fase Boom dan Resesi berimbas pada anggaran keluarga, dengan catatan perubahan BI-Rate cenderung memengaruhi suku bunga deposito baru & KPR floating secara bertahap tergantung kebijakan bank, likuiditas, serta ketentuan kontrak.',
        summaryEn: 'Standardized BI-Rate transmission mechanics (subject to bank/contract policy), FX shocks, and Boom–Recession cycles.',
        keyRulesId: [
          'BI-Rate menggantikan sebutan lama BI7DRR sejak 21 Desember 2023 dengan makna operasional yang tetap sama.',
          'Kenaikan BI-Rate CENDERUNG mendorong bunga deposito baru dan bunga kredit/KPR floating bergerak naik bertahap (tidak berubah seragam otomatis seketika di setiap bank).',
          'Saat pelemahan Rupiah atau resesi, pertebal kas Dana Darurat dan kendalikan komponen impor/utang konsumtif.',
        ],
        keyRulesEn: [
          'BI-Rate is the official benchmark name since Dec 2023.',
          'BI-Rate shifts tend to affect bank rates gradually based on bank liquidity & contracts.',
          'Strengthen liquidity and delay non-essential loans ahead of downturns.',
        ],
        disclaimerId: 'Referensi Regulasi: Kebijakan Moneter Bank Indonesia (BI-Rate) & mekanisme transmisi perbankan.',
        disclaimerEn: 'Regulatory Reference: Bank Indonesia Monetary Policy Rate.',
      },
      stages: [
        {
          id: 'S6.U28.ST1',
          stageNumber: '28.1',
          titleId: 'Navigasi Siklus Ekonomi Makro',
          titleEn: 'Navigating Macroeconomic Cycles',
          skipExamId: 'SKIP.S6.U28.ST1',
          paths: [
            mkWordleLesson('S6.U28.ST1.P1', 'Kosakata Ekonomi Makro', 'Macroeconomics Vocabulary', 'Menguasai istilah Resesi, Kurs, Moneter, Acuan.', [
              { word: 'RESESI', clueId: 'Fase perlambatan ekonomi berkepanjangan ketika daya beli lesu & lapangan kerja ketat.', clueEn: 'Sustained macroeconomic contraction.', definitionId: 'Kondisi pertumbuhan ekonomi negatif berturut-turut yang menuntut prioritas kas likuid lebih kuat.', definitionEn: 'Prolonged slowdown raising employment risk.', exampleId: 'Menunda utang konsumtif baru dan menjaga Dana Darurat saat tanda-tanda resesi menguat.', exampleEn: 'Delaying debt and boosting cash reserves during slowdowns.' },
              { word: 'KURS', clueId: 'Nilai tukar satu mata uang terhadap mata uang asing seperti Rupiah terhadap Dolar AS.', clueEn: 'Currency exchange rate.', definitionId: 'Perbandingan harga tukar Rupiah terhadap valuta asing pada sistem perbankan/perdagangan.', definitionEn: 'Relative value of IDR vs foreign currencies.', exampleId: 'Pelemahan kurs Rupiah cenderung menaikkan harga bahan baku atau barang impor.', exampleEn: 'Rupiah depreciation pushes up imported input prices.' },
              { word: 'MONETER', clueId: 'Kebijakan Bank Sentral mengatur jumlah uang beredar dan suku bunga acuan demi stabilitas.', clueEn: 'Central bank rate & money supply policy.', definitionId: 'Kebijakan otoritas moneter (Bank Indonesia) untuk menjaga kestabilan nilai Rupiah & inflasi.', definitionEn: 'Central bank policy maintaining price & FX stability.', exampleId: 'Rapat Dewan Gubernur BI menetapkan BI-Rate sebagai sinyal arah kebijakan moneter.', exampleEn: 'BI Board adjusts BI-Rate in monthly monetary meetings.' },
              { word: 'ACUAN', clueId: 'Suku bunga kebijakan resmi (BI-Rate) yang menjadi rujukan pergerakan suku bunga pasar.', clueEn: 'Benchmark policy rate reference.', definitionId: 'Tingkat suku bunga patokan otoritas moneter yang ditransmisikan bertahap ke sistem perbankan.', definitionEn: 'Central bank policy interest benchmark.', exampleId: 'Pergerakan suku bunga acuan BI-Rate memengaruhi bunga deposito & KPR floating secara bertahap.', exampleEn: 'Benchmark BI-Rate influences deposit and floating loan yields.' },
            ]),
            mkQuizLesson('S6.U28.ST1.P2', 'Efek Berantai BI-Rate & Pelemahan Kurs', 'BI-Rate & FX Domino Effects', 'Menganalisis transmisi BI-Rate sesuai kebijakan bank/kontrak & dampak kurs.', [
              {
                id: 's6u28s1p2_q1',
                promptId: 'Ketika inflasi tinggi mendorong Bank Indonesia menaikkan BI-Rate secara berturut-turut, dampak realistis apa yang umumnya terjadi di perbankan ritel?',
                promptEn: 'When BI raises BI-Rate repeatedly to curb inflation, realistic banking impact?',
                optionsId: [
                  'Bunga deposito baru & KPR floating naik bertahap sesuai likuiditas & kontrak bank',
                  'Seluruh KPR masa promo fixed aktif & deposito lama berubah tepat di hari RDG BI',
                  'Kenaikan BI-Rate membuat bank menurunkan suku bunga KPR floating agar tetap laku',
                  'BI-Rate hanya berdampak pada jumlah uang kertas tanpa menyentuh bunga perbankan',
                ],
                optionsEn: [
                  'New deposit & floating mortgage rates tend to climb gradually per policy & contracts',
                  'All active fixed-rate promo mortgages and existing deposits reset the same RDG day',
                  'Higher BI-Rate prompts commercial banks to slash floating mortgage rates immediately',
                  'BI-Rate alters paper note circulation only without touching retail banking yields',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Transmisi suku bunga berjalan bertahap melalui likuiditas pasar dan kebijakan internal masing-masing bank, serta tunduk pada perjanjian kontrak kredit nasabah (apakah sedang masa fixed promo atau floating).',
                  type: 'dynamic_fact',
                  reg: REG_SOURCES.BI_RATE,
                  next: 'Periksa jadwal berakhirnya masa fixed KPR-mu saat BI-Rate sedang berada di tren tinggi.',
                }),
              },
              {
                id: 's6u28s1p2_q2',
                promptId: 'Jika nilai tukar Rupiah melemah cukup lama terhadap Dolar AS, komponen usaha atau rumah tangga mana yang paling cepat merasakan kenaikan harga?',
                promptEn: 'If IDR weakens persistently against USD, which expenses rise fastest?',
                optionsId: [
                  'Bahan baku industri impor (gandum, kedelai, komponen) & perangkat elektronik impor',
                  'Komoditas ekspor berbahan baku lokal yang seluruh penerimaannya bervaluta Dolar AS',
                  'Sewa lahan pertanian lokal yang dibayar tunai memakai hasil produksi setempat',
                  'Tarif iuran jaminan kesehatan nasional yang ditetapkan nominal tetap Rupiah',
                ],
                optionsEn: [
                  'Imported raw inputs (wheat, soybeans, parts) and imported consumer electronics',
                  'Local-input export commodities paid entirely in incoming US Dollar proceeds',
                  'Domestic farmland leases settled in cash from local harvest revenues',
                  'National health insurance dues set at fixed statutory Rupiah tariffs',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Barang dan bahan baku yang dibeli pemasok dengan valuta asing membutuhkan lebih banyak Rupiah saat kurs melemah.',
                  next: 'UMKM berbasis bahan impor perlu menyiapkan penyesuaian harga jual atau stok bahan lebih terukur.',
                }),
              },
            ], { st: 'dynamic_fact', reg: REG_SOURCES.BI_RATE }),
            mkPairLesson('S6.U28.ST1.P3', 'Adaptasi Anggaran Menghadapi Guncangan Makro', 'Macro Shock Adaptations', 'Mencocokkan kondisi makro dengan langkah bertahan.', {
              mode: 'pairs',
              instructionId: 'Cocokkan kondisi ekonomi makro berikut dengan penyesuaian anggaran keluarga dan usaha yang paling tepat.',
              instructionEn: 'Match macroeconomic shifts with prudent household responses.',
              pairs: [
                { id: 'mk1', leftId: 'Fase Resesi & Risiko PHK Meningkat', leftEn: 'Recession & Layoff Risk', rightId: 'Pertebal kas Dana Darurat likuid & tunda pengambilan utang konsumtif baru', rightEn: 'Boost liquid reserves & pause new loans' },
                { id: 'mk2', leftId: 'Inflasi Kebutuhan Pokok Melonjak Tajam', leftEn: 'High Essential Inflation', rightId: 'Evaluasi pos pengeluaran variabel agar arus kas wajib tetap tertutup surplus', rightEn: 'Audit variable leaks to protect essentials' },
                { id: 'mk3', leftId: 'Tren Kenaikan BI-Rate & Suku Bunga Acuan', leftEn: 'Rising BI-Rate Cycle', rightId: 'Hitung ulang simulasi KPR floating & prioritaskan pelunasan utang berbunga variabel mahal', rightEn: 'Stress-test floating rates & pay expensive variable debt' },
              ],
              explanationCard: card({
                why: 'Mengikuti sinyal makro membantu rumah tangga bergerak antisipatif alih-alih bereaksi panik saat tagihan sudah menumpuk.',
                next: 'Latih strategi alokasi lintas fase di simulasi Pohon Aset Siklus Ekonomi.',
              }),
            }),
            mkPohonLesson('S6.U28.ST1.P4', 'Pohon Aset Siklus Ekonomi Lengkap', 'Full Macro Cycle Tree', 'Menyeimbangkan likuiditas & aset melewati Boom → Inflasi Tinggi → Resesi.', {
              mode: 'siklus',
              scenarioTitleId: 'Navigasi Portofolio Lintas Siklus Ekonomi (Boom → Inflasi → Resesi)',
              scenarioIntroId:
                'Kamu mengelola aset keluarga Rp40 juta melewati 3 cuaca ekonomi berbeda. Tunjukkan kemampuan menyesuaikan likuiditas dan risiko secara rasional tanpa jual panik!',
              horizonLabelId: '3 Fase Siklus Makro',
              initialCash: 15_000_000,
              initialInvested: 25_000_000,
              targetGoalAmount: 48_000_000,
              quarters: [
                {
                  quarterLabelId: 'Fase 1: Boom Ekonomi & Pertumbuhan Cepat',
                  eventTitleId: 'Pasar Tenaga Kerja Kuat & Konsumsi Tinggi',
                  eventDescId: 'Bonus kerja masuk Rp5 juta di tengah kondisi ekonomi ramai.',
                  macroWeather: 'BOOM',
                  options: [
                    { id: 'm1_o1', labelId: 'Tambah porsi Dana Darurat secukupnya lalu sebar sisanya ke aset berimbang (defensif + bertumbuh) untuk bekal siklus berikutnya', descId: 'Tidak lupa membangun penyangga saat masa baik.', cashDelta: 2_000_000, investedDelta: 3_000_000, riskExposureScore: 45, inflationProtectionScore: 75, liquidityScore: 80, feedbackId: 'Cerdas! Saat Boom adalah waktu terbaik memperkuat cadangan sebelum cuaca berubah.', isOptimal: true },
                    { id: 'm1_o2', labelId: 'Gunakan seluruh kas darurat + tambah kredit konsumtif baru karena mengira ekonomi bakal Boom selamanya', descId: 'Membesar-besarkan utang di puncak siklus.', cashDelta: -8_000_000, investedDelta: 6_000_000, riskExposureScore: 95, inflationProtectionScore: 60, liquidityScore: 15, feedbackId: 'Berbahaya bila siklus berganti ke kenaikan BI-Rate dan resesi!' },
                  ],
                },
                {
                  quarterLabelId: 'Fase 2: Inflasi Tinggi & Kenaikan BI-Rate',
                  eventTitleId: 'BI-Rate Naik Meredam Inflasi; Bunga Floating Mulai Menanjak',
                  eventDescId: 'Harga barang pokok naik dan cicilan variabel cenderung menanjak.',
                  macroWeather: 'INFLASI',
                  options: [
                    { id: 'm2_o1', labelId: 'Pangkas pos hiburan impulsif, siapkan kas menghadapi bunga kredit lebih tinggi, & hindari obligasi durasi panjang berisiko', descId: 'Menjaga kas siap dan meminimalkan eksposur utang mahal.', cashDelta: 2_500_000, investedDelta: 500_000, riskExposureScore: 35, inflationProtectionScore: 70, liquidityScore: 85, feedbackId: 'Taktis! Menyesuaikan durasi & menjaga kas menjaga keluarga tetap tenang.', isOptimal: true },
                    { id: 'm2_o2', labelId: 'Buka cicilan kendaraan baru berbunga floating 100% di tengah tren kenaikan BI-Rate', descId: 'Menambah kewajiban saat suku bunga tinggi.', cashDelta: -4_000_000, investedDelta: 0, riskExposureScore: 80, inflationProtectionScore: 20, liquidityScore: 25, feedbackId: 'Memberatkan kas tepat di fase biaya hidup mahal.' },
                  ],
                },
                {
                  quarterLabelId: 'Fase 3: Perlambatan Ekonomi / Resesi',
                  eventTitleId: 'Pasar Ekuitas Melemah -18% Sementara & Omzet Lesu',
                  eventDescId: 'Banyak orang panik menjual seluruh aset jangka panjang di harga terendah.',
                  macroWeather: 'KRISIS',
                  options: [
                    { id: 'm3_o1', labelId: 'Gunakan kas Dana Darurat likuid yang sudah disiapkan di Fase 1 untuk bertahan tanpa panic selling aset jangka panjang!', descId: 'Menunggu pemulihan ekonomi secara solven dan tenang.', cashDelta: -2_000_000, investedDelta: 4_000_000, riskExposureScore: 40, inflationProtectionScore: 80, liquidityScore: 75, feedbackId: 'Tangguh! Persiapan di fase Boom terbukti melindungi tujuan jangka panjang saat Resesi.', isOptimal: true },
                    { id: 'm3_o2', labelId: 'Jual rugi semua portofolio jangka panjang di dasar resesi dan pindah 100% ke konsumsi', descId: 'Mengunci kerugian besar dan gagal ikut pemulihan.', cashDelta: 5_000_000, investedDelta: -10_000_000, riskExposureScore: 10, inflationProtectionScore: 10, liquidityScore: 70, feedbackId: 'Kerugian permanen terjadi karena ketiadaan penyangga kas sejak fase Boom.' },
                  ],
                },
              ],
              explanationCard: card({
                why: 'Setiap fase ekonomi menuntut penyeimbangan berbeda: siapkan penyangga saat Boom, kendalikan bunga utang saat BI-Rate naik, dan andalkan likuiditas saat Resesi agar tidak panik jual aset jangka panjang.',
                type: 'dynamic_fact',
                reg: REG_SOURCES.BI_RATE,
                next: 'Lanjutkan ke Unit 29 untuk memahami perpajakan pribadi & PP 20/2026!',
              }),
            }),
          ],
        },
      ],
    },

    // ================= UNIT 29 (P0.4 PP 20/2026 + 4-bucket SPT!) =================
    {
      id: 'S6.U29',
      unitNumber: 29,
      semesterId: 'S6',
      titleId: 'Kewajiban Pajak Pribadi & UMKM PP 20/2026',
      titleEn: 'Personal Income Tax (TER) & MSME Tax (PP 20/2026)',
      regulationMeta: REG_SOURCES.PAJAK_UMKM,
      guidebook: {
        summaryId:
          'NIK KTP berfungsi sebagai NPWP Wajib Pajak Orang Pribadi. Karyawan memakai PPh 21 skema TER (Jan–Nov dipotong praktis berdasar tarif efektif bruto sesuai status PTKP, lalu Des dihitung ulang disetahunkan Pasal 17 + PTKP!). Untuk UMKM, PP 55/2022 jo. PP 20/2026 (berlaku 22 April 2026) mengatur: (1) WP Orang Pribadi & Perseroan Perorangan (≤ Rp4,8M/th) dihapus batas jangka waktu pemakaian 0,5% (dan WPOP ≤ Rp500jt/th bebas PPh Final), tunduk aturan agregasi omzet; (2) Koperasi dalam negeri tetap berhak 0,5% NAMUN dibatasi maks 4 Tahun Pajak; (3) CV/Firma/PT biasa baru & pekerjaan bebas (dokter, konsultan, artis, influencer, content creator) dikeluarkan ke tarif umum.',
        summaryEn: 'PPh 21 TER + Dec reconciliation and exact PP 20/2026 provisions for OP, Perseroan Perorangan, Koperasi (4y cap), CV/PT, & freelance professions.',
        keyRulesId: [
          'JANGAN LUPA: di PP 20/2026 penghapusan batas tahun berlaku untuk WPOP & Perseroan Perorangan, Koperasi tetap dibatasi maks 4 Tahun Pajak!',
          'Bila seseorang menerima penghasilan dari pekerjaan bebas (mis. content creator) DAN usaha dagang terpisah, perlakuan pajak mengikuti jenis sumber masing-masing penghasilan.',
          'Pelaporan SPT Tahunan memisahkan tegas 4 keranjang: Daftar Harta, Daftar Kewajiban/Utang, Penghasilan Bersifat Final, & Penghasilan Bukan Objek Pajak.',
        ],
        keyRulesEn: [
          'PP 20/2026 removes time limit for OP/Single-Person LLC while Cooperatives remain capped at 4 tax years.',
          'Mixed freelance + separate retail income are treated according to their respective source rules.',
          'Keep SPT Final Income strictly separated from Non-Taxable Objects.',
        ],
        disclaimerId:
          'Referensi Regulasi: UU HPP, PP 58/2023 jo. PMK 168/2023 (TER), & PP 55/2022 jo. PP 20/2026 (berlaku 22 April 2026; wajib verifikasi pembaruan DJP).',
        disclaimerEn: 'Regulatory Reference: Indonesian Tax Law & PP 20/2026 MSME amendments.',
      },
      stages: [
        {
          id: 'S6.U29.ST1',
          stageNumber: '29.1',
          titleId: 'Slip Gaji PPh 21 TER, NIK-NPWP & Pajak UMKM',
          titleEn: 'Payslip TER & PP 20/2026 MSME Rules',
          skipExamId: 'SKIP.S6.U29.ST1',
          paths: [
            mkWordleLesson('S6.U29.ST1.P1', 'Kosakata Perpajakan Indonesia', 'Taxation Vocabulary', 'Menguasai istilah PTKP, NPWP, SPT, TARIF.', [
              { word: 'PTKP', clueId: 'Batas Penghasilan Tidak Kena Pajak (mis. TK/0 Rp54jt/th) sebelum tarif progresif berlaku.', clueEn: 'Non-Taxable Income personal threshold.', definitionId: 'Pengurang penghasilan neto setahun wajib pajak orang pribadi sesuai status nikah & tanggungan.', definitionEn: 'Statutory tax-free personal allowance.', exampleId: 'Status PTKP TK/0 mendapat batasan PTKP Rp54.000.000 per tahun.', exampleEn: 'Single zero-dependent TK/0 carries a Rp54M annual threshold.' },
              { word: 'NPWP', clueId: 'Nomor Pokok Wajib Pajak yang bagi orang pribadi telah dipadankan dengan NIK KTP.', clueEn: 'Taxpayer Identification Number matched with NIK.', definitionId: 'Identitas administrasi perpajakan wajib pajak di Direktorat Jenderal Pajak.', definitionEn: 'Taxpayer registration ID.', exampleId: 'Karyawan memastikan NIK-nya telah tervalidasi padan NPWP sebelum lapor SPT.', exampleEn: 'Confirming NIK-NPWP matching prior to annual filing.' },
              { word: 'SPT', clueId: 'Surat Pemberitahuan Tahunan tempat wajib pajak melaporkan penghasilan, harta, & utang.', clueEn: 'Annual tax filing declaration return.', definitionId: 'Laporan tahunan wajib pajak mengenai penghasilan kena/final/bukan objek serta daftar harta & kewajiban per 31 Des.', definitionEn: 'Annual declaration of income, assets & liabilities.', exampleId: 'Nilai saldo reksadana akhir tahun dicantumkan dalam Daftar Harta SPT Tahunan.', exampleEn: 'Reporting Dec 31 mutual fund balances in SPT Assets.' },
              { word: 'TARIF', clueId: 'Persentase pemotongan pajak seperti 0,5% UMKM, 10% kupon SBN, atau lapisan Pasal 17.', clueEn: 'Applicable statutory tax rate.', definitionId: 'Besaran persentase atau angka pajak efektif (mis. TER bulanan PPh 21) yang dikenakan pada objek pajak.', definitionEn: 'Tax rate applied to taxable base.', exampleId: 'Bulan penerimaan THR masuk lapisan tarif efektif bulanan TER yang lebih tinggi sementara.', exampleEn: 'Monthly bonus/THR temporarily lifts that month TER rate.' },
            ]),
            mkDetektifLesson('S6.U29.ST1.P2', 'Audit Slip Gaji PPh 21 TER Maret vs Desember', 'Audit Employee PPh 21 TER Payslip', 'Membaca komponen Bruto, BPJS, PPh 21 TER dengan status PTKP & bulan eksplisit.', [
              {
                id: 'u29_dc1',
                channel: 'SlipGaji',
                senderTitle: 'Slip Gaji Karyawan: Status PTKP: K/0 (Kategori TER A) · Periode Simulasi: Maret (Bulan THR)',
                documentLines: [
                  '• Penghasilan Bruto Bulan Maret: Gaji Rp7jt + THR Rp7jt = Rp14.000.000',
                  '• Potongan Iuran BPJS (JHT 2% + JP 1% + Kes 1% dari gaji pokok) = Rp280.000',
                  '• Potongan PPh 21 (TER Kategori A atas bruto Rp14jt) terasa jauh lebih besar daripada bulan biasa',
                  '• Keterangan Perusahaan: Penyesuaian total tahunan Pasal 17 + PTKP dihitung ulang di bulan DESEMBER',
                ],
                questionId: 'Mengapa potongan pajak pada bulan terima THR terasa melonjak dan bagaimana penyelesaian akhirnya di Desember?',
                optionsId: [
                  { id: 'o1', labelId: 'AMAN / WAJAR: Skema TER Jan–Nov memakai persentase efektif bruto bulan berjalan (lapisan Rp14jt lebih tinggi dari Rp7jt), lalu seluruh kelebihan/kurang dihitung akurat pakai Pasal 17 + PTKP pada masa pajak DESEMBER', verdict: 'AMAN' },
                  { id: 'o2', labelId: 'BAHAYA: HRD salah memotong karena THR seharusnya digandakan dua kali pajak permanen tanpa koreksi Desember', verdict: 'BAHAYA' },
                  { id: 'o3', labelId: 'WASPADA: PPh 21 karyawan dipotong rata 0,5% final UMKM', verdict: 'WASPADA' },
                ],
                correctOptionId: 'o1',
                evidenceLevel: 'fakta_terobservasi',
                explanationCard: card({
                  why: 'PP 58/2023 jo. PMK 168/2023 menyederhanakan hitung Jan–Nov lewat tabel TER bulanan berdasarkan bruto + kategori PTKP (A/B/C), lalu memastikan total pajak setahun 100% sesuai tarif Pasal 17 & PTKP saat rekonsiliasi bulan Desember!',
                  assume: 'Simulasi mencantumkan status PTKP K/0 (Kategori TER A) dan bulan Maret vs Desember secara eksplisit.',
                  type: 'dynamic_fact',
                  reg: REG_SOURCES.PAJAK_UMKM,
                  next: 'Periksa selalu Bukti Potong 1721-A1 tahunan di awal tahun sebagai dasar lapor SPT Pribadi.',
                }),
              },
            ], { st: 'dynamic_fact', reg: REG_SOURCES.PAJAK_UMKM }),
            mkQuizLesson('S6.U29.ST1.P3', 'Hitung & Kriteria Subjek Pajak UMKM PP 20/2026', 'PP 20/2026 Exact MSME Rules & Math', 'Menguji hitungan PPh 0,5% WPOP di atas Rp500jt dengan asumsi eksplisit, batas Koperasi 4 tahun, serta pengecualian CV baru & content creator.', [
              {
                id: 's6u29s1p3_q1',
                promptId:
                  '(Asumsi: Ibu Sari adalah WP Orang Pribadi ber-NIK-NPWP yang memilih skema PP 20/2026, omzet murni dari usaha toko kelontong, bukan pekerjaan bebas, tanpa penggabungan omzet usaha lain). Jika total omzet kumulatif warung setahun Rp650.000.000, berapakah PPh Final UMKM 0,5% terutang?',
                promptEn: 'Assumed single OP retailer (no aggregation): annual revenue Rp650M under PP 20/2026. Final 0.5% tax due?',
                optionsId: ['Rp750.000', 'Rp3.250.000', 'Rp2.500.000', 'Rp0'],
                optionsEn: ['Rp750,000', 'Rp3,250,000', 'Rp2,500,000', 'Rp0'],
                correctIndex: 0,
                explanationCard: card({
                  why: 'WP Orang Pribadi beromzet hingga Rp4,8 miliar/th menikmati porsi omzet bebas PPh Final hingga Rp500 juta/tahun, dan hanya kelebihannya yang dikenai 0,5%.',
                  calc: 'Omzet Kena Pajak = Rp650.000.000 − Rp500.000.000 = Rp150.000.000. PPh Final = 0,5% × Rp150.000.000 = Rp750.000!',
                  assume: 'Mengasumsikan WP Orang Pribadi menggunakan PPh Final 0,5% PP 20/2026, omzet murni dagang eceran bukan pekerjaan bebas, tanpa pemecahan/agregasi usaha keluarga.',
                  type: 'dynamic_fact',
                  reg: REG_SOURCES.PAJAK_UMKM,
                  next: 'Catat omzet bulanan secara akumulatif agar tahu persis kapan melewati ambang Rp500 juta.',
                }),
              },
              {
                id: 's6u29s1p3_q2',
                promptId:
                  'Manakah ringkasan paling AKURAT tentang ketentuan jangka waktu & pengecualian subjek PPh Final 0,5% dalam PP No. 20 Tahun 2026?',
                promptEn: 'Most accurate PP 20/2026 time-limit & subject eligibility breakdown?',
                optionsId: [
                  'OP & Perseroan Perorangan tanpa batas waktu; Koperasi maks 4 th; CV baru & profesi bebas dikecualikan',
                  'Koperasi, CV baru, serta kreator konten seluruhnya mendapat tarif final 0,5% tanpa batas tahun',
                  'Perseroan Perorangan dibatasi 4 tahun pajak, sedangkan CV baru tetap menikmati tarif final 0,5%',
                  'Kreator konten yang punya toko ritel terpisah otomatis terkena pajak final ganda atas seluruh aset',
                ],
                optionsEn: [
                  'OP & Single-Person LLC cap lifted; Cooperatives 4y cap; new CV & independent pros excluded',
                  'Cooperatives, new CVs, and content creators all retain 0.5% indefinitely without limits',
                  'Single-Person LLC stays capped at 4 years while new CVs preserve unlimited 0.5% access',
                  'Content creators also running separate retail shops face automatic double tax on assets',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Jangan samakan semua badan usaha dalam PP 20/2026: Koperasi dalam negeri MASIH berhak memakai 0,5%, tetapi TETAP dibatasi 4 Tahun Pajak, hanya WP Orang Pribadi dan Perseroan Perorangan yang dihapus pembatasan tahunnya! Selain itu, klasifikasi pekerjaan bebas bergantung pada sumber penghasilan masing-masing.',
                  type: 'dynamic_fact',
                  reg: REG_SOURCES.PAJAK_UMKM,
                  next: 'Konsultasikan pembukuan dengan kanal resmi pajak.go.id / Kring Pajak 1500200 bila penghasilan berasal dari gabungan profesi bebas dan usaha ritel.',
                }),
              },
              {
                id: 's6u29s1p3_q3',
                promptId:
                  '[Analitik HOTS] Sepanjang tahun pajak berjalan, Dimas Orang Pribadi memperoleh honor jasa desain grafis (pekerjaan bebas) Rp300 juta dan omzet usaha kedai kopi eceran terpisah Rp700 juta (total Rp1 miliar). Jika syarat administrasi PP 20/2026 terpenuhi, bagian penghasilan mana yang dikenai PPh Final 0,5% atas kelebihan Rp500 juta?',
                promptEn: '[HOTS] Dimas earns Rp300M freelance design services plus Rp700M separate retail coffee shop revenue. Which turnover portion qualifies for PP 20/2026 0.5% over Rp500M?',
                optionsId: [
                  'Omzet kedai di atas Rp500 juta saja kena 0,5%; jasa desain ikut PPh umum',
                  'Seluruh total Rp1 miliar digabung lalu bebas Rp500 juta dan sisanya 0,5%',
                  'Keduanya bebas pajak penuh karena omzet tiap lini berada di bawah Rp1 miliar',
                  'Jasa desain kena 0,5% final sedangkan penjualan kedai kena tarif PPh Badan',
                ],
                optionsEn: [
                  'Only coffee shop revenue above Rp500M pays 0.5%; freelance follows general PPh',
                  'Full Rp1B combines under one Rp500M threshold and taxes remaining turnover at 0.5%',
                  'Both streams become tax-free because each business unit stays below Rp1 billion',
                  'Design services qualify for 0.5% final tax while retail coffee hits corporate rates',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Dalam PP 20/2026, penghasilan dari jasa sehubungan dengan pekerjaan bebas (desain, konsultan, influencer/kreator konten, dokter, dll.) TIDAK memakai skema PPh Final UMKM 0,5%, namun usaha dagang ritel terpisah tetap mengikuti ketentuan PPh Final atas omzetnya.',
                  calc: 'Omzet Usaha Kedai = Rp700jt − Rp500jt bebas pajak = Rp200jt kena 0,5% = Rp1.000.000. Honor jasa desain bebas Rp300jt dihitung melalui skema PPh Orang Pribadi umum (mis. NPPN/pembukuan).',
                  type: 'dynamic_fact',
                  reg: REG_SOURCES.PAJAK_UMKM,
                  next: 'Pisahkan catatan kas antara jasa profesional bebas dan penjualan toko agar pelaporan SPT Tahunan akurat.',
                }),
              },
            ], { st: 'dynamic_fact', reg: REG_SOURCES.PAJAK_UMKM }),
            mkKokiLesson('S6.U29.ST1.P4', 'Sortir 4 Kategori Pelaporan SPT Tahunan Pribadi', '4-Bucket Annual SPT Sort', 'Memisahkan Daftar Harta, Kewajiban, Penghasilan Final, dan Bukan Objek Pajak tanpa digabung!', {
              instructionId: 'Masukkan item laporan akhir tahun per 31 Desember ke 4 keranjang SPT Tahunan yang terpisah tegas (jangan satukan Final vs Bukan Objek!).',
              instructionEn: 'Sort year-end SPT declaration items cleanly across 4 separated tax buckets.',
              buckets: [
                { id: 'HARTA', labelId: 'DAFTAR HARTA (31 DES)', labelEn: 'ASSET LIST (DEC 31)', icon: '🏠' },
                { id: 'UTANG', labelId: 'DAFTAR KEWAJIBAN / UTANG', labelEn: 'LIABILITIES / DEBT', icon: '📄' },
                { id: 'FINAL', labelId: 'PENGHASILAN BERSIFAT FINAL', labelEn: 'FINAL TAX INCOME', icon: '🧾' },
                { id: 'NON_OBJEK', labelId: 'PENGHASILAN BUKAN OBJEK PAJAK', labelEn: 'NON-TAXABLE INCOME', icon: '🌿' },
              ],
              items: [
                { id: 'sp1', contextTagId: 'Posisi 31 Des', labelId: 'Saldo tabungan, emas batangan, & nilai unit reksadana yang masih dipegang per 31 Desember', labelEn: 'Savings, gold & mutual fund unit value on Dec 31', correctBucketId: 'HARTA', explanationCard: card({ why: 'Saldo kepemilikan aset investasi termasuk unit penyertaan reksadana per akhir tahun wajib dicantumkan di Daftar Harta SPT.', type: 'dynamic_fact', reg: REG_SOURCES.PAJAK_UMKM, next: 'Simpan ringkasan portofolio 31 Desember tiap tahun.' }) },
                { id: 'sp2', contextTagId: 'Posisi 31 Des', labelId: 'Sisa pokok cicilan KPR dan sisa pokok kredit kendaraan per 31 Desember', labelEn: 'Remaining KPR & vehicle loan principal', correctBucketId: 'UTANG', explanationCard: card({ why: 'Sisa pokok pinjaman akhir tahun dicatat pada Daftar Kewajiban agar profil kekayaan bersih di SPT akurat.', next: 'Minta surat keterangan sisa pokok tahunan dari bank kreditur.' }) },
                { id: 'sp3', contextTagId: 'Arus hasil setahun', labelId: 'Kupon SBN (PPh 10%), bunga deposito > Rp7,5jt (PPh 20%), & omzet kena PPh Final UMKM 0,5%', labelEn: 'SBN coupons, deposit interest & 0.5% final MSME revenue', correctBucketId: 'FINAL', explanationCard: card({ why: 'Penghasilan yang sudah selesai dikenai PPh Final dilaporkan terpisah di kolom Penghasilan Bersifat Final (tidak dihitung ulang di tarif progresif).', type: 'dynamic_fact', reg: REG_SOURCES.PAJAK_UMKM, next: 'Kumpulkan bukti potong final dari bank dan mitra distribusi SBN.' }) },
                { id: 'sp4', contextTagId: 'Realisasi pencairan', labelId: 'Keuntungan realisasi pencairan (redemption) unit reksadana sesuai Ps 4(3)(i) UU PPh', labelEn: 'Realized mutual fund redemption gains', correctBucketId: 'NON_OBJEK', explanationCard: card({ why: 'Laba pencairan reksadana berstatus BUKAN OBJEK PAJAK, dipisahkan tegas dari Penghasilan Final! Sementara unit yang masih dipegang akhir tahun masuk Daftar Harta.', type: 'dynamic_fact', reg: REG_SOURCES.PAJAK_UMKM, next: 'Jangan mencampur pos Final dan Bukan Objek Pajak saat mengisi formulir SPT.' }) },
              ],
            }, { isBoss: true, st: 'dynamic_fact', reg: REG_SOURCES.PAJAK_UMKM }),
          ],
        },
      ],
    },

    // ================= UNIT 30 =================
    {
      id: 'S6.U30',
      unitNumber: 30,
      semesterId: 'S6',
      titleId: 'Keuangan Usaha Mikro & Sampingan Pemula',
      titleEn: 'Micro & Side-Business Finance (MSME)',
      guidebook: {
        summaryId:
          'Aturan emas UMKM pemula: PISAHKAN rekening kas usaha dari uang pribadi pemilik! Penarikan pribadi pemilik dibedakan sesuai bentuk badan: Gaji Pemilik (pada badan usaha seperti PT/Perseroan Perorangan) vs Prive / Pengambilan Pemilik (pada usaha perseorangan). Pisahkan tegas HPP produksi langsung (bahan baku, kemasan primer produk, upah produksi langsung, & overhead produksi relevan) dari Beban Operasional/Penjualan (sewa lapak, listrik non-produksi, iklan, biaya platform), serta jaga kas dari piutang macet dan overstock.',
        summaryEn: 'Separating Owner Salary vs Prive, COGS (HPP) vs Operating Expenses, receivable limits & working capital.',
        keyRulesId: [
          'Jangan mencampur seluruh biaya usaha menjadi satu: pisahkan HPP produksi (bahan, kemasan primer, upah racik) dari Beban Operasional (iklan, sewa lapak, fee platform).',
          'Penjualan Rp4jt − HPP Rp1,8jt = Laba Kotor Rp2,2jt; dikurangi Beban Operasional Rp1,2jt = Laba Bersih Rp1,0jt.',
          'Gunakan kata Gaji Pemilik untuk badan usaha berbentuk badan hukum & Prive untuk usaha perseorangan.',
        ],
        keyRulesEn: [
          'Separate direct COGS (HPP) from overhead Operating Expenses.',
          'Revenue - HPP = Gross Profit; minus Operating Expenses = Net Profit.',
          'Track receivables strictly to prevent running out of cash despite high sales.',
        ],
        disclaimerId: 'Prinsip akuntansi manajerial dasar usaha mikro/kecil.',
        disclaimerEn: 'Core MSME bookkeeping principles.',
      },
      stages: [
        {
          id: 'S6.U30.ST1',
          stageNumber: '30.1',
          titleId: 'Tata Kelola Kas Usaha, HPP & Arus Piutang',
          titleEn: 'Business Cash Separation, HPP & Receivables',
          skipExamId: 'SKIP.S6.U30.ST1',
          paths: [
            mkKokiLesson('S6.U30.ST1.P1', 'Pisah Kas Usaha vs Uang Pribadi & Prive', 'Separate Business vs Owner Cash', 'Membedakan Gaji Pemilik badan usaha vs Prive usaha perseorangan secara disiplin.', {
              instructionId: 'Pilah pos transaksi kedai/toko online berikut ke Kas Usaha vs Uang Pribadi (Gaji Pemilik badan usaha / Prive perseorangan).',
              instructionEn: 'Sort MSME owner transactions cleanly.',
              buckets: [
                { id: 'USAHA', labelId: 'KAS USAHA (Operasional/Modal)', labelEn: 'BUSINESS CASH', icon: '🏪' },
                { id: 'PRIBADI', labelId: 'UANG PRIBADI (Gaji Pemilik / Prive)', labelEn: 'OWNER PERSONAL (Salary / Prive)', icon: '🏡' },
              ],
              items: [
                { id: 'um1', contextTagId: 'Kedai minuman', labelId: 'Belanja biji kopi, susu, & cup kemasan primer produk jualan', labelEn: 'Coffee beans, milk & product cups', correctBucketId: 'USAHA', explanationCard: card({ why: 'Termasuk belanja bahan baku dan kemasan primer komponen HPP produksi usaha.', next: 'Catat di rekening/dompet usaha.' }) },
                { id: 'um2', contextTagId: 'Pemasaran & karyawan', labelId: 'Biaya iklan toko, fee platform, & gaji kurir paruh waktu', labelEn: 'Ads, platform fee & part-time courier pay', correctBucketId: 'USAHA', explanationCard: card({ why: 'Beban operasional dan tenaga kerja langsung pendukung penjualan usaha.', next: 'Pisahkan pembukuannya dari HPP bahan.' }) },
                { id: 'um3', contextTagId: 'Pemilik usaha perseorangan/badan', labelId: 'Bayar SPP sekolah anak & belanja baju lebaran keluarga pemilik (pakai jatah Prive/Gaji Pemilik)', labelEn: 'Owner child school fee & personal shopping', correctBucketId: 'PRIBADI', explanationCard: card({ why: 'Kebutuhan rumah tangga wajib diambil dari rekening pribadi setelah pemilik menetapkan jatah Gaji Pemilik (bila badan usaha) atau Prive terukur (bila perseorangan), bukan mencabut uang kasir sewaktu-waktu!', next: 'Buat jadwal tetap pencairan Prive/Gaji sebulan sekali dari laba bersih.' }) },
                { id: 'um4', contextTagId: 'Gaya hidup pribadi', labelId: 'Bayar cicilan HP pribadi pemilik & traktir nongkrong akhir pekan', labelEn: 'Owner phone EMI & personal hangout', correctBucketId: 'PRIBADI', explanationCard: card({ why: 'Bila pengeluaran pribadi terus dibayar dari kas toko tanpa batas, modal putar akan menyusut diam-diam sampai usaha bangkrut.', next: 'Gunakan dua rekening terpisah sejak hari pertama berjualan.' }) },
              ],
            }),
            mkQuizLesson('S6.U30.ST1.P2', 'Hitung Omzet, HPP, Laba Kotor & Laba Bersih Secara Terpisah', 'COGS (HPP) vs OpEx Math', 'Memisahkan HPP produksi langsung dari beban operasional/penjualan.', [
              {
                id: 's6u30s1p2_q1',
                promptId:
                  'Kedai menjual 200 gelas @ Rp20.000 (Omzet Rp4.000.000). Biaya langsung produksi / HPP (bahan + cup primer + es + upah racik langsung) = Rp1.800.000, sementara Beban Operasional/Penjualan (sewa lapak, listrik kios, kuota promosi, & fee platform) = Rp1.200.000. Berapa Laba Kotor dan Laba Bersihnya?',
                promptEn: 'Revenue Rp4M, Direct COGS/HPP Rp1.8M, OpEx Rp1.2M. Gross Profit & Net Profit?',
                optionsId: [
                  'Laba Kotor Rp2.200.000 & Laba Bersih Rp1.000.000',
                  'Laba Kotor Rp4.000.000 & Laba Bersih Rp2.200.000',
                  'Laba Kotor Rp1.000.000 & Laba Bersih Rp2.200.000',
                  'Laba Kotor Rp2.800.000 & Laba Bersih Rp1.000.000',
                ],
                optionsEn: [
                  'Gross Profit Rp2.2M & Net Profit Rp1.0M',
                  'Gross Profit Rp4.0M & Net Profit Rp2.2M',
                  'Gross Profit Rp1.0M & Net Profit Rp2.2M',
                  'Gross Profit Rp2.8M & Net Profit Rp1.0M',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Memisahkan HPP langsung produksi (bahan, kemasan melekat, upah produksi langsung) dari Beban Operasional (sewa, iklan, platform) membantu pemilik melihat dua hal berbeda: apakah harga jual tiap gelas sudah menguntungkan vs apakah biaya operasional lapaknya terlalu boros!',
                  calc: 'Omzet Rp4.000.000 − HPP Rp1.800.000 = Laba Kotor Rp2.200.000 (Margin Kotor 55%). Laba Bersih = Rp2.200.000 − Beban Operasional Rp1.200.000 = Rp1.000.000.',
                  next: 'Tahan sebagian laba bersih untuk cadangan darurat usaha dan servis alat sebelum menentukan gaji/prive.',
                }),
              },
              {
                id: 's6u30s1p2_q2',
                promptId:
                  '[Analitik HOTS] Untuk menu Rp20.000 (HPP bahan Rp9.000/gelas & beban tetap lapak rata-rata Rp6.000/gelas saat jual normal 200 gelas), kedai mengikuti promo aplikasi: "Diskon 25% ditanggung toko" (harga promo Rp15.000) + komisi aplikasi Rp3.000/gelas. Berapa hasil bersih setelah HPP & beban lapak per gelas promo?',
                promptEn: '[HOTS] Drink price Rp20k (COGS Rp9k + Rp6k fixed overhead/cup). Promo cuts price 25% to Rp15k (merchant-funded) + Rp3k app fee/cup. Net result per promo cup?',
                optionsId: [
                  'Rugi -Rp3.000 per gelas karena terima bersih Rp12.000 dikurangi beban total Rp15.000',
                  'Untung +Rp3.000 per gelas karena harga jual Rp15.000 masih di atas HPP bahan Rp9.000',
                  'Impas Rp0 karena komisi aplikasi Rp3.000 sudah tertutup oleh selisih harga Rp20.000',
                  'Untung +Rp6.000 per gelas karena kenaikan volume promo langsung menghapus beban lapak',
                ],
                optionsEn: [
                  'Loss -Rp3,000 per cup as Rp12k net payout trails Rp15k combined COGS + fixed cost',
                  'Profit +Rp3,000 per cup since the Rp15k promo price exceeds Rp9k raw COGS alone',
                  'Breaks even Rp0 because the Rp3k fee gets absorbed by the Rp20k retail margin',
                  'Profit +Rp6,000 per cup because higher promo orders erase fixed booth expenses',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Banyak UMKM terjebak ilusi omzet ramai dari promo aplikasi: melihat harga promo masih di atas biaya bahan, padahal komisi platform + subsidi diskon + biaya tetap menggerogoti kas tiap gelas terjual!',
                  calc: 'Terima bersih platform = Rp15.000 − Rp3.000 = Rp12.000. Dikurangi HPP (Rp9.000) & beban operasional (Rp6.000) = -Rp3.000/gelas!',
                  next: 'Hitung selalu unit economics (harga jual − diskon toko − fee aplikasi − HPP − beban overhead) sebelum mengaktifkan kampanye diskon.',
                  type: 'simulation_assumption',
                }),
              },
            ]),
            mkWordleLesson('S6.U30.ST1.P3', 'Kosakata Pembukuan UMKM', 'MSME Bookkeeping Terms', 'Menguasai istilah Omzet, Margin, Laba, Piutang.', [
              { word: 'OMZET', clueId: 'Total nilai penjualan kotor usaha sebelum dikurangi HPP dan biaya operasional.', clueEn: 'Gross total sales before costs.', definitionId: 'Akumulasi penerimaan penjualan barang/jasa selama periode buku berjalan.', definitionEn: 'Total top-line sales revenue.', exampleId: 'Omzet besar Rp4 juta bukan berarti pemilik bebas membelanjakan Rp4 juta untuk pribadi.', exampleEn: 'Top-line Rp4M revenue differs sharply from take-home profit.' },
              { word: 'MARGIN', clueId: 'Persentase keuntungan tersisa dibanding harga jual setelah dikurangi biaya terkait.', clueEn: 'Percentage profit spread relative to price.', definitionId: 'Selisih persentase antara pendapatan dan biaya (Margin Kotor maupun Margin Bersih).', definitionEn: 'Profit ratio over sales revenue.', exampleId: 'Menghitung margin tiap menu minuman membantu menentukan diskon aman tanpa merugi.', exampleEn: 'Calculating per-item margin guards safe discounting.' },
              { word: 'LABA', clueId: 'Keuntungan usaha setelah seluruh biaya HPP dan beban operasional/penjualan terpenuhi.', clueEn: 'Net business profit after all expenses.', definitionId: 'Surplus pendapatan bersih yang tersisa sesudah mengurangkan HPP dan seluruh biaya operasional.', definitionEn: 'Bottom-line profit after COGS & OpEx.', exampleId: 'Menyisihkan sebagian laba bersih untuk mengembangkan stok serta modal putar cadangan.', exampleEn: 'Retaining part of net profit for working capital.' },
              { word: 'PIUTANG', clueId: 'Tagihan penjualan barang yang sudah keluar namun pembayarannya belum diterima tunai (kasbon).', clueEn: 'Uncollected credit sales owed by customers.', definitionId: 'Hak tagih usaha kepada pembeli yang bertransaksi secara tempo/kasbon.', definitionEn: 'Accounts receivable from unpaid customer invoices.', exampleId: 'Mengendalikan batas kasbon agar penjualan laris tidak membuat laci uang tunai kosong.', exampleEn: 'Capping credit sales prevents cashflow starvation.' },
            ]),
            mkPairLesson('S6.U30.ST1.P4', 'Diagnosa 3 Penyakit Keuangan UMKM', '3 Common MSME Diseases', 'Memecahkan piutang macet, salah hitung biaya/penyusutan, & overstock.', {
              mode: 'pairs',
              instructionId: 'Cocokkan gejala kebangkrutan terselubung usaha kecil berikut dengan akar masalah & solusinya.',
              instructionEn: 'Match each MSME symptom with its root cause and cure.',
              pairs: [
                { id: 'ms1', leftId: 'Penjualan laris tapi laci kas tunai kosong karena pelanggan menumpuk kasbon', leftEn: 'High sales, empty cash register from credit tabs', rightId: 'Tercekik Piutang Macet: wajib batasi plafon tempo & terapkan DP tunai di depan', rightEn: 'Receivable crunch: cap credit & require deposits' },
                { id: 'ms2', leftId: 'Produk laris terjual namun modal belanja makin menipis setiap bulan', leftEn: 'Best-selling product yet working capital shrinks', rightId: 'Salah hitung HPP, beban operasional, & penyusutan alat sehingga harga jual terlalu tipis', rightEn: 'Underestimated production/operating/depreciation cost' },
                { id: 'ms3', leftId: 'Modal kerja macet tidak bisa dipakai bayar gaji karena gudang penuh barang lambat laku', leftEn: 'Capital trapped in slow-moving shelf inventory', rightId: 'Overstock: ubah ke stok cepat berputar atau sistem pre-order bahan rentan rusak', rightEn: 'Overstock: tighten turnover or switch to pre-order' },
              ],
              explanationCard: card({
                why: 'Banyak UMKM gulung tikar bukan karena tak laku, melainkan karena salah menetapkan harga di bawah total biaya penuh serta membiarkan kas terjebak di kasbon dan stok mati.',
                next: 'Pantau arus kas masuk-keluar mingguan di buku terpisah.',
              }),
            }),
            mkStoryLesson('S6.U30.ST1.P5', 'Mengelola Kedai Kecil 6 Bulan', '6-Month MSME Cashflow', 'Menjaga modal kerja usaha melewati kasbon dan bulan sepi order.', {
              titleId: 'Menjalankan Kedai Kecil / Online Shop Selama 6 Bulan',
              subtitleId: 'Simulasi Pemisahan Kas, HPP/OpEx & Anti-Piutang Macet',
              durationLabelId: '6 Bulan Virtual',
              initialState: { cash: 3_000_000, emergencyFund: 2_000_000, sinkingFund: 500_000, debt: 0, netWorth: 5_500_000 },
              chapters: [
                {
                  id: 'u30_b1',
                  periodLabelId: 'Bulan 1: Hari Pertama Buka Usaha',
                  narrativeId: 'Modal usaha Rp3 juta tersedia. Kamu juga butuh bayar listrik rumah pribadi Rp350rb.',
                  choices: [
                    { id: 'c1', labelId: 'Buka rekening/dompet terpisah untuk usaha & ambil hanya Prive/Gaji terukur dari laba bersih bulanan (bukan langsung dari kas modal hari ke-1)', feedbackId: 'Disiplin emas UMKM! Modal kerja Rp3 juta terjaga utuh untuk berputar.', deltas: { cash: 800_000, scoreCashflow: 30, scoreGoal: 25 }, isRecommended: true },
                    { id: 'c2', labelId: 'Gabungkan seluruh uang warung & belanja dapur rumah dalam satu dompet saja biar praktis', feedbackId: 'Dalam sebulan kamu tak tahu apakah usaha sebenarnya untung atau modalnya termakan belanja rumah!', deltas: { cash: -700_000, scoreCashflow: -20 } },
                  ],
                },
                {
                  id: 'u30_b2',
                  periodLabelId: 'Bulan 3: Permintaan Pesanan Besar Berbayar Tempo 60 Hari',
                  narrativeId: 'Pelanggan baru meminta suplai senilai Rp2.500.000 tanpa DP dengan janji bayar 2 bulan lagi. Padahal kas belanjamu terbatas.',
                  choices: [
                    { id: 'c1', labelId: 'Minta DP minimal menutup biaya HPP di muka (mis. DP 60% tunai) & pastikan HPP + beban operasional masuk dalam harga jual', feedbackId: 'Arus kas usaha aman tidak macet walau pesanan bertumbuh!', deltas: { cash: 1_200_000, scoreRisk: 30 }, isRecommended: true },
                    { id: 'c2', labelId: 'Terima penuh tanpa DP walau menguras kas belanja bahan lalu meminjam rentenir untuk belanja besok', feedbackId: 'Piutang macet memaksa utang berbunga mencekik!', deltas: { cash: -1_500_000, debt: 1_500_000, scoreRisk: -30 }, illegalDebtFlag: true },
                  ],
                },
                {
                  id: 'u30_b3',
                  periodLabelId: 'Bulan 5–6: Menghadapi Bulan Sepi Order',
                  narrativeId: 'Hujan terus membuat order turun sementara selama 1 bulan.',
                  choices: [
                    { id: 'c1', labelId: 'Gunakan cadangan kas usaha yang ditahan dari laba sebelumnya & alihkan produksi ke pre-order minim stok basi', feedbackId: 'Usaha bertahan lancar hingga bulan ke-6 dengan modal utuh dan arus kas sehat!', deltas: { cash: 1_000_000, netWorth: 2_000_000, scoreGoal: 30 }, isRecommended: true },
                    { id: 'c2', labelId: 'Borong stok bahan mudah basi 3x lipat berutang sambil berharap pembeli tiba-tiba datang', feedbackId: 'Overstock bahan rusak memperparah kerugian bulan sepi.', deltas: { cash: -1_200_000, scoreCashflow: -20 } },
                  ],
                },
              ],
              explanationCard: card({
                why: 'UMKM yang awet mengutamakan arus kas likuid, pemisahan rekening pribadi-usaha, penetapan harga penuh di atas HPP + OpEx + penyusutan, serta pengendalian piutang.',
                next: 'Sampai di unit penutup Akademi CIKO: Unit 31: KPR, Pensiun & Capstone Financial Stress Test!',
                type: 'simulation_assumption',
              }),
            }, { simMonths: 6 }),
          ],
        },
      ],
    },

    // ================= UNIT 31 (KPR Anuitas terverifikasi + Capstone 6 Indikator!) =================
    {
      id: 'S6.U31',
      unitNumber: 31,
      semesterId: 'S6',
      titleId: 'Tujuan Besar Keluarga, KPR, Pensiun & Financial Stress Test',
      titleEn: 'Family Goals, Mortgage (KPR), Retirement & Capstone Stress Test',
      regulationMeta: REG_SOURCES.BPJS_TK,
      guidebook: {
        summaryId:
          'Ukur kekayaan riil dengan Net Worth = Total Aset − Total Utang. Rencanakan Dana Pendidikan sesuai jarak masuk sekolah. Dalam simulasi KPR: siapkan tunai sebelum akad (DP + BPHTB + Notaris/AJB + Provisi/Appraisal + Asuransi + Dana Darurat utuh) dan uji cicilan saat masuk bunga floating (KPR Rp400jt 15 th: Fixed 5% ~Rp3,16jt/bln → Tahun ke-4 sisa pokok ~Rp342jt jika Floating 11% melonjak ke ~Rp4,29jt/bln / +35,5%!). Pada Capstone Stress Test: kelulusan dinilai dari solvabilitas arus kas, kebutuhan pokok, likuiditas, imunitas ilegal, lintasan Net Worth, & kendali tujuan, bukan syarat kaku Net Worth > 0!',
        summaryEn: 'Net Worth, education glide paths, realistic pre-closing KPR cash needs & exact floating jump math, retirement pillars, and 6-indicator Capstone rubric.',
        keyRulesId: [
          'KPR Rp400jt 15th: 5% fixed = ~Rp3.163.175/bln; sisa ~Rp342jt di th ke-4 pada 11% floating = ~Rp4.287.226/bln (naik +35,5%!).',
          'Jangan hanya siapkan DP rumah, siapkan juga biaya BPHTB, Notaris/AJB/balik nama, provisi bank, asuransi jiwa/kebakaran, & jaga Dana Darurat tetap utuh.',
          'Kelulusan Capstone Stress Test mengevaluasi 6 indikator solvabilitas & lintasan pemulihan (tidak menghukum keluarga yang sehat secara kas walau nilai KPR awal membuat Net Worth sementara ketat).',
        ],
        keyRulesEn: [
          'Stress-test monthly salary against floating KPR rate jumps (~Rp3.16M to ~Rp4.29M in the Rp400M example).',
          'Budget closing costs (BPHTB, notary, bank fees, insurance) separately from DP.',
          'Capstone judges 6 solvency/trajectory indicators rather than rigid Net Worth > 0.',
        ],
        disclaimerId:
          'Asumsi Simulasi: Contoh KPR anuitas bulanan dan guncangan 12 bulan bersifat edukatif; biaya riil BPHTB/Notaris & bunga bank mengacu aturan wilayah & akad masing-masing.',
        disclaimerEn: 'Simulation Assumption: Mortgage & stress-test models reflect illustrative educational parameters.',
      },
      stages: [
        {
          id: 'S6.U31.ST1',
          stageNumber: '31.1',
          titleId: 'Net Worth & Dana Pendidikan Anak',
          titleEn: 'Net Worth & Children Education Planning',
          skipExamId: 'SKIP.S6.U31.ST1',
          paths: [
            mkQuizLesson('S6.U31.ST1.P1', 'Menghitung Net Worth: Terlihat Kaya vs Benar-Benar Sehat', 'Net Worth vs Illusion of Wealth', 'Menghitung Total Aset − Total Utang dua keluarga.', [
              {
                id: 's6u31s1p1_q1',
                promptId:
                  'Keluarga A menempati rumah & mobil kredit bernilai pasar Rp900jt tetapi sisa utang KPR + leasing Rp830jt dengan tabungan Rp20jt. Keluarga B mengontrak rumah sederhana, motor lunas Rp15jt, aset tabungan/SBN/reksadana Rp220jt, utang Rp0. Berapakah Net Worth masing-masing?',
                promptEn: 'Family A: Rp900M property/car + Rp20M cash - Rp830M debt. Family B: Rp15M bike + Rp220M savings/SBN - Rp0 debt. Net Worth?',
                optionsId: [
                  'Keluarga A Rp90 juta vs Keluarga B Rp235 juta',
                  'Keluarga A Rp920 juta vs Keluarga B Rp235 juta',
                  'Keluarga A Rp70 juta vs Keluarga B Rp220 juta',
                  'Keluarga A Rp90 juta vs Keluarga B Rp0 juta',
                ],
                optionsEn: [
                  'Family A Rp90M vs Family B Rp235M',
                  'Family A Rp920M vs Family B Rp235M',
                  'Family A Rp70M vs Family B Rp220M',
                  'Family A Rp90M vs Family B Rp0',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Rumus Net Worth = Total Aset − Total Kewajiban Utang. Barang mewah yang masih penuh cicilan sering memberi ilusi kaya padahal porsi kepemilikan bersihnya kecil.',
                  calc: 'A = (900jt + 20jt) − 830jt = Rp90jt. B = (15jt + 220jt) − 0 = Rp235jt!',
                  next: 'Ukur kemajuan keuangan tahunanmu dari tren pertumbuhan Net Worth dan kesehatan arus kas, bukan sekadar barang konsumtif yang terlihat.',
                }),
              },
            ]),
            mkKokiLesson('S6.U31.ST1.P2', 'Sortir Aset vs Liabilitas Rumah Tangga', 'Sort Household Assets vs Liabilities', 'Memilah komponen penambah kekayaan vs kewajiban utang.', {
              instructionId: 'Pilah pos neraca keluarga berikut ke Aset (Menambah Kekayaan) atau Liabilitas (Kewajiban Utang).',
              instructionEn: 'Sort household balance sheet items into Assets vs Liabilities.',
              buckets: [
                { id: 'ASET', labelId: 'ASET (Nilai Kepemilikan / Harta)', labelEn: 'ASSETS', icon: '📈' },
                { id: 'LIAB', labelId: 'LIABILITAS (Kewajiban Utang)', labelEn: 'LIABILITIES', icon: '🧾' },
              ],
              items: [
                { id: 'nw1', contextTagId: 'Kekayaan likuid', labelId: 'Saldo rekening Dana Darurat, SBN Ritel, & Reksadana resmi', labelEn: 'Emergency cash, SBN & Mutual Funds', correctBucketId: 'ASET', explanationCard: card({ why: 'Harta finansial bernilai riil milik keluarga.', next: 'Catat nilainya setiap 6–12 bulan sekali.' }) },
                { id: 'nw2', contextTagId: 'Properti dimiliki', labelId: 'Nilai pasar wajar rumah tinggal milik keluarga (sebelum dikurangi sisa pokok KPR)', labelEn: 'Fair market value of owned home', correctBucketId: 'ASET', explanationCard: card({ why: 'Nilai pasar rumah dicatat di sisi Aset, sedangkan sisa pokok pinjamannya dicatat terpisah di sisi Liabilitas!', next: 'Selisih antara nilai rumah dan sisa pokok KPR itulah ekuitas rumahmu.' }) },
                { id: 'nw3', contextTagId: 'Kewajiban rumah/motor', labelId: 'Sisa pokok cicilan KPR & sisa pokok cicilan kredit kendaraan', labelEn: 'Remaining KPR & vehicle loan principal', correctBucketId: 'LIAB', explanationCard: card({ why: 'Kewajiban pengembalian pokok kepada pihak ketiga yang wajib dilunasi.', next: 'Kurangi liabilitas konsumtif berbiaya tinggi terlebih dahulu.' }) },
                { id: 'nw4', contextTagId: 'Tagihan jangka pendek', labelId: 'Total tagihan PayLater & kartu kredit yang belum dibayar lunas', labelEn: 'Unpaid PayLater & credit card balance', correctBucketId: 'LIAB', explanationCard: card({ why: 'Setiap saldo belum lunas mengurangi kekayaan bersih keluarga.', next: 'Hindari membiarkan tagihan kartu kredit menunggak dari bulan ke bulan.' }) },
              ],
            }),
            mkQuizLesson('S6.U31.ST1.P3', 'Strategi Dana Pendidikan Anak Lintas Jarak Waktu', 'Education Fund Across Horizons', 'Menyesuaikan instrumen untuk masuk SD (2 th) vs kuliah (14 th).', [
              {
                id: 's6u31s1p3_q1',
                promptId: 'Sebuah keluarga menabung dua target anak sekaligus: Uang Pangkal SD (2 tahun lagi) dan Dana Kuliah (14 tahun lagi). Penempatan manakah yang paling sesuai prinsip horizon waktu?',
                promptEn: 'Two goals: Primary school entry in 2 years & University in 14 years. Optimal pairing?',
                optionsId: [
                  'SD 2th di RDPU/SBN pendek; Kuliah 14th di aset bertumbuh lalu geser aman bertahap',
                  'Keduanya taruh 100% di saham agresif termasuk dana masuk SD 2 tahun mendatang',
                  'Keduanya taruh di tabungan kas biasa 0% agar angkanya sama persis dari tahun ke tahun',
                  'Fokus menabung uang pangkal SD dulu lalu andalkan kredit komersial saat waktu kuliah',
                ],
                optionsEn: [
                  '2y School in stable RDPU/SBN; 14y College in growth assets then glide safer later',
                  'Place both goals 100% in aggressive equities including the 2-year elementary target',
                  'Keep both goals in 0% regular cash accounts so face balances never drop below cost',
                  'Save purely for elementary entry while planning consumer debt later for university',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Inflasi biaya pendidikan sering lebih tinggi daripada inflasi umum; horizon 14 tahun membutuhkan daya pertumbuhan lebih kuat daripada tabungan, namun 2 tahun sebelum pembayaran wajib digeser aman (glide path).',
                  next: 'Tentukan nominal target dan tanggal masuk sekolah sejak anak masih kecil.',
                }),
              },
            ]),
          ],
        },
        {
          id: 'S6.U31.ST2',
          stageNumber: '31.2',
          titleId: 'Simulasi Realistis KPR Rumah & Masa Pensiun',
          titleEn: 'Realistic KPR Buying & Retirement Pillars',
          skipExamId: 'SKIP.S6.U31.ST2',
          paths: [
            mkKokiLesson('S6.U31.ST2.P1', 'Biaya Awal KPR Wajib Siap Tunai Sebelum Akad', 'Upfront KPR Cash vs Monthly Payments', 'Menyiapkan biaya pra-akad (BPHTB, Notaris/AJB, Provisi, Asuransi, & Dana Darurat utuh).', {
              instructionId: 'Pilah pos persiapan pembelian rumah KPR ke Wajib Siap Tunai Sebelum Akad vs Cicilan / Kewajiban Pasca-Akad.',
              instructionEn: 'Sort home-buying costs into Upfront Pre-Closing Cash vs Post-Closing Ongoing Costs.',
              buckets: [
                { id: 'PRA', labelId: 'WAJIB SIAP TUNAI SEBELUM AKAD', labelEn: 'READY BEFORE CLOSING', icon: '🔑' },
                { id: 'PASCA', labelId: 'CICILAN / KEWAJIBAN PASCA-AKAD', labelEn: 'POST-CLOSING ONGOING', icon: '📆' },
              ],
              items: [
                { id: 'kp1', contextTagId: 'Syarat bank KPR', labelId: 'Uang Muka (Down Payment / DP) serta cadangan Dana Darurat keluarga tetap utuh', labelEn: 'Down Payment + untouched Emergency Reserve', correctBucketId: 'PRA', explanationCard: card({ why: 'Kesalahan fatal pembeli rumah pemula adalah menguras habis Dana Darurat demi DP rumah lalu kolaps di bulan ke-2 saat ada perbaikan bocor/listrik!', next: 'Pastikan setelah bayar DP & akad, Dana Darurat masih tersisa aman.' }) },
                { id: 'kp2', contextTagId: 'Pajak & legalitas rumah', labelId: 'Pajak Pembeli (BPHTB), biaya Notaris/PPAT, AJB, balik nama, & cek sertifikat', labelEn: 'BPHTB tax, Notary/PPAT, AJB & title check fees', correctBucketId: 'PRA', explanationCard: card({ why: 'Biaya legalitas dan pajak BPHTB bisa mencapai ~6–9% ekstra di luar harga rumah dan wajib tunai saat akad!', next: 'Hitung BPHTB & Notaris dalam anggaran pra-akad sejak awal.' }) },
                { id: 'kp3', contextTagId: 'Biaya kredit bank', labelId: 'Biaya Provisi bank, Appraisal, & Premi Asuransi Jiwa/Kebakaran KPR awal', labelEn: 'Bank provision, appraisal & initial KPR insurance', correctBucketId: 'PRA', explanationCard: card({ why: 'Bank menyaratkan asuransi jiwa kredit dan kebakaran properti dibayar lunas di muka atau masuk paket biaya akad.', next: 'Minta rincian estimasi tertulis seluruh biaya akad dari bank sebelum booking.' }) },
                { id: 'kp4', contextTagId: 'Pasca menempati', labelId: 'Angsuran bulanan KPR & iuran lingkungan / PBB tahunan (Sinking Fund)', labelEn: 'Monthly KPR installments & annual PBB tax', correctBucketId: 'PASCA', explanationCard: card({ why: 'Merupakan komitmen rutin bulanan & tahunan setelah akad selesai berjalan.', next: 'Masukkan PBB tahunan rumah ke dalam iuran Sinking Fund bulanan.' }) },
              ],
            }),
            mkQuizLesson('S6.U31.ST2.P2', 'Simulasi Lonjakan Cicilan KPR Bunga Mengambang', 'KPR Fixed-to-Floating Rate Shock', 'Menghitung eksak lonjakan cicilan anuitas KPR saat masa promo berakhir.', [
              {
                id: 's6u31s2p2_q1',
                promptId:
                  '(Asumsi anuitas bulanan tetap, pokok awal KPR Rp400.000.000, tenor 15 tahun / 180 bulan) Pada 3 tahun pertama promo Fixed 5%, cicilan adalah Rp3.163.175/bulan (~Rp3,16jt). Memasuki Tahun ke-4 dengan sisa pokok ~Rp342jt selama sisa 12 tahun, jika bunga pasar berubah menjadi Floating 11%, ke angka berapakah cicilanmu melonjak?',
                promptEn: 'Rp400M 15y KPR: Fixed 5% (~Rp3.16M/mo). At Yr 4 (~Rp342M left for 12y) at 11% floating, new monthly EMI?',
                optionsId: [
                  'Sekitar Rp4.287.226/bulan',
                  'Sekitar Rp2.850.000/bulan',
                  'Tetap Rp3.163.175/bulan',
                  'Sekitar Rp6.960.000/bulan',
                ],
                optionsEn: [
                  'Around Rp4,287,226/month',
                  'Around Rp2,850,000/month',
                  'Fixed Rp3,163,175/month',
                  'Around Rp6,960,000/month',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Banyak pembeli rumah terjebak kemampuan bayar semu karena hanya menguji gaji mereka terhadap bunga promo tahun pertama (5%), padahal mayoritas tahun cicilan berada di suku bunga pasar mengambang (floating)!',
                  calc: 'Pokok Rp400jt (180 bln @ 5%) = Rp3.163.175/bln. Setelah 36 bulan sisa pokok = Rp342.005.330. Pada 11% (144 bln tersisa), anuitas naik ke Rp4.287.226/bln (+Rp1.124.051/bln atau +35,5%)!',
                  assume: 'Asumsi suku bunga anuitas efektif bulanan standar (angka floating aktual bervariasi mengikuti kebijakan masing-masing bank & BI-Rate).',
                  type: 'simulation_assumption',
                  next: 'Sebelum akad KPR, uji DSR gajimu dengan skenario bunga floating (mis. 10–12%), BUKAN hanya bunga promo awal.',
                }),
              },
            ], { st: 'simulation_assumption' }),
            mkPairLesson('S6.U31.ST2.P3', '3 Pilar Pensiun Mandiri Tanpa Membebani Anak', '3 Retirement Pillars Match', 'Memadukan BPJS TK, DPLK, dan Portofolio Mandiri + Proteksi Tua.', {
              mode: 'pairs',
              instructionId: 'Cocokkan 3 pilar persiapan pensiun di Indonesia agar kebutuhan hari tua mandiri tanpa membebani anak.',
              instructionEn: 'Match the 3 Indonesian retirement pillars to their functions.',
              pairs: [
                { id: 'ret1', leftId: 'BPJS Ketenagakerjaan (JHT & JP)', leftEn: 'BPJS TK (JHT & JP)', rightId: 'Jaminan dasar pekerja formal berupa tabungan hari tua (JHT) & manfaat pensiun berkala (JP)', rightEn: 'Mandatory formal worker retirement baseline' },
                { id: 'ret2', leftId: 'DPLK (Dana Pensiun Lembaga Keuangan)', leftEn: 'Voluntary DPLK Pension Fund', rightId: 'Program pensiun sukarela terdaftar OJK bagi pekerja maupun pekerja lepas sebagai pelengkap hari tua', rightEn: 'Voluntary OJK-supervised individual pension plan' },
                { id: 'ret3', leftId: 'Portofolio Aset Mandiri + Proteksi Kesehatan Usia Lanjut', leftEn: 'Personal Portfolio + Senior Health Cover', rightId: 'Menghasilkan arus kas & menanggung risiko biaya medis usia lanjut tanpa menggantungkan hidup pada anak', rightEn: 'Self-sustaining cashflow & healthcare shield' },
              ],
              explanationCard: card({
                why: 'Mengandalkan JHT saja sering belum cukup menutup seluruh biaya hidup + inflasi kesehatan 20–30 tahun masa pensiun.',
                type: 'dynamic_fact',
                reg: REG_SOURCES.BPJS_TK,
                next: 'Mulai bangun pilar pensiun mandiri bersamaan dengan menjaga proteksi kesehatan tetap aktif.',
              }),
            }, { st: 'dynamic_fact', reg: REG_SOURCES.BPJS_TK }),
            mkWordleLesson('S6.U31.ST2.P4', 'Kosakata Akhir Kemandirian Finansial', 'Capstone Terms', 'Menguasai istilah NETWORTH, PENSIUN, AKAD, BPHTB.', [
              { word: 'NETWORTH', clueId: 'Kekayaan Bersih keluarga: Total Aset dikurangi seluruh Total Utang.', clueEn: 'Total Assets minus Total Liabilities.', definitionId: 'Ukuran kekayaan riil bersih keluarga setelah seluruh kewajiban utang diperhitungkan.', definitionEn: 'True equity position of a household.', exampleId: 'Menghitung Net Worth berkala membantu membedakan gaya hidup kredit dari aset bersih nyata.', exampleEn: 'Tracking Net Worth exposes credit-funded lifestyle illusions.' },
              { word: 'PENSIUN', clueId: 'Masa pasca-kerja saat arus kas hidup bertumpu pada tabungan JHT, DPLK, & aset mandiri.', clueEn: 'Post-working stage funded by reserves & pensions.', definitionId: 'Fase hidup mandiri finansial ketika penghasilan aktif berhenti namun pengeluaran rutin & medis tetap berjalan.', definitionEn: 'Financial phase relying on passive assets & pension reserves.', exampleId: 'Menyiapkan dana pensiun sedini mungkin memutus rantai beban generasi sandwich.', exampleEn: 'Early retirement planning breaks the sandwich-generation cycle.' },
              { word: 'AKAD', clueId: 'Penandatanganan perjanjian resmi kredit/pembiayaan rumah di hadapan notaris & bank.', clueEn: 'Formal mortgage closing & contract signing.', definitionId: 'Tahap pengesahan transaksi jual beli dan fasilitas KPR ketika seluruh biaya pra-akad wajib siap.', definitionEn: 'Formal execution stage of home purchase and financing.', exampleId: 'Pastikan uang BPHTB, Notaris, & provisi sudah siap tunai sebelum tanggal akad KPR.', exampleEn: 'Have closing costs liquid before KPR signing day.' },
              { word: 'BPHTB', clueId: 'Bea Perolehan Hak atas Tanah dan Bangunan (pajak pembeli saat membeli properti).', clueEn: 'Buyer property acquisition tax in Indonesia.', definitionId: 'Pajak daerah yang dibayar pihak pembeli saat peralihan hak kepemilikan tanah/rumah.', definitionEn: 'Mandatory Indonesian buyer transfer tax on real estate.', exampleId: 'Jangan lupa memasukkan BPHTB ke dalam anggaran biaya awal beli rumah di luar DP.', exampleEn: 'Include BPHTB alongside down payment savings.' },
            ]),
          ],
        },
        {
          id: 'S6.U31.ST3',
          stageNumber: '31.3',
          titleId: 'Uji Ketahanan Keuangan Keluarga · Capstone',
          titleEn: 'Family Financial Stress Test Capstone',
          skipExamId: 'SKIP.S6.U31.ST3',
          paths: [
            mkStoryLesson(
              'S6.U31.ST3.P1',
              'Capstone Stress Test Keluarga 12 Bulan',
              'Capstone: 12-Month Family Stress Test',
              'Ujian lintas semester mengevaluasi 6 indikator ketahanan kas keluarga.',
              {
                isCapstone: true,
                isPerformanceProject: true,
                titleId: 'Capstone Unit 31: Simulasi Ketahanan Keuangan Keluarga 12 Bulan',
                subtitleId: 'Evaluasi 6 Indikator Solvabilitas Kas, Likuiditas, Polis, Anti-Ilegal, Lintasan Net Worth & Tujuan',
                durationLabelId: '12 Bulan Simulasi Ganda',
                initialState: { cash: 6_000_000, emergencyFund: 18_000_000, sinkingFund: 3_000_000, debt: 342_000_000, netWorth: 45_000_000 },
                chapters: [
                  {
                    id: 'cap_b1',
                    periodLabelId: 'Bulan 2: Penurunan Omzet Usaha Sampingan -40% & KPR Floating Naik ke ~Rp4,29jt',
                    narrativeId: 'Masa promo fixed 5% berakhir! Cicilan KPR naik dari ~Rp3,16jt menjadi ~Rp4,29jt/bln tepat saat usaha mikro pasangan mengalami penurunan omzet 40%.',
                    assumptionNoteId: 'Mengasumsikan pokok sisa KPR ~Rp342jt pada bunga floating 11% dan kas awal rumah tangga masih memiliki dana cadangan.',
                    choices: [
                      { id: 'c1', labelId: 'Pangkas pos keinginan konsumtif seketika, pastikan rekening usaha mikro tetap terpisah tanpa menarik modal putar, & bayar kebutuhan pokok tepat waktu', feedbackId: 'Disiplin kas cepat mencegah defisit beruntun tanpa merusak usaha mikro maupun KPR!', deltas: { cash: -1_500_000, scoreCashflow: 25, scoreGoal: 25 }, isRecommended: true },
                      { id: 'c2', labelId: 'Taruh seluruh beban pengeluaran makan ke PayLater + tarik modal usaha mikro ke rekening pribadi', feedbackId: 'Mencampur kas usaha menghancurkan warung sekaligus memperparah beban utang.', deltas: { debt: 5_000_000, netWorth: -5_000_000, scoreCashflow: -20 } },
                    ],
                  },
                  {
                    id: 'cap_b2',
                    periodLabelId: 'Bulan 5: Tagihan Pajak Kendaraan, PBB & Masuk Sekolah Anak',
                    narrativeId: 'Tagihan berkala tahunan total Rp3.000.000 jatuh tempo serentak.',
                    choices: [
                      { id: 'c1', labelId: 'Gunakan dana dari kantong Sinking Fund Rp3.000.000 sehingga Dana Darurat tetap terjaga penuh menghadapi guncangan berikutnya', feedbackId: 'Tepat! Sinking Fund menyelamatkan keluarga dari pembongkaran Dana Darurat terlalu dini.', deltas: { sinkingFund: -3_000_000, scoreRisk: 25, scoreGoal: 20 }, isRecommended: true },
                      { id: 'c2', labelId: 'Habiskan seluruh Dana Darurat atau jual emas di bawah spread demi bayar tagihan rutin tahunan', feedbackId: 'Dana Darurat habis sebelum krisis besar di Bulan ke-8 tiba!', deltas: { emergencyFund: -6_000_000, scoreRisk: -20 } },
                    ],
                  },
                  {
                    id: 'cap_b3',
                    periodLabelId: 'Bulan 8: Pencari Nafkah Terkena PHK Sah + Rawat Inap Keluarga',
                    narrativeId: 'Guncangan ganda! Satu pencari nafkah terkena PHK sah sekaligus muncul rawat inap mendadak (polis memakai inner limit kamar Rp1jt/hari & BPJS aktif).',
                    choices: [
                      { id: 'c1', labelId: 'Ajukan hak manfaat JKP BPJS TK sesuai syarat klaim, pilih kamar RS sesuai plafon BPJS/polis agar bebas excess besar, & pakai sebagian Dana Darurat likuid', feedbackId: 'Lapis proteksi bekerja mulus! Klaim aman, biaya hidup tertutup tenang tanpa pinjaman ilegal.', deltas: { emergencyFund: -8_000_000, cash: 4_000_000, scoreRisk: 30, scoreSecurity: 25 }, isRecommended: true },
                      { id: 'c2', labelId: 'Upgrade kamar VIP mahal melebihi inner limit tanpa dana lalu pinjam pinjol ilegal bunga harian', feedbackId: 'Gagal Kritis: keterlibatan pinjol ilegal dan kelebihan biaya kamar menguras seluruh cadangan!', deltas: { debt: 15_000_000, scoreSecurity: -40 }, illegalDebtFlag: true },
                    ],
                  },
                  {
                    id: 'cap_b4',
                    periodLabelId: 'Bulan 11–12: Godaan Pinjol Ilegal, Bot Ponzi & Pemulihan Lintasan Net Worth',
                    narrativeId: 'Muncul tawaran "Robot Profit 1%/hari" plus grup saham ARA untuk tutup cepat sisa dampak krisis, sementara ekonomi mulai pulih di Bulan 11.',
                    choices: [
                      { id: 'c1', labelId: 'Tolak tegas Ponzi & gorengan, jangan panic-sell portofolio jangka panjang, mulai kerja sampingan terukur & kembalikan lintasan kas/Net Worth ke jalur sehat!', feedbackId: 'Luar biasa! Lolos 6 Indikator Stress Test Keluarga dengan arus kas solven, tujuan pendidikan/pensiun terjaga, dan lintasan Net Worth kembali membaik!', deltas: { cash: 4_000_000, emergencyFund: 4_000_000, netWorth: 12_000_000, scoreGoal: 30, scoreSecurity: 25 }, isRecommended: true },
                      { id: 'c2', labelId: 'Jual rugi semua dana pensiun anak untuk masuk robot trading 1%/hari', feedbackId: 'Dana pendidikan dan pensiun lenyap dibawa skema Ponzi!', deltas: { netWorth: -25_000_000, scoreGoal: -30, scoreSecurity: -35 } },
                    ],
                  },
                ],
                explanationCard: card({
                  why: 'Financial Stress Test menguji apakah sistem keuanganmu mampu menyerap guncangan ganda (makro + KPR floating + PHK + medis) dengan tetap menjaga solvabilitas kas, likuiditas, imunitas ilegal, lintasan pemulihan Net Worth, dan tujuan keluarga.',
                  assume: 'Menggunakan 6 indikator penilaian Capstone, bukan syarat kaku Net Worth > 0 saat bulan ke-12.',
                  type: 'simulation_assumption',
                  next: 'Selamat! Kamu siap menaklukkan Gerbang UAS Final Akademi CIKO!',
                }),
              },
              { simMonths: 12 }
            ),
          ],
        },
      ],
    },
  ],
  // P0.1 FIX: S6.UTS sits cleanly between Unit 29 and Unit 30!
  uts: buildUTS('S6', 'UTS Semester 6: Korelasi, BI-Rate Makro & Pajak PP 20/2026', 'Unit 27–29', ['S6.U27', 'S6.U28', 'S6.U29']),
  uas: buildUAS(
    'S6',
    'UAS FINAL AKADEMI CIKO: Ujian Kelulusan Master Kemandirian Finansial',
    'Unit 1–31 (Komprehensif)',
    ['S6.U27', 'S6.U28', 'S6.U29', 'S6.U30', 'S6.U31'],
    'Capstone Ketahanan Keuangan 12 Bulan & Stress Test Akhir',
    12,
    {
      isPerformanceProject: true,
      isCapstone: true,
      titleId: 'UAS Final Bagian 2: Capstone Ketahanan Keuangan 12 Bulan & Stress Test Akhir',
      subtitleId: 'Evaluasi 6 Indikator Kelulusan Ketahanan Keuangan Indonesia',
      durationLabelId: '12 Bulan Virtual Komprehensif',
      initialState: { cash: 7_000_000, emergencyFund: 20_000_000, sinkingFund: 3_500_000, debt: 342_000_000, netWorth: 50_000_000 },
      chapters: [
        {
          id: 's6_uas_1',
          periodLabelId: 'Bulan 1–3: Tata Kelola UMKM, Pajak PP 20/2026 & Alokasi Lintas Korelasi',
          narrativeId: 'Atur gaji kerja + usaha mikro pasangan (omzet Rp650jt WPOP), pisahkan rekening usaha, dan sebar investasi jangka panjang melampaui korelasi 1 sektor.',
          choices: [
            { id: 'c1', labelId: 'Pisah rekening usaha, catat HPP produksi terpisah OpEx, siapkan PPh Final 0,5% atas kelebihan omzet Rp150jt (Rp750rb), & diversifikasi lintas kelas aset', feedbackId: 'Fondasi bisnis, pajak PP 20/2026, dan portofolio terstruktur rapi!', deltas: { cash: 2_500_000, netWorth: 6_000_000, scoreCashflow: 25, scoreGoal: 25 }, isRecommended: true },
            { id: 'c2', labelId: 'Campur uang usaha ke pribadi, abaikan pajak UMKM, & all-in 1 saham gorengan', feedbackId: 'Risiko sanksi pajak, kerancuan modal, dan konsentrasi ekstrem!', deltas: { netWorth: -4_000_000, scoreCashflow: -20 } },
          ],
        },
        {
          id: 's6_uas_2',
          periodLabelId: 'Bulan 4–7: Serangan Phishing WA Tarif Bank + Kenaikan BI-Rate & KPR Floating',
          narrativeId: 'BI-Rate naik mendorong KPR floating naik (~Rp3,16jt → ~Rp4,29jt), sementara muncul link WA ubah tarif palsu dan pesan `Invoice-Kurir.apk`.',
          choices: [
            { id: 'c1', labelId: 'Abaikan/blokir tautan APK & phishing, alokasikan Sinking Fund untuk pajak tahunan, & kendalikan pos variabel guna menyerap kenaikan cicilan KPR floating', feedbackId: 'Keamanan siber aman 100% dan arus kas keluarga tetap solven tanpa menunggak KPR!', deltas: { cash: -1_500_000, sinkingFund: -3_000_000, scoreSecurity: 30, scoreRisk: 25 }, isRecommended: true },
            { id: 'c2', labelId: 'Instal .APK dari chat kurir & ambil pinjol ilegal untuk menutup selisih KPR', feedbackId: 'Gagal Kritis: rekening terkompromi APK dan mengambil pinjaman ilegal!', deltas: { cash: -5_000_000, debt: 10_000_000, scoreSecurity: -40 }, illegalDebtFlag: true },
          ],
        },
        {
          id: 's6_uas_3',
          periodLabelId: 'Bulan 8–12: Rawat Inap Medis + Pemulihan Menuju Kelulusan Akademi',
          narrativeId: 'Muncul kejadian rawat inap mendadak (BPJS + polis murni ber-plafon jelas aktif) serta kewajiban lapor 4 kategori SPT Tahunan menjelang akhir tahun.',
          choices: [
            { id: 'c1', labelId: 'Patuhi plafon kamar & prosedur klaim polis jujur, jaga cadangan darurat pulih, susun SPT 4 keranjang terpisah, & jaga lintasan Net Worth + tujuan pendidikan/pensiun', feedbackId: 'SELAMAT! Kamu lulus Ujian Akhir Akademi CIKO (Semester 1–6) dan meraih Gelar Master Kemandirian Finansial!', deltas: { emergencyFund: -4_000_000, cash: 3_000_000, netWorth: 10_000_000, scoreRisk: 25, scoreGoal: 30 }, isRecommended: true },
            { id: 'c2', labelId: 'Jual seluruh dana pensiun anak di dasar koreksi pasar dan abaikan pelaporan SPT', feedbackId: 'Merusak tujuan jangka panjang keluarga tepat di garis akhir!', deltas: { netWorth: -15_000_000, scoreGoal: -25 } },
          ],
        },
      ],
      explanationCard: card({
        why: 'Kelulusan Master Akademi CIKO diukur bukan dari kekayaan instan, melainkan kedisiplinan menyeluruh mengelola kas, pajak, keamanan digital, proteksi, & investasi rasional di tengah guncangan.',
        assume: 'Capstone menilai 6 indikator ketahanan dan lintasan Net Worth tanpa memaksakan Net Worth > 0 secara kaku.',
        type: 'dynamic_fact',
        reg: REG_SOURCES.PAJAK_UMKM,
        next: 'Terapkan kebiasaan literasi finansial CIKO di kehidupan nyata dan verifikasi regulasi secara berkala ke otoritas resmi!',
      }),
    },
    false
  ),
};
