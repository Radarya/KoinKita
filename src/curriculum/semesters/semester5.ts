import { SemesterSpec } from '../types';
import {
  REG_SOURCES,
  buildUAS,
  buildUTS,
  card,
  mkDetektifLesson,
  mkPairLesson,
  mkPohonLesson,
  mkQuizLesson,
  mkWordleLesson,
} from '../helpers';

export const SEMESTER_5: SemesterSpec = {
  id: 'S5',
  semesterNumber: 5,
  titleId: 'Semester 5: Instrumen Investasi Legal, Biaya & Keuangan Syariah',
  titleEn: 'Semester 5: Legal Investment Instruments, Fees & Islamic Finance',
  subtitleId: 'Penjaminan LPS 3T + cashback, Return Neto bebas double-counting, SBN, Reksadana, Saham BEI, & POJK 8/2025 Syariah.',
  units: [
    // ================= UNIT 21 =================
    {
      id: 'S5.U21',
      unitNumber: 21,
      semesterId: 'S5',
      titleId: 'Segitiga Risiko, Penjaminan 3T LPS & Biaya Investasi',
      titleEn: 'Risk Triangle, LPS 3T Guarantee & Investment Costs',
      regulationMeta: REG_SOURCES.LPS_3T,
      guidebook: {
        summaryId:
          'Tidak ada instrumen memadukan untung super tinggi, aman tanpa fluktuasi, dan cair instan (Segitiga Return–Risk–Likuiditas). Simpanan bank dijamin LPS maks Rp2 miliar/nasabah/bank dengan syarat 3T, pemberian cashback/hadiah langsung bernilai uang diperhitungkan ke dalam bunga efektif, dan gugur bila totalnya melampaui Tingkat Bunga Penjaminan (TBP) LPS (perbankan syariah memakai ketentuan bagi hasil LPS tersendiri). Dalam biaya investasi, pisahkan Expense Ratio tahunan dari Biaya Transaksi/Switching, dan hitung simulasi di atas return bruto sebelum biaya agar tidak double-counting NAB.',
        summaryEn: 'Risk-Return-Liquidity tradeoff, LPS 3T + cashback effective interest calculation, and Expense Ratio vs Transaction Fee separation.',
        keyRulesId: [
          '3T LPS: Tercatat di pembukuan bank, Tingkat bunga (+ cashback bernilai uang) ≤ TBP LPS, Tidak merugikan/fraud bank.',
          'Gunakan imbal hasil BRUTO sebelum biaya saat membandingkan Expense Ratio 0,5% vs 2,5% (Rp100jt 10th: Rp206,10jt vs Rp170,81jt, selisih Rp35,29jt!).',
          'Pisahkan Expense Ratio (biaya pengelolaan tahunan di dalam portofolio) dari Biaya Transaksi (subscription/redemption/switching fee).',
        ],
        keyRulesEn: [
          'Cash incentives count into effective yield against LPS TBP limit.',
          'Compare expense ratios strictly from gross returns to avoid double-counting net NAV returns.',
          'Separate recurring expense ratio from one-off transaction/switching fees.',
        ],
        disclaimerId:
          'Edukasi Netral: Membahas mekanisme risiko & biaya secara objektif, bukan rekomendasi membeli atau menjual produk tertentu.',
        disclaimerEn: 'Non-Investment Advice: Objective risk & cost comparison only.',
      },
      stages: [
        {
          id: 'S5.U21.ST1',
          stageNumber: '21.1',
          titleId: 'Segitiga Investasi & Syarat 3T LPS',
          titleEn: 'Risk Triangle & LPS 3T Rules',
          skipExamId: 'SKIP.S5.U21.ST1',
          paths: [
            mkQuizLesson('S5.U21.ST1.P1', 'Mengenal 4 Risiko Nyata Instrumen Keuangan', '4 Real Investment Risks', 'Membedakan Risiko Pasar, Likuiditas, Inflasi, dan Suku Bunga.', [
              {
                id: 's5u21s1p1_q1',
                promptId: 'Jika seseorang memegang obligasi berbunga tetap jangka panjang lalu tiba-tiba BI-Rate naik tajam sehingga harga obligasi lamanya di pasar sekunder turun, risiko apakah yang bekerja?',
                promptEn: 'Long-term fixed bond market price falls when policy rates jump. Which risk is this?',
                optionsId: [
                  'Risiko Suku Bunga (Interest Rate Risk)',
                  'Risiko Gagal Bayar (Credit Default Risk)',
                  'Risiko Likuiditas Pasar (Liquidity Risk)',
                  'Risiko Nilai Tukar Valuta (Currency Risk)',
                ],
                optionsEn: [
                  'Interest Rate Risk',
                  'Credit Default Risk',
                  'Market Liquidity Risk',
                  'Foreign Currency Exchange Risk',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Harga obligasi bergerak berlawanan dengan arah suku bunga acuan: bila BI-Rate naik, kupon lama terasa kurang menarik sehingga harganya turun bila dijual sebelum jatuh tempo.',
                  next: 'Sesuaikan jatuh tempo instrumen dengan jadwal kebutuhan kas agar tak terpaksa menjual saat harga tertekan.',
                }),
              },
              {
                id: 's5u21s1p1_q2',
                promptId: 'Memiliki aset tanah bernilai Rp1 miliar tetapi sulit terjual dalam 2 minggu kecuali banting harga 35% merupakan contoh nyata dari...',
                promptEn: 'Holding Rp1B land that takes months to sell unless heavily discounted illustrates...',
                optionsId: [
                  'Risiko Likuiditas Aset',
                  'Risiko Suku Bunga Acuan',
                  'Risiko Inflasi Daya Beli',
                  'Risiko Konsentrasi Sektor',
                ],
                optionsEn: [
                  'Asset Liquidity Risk',
                  'Benchmark Interest Rate Risk',
                  'Purchasing Power Inflation Risk',
                  'Sector Concentration Risk',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Risiko Likuiditas terjadi ketika aset sulit segera diubah menjadi uang tunai pada harga pasar wajarnya.',
                  next: 'Jangan pernah mengandalkan aset ber-risiko likuiditas tinggi untuk fungsi Dana Darurat.',
                }),
              },
            ]),
            mkQuizLesson('S5.U21.ST1.P2', 'Syarat 3T LPS & Pengaruh Cashback ke TBP', 'LPS 3T & Cashback Impact', 'Menguasai batas Rp2 miliar, 3T LPS, pengaruh cashback bernilai uang & aturan bank syariah.', [
              {
                id: 's5u21s1p2_q1',
                promptId: 'Berapa batas maksimal simpanan nasabah di bank peserta yang dijamin oleh LPS selama memenuhi syarat 3T?',
                promptEn: 'Maximum LPS deposit insurance limit per customer per bank if 3T met?',
                optionsId: [
                  'Rp2 miliar per nasabah per bank',
                  'Rp1 miliar per nomor rekening',
                  'Rp500 juta per kartu identitas',
                  'Tidak terbatas selama terdaftar',
                ],
                optionsEn: [
                  'Rp2 billion per customer per bank',
                  'Rp1 billion per account number',
                  'Rp500 million per identity card',
                  'Unlimited while bank operates',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'LPS menjamin saldo simpanan (tabungan, giro, deposito) di bank konvensional maupun syariah peserta hingga maksimal Rp2 miliar per nasabah per bank bila 3T terpenuhi.',
                  type: 'dynamic_fact',
                  reg: REG_SOURCES.LPS_3T,
                  next: 'Jika dana melebihi Rp2 miliar atau melebihi TBP, periksa aturan penjaminan dengan teliti.',
                }),
              },
              {
                id: 's5u21s1p2_q2',
                promptId:
                  'Bank mempromosikan deposito dengan bunga kontrak tepat di batas TBP LPS, namun agen juga memberi "Cashback Langsung 3% tunai" ke nasabah. Bagaimana status 3T LPS atas pemberian insentif uang tersebut?',
                promptEn: 'Deposit yields exact LPS ceiling, plus direct 3% cash incentive. Impact on LPS 3T?',
                optionsId: [
                  'Cashback bernilai uang dihitung ke imbal hasil; bila lewati TBP, penjaminan gugur',
                  'Hadiah uang promosi agen tidak pernah dihitung ke tingkat bunga acuan oleh LPS',
                  'Setiap promo cashback bank otomatis menggugurkan LPS walau masih di bawah TBP',
                  'Nasabah tetap dijamin penuh asal menandatangani formulir surat persetujuan bank',
                ],
                optionsEn: [
                  'Cash incentives count toward effective interest; breaching TBP ceiling voids coverage',
                  'Promotional cash incentives from agents never factor into LPS rate limits',
                  'Any cashback automatically cancels LPS protection regardless of TBP cap',
                  'Coverage stays intact as long as customers sign the deposit waiver letter',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Aturan 3T LPS (Tercatat, Tidak melebihi TBP, Tidak merugikan bank) menghitung imbalan tambahan langsung seperti cashback/hadiah uang sebagai bagian suku bunga efektif nasabah. Bukan setiap cashback langsung menggugurkan tanpa cek TBP, gugurnya terjadi apabila akumulasinya melewati TBP LPS.',
                  type: 'dynamic_fact',
                  reg: REG_SOURCES.LPS_3T,
                  next: 'Cek selalu Tingkat Bunga Penjaminan (TBP) LPS terkini di lps.go.id.',
                }),
              },
            ], { st: 'dynamic_fact', reg: REG_SOURCES.LPS_3T }),
            mkDetektifLesson('S5.U21.ST1.P3', 'Audit Iklan Deposito "15% + Cashback Dijamin LPS"', 'Audit High-Yield LPS Deposit Ad', 'Mendeteksi penawaran deposito melampaui TBP LPS 3T.', [
              {
                id: 'u21_dc1',
                channel: 'Tawaran',
                senderTitle: 'Brosur Promo: "DEPOSITO BUNGA 15%/TH + CASHBACK 3%: DIJAMIN AMAN 100% LPS!"',
                documentLines: [
                  '• Menjanjikan bunga tetap 15%/tahun + cashback tunai langsung 3%',
                  '• Mengklaim "Pasti Dijamin 100% Oleh LPS!"',
                  '• TBP LPS acuan jauh di bawah 15%',
                ],
                questionId: 'Apa kejanggalan paling krusial pada brosur ini?',
                optionsId: [
                  { id: 'o1', labelId: 'BAHAYA (RED FLAG): Bunga 15% + cashback melampaui TBP LPS sehingga menggugurkan syarat T ke-2 penjaminan LPS!', verdict: 'BAHAYA' },
                  { id: 'o2', labelId: 'AMAN: Semua deposito bank pasti dijamin LPS berapapun bunganya', verdict: 'AMAN' },
                  { id: 'o3', labelId: 'AMAN: Karena cashback 3% membuat bunganya jadi rendah', verdict: 'AMAN' },
                ],
                correctOptionId: 'o1',
                evidenceLevel: 'red_flag',
                explanationCard: card({
                  why: 'Klaim "pasti dijamin LPS" pada bunga yang menembus TBP menyesatkan publik, simpanan yang melanggar batas TBP tidak dijamin LPS jika bank dicabut izin usahanya.',
                  type: 'dynamic_fact',
                  reg: REG_SOURCES.LPS_3T,
                  next: 'Selalu bandingkan penawaran bunga deposito/BPR dengan TBP resmi di situs lps.go.id.',
                }),
              },
            ], { st: 'dynamic_fact', reg: REG_SOURCES.LPS_3T }),
            mkWordleLesson('S5.U21.ST1.P4', 'Kosakata Penjaminan & Biaya Investasi', 'LPS & Cost Vocabulary', 'Menguasai kata LPS, Likuid, Neto, Biaya.', [
              { word: 'LPS', clueId: 'Lembaga Penjamin Simpanan yang menjamin dana nasabah bank hingga Rp2 miliar bila memenuhi 3T.', clueEn: 'Deposit Insurance Corporation guaranteeing up to Rp2B under 3T.', definitionId: 'Otoritas penjamin simpanan perbankan di Indonesia sesuai UU LPS & UU P2SK.', definitionEn: 'Indonesian bank deposit insurance body.', exampleId: 'Menempatkan deposito sesuai TBP agar tetap dalam perlindungan LPS.', exampleEn: 'Keeping deposit rates within LPS TBP limits.' },
              { word: 'LIKUID', clueId: 'Mudah dicairkan ke kas dengan cepat tanpa mengorbankan nilai pasar wajar.', clueEn: 'Rapidly convertible to cash fairly.', definitionId: 'Karakteristik instrumen yang cepat dijual atau dicairkan kembali menjadi kas.', definitionEn: 'Ability to access cash quickly without steep discount.', exampleId: 'Menjaga porsi kas likuid terpisah dari aset investasi berjangka panjang.', exampleEn: 'Separating liquid reserves from locked assets.' },
              { word: 'NETO', clueId: 'Imbal hasil bersih akhir setelah dikurangi biaya pengelolaan, biaya transaksi, & pajak.', clueEn: 'True take-home net investment return.', definitionId: 'Hasil riil yang benar-benar diterima investor pasca-pemotongan beban dan pajak final.', definitionEn: 'Net return after fees and taxes.', exampleId: 'Produk dengan return bruto 5,5% pajak 10% (neto 4,95%) mengalahkan 6% pajak 20% + admin 1% (neto 3,8%).', exampleEn: 'Comparing true net yields after tax and fee drag.' },
              { word: 'BIAYA', clueId: 'Beban Expense Ratio tahunan dan fee transaksi yang menggerus hasil investasi jangka panjang.', clueEn: 'Annual expense ratios & transaction fees.', definitionId: 'Pengeluaran pengelolaan produk, komisi beli/jual, & administrasi yang memotong imbal hasil bruto.', definitionEn: 'Management and transaction charges reducing gross yields.', exampleId: 'Selisih expense ratio 2%/th atas Rp100jt selama 10 tahun memotong nilai akhir lebih dari Rp35jt.', exampleEn: '2% higher expense ratio costs over Rp35M across 10 years.' },
            ]),
          ],
        },
        {
          id: 'S5.U21.ST2',
          stageNumber: '21.2',
          titleId: 'Biaya Investasi & Return Bruto vs Neto',
          titleEn: 'Expense Ratio & Bruto vs Net Return',
          skipExamId: 'SKIP.S5.U21.ST2',
          paths: [
            mkQuizLesson('S5.U21.ST2.P1', 'Simulasi Dampak Biaya Pengelolaan 10 Tahun', '10-Year Expense Ratio Impact', 'Menghitung selisih 0,5% vs 2,5% atas kinerja bruto (tanpa double-counting NAB & terpisah dari biaya transaksi).', [
              {
                id: 's5u21s2p1_q1',
                promptId:
                  '(Asumsi simulasi: kinerja portofolio BRUTO sebelum biaya sama 8%/th selama 10 tahun tanpa pajak/biaya switching, modal Rp100 juta, menghindari double-counting data historis NAB yang sudah net). Produk A punya Expense Ratio 0,5%/th (neto 7,5%) vs Produk B 2,5%/th (neto 5,5%). Berapa nilai akhir masing-masing setelah 10 tahun?',
                promptEn: 'Rp100M, 8% gross return before fees for 10y. Expense ratio 0.5% vs 2.5% ending value?',
                optionsId: [
                  'Produk A ~Rp206,10 juta vs Produk B ~Rp170,81 juta',
                  'Produk A ~Rp215,89 juta vs Produk B ~Rp200,00 juta',
                  'Produk A ~Rp175,00 juta vs Produk B ~Rp173,00 juta',
                  'Produk A ~Rp185,00 juta vs Produk B ~Rp178,00 juta',
                ],
                optionsEn: [
                  'Product A ~Rp206.10M vs Product B ~Rp170.81M',
                  'Product A ~Rp215.89M vs Product B ~Rp200.00M',
                  'Product A ~Rp175.00M vs Product B ~Rp173.00M',
                  'Product A ~Rp185.00M vs Product B ~Rp178.00M',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Expense Ratio dipotong terus-menerus di dalam portofolio atas aset yang ikut bertumbuh majemuk, terpisah dari Biaya Transaksi (subscription/redemption/switching fee saat eksekusi).',
                  calc: 'A = 100jt × (1,075)^10 = Rp206.103.156. B = 100jt × (1,055)^10 = Rp170.814.446. Selisih terpotong = Rp35.288.710 (~Rp35,29jt)!',
                  assume: 'Menggunakan basis kinerja BRUTO 8%/th sebelum biaya agar bebas double-counting apabila dibandingkan terhadap angka kinerja historis NAB (yang sudah net of expense ratio).',
                  type: 'simulation_assumption',
                  next: 'Periksa prospektus / Fund Fact Sheet untuk membandingkan Expense Ratio serta biaya beli/jual sebelum memilih produk.',
                }),
              },
            ], { st: 'simulation_assumption' }),
            mkQuizLesson('S5.U21.ST2.P2', 'Bandingkan Return Neto Akhir Pasca Biaya & Pajak', 'Compare Final Net Returns', 'Memilih produk berdasarkan Return Neto setelah biaya & pajak final.', [
              {
                id: 's5u21s2p2_q1',
                promptId:
                  '(Asumsi: pajak final dihitung dari imbal hasil kotor sebelum admin) Produk X menawarkan return kotor 6%/th tetapi kena pajak final 20% dan biaya pengelolaan/admin tahunan 1%. Produk Y return kotor 5,5%/th, pajak final 10%, tanpa biaya admin tahunan. Mana yang memberi Return Neto lebih tinggi?',
                promptEn: 'Product X: 6% gross, 20% tax, 1% annual admin vs Product Y: 5.5% gross, 10% tax, 0% admin. Higher net return?',
                optionsId: [
                  'Produk Y',
                  'Produk X',
                  'Imbal hasil bersih keduanya sama',
                  'Tidak dapat dihitung tanpa modal awal',
                ],
                optionsEn: [
                  'Product Y',
                  'Product X',
                  'Both provide identical net return',
                  'Cannot be determined without principal amount',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Angka brosur kotor bisa menipu ketika pajak final dan biaya pengelolaan berbeda jauh.',
                  calc: 'X Neto = 6% × (1 − 0,20) − 1% = 4,8% − 1% = 3,80%. Y Neto = 5,5% × (1 − 0,10) = 4,95%!',
                  assume: 'Simulasi membandingkan dua instrumen setara profil likuiditas dengan asumsi pajak atas imbal hasil bruto.',
                  next: 'Selalu hitung angka bersih setelah pajak dan seluruh biaya sebelum membandingkan imbal hasil dua produk.',
                  type: 'simulation_assumption',
                }),
              },
            ], { st: 'simulation_assumption' }),
          ],
        },
      ],
    },

    // ================= UNIT 22 =================
    {
      id: 'S5.U22',
      unitNumber: 22,
      semesterId: 'S5',
      titleId: 'Simpanan Berjangka Deposito & Investasi Emas',
      titleEn: 'Time Deposits (Deposito) & Gold',
      regulationMeta: REG_SOURCES.DEPOSITO_EMAS,
      guidebook: {
        summaryId:
          'Deposito memiliki tenor terkunci (1–12 bln) dan penalti pencairan awal; bunganya dikenai PPh Final 20% (PP 131/2000), dikecualikan bila total saldo deposito + tabungan ≤ Rp7,5 juta dan bukan dipecah untuk menghindar pajak (memecah bilyet deposito murni untuk mengelola risiko penalti likuiditas, BUKAN mengakali pajak!). Emas tidak memberi bunga/dividen, punya selisih beli vs buyback (spread 8,57% vs kenaikan buyback +9,375% untuk impas), dan bukan pelindung inflasi jangka pendek yang pasti naik tiap tahun.',
        summaryEn: 'Time Deposit PP 131/2000 Rp7.5M exemption + ethical bilyet split, Gold spread (8.57%) vs breakeven (+9.375%), and short-term gold caveat.',
        keyRulesId: [
          'PP 131/2000: PPh Final 20% berlaku di atas total saldo tabungan + deposito Rp7,5 juta; dilarang memecah rekening untuk menghindari pajak.',
          'Spread emas (beli Rp1,4jt vs buyback Rp1,28jt): spread dari harga beli = 8,57%, sedangkan kenaikan buyback untuk balik modal = +9,375%!',
          'Emas tidak menghasilkan arus kas kupon/dividen dan harga jangka pendek bisa turun/stagnan.',
        ],
        keyRulesEn: [
          'PP 131/2000 exempts aggregate balances <= Rp7.5M; splitting accounts to evade tax is prohibited.',
          'Gold spread vs buyback breakeven % differ mechanically.',
          'Gold pays no regular yield and is not guaranteed to rise short-term.',
        ],
        disclaimerId: 'Referensi Regulasi: PP No. 131/2000 jo. PP 123/2015 & aturan perdagangan emas berizin.',
        disclaimerEn: 'Regulatory Reference: Indonesian deposit tax rules & licensed gold trading.',
      },
      stages: [
        {
          id: 'S5.U22.ST1',
          stageNumber: '22.1',
          titleId: 'Deposito & Emas Secara Objektif',
          titleEn: 'Objective Deposito & Gold Analysis',
          skipExamId: 'SKIP.S5.U22.ST1',
          paths: [
            mkQuizLesson('S5.U22.ST1.P1', 'Bunga Bersih Deposito & Aturan PPh Final PP 131/2000', 'Net Deposit Tax & Threshold Ethics', 'Menghitung bunga neto deposito & memahami batas pengecualian serta fungsi etis pecah bilyet.', [
              {
                id: 's5u22s1p1_q1',
                promptId:
                  'Menempatkan deposito Rp20.000.000 (total simpanan > ambang Rp7,5jt per PP 131/2000) dengan bunga kotor 5%/tahun (Rp1.000.000/th). Berapa bunga bersih per tahun setelah PPh Final 20%, dan apa tujuan sah memecah menjadi beberapa bilyet tenor 1–3 bulan?',
                promptEn: 'Rp20M deposit (>Rp7.5M threshold) at 5% gross. Net interest after 20% final tax, and valid reason for multi-bilyet ladder?',
                optionsId: [
                  'Rp800.000/tahun; pecah bilyet menjaga likuiditas penalti, bukan akali pajak',
                  'Rp1.000.000/tahun; pecah ke bilyet Rp7 juta sah membebaskan pajak penuh',
                  'Rp900.000/tahun; pecah bilyet wajib dilakukan guna penjaminan LPS',
                  'Rp800.000/tahun; tiap bilyet di bawah Rp7,5 juta otomatis kena tarif 0%',
                ],
                optionsEn: [
                  'Rp800,000/yr; bilyet laddering avoids break penalty, not tax dodging',
                  'Rp1,000,000/yr; splitting under Rp7.5M exempts interest lawfully',
                  'Rp900,000/yr; splitting deposits is mandatory for LPS coverage',
                  'Rp800,000/yr; tickets under Rp7.5M automatically drop to 0% tax',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'PP 131/2000 memang mengecualikan PPh Final 20% bila total saldo deposito + tabungan ≤ Rp7,5 juta, tetapi menegaskan pengecualian gugur bila sengaja dipecah-pecah demi menghindari pajak.',
                  calc: 'Bunga kotor = Rp1.000.000; Pajak 20% = Rp200.000; Bunga bersih = Rp800.000 (4,0% neto).',
                  type: 'dynamic_fact',
                  reg: REG_SOURCES.DEPOSITO_EMAS,
                  next: 'Gunakan strategi tangga tenor bilyet (laddering) murni untuk fleksibilitas pencairan tanpa penalti penuh.',
                }),
              },
            ], { st: 'dynamic_fact', reg: REG_SOURCES.DEPOSITO_EMAS }),
            mkQuizLesson('S5.U22.ST1.P2', 'Hitung Selisih Harga Beli vs Buyback Emas', 'Gold Spread vs Breakeven Return', 'Membedakan rumus spread dari harga beli vs kenaikan harga buyback untuk balik modal.', [
              {
                id: 's5u22s1p2_q1',
                promptId:
                  'Harga beli emas hari ini Rp1.400.000/gram, sedangkan harga jual kembali (buyback) hari yang sama Rp1.280.000/gram (selisih Rp120.000). Manakah pernyataan matematis dan keputusan yang paling akurat jika uang dibutuhkan 2 bulan lagi untuk nikah?',
                promptEn: 'Buy Rp1.4M/g vs Buyback Rp1.28M/g. Exact spread, breakeven increase needed & 2-month risk?',
                optionsId: [
                  'Spread beli 8,57% & butuh kenaikan +9,375% untuk impas; berisiko untuk 2 bulan',
                  'Spread & target kenaikan impas sama-sama 8,57%; layak untuk target jangka 2 bulan',
                  'Selisih Rp120rb setara biaya admin ~5%; lebih unggul dari deposito 2 bulan',
                  'Harga buyback emas pasti naik melampaui inflasi setiap kuartal oleh aturan pasar',
                ],
                optionsEn: [
                  'Buy spread 8.57%, breakeven rise +9.375%; unsuitable for a 2-month horizon',
                  'Spread & breakeven both equal 8.57%; safe enough whenever market trend climbs',
                  'The Rp120k gap equals a ~5% flat fee; outperforms 2-month term bank deposits',
                  'Gold buyback prices reliably outpace inflation every single 2-month window',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Basis pembagi menentukan persentase! Spread dihitung atas harga beli (120rb ÷ 1,4jt = 8,57%), sedangkan kenaikan yang harus terjadi dari harga buyback (120rb ÷ 1,28jt) adalah +9,375%!',
                  calc: 'Spread = 120.000 ÷ 1.400.000 = 8,57%. Kenaikan breakeven = (1.400.000 ÷ 1.280.000) − 1 = +9,375%.',
                  next: 'Gunakan emas hanya untuk horizon jangka menengah–panjang dan hindari untuk dana menikah/sekolah 2 bulan lagi.',
                }),
              },
            ]),
            mkWordleLesson('S5.U22.ST1.P3', 'Kosakata Deposito & Emas', 'Deposito & Gold Terms', 'Menguasai kata Deposito, Tenor, Spread, Buyback.', [
              { word: 'DEPOSITO', clueId: 'Simpanan bank berjangka waktu terkunci yang terkena penalti bila dicairkan sebelum jatuh tempo.', clueEn: 'Fixed-term bank deposit with early break penalty.', definitionId: 'Produk simpanan bank berjangka 1–12 bulan dengan bunga tetap sesuai syarat 3T LPS.', definitionEn: 'Locked-maturity term deposit covered by LPS within limits.', exampleId: 'Menaruh dana DP proyek 6 bulan lagi pada deposito tenor 6 bulan.', exampleEn: 'Locking 6-month project down payment in a 6-month term deposit.' },
              { word: 'TENOR', clueId: 'Periode penguncian jangka waktu deposito seperti 1, 3, 6, atau 12 bulan.', clueEn: 'Fixed maturity duration.', definitionId: 'Lama waktu simpanan berjangka hingga tanggal jatuh tempo pencairan tanpa penalti.', definitionEn: 'Duration until maturity release date.', exampleId: 'Membagi deposito ke tenor 1 & 3 bulan agar tetap luwes saat sewaktu-waktu cair.', exampleEn: 'Laddering 1 and 3 month terms for flexibility.' },
              { word: 'SPREAD', clueId: 'Selisih antara harga beli emas saat ini dibanding harga jual kembali (buyback).', clueEn: 'Gap between purchase price and buyback price.', definitionId: 'Persentase selisih biaya jual-beli langsung pada logam mulia, valas, atau aset pasar.', definitionEn: 'Buy-sell bid-ask cost spread.', exampleId: 'Membeli emas Rp1,4jt dengan buyback Rp1,28jt menimbulkan spread 8,57% di hari pertama.', exampleEn: 'Opening-day spread of 8.57% creates instant unrealized gap.' },
              { word: 'BUYBACK', clueId: 'Harga jual kembali saat pemilik menukar emasnya kembali ke toko atau butik berizin.', clueEn: 'Dealer repurchase price for selling gold back.', definitionId: 'Tarif resmi yang dibayarkan lembaga penjual ketika kamu mencairkan kembali emas fisik/digital.', definitionEn: 'Repurchase rate offered when liquidating gold.', exampleId: 'Harga buyback harus naik melampaui +9,375% agar pembelian Rp1,4jt balik modal.', exampleEn: 'Buyback must climb +9.375% just to break even.' },
            ]),
            mkPairLesson('S5.U22.ST1.P4', 'Alokasi 4 Tujuan ke Tabungan/Deposito/Emas', 'Rational Allocation', 'Menempatkan 4 kantong tujuan sesuai likuiditas, pajak, dan spread.', {
              mode: 'pairs',
              instructionId: 'Pasangkan 4 tujuan keuangan berikut dengan wadah penyimpanan yang paling rasional.',
              instructionEn: 'Match 4 real goals to the most rational cash/gold/deposit tool.',
              pairs: [
                { id: 'de1', leftId: 'Dana darurat cair mendadak malam ini', leftEn: 'Emergency cash needed tonight', rightId: 'Tabungan terpisah cair 24/7 (tanpa penalti break)', rightEn: 'Separate 24/7 liquid savings' },
                { id: 'de2', leftId: 'Dana DP usaha pasti 6 bulan lagi (tak boleh turun)', leftEn: 'Guaranteed business DP in 6 months', rightId: 'Deposito berjangka tenor 3–6 bulan (bunga + insentif ≤ TBP LPS)', rightEn: '3–6m Time Deposit within LPS TBP' },
                { id: 'de3', leftId: 'Penyimpan nilai opsional 5–10 tahun (siap fluktuasi, tanpa butuh kupon rutin)', leftEn: '5–10y optional value store', rightId: 'Emas fisik/digital berizin resmi (horizon panjang menutup risiko spread)', rightEn: 'Licensed gold for long horizon' },
                { id: 'de4', leftId: 'Uang belanja jajan & transport minggu ini', leftEn: 'Weekly meal & transit cash', rightId: 'Dompet Digital / Rekening Transaksi Harian', rightEn: 'E-Wallet / Daily Checking' },
              ],
              explanationCard: card({
                why: 'Setiap instrumen hanya tepat ketika horizon waktu dan sifat likuiditasnya cocok dengan jadwal pemakaian uang.',
                type: 'dynamic_fact',
                reg: REG_SOURCES.DEPOSITO_EMAS,
                next: 'Lanjutkan ke Unit 23 untuk membandingkan Deposito (PPh 20%) dengan SBN Ritel (PPh 10%).',
              }),
            }, { isBoss: true, st: 'dynamic_fact', reg: REG_SOURCES.DEPOSITO_EMAS }),
          ],
        },
      ],
    },

    // ================= UNIT 23 =================
    {
      id: 'S5.U23',
      unitNumber: 23,
      semesterId: 'S5',
      titleId: 'Surat Berharga Negara Ritel ORI, SBR, SR & ST',
      titleEn: 'Retail Government Securities (ORI, SBR, SR, ST)',
      regulationMeta: REG_SOURCES.SBN_RITEL,
      guidebook: {
        summaryId:
          'Membeli SBN Ritel berarti membiayai APBN negara via Mitra Distribusi berizin OJK dengan jaminan kupon & pokok berdasar UU serta PPh Final 10% (PP 91/2021: separuh pajak deposito 20%). ORI/SR bersifat Tradable (bisa dijual sebelum jatuh tempo di pasar sekunder namun mengandung risiko fluktuasi harga & potensi capital loss!). SBR/ST bersifat Non-Tradable dengan imbal hasil floating with floor + fasilitas early redemption hanya pada periode jendela khusus & batas maksimal setelah masa tunggu. Khusus Sukuk Negara (SR/ST) memakai basis underlying asset syariah.',
        summaryEn: 'SBN Ritel PP 91/2021 10% tax, Tradable ORI/SR price risk vs Non-Tradable SBR/ST early redemption windows, & Sukuk underlying assets.',
        keyRulesId: [
          'PPh Final kupon/imbalan SBN = 10% (PP 91/2021) vs bunga Deposito = 20%.',
          'Early redemption SBR/ST BUKAN pencairan bebas kapan saja: hanya berlaku di jendela waktu tertentu pasca-masa tunggu & dibatasi persentase maksimal (mis. maks 50%).',
          'ORI/SR dapat diperjualbelikan di pasar sekunder, tetapi harganya bisa turun di bawah harga beli (capital loss) jika suku bunga pasar naik.',
        ],
        keyRulesEn: [
          'SBN coupons carry 10% final tax vs 20% on bank deposits.',
          'Early redemption applies strictly during specified windows & caps.',
          'Underlying asset structures apply specifically to Islamic Sukuk series (SR/ST).',
        ],
        disclaimerId: 'Referensi Regulasi: PP No. 91/2021 & Memorandum Informasi DJPPR Kemenkeu.',
        disclaimerEn: 'Regulatory Reference: PP 91/2021 & Ministry of Finance SBN Memorandums.',
      },
      stages: [
        {
          id: 'S5.U23.ST1',
          stageNumber: '23.1',
          titleId: 'Karakteristik & Efisiensi Pajak SBN Ritel',
          titleEn: 'SBN Ritel Characteristics & Net Tax Advantage',
          skipExamId: 'SKIP.S5.U23.ST1',
          paths: [
            mkWordleLesson('S5.U23.ST1.P1', 'Kosakata Obligasi & SBN Ritel', 'Government Bond Terms', 'Menguasai istilah obligasi, kupon, mitra, floor.', [
              { word: 'OBLIGASI', clueId: 'Surat berharga pengakuan utang jangka waktu tertentu dengan janji kupon berkala.', clueEn: 'Fixed-income debt security.', definitionId: 'Instrumen surat utang penerbit (negara/korporasi) kepada investor dengan komitmen kupon & pelunasan pokok.', definitionEn: 'Debt security paying periodic coupons until maturity.', exampleId: 'ORI dan SBR adalah instrumen obligasi ritel negara konvensional.', exampleEn: 'ORI and SBR are conventional retail government bonds.' },
              { word: 'KUPON', clueId: 'Imbalan bunga atau imbal hasil berkala yang dibayarkan kepada pemegang SBN.', clueEn: 'Periodic bond interest payout.', definitionId: 'Pembayaran imbal hasil rutin bulanan dari penerbit surat berharga negara.', definitionEn: 'Regular coupon distribution paid to bondholders.', exampleId: 'Kupon SBN Ritel dikenai PPh Final 10%, lebih ringan dibanding bunga deposito 20%.', exampleEn: 'SBN coupons enjoy 10% final tax vs 20% on deposits.' },
              { word: 'MITRA', clueId: 'Bank, sekuritas, atau fintech resmi berizin OJK yang ditunjuk Kemenkeu memasarkan SBN.', clueEn: 'Authorized OJK distribution partner selling SBN.', definitionId: 'Mitra Distribusi resmi penjalur pemesanan SBN Ritel (sistem e-SBN Kemenkeu).', definitionEn: 'Licensed financial distribution partner for SBN.', exampleId: 'Membeli ORI atau ST wajib melalui Mitra Distribusi resmi terdaftar, bukan transfer ke perorangan.', exampleEn: 'Order retail SBN exclusively via licensed distribution partners.' },
              { word: 'FLOOR', clueId: 'Batas imbal hasil minimal pada SBR dan ST meski BI-Rate nanti mengalami penurunan.', clueEn: 'Minimum guaranteed coupon floor rate.', definitionId: 'Tingkat kupon terendah (batas bawah) pada skema floating with floor di SBN non-tradable.', definitionEn: 'Lowest protected coupon floor rate.', exampleId: 'Jika BI-Rate naik kupon SBR ikut naik, tetapi jika turun tidak tembus ke bawah batas floor.', exampleEn: 'Floating with floor protects minimum yield when policy rates fall.' },
            ]),
            mkPairLesson('S5.U23.ST1.P2', 'Bedakan Seri ORI, SBR, SR & ST Secara Presisi', 'Compare ORI, SBR, SR & ST Precisely', 'Memetakan tradable market-price risk, non-tradable early redemption limits, & underlying asset Sukuk.', {
              mode: 'pairs',
              instructionId: 'Cocokkan 4 seri utama SBN Ritel Indonesia dengan karakteristik teknis serta risikonya secara akurat.',
              instructionEn: 'Match the 4 SBN series to their exact features and risks.',
              pairs: [
                { id: 'sb1', leftId: 'ORI (Obligasi Negara Ritel)', leftEn: 'ORI', rightId: 'Konvensional, kupon tetap, tradable di pasar sekunder (ada risiko harga turun / capital loss jika dijual awal)', rightEn: 'Conventional, fixed coupon, tradable (secondary price risk)' },
                { id: 'sb2', leftId: 'SBR (Savings Bond Ritel)', leftEn: 'SBR', rightId: 'Konvensional, non-tradable, kupon floating with floor + early redemption terbatas jendela/kuota khusus', rightEn: 'Conventional, non-tradable, floating with floor + windowed early redemption' },
                { id: 'sb3', leftId: 'SR (Sukuk Negara Ritel)', leftEn: 'SR', rightId: 'Syariah berbasis underlying asset negara, imbalan tetap, tradable (berisiko fluktuasi harga sebelum jatuh tempo)', rightEn: 'Islamic underlying asset, fixed return, tradable' },
                { id: 'sb4', leftId: 'ST (Sukuk Tabungan)', leftEn: 'ST', rightId: 'Syariah berbasis underlying asset negara, non-tradable, floating with floor + early redemption bersyarat jendela', rightEn: 'Islamic underlying asset, non-tradable, floating with floor + windowed redemption' },
              ],
              explanationCard: card({
                why: 'Hanya seri Sukuk (SR & ST) yang menggunakan struktur syariah ber-underlying asset negara! Sementara SBR & ST walau punya early redemption tetap mensyaratkan masa tunggu dan jendela waktu khusus dengan batas persentase pencairan sebagian.',
                type: 'dynamic_fact',
                reg: REG_SOURCES.SBN_RITEL,
                next: 'Pastikan uang yang ditaruh di SBN Ritel memang siap ditahan sesuai tenor (atau jendela resmi seri tersebut).',
              }),
            }, { st: 'dynamic_fact', reg: REG_SOURCES.SBN_RITEL }),
            mkQuizLesson('S5.U23.ST1.P3', 'Bandingkan Kupon Bersih SBN vs Bunga Deposito', 'Net SBN vs Deposit After Tax', 'Menghitung selisih bersih PP 91/2021 vs PP 131/2000.', [
              {
                id: 's5u23s1p3_q1',
                promptId:
                  '(Asumsi: kedua instrumen memberi tingkat kupon/bunga kotor sama 6,0%/th selama 1 tahun pada dana Rp50.000.000). Berapa hasil bersih setahun SBN Ritel (PPh Final 10%) vs Deposito (PPh Final 20%)?',
                promptEn: 'Rp50M at 6% gross: SBN (10% tax) vs Deposit (20% tax) net annual cash payout?',
                optionsId: [
                  'SBN Neto Rp2.700.000 vs Deposito Neto Rp2.400.000',
                  'SBN Neto Rp2.400.000 vs Deposito Neto Rp2.700.000',
                  'SBN Neto Rp3.000.000 vs Deposito Neto Rp2.400.000',
                  'SBN Neto Rp2.400.000 vs Deposito Neto Rp2.400.000',
                ],
                optionsEn: [
                  'SBN Net Rp2,700,000 vs Deposit Net Rp2,400,000',
                  'SBN Net Rp2,400,000 vs Deposit Net Rp2,700,000',
                  'SBN Net Rp3,000,000 vs Deposit Net Rp2,400,000',
                  'SBN Net Rp2,400,000 vs Deposit Net Rp2,400,000',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'PP No. 91/2021 menetapkan tarif PPh Final kupon SBN sebesar 10%, hanya setengah dari tarif PPh Final bunga deposito 20%.',
                  calc: 'Kotor = 6% × Rp50jt = Rp3.000.000. SBN Neto = 90% × Rp3jt = Rp2.700.000 (5,4%). Deposito Neto = 80% × Rp3jt = Rp2.400.000 (4,8%).',
                  type: 'dynamic_fact',
                  reg: REG_SOURCES.SBN_RITEL,
                  next: 'Ingat trade-off-nya: SBN punya masa jatuh tempo 2–6 tahun dan aturan pasar sekunder / jendela early redemption, bukan cair 24/7 seperti tabungan.',
                }),
              },
              {
                id: 's5u23s1p3_q2',
                promptId:
                  '[Analitik HOTS] Dana Rp50.000.000 PASTI dibutuhkan tepat 4 bulan lagi untuk pelunasan akad rumah. Meskipun pajak kupon SBN Ritel (10%) lebih rendah daripada PPh bunga Deposito (20%), mana instrumen penempatan yang paling rasional?',
                promptEn: '[HOTS] Rp50M is strictly needed in 4 months for home closing. Even though SBN coupon tax (10%) beats Deposit tax (20%), which vehicle fits the 4-month constraint?',
                optionsId: [
                  'Deposito 3 bulan + 1 bulan karena SBN terkunci/risiko harga turun jika dijual cepat',
                  'SBN Ritel ST karena bebas dicairkan 100% di pasar sekunder kapan saja tanpa tunggu',
                  'SBN Ritel ORI bertenor 6 tahun karena selisih pajak 10% menutupi semua fluktuasi',
                  'Taruh di Reksadana Saham karena likuiditas penjualan unit selesai kurang dari 4 bulan',
                ],
                optionsEn: [
                  'Deposit (3m + 1m ladder) because SBN faces holding locks or early-sale price risk',
                  'SBN Ritel ST because savings bonds liquidate 100% freely on secondary markets anytime',
                  '6-year ORI bond because the 10% lower tax rate covers every secondary price swing',
                  'Equity Mutual Fund because redemption settles well inside a 4-month horizon',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Optimalisasi pajak (C5 evaluasi) tidak boleh mengalahkan kecocokan LIKUIDITAS HORIZON! Seri SBN non-tradable (ST/SBR) tidak bisa dijual di pasar sekunder, sedangkan ORI/SR berisiko dijual rugi di bawah par bila pasar sekunder turun saat butuh cepat.',
                  next: 'Selalu kunci horizon dan kebutuhan cair uang terlebih dahulu, barulah bandingkan efisiensi pajak di antara instrumen yang cocok waktunya.',
                  type: 'dynamic_fact',
                  reg: REG_SOURCES.SBN_RITEL,
                }),
              },
            ], { st: 'dynamic_fact', reg: REG_SOURCES.SBN_RITEL }),
          ],
        },
      ],
    },

    // ================= UNIT 24 =================
    {
      id: 'S5.U24',
      unitNumber: 24,
      semesterId: 'S5',
      titleId: 'Reksadana, Biaya Pengelolaan & Pelaporan Pajak',
      titleEn: 'Mutual Funds, Management Fees & Tax Reporting',
      regulationMeta: REG_SOURCES.REKSADANA_PAJAK,
      guidebook: {
        summaryId:
          'Dalam Reksadana, Manajer Investasi (MI) memilih aset portofolio, sedangkan dana dan efek disimpan terpisah di Bank Kustodian independen. Bank Kustodian adalah pemisahan struktural penyimpanan harta dan administrasi portofolio agar terpisah dari kekayaan MI, BUKAN jaminan bebas kerugian nilai pasar maupun kekebalan mutlak dari seluruh risiko operasional! Reksadana tidak dijamin LPS dan NAB/Unit dapat turun. Hasil pencairan unit reksadana bukan objek pajak (UU PPh Ps 4(3)(i)), namun nilai akhir tahun (31 Des) wajib masuk Daftar Harta SPT dan pencairannya dicatat sebagai penghasilan bukan objek pajak.',
        summaryEn: 'MI vs Bank Kustodian structural asset segregation (not loss guarantee), non-LPS risk, and SPT asset vs realized non-taxable separation.',
        keyRulesId: [
          'Bank Kustodian = segregasi struktural kekayaan produk dari MI, BUKAN jaminan pasti untung atau anti-risiko operasional.',
          'Reksadana BUKAN produk bank dan TIDAK dijamin LPS; nilai NAB/Unit bisa turun.',
          'Lapor SPT: (1) Saldo nilai kepemilikan per 31 Des → Daftar Harta SPT Tahunan; (2) Keuntungan realisasi pencairan → pos Penghasilan Bukan Objek Pajak.',
        ],
        keyRulesEn: [
          'Custodian banks segregate assets structurally, not a loss guarantee.',
          'Mutual funds are not LPS-insured; NAV fluctuates.',
          'Report Dec 31 holdings in SPT Asset list and realized gains under Non-Taxable Income.',
        ],
        disclaimerId: 'Referensi Regulasi: UU Pasar Modal OJK & UU PPh Pasal 4 ayat 3 huruf i.',
        disclaimerEn: 'Regulatory Reference: OJK Mutual Fund rules & Income Tax Law Art. 4(3)(i).',
      },
      stages: [
        {
          id: 'S5.U24.ST1',
          stageNumber: '24.1',
          titleId: 'Ekosistem, Evaluasi Biaya & Diagnosa Risiko',
          titleEn: 'Ecosystem, Costs & Risk Diagnosis',
          skipExamId: 'SKIP.S5.U24.ST1',
          paths: [
            mkPairLesson('S5.U24.ST1.P1', 'Pemisahan Tugas MI, Bank Kustodian & OJK', 'MI vs Custodian Bank Roles', 'Memahami segregasi struktural harta oleh Bank Kustodian (bukan jaminan untung).', {
              mode: 'pairs',
              instructionId: 'Cocokkan peran tiap pihak dalam ekosistem Reksadana resmi Indonesia secara akurat.',
              instructionEn: 'Match each participant in Indonesian mutual funds accurately.',
              pairs: [
                { id: 'rd1', leftId: 'Manajer Investasi (MI)', leftEn: 'Investment Manager', rightId: 'Profesional berizin OJK yang meracik strategi & membeli/menjual portofolio aset', rightEn: 'OJK-licensed portfolio strategist' },
                { id: 'rd2', leftId: 'Bank Kustodian', leftEn: 'Custodian Bank', rightId: 'Pemegang pemisahan struktural aset & pencatat NAB terpisah dari harta MI (BUKAN garansi untung/anti-rugi pasar)', rightEn: 'Independent asset segregation & NAV keeper (not return guarantee)' },
                { id: 'rd3', leftId: 'Otoritas Jasa Keuangan (OJK)', leftEn: 'OJK', rightId: 'Pemberi izin & pengawas kepatuhan hukum produk reksadana (bukan penjamin kerugian investasi)', rightEn: 'Product regulator (does not insure market loss)' },
                { id: 'rd4', leftId: 'NAB / Unit Penyertaan', leftEn: 'NAV / Unit Price', rightId: 'Harga bersih per unit yang berfluktuasi mengikuti nilai pasar aset dasar dan sudah bersih biaya pengelolaan', rightEn: 'Daily market price per unit net of fund fees' },
              ],
              explanationCard: card({
                why: 'Segregasi struktural di Bank Kustodian melindungi investor apabila perusahaan MI mengalami pailit/tutup, namun tetap tidak menjamin investasi bebas rugi pasar maupun risiko operasional lainnya.',
                type: 'dynamic_fact',
                reg: REG_SOURCES.REKSADANA_PAJAK,
                next: 'Pastikan baik produk reksadana maupun agen penjualnya (APERD) terdaftar resmi di OJK.',
              }),
            }, { st: 'dynamic_fact', reg: REG_SOURCES.REKSADANA_PAJAK }),
            mkPairLesson('S5.U24.ST1.P2', 'Urutan 4 Jenis Reksadana Berdasarkan Fluktuasi & Horizon', 'Order 4 Mutual Fund Risk Tiers', 'Mengurutkan Pasar Uang, Pendapatan Tetap, Campuran, & Saham.', {
              mode: 'sequence',
              instructionId: 'Urutkan 4 kategori utama Reksadana dari fluktuasi historis terendah (horizon terpendek) ke tertinggi (horizon terpanjang).',
              instructionEn: 'Order the 4 mutual fund types from lowest to highest volatility.',
              sequenceSteps: [
                { id: 'mf1', labelId: 'Reksadana Pasar Uang (RDPU: fluktuasi rendah, horizon < 1 tahun)', labelEn: 'Money Market Fund (< 1y)', order: 1 },
                { id: 'mf2', labelId: 'Reksadana Pendapatan Tetap (RDPT: obligasi, horizon 1–3 tahun)', labelEn: 'Fixed Income Fund (1–3y)', order: 2 },
                { id: 'mf3', labelId: 'Reksadana Campuran (kombinasi ekuitas & obligasi, horizon 3–5 tahun)', labelEn: 'Balanced Fund (3–5y)', order: 3 },
                { id: 'mf4', labelId: 'Reksadana Saham (RDS: minimal 80% efek ekuitas, fluktuasi tinggi, horizon > 5 tahun)', labelEn: 'Equity Fund (> 5y)', order: 4 },
              ],
              explanationCard: card({
                why: 'Menempatkan dana kuliah bulan depan ke Reksadana Saham berisiko besar anjlok tepat saat pembayaran; sebaliknya dana 10 tahun di RDPU berisiko kalah oleh inflasi.',
                next: 'Cocokkan selalu kategori reksadana dengan jadwal pemakaian dana.',
              }),
            }),
            mkQuizLesson('S5.U24.ST1.P3', 'Evaluasi Expense Ratio & Pelaporan SPT Tahunan Reksadana', 'Expense Ratio & SPT Tax Distinction', 'Membandingkan biaya pengelolaan & memisahkan Daftar Harta vs Bukan Objek Pajak di SPT.', [
              {
                id: 's5u24s1p3_q1',
                promptId: 'Dua Reksadana Saham Indeks meniru indeks acuan yang sama. Produk A punya Expense Ratio 1,2%/tahun sedangkan Produk B 3,5%/tahun tanpa konsistensi mengalahkan indeks. Mana lebih efisien bagi investor jangka panjang?',
                promptEn: 'Two index funds tracking same benchmark: A (1.2% ER) vs B (3.5% ER). More cost-efficient?',
                optionsId: [
                  'Produk A karena ER 1,2% memangkas jauh lebih sedikit imbal hasil majemuk',
                  'Produk B karena ER 3,5% menandakan manajemen aktif yang pasti mengalahkan indeks',
                  'Keduanya setara karena angka NAB harian reksadana mengabaikan expense ratio',
                  'Produk B hanya memotong biaya 3,5% satu kali pada tahun pembelian pertama',
                ],
                optionsEn: [
                  'Product A because 1.2% ER subtracts far less from long-term compounding',
                  'Product B because 3.5% ER signals active skill guaranteed to beat indices',
                  'Both perform equally because daily published NAB excludes expense fees',
                  'Product B deducts its 3.5% fee only once during initial subscription',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Pada produk pelacak indeks serupa, biaya pengelolaan tinggi secara langsung menggerogoti hasil neto investor setiap hari.',
                  next: 'Periksa Fund Fact Sheet sebelum membeli produk investasi kolektif.',
                }),
              },
              {
                id: 's5u24s1p3_q2',
                promptId: 'Bagaimana perlakuan pajak & pelaporan SPT Tahunan yang TEPAT atas kepemilikan vs realisasi keuntungan pencairan unit reksadana?',
                promptEn: 'Accurate tax & SPT treatment for year-end mutual fund holdings vs realized gains?',
                optionsId: [
                  'Untung realisasi Bukan Objek Pajak, namun saldo 31 Des wajib masuk Daftar Harta SPT',
                  'Keuntungan pencairan dipotong PPh Final 20% dan dihapus dari Daftar Harta SPT',
                  'Nilai unit reksadana 31 Desember bebas lapor SPT karena sudah dicatat kustodian',
                  'Investor wajib membayar PPh progresif atas kenaikan nilai NAB akhir tahun meski belum cair',
                ],
                optionsEn: [
                  'Realized gain is Non-Taxable Object, while Dec 31 value enters SPT Asset List',
                  'Realized payouts incur 20% final tax and drop off annual SPT asset listings',
                  'Dec 31 holdings are exempt from SPT declarations due to custodian reporting',
                  'Investors pay progressive tax yearly on unrealized Dec 31 NAB appreciation',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Memisahkan pencatatan "Kepemilikan Aset per 31 Des → Daftar Harta" dari "Realisasi Untung Cair → Penghasilan Bukan Objek Pajak" menjaga kerapian pelaporan SPT tanpa salah bayar pajak.',
                  type: 'dynamic_fact',
                  reg: REG_SOURCES.REKSADANA_PAJAK,
                  next: 'Unduh laporan tahunan (tax/holding summary) dari platform APERD berizinmu setiap menjelang lapor SPT.',
                }),
              },
            ], { st: 'dynamic_fact', reg: REG_SOURCES.REKSADANA_PAJAK }),
            mkWordleLesson('S5.U24.ST1.P4', 'Kosakata Ekosistem Reksadana', 'Mutual Fund Terms', 'Menguasai Reksadana, Kustodian, Manajer, Expense.', [
              { word: 'REKSADANA', clueId: 'Wadah penghimpunan dana masyarakat yang dikelola Manajer Investasi ke portofolio efek.', clueEn: 'Pooled investment vehicle managed by MI.', definitionId: 'Instrumen investasi kolektif berizin OJK (bukan produk bank LPS) dengan empat jenis utama.', definitionEn: 'OJK-regulated pooled investment fund.', exampleId: 'Investor ritel dapat mulai berinvestasi di reksadana berizin secara bertahap.', exampleEn: 'Retail savers starting gradually in licensed mutual funds.' },
              { word: 'KUSTODIAN', clueId: 'Bank independen penyimpan aset reksadana secara terpisah dari kekayaan Manajer Investasi.', clueEn: 'Independent bank segregating mutual fund assets.', definitionId: 'Bank penyedia jasa penitipan & administrasi terpisah (segregasi struktural, bukan jaminan rugi pasar).', definitionEn: 'Custodian bank holding segregated fund assets.', exampleId: 'Bila MI bangkrut, aset investor di Bank Kustodian tidak ikut masuk harta pailit MI.', exampleEn: 'Segregated custodian assets stay protected if the MI closes.' },
              { word: 'MANAJER', clueId: 'Pihak berizin OJK yang bertugas memilih instrumen dan mengelola strategi portofolio reksadana.', clueEn: 'Licensed fund strategist managing asset allocation.', definitionId: 'Manajer Investasi (MI) pembuat keputusan jual-beli efek sesuai kebijakan investasi di prospektus.', definitionEn: 'Licensed Investment Manager.', exampleId: 'Mengevaluasi rekam jejak, kepatuhan izin, dan biaya pengelolaan MI.', exampleEn: 'Evaluating MI track record and expense fee discipline.' },
              { word: 'EXPENSE', clueId: 'Rasio beban biaya operasional & pengelolaan tahunan di dalam portofolio reksadana.', clueEn: 'Annual fund operating expense ratio.', definitionId: 'Expense Ratio: persentase total biaya pengelolaan tahunan dibandingkan rata-rata nilai aset bersih dana.', definitionEn: 'Annual operating cost drag percentage.', exampleId: 'Semakin rendah expense ratio pada indeks sama, semakin besar porsi imbal hasil milik investor.', exampleEn: 'Lower expense ratios preserve more compounding for investors.' },
            ]),
            mkPohonLesson('S5.U24.ST1.P5', 'Diagnosa Penurunan Portofolio Saat Krisis', 'Diagnosing Portfolio Drops', 'Menganalisis akar penurunan portofolio: salah pilih horizon, biaya mahal, vs fluktuasi normal.', {
              mode: 'diagnosa',
              scenarioTitleId: 'Audit & Penyelamatan 3 Portofolio yang Mengalami Penurunan Nilai',
              scenarioIntroId:
                'Ekonomi lesu membuat beberapa portofolio berwarna merah. Tugasmu mendiagnosa akar masalahnya: apakah karena salah horizon likuiditas, expense ratio tinggi, atau fluktuasi normal jangka panjang!',
              horizonLabelId: '3 Kasus Diagnosa',
              initialCash: 5_000_000,
              initialInvested: 15_000_000,
              targetGoalAmount: 22_000_000,
              quarters: [
                {
                  quarterLabelId: 'Diagnosa 1: Uang SPP Kuliah Bulan Depan Ditaruh di Reksadana Saham (-12%)',
                  eventTitleId: 'Salah Pilih Produk untuk Horizon Pendek',
                  eventDescId: 'Dana SPP jatuh tempo 3 minggu lagi namun terlanjur masuk Reksadana Saham dan kini turun -12%.',
                  macroWeather: 'KRISIS',
                  options: [
                    {
                      id: 'd1_opt1',
                      labelId: 'Diagnosa: Kesalahan fatal horizon waktu (< 1 tahun seharusnya RDPU/Tabungan); amankan dana SPP segera ke kas likuid & pelajari risiko agar tak berulang',
                      descId: 'Menyelesaikan kebutuhan mendesak kuliah sekaligus membenahi pencocokan horizon.',
                      cashDelta: 4_000_000,
                      investedDelta: -4_500_000,
                      riskExposureScore: 15,
                      inflationProtectionScore: 40,
                      liquidityScore: 90,
                      feedbackId: 'Diagnosa akurat! Biaya kuliah jangka sangat pendek tidak boleh terekspos volatilitas saham.',
                      isOptimal: true,
                    },
                    {
                      id: 'd1_opt2',
                      labelId: 'Diagnosa: Biarkan tetap di saham dan tunda bayar SPP semester sampai saham untung +30%',
                      descId: 'Berisiko terkena denda telat atau cuti paksa kuliah.',
                      cashDelta: -1_000_000,
                      investedDelta: 0,
                      riskExposureScore: 95,
                      inflationProtectionScore: 40,
                      liquidityScore: 10,
                      feedbackId: 'Salah diagnosis! Mempertaruhkan biaya kuliah bulan depan berakibat sanksi akademik.',
                    },
                  ],
                },
                {
                  quarterLabelId: 'Diagnosa 2: Dana Pensiun 12 Tahun Turun -6% Saat Koreksi Pasar (ER 0,8%)',
                  eventTitleId: 'Fluktuasi Pasar Normal pada Horizon Panjang',
                  eventDescId: 'Indeks pasar melemah sementara -6% padahal target pemakaian masih 12 tahun lagi.',
                  macroWeather: 'KRISIS',
                  options: [
                    {
                      id: 'd2_opt1',
                      labelId: 'Diagnosa: Fluktuasi jangka pendek wajar! Jangan panik menjual; biaya efisien 0,8% dan waktu masih 12 tahun',
                      descId: 'Tetap disiplin sesuai rencana jangka panjang.',
                      cashDelta: 0,
                      investedDelta: 2_500_000,
                      riskExposureScore: 45,
                      inflationProtectionScore: 85,
                      liquidityScore: 70,
                      feedbackId: 'Tepat! Tidak semua warna merah berarti salah produk, untuk horizon 12 tahun, penurunan sementara adalah hal normal.',
                      isOptimal: true,
                    },
                    {
                      id: 'd2_opt2',
                      labelId: 'Diagnosa: Bank Kustodian gagal menjamin untung, tarik semua uang selamanya ke lemari',
                      descId: 'Keliru memahami peran Bank Kustodian dan mengunci rugi -6%.',
                      cashDelta: 8_000_000,
                      investedDelta: -9_000_000,
                      riskExposureScore: 10,
                      inflationProtectionScore: 10,
                      liquidityScore: 90,
                      feedbackId: 'Salah kaprah! Bank Kustodian melakukan segregasi aset, bukan jaminan anti-fluktuasi.',
                    },
                  ],
                },
              ],
              explanationCard: card({
                why: 'Mendiagnosa penurunan nilai membutuhkan melihat 3 hal: apakah waktunya cocok, apakah biayanya wajar, atau sekadar volatilitas pasar normal.',
                type: 'dynamic_fact',
                reg: REG_SOURCES.REKSADANA_PAJAK,
                next: 'Lanjutkan ke Unit 25 untuk mengenal pasar saham Bursa Efek Indonesia!',
              }),
            }),
          ],
        },
      ],
    },

    // ================= UNIT 25 =================
    {
      id: 'S5.U25',
      unitNumber: 25,
      semesterId: 'S5',
      titleId: 'Pasar Modal & Pengenalan Saham Dasar',
      titleEn: 'Capital Markets & Equity Basics',
      regulationMeta: REG_SOURCES.SAHAM_BEI,
      guidebook: {
        summaryId:
          'Membeli saham di Bursa Efek Indonesia (BEI) minimal 1 lot (100 lembar) lewat perusahaan sekuritas resmi berizin OJK dan pencatatan di KSEI. Imbal hasil berasal dari Dividen (bila perusahaan untung & disetujui RUPS) serta Capital Gain, dengan risiko nyata Capital Loss, suspensi, hingga delisting. Bedakan tegas penurunan nilai pasar (unrealized price loss) dari total uang keluar termasuk biaya beli dan estimasi biaya jual + PPh final jual 0,1%!',
        summaryEn: 'BEI 1-lot = 100 shares, Dividend & Capital Gain/Loss, fee separation, and detecting pump & dump groups.',
        keyRulesId: [
          '1 Lot di BEI = 100 lembar saham.',
          'Selalu bedakan Unrealized Price Loss atas harga pasar saham vs total modal awal termasuk fee beli sekuritas dan biaya transaksi jual (termasuk PPh final jual 0,1%).',
          'Tolak grup sinyal "Pasti ARA 25% Besok" yang mempromosikan saham rugi/tak likuid (pump & dump).',
        ],
        keyRulesEn: [
          '1 Lot = 100 shares on IDX (BEI).',
          'Separate unrealized price loss from brokerage buy/sell fees and 0.1% final sell tax.',
          'Reject guaranteed-ARA signal groups promoting pump-and-dump schemes.',
        ],
        disclaimerId:
          'Edukasi Netral: Kurikulum tidak pernah memberi rekomendasi beli/jual emiten saham tertentu.',
        disclaimerEn: 'Non-Investment Advice: Educational capital market mechanics only.',
      },
      stages: [
        {
          id: 'S5.U25.ST1',
          stageNumber: '25.1',
          titleId: 'Mekanisme Bursa, Fundamental & Risiko Saham',
          titleEn: 'Exchange Mechanics & Stock Risks',
          skipExamId: 'SKIP.S5.U25.ST1',
          paths: [
            mkWordleLesson('S5.U25.ST1.P1', 'Kosakata Pasar Modal BEI', 'IDX Capital Market Terms', 'Menguasai istilah saham, dividen, emiten, bursa.', [
              { word: 'SAHAM', clueId: 'Bukti kepemilikan bagian atas suatu perusahaan terbuka yang diperdagangkan per lot.', clueEn: 'Ownership equity unit in a listed company.', definitionId: 'Efek bukti penyertaan modal pada Perseroan Terbuka di Bursa Efek (1 lot = 100 lembar).', definitionEn: 'Corporate ownership share traded in 100-share lots.', exampleId: 'Membeli 2 lot saham seharga Rp2.400/lembar memerlukan pokok Rp480.000 ditambah fee beli.', exampleEn: 'Buying 2 lots at Rp2,400 requires Rp480,000 plus buy fee.' },
              { word: 'DIVIDEN', clueId: 'Bagian laba perusahaan yang dibagikan kepada pemegang saham bila disetujui RUPS.', clueEn: 'Profit share distributed to shareholders.', definitionId: 'Distribusi sebagian keuntungan bersih emiten kepada pemegang saham (tidak wajib selalu ada setiap tahun).', definitionEn: 'Board/RUPS-approved corporate earnings distribution.', exampleId: 'Emiten yang merugi umumnya tidak membagikan dividen kepada pemegang saham.', exampleEn: 'Loss-making issuers rarely distribute dividends.' },
              { word: 'EMITEN', clueId: 'Perusahaan penerbit saham atau obligasi yang tercatat publik di bursa efek.', clueEn: 'Public company issuing listed securities.', definitionId: 'Pihak yang melakukan penawaran umum efeknya di pasar modal Indonesia (BEI).', definitionEn: 'Publicly listed securities issuer.', exampleId: 'Membaca laporan keuangan resmi emiten di idx.co.id sebelum menilai kinerja bisnisnya.', exampleEn: 'Reviewing official issuer financial reports at idx.co.id.' },
              { word: 'BURSA', clueId: 'Pasar terorganisir tempat bertemunya jual dan beli saham secara transparan (BEI).', clueEn: 'Organized official securities exchange.', definitionId: 'Bursa Efek Indonesia (BEI), penyelenggara sistem perdagangan efek resmi berizin OJK.', definitionEn: 'Indonesia Stock Exchange (IDX).', exampleId: 'Transaksi di luar bursa lewat janji profit pribadi tanpa sekuritas resmi OJK patut diwaspadai.', exampleEn: 'Avoid off-exchange unlicensed stock solicitation.' },
            ]),
            mkQuizLesson('S5.U25.ST1.P2', 'Hitung Modal Lot, Fee Sekuritas & Unrealized Loss', 'Lots, Brokerage Fees & Unrealized Loss', 'Memisahkan penurunan harga saham belum terealisasi vs total biaya transaksi.', [
              {
                id: 's5u25s1p2_q1',
                promptId:
                  'Harga saham Emiten A = Rp2.400/lembar. Sinta membeli 2 lot (fee beli sekuritas 0,15%), lalu harga saham turun 10% menjadi Rp2.160/lembar. Manakah perhitungan yang memisahkan dengan TEPAT antara kas modal keluar vs unrealized price loss?',
                promptEn: 'Buy 2 lots @ Rp2,400 (0.15% buy fee). Stock drops 10% to Rp2,160. Separate outlay vs unrealized price loss?',
                optionsId: [
                  'Modal Rp480.720 (termasuk fee 0,15%); nilai kini Rp432.000, rugi harga saham -Rp48.000',
                  'Modal Rp480.000; nilai kini Rp432.000, dan fee beli 0,15% dikembalikan bila rugi',
                  'Modal Rp48.072; karena 1 lot berisi 10 lembar saham dengan biaya transaksi 0,15%',
                  'Modal Rp480.720; nilai kini Rp432.000, dan kerugian otomatis bebas fee maupun pajak jual',
                ],
                optionsEn: [
                  'Outlay Rp480,720 (incl. 0.15% buy fee); market value Rp432,000, price loss -Rp48,000',
                  'Outlay Rp480,000; market value Rp432,000, as buy fees refund on losing trades',
                  'Outlay Rp48,072; because one trading lot contains 10 shares with 0.15% brokerage fee',
                  'Outlay Rp480,720; market value Rp432,000, and sales at loss incur zero sell tax/fee',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Memisahkan rugi pergerakan harga saham (-Rp48.000) dari biaya gesekan transaksi (fee beli + estimasi fee jual sekuritas + PPh final jual 0,1%) mencegah terkejutnya investor pemula yang sering jual-beli kilat!',
                  calc: '2 lot = 2 × 100 × Rp2.400 = Rp480.000. Fee beli 0,15% = Rp720 → Total kas keluar Rp480.720. Turun 10% → 200 × Rp2.160 = Rp432.000 (Price loss = -Rp48.000; selisih kas = -Rp48.720).',
                  type: 'dynamic_fact',
                  reg: REG_SOURCES.SAHAM_BEI,
                  next: 'Periksa skema fee beli dan fee jual (yang berbeda nominalnya) pada sekuritas resmi pilihanmu.',
                }),
              },
            ], { st: 'dynamic_fact', reg: REG_SOURCES.SAHAM_BEI }),
            mkDetektifLesson('S5.U25.ST1.P3', 'Audit Grup Sinyal Saham Pompa & Buang', 'Audit Pump & Dump Signals', 'Mendeteksi manipulasi sinyal saham berjanji ARA.', [
              {
                id: 'u25_dc1',
                channel: 'WhatsApp',
                senderTitle: 'Grup Telegram "VIP Sinyal Saham PASTI ARA 25% BESOK PAGI! Biaya Member Rp1,5jt"',
                documentLines: [
                  '• Mengklaim "Pasti ARA 25% besok jam 09.00, dijamin cuan!" pada emiten berkapitalisasi sangat kecil',
                  '• Laporan keuangan publik resmi di idx.co.id mencatat emiten tersebut rugi berturut-turut 4 tahun & utang menumpuk',
                ],
                questionId: 'Indikasi bahaya apa yang muncul dari sinyal berbayar ini?',
                optionsId: [
                  { id: 'o1', labelId: 'BAHAYA (PUMP & DUMP): Oknum memompa harga beli pengikut ritel agar pelaku lama dapat menjual mahal di puncak (exit liquidity)!', verdict: 'BAHAYA' },
                  { id: 'o2', labelId: 'AMAN: Laporan rugi tidak masalah asal bandar grup menjamin pasti ARA', verdict: 'AMAN' },
                  { id: 'o3', labelId: 'AMAN: Semua janji profit harian saham itu resmi disetujui BEI', verdict: 'AMAN' },
                ],
                correctOptionId: 'o1',
                evidenceLevel: 'red_flag',
                explanationCard: card({
                  why: 'Di pasar modal legal tidak pernah ada jaminan harga naik pasti esok hari! Pola mengajak massa membeli serentak pada saham tak likuid berfundamental buruk adalah ciri khas pump & dump.',
                  next: 'Pelajari laporan keuangan resmi emiten dan jangan membeli saham berdasarkan desas-desus grup sinyal.',
                }),
              },
            ]),
            mkPohonLesson('S5.U25.ST1.P4', 'Pohon Aset Volatilitas Pasar Modal', 'Equity Volatility Management', 'Menimbang alokasi aset defensif vs pertumbuhan melalui fase Tech Boom & Market Crash.', {
              mode: 'volatilitas',
              scenarioTitleId: 'Mengendalikan Alokasi Portofolio Melewati Tech Boom & Market Crash',
              scenarioIntroId:
                'Portofolio tujuan jangka panjang Rp25 juta berhadapan dengan euforia Tech Boom lalu koreksi tajam Market Crash. Jaga agar alokasi tetap rasional tanpa all-in pada rumor gorengan!',
              horizonLabelId: '4 Kuartal Volatilitas Pasar',
              initialCash: 10_000_000,
              initialInvested: 15_000_000,
              targetGoalAmount: 30_000_000,
              quarters: [
                {
                  quarterLabelId: 'Kuartal 1: Euforia Tech Boom',
                  eventTitleId: 'Harga Saham Sektor Teknologi Naik Tajam, Rumor Gorengan Berseliweran',
                  eventDescId: 'Banyak teman menyuruh menaruh 100% uang termasuk dana sewa rumah ke satu saham rumor gorengan.',
                  macroWeather: 'BOOM',
                  options: [
                    {
                      id: 'v1_opt1',
                      labelId: 'Pertahankan porsi defensif + diversifikasi aset tumbuh yang fundamentalnya sehat sesuai batas risiko',
                      descId: 'Menghindari risiko konsentrasi 1 saham dan tidak memakai uang kebutuhan pokok.',
                      cashDelta: -4_000_000,
                      investedDelta: 7_500_000,
                      riskExposureScore: 55,
                      inflationProtectionScore: 80,
                      liquidityScore: 75,
                      feedbackId: 'Seimbang! Portofolio ikut bertumbuh secara terukur tanpa all-in berisiko tinggi.',
                      isOptimal: true,
                    },
                    {
                      id: 'v1_opt2',
                      labelId: 'All-in seluruh Rp25jt termasuk uang darurat ke 1 saham rumor gorengan grup VIP',
                      descId: 'Konsentrasi ekstrem pada satu efek spekulatif tanpa likuiditas cadangan.',
                      cashDelta: -10_000_000,
                      investedDelta: 12_000_000,
                      riskExposureScore: 99,
                      inflationProtectionScore: 40,
                      liquidityScore: 10,
                      feedbackId: 'Sangat rapuh jika gelembung rumor berbalik arah!',
                    },
                  ],
                },
                {
                  quarterLabelId: 'Kuartal 2: Koreksi Tajam Market Crash (-30%)',
                  eventTitleId: 'Sentimen Global Memukul Harga Ekuitas',
                  eventDescId: 'Saham spekulatif ambles -45%, sedangkan portofolio seimbang turun jauh lebih moderat -12% dan kas cadanganmu masih aman.',
                  macroWeather: 'KRISIS',
                  options: [
                    {
                      id: 'v2_opt1',
                      labelId: 'Tetap tenang; karena dana kas terpisah aman, evaluasi fundamental tanpa panic selling di dasar pasar',
                      descId: 'Memastikan biaya hidup tetap terpenuhi sementara aset pulih bertahap.',
                      cashDelta: 1_000_000,
                      investedDelta: 2_000_000,
                      riskExposureScore: 45,
                      inflationProtectionScore: 75,
                      liquidityScore: 80,
                      feedbackId: 'Ketenangan terjaga karena uang yang dipakai memang uang dingin!',
                      isOptimal: true,
                    },
                    {
                      id: 'v2_opt2',
                      labelId: 'Jual seluruh portofolio dengan rugi besar di titik terendah karena panik berita media sosial',
                      descId: 'Mengunci kerugian permanen sebelum pemulihan kuartal berikutnya.',
                      cashDelta: 10_000_000,
                      investedDelta: -13_000_000,
                      riskExposureScore: 10,
                      inflationProtectionScore: 15,
                      liquidityScore: 85,
                      feedbackId: 'Panic selling mengunci rugi dan gagal ikut bangkit pada Kuartal 3–4.',
                    },
                  ],
                },
              ],
              explanationCard: card({
                why: 'Saham berpotensi tumbuh jangka panjang tetapi mengandung fluktuasi tinggi. Alokasi sesuai toleransi risiko, fundamental sehat, dan penolakan saham gorengan mencegah kerugian permanen.',
                type: 'dynamic_fact',
                reg: REG_SOURCES.SAHAM_BEI,
                next: 'Lanjutkan ke Unit 26 untuk memahami ekosistem Keuangan Syariah Indonesia!',
              }),
            }),
          ],
        },
      ],
    },

    // ================= UNIT 26 (POJK 8/2025 + OJK/DSN-MUI/DPS + KPR Syariah MMQ) =================
    {
      id: 'S5.U26',
      unitNumber: 26,
      semesterId: 'S5',
      titleId: 'Prinsip Keuangan Syariah Indonesia',
      titleEn: 'Indonesian Islamic Finance Principles',
      regulationMeta: REG_SOURCES.SYARIAH_OJK,
      guidebook: {
        summaryId:
          'Tata kelola keuangan syariah Indonesia dibedakan jelas: OJK (regulator negara), DSN-MUI (penerbit fatwa syariah nasional), dan DPS / Dewan Pengawas Syariah (pengawas internal di tiap lembaga keuangan syariah). Menghindari Riba, Gharar, Maisir dengan akad Wadiah, Mudharabah, Musyarakah, Murabahah. Per POJK No. 8 Tahun 2025, penyaringan Saham Syariah DES mentransisikan rasio utang berbunga/total aset secara bertahap 10 tahun dari ≤ 45% menjadi ≤ 33%, dan pendapatan bunga/non-halal menjadi ≤ 5%. Pada KPR Syariah, Murabahah memakai margin tetap, sedangkan MMQ belum tentu cicilan tetap selamanya di semua bank tergantung kontrak sewa.',
        summaryEn: 'OJK vs DSN-MUI vs DPS roles, Riba/Gharar/Maisir, POJK 8/2025 DES gradual ratio transitions, & Murabahah vs MMQ KPR.',
        keyRulesId: [
          'Jangan mencampur peran: OJK = pengawas negara, DSN-MUI = penerbit fatwa nasional, DPS = pengawas internal di lembaga/produk syariah.',
          'POJK 8/2025 (Daftar Efek Syariah): batas utang berbunga/total aset diturunkan bertahap dalam 10 tahun dari ≤ 45% ke ≤ 33%, serta non-halal ≤ 5% (dari 10%).',
          'KPR Syariah akad Murabahah menetapkan margin tetap sejak awal, sedangkan KPR MMQ penyesuaian sewanya bergantung pada kebijakan/akad bank masing-masing.',
        ],
        keyRulesEn: [
          'OJK regulates state finance, DSN-MUI issues national fatwas, DPS supervises each institution.',
          'POJK 8/2025 transitions DES interest-debt ratio from <=45% to <=33% over 10y and caps non-halal income at <=5%.',
          'Murabahah KPR carries fixed agreed margin; MMQ rental adjustments depend on bank contract.',
        ],
        disclaimerId:
          'Referensi Regulasi: POJK No. 8 Tahun 2025 (Daftar Efek Syariah) & Fatwa DSN-MUI (ketentuan dinamis, cek ulang sebelum rilis).',
        disclaimerEn: 'Regulatory Reference: POJK 8/2025 & DSN-MUI Standards.',
      },
      stages: [
        {
          id: 'S5.U26.ST1',
          stageNumber: '26.1',
          titleId: 'Prinsip Dasar, Akad & Produk Syariah Legal',
          titleEn: 'Islamic Finance Contracts, DES & Scams',
          skipExamId: 'SKIP.S5.U26.ST1',
          paths: [
            mkWordleLesson('S5.U26.ST1.P1', 'Kosakata Keuangan Syariah', 'Islamic Finance Vocabulary', 'Menguasai istilah syariah, akad, nisbah, sukuk.', [
              { word: 'SYARIAH', clueId: 'Sistem keuangan yang beroperasi berdasarkan prinsip Islam bebas Riba, Gharar, & Maisir.', clueEn: 'Finance operating under Sharia principles.', definitionId: 'Tata kelola layanan keuangan resmi berizin OJK yang diawasi kepatuhan fatwa DSN-MUI oleh DPS.', definitionEn: 'Licensed Sharia-compliant financial ecosystem.', exampleId: 'Produk legalnya meliputi Bank Syariah, Sukuk Negara (SR/ST), serta Reksadana & Saham Syariah.', exampleEn: 'Includes Sharia banks, Sukuk (SR/ST) & Islamic funds.' },
              { word: 'AKAD', clueId: 'Perjanjian atau ikatan kontrak transaksi resmi dalam keuangan syariah.', clueEn: 'Binding Sharia financial contract.', definitionId: 'Kesepakatan hak dan kewajiban sesuai prinsip syariah seperti Wadiah, Mudharabah, & Murabahah.', definitionEn: 'Contract structure like Wadiah or Murabahah.', exampleId: 'Memastikan akad jual-beli Murabahah mencatat jelas harga pokok dan margin di muka.', exampleEn: 'Murabahah contract states cost and agreed margin upfront.' },
              { word: 'NISBAH', clueId: 'Porsi pembagian keuntungan (mis. 60:40) dalam akad kerja sama bagi hasil.', clueEn: 'Agreed profit-sharing ratio.', definitionId: 'Persentase kesepakatan bagi hasil realisasi usaha antara pemilik dana dan pengelola.', definitionEn: 'Profit-sharing split agreed under Mudharabah.', exampleId: 'Bagi hasil tabungan Mudharabah bergantung pada nisbah serta laba riil bank syariah.', exampleEn: 'Mudharabah returns follow nisbah and real realized profit.' },
              { word: 'SUKUK', clueId: 'Surat berharga syariah berbasis kepemilikan/hak manfaat aset nyata (underlying asset).', clueEn: 'Islamic asset-backed financial certificate.', definitionId: 'Efek syariah yang diterbitkan atas dasar aset nyata (seperti Sukuk Negara SR dan ST) bebas bunga riba.', definitionEn: 'Sharia certificate anchored to real underlying assets.', exampleId: 'Sukuk Tabungan (ST) merupakan SBN ritel berbasis prinsip syariah.', exampleEn: 'Sukuk Tabungan (ST) is a retail Sharia sovereign security.' },
            ]),
            mkPairLesson('S5.U26.ST1.P2', 'Larangan Dasar, Beda OJK/DSN-MUI/DPS & Akad Populer', 'Match Sharia Governance & Contracts', 'Memetakan Riba/Gharar/Maisir, lembaga pengawas, & akad syariah.', {
              mode: 'pairs',
              instructionId: 'Cocokkan prinsip larangan, perbedaan lembaga (OJK / DSN-MUI / DPS), dan akad syariah dengan penjelasannya.',
              instructionEn: 'Match Sharia rules, governance bodies, and contract terms.',
              pairs: [
                { id: 'sy1', leftId: 'Riba', leftEn: 'Riba', rightId: 'Tambahan bunga tetap atas transaksi pinjam-meminjam uang murni', rightEn: 'Fixed interest charged on pure money loans' },
                { id: 'sy2', leftId: 'Gharar', leftEn: 'Gharar', rightId: 'Transaksi penuh ketidakjelasan objek, kualitas, atau syarat akad yang merugikan pihak lain', rightEn: 'Excessive contractual ambiguity/uncertainty' },
                { id: 'sy3', leftId: 'Maisir', leftEn: 'Maisir', rightId: 'Spekulasi untung-untungan murni (perjudian) tanpa dasar aktivitas produktif nyata', rightEn: 'Zero-sum gambling speculation' },
                { id: 'sy4', leftId: 'OJK · DSN-MUI · DPS', leftEn: 'OJK · DSN-MUI · DPS', rightId: 'OJK regulator negara · DSN-MUI penerbit fatwa nasional · DPS pengawas kepatuhan internal di tiap lembaga syariah', rightEn: 'OJK regulator · DSN-MUI fatwa issuer · DPS internal institution board' },
                { id: 'sy5', leftId: 'Akad Wadiah vs Mudharabah', leftEn: 'Wadiah vs Mudharabah', rightId: 'Titipan aman tanpa janji imbal tetap vs kerja sama modal-pengelola berdasar nisbah hasil nyata', rightEn: 'Safekeeping custody vs profit-sharing partnership' },
                { id: 'sy6', leftId: 'Akad Murabahah', leftEn: 'Murabahah', rightId: 'Jual beli barang dengan harga perolehan + margin keuntungan transparan disepakati sejak awal', rightEn: 'Cost-plus transparent markup sale contract' },
              ],
              explanationCard: card({
                why: 'Mengetahui peran terpisah OJK, DSN-MUI, & DPS membantu memverifikasi apakah sebuah klaim "syariah" benar diawasi resmi atau sekadar kedok penipuan!',
                type: 'dynamic_fact',
                reg: REG_SOURCES.SYARIAH_OJK,
                next: 'Periksa selalu izin OJK serta keberadaan DPS di lembaga/produk keuangan syariah yang ditawarkan.',
              }),
            }, { st: 'dynamic_fact', reg: REG_SOURCES.SYARIAH_OJK }),
            mkQuizLesson('S5.U26.ST1.P3', 'Kriteria Efek Syariah POJK 8/2025, Sukuk & KPR Syariah', 'POJK 8/2025 DES & Islamic Home Financing', 'Menguji kriteria DES POJK 8/2025, Sukuk underlying asset, & beda Murabahah vs MMQ.', [
              {
                id: 's5u26s1p3_q1',
                promptId: 'Berdasarkan pembaruan POJK No. 8 Tahun 2025 (menggantikan POJK 35/2017) untuk Daftar Efek Syariah (DES), perubahan kriteria rasio keuangan apa yang diatur?',
                promptEn: 'What does POJK 8/2025 update for Indonesian Sharia Stock Screening (DES)?',
                optionsId: [
                  'Batas utang bunga terhadap aset turun bertahap ≤ 45%→33%, non-halal ≤ 5%',
                  'Batas utang bunga dinaikkan ke ≤ 65% sementara porsi non-halal tetap ≤ 15%',
                  'Rasio utang bunga dihapus total selama lini usaha utama emiten bersifat halal',
                  'Saham dalam DES otomatis mendapat perlindungan nilai pokok dana dari LPS',
                ],
                optionsEn: [
                  'Interest-debt to assets transitions <=45% to <=33% over 10y, non-halal income <=5%',
                  'Interest-debt ceiling rises up to <=65% while non-halal share remains <=15%',
                  'Interest-debt screening drops entirely whenever core business products are halal',
                  'Shares included on DES receive direct capital principal protection backed by LPS',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'POJK No. 8 Tahun 2025 memperketat kriteria syariah secara bertahap (10 tahun masa transisi rasio utang ke ≤ 33%) agar emiten berkesempatan menyesuaikan struktur pembiayaan tanpa gejolak mendadak.',
                  type: 'dynamic_fact',
                  reg: REG_SOURCES.SYARIAH_OJK,
                  next: 'Ingat bahwa DES dievaluasi berkala, status saham syariah sebuah emiten bisa masuk atau keluar saat tinjauan periode.',
                }),
              },
              {
                id: 's5u26s1p3_q2',
                promptId: 'Apakah seluruh skema KPR Syariah otomatis memiliki cicilan yang selalu tetap identik sampai akhir tenor, dan produk SBN manakah yang memakai underlying asset?',
                promptEn: 'Are all Islamic mortgages automatically fixed forever, and which SBN uses underlying assets?',
                optionsId: [
                  'Murabahah bermargin tetap; MMQ dapat tinjau sewa berkala; Sukuk memakai underlying asset',
                  'Seluruh KPR syariah termasuk MMQ dilarang ubah angsuran; ORI memakai underlying asset',
                  'KPR syariah mengikuti suku bunga acuan BI-Rate mengambang; hanya deposito pakai sukuk',
                  'Murabahah meninjau cicilan tiap 3 tahun; SBN konvensional memakai aset jaminan negara',
                ],
                optionsEn: [
                  'Murabahah locks fixed margin; MMQ rent adjusts per bank contract; Sukuk uses underlying assets',
                  'All Islamic KPR including MMQ forbid rent adjustments permanently; ORI uses underlying assets',
                  'Islamic KPR mirrors floating BI-Rate benchmarks directly; only time deposits issue sukuk',
                  'Murabahah re-prices installments every 3 years; conventional SBN bonds pledge project assets',
                ],
                correctIndex: 0,
                explanationCard: card({
                  why: 'Akad Murabahah (jual-beli) memang mengunci total harga + margin di awal. Namun akad MMQ (Musyarakah Mutanaqisah: kongsi kepemilikan bertahap) memiliki porsi sewa (ujrah) yang di beberapa bank dapat ditinjau berkala sesuai kontrak.',
                  type: 'dynamic_fact',
                  reg: REG_SOURCES.SYARIAH_OJK,
                  next: 'Tanyakan jenis akad serta klausul peninjauan ujrah/sewa secara tertulis sebelum menandatangani akad KPR Syariah.',
                }),
              },
            ], { st: 'dynamic_fact', reg: REG_SOURCES.SYARIAH_OJK }),
            mkDetektifLesson('S5.U26.ST1.P4', 'Audit Investasi Berlabel Syariah Bodong', 'Fake Islamic Investment Audit', 'Membedakan Sukuk/Reksadana Syariah berizin OJK/DPS vs penawaran bodong berlabel agama.', [
              {
                id: 'u26_dc1',
                channel: 'Tawaran',
                senderTitle: 'Brosur WA: "KAVLING KEBUN SYARIAH BAROKAH: Profit Pasti 5%/Bulan Tanpa Risiko! Tanpa Ribet OJK!"',
                documentLines: [
                  '• Mengiming-imingi imbal hasil tetap pasti 5%/bulan (= 60%/tahun) tanpa risiko rugi panen',
                  '• Mengklaim "Syariah murni jadi tidak butuh izin OJK maupun Dewan Pengawas Syariah (DPS)"',
                  '• Dana ditransfer ke rekening pribadi pengelola, bukan rekening berizin/kustodian resmi',
                ],
                questionId: 'Apa kesimpulan audit prinsip 2L & Syariah terhadap tawaran ini?',
                optionsId: [
                  { id: 'o1', labelId: 'BAHAYA (INVESTASI BODONG BERKEDOK LABEL AGAMA), Menjanjikan profit pasti 5%/bln tanpa risiko, tanpa izin OJK, & tanpa pengawasan DPS!', verdict: 'BAHAYA' },
                  { id: 'o2', labelId: 'AMAN: Selama memakai kata syariah dan janji profit 5%/bulan, tidak perlu izin OJK', verdict: 'AMAN' },
                  { id: 'o3', labelId: 'WASPADA: Boleh setor modal besar Rp50 juta dulu untuk menguji 1 bulan', verdict: 'WASPADA' },
                ],
                correctOptionId: 'o1',
                evidenceLevel: 'red_flag',
                explanationCard: card({
                  why: 'Dalam investasi usaha riil syariah (seperti mudharabah/musyarakah), hasil bergantung pada laba nyata, TIDAK BOLEH menjanjikan imbal hasil tetap tinggi pasti 5%/bulan tanpa risiko! Lembaga syariah legal selalu tunduk pada regulasi negara (OJK/instansi terkait) dan pengawasan DPS sesuai fatwa DSN-MUI.',
                  type: 'dynamic_fact',
                  reg: REG_SOURCES.SYARIAH_OJK,
                  next: 'Laporkan penawaran investasi tak berizin berlabel agama kepada Satgas PASTI (sipasti.ojk.go.id) / Kontak OJK 157.',
                }),
              },
            ], { isBoss: true, st: 'dynamic_fact', reg: REG_SOURCES.SYARIAH_OJK }),
          ],
        },
      ],
    },
  ],
  uts: buildUTS('S5', 'UTS Semester 5: LPS 3T, Biaya, Emas & SBN Ritel', 'Unit 21–23', ['S5.U21', 'S5.U22', 'S5.U23']),
  uas: buildUAS(
    'S5',
    'UAS Semester 5: Instrumen Legal, Biaya & Syariah',
    'Unit 21–26',
    ['S5.U21', 'S5.U22', 'S5.U23', 'S5.U24', 'S5.U25', 'S5.U26'],
    'Proyek Evaluasi Produk, Biaya & Alokasi Aset 12 Bulan',
    12,
    {
      isPerformanceProject: true,
      titleId: 'Proyek UAS S5: Evaluasi Produk, Biaya & Alokasi Aset 12 Bulan',
      subtitleId: 'Bagian 2 Proyek Kinerja · Bobot 50%: Uji Return Neto, Pajak SBN & Deposito, Kustodian serta Anti-Bodong Syariah',
      durationLabelId: '12 Bulan Virtual',
      initialState: { cash: 5_000_000, emergencyFund: 15_000_000, sinkingFund: 2_000_000, debt: 0, netWorth: 22_000_000 },
      chapters: [
        {
          id: 's5_uas_1',
          periodLabelId: 'Bulan 1–4: Tujuan Ganda (2 Tahun vs 10 Tahun)',
          narrativeId: 'Punya Dana Pendidikan 2 tahun lagi (Rp12jt) & dana jangka 10 tahun (Rp10jt). Tawaran: Deposito TBP LPS + SBN Ritel (PPh 10%) vs Reksadana Indeks ER 0,5% vs Reksadana biaya 3,5% vs Emas jangka 2 bulan.',
          choices: [
            { id: 'c1', labelId: 'Tempatkan target 2 tahun ke SBN Ritel (10% tax) / instrumen pendek stabil, dan target 10 tahun ke aset efisien biaya (ER rendah)', feedbackId: 'Efisiensi biaya & pajak neto maksimal sekaligus tepat horizon!', deltas: { cash: -2_000_000, netWorth: 3_500_000, scoreCashflow: 30, scoreGoal: 25 }, isRecommended: true },
            { id: 'c2', labelId: 'Masukkan uang pendidikan 2 tahun ke emas lalu jual bulan ke-2 atau taruh 10 tahun di biaya 3,5%/th', feedbackId: 'Spread emas 8,57% / biaya tahunan mahal menggerus return neto signifikan!', deltas: { netWorth: -1_200_000, scoreCashflow: -15 } },
          ],
        },
        {
          id: 's5_uas_2',
          periodLabelId: 'Bulan 5–8: Tawaran Deposito 15% & Investasi Kebun Syariah Tanpa OJK/DPS',
          narrativeId: 'Pasar saham sedang terkoreksi -10% sementara (portofolio 10th merah sementara). Muncul iklan: "Deposito 15% dijamin LPS + Kebun Syariah pasti 5%/bln tanpa izin OJK!".',
          choices: [
            { id: 'c1', labelId: 'Tolak tegas tawaran melanggar TBP LPS & investasi syariah tanpa izin OJK/DPS; pertahankan aset jangka 10th tanpa panic selling', feedbackId: 'Imunitas ilegal sempurna dan tidak terkecoh menjual aset jangka panjang saat merah sementara!', deltas: { scoreSecurity: 30, scoreRisk: 25 }, isRecommended: true },
            { id: 'c2', labelId: 'Jual rugi reksadana jangka panjang untuk ikut investasi syariah 5%/bln tanpa OJK', feedbackId: 'Skema investasi ilegal menghabiskan dana dan memicu kerugian total!', deltas: { cash: -5_000_000, netWorth: -8_000_000, scoreSecurity: -35 } },
          ],
        },
        {
          id: 's5_uas_3',
          periodLabelId: 'Bulan 9–12: Pelaporan SPT Akhir Tahun & Audit Fee',
          narrativeId: 'Menjelang penutupan tahun, kamu menyiapkan data SPT Tahunan untuk SBN, Deposito, & Reksadana per 31 Desember.',
          choices: [
            { id: 'c1', labelId: 'Catat seluruh nilai aset akhir tahun ke Daftar Harta SPT, pisahkan Penghasilan Final (kupon/deposito) vs Bukan Objek Pajak (pencairan reksadana)', feedbackId: 'Kepatuhan pajak tertib dan seluruh tujuan Semester 5 terpenuhi bersih!', deltas: { netWorth: 2_500_000, scoreGoal: 30, scoreSecurity: 20 }, isRecommended: true },
            { id: 'c2', labelId: 'Mengira reksadana tak perlu masuk Daftar Harta SPT dan memaksa bayar pajak ganda atas pencairan reksadana', feedbackId: 'Kekeliruan pelaporan harta & pemahaman objek pajak SPT.', deltas: { cash: -500_000, scoreGoal: -10 } },
          ],
        },
      ],
      explanationCard: card({
        why: 'Membandingkan Return Neto, menjaga 3T LPS, memverifikasi izin OJK/DPS, dan tertib pelaporan SPT Tahunan melengkapi keterampilan investormu.',
        type: 'dynamic_fact',
        reg: REG_SOURCES.SYARIAH_OJK,
        next: 'Semester 6 menutup Akademi CIKO dengan Psikologi Investasi, BI-Rate Makro, Pajak PP 20/2026, UMKM, & Capstone Stress Test 12 Bulan!',
      }),
    }
  ),
};
