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

export const SEMESTER_1: SemesterSpec = {
  id: 'S1',
  semesterNumber: 1,
  titleId: 'Semester 1: Sejarah Uang, Rupiah & Transaksi Dasar',
  titleEn: 'Semester 1: History of Money, Rupiah & Daily Transactions',
  subtitleId: 'Mulai Dari Nol: dari barter ke fiat, keaslian 3D, prioritas belanja, hingga baca struk PPN/PBJT.',
  units: [
    // ================= UNIT 1 =================
    {
      id: 'S1.U1',
      unitNumber: 1,
      semesterId: 'S1',
      titleId: 'Sejarah Uang & Evolusi Nilai',
      titleEn: 'History of Money & Value Evolution',
      guidebook: {
        summaryId:
          'Gambaran umum perkembangan alat tukar (bukan urutan linear tunggal yang seragam di semua masyarakat) memperlihatkan transisi dari barter ke uang barang (garam/kerang), logam mulia (emas/perak), uang kertas bernilai jaminan komoditas di masa lalu, hingga uang fiat modern.',
        summaryEn:
          'Overview of exchange evolution from barter and commodity money to modern fiat currency backed by law and public trust.',
        keyRulesId: [
          'Barter mensyaratkan kecocokan kebutuhan bersamaan (double coincidence of wants), keterbagian nilai, dan daya tahan barang.',
          '3 Fungsi Utama Uang: Alat Tukar (medium of exchange), Satuan Hitung (unit of account), dan Penyimpan Nilai (store of value).',
          'Penyimpan nilai tidak otomatis menjamin daya beli selalu konstan bila terjadi inflasi (dibahas mendalam di Semester 4).',
        ],
        keyRulesEn: [
          'Barter requires double coincidence of wants, divisibility, and durability.',
          'Money serves as medium of exchange, unit of account, and store of value.',
          'Store of value does not guarantee constant purchasing power during inflation.',
        ],
        disclaimerId:
          'Catatan Edukasi: Lini masa evolusi disajikan sebagai kerangka umum sejarah ekonomi, bukan urutan identik pada setiap peradaban.',
        disclaimerEn: 'Educational Note: Timeline illustrates a general historical overview.',
      },
      stages: [
        {
          id: 'S1.U1.ST1',
          stageNumber: '1.1',
          titleId: 'Era Barter & Kendala Pertukaran Langsung',
          titleEn: 'Barter Era & Direct Exchange Hurdles',
          skipExamId: 'SKIP.S1.U1.ST1',
          paths: [
            mkQuizLesson(
              'S1.U1.ST1.P1',
              'Syarat Kecocokan Kebutuhan Ganda',
              'Double Coincidence of Wants',
              'Mengidentifikasi syarat double coincidence of wants dalam sistem barter.',
              [
                {
                  id: 's1u1s1p1_q1',
                  promptId:
                    'Pak Budi panen 10 karung beras dan ingin menukarnya dengan sepatu kerja, tetapi pembuat sepatu hanya mau menukar sepatunya dengan ikan segar. Mengapa transaksi gagal?',
                  promptEn: 'Mr. Budi has rice and wants shoes, while the shoemaker only wants fresh fish. Why does barter fail?',
                  optionsId: [
                    'Kebutuhan kedua pihak tidak saling bertemu pada saat bersamaan',
                    'Takaran nilai tukar antara beras dan sepatu sulit disepakati',
                    'Keduanya tidak saling mengenal untuk membuat janji transaksi',
                    'Nilai sepatu kerja terlalu mudah menyusut selama perjalanan',
                  ],
                  optionsEn: [
                    'Both parties lack mutual simultaneous wants',
                    'Exact exchange ratio between rice and shoes is hard to agree',
                    'They do not know each other personally to meet up',
                    'Work shoes decay too rapidly during transport',
                  ],
                  correctIndex: 0,
                  explanationCard: card({
                    why: 'Sistem barter mensyaratkan double coincidence of wants: kedua belah pihak harus kebetulan saling menginginkan barang lawan pada waktu dan jumlah yang cocok.',
                    calc: 'Pak Budi butuh sepatu (punya beras) ≠ Pembuat sepatu butuh ikan (punya sepatu).',
                    assume: 'Pertukaran berlangsung langsung tanpa alat tukar perantara umum.',
                    next: 'Alat tukar umum menyederhanakan perdagangan agar setiap orang cukup menjual barangnya lalu membeli apa yang dibutuhkan.',
                    type: 'fixed_fact',
                  }),
                },
                {
                  id: 's1u1s1p1_q2',
                  promptId:
                    'Tanpa uang maupun kesepakatan utang, cara mana yang memungkinkan Pak Budi tetap mendapatkan sepatu hari ini lewat barter langsung?',
                  promptEn: 'Without money or credit IOU, how can Mr. Budi still get shoes today via direct barter?',
                  optionsId: [
                    'Menukar beras ke nelayan pemilik ikan dulu, lalu ikan ke pembuat sepatu',
                    'Menurunkan harga tawar beras menjadi setengah agar nelayan ikut membeli',
                    'Mengajak petani lain membawa lebih banyak beras untuk ditunjukkan bersama',
                    'Menunggu satu musim penuh sampai selera pembuat sepatu berubah sendiri',
                  ],
                  optionsEn: [
                    'Swap rice for fish with a fisherman first, then swap fish for shoes',
                    'Cut the rice offering price in half so the shoemaker buys it anyway',
                    'Bring more farmers carrying extra rice to persuade the shoemaker',
                    'Wait an entire harvest season hoping the shoemaker wants rice later',
                  ],
                  correctIndex: 0,
                  explanationCard: card({
                    why: 'Tanpa alat tukar umum, barter memaksa rantai pertukaran bertahap yang memakan waktu, tenaga, dan biaya pencarian tinggi.',
                    next: 'Menilai efisiensi biaya waktu transaksi membantu kita menghargai peran sistem pembayaran modern.',
                    type: 'fixed_fact',
                  }),
                },
                {
                  id: 's1u1s1p1_q3',
                  promptId:
                    'Kondisi manakah yang membuat transaksi barter tetap rentan gagal meski dua pihak sudah berniat bertukar?',
                  promptEn: 'When can barter still fail even with mutual interest?',
                  optionsId: [
                    'Barang mudah membusuk sebelum pihak penukar yang cocok ditemui',
                    'Kedua barang sudah memakai standar satuan berat yang seragam',
                    'Barang memiliki daya tahan tinggi sehingga awet disimpan lama',
                    'Penyerahan barang berlangsung langsung di lokasi panen yang sama',
                  ],
                  optionsEn: [
                    'Perishable goods rot before a matching counterparty is found',
                    'Both goods already share a uniform standard weight unit',
                    'Goods are highly durable and store value reliably over time',
                    'Goods are handed over directly at the exact same harvest site',
                  ],
                  correctIndex: 0,
                  explanationCard: card({
                    why: 'Selain kecocokan kebutuhan, barter terhambat daya tahan barang (durability) sehingga hasil panen cepat menyusut nilainya.',
                    next: 'Pahami sifat likuiditas dan keawetan aset sebelum menyimpan kekayaan jangka panjang.',
                    type: 'fixed_fact',
                  }),
                },
              ]
            ),
            mkQuizLesson(
              'S1.U1.ST1.P2',
              'Keawetan & Keterbagian Nilai',
              'Durability & Divisibility',
              'Memahami kendala keawetan & keterbagian (divisibility) pada barter.',
              [
                {
                  id: 's1u1s1p2_q1',
                  promptId:
                    'Seorang peternak memiliki 1 ekor sapi utuh dan hanya ingin menukar dengan 2 ikat bayam. Mengapa barter ini sangat sulit terjadi secara adil?',
                  promptEn: 'A farmer has 1 live cow and needs 2 bunches of spinach. Why is this barter difficult?',
                  optionsId: [
                    'Sapi tidak bisa dipecah seukuran 2 ikat bayam tanpa kehilangan nilai',
                    'Bayam memiliki nilai jual pasar yang lebih stabil dibanding ternak',
                    'Pertukaran lintas jenis pangan membutuhkan selisih jarak antar desa',
                    'Jumlah 2 ikat bayam terlalu kecil untuk diukur dengan timbangan',
                  ],
                  optionsEn: [
                    'A cow cannot be split to match 2 bunches of spinach without losing value',
                    'Spinach retains far more stable market value than livestock',
                    'Cross-category food swaps require traveling between distant towns',
                    'Two bunches of spinach are too small to quantify by weight',
                  ],
                  correctIndex: 0,
                  explanationCard: card({
                    why: 'Masalah divisibility (keterbagian): barang bernilai besar yang tak terpecah sulit ditukar dengan barang bernilai kecil.',
                    next: 'Uang modern hadir dalam berbagai pecahan kecil hingga besar agar pertukaran adil dan presisi.',
                    type: 'fixed_fact',
                  }),
                },
                {
                  id: 's1u1s1p2_q2',
                  promptId:
                    'Mengapa pedagang tomat segar kesulitan "menabung" hasil panennya selama 6 bulan bila belum ada uang?',
                  promptEn: 'Why is saving fresh tomatoes for 6 months without money ineffective?',
                  optionsId: [
                    'Nilai tomat jatuh mendekati nol karena cepat membusuk',
                    'Permintaan pasar terhadap tomat hilang tiap pergantian musim',
                    'Harga tomat selalu naik sepuluh kali lipat saat masa panen',
                    'Jumlah tomat sulit dihitung tanpa timbangan pasar standar',
                  ],
                  optionsEn: [
                    'Tomatoes rot quickly, destroying value near zero',
                    'Market demand for tomatoes vanishes every quarter',
                    'Tomato prices rise tenfold during harvest peaks',
                    'Tomato quantities are impossible to count without digital scales',
                  ],
                  correctIndex: 0,
                  explanationCard: card({
                    why: 'Alat penyimpan nilai yang baik harus tahan lama secara fisik dan nilainya diakui bersama.',
                    next: 'Pisahkan antara barang konsumsi jangka pendek dengan instrumen simpanan bernilai awet.',
                    type: 'fixed_fact',
                  }),
                },
              ]
            ),
            mkWordleLesson(
              'S1.U1.ST1.P3',
              'Kosakata Dasar Pertukaran',
              'Exchange Vocabulary',
              'Menguasai istilah kunci pertukaran (3–9 huruf).',
              [
                {
                  word: 'BARTER',
                  clueId: 'Sistem tukar-menukar barang langsung tanpa memakai uang.',
                  clueEn: 'Direct exchange of goods without using money.',
                  definitionId: 'Pertukaran barang atau jasa secara langsung tanpa alat tukar perantara berupa uang.',
                  definitionEn: 'Direct swap of goods or services without money as an intermediary.',
                  exampleId: 'Nelayan di pasar tradisional kuno menukar 2 ekor ikan dengan 1 kantong beras petani.',
                  exampleEn: 'Swapping fish directly for rice bags in a traditional village market.',
                },
                {
                  word: 'NILAI',
                  clueId: 'Ukuran manfaat atau harga sesuatu saat dipertukarkan.',
                  clueEn: 'Measure of worth or price when exchanged.',
                  definitionId: 'Ukuran manfaat atau bobot ekonomi suatu barang atau jasa yang diakui dalam pertukaran.',
                  definitionEn: 'Economic worth assigned to goods or services in exchange.',
                  exampleId: 'Satu porsi bakso memiliki nilai tukar Rp15.000 di kantin sekolah.',
                  exampleEn: 'A bowl of noodles carries a price value of Rp15,000.',
                },
                {
                  word: 'TUKAR',
                  clueId: 'Aktivitas menyerahkan suatu benda untuk memperoleh benda atau jasa lain.',
                  clueEn: 'Act of handing over something to obtain another good or service.',
                  definitionId: 'Proses penyerahan barang, jasa, atau uang dari satu pihak ke pihak lain dengan kesepakatan.',
                  definitionEn: 'Mutual handover of goods, services, or money under agreement.',
                  exampleId: 'Kamu menukar selembar Rp20.000 di kasir dengan satu botol air mineral dan kembalian.',
                  exampleEn: 'Handing a Rp20,000 bill for bottled water and change.',
                },
              ]
            ),
            mkPairLesson(
              'S1.U1.ST1.P4',
              'Evaluasi Kendala Barter → Solusi Uang',
              'Barter Hurdles to Money Solutions',
              'Menghubungkan 4 kendala barter dengan solusi alat tukar.',
              {
                mode: 'pairs',
                instructionId: 'Pasangkan kendala sistem barter di sebelah kiri dengan solusi yang lahir melalui uang di sebelah kanan.',
                instructionEn: 'Match each barter limitation with the solution provided by money.',
                pairs: [
                  {
                    id: 'p1',
                    leftId: 'Kebutuhan kedua pihak tidak saling cocok',
                    leftEn: 'No double coincidence of wants',
                    rightId: 'Alat tukar universal yang diterima semua orang',
                    rightEn: 'Universal medium of exchange',
                  },
                  {
                    id: 'p2',
                    leftId: 'Hewan ternak sulit dipecah menjadi porsi kecil',
                    leftEn: 'Livestock cannot be split easily',
                    rightId: 'Pecahan nominal kecil hingga besar yang seragam',
                    rightEn: 'Divisible standardized denominations',
                  },
                  {
                    id: 'p3',
                    leftId: 'Hasil panen sayur cepat membusuk jika disimpan lama',
                    leftEn: 'Fresh produce spoils over time',
                    rightId: 'Benda tahan lama sebagai penyimpan nilai',
                    rightEn: 'Durable store of value',
                  },
                  {
                    id: 'p4',
                    leftId: 'Bingung menentukan perbandingan harga antarratusan barang',
                    leftEn: 'Hard to compare prices across many goods',
                    rightId: 'Satuan hitung standar bersama (mis. Rupiah)',
                    rightEn: 'Common unit of account',
                  },
                ],
                explanationCard: card({
                  why: 'Uang muncul menjawab keempat masalah utama barter sekaligus: alat tukar umum, pecahan terbagi, keawetan penyimpan nilai, dan satuan hitung standar.',
                  next: 'Saat menilai alat pembayaran baru, pastikan fungsi-fungsi dasar ini tetap terpenuhi dengan aman.',
                }),
              },
              { isBoss: false }
            ),
          ],
        },
        {
          id: 'S1.U1.ST2',
          stageNumber: '1.2',
          titleId: 'Uang Komoditas, Logam & Uang Fiat Modern',
          titleEn: 'Commodity, Metal & Modern Fiat Money',
          skipExamId: 'SKIP.S1.U1.ST2',
          paths: [
            mkPairLesson(
              'S1.U1.ST2.P1',
              'Gambaran Umum Perkembangan Alat Tukar',
              'General Evolution of Exchange Tools',
              'Memahami gambaran umum fase evolusi alat tukar (bukan urutan linear tunggal di setiap masyarakat).',
              {
                mode: 'sequence',
                instructionId:
                  'Urutkan gambaran umum perkembangan alat tukar dari masa awal ke era modern (perlu diingat bahwa urutan ini gambaran umum makroekonomi, bukan urutan persis di setiap budaya).',
                instructionEn: 'Order the general macroeconomic evolution of exchange instruments.',
                sequenceSteps: [
                  { id: 'seq1', labelId: 'Barter Langsung (tukar barang dengan barang)', labelEn: 'Direct Barter', order: 1 },
                  { id: 'seq2', labelId: 'Uang Barang / Komoditas (garam, kerang, teh, ternak)', labelEn: 'Commodity Money', order: 2 },
                  { id: 'seq3', labelId: 'Uang Logam Mulia (koin emas & perak terstandar)', labelEn: 'Precious Metal Coins', order: 3 },
                  { id: 'seq4', labelId: 'Uang Kertas (berbasis jaminan komoditas → uang fiat modern)', labelEn: 'Paper Currency (Backed → Fiat)', order: 4 },
                  { id: 'seq5', labelId: 'Instrumen Pembayaran Elektronik & Digital Modern', labelEn: 'Electronic & Digital Payment Instruments', order: 5 },
                ],
                explanationCard: card({
                  why: 'Secara umum alat tukar bergerak dari benda berwujud bernilai guna sendiri menjadi representasi nilai yang dijamin hukum negara dan dicatat secara elektronik.',
                  assume: 'Disajikan sebagai gambaran makro umum; beberapa masyarakat historis tidak melalui seluruh fase dalam urutan identik.',
                  next: 'Kepercayaan dan regulasi negara menjadi penopang utama efisiensi uang modern.',
                }),
              }
            ),
            mkQuizLesson(
              'S1.U1.ST2.P2',
              'Syarat Uang & Hakikat Uang Fiat',
              'Money Qualities & Modern Fiat',
              'Memahami syarat uang ideal, beda uang kertas berbasis jaminan emas dulu vs Uang Fiat Modern.',
              [
                {
                  id: 's1u1s2p2_q1',
                  promptId:
                    'Mengapa lembaran uang kertas Rp100.000 tetap bernilai Rp100.000 di toko meski biaya cetak kertasnya jauh di bawah nominal tersebut dan kini tidak dapat ditukar paksa ke emas fisik?',
                  promptEn: 'Why does a Rp100,000 note hold value despite low printing cost and no gold convertibility?',
                  optionsId: [
                    'Karena berstatus alat bayar sah menurut hukum dan kepercayaan publik',
                    'Karena setiap lembarnya memiliki cadangan emas setara nominal itu',
                    'Karena bank umum wajib menukar kertas rupiah dengan logam mulia',
                    'Karena biaya bahan pencetakan kertas keamanannya setara nilai nominal',
                  ],
                  optionsEn: [
                    'Because legal tender laws and public trust establish its value',
                    'Because each note is backed by Rp100,000 of stored physical gold',
                    'Because commercial banks convert bills to gold on teller demand',
                    'Because security paper and printing materials cost near Rp100,000',
                  ],
                  correctIndex: 0,
                  explanationCard: card({
                    why: 'Berbeda dari uang kertas masa lalu yang dijamin penuh komoditas (seperti standar emas), uang fiat modern bernilai karena status hukum (legal tender) dan kredibilitas Bank Sentral menjaga stabilitas nilainya.',
                    next: 'Periksa selalu ciri keaslian Rupiah dan patuhi otoritas resmi Bank Indonesia.',
                  }),
                },
                {
                  id: 's1u1s2p2_q2',
                  promptId: 'Apa syarat utama agar masyarakat tidak kehilangan kepercayaan terhadap uang fiat sebuah negara?',
                  promptEn: 'What preserves public trust in a fiat currency?',
                  optionsId: [
                    'Jumlah uang beredar dikendalikan Bank Sentral agar inflasi tetap stabil',
                    'Mencetak uang lebih banyak saat harga pangan naik agar daya beli tumbuh',
                    'Mengunci kurs valuta asing agar tidak berubah dari tahun ke tahun',
                    'Menarik semua pecahan kecil agar masyarakat hanya memakai uang besar',
                  ],
                  optionsEn: [
                    'Disciplined money supply management by the Central Bank to keep inflation stable',
                    'Printing extra money whenever food prices rise to lift purchasing power',
                    'Freezing foreign exchange rates permanently across all years',
                    'Withdrawing all small denominations so people only hold large notes',
                  ],
                  correctIndex: 0,
                  explanationCard: card({
                    why: 'Pencetakan uang berlebihan tanpa diimbangi pertumbuhan barang/jasa memicu hiperinflasi yang menghancurkan daya beli dan kepercayaan masyarakat.',
                    next: 'Pahami hubungan antara jumlah uang beredar, BI-Rate, dan inflasi harga barang.',
                  }),
                },
              ]
            ),
            mkKokiLesson(
              'S1.U1.ST2.P3',
              'Sortir Syarat Alat Tukar Ideal',
              'Sort Money Requirements',
              'Memilah benda berdasarkan syarat alat tukar modern.',
              {
                instructionId: 'Pilah benda atau media berikut ke kelompok Cocok vs Tidak Cocok dijadikan alat tukar modern.',
                instructionEn: 'Sort each item into Suitable or Unsuitable as modern money.',
                buckets: [
                  { id: 'COCOK', labelId: 'COCOK (Syarat Terpenuhi)', labelEn: 'SUITABLE', icon: '🪙' },
                  { id: 'TIDAK_COCOK', labelId: 'TIDAK COCOK (Gagal Syarat)', labelEn: 'UNSUITABLE', icon: '🚫' },
                ],
                items: [
                  {
                    id: 'k1',
                    contextTagId: 'Alat bayar resmi',
                    labelId: 'Koin logam standar terbitan bank sentral',
                    labelEn: 'Standard central bank metal coin',
                    correctBucketId: 'COCOK',
                    explanationCard: card({ why: 'Tahan lama, mudah dibawa, seragam, dan diakui sah secara hukum.', next: 'Gunakan uang logam dengan bijak dan jangan ditimbun hingga kelangkaan receh.' }),
                  },
                  {
                    id: 'k2',
                    contextTagId: 'Sistem pembayaran resmi',
                    labelId: 'Saldo rekening tercatat di bank berizin resmi',
                    labelEn: 'Licensed bank account balance',
                    correctBucketId: 'COCOK',
                    explanationCard: card({ why: 'Tercatat presisi hingga satuan terkecil, mudah dipindahkan, dan diawasi otoritas.', next: 'Catat saldo & mutasi rekening secara rutin.' }),
                  },
                  {
                    id: 'k3',
                    contextTagId: 'Benda fisik alam',
                    labelId: 'Es batu di suhu ruang terbuka',
                    labelEn: 'Ice block at room temperature',
                    correctBucketId: 'TIDAK_COCOK',
                    explanationCard: card({ why: 'Gagal syarat daya tahan (durability) karena mencair dan hilang sebelum disimpan.', next: 'Alat tukar harus awet secara fisik maupun catatan.' }),
                  },
                  {
                    id: 'k4',
                    contextTagId: 'Benda fisik berat',
                    labelId: 'Batu besar 50 kg untuk bayar belanja harian',
                    labelEn: '50kg boulder for groceries',
                    correctBucketId: 'TIDAK_COCOK',
                    explanationCard: card({ why: 'Gagal syarat portabilitas (mudah dibawa) dan keterbagian nilai.', next: 'Efisiensi transaksi membutuhkan instrumen ringan dan terstandar.' }),
                  },
                  {
                    id: 'k5',
                    contextTagId: 'Sumber daya melimpah',
                    labelId: 'Daun kering gugur di halaman umum',
                    labelEn: 'Dry fallen leaves in public yard',
                    correctBucketId: 'TIDAK_COCOK',
                    explanationCard: card({ why: 'Gagal syarat kelangkaan (scarcity): siapa pun bisa memungut tanpa batas sehingga nilainya nol.', next: 'Kelangkaan terkendali menjaga nilai alat tukar tetap dipercaya.' }),
                  },
                  {
                    id: 'k6',
                    contextTagId: 'Hasil bumi cepat rusak',
                    labelId: 'Tomat matang segar tanpa pengawet',
                    labelEn: 'Fresh ripe tomatoes',
                    correctBucketId: 'TIDAK_COCOK',
                    explanationCard: card({ why: 'Cepat membusuk dan kualitasnya tidak seragam antarbuah.', next: 'Pisahkan komoditas konsumsi dari media penyimpan nilai.' }),
                  },
                ],
              }
            ),
          ],
        },
        {
          id: 'S1.U1.ST3',
          stageNumber: '1.3',
          titleId: '3 Fungsi Utama Uang',
          titleEn: '3 Core Functions of Money',
          skipExamId: 'SKIP.S1.U1.ST3',
          paths: [
            mkPairLesson(
              'S1.U1.ST3.P1',
              'Membedakan 3 Fungsi Uang dalam Praktik',
              '3 Functions of Money in Action',
              'Membedakan alat tukar, satuan hitung, & penyimpan nilai.',
              {
                mode: 'pairs',
                instructionId: 'Pasangkan peristiwa sehari-hari berikut dengan fungsi uang yang paling tepat.',
                instructionEn: 'Match each daily situation with the matching function of money.',
                pairs: [
                  {
                    id: 'f1',
                    leftId: 'Membayar Rp15.000 di kantin untuk semangkuk bakso',
                    leftEn: 'Paying Rp15,000 for noodles at a canteen',
                    rightId: 'Alat Tukar (Medium of Exchange)',
                    rightEn: 'Medium of Exchange',
                  },
                  {
                    id: 'f2',
                    leftId: 'Label sepatu Rp250.000 & tas Rp125.000 sehingga langsung tahu tas setengah harga sepatu',
                    leftEn: 'Price tags show bag is half the price of shoes',
                    rightId: 'Satuan Hitung (Unit of Account)',
                    rightEn: 'Unit of Account',
                  },
                  {
                    id: 'f3',
                    leftId: 'Menyimpan uang hasil kerja hari ini di bank untuk dipakai biaya sekolah 4 bulan depan (walau daya beli tetap dipengaruhi inflasi)',
                    leftEn: 'Saving earnings today for tuition 4 months ahead',
                    rightId: 'Penyimpan Nilai (Store of Value)',
                    rightEn: 'Store of Value',
                  },
                ],
                explanationCard: card({
                  why: 'Uang menyederhanakan transaksi (Alat Tukar), membandingkan nilai antarbarang (Satuan Hitung), dan memindahkan daya belanja lintas waktu (Penyimpan Nilai, walau dalam jangka panjang tetap terpengaruh inflasi).',
                  next: 'Gunakan fungsi satuan hitung untuk membandingkan harga secara rasional sebelum membeli.',
                }),
              }
            ),
            mkWordleLesson(
              'S1.U1.ST3.P2',
              'Istilah Sejarah & Fungsi Uang',
              'Money History Terms',
              'Menguasai kosakata fiat, komoditas, satuan, & uang.',
              [
                {
                  word: 'FIAT',
                  clueId: 'Uang sah terbitan negara yang nilainya ditopang hukum & kepercayaan publik.',
                  clueEn: 'Legal tender currency backed by state law and public trust.',
                  definitionId: 'Mata uang resmi negara tanpa sandaran fisik emas yang nilainya sah berdasarkan undang-undang.',
                  definitionEn: 'Government-issued currency not backed by physical commodities.',
                  exampleId: 'Uang kertas Rupiah yang sah digunakan di seluruh wilayah NKRI.',
                  exampleEn: 'Indonesian Rupiah banknotes accepted nationwide.',
                },
                {
                  word: 'KOMODITAS',
                  clueId: 'Barang berwujud seperti garam, emas, atau hewan ternak yang dulu dipakai sebagai uang barang.',
                  clueEn: 'Tangible goods historically used as commodity money.',
                  definitionId: 'Benda bernilai intrinsik yang dapat digunakan baik sebagai barang guna maupun alat tukar tradisional.',
                  definitionEn: 'Tangible goods with intrinsic utility used as early money.',
                  exampleId: 'Koin emas dan garam di jalur perdagangan kuno.',
                  exampleEn: 'Gold coins and salt in ancient trade routes.',
                },
                {
                  word: 'SATUAN',
                  clueId: 'Fungsi uang sebagai ukuran standar pembanding harga berbagai barang.',
                  clueEn: 'Standard measuring unit for comparing prices.',
                  definitionId: 'Ukuran baku (seperti Rupiah) untuk menyatakan harga dan kekayaan secara konsisten.',
                  definitionEn: 'Standard unit used to quote prices and record balances.',
                  exampleId: 'Mengetahui harga beras Rp15.000/kg dan gula Rp17.000/kg dalam satu satuan hitung yang sama.',
                  exampleEn: 'Comparing prices of rice and sugar in the same currency unit.',
                },
                {
                  word: 'UANG',
                  clueId: 'Alat tukar, satuan hitung, dan penyimpan nilai yang diterima sah oleh masyarakat.',
                  clueEn: 'Widely accepted medium of exchange, unit of account, and store of value.',
                  definitionId: 'Instrumen pembayaran yang diakui sah untuk transaksi jual beli dan penyelesaian kewajiban.',
                  definitionEn: 'Legally recognized instrument for trade and obligations.',
                  exampleId: 'Uang tunai Rupiah maupun saldo rekening pembayaran yang sah.',
                  exampleEn: 'Rupiah cash or valid bank payment balances.',
                },
              ]
            ),
            mkStoryLesson(
              'S1.U1.ST3.P3',
              'Pedagang Desa ke Kota Modern',
              'Village to Modern Market',
              'Mengambil keputusan alat tukar & penyimpan nilai terbaik dalam 3 babak.',
              {
                titleId: 'Pedagang Desa ke Kota Modern',
                subtitleId: 'Simulasi 3 Babak Pilihan Alat Tukar & Penyimpan Nilai',
                durationLabelId: '3 Babak Simulasi',
                initialState: { cash: 500_000, emergencyFund: 0, sinkingFund: 0, debt: 0, netWorth: 500_000 },
                chapters: [
                  {
                    id: 'u1_b1',
                    periodLabelId: 'Babak 1: Pasar Barter Desa',
                    narrativeId:
                      'Kamu membawa 2 karung jagung ke pasar kuno dan butuh garam dapur. Penjual garam hanya ingin minyak goreng, sedangkan pengrajin minyak mau membeli jagungmu!',
                    choices: [
                      {
                        id: 'c1',
                        labelId: 'Tukar jagung dengan minyak dulu ke pengrajin minyak, lalu tukar minyak menjadi garam',
                        feedbackId: 'Cerdik! Mengatasi kendala double coincidence of wants walau butuh 2 tahap.',
                        deltas: { scoreCashflow: 20, scoreGoal: 20 },
                        isRecommended: true,
                      },
                      {
                        id: 'c2',
                        labelId: 'Pulang saja dan biarkan 2 karung jagung tersimpan lembap 6 bulan tanpa ditukar',
                        feedbackId: 'Berisiko rugi besar! Jagung lembap cepat rusak dan gagal menjadi penyimpan nilai jangka panjang.',
                        deltas: { netWorth: -200_000, scoreCashflow: -15 },
                      },
                    ],
                  },
                  {
                    id: 'u1_b2',
                    periodLabelId: 'Babak 2: Masa Transisi Menyimpan Nilai',
                    narrativeId:
                      'Hasil daganganmu cukup besar dan ingin kamu simpan untuk persiapan panen 6 bulan ke depan agar nilainya terjaga.',
                    choices: [
                      {
                        id: 'c1',
                        labelId: 'Ubah menjadi koin logam mulia terstandar / uang sah yang tahan lama dan diakui luas',
                        feedbackId: 'Tepat! Tahan lama, tidak membusuk, dan diterima kembali saat butuh belanja nanti.',
                        deltas: { cash: 300_000, netWorth: 300_000, scoreRisk: 20, scoreGoal: 20 },
                        isRecommended: true,
                      },
                      {
                        id: 'c2',
                        labelId: 'Simpan dalam bentuk 5 keranjang buah segar selama 6 bulan',
                        feedbackId: 'Buah segar cepat membusuk dalam hitungan hari sehingga nilai tabunganmu jatuh ke nol!',
                        deltas: { netWorth: -300_000, scoreRisk: -20 },
                      },
                    ],
                  },
                  {
                    id: 'u1_b3',
                    periodLabelId: 'Babak 3: Pasar Modern Bersatuan Hitung Rupiah',
                    narrativeId:
                      'Kini di kota modern, Toko A menjual paket alat tani Rp240.000 (untuk 2 set), sedangkan Toko B menjual Rp135.000 per set. Bagaimana memanfaatkan fungsi satuan hitung?',
                    choices: [
                      {
                        id: 'c1',
                        labelId: 'Hitung harga per set terlebih dahulu (Rp120.000 vs Rp135.000), lalu beli sesuai kebutuhan riil di Toko A',
                        feedbackId: 'Tepat! Fungsi satuan hitung membuat perbandingan nilai antartoko jernih dan hemat Rp15.000 per set.',
                        deltas: { cash: 15_000, scoreCashflow: 25, scoreGoal: 20 },
                        isRecommended: true,
                      },
                      {
                        id: 'c2',
                        labelId: 'Beli acak tanpa membandingkan harga satuan karena terlihat sama',
                        feedbackId: 'Membeli tanpa membandingkan satuan hitung berisiko membayar lebih mahal untuk barang yang persis sama.',
                        deltas: { cash: -15_000, scoreGoal: -10 },
                      },
                    ],
                  },
                ],
                explanationCard: card({
                  why: 'Memahami kendala barter dan 3 fungsi uang membantu memilih alat pembayaran yang sah, membandingkan harga secara presisi, dan menjaga nilai simpanan.',
                  next: 'Di kehidupan nyata modern, cek selalu satuan harga per barang dan lindungi uangmu di wadah yang aman.',
                  type: 'simulation_assumption',
                }),
              }
            ),
          ],
        },
      ],
    },

    // ================= UNIT 2 =================
    {
      id: 'S1.U2',
      unitNumber: 2,
      semesterId: 'S1',
      titleId: 'Mengenal Rupiah, Bank Indonesia, Peruri & Keaslian 3D',
      titleEn: 'Rupiah, Bank Indonesia, Peruri & 3D Authenticity',
      regulationMeta: REG_SOURCES.UU_MATA_UANG,
      guidebook: {
        summaryId:
          'Bank Indonesia (BI) memegang kewenangan tunggal merencanakan, mengeluarkan, mengedarkan, mencabut, dan memusnahkan Rupiah (UU No. 7/2011). Perum Peruri adalah BUMN pencetak fisik Rupiah atas mandat BI. Uang kertas & logam adalah Uang Kartal, sedangkan Instrumen Non-Tunai mencakup Uang Giral bank umum (rekening/cek) dan Uang Elektronik chip/server (aturan float BI, non-LPS).',
        summaryEn: 'BI issues Rupiah, Peruri prints it. Distinguishing Cash (Kartal) from Non-Cash (Giral vs E-Money) and inspecting 3D.',
        keyRulesId: [
          'Ciri keaslian 3D (Dilihat, Diraba, Diterawang) berbeda per pecahan & tahun emisi, aculah spesimen resmi BI.',
          'Uang rusak/sobek ≠ uang palsu. BI mengganti penuh uang kertas rusak jika ukuran > 2/3 ukuran asli, ciri keaslian dikenali, & kesatuan atau kedua nomor seri lengkap dan sama.',
          'Rawat Rupiah dengan 5 Jangan: Jangan Dilipat, Dicoret, Distaples, Diremas, Dibasahi.',
        ],
        keyRulesEn: [
          '3D features vary by denomination and issue series.',
          'Damaged genuine bills > 2/3 original size with recognizable features & valid serial numbers can be exchanged at BI via PINTAR BI.',
          'Follow 5 Nevers: do not fold, scribble, staple, crumple, or wet Rupiah bills.',
        ],
        disclaimerId:
          'Referensi Regulasi Baseline: UU No. 7 Tahun 2011 tentang Mata Uang & ketentuan pengelolaan uang Rupiah Bank Indonesia.',
        disclaimerEn: 'Regulatory Reference: Currency Law No. 7/2011 and Bank Indonesia rules.',
      },
      stages: [
        {
          id: 'S1.U2.ST1',
          stageNumber: '2.1',
          titleId: 'Otoritas Rupiah BI vs Peruri & Kartal vs Non-Tunai',
          titleEn: 'Rupiah Authorities & Cash vs Non-Cash',
          skipExamId: 'SKIP.S1.U2.ST1',
          paths: [
            mkQuizLesson(
              'S1.U2.ST1.P1',
              'Peran BI, Peruri & Bank Umum',
              'BI vs Peruri vs Commercial Banks',
              'Membedakan tugas Bank Indonesia, Perum Peruri, dan Bank Umum.',
              [
                {
                  id: 's1u2s1p1_q1',
                  promptId:
                    'Lembaga manakah yang berwenang mengatur kebijakan moneter, mengeluarkan, mengedarkan, dan memusnahkan Rupiah sebagai satu-satunya mata uang sah di Indonesia?',
                  promptEn: 'Which institution is solely authorized to issue and circulate Rupiah?',
                  optionsId: ['Bank Indonesia (BI)', 'Perum Peruri', 'Bank Umum Swasta', 'Kementerian Perdagangan'],
                  optionsEn: ['Bank Indonesia (BI)', 'Perum Peruri', 'Commercial Banks', 'Ministry of Trade'],
                  correctIndex: 0,
                  explanationCard: card({
                    why: 'Berdasarkan UU No. 7 Tahun 2011, Bank Indonesia adalah bank sentral pemegang wewenang perencanaan, pengeluaran, pengedaran, hingga pemusnahan Rupiah.',
                    type: 'dynamic_fact',
                    reg: REG_SOURCES.UU_MATA_UANG,
                    next: 'Selalu rujuk informasi resmi mata uang ke kanal bi.go.id atau PINTAR BI.',
                  }),
                },
                {
                  id: 's1u2s1p1_q2',
                  promptId: 'Apa peran spesifik Perum Peruri dalam siklus uang Rupiah?',
                  promptEn: 'What is Perum Peruri’s specific role regarding Rupiah?',
                  optionsId: [
                    'BUMN pencetak fisik uang Rupiah berdasarkan pesanan resmi Bank Indonesia',
                    'Otoritas tunggal penetap suku bunga acuan BI-Rate setiap rapat bulanan',
                    'Lembaga penjamin simpanan rekening tabungan nasabah hingga Rp2 miliar',
                    'Bank komersial penyedia rekening giro dan layanan tabungan ritel harian',
                  ],
                  optionsEn: [
                    'State enterprise printing physical Rupiah notes/coins under BI mandate',
                    'Sole monetary authority setting monthly BI-Rate policy interest targets',
                    'Deposit insurance body guaranteeing bank balances up to Rp2 billion',
                    'Commercial bank serving checking accounts and daily retail savings',
                  ],
                  correctIndex: 0,
                  explanationCard: card({
                    why: 'BI adalah otoritas pemesan dan pengedar, sedangkan Perum Peruri bertugas mencetak fisik uang atas mandat BI.',
                    type: 'dynamic_fact',
                    reg: REG_SOURCES.UU_MATA_UANG,
                    next: 'Jangan tertukar antara penerbit (BI), pencetak fisik (Peruri), dan layanan tabungan ritel (Bank Umum/BPR).',
                  }),
                },
                {
                  id: 's1u2s1p1_q3',
                  promptId:
                    'Mengapa masyarakat dilarang membuat tiruan Rupiah tanpa izin BI untuk diedarkan atau digunakan dalam bentuk yang berpotensi membingungkan publik sebagai alat bayar sah?',
                  promptEn: 'Why is unauthorized reproduction resembling legal tender Rupiah prohibited?',
                  optionsId: [
                    'Melanggar UU Mata Uang karena berisiko menyesatkan publik atas uang sah',
                    'Karena semua gambar Rupiah di buku ajar sekolah ikut dilarang total',
                    'Karena perusahaan percetakan komersial akan mengambil alih kasir bank',
                    'Karena ketebalan kertas tiruan hanya berpotensi merusak mesin ATM bank',
                  ],
                  optionsEn: [
                    'Violates Currency Law and risks misleading the public as legal tender',
                    'Because even educational book illustrations of Rupiah are banned',
                    'Because commercial printers would take over retail bank teller roles',
                    'Because fake paper thickness solely causes mechanical ATM jams',
                  ],
                  correctIndex: 0,
                  explanationCard: card({
                    why: 'UU Mata Uang melarang pemalsuan maupun peniruan Rupiah yang dapat disalahartikan sebagai alat bayar sah. Ilustrasi edukasi atau spesimen tunduk pada pedoman ukuran/penandaan BI agar tidak menimbulkan kekeliruan.',
                    type: 'dynamic_fact',
                    reg: REG_SOURCES.UU_MATA_UANG,
                    next: 'Bedakan materi ilustrasi edukasi berpenanda jelas dari pemalsuan fisik.',
                  }),
                },
              ],
              { st: 'dynamic_fact', reg: REG_SOURCES.UU_MATA_UANG }
            ),
            mkKokiLesson(
              'S1.U2.ST1.P2',
              'Sortir Kartal vs Non-Tunai (Giral & Uang Elektronik)',
              'Sort Cash vs Non-Cash Instruments',
              'Memilah uang tunai (Kartal) vs instrumen non-tunai disertai pembedaan simpanan bank vs uang elektronik.',
              {
                instructionId:
                  'Sortir alat bayar berikut antara Uang Tunai (Kartal) dan Instrumen Pembayaran Non-Tunai (bedakan rekening bank giral vs uang elektronik non-LPS di pembahasan!).',
                instructionEn: 'Sort instruments between Cash (Kartal) and Non-Cash (Bank/Check/E-Money).',
                buckets: [
                  { id: 'KARTAL', labelId: 'UANG TUNAI / KARTAL (Fisik)', labelEn: 'CASH / KARTAL', icon: '💵' },
                  { id: 'NON_TUNAI', labelId: 'INSTRUMEN NON-TUNAI', labelEn: 'NON-CASH INSTRUMENTS', icon: '💳' },
                ],
                items: [
                  {
                    id: 'u2_1',
                    contextTagId: 'Uang fisik di dompet',
                    labelId: 'Uang kertas pecahan Rp50.000 emisi terbaru',
                    labelEn: 'Rp50,000 physical banknote',
                    correctBucketId: 'KARTAL',
                    explanationCard: card({ why: 'Uang kertas dan logam beredar adalah Uang Kartal terbitan resmi Bank Indonesia.', next: 'Rawat uang kartal dengan prinsip 5 Jangan.' }),
                  },
                  {
                    id: 'u2_2',
                    contextTagId: 'Uang receh fisik',
                    labelId: 'Uang koin logam Rp1.000 di saku',
                    labelEn: 'Rp1,000 metal coin',
                    correctBucketId: 'KARTAL',
                    explanationCard: card({ why: 'Logam pecahan adalah bentuk sah Uang Kartal untuk transaksi tunai.', next: 'Gunakan koin untuk transaksi pas tanpa membuangnya.' }),
                  },
                  {
                    id: 'u2_3',
                    contextTagId: 'Simpanan bank umum',
                    labelId: 'Saldo di rekening tabungan / giro bank umum (Giral / Simpanan Bank)',
                    labelEn: 'Commercial bank account balance',
                    correctBucketId: 'NON_TUNAI',
                    explanationCard: card({ why: 'Saldo rekening bank adalah alat bayar non-tunai berbasis simpanan bank (Giral) yang memenuhi cakupan penjaminan LPS jika sesuai 3T.', next: 'Bedakan status simpanan bank dengan dompet digital!' }),
                  },
                  {
                    id: 'u2_4',
                    contextTagId: 'Warkat pembayaran',
                    labelId: 'Cek dan Bilyet Giro resmi bank umum (Giral)',
                    labelEn: 'Check & Giro slip',
                    correctBucketId: 'NON_TUNAI',
                    explanationCard: card({ why: 'Cek/Bilyet Giro adalah surat perintah pemindahbukuan/pencairan dana rekening bank (Uang Giral).', next: 'Hanya terima cek/giro dari pihak terpercaya dan pastikan kliring berhasil.' }),
                  },
                  {
                    id: 'u2_5',
                    contextTagId: 'Uang elektronik chip-based',
                    labelId: 'Saldo kartu e-money fisik untuk gerbang tol (Uang Elektronik Chip)',
                    labelEn: 'Chip-based e-money toll card balance',
                    correctBucketId: 'NON_TUNAI',
                    explanationCard: card({ why: 'Kartu e-money tol menyimpan nilai uang elektronik berbasis chip (bukan simpanan bank yang dijamin LPS; diatur ketentuan float fund BI).', next: 'Isi secukupnya sesuai kebutuhan mobilitas karena risiko kartu hilang.' }),
                  },
                  {
                    id: 'u2_6',
                    contextTagId: 'Uang elektronik server-based',
                    labelId: 'Saldo aplikasi dompet digital / e-wallet resmi berizin BI',
                    labelEn: 'Server-based e-wallet balance',
                    correctBucketId: 'NON_TUNAI',
                    explanationCard: card({ why: 'Dompet digital termasuk Uang Elektronik server-based di bawah aturan BI, secara hukum berbeda dari rekening simpanan bank LPS.', next: 'Simpan dana jajan harian saja di e-wallet, bukan seluruh tabungan jangka panjang!' }),
                  },
                ],
              },
              { st: 'dynamic_fact', reg: REG_SOURCES.UU_MATA_UANG }
            ),
            mkWordleLesson(
              'S1.U2.ST1.P3',
              'Kosakata Otoritas & Jenis Uang',
              'Currency Terms',
              'Menguasai kosakata Rupiah, Kartal, Giral, dan Peruri.',
              [
                { word: 'RUPIAH', clueId: 'Mata uang resmi yang sah di seluruh wilayah Indonesia.', clueEn: 'Official Indonesian currency.', definitionId: 'Satu-satunya alat pembayaran sah di NKRI berdasarkan UU No. 7/2011.', definitionEn: 'Sole legal tender of Indonesia.', exampleId: 'Menampilkan harga barang wajib menggunakan satuan Rupiah.', exampleEn: 'Listing retail prices in IDR.' },
                { word: 'KARTAL', clueId: 'Uang fisik berupa kertas dan logam yang diedarkan Bank Indonesia.', clueEn: 'Physical notes and coins issued by BI.', definitionId: 'Uang tunai berbentuk lembaran kertas atau koin logam untuk pembayaran langsung.', definitionEn: 'Physical cash in circulation.', exampleId: 'Lembaran Rp100.000 dan koin Rp500 di dompetmu.', exampleEn: 'Banknotes and metal coins in your wallet.' },
                { word: 'GIRAL', clueId: 'Simpanan rekening bank yang dapat dipakai membayar dengan cek, giro, atau transfer.', clueEn: 'Bank deposit balances transferable via check or transfer.', definitionId: 'Alat bayar berbasis saldo simpanan bank umum seperti cek, bilyet giro, dan rekening.', definitionEn: 'Demand deposit funds usable without physical cash.', exampleId: 'Saldo di rekening bank umum yang dapat ditransfer lewat BI-FAST.', exampleEn: 'Bank balance transferable via BI-FAST.' },
                { word: 'PERURI', clueId: 'BUMN pencetak fisik uang kertas dan logam Rupiah atas mandat BI.', clueEn: 'State printer of physical Rupiah.', definitionId: 'Perusahaan Umum Percetakan Uang Republik Indonesia yang mencetak fisik Rupiah.', definitionEn: 'Indonesian state security printing corporation.', exampleId: 'Peruri mencetak uang baru sesuai jumlah yang dipesan Bank Indonesia.', exampleEn: 'Peruri executes BI currency printing orders.' },
              ]
            ),
          ],
        },
        {
          id: 'S1.U2.ST2',
          stageNumber: '2.2',
          titleId: 'Keaslian 3D & 5 Cara Merawat Rupiah',
          titleEn: '3D Authenticity & 5 Nevers Care',
          skipExamId: 'SKIP.S1.U2.ST2',
          paths: [
            mkPairLesson(
              'S1.U2.ST2.P1',
              'Ciri Pengaman 3D Rupiah',
              '3D Security Check',
              'Menguasai metode Dilihat, Diraba, Diterawang sesuai spesimen BI.',
              {
                mode: 'pairs',
                instructionId: 'Cocokkan metode cek 3D dengan unsur pengamannya (perlu diingat ciri detail bervariasi per pecahan & tahun emisi pada spesimen resmi BI).',
                instructionEn: 'Match each 3D check method with its security indicator.',
                pairs: [
                  { id: 'd1', leftId: 'Dilihat', leftEn: 'Look', rightId: 'Warna tinta berubah saat dimiringkan & benang pengaman tampak di permukaan (sesuai pecahan/seri)', rightEn: 'Color-shifting ink & security thread' },
                  { id: 'd2', leftId: 'Diraba', leftEn: 'Touch', rightId: 'Cetakan terasa kasar/timbul di angka nominal, gambar utama, & kode tunanetra (blind code)', rightEn: 'Tactile raised ink & blind code' },
                  { id: 'd3', leftId: 'Diterawang', leftEn: 'Hold to light', rightId: 'Tanda air (watermark) pahlawan & gambar saling isi (rectoverso BI) menyatu utuh', rightEn: 'Watermark & seamless rectoverso BI logo' },
                ],
                explanationCard: card({
                  why: 'Metode 3D adalah pemeriksaan berlapis untuk membedakan uang kertas asli dengan palsu.',
                  assume: 'Setiap pecahan dan tahun emisi memiliki detail desain 3D spesifik; rujuk selalu spesimen resmi BI di bi.go.id.',
                  next: 'Luangkan 2 detik mengecek uang pecahan besar saat menerima kembalian di tempat terang.',
                  type: 'dynamic_fact',
                  reg: REG_SOURCES.UU_MATA_UANG,
                }),
              }
            ),
            mkKokiLesson(
              'S1.U2.ST2.P2',
              'Sortir Perawatan Rupiah (5 Jangan)',
              'Sort 5 Nevers Currency Care',
              'Mempraktikkan 5 Jangan & membedakan uang rusak ≠ uang palsu.',
              {
                instructionId: 'Pilah perlakuan terhadap uang kertas ke kelompok Terawat vs Merusak / Perlu Tukar ke BI.',
                instructionEn: 'Sort money handling habits into Cared For vs Damaging / Needs BI Exchange.',
                buckets: [
                  { id: 'TERAWAT', labelId: 'TERAWAT (Layak Edar)', labelEn: 'WELL KEPT', icon: '✨' },
                  { id: 'MERUSAK', labelId: 'MERUSAK / PERLU TUKAR', labelEn: 'DAMAGING / EXCHANGE', icon: '⚠️' },
                ],
                items: [
                  { id: 'm1', contextTagId: 'Penyimpanan harian', labelId: 'Menyimpan uang rapi memanjang dalam dompet tanpa dilipat paksa', labelEn: 'Keeping bills flat in wallet', correctBucketId: 'TERAWAT', explanationCard: card({ why: 'Uang tidak tertekuk patah sehingga ciri keamanannya tetap jelas terbaca.', next: 'Gunakan dompet ukuran penuh agar uang tetap awet.' }) },
                  { id: 'm2', contextTagId: 'Pemberian hadiah', labelId: 'Mengemas gepokan uang mahar dengan klip kertas lembut tanpa menusuk kertas', labelEn: 'Bundling gently without staples', correctBucketId: 'TERAWAT', explanationCard: card({ why: 'Menghindari lubang bekas staples yang bisa menyobek uang saat dipakai.', next: 'Ganti staples besi dengan pita kertas atau selotip pengikat non-lem.' }) },
                  { id: 'm3', contextTagId: 'Kebiasaan buruk 1', labelId: 'Menyetaples tumpukan uang kertas untuk amplop hajatan', labelEn: 'Stapling banknotes together', correctBucketId: 'MERUSAK', explanationCard: card({ why: 'Staples melubangi dan menyobek serat uang (melanggar 5 Jangan: Jangan Distaples).', next: 'Selalu lepaskan klip/ikatan lembut tanpa menusuk uang.' }) },
                  { id: 'm4', contextTagId: 'Kebiasaan buruk 2', labelId: 'Menulis nomor telepon atau coretan bolpoin di pinggir uang Rp50.000', labelEn: 'Scribbling phone numbers on bills', correctBucketId: 'MERUSAK', explanationCard: card({ why: 'Coretan tinta mengotori uang dan menurunkan kelayakan edar (Jangan Dicoret).', next: 'Gunakan buku catatan atau catatan HP alih-alih menulis di uang.' }) },
                  { id: 'm5', contextTagId: 'Kelalaian rumah', labelId: 'Meremas uang di saku celana lalu masuk ke dalam mesin cuci', labelEn: 'Crumpling bills into laundry', correctBucketId: 'MERUSAK', explanationCard: card({ why: 'Remasan dan air deterjen merusak benang pengaman dan warna tinta (Jangan Diremas & Dibasahi).', next: 'Periksa saku pakaian sebelum mencuci.' }) },
                  { id: 'm6', contextTagId: 'Kondisi fisik sobek', labelId: 'Uang kertas asli tidak sengaja sobek parah, bukan uang palsu, cek syarat penukaran ke BI', labelEn: 'Accidentally torn genuine bill (not counterfeit)', correctBucketId: 'MERUSAK', explanationCard: card({ why: 'Uang asli yang rusak tidak sama dengan uang palsu! Uang asli rusak > 2/3 ukuran asli dan dikenali keasliannya tetap dapat ditukar di BI tanpa biaya.', next: 'Jangan dibuang jika tersisa > 2/3 bagian; pesan jadwal tukar via pintar.bi.go.id.' }) },
                ],
              }
            ),
            mkDetektifLesson(
              'S1.U2.ST2.P3',
              'Audit Penukaran Uang & Kembalian (> 2/3 Ukuran Asli)',
              'Inspect Money Exchange & Damaged Bills',
              'Menilai keabsahan penukaran uang rusak & kembalian berdasarkan fakta 3 tingkat.',
              [
                {
                  id: 'u2_dc1',
                  channel: 'Tawaran',
                  senderTitle: 'Layanan Resmi PINTAR Bank Indonesia (pintar.bi.go.id)',
                  documentLines: [
                    '• Kanal pemesanan online resmi Bank Indonesia (domain bi.go.id)',
                    '• Gratis biaya admin penukaran uang layak edar maupun uang rusak sesuai jadwal',
                    '• Verifikasi fisik uang dilakukan langsung oleh petugas BI',
                  ],
                  questionId: 'Bagaimana status penggunaan layanan penukaran ini?',
                  optionsId: [
                    { id: 'o1', labelId: 'AMAN: Kanal penukaran resmi Bank Indonesia tanpa biaya calo', verdict: 'AMAN' },
                    { id: 'o2', labelId: 'BAHAYA: Penipuan layanan pemerintah palsu', verdict: 'BAHAYA' },
                    { id: 'o3', labelId: 'WASPADA: Memotong nilai nominal 20%', verdict: 'WASPADA' },
                  ],
                  correctOptionId: 'o1',
                  evidenceLevel: 'fakta_terobservasi',
                  explanationCard: card({
                    why: 'Situs pintar.bi.go.id adalah portal resmi pemesanan layanan kas keliling dan penukaran uang rusak Bank Indonesia.',
                    type: 'dynamic_fact',
                    reg: REG_SOURCES.UU_MATA_UANG,
                    next: 'Selalu cek domain .bi.go.id sebelum melakukan pemesanan antrean penukaran.',
                  }),
                },
                {
                  id: 'u2_dc2',
                  channel: 'Tawaran',
                  senderTitle: 'Uang Sobek Sisa > 2/3 Ukuran Asli + Nomor Seri Lengkap',
                  documentLines: [
                    '• Uang kertas asli Rp100.000 terpotong pinggir karena tersangkut ritsleting',
                    '• Pengukuran fisik tersisa > 2/3 (lebih dari dua pertiga) ukuran asli',
                    '• Ciri 3D keaslian masih dikenali & merupakan satu kesatuan (atau 2 nomor seri lengkap sama)',
                  ],
                  questionId: 'Apakah uang rusak ini layak ditukar penuh Rp100.000 di Bank Indonesia?',
                  optionsId: [
                    { id: 'o1', labelId: 'AMAN: Memenuhi syarat resmi BI (> 2/3 ukuran asli & ciri keaslian dikenali)', verdict: 'AMAN' },
                    { id: 'o2', labelId: 'BAHAYA: Pasti ditolak karena syarat minimal harus 100% utuh', verdict: 'BAHAYA' },
                    { id: 'o3', labelId: 'WASPADA: Hanya diganti separuh harga karena nomor serinya cuma terlihat jelas', verdict: 'WASPADA' },
                  ],
                  correctOptionId: 'o1',
                  evidenceLevel: 'fakta_terobservasi',
                  explanationCard: card({
                    why: 'Sesuai aturan Bank Indonesia, penggantian penuh diberikan jika fisik uang rusak > 2/3 (lebih dari dua pertiga) ukuran asli, bukan ≥ 2/3! Ukuran ≤ 2/3 TIDAK diberikan penggantian.',
                    calc: 'Jika terpisah/terpotong dua bagian bukan satu kesatuan, wajib memiliki KEDUA nomor seri lengkap dan sama.',
                    type: 'dynamic_fact',
                    reg: REG_SOURCES.UU_MATA_UANG,
                    next: 'Simpan potongan uang secara hati-hati dan hindari menambal pakai selotip sembarangan sebelum dicek BI.',
                  }),
                },
                {
                  id: 'u2_dc3',
                  channel: 'Tawaran',
                  senderTitle: 'Uang Kembalian Malam Hari Licin & Gambar Terawang Tidak Menyatu',
                  documentLines: [
                    '• Diterima terburu-buru di kios gelap tanpa lampu memadai',
                    '• Kertas terasa licin datar saat diraba pada angka nominal',
                    '• Saat diarahkan ke lampu, gambar logo saling isi (rectoverso) tampak berantakan tidak menyatu',
                  ],
                  questionId: 'Apa status tindakan paling bijak terhadap lembar uang ini?',
                  optionsId: [
                    { id: 'o1', labelId: 'WASPADA / PERLU VERIFIKASI: Tolak sopan & minta ganti lembar lain atau cek 3D di tempat terang', verdict: 'WASPADA' },
                    { id: 'o2', labelId: 'AMAN: Langsung simpan di dompet agar cepat pulang', verdict: 'AMAN' },
                    { id: 'o3', labelId: 'AMAN: Uang licin pasti emisi baru anti-kotor', verdict: 'AMAN' },
                  ],
                  correctOptionId: 'o1',
                  evidenceLevel: 'perlu_verifikasi',
                  explanationCard: card({
                    why: 'Hilangnya tekstur rabaan dan cacat rectoverso merupakan sinyal kuat ketidaksesuaian ciri 3D; wajib diverifikasi ulang dengan spesimen terang atau ditolak secara sopan.',
                    type: 'dynamic_fact',
                    reg: REG_SOURCES.UU_MATA_UANG,
                    next: 'Biasakan memeriksa uang pecahan besar sebelum melangkah pergi dari kasir.',
                  }),
                },
              ],
              { st: 'dynamic_fact', reg: REG_SOURCES.UU_MATA_UANG }
            ),
          ],
        },
        {
          id: 'S1.U2.ST3',
          stageNumber: '2.3',
          titleId: 'Hitung Pecahan',
          titleEn: 'Denomination Math',
          skipExamId: 'SKIP.S1.U2.ST3',
          paths: [
            mkQuizLesson(
              'S1.U2.ST3.P1',
              'Hitung Kembalian & Pecahan Efisien',
              'Efficient Change Calculation',
              'Menghitung kembalian & kombinasi pecahan Rupiah paling tepat.',
              [
                {
                  id: 's1u2s3p1_q1',
                  promptId:
                    'Total belanjamu Rp37.500. Kamu membayar dengan selembar Rp50.000. Berapa kembalian yang seharusnya diterima beserta kombinasi pecahan minimum paling rapi?',
                  promptEn: 'Total Rp37,500 paid with Rp50,000. What is the exact change and cleanest notes/coins?',
                  optionsId: [
                    'Rp12.500 (1×Rp10.000 + 1×Rp2.000 + 1×Rp500)',
                    'Rp12.500 (2×Rp5.000 + 2×Rp1.000 + 1×Rp500)',
                    'Rp13.500 (1×Rp10.000 + 1×Rp2.000 + 1×Rp1.000)',
                    'Rp12.500 (1×Rp10.000 + 2×Rp1.000 + 5×Rp100)',
                  ],
                  optionsEn: [
                    'Rp12,500 (1×10k + 1×2k + 1×500 coin)',
                    'Rp12,500 (2×5k + 2×1k + 1×500 coin)',
                    'Rp13,500 (1×10k + 1×2k + 1×1k note)',
                    'Rp12,500 (1×10k + 2×1k + 5×100 coin)',
                  ],
                  correctIndex: 0,
                  explanationCard: card({
                    why: 'Hitung selisih dari besar ke kecil membantu mencegah kesalahan kasir maupun recehan berlebih di dompet.',
                    calc: '50.000 − 37.500 = 12.500 = 10.000 + 2.000 + 500 (hanya 3 potong uang!).',
                    next: 'Selalu hitung ulang kembalian sebelum meninggalkan meja kasir.',
                  }),
                },
                {
                  id: 's1u2s3p1_q2',
                  promptId:
                    'Tagihan makan Rp28.000. Kamu hanya punya selembar Rp50.000 dan beberapa pecahan Rp2.000 & Rp1.000. Mengapa kasir sering bertanya: "Ada tambah Rp3.000 biar kembaliannya genap?"',
                  promptEn: 'Bill is Rp28,000. Paying Rp50,000 + Rp3,000 yields what clean change?',
                  optionsId: [
                    'Agar kembaliannya genap Rp25.000 dalam dua lembar pecahan utuh',
                    'Agar kasir mencatat harga tagihan baru sebesar Rp31.000',
                    'Karena uang Rp50.000 wajib disertai biaya tambahan pecahan',
                    'Agar pembeli memperoleh kembalian bersih sebesar Rp22.000',
                  ],
                  optionsEn: [
                    'To receive a clean Rp25,000 change in two round banknotes',
                    'So the cashier records a new Rp31,000 receipt total',
                    'Because Rp50,000 requires a cash handling surcharge',
                    'So the buyer receives a rounded Rp22,000 back',
                  ],
                  correctIndex: 0,
                  explanationCard: card({
                    why: 'Menambah recehan pas membuat sisa menjadi angka bulat yang mudah dihitung di kepala.',
                    calc: '(50.000 + 3.000) − 28.000 = 53.000 − 28.000 = Rp25.000.',
                    next: 'Kebiasaan membawa sedikit pecahan kecil mempermudah transaksi harian dan mencegah salah hitung.',
                  }),
                },
              ]
            ),
            mkStoryLesson(
              'S1.U2.ST3.P2',
              'Belanja Tunai & Jaga Dompet',
              'Safe Cash Transaction',
              'Mengambil keputusan belanja tunai, memeriksa 3D, mengecek syarat uang rusak, dan menghitung kembalian.',
              {
                titleId: 'Hari Pertama Belanja Tunai & Jaga Dompet',
                subtitleId: 'Simulasi 3 Babak Pemeriksaan Keaslian, Perawatan & Kembalian',
                durationLabelId: '3 Babak Simulasi',
                initialState: { cash: 100_000, emergencyFund: 0, sinkingFund: 0, debt: 0, netWorth: 100_000 },
                chapters: [
                  {
                    id: 'u2_b1',
                    periodLabelId: 'Babak 1: Menerima Uang Kembalian',
                    narrativeId: 'Di pasar malam yang remang, pedagang memberi kembalian selembar Rp50.000 yang sangat kusut namun di lampu terlihat watermark pahlawan utuh, atau selembar lagi yang licin buram.',
                    choices: [
                      {
                        id: 'c1',
                        labelId: 'Lakukan cek 3D (Dilihat, Diraba, Diterawang) di tempat terang; tolak sopan lembar licin tak berciri 3D dan minta ganti',
                        feedbackId: 'Tepat! Mengecek 3D sebelum meninggalkan penjual mencegah kerugian dari uang palsu.',
                        deltas: { scoreSecurity: 30, scoreCashflow: 20 },
                        isRecommended: true,
                      },
                      {
                        id: 'c2',
                        labelId: 'Langsung lipat kecil-kecil dan masukkan saku celana supaya cepat',
                        feedbackId: 'Melipat uang merusak kertas (melanggar 5 Jangan) sekaligus melewatkan pemeriksaan 3D!',
                        deltas: { cash: -50_000, scoreSecurity: -25 },
                      },
                    ],
                  },
                  {
                    id: 'u2_b2',
                    periodLabelId: 'Babak 2: Uang Robek di Dompet',
                    narrativeId: 'Uang Rp20.000 milikmu tak sengaja robek bagian pinggirnya sehingga ukurannya masih tersisa sekitar 80% (> 2/3 ukuran asli) dan nomor serinya masih jelas.',
                    choices: [
                      {
                        id: 'c1',
                        labelId: 'Simpan terpisah lalu pesan antrean tukar gratis di PINTAR BI (pintar.bi.go.id) atau bank umum',
                        feedbackId: 'Benar! Uang asli rusak > 2/3 ukuran asli dan dikenali cirinya akan diganti penuh oleh BI.',
                        deltas: { scoreGoal: 25, scoreRisk: 20 },
                        isRecommended: true,
                      },
                      {
                        id: 'c2',
                        labelId: 'Tukarkan ke jasa pinggir jalan dengan potongan biaya Rp5.000 atau staples bagian robeknya',
                        feedbackId: 'Sayang sekali! Staples merusak serat uang lebih parah dan jasa tak resmi memotong hak nominalmu.',
                        deltas: { cash: -5_000, scoreCashflow: -15 },
                      },
                    ],
                  },
                  {
                    id: 'u2_b3',
                    periodLabelId: 'Babak 3: Bayar Pas di Minimarket',
                    narrativeId: 'Belanja kebutuhan dapur total Rp43.000. Di dompetmu ada selembar Rp50.000, selembar Rp2.000, dan koin Rp1.000.',
                    choices: [
                      {
                        id: 'c1',
                        labelId: 'Serahkan Rp50.000 + Rp3.000 (Rp2.000 + Rp1.000) agar menerima kembalian genap Rp10.000',
                        feedbackId: 'Pintar! Dompet lebih rapi dan kembalian langsung mudah dicek: 53.000 − 43.000 = Rp10.000.',
                        deltas: { scoreCashflow: 25, scoreGoal: 20 },
                        isRecommended: true,
                      },
                      {
                        id: 'c2',
                        labelId: 'Serahkan Rp50.000 tanpa memeriksa kembalian Rp7.000 dari kasir',
                        feedbackId: 'Tanpa memeriksa kembalian, selisih kekurangan kasir tidak akan sadar sebelum keluar toko.',
                        deltas: { scoreSecurity: -10 },
                      },
                    ],
                  },
                ],
                explanationCard: card({
                  why: 'Kebiasaan 3D, 5 Jangan, syarat penukaran BI > 2/3, dan verifikasi kembalian adalah fondasi keamanan transaksi tunai harian.',
                  type: 'dynamic_fact',
                  reg: REG_SOURCES.UU_MATA_UANG,
                  next: 'Di era digital sekalipun, kemampuan memeriksa fisik uang tunai tetap wajib dikuasai.',
                }),
              }
            ),
          ],
        },
      ],
    },

    // ================= UNIT 3 =================
    {
      id: 'S1.U3',
      unitNumber: 3,
      semesterId: 'S1',
      titleId: 'Kebutuhan, Keinginan & Biaya Peluang',
      titleEn: 'Needs, Wants & Opportunity Cost',
      guidebook: {
        summaryId:
          'Kebutuhan berdampak langsung pada kelangsungan hidup, kesehatan, pendidikan, atau nafkah (Primer → Sekunder → Tersier). Keinginan adalah selera yang dapat ditunda. Setiap pilihan belanja menciptakan Opportunity Cost, dan pengeluaran kecil berulang (Latte Factor) bukan dilarang secara moral, tetapi perlu disadari agar tidak diam-diam menggeser kebutuhan pokok.',
        summaryEn: 'Distinguishing needs from wants based on context, plus opportunity cost and Latte Factor awareness.',
        keyRulesId: [
          'Barang yang sama bisa jadi kebutuhan bagi satu profesi (mis. helm & kuota bagi driver ojol) dan keinginan bagi peran lain.',
          'Opportunity Cost adalah nilai alternatif terbaik yang dikorbankan saat memilih suatu pengeluaran.',
          'Jajan kecil rutin boleh dinikmati selama memang masuk anggaran dan tidak menggusur target penting.',
        ],
        keyRulesEn: [
          'Needs depend on life and work context.',
          'Opportunity cost measures the next-best alternative forgone.',
          'Small treats are fine when budgeted intentionally.',
        ],
        disclaimerId:
          'Pedoman Edukasi: Pengelompokan kebutuhan vs keinginan disesuaikan konteks peran hidup dan kemampuan anggaran tiap individu.',
        disclaimerEn: 'Educational Guideline: Priority depends on individual roles and budget capacity.',
      },
      stages: [
        {
          id: 'S1.U3.ST1',
          stageNumber: '3.1',
          titleId: 'Skala Prioritas & Konteks Kehidupan',
          titleEn: 'Priority Scale & Context',
          skipExamId: 'SKIP.S1.U3.ST1',
          paths: [
            mkQuizLesson(
              'S1.U3.ST1.P1',
              'Kebutuhan Bersifat Kontekstual',
              'Contextual Needs',
              'Memahami mengapa barang sama memiliki status prioritas berbeda sesuai peran hidup.',
              [
                {
                  id: 's1u3s1p1_q1',
                  promptId: 'Bagi pengemudi ojek online aktif, kuota internet dan helm berstandar SNI termasuk kategori...',
                  promptEn: 'For an active ride-hailing driver, mobile data and a certified helmet are...',
                  optionsId: [
                    'Kebutuhan penunjang nafkah utama',
                    'Kebutuhan sekunder pelengkap gaya',
                    'Keinginan hiburan tersier bulanan',
                    'Dana cadangan darurat non-harian',
                  ],
                  optionsEn: [
                    'Essential livelihood needs',
                    'Secondary lifestyle complement',
                    'Tertiary entertainment wants',
                    'Non-daily emergency reserve',
                  ],
                  correctIndex: 0,
                  explanationCard: card({
                    why: 'Alat kerja langsung yang menentukan keselamatan dan kemampuan mencari penghasilan masuk dalam prioritas kebutuhan.',
                    next: 'Selalu nilai suatu pengeluaran dari fungsinya terhadap kesehatan, pendidikan, atau penghasilanmu.',
                  }),
                },
                {
                  id: 's1u3s1p1_q2',
                  promptId: 'Seorang siswa sudah memiliki tas sekolah utuh yang layak pakai, namun ingin membeli tas edisi karakter baru agar sama dengan temannya. Status pembelian tersebut adalah...',
                  promptEn: 'A student with a sturdy bag wants a new character bag just to match friends. This is...',
                  optionsId: [
                    'Keinginan karena fungsinya masih terpenuhi tas lama',
                    'Kebutuhan primer mendesak penunjang belajar harian',
                    'Kebutuhan sekunder wajib tiap awal semester baru',
                    'Investasi produktif karena menunjang nilai ujian',
                  ],
                  optionsEn: [
                    'A want because the old bag still fulfills the core function',
                    'Urgent primary need for daily classroom study',
                    'Mandatory secondary need at every term start',
                    'Productive investment that boosts exam grades',
                  ],
                  correctIndex: 0,
                  explanationCard: card({
                    why: 'Karena fungsi tas sudah terpenuhi oleh tas lama yang masih baik, tas baru karena tren bersifat Keinginan.',
                    next: 'Menunda keinginan memberi ruang bagi dana darurat atau tujuan belajar yang lebih penting.',
                  }),
                },
              ]
            ),
            mkPairLesson(
              'S1.U3.ST1.P2',
              'Primer, Sekunder & Tersier',
              'Primary, Secondary & Tertiary',
              'Mencocokkan tingkat kebutuhan.',
              {
                mode: 'pairs',
                instructionId: 'Pasangkan contoh barang/jasa dengan tingkat prioritas kebutuhan keluarga.',
                instructionEn: 'Match household items to their priority tier.',
                pairs: [
                  { id: 'pr1', leftId: 'Makanan bergizi harian, air bersih, & tempat berteduh layak', leftEn: 'Nutritious food, clean water & shelter', rightId: 'Kebutuhan Primer', rightEn: 'Primary Need' },
                  { id: 'pr2', leftId: 'Seragam sekolah, alat tulis, & paket kuota belajar', leftEn: 'Uniform, stationery & study data', rightId: 'Kebutuhan Sekunder (Penunjang)', rightEn: 'Secondary Need' },
                  { id: 'pr3', leftId: 'Liburan wisata berbiaya tinggi / koleksi hobi mewah', leftEn: 'Luxury vacation or collectibles', rightId: 'Kebutuhan Tersier', rightEn: 'Tertiary Want/Need' },
                ],
                explanationCard: card({
                  why: 'Penuhi Primer lebih dahulu, lanjutkan Sekunder penunjang produktivitas/pendidikan, dan nikmati Tersier hanya bila anggaran surplus dan cadangan aman.',
                  next: 'Susun daftar belanja bulanan dimulai dari pos Primer.',
                }),
              }
            ),
            mkKokiLesson(
              'S1.U3.ST1.P3',
              'Mode Teliti: Sortir Belanja Berkonteks',
              'Contextual Shopping Sort',
              'Memilah kebutuhan mendesak vs keinginan berdasarkan konteks peran.',
              {
                instructionId: 'Perhatikan konteks peran pada setiap kartu sebelum memilah ke Kebutuhan Mendesak atau Keinginan.',
                instructionEn: 'Check the role context on each item before sorting into Urgent Need or Want.',
                buckets: [
                  { id: 'BUTUH', labelId: 'KEBUTUHAN MENDESAK', labelEn: 'URGENT NEED', icon: '🛒' },
                  { id: 'INGIN', labelId: 'KEINGINAN (TUNDA DULU)', labelEn: 'WANT (DELAY)', icon: '🎮' },
                ],
                items: [
                  { id: 'i1', contextTagId: 'Keluarga harian', labelId: 'Beras dan lauk pokok mingguan keluarga di rumah', labelEn: 'Weekly household rice & staples', correctBucketId: 'BUTUH', explanationCard: card({ why: 'Pangan pokok adalah kebutuhan primer langsung.', next: 'Prioritaskan pos makan bergizi sebelum hiburan.' }) },
                  { id: 'i2', contextTagId: 'Kesehatan mendadak', labelId: 'Orang tua membeli obat demam anak yang sedang sakit di apotek', labelEn: 'Fever medicine for sick child', correctBucketId: 'BUTUH', explanationCard: card({ why: 'Penanganan sakit mendesak wajib didahulukan demi kesehatan.', next: 'Dana kesehatan ringan dibantu oleh pos kesehatan/dana darurat.' }) },
                  { id: 'i3', contextTagId: 'Tugas sekolah', labelId: 'Pelajar membeli kuota paket belajar untuk mengirim tugas minggu ini', labelEn: 'Student study data plan', correctBucketId: 'BUTUH', explanationCard: card({ why: 'Dalam konteks pelajar dengan tugas daring, paket belajar menunjang pendidikan.', next: 'Pilih paket hemat khusus edukasi daripada paket hiburan besar.' }) },
                  { id: 'i4', contextTagId: 'Anggaran mepet', labelId: 'Karyawan dengan anggaran pas-pasan membeli kopi kekinian ke-3 minggu ini di luar plafon jajan', labelEn: 'Extra trendy coffee outside budget', correctBucketId: 'INGIN', explanationCard: card({ why: 'Di luar plafon anggaran jajan saat kas pas-pasan, pembelian berulang ini adalah keinginan yang bisa ditunda.', next: 'Kopi kecil boleh dinikmati bila sudah masuk plafon hiburanmu.' }) },
                  { id: 'i5', contextTagId: 'Siswa menunggak buku', labelId: 'Pelajar dengan uang saku terbatas membeli skin karakter game online', labelEn: 'Game skin on tight allowance', correctBucketId: 'INGIN', explanationCard: card({ why: 'Item kosmetik game tidak menunjang kebutuhan pokok maupun kewajiban belajar.', next: 'Penuhi buku sekolah terlebih dahulu, baru sisihkan sebagian kecil untuk hiburan.' }) },
                  { id: 'i6', contextTagId: 'Sepatu lama masih layak', labelId: 'Pemilik sepatu layak pakai membeli sepatu edisi terbatas karena tren teman', labelEn: 'Limited edition sneakers for trend', correctBucketId: 'INGIN', explanationCard: card({ why: 'Karena fungsi sepatu masih terpenuhi dengan baik, beli baru demi tren adalah keinginan.', next: 'Tunggu minimal 48 jam sebelum memutuskan belanja tren.' }) },
                ],
              }
            ),
            mkWordleLesson(
              'S1.U3.ST1.P4',
              'Kosakata Skala Prioritas',
              'Priority Vocabulary',
              'Menguasai kata primer, sekunder, butuh, dan ingin.',
              [
                { word: 'PRIMER', clueId: 'Kebutuhan paling mendasar agar hidup & kesehatan tetap terjaga.', clueEn: 'Fundamental survival need.', definitionId: 'Kebutuhan utama manusia seperti pangan bergizi, air, sandang dasar, & papan.', definitionEn: 'Basic survival needs.', exampleId: 'Makan sehari-hari dan tempat tinggal aman bagi keluarga.', exampleEn: 'Daily meals and safe shelter.' },
                { word: 'SEKUNDER', clueId: 'Kebutuhan penunjang aktivitas pendidikan dan pekerjaan setelah primer terpenuhi.', clueEn: 'Secondary supporting need.', definitionId: 'Kebutuhan pelengkap untuk produktivitas, mobilitas, dan kualitas hidup wajar.', definitionEn: 'Needs supporting education and work.', exampleId: 'Kuota belajar, seragam kerja, atau kendaraan harian ke kantor.', exampleEn: 'Work uniform or commute transport.' },
                { word: 'BUTUH', clueId: 'Keadaan saat suatu hal berdampak nyata pada kesehatan, tugas, atau nafkah.', clueEn: 'Needed for core function.', definitionId: 'Keperluan esensial yang menunda pemenuhannya akan mengganggu fungsi hidup dasar.', definitionEn: 'Requirement essential to wellbeing.', exampleId: 'Membeli kacamata baru ketika minus mata bertambah agar jelas membaca.', exampleEn: 'Replacing prescription glasses to see clearly.' },
                { word: 'INGIN', clueId: 'Hasrat selera yang bisa ditunda tanpa mengganggu keberlangsungan hidup.', clueEn: 'Optional desire.', definitionId: 'Keinginan tambahan demi gaya hidup, gengsi, atau kenyamanan ekstra di luar kebutuhan pokok.', definitionEn: 'Non-essential desire.', exampleId: 'Mengganti HP sehat dengan seri terbaru semata demi kamera viral.', exampleEn: 'Upgrading a working phone purely for status.' },
              ]
            ),
          ],
        },
        {
          id: 'S1.U3.ST2',
          stageNumber: '3.2',
          titleId: 'Biaya Peluang & Latte Factor',
          titleEn: 'Opportunity Cost & Latte Factor',
          skipExamId: 'SKIP.S1.U3.ST2',
          paths: [
            mkQuizLesson(
              'S1.U3.ST2.P1',
              'Memahami Opportunity Cost',
              'Real Opportunity Cost',
              'Mengenali biaya peluang nyata pada uang terbatas.',
              [
                {
                  id: 's1u3s2p1_q1',
                  promptId:
                    'Raka memiliki tabungan pas Rp300.000. Ia harus memilih antara membeli tiket konser hiburan atau mengikuti kelas desain grafis bersertifikat untuk kerja sampingan. Apa yang menjadi Opportunity Cost jika Raka memilih tiket hiburan?',
                  promptEn: 'Raka has Rp300,000 and chooses concert tickets over a graphic design course. What is the opportunity cost?',
                  optionsId: [
                    'Manfaat keahlian & peluang penghasilan dari kelas desain grafis',
                    'Uang tunai Rp300.000 yang telah keluar untuk membeli tiket konser',
                    'Biaya tambahan makan dan parkir kendaraan di area venue konser',
                    'Seluruh potensi gaji penuh waktu hingga ia memasuki masa pensiun',
                  ],
                  optionsEn: [
                    'The missed skills & income potential from the design course',
                    'The Rp300,000 cash spent directly to pay for concert admission',
                    'Extra snack and parking charges around the concert venue',
                    'All lifetime full-time earnings until eventual retirement age',
                  ],
                  correctIndex: 0,
                  explanationCard: card({
                    why: 'Opportunity Cost bukanlah sekadar rupiah di label harga, melainkan nilai manfaat terbaik dari pilihan yang kita relakan/korbankan.',
                    next: 'Sebelum belanja nominal besar dengan kas terbatas, tanyakan: "Alternatif terbaik apa yang sedang kukorbankan?"',
                  }),
                },
                {
                  id: 's1u3s2p1_q2',
                  promptId:
                    '[Analitik HOTS] Sisa uang saku Nisa Rp400.000 untuk 12 hari. Ia ditawari lembur kafe di akhir pekan (honor Rp180.000) pada jam yang sama dengan acara makan gratis alumni di luar kota (ongkos PP Rp110.000 + iuran foto Rp40.000). Jika memilih acara alumni, berapa total beban bersih Opportunity Cost + biaya keluar dibanding bekerja di kafe?',
                  promptEn: '[HOTS] Nisa skips a Rp180k cafe shift to attend an alumni dinner costing Rp110k transit + Rp40k fee. Total net economic trade-off vs the cafe shift?',
                  optionsId: ['Rp330.000', 'Rp150.000', 'Rp180.000', 'Rp70.000'],
                  optionsEn: ['Rp330,000', 'Rp150,000', 'Rp180,000', 'Rp70,000'],
                  correctIndex: 0,
                  explanationCard: card({
                    why: 'Analisis keputusan rasional (C4-C5) membandingkan dua skenario penuh: pergi keluar menghabiskan kas Rp150.000 sekaligus melepas pemasukan Rp180.000.',
                    calc: 'Skenario A (Kafe): +Rp180.000. Skenario B (Alumni): −Rp150.000. Selisih nilai ekonomi = 180.000 − (−150.000) = Rp330.000!',
                    assume: 'Simulasi mengasumsikan nilai jejaring alumni bersifat non-finansial jangka pendek dibanding kebutuhan kas 12 hari tersisa.',
                    next: 'Saat memilih acara sosial berbayar di jam produktif, hitung biaya tunai ditambah pemasukan yang dilepas sekaligus.',
                    type: 'simulation_assumption',
                  }),
                },
              ]
            ),
            mkQuizLesson(
              'S1.U3.ST2.P2',
              'Hitung Latte Factor (Tanpa Menghakimi)',
              'Calculate Latte Factor Fairly',
              'Menghitung akumulasi pengeluaran kecil berulang 30 hari & 12 bulan tanpa menyalahkan jajan terencana.',
              [
                {
                  id: 's1u3s2p2_q1',
                  promptId:
                    '(Asumsi simulasi: terjadi tiap hari tanpa anggaran hiburan khusus) Jika seseorang membeli jajanan impulsif Rp20.000 setiap hari di luar rencana, berapa total akumulasinya dalam 1 tahun (360 hari)?',
                  promptEn: 'How much does unbudgeted Rp20,000/day accumulate to over 360 days?',
                  optionsId: ['Rp7.200.000/tahun', 'Rp600.000/tahun', 'Rp2.400.000/tahun', 'Rp1.200.000/tahun'],
                  optionsEn: ['Rp7,200,000/year', 'Rp600,000/year', 'Rp2,400,000/year', 'Rp1,200,000/year'],
                  correctIndex: 0,
                  explanationCard: card({
                    why: 'Pengeluaran kecil harian yang rutin tidak buruk secara moral jika memang dianggarkan! Namun ketika tak disadari, angka kecil berulang diam-diam menelan dana besar.',
                    calc: 'Rp20.000 × 30 hari = Rp600.000/bulan; × 12 bulan = Rp7.200.000/tahun.',
                    assume: 'Simulasi mengasumsikan pengeluaran terjadi konsisten 30 hari/bulan tanpa pos hiburan terpisah.',
                    next: 'Buat pos jajan mingguan khusus agar tetap bisa menikmati kopi/camilan secara tenang tanpa membocorkan target lain.',
                    type: 'simulation_assumption',
                  }),
                },
              ]
            ),
            mkDetektifLesson(
              'S1.U3.ST2.P3',
              'Audit 4 Godaan FOMO',
              'FOMO & Priority Audit',
              'Menghadapi godaan Flash Sale & FOMO dengan uang saku terbatas.',
              [
                {
                  id: 'u3_b1',
                  channel: 'Tawaran',
                  senderTitle: 'Notifikasi Flash Sale 00:00: Hoodie Tren Diskon 50% Jadi Rp199.000',
                  documentLines: [
                    '• Sisa uang saku bulan ini tinggal Rp250.000 untuk 10 hari ke depan',
                    '• Jaket harianmu di lemari masih hangat dan layak',
                    '• Besok ada iuran fotokopi buku wajib Rp60.000',
                  ],
                  questionId: 'Apa keputusan paling rasional melihat kondisi anggaranmu?',
                  optionsId: [
                    { id: 'o1', labelId: 'WASPADA / TUNDA: Lewatkan Flash Sale FOMO demi mengamankan uang buku & makan 10 hari', verdict: 'WASPADA' },
                    { id: 'o2', labelId: 'AMAN: Beli sekarang mumpung diskon sebelum kehabisan', verdict: 'AMAN' },
                    { id: 'o3', labelId: 'AMAN: Pakai utang teman dulu agar tidak rugi diskon', verdict: 'AMAN' },
                  ],
                  correctOptionId: 'o1',
                  evidenceLevel: 'fakta_terobservasi',
                  explanationCard: card({
                    why: 'Membeli barang tak dibutuhkan meski berdiskon 50% tetap menghabiskan Rp199.000 dan mengancam kebutuhan makan serta fotokopi buku.',
                    calc: 'Sisa Rp250rb − Rp199rb = Rp51rb < Rp60rb biaya fotokopi wajib!',
                    next: 'Diskon terhebat untuk barang yang belum dibutuhkan adalah 100% hemat dengan tidak membelinya.',
                    type: 'simulation_assumption',
                  }),
                },
                {
                  id: 'u3_b2',
                  channel: 'Tawaran',
                  senderTitle: 'Ganti Oli Motor Kerja Ojol (Rp65.000) & Servis Ringan',
                  documentLines: [
                    '• Kilometer motor sudah melewati batas ganti oli rutin bulanan',
                    '• Motor dipakai bekerja 8 jam per hari mencari penghasilan',
                    '• Pos perawatan sudah disisihkan Rp75.000 di dompet terpisah',
                  ],
                  questionId: 'Bagaimana status pengeluaran perawatan alat kerja ini?',
                  optionsId: [
                    { id: 'o1', labelId: 'AMAN: Kebutuhan produktif mendesak untuk menjaga aset kerja tetap awet', verdict: 'AMAN' },
                    { id: 'o2', labelId: 'BAHAYA: Pengeluaran konsumtif pemborosan', verdict: 'BAHAYA' },
                    { id: 'o3', labelId: 'WASPADA: Tunggu sampai mesin macet total baru ke bengkel', verdict: 'WASPADA' },
                  ],
                  correctOptionId: 'o1',
                  evidenceLevel: 'fakta_terobservasi',
                  explanationCard: card({
                    why: 'Menunda ganti oli Rp65.000 berisiko membuat turun mesin jutaan rupiah dan menghentikan penghasilan.',
                    next: 'Rawat aset penunjang nafkah secara terjadwal.',
                    type: 'simulation_assumption',
                  }),
                },
                {
                  id: 'u3_b3',
                  channel: 'Tawaran',
                  senderTitle: 'Ajakan Traktir Gengsi Ultah di Resto Mewah (Rp450.000)',
                  documentLines: [
                    '• Dana di rekening khusus hiburan tinggal Rp120.000',
                    '• Pengeluaran wajib kos jatuh tempo minggu depan',
                    '• Bisa diganti syukuran hemat di rumah atau kumpul sederhana sesuai plafon',
                  ],
                  questionId: 'Apa langkah sehat menyikapi ajakan gengsi ini?',
                  optionsId: [
                    { id: 'o1', labelId: 'WASPADA / TOLAK HALUS: Sesuaikan acara ke batas Rp120rb atau rayakan sederhana tanpa ganggu uang kos', verdict: 'WASPADA' },
                    { id: 'o2', labelId: 'AMAN: Gesek PayLater agar tetap terlihat mampu di depan teman', verdict: 'AMAN' },
                    { id: 'o3', labelId: 'AMAN: Gunakan uang sewa kos lalu cari pinjaman dadakan minggu depan', verdict: 'AMAN' },
                  ],
                  correctOptionId: 'o1',
                  evidenceLevel: 'red_flag',
                  explanationCard: card({
                    why: 'Mengorbankan sewa kos atau berutang demi gengsi sosial memperbesar stres finansial jangka panjang.',
                    next: 'Komunikasikan batas anggaran dengan percaya diri kepada teman dekat.',
                    type: 'simulation_assumption',
                  }),
                },
              ],
              { st: 'simulation_assumption', isBoss: true }
            ),
          ],
        },
      ],
    },

    // ================= UNIT 4 =================
    {
      id: 'S1.U4',
      unitNumber: 4,
      semesterId: 'S1',
      titleId: 'Cermat Berbelanja, Harga Satuan & Membaca Struk',
      titleEn: 'Smart Shopping, Unit Price & Reading Receipts',
      regulationMeta: REG_SOURCES.PPN_PBJT,
      guidebook: {
        summaryId:
          'Bandingkan harga per satuan gram/ml (unit price), pahami diskon bertingkat berurutan (50%+20% = 60%, bukan 70%), dan pahami pajak di struk Indonesia: PPN memiliki tarif UU HPP 12% dengan DPP Nilai Lain 11/12 sehingga efektif 11% untuk barang/jasa umum (PMK 131/2024 jo. PMK 11/2025) dan tarif penuh 12% untuk barang mewah; sedangkan makanan/minuman restoran bukan objek PPN melainkan PBJT Daerah paling tinggi 10% sesuai Perda masing-masing (UU 1/2022 HKPD).',
        summaryEn: 'Unit price comparisons, sequential discounts, and reading PPN (11% effective on general goods) vs regional PBJT restaurant tax.',
        keyRulesId: [
          'Kemasan besar hanya lebih hemat jika unit price lebih rendah DAN produk pasti habis sebelum kedaluwarsa.',
          'PPN umum = tarif 12% × DPP Nilai Lain 11/12 = beban efektif 11%; Barang mewah objek PPnBM = 12% penuh.',
          'Restoran memungut PBJT Daerah maksimal 10% (tarif riil tergantung Perda kota/kabupaten), BUKAN PPN.',
        ],
        keyRulesEn: [
          'Bulk is cheaper only if used before expiration.',
          'General VAT (PPN) has 11% effective burden via 11/12 tax base.',
          'Restaurants charge local PBJT capped at 10%, not VAT.',
        ],
        disclaimerId:
          'Referensi Regulasi: UU HPP jo. PMK 131/2024 jo. PMK 11/2025 & UU 1/2022 HKPD (dinamis; verifikasi berkala per rilis konten).',
        disclaimerEn: 'Regulatory Reference: Tax rates subject to Ministry of Finance & Regional Bylaws.',
      },
      stages: [
        {
          id: 'S1.U4.ST1',
          stageNumber: '4.1',
          titleId: 'Harga Satuan & Matematika Diskon',
          titleEn: 'Unit Pricing & Stacked Discounts',
          skipExamId: 'SKIP.S1.U4.ST1',
          paths: [
            mkQuizLesson(
              'S1.U4.ST1.P1',
              'Bandingkan Harga Per ml/gram',
              'Unit Price Mastery',
              'Menghitung & membandingkan harga satuan serta batas kedaluwarsa.',
              [
                {
                  id: 's1u4s1p1_q1',
                  promptId:
                    'Sabun cair Kemasan A (400 ml) berharga Rp24.000, sedangkan Kemasan B (900 ml) berharga Rp45.000. Mana yang harga satuannya lebih hemat?',
                  promptEn: 'Pack A (400ml, Rp24,000) vs Pack B (900ml, Rp45,000). Which has lower unit price?',
                  optionsId: [
                    'Kemasan B karena biaya satuannya Rp50/ml dibanding Rp60/ml',
                    'Kemasan A karena total kas keluar di meja kasir lebih kecil',
                    'Keduanya sama hemat karena selisih harga sebanding isi botol',
                    'Kemasan B lebih mahal Rp10/ml karena ukuran botolnya jumbo',
                  ],
                  optionsEn: [
                    'Pack B because its unit price is Rp50/ml versus Rp60/ml',
                    'Pack A because immediate cash outlay at checkout is smaller',
                    'Both offer equal value because the price scales with bottle volume',
                    'Pack B costs Rp10/ml more due to larger jumbo packaging',
                  ],
                  correctIndex: 0,
                  explanationCard: card({
                    why: 'Harga satuan (Unit Price = Harga ÷ Isi) mengungkap nilai ekonomis sebenarnya di balik ukuran botol.',
                    calc: 'A = 24.000 ÷ 400 = Rp60/ml; B = 45.000 ÷ 900 = Rp50/ml (lebih hemat 16,7% per ml!).',
                    next: 'Selalu bagi harga dengan gram/ml di rak supermarket sebelum memilih.',
                  }),
                },
                {
                  id: 's1u4s1p1_q2',
                  promptId: 'Kapan kemasan kecil dengan harga per gram sedikit lebih mahal justru lebih bijak dibeli daripada kemasan besar 5 kg?',
                  promptEn: 'When is a smaller pack smarter than a giant bulk pack?',
                  optionsId: [
                    'Saat pemakaian jarang sehingga kemasan besar akan rusak sebelum habis',
                    'Saat harga per gram kemasan besar jauh lebih murah di papan promo',
                    'Saat pembeli ingin menimbun stok jangka panjang bahan mudah basi',
                    'Tidak pernah, sebab harga satuan paket grosir selalu paling untung',
                  ],
                  optionsEn: [
                    'When usage is infrequent and bulk would spoil before running out',
                    'When unit weight price on the bulk shelf sign looks lower',
                    'When shoppers want long-term stockpiles of fresh perishables',
                    'Never, since bulk unit pricing always guarantees real savings',
                  ],
                  correctIndex: 0,
                  explanationCard: card({
                    why: 'Barang yang terbuang kedaluwarsa membuat biaya efektif per unit yang benar-benar terpakai membengkak jauh lebih mahal.',
                    next: 'Hitung kapasitas konsumsi rumah tangga dalam masa simpan produk sebelum tergoda harga grosir.',
                  }),
                },
              ]
            ),
            mkQuizLesson(
              'S1.U4.ST1.P2',
              'Diskon Bertingkat & Capped Cashback',
              'Stacked Discounts & Capped Promos',
              'Menghitung diskon bertingkat dan promo berbatas maksimal.',
              [
                {
                  id: 's1u4s1p2_q1',
                  promptId: 'Sebuah kemeja kerja berharga Rp200.000 mendapat label "Diskon 50% + 20%". Berapakah harga akhir yang wajib dibayar?',
                  promptEn: 'A Rp200,000 shirt has "50% + 20% Off". What is the final price?',
                  optionsId: ['Rp80.000', 'Rp60.000', 'Rp100.000', 'Rp140.000'],
                  optionsEn: ['Rp80,000', 'Rp60,000', 'Rp100,000', 'Rp140,000'],
                  correctIndex: 0,
                  explanationCard: card({
                    why: 'Diskon bertingkat dihitung secara berurutan atas sisa harga setelah potongan pertama, bukan dijumlah langsung menjadi 70%!',
                    calc: 'Tahap 1: Rp200.000 − 50% = Rp100.000. Tahap 2: Rp100.000 − 20% = Rp80.000 (total potongan Rp120.000 = 60%).',
                    next: 'Jangan langsung menganggap "50% + 50%" berarti gratis; 0,5 × 0,5 = bayar 25%!',
                  }),
                },
                {
                  id: 's1u4s1p2_q2',
                  promptId:
                    'Aplikasi menawarkan promo: "Cashback 50% maksimal Rp10.000". Jika kamu memang belanja kebutuhan seharga Rp100.000, berapa persen potongan riil yang sebenarnya kamu terima?',
                  promptEn: 'Promo offers "50% cashback max Rp10,000" on a Rp100,000 purchase. True percentage saved?',
                  optionsId: ['10%', '50%', '25%', '5%'],
                  optionsEn: ['10%', '50%', '25%', '5%'],
                  correctIndex: 0,
                  explanationCard: card({
                    why: 'Kata "maksimal Rp10.000" mengunci batas potongan meskipun persentase tulisannya besar.',
                    calc: '50% × Rp100.000 = Rp50.000, tetapi dibatasi cap maks Rp10.000 → Rp10.000 ÷ Rp100.000 = 10%!',
                    next: 'Selalu baca batas maksimal rupiah (cap) dan syarat minimal belanja pada setiap voucher.',
                  }),
                },
                {
                  id: 's1u4s1p2_q3',
                  promptId:
                    '[Analitik HOTS] Kamu memang perlu beli perlengkapan kerja Rp200.000. Toko A memberi Diskon langsung 25% + ongkir Rp12.000. Toko B memberi harga penuh Rp200.000 gratis ongkir, plus Cashback 40% (maksimal Rp60.000) berupa koin yang HANGUS dalam 3 hari bila tidak belanja lagi. Mana yang paling hemat secara kas riil jika tidak ada rencana belanja tambahan?',
                  promptEn: '[HOTS] Need Rp200k work gear with no extra planned shopping: Store A gives 25% off + Rp12k shipping; Store B charges Rp200k free shipping + Rp60k coin cashback expiring in 3 days. Which preserves more real cash?',
                  optionsId: [
                    'Toko A lebih hemat karena bayar tunai Rp162.000 vs Rp200.000 hangus',
                    'Toko B lebih hemat karena biaya bersihnya tinggal Rp140.000 setelah koin',
                    'Keduanya sama karena selisih ongkir menutup nilai koin hadiah',
                    'Toko B lebih hemat karena gratis ongkir memotong modal awal kas',
                  ],
                  optionsEn: [
                    'Store A wins at Rp162,000 net cash vs Rp200,000 with expiring coins',
                    'Store B wins at Rp140,000 net price after factoring coin value',
                    'Both tie because the shipping charge offsets the reward balance',
                    'Store B wins because free shipping preserves upfront pocket cash',
                  ],
                  correctIndex: 0,
                  explanationCard: card({
                    why: 'Promo koin jangka pendek sering menjebak pembeli melakukan pembelanjaan kedua yang sebenarnya tidak direncanakan agar poin tidak hangus.',
                    calc: 'Toko A = (Rp200.000 − 25%) + Rp12.000 = Rp162.000 tunai final. Toko B = Rp200.000 keluar; koin Rp60.000 bernilai Rp0 jika tidak ada belanja kebutuhan baru dalam 3 hari.',
                    assume: 'Simulasi mengasumsikan pengguna disiplin tidak mengarang kebutuhan belanja tambahan hanya demi menghabiskan koin.',
                    next: 'Selalu prioritaskan potongan harga langsung daripada cashback bersyarat masa kedaluwarsa ketat.',
                    type: 'simulation_assumption',
                  }),
                },
              ]
            ),
            mkDetektifLesson(
              'S1.U4.ST1.P3',
              'Deteksi Harga Coret & Voucher Jebakan',
              'Fake Strikethrough & Voucher Traps',
              'Mengidentifikasi harga coret manipulatif dan syarat tersembunyi.',
              [
                {
                  id: 'u4_p3_c1',
                  channel: 'Tawaran',
                  senderTitle: 'Toko Online: "DISKON KILAT 50%! Coret Rp190.000 → Rp95.000"',
                  documentLines: [
                    '• Catatan riwayat harga minggu lalu: barang ini memang dijual normal Rp95.000',
                    '• Harga "Rp190.000" baru dinaikkan 1 jam sebelum kampanye lalu dicoret 50%',
                  ],
                  questionId: 'Bagaimana hasil audit promo ini?',
                  optionsId: [
                    { id: 'o1', labelId: 'WASPADA: Harga coret manipulatif (bukan diskon riil dari harga pasar)', verdict: 'WASPADA' },
                    { id: 'o2', labelId: 'AMAN: Diskon asli 50%, rugi kalau tidak borong 5 unit', verdict: 'AMAN' },
                    { id: 'o3', labelId: 'AMAN: Penjual pasti merugi besar memberi setengah harga', verdict: 'AMAN' },
                  ],
                  correctOptionId: 'o1',
                  evidenceLevel: 'red_flag',
                  explanationCard: card({
                    why: 'Mark-up sebelum diskon membuat label 50% hanya ilusi psikologis agar pembeli terburu-buru checkout.',
                    next: 'Bandingkan harga akhir bersih di beberapa toko tepercaya sebelum merasa mendapat barang murah.',
                  }),
                },
                {
                  id: 'u4_p3_c2',
                  channel: 'Tawaran',
                  senderTitle: 'Gratis Ongkir Rp15.000: Syarat Minimal Belanja Rp300.000',
                  documentLines: [
                    '• Kamu sebenarnya hanya butuh sabun Rp40.000 (ongkir normal Rp12.000)',
                    '• Kamu tergoda menambah barang aksesoris Rp260.000 yang tidak direncanakan agar ongkir Rp12.000 jadi gratis',
                  ],
                  questionId: 'Apakah mengejar "Gratis Ongkir" di atas menguntungkan dompetmu?',
                  optionsId: [
                    { id: 'o1', labelId: 'BAHAYA PEMBOROSAN: Keluar ekstra Rp260.000 hanya demi hemat ongkir Rp12.000!', verdict: 'BAHAYA' },
                    { id: 'o2', labelId: 'AMAN: Pintar karena berhasil memaksimalkan voucher gratis ongkir', verdict: 'AMAN' },
                    { id: 'o3', labelId: 'AMAN: Barang tambahan selalu gratis ongkos kirimnya', verdict: 'AMAN' },
                  ],
                  correctOptionId: 'o1',
                  evidenceLevel: 'fakta_terobservasi',
                  explanationCard: card({
                    why: 'Total keluar Rp40rb + Rp12rb = Rp52rb jauh lebih hemat daripada Rp300rb demi mengejar gratis ongkir!',
                    calc: 'Selisih kas terbuang = Rp300.000 − Rp52.000 = Rp248.000.',
                    next: 'Jangan membeli barang yang tidak dibutuhkan semata-mata agar memenuhi minimum transaksi promo.',
                  }),
                },
              ]
            ),
            mkWordleLesson(
              'S1.U4.ST1.P4',
              'Kosakata Belanja & Diskon',
              'Shopping & Discount Terms',
              'Menguasai kosakata harga, diskon, promo, & nilai.',
              [
                { word: 'HARGA', clueId: 'Nominal uang yang tertera dan dibayar untuk satu unit barang.', clueEn: 'Money charged per unit.', definitionId: 'Nilai tukar suatu barang/jasa yang dinyatakan dalam satuan uang.', definitionEn: 'Monetary amount required for purchase.', exampleId: 'Bandingkan harga per 100 gram sebelum memilih kemasan.', exampleEn: 'Compare price per 100g before buying.' },
                { word: 'DISKON', clueId: 'Potongan persentase atau nominal dari harga normal jual.', clueEn: 'Reduction off standard price.', definitionId: 'Pengurangan harga jual resmi atas suatu produk dalam periode/syarat tertentu.', definitionEn: 'Official price deduction.', exampleId: 'Diskon 50% + 20% menghasilkan potongan total 60%, bukan 70%.', exampleEn: '50% + 20% off equals 60% off.' },
                { word: 'PROMO', clueId: 'Penawaran pemasaran sementara seperti cashback atau bundling.', clueEn: 'Temporary marketing offer.', definitionId: 'Strategi penawaran khusus penjual untuk mendorong pembelian dalam batas syarat tertentu.', definitionEn: 'Promotional sales campaign.', exampleId: 'Cek selalu batas maksimal rupiah dan kuota promo sebelum checkout.', exampleEn: 'Check maximum cap on every promo.' },
                { word: 'NILAI', clueId: 'Manfaat nyata barang dibanding uang yang dikeluarkan.', clueEn: 'Real utility relative to price paid.', definitionId: 'Perbandingan kualitas, keawetan, dan kegunaan nyata terhadap biaya perolehan.', definitionEn: 'Worth received relative to cost.', exampleId: 'Sepatu tahan 18 bulan memberi nilai pakai lebih baik daripada sepatu cepat jebol.', exampleEn: 'Durable shoes offer stronger value for money.' },
              ]
            ),
          ],
        },
        {
          id: 'S1.U4.ST2',
          stageNumber: '4.2',
          titleId: 'Membaca Struk Kasir, PPN vs PBJT Restoran',
          titleEn: 'Reading Receipts: VAT (PPN) vs PBJT',
          skipExamId: 'SKIP.S1.U4.ST2',
          paths: [
            mkPairLesson(
              'S1.U4.ST2.P1',
              'Komponen Pajak & Biaya di Struk Indonesia',
              'Indonesian Receipt Tax Components',
              'Mengenali PPN efektif 11%, PPN Mewah 12%, PBJT maks 10%, & Service Charge.',
              {
                mode: 'pairs',
                instructionId: 'Cocokkan baris biaya pada struk belanja di Indonesia dengan aturan resminya.',
                instructionEn: 'Match each receipt line with its Indonesian regulation.',
                pairs: [
                  { id: 'tx1', leftId: 'PPN Barang/Jasa Umum (tarif 12% × DPP Nilai Lain 11/12)', leftEn: 'General VAT (12% × 11/12 base)', rightId: 'Beban pajak efektif 11% per PMK 131/2024 jo. PMK 11/2025', rightEn: '11% effective VAT burden' },
                  { id: 'tx2', leftId: 'PPN Barang Mewah Objek PPnBM (PMK 131/2024)', leftEn: 'Luxury Goods VAT', rightId: 'Tarif penuh 12% tanpa pengali DPP 11/12', rightEn: 'Full 12% statutory rate' },
                  { id: 'tx3', leftId: 'PBJT Makanan & Minuman Restoran (UU 1/2022 HKPD)', leftEn: 'Restaurant Food/Drink PBJT', rightId: 'Pajak Daerah paling tinggi 10% (tarif nyata per Perda daerah), BUKAN objek PPN', rightEn: 'Local tax max 10%, not VAT' },
                  { id: 'tx4', leftId: 'Service Charge Restoran', leftEn: 'Restaurant Service Charge', rightId: 'Biaya layanan internal resto (sering masuk dasar pengenaan PBJT sesuai asumsi struk)', rightEn: 'Service fee outside government tax' },
                ],
                explanationCard: card({
                  why: 'Membedakan PPN pusat dan PBJT daerah menghindarkan konsumen membayar pungutan pajak ganda yang keliru di restoran.',
                  type: 'dynamic_fact',
                  reg: REG_SOURCES.PPN_PBJT,
                  next: 'Periksa baris pajak pada struk makan restoran: pastikan tidak ditagih PPN sekaligus PBJT atas hidangan yang sama.',
                }),
              },
              { st: 'dynamic_fact', reg: REG_SOURCES.PPN_PBJT }
            ),
            mkDetektifLesson(
              'S1.U4.ST2.P2',
              'Audit 3 Struk Kasir & Restoran',
              'Audit Store & Restaurant Receipts',
              'Menemukan kesalahan kasir, promo tak terpotong, & pungutan pajak ganda dengan asumsi eksplisit.',
              [
                {
                  id: 'u4_rc1',
                  channel: 'Struk',
                  senderTitle: 'Restoran Mie Nusantara: Asumsi Perda Kota: PBJT 10%, Service Charge 5%',
                  documentLines: [
                    '• 2 Porsi Mie Ayam + 2 Teh Tawar  = Rp100.000',
                    '• Service Charge (5%)             = Rp5.000',
                    '• PBJT Restoran (10% × 105.000)   = Rp10.500',
                    '• PPN Restoran (12%)              = Rp12.000',
                    '• TOTAL DITAGIH KASIR             = Rp127.500',
                  ],
                  questionId: 'Kesalahan apa yang terlihat jelas di struk restoran ini?',
                  optionsId: [
                    { id: 'o1', labelId: 'BAHAYA: Pungutan Pajak Ganda! Makanan restoran hanya objek PBJT daerah, bukan PPN', verdict: 'BAHAYA' },
                    { id: 'o2', labelId: 'AMAN: Struk sah karena PPN dan PBJT selalu ditarik bersamaan di restoran', verdict: 'AMAN' },
                    { id: 'o3', labelId: 'AMAN: Service Charge seharusnya 25% bukan 5%', verdict: 'AMAN' },
                  ],
                  correctOptionId: 'o1',
                  evidenceLevel: 'fakta_terobservasi',
                  explanationCard: card({
                    why: 'Makanan dan minuman yang dijual restoran dikecualikan dari PPN karena sudah menjadi objek Pajak Barang dan Jasa Tertentu (PBJT) Daerah (maksimal 10% per Perda UU HKPD).',
                    calc: 'Seharusnya: Subtotal Rp100.000 + Service Rp5.000 + PBJT 10% (Rp10.500) = Rp115.500 (kelebihan tagih Rp12.000!).',
                    assume: 'Asumsi simulasi: tarif PBJT Perda wilayah resto adalah batas maksimal 10% dengan service charge 5% masuk DPP PBJT.',
                    type: 'dynamic_fact',
                    reg: REG_SOURCES.PPN_PBJT,
                    next: 'Tegur kasir dengan sopan sambil menunjukkan baris PPN dan PBJT bersamaan di struk.',
                  }),
                },
                {
                  id: 'u4_rc2',
                  channel: 'Struk',
                  senderTitle: 'Minimarket Segar: Struk Belanja Barang Kebutuhan Umum',
                  documentLines: [
                    '• Susu Kotak UHT 1L (Promo Rak Rp18.000) × 1 = Rp22.500',
                    '• Detergen Cair (Harga Satuan Rp25.000) × 1   = Rp25.000',
                    '• Detergen Cair (Scan Ganda!) × 1            = Rp25.000',
                    '• PPN Efektif 11% (termasuk/terinci resmi)   = Sesuai sistem',
                  ],
                  questionId: 'Apa temuan audit yang harus segera diklarifikasi ke kasir?',
                  optionsId: [
                    { id: 'o1', labelId: 'WASPADA / KOREKSI: Barang ter-scan ganda dan harga promo rak tidak terpotong di sistem POS', verdict: 'WASPADA' },
                    { id: 'o2', labelId: 'AMAN: Wajar karena harga di rak hanya hiasan', verdict: 'AMAN' },
                    { id: 'o3', labelId: 'AMAN: Scan ganda otomatis dikembalikan minggu depan tanpa lapor', verdict: 'AMAN' },
                  ],
                  correctOptionId: 'o1',
                  evidenceLevel: 'fakta_terobservasi',
                  explanationCard: card({
                    why: 'Kesalahan barcode ganda (double scan) dan harga promo rak belum ter-update di mesin kasir adalah kesalahan teknis umum yang merugikan pembeli jika tak memeriksa struk.',
                    calc: 'Selisih rugi = Rp25.000 (scan ganda) + Rp4.500 (promo tak terpotong) = Rp29.500.',
                    next: 'Biasakan mengecek jumlah baris barang dan harga akhir tepat sebelum meninggalkan konter kasir.',
                  }),
                },
              ],
              { st: 'dynamic_fact', reg: REG_SOURCES.PPN_PBJT }
            ),
            mkStoryLesson(
              'S1.U4.ST2.P3',
              'Belanja Dapur & Makan Keluarga',
              'Smart Family Grocery & Dining',
              'Mengambil keputusan belanja kemasan hemat, menolak harga coret, & mengoreksi struk kasir.',
              {
                titleId: 'Belanja Dapur & Makan Keluarga',
                subtitleId: 'Simulasi 3 Babak Uji Harga Satuan, Promo & Struk Kasir',
                durationLabelId: '3 Babak Simulasi',
                initialState: { cash: 300_000, emergencyFund: 0, sinkingFund: 0, debt: 0, netWorth: 300_000 },
                chapters: [
                  {
                    id: 'u4_b1',
                    periodLabelId: 'Babak 1: Rak Bumbu & Minyak',
                    narrativeId: 'Keluargamu hanya memakai 100 ml kecap dalam sebulan (masa kedaluwarsa 3 bulan lagi). Ada botol 200 ml Rp14.000 vs jeriken 1.500 ml "Hemat!" Rp75.000.',
                    choices: [
                      { id: 'c1', labelId: 'Pilih botol 200 ml Rp14.000 sesuai daya habis sebelum kedaluwarsa', feedbackId: 'Cerdas! Menghindari pemborosan Rp61.000 atas 1.200 ml kecap yang keburu basi.', deltas: { cash: -14_000, scoreCashflow: 25, scoreGoal: 25 }, isRecommended: true },
                      { id: 'c2', labelId: 'Beli jeriken 1.500 ml Rp75.000 karena harga per ml terlihat lebih murah', feedbackId: 'Keliru! Sekitar 80% isi akan terbuang kedaluwarsa sehingga biaya per pemakaian jadi sangat mahal.', deltas: { cash: -75_000, scoreCashflow: -15 } },
                    ],
                  },
                  {
                    id: 'u4_b2',
                    periodLabelId: 'Babak 2: Kasir Supermarket',
                    narrativeId: 'Kamu membeli wajan Rp100.000 berdiskon "50% + 20%", tetapi layar kasir menagih Rp30.000 lebih atau justru Rp70.000. Berapa total seharusnya sebelum PPN (PPN sudah termasuk label atau terhitung 11%)?',
                    choices: [
                      { id: 'c1', labelId: 'Pastikan harga setelah diskon bertingkat terbaca Rp40.000 (diskon efektif 60%: 100rb → 50rb → 40rb) + cek tidak ada double scan', feedbackId: 'Tepat! Pemahaman diskon bertingkat melindungi dari selisih harga rak dan POS.', deltas: { cash: -40_000, scoreSecurity: 25, scoreCashflow: 20 }, isRecommended: true },
                      { id: 'c2', labelId: 'Bayar langsung tanpa memeriksa total diskon dan jumlah barang di struk', feedbackId: 'Membiarkan kasir tanpa dicek membuat kesalahan sistem merugikan anggaran keluarga.', deltas: { cash: -70_000, scoreSecurity: -15 } },
                    ],
                  },
                  {
                    id: 'u4_b3',
                    periodLabelId: 'Babak 3: Struk Makan Keluarga',
                    narrativeId: 'Struk restoran mencantumkan PBJT 10% sekaligus menambahkan baris PPN 12% pada tagihan nasi goreng.',
                    choices: [
                      { id: 'c1', labelId: 'Minta koreksi kasir secara sopan karena makanan restoran adalah objek PBJT (maks 10% sesuai Perda), bukan PPN', feedbackId: 'Berhasil! Kasir membatalkan pungutan ganda PPN sehingga kamu menghemat Rp12.000.', deltas: { cash: 12_000, scoreSecurity: 30, scoreGoal: 25 }, isRecommended: true },
                      { id: 'c2', labelId: 'Bayar saja keduanya karena mengira semua transaksi makan kena PPN dan PBJT', feedbackId: 'Kamu membayar pajak ganda yang tidak semestinya atas makanan restoran.', deltas: { cash: -12_000, scoreSecurity: -20 } },
                    ],
                  },
                ],
                explanationCard: card({
                  why: 'Kecermatan membaca unit price, kedaluwarsa, diskon bertingkat, dan memisahkan PPN vs PBJT langsung menghemat uang tunai keluarga setiap bulan.',
                  type: 'dynamic_fact',
                  reg: REG_SOURCES.PPN_PBJT,
                  next: 'Simpan struk belanja penting sebagai bukti garansi dan pengendalian anggaran.',
                }),
              }
            ),
          ],
        },
      ],
    },

    // ================= UNIT 5 =================
    {
      id: 'S1.U5',
      unitNumber: 5,
      semesterId: 'S1',
      titleId: 'Hak Konsumen & Nilai Guna Barang',
      titleEn: 'Consumer Rights & Value for Money',
      regulationMeta: REG_SOURCES.BPOM_SNI,
      guidebook: {
        summaryId:
          'Barang termurah sering lebih mahal bila cepat rusak (Cost Per Use = Harga Beli ÷ Bulan/Pemakaian). Selalu verifikasi nomor izin BPOM di Cek BPOM untuk pangan/kosmetik dan perhatikan tanda SNI Wajib pada kategori produk listrik/elektronik yang memang diwajibkan. Simpan struk serta video unboxing, dan ingat escrow menurunkan risiko pembayaran meski tidak menjamin 0% barang cacat.',
        summaryEn: 'Cost Per Use, verifying BPOM & mandatory SNI categories, warranty types, and escrow dispute procedures.',
        keyRulesId: [
          'Cost Per Use mengukur biaya sebenarnya per bulan atau per kali pakai (tetap perhatikan kemampuan anggaran awal).',
          'Tidak semua barang elektronik masuk kategori SNI Wajib; fokus pada kelengkapan SNI untuk produk wajib (kabel, adaptor/charger, setrika, helm) dan verifikasi Cek BPOM.',
          'Sistem escrow melindungi uang agar tidak langsung cair ke penjual sebelum barang dicek, jangan pernah menyelesaikan komplain lewat transfer pribadi di luar aplikasi.',
        ],
        keyRulesEn: [
          'Cost Per Use compares durability vs upfront cost.',
          'Verify BPOM and mandatory SNI safety marks on regulated products.',
          'Keep complaints inside official platform escrow with unboxing proof.',
        ],
        disclaimerId:
          'Referensi Regulasi: UU No. 8/1999 Perlindungan Konsumen, cekbpom.pom.go.id, & daftar SNI Wajib Kemenperin/BSN.',
        disclaimerEn: 'Regulatory Reference: Indonesian Consumer Protection Law & official product registries.',
      },
      stages: [
        {
          id: 'S1.U5.ST1',
          stageNumber: '5.1',
          titleId: 'Cost Per Use, Kualitas & Hak Komplain',
          titleEn: 'Cost Per Use & Consumer Complaint Rights',
          skipExamId: 'SKIP.S1.U5.ST1',
          paths: [
            mkQuizLesson(
              'S1.U5.ST1.P1',
              'Menghitung Cost Per Use Barang Awet vs Murah',
              'Cost Per Use Calculation',
              'Membandingkan nilai pakai bulanan sepatu/alat kerja secara adil.',
              [
                {
                  id: 's1u5s1p1_q1',
                  promptId:
                    'Asumsi: dana awal mencukupi tanpa mengganggu kebutuhan mendesak. Sepatu kerja A harga Rp150.000 rata-rata tahan 3 bulan, sedangkan Sepatu B harga Rp360.000 tahan 18 bulan. Mana yang memiliki Cost Per Use per bulan lebih hemat?',
                  promptEn: 'Shoe A Rp150,000 lasts 3 months vs Shoe B Rp360,000 lasts 18 months. Lower monthly Cost Per Use?',
                  optionsId: [
                    'Sepatu B lebih hemat biaya pakai per bulannya',
                    'Sepatu A lebih hemat biaya pakai per bulannya',
                    'Biaya pakai bulanan kedua sepatu sama persis',
                    'Sepatu B tetap lebih boros tiap bulan dipakai',
                  ],
                  optionsEn: [
                    'Shoe B costs less per month of wear',
                    'Shoe A costs less per month of wear',
                    'Both shoes carry identical monthly cost',
                    'Shoe B remains costlier each month worn',
                  ],
                  correctIndex: 0,
                  explanationCard: card({
                    why: 'Cost Per Use = Harga Beli ÷ Lama Pakai. Membeli berulang barang cepat jebol dalam 18 bulan memakan 6 × Rp150.000 = Rp900.000 dibanding Rp360.000!',
                    calc: 'A = 150.000 ÷ 3 bln = Rp50.000/bln; B = 360.000 ÷ 18 bln = Rp20.000/bln.',
                    assume: 'Berlaku dengan syarat uang Rp360rb memang tersedia atau ditabung terencana tanpa berutang bunga tinggi.',
                    next: 'Untuk barang pemakaian harian berjangka panjang, pertimbangkan keawetan dan garansi resmi daripada sekadar harga termurah.',
                    type: 'simulation_assumption',
                  }),
                },
                {
                  id: 's1u5s1p1_q2',
                  promptId:
                    '[Analitik HOTS] Dengan perbandingan Sepatu A (Rp150.000/3 bulan) vs B (Rp360.000/18 bulan), saat ini uang tunaimu tersisa Rp250.000 untuk makan 10 hari ke depan dan iuran listrik Rp80.000 besok. Tawaran cicilan paylater berbunga total Rp140.000 muncul agar bisa langsung mengambil Sepatu B hari ini. Keputusan terbaiknya adalah...',
                  promptEn: '[HOTS] Cash reserve is Rp250k with Rp80k power bill due tomorrow. Paylater adds Rp140k fee to get Shoe B today. Best choice?',
                  optionsId: [
                    'Beli Sepatu A tunai dulu sambil menabung selisih Rp20rb/bln untuk Sepatu B',
                    'Ambil Sepatu B pakai paylater agar langsung menikmati Cost Per Use terendah',
                    'Gunakan dana listrik untuk beli Sepatu B lalu bayar listrik bulan depan',
                    'Beli kedua pasang sekaligus secara mencicil agar sepatu cadangan tersedia',
                  ],
                  optionsEn: [
                    'Buy Shoe A cash now while saving intentionally for Shoe B next cycle',
                    'Take Shoe B on paylater right away to lock in lower Cost Per Use',
                    'Use electricity cash for Shoe B and postpone utility bills next month',
                    'Buy both pairs via installments to guarantee an extra spare pair',
                  ],
                  correctIndex: 0,
                  explanationCard: card({
                    why: 'Cost Per Use terendah (C5 evaluasi) TIDAK boleh mengorbankan likuiditas kebutuhan wajib hari ini atau memicu bunga utang konsumtif yang menggerus hematnya.',
                    calc: 'Sepatu B + biaya cicilan Rp140.000 = Rp500.000 total. Membeli A tunai menjaga kebutuhan makan & listrik aman tanpa denda keterlambatan.',
                    next: 'Sesuaikan pembelian barang awet dengan kecukupan dana siap pakai terlebih dahulu; tunda atau tabung bertahap jika kas sedang tipis.',
                    type: 'simulation_assumption',
                  }),
                },
              ]
            ),
            mkKokiLesson(
              'S1.U5.ST1.P2',
              'Sortir Produk Aman, Cek BPOM & SNI Wajib',
              'Sort Safe vs Risky Products',
              'Memilah indikator produk terverifikasi & sistem pembayaran resmi vs berisiko.',
              {
                instructionId: 'Pilah indikator belanja berikut ke Aman & Terverifikasi atau Berisiko / Perlu Verifikasi Ulang.',
                instructionEn: 'Sort product safety and transaction indicators.',
                buckets: [
                  { id: 'AMAN', labelId: 'AMAN & TERVERIFIKASI', labelEn: 'SAFE & VERIFIED', icon: '🛡️' },
                  { id: 'RISIKO', labelId: 'BERISIKO / ABAIKAN', labelEn: 'RISKY / AVOID', icon: '⚠️' },
                ],
                items: [
                  { id: 'u5_1', contextTagId: 'Belanja skincare/pangan', labelId: 'Produk dengan nomor izin aktif terverifikasi di Cek BPOM & tanggal kedaluwarsa jelas', labelEn: 'Active BPOM verified product + expiry', correctBucketId: 'AMAN', explanationCard: card({ why: 'Pengecekan nomor registrasi langsung di Cek BPOM (cekbpom.pom.go.id) memastikan bukan label BPOM palsu/kedaluwarsa.', type: 'dynamic_fact', reg: REG_SOURCES.BPOM_SNI, next: 'Jangan hanya percaya gambar logo BPOM di iklan; cocokkan nomornya.' }) },
                  { id: 'u5_2', contextTagId: 'Alat listrik rumah', labelId: 'Setrika/kabel/adaptor kategori SNI Wajib berlogo SNI resmi & kartu garansi pabrikan', labelEn: 'Mandatory SNI electrical gear + official warranty', correctBucketId: 'AMAN', explanationCard: card({ why: 'Barang listrik tertentu termasuk daftar SNI Wajib untuk keamanan arus pendek/kebakaran; tidak semua kategori elektronik terkena SNI Wajib, namun produk kelistrikan ini krusial dicek.', type: 'dynamic_fact', reg: REG_SOURCES.BPOM_SNI, next: 'Simpan kartu garansi resmi dan struk pembelian.' }) },
                  { id: 'u5_3', contextTagId: 'Belanja daring', labelId: 'Checkout lewat Official Store ber-escrow aplikasi sambil tetap rekam video unboxing', labelEn: 'Official Store + escrow + unboxing video', correctBucketId: 'AMAN', explanationCard: card({ why: 'Escrow menahan dana dari penjual hingga barang dikonfirmasi pembeli (menurunkan risiko penipuan transfer, meski tidak menjamin 0% cacat fisik sehingga video unboxing tetap wajib).', next: 'Jangan pernah klik Selesai sebelum membuka dan mencoba barang.' }) },
                  { id: 'u5_4', contextTagId: 'Iklan kosmetik murah', labelId: 'Krim wajah super murah tanpa nomor registrasi BPOM dengan klaim "putih instan 2 hari"', labelEn: 'Unregistered cream claiming 2-day miracle', correctBucketId: 'RISIKO', explanationCard: card({ why: 'Klaim instan tanpa izin edar BPOM berisiko mengandung bahan kimia berbahaya.', next: 'Kesehatan jangka panjang jauh lebih mahal dari harga krim murah.' }) },
                  { id: 'u5_5', contextTagId: 'Penjual minta pindah kanal', labelId: 'Penjual e-commerce meminta transfer langsung ke rekening pribadi di luar sistem aplikasi demi diskon', labelEn: 'Seller asks direct transfer outside escrow', correctBucketId: 'RISIKO', explanationCard: card({ why: 'Keluar dari escrow menghilangkan perlindungan pengembalian dana resmi platform bila barang cacat atau tak dikirim.', next: 'Tetap transaksi 100% di dalam sistem resmi marketplace.' }) },
                  { id: 'u5_6', contextTagId: 'Adaptor murah tak aman', labelId: 'Kepala charger murahan tanpa SNI Wajib & tanpa label daya jelas yang sangat panas saat dicolok', labelEn: 'Unverified overheating cheap charger', correctBucketId: 'RISIKO', explanationCard: card({ why: 'Adaptor listrik berkualitas buruk berisiko merusak baterai gawai atau memicu korsleting.', next: 'Utamakan standar keselamatan dan garansi resmi untuk aksesori daya.' }) },
                ],
              },
              { st: 'dynamic_fact', reg: REG_SOURCES.BPOM_SNI }
            ),
            mkWordleLesson(
              'S1.U5.ST1.P3',
              'Kosakata Perlindungan Konsumen',
              'Consumer Protection Terms',
              'Menguasai kosakata garansi, retur, struk, dan mutu.',
              [
                { word: 'GARANSI', clueId: 'Jaminan perbaikan atau penggantian barang dari pabrikan/toko dalam jangka waktu tertentu.', clueEn: 'Product warranty guarantee.', definitionId: 'Hak perbaikan atau penggantian produk cacat sesuai syarat kartu jaminan resmi.', definitionEn: 'Manufacturer or seller coverage for defects.', exampleId: 'Garansi resmi pabrikan berlaku di service center nasional.', exampleEn: 'Official warranty honored nationwide.' },
                { word: 'RETUR', clueId: 'Pengembalian barang cacat/tak sesuai pesanan untuk tukar barang atau refund dana.', clueEn: 'Returning defective items for refund or exchange.', definitionId: 'Mekanisme pengajuan pengembalian produk ke penjual beserta bukti sah.', definitionEn: 'Formal return process with evidence.', exampleId: 'Mengajukan retur lewat menu komplain sebelum menekan Pesanan Selesai.', exampleEn: 'Filing return inside the app before completing order.' },
                { word: 'STRUK', clueId: 'Bukti tertulis transaksi pembayaran yang wajib disimpan untuk klaim garansi atau audit.', clueEn: 'Proof of payment receipt.', definitionId: 'Tanda terima rincian pembelian, harga, pajak, dan tanggal transaksi.', definitionEn: 'Itemized payment confirmation.', exampleId: 'Menyimpan foto struk elektronik agar klaim garansi laptop tidak ditolak.', exampleEn: 'Keeping receipt copy for warranty claims.' },
                { word: 'MUTU', clueId: 'Tingkat kualitas dan kelayakan fungsi suatu produk dibanding standar resmi.', clueEn: 'Product quality level.', definitionId: 'Ukuran daya tahan, keamanan, dan kesesuaian spesifikasi barang bagi konsumen.', definitionEn: 'Quality and safety conformance.', exampleId: 'Produk bermutu berizin BPOM/SNI lebih aman daripada barang tiruan tanpa standar.', exampleEn: 'Certified goods offer safer quality.' },
              ]
            ),
            mkPairLesson(
              'S1.U5.ST1.P4',
              'Urutan Prosedur Komplain Barang Cacat (Escrow)',
              'Escrow Complaint Flow',
              'Mengurutkan langkah komplain yang melindungi dana pembeli.',
              {
                mode: 'sequence',
                instructionId: 'Urutkan 5 langkah komplain barang belanja online yang datang rusak agar dana tetap terlindungi escrow!',
                instructionEn: 'Order the 5 steps to file an online defective-item dispute safely.',
                sequenceSteps: [
                  { id: 'c1', labelId: 'Rekam video unboxing utuh sejak paket tersegel sebelum dibuka', labelEn: 'Record continuous unboxing video from sealed state', order: 1 },
                  { id: 'c2', labelId: 'JANGAN klik tombol "Pesanan Selesai" pada aplikasi belanja', labelEn: 'Do NOT click Order Completed', order: 2 },
                  { id: 'c3', labelId: 'Ajukan komplain / pengembalian dana melalui tombol resmi di aplikasi + unggah bukti', labelEn: 'Submit dispute inside official app with video proof', order: 3 },
                  { id: 'c4', labelId: 'Tolak permintaan penjual agar menyelesaikan komplain di luar aplikasi lewat transfer WA', labelEn: 'Refuse off-platform settlement via personal chat', order: 4 },
                  { id: 'c5', labelId: 'Kirim balik barang via resi resmi komplain & terima pengembalian dana otomatis', labelEn: 'Return via platform tracking & receive refund', order: 5 },
                ],
                explanationCard: card({
                  why: 'Selama tombol "Pesanan Selesai" belum ditekan dan transaksi tidak keluar platform, dana tetap ditahan di rekening bersama (escrow) sehingga hak pembeli terlindungi.',
                  next: 'Jadikan rekaman video unboxing tanpa jeda sebagai kebiasaan rutin untuk setiap paket elektronik atau barang bernilai.',
                }),
              }
            ),
            mkStoryLesson(
              'S1.U5.ST1.P5',
              'Belanja di Tengah Festival Diskon',
              'Smart Discount Festival',
              'Menghitung Cost Per Use, verifikasi izin resmi, dan menyelesaikan retur barang cacat.',
              {
                titleId: 'Anggaran Belanja di Tengah Festival Diskon',
                subtitleId: 'Simulasi 3 Babak Uji Kualitas, Legalitas BPOM/SNI & Prosedur Escrow',
                durationLabelId: '3 Babak Simulasi',
                initialState: { cash: 500_000, emergencyFund: 0, sinkingFund: 0, debt: 0, netWorth: 500_000 },
                chapters: [
                  {
                    id: 'u5_b1',
                    periodLabelId: 'Babak 1: Pilih Sepatu & Aksesori Listrik',
                    narrativeId: 'Kamu butuh kabel daya kerja & sepatu kerja. Ada opsi murah cepat rusak tanpa SNI/garansi vs berlabel SNI Wajib & awet (Cost Per Use lebih rendah).',
                    choices: [
                      { id: 'c1', labelId: 'Pilih barang berlabel SNI Wajib/garansi resmi dengan Cost Per Use terendah dalam batas anggaran', feedbackId: 'Cermat! Biaya per bulan jauh lebih ringan dan bebas risiko alat cepat panas berbahaya.', deltas: { cash: -350_000, netWorth: 50_000, scoreCashflow: 25, scoreRisk: 25 }, isRecommended: true },
                      { id: 'c2', labelId: 'Beli versi KW termurah tanpa garansi dan tanpa label keselamatan listrik', feedbackId: 'Barang cepat rusak dalam 2 bulan sehingga harus keluar biaya beli lagi.', deltas: { cash: -180_000, netWorth: -100_000, scoreRisk: -20 } },
                    ],
                  },
                  {
                    id: 'u5_b2',
                    periodLabelId: 'Babak 2: Tawaran Transfer di Luar Aplikasi',
                    narrativeId: 'Penjual di chat menawarkan potongan tambahan Rp25.000 jika kamu membatalkan order di aplikasi dan transfer langsung ke rekening pribadinya.',
                    choices: [
                      { id: 'c1', labelId: 'Tolak tegas & tetap checkout melalui sistem escrow aplikasi setelah mengecek ulasan/izin produk', feedbackId: 'Aman! Escrow melindungi uangmu tetap aman sampai barang tiba sesuai pesanan.', deltas: { scoreSecurity: 30, scoreGoal: 20 }, isRecommended: true },
                      { id: 'c2', labelId: 'Transfer pribadi langsung demi diskon Rp25.000 lalu penjual menghilang', feedbackId: 'Tanpa escrow, uang sulit ditarik kembali dan penjual memblokir chat!', deltas: { cash: -150_000, scoreSecurity: -30 } },
                    ],
                  },
                  {
                    id: 'u5_b3',
                    periodLabelId: 'Babak 3: Barang Tiba Retak',
                    narrativeId: 'Saat membuka paket sambil merekam video unboxing, casing barang retak. Penjual membujukmu klik "Pesanan Selesai" dulu baru katanya akan transfer pengganti.',
                    choices: [
                      { id: 'c1', labelId: 'JANGAN klik selesai; ajukan retur resmi di aplikasi melampirkan video unboxing', feedbackId: 'Tepat! Dana berhasil dikembalikan 100% melalui sistem sengketa resmi.', deltas: { scoreSecurity: 25, scoreGoal: 25 }, isRecommended: true },
                      { id: 'c2', labelId: 'Klik "Pesanan Selesai" supaya cepat selesai lalu menunggu janji penjual', feedbackId: 'Setelah klik selesai, dana terlanjur diteruskan ke penjual dan posisi tawarmu melemah.', deltas: { cash: -100_000, scoreSecurity: -20 } },
                    ],
                  },
                ],
                explanationCard: card({
                  why: 'Menggabungkan hitung Cost Per Use, verifikasi izin BPOM/SNI Wajib, dan disiplin transaksi lewat escrow menjaga kualitas sekaligus uangmu.',
                  type: 'dynamic_fact',
                  reg: REG_SOURCES.BPOM_SNI,
                  next: 'Siapkan dirimu untuk menghadapi Gerbang UAS Semester 1!',
                }),
              }
            ),
          ],
        },
      ],
    },
  ],
  uts: buildUTS('S1', 'UTS Semester 1: Uang, Rupiah & Konsumsi Cerdas', 'Unit 1–3', ['S1.U1', 'S1.U2', 'S1.U3']),
  uas: buildUAS(
    'S1',
    'UAS Semester 1: Evaluasi Fondasi Transaksi & Nilai',
    'Unit 1–5',
    ['S1.U1', 'S1.U2', 'S1.U3', 'S1.U4', 'S1.U5'],
    'Proyek Kelola Kas Belanja Keluarga 6 Bulan',
    6,
    {
      isPerformanceProject: true,
      titleId: 'Proyek UAS S1: Kelola Kas Belanja Keluarga 6 Bulan',
      subtitleId: 'Bagian 2 Proyek Kinerja · Bobot 50%: Uji Nilai Pakai, Struk & Keamanan Tunai',
      durationLabelId: '6 Bulan Virtual',
      initialState: { cash: 3_000_000, emergencyFund: 500_000, sinkingFund: 0, debt: 0, netWorth: 3_500_000 },
      chapters: [
        {
          id: 's1_uas_m1',
          periodLabelId: 'Bulan 1–2: Prioritas & Godaan Flash Sale',
          narrativeId:
            'Kamu menerima anggaran belanja bulanan tetap Rp3.000.000. Kebutuhan pokok keluarga Rp2.200.000 sudah menunggu, bersamaan dengan godaan Flash Sale gadget aksesori Rp650.000.',
          choices: [
            { id: 'c1', labelId: 'Penuhi kebutuhan pokok dulu & sisihkan Rp500.000 ke cadangan; tunda aksesoris non-mendesak', feedbackId: 'Arus kas aman surplus dan cadangan keluarga bertambah kuat.', deltas: { cash: 300_000, emergencyFund: 500_000, scoreCashflow: 25, scoreGoal: 25 }, isRecommended: true },
            { id: 'c2', labelId: 'Checkout Flash Sale Rp650rb lalu potong jatah lauk bergizi anak', feedbackId: 'Kebutuhan primer terganggu oleh pembelian impulsif!', deltas: { cash: -650_000, scoreCashflow: -20, scoreGoal: -20 } },
          ],
        },
        {
          id: 's1_uas_m3',
          periodLabelId: 'Bulan 3–4: Cek Struk Restoran & Uang Rusak',
          narrativeId:
            'Saat makan keluarga, kasir mencantumkan PBJT 10% sekaligus PPN 12%. Di minggu sama, ada uang Rp100.000 robek tersisa > 2/3 ukuran asli dan nomor serinya lengkap.',
          choices: [
            { id: 'c1', labelId: 'Koreksi tagihan PPN ganda restoran dengan sopan & jadwalkan tukar uang rusak ke PINTAR BI', feedbackId: 'Pengeluaran tidak sah tercegah & uang Rp100.000 berhasil ditukar penuh tanpa biaya calo!', deltas: { cash: 120_000, scoreSecurity: 30, scoreRisk: 20 }, isRecommended: true },
            { id: 'c2', labelId: 'Bayar pajak ganda begitu saja & buang/jual murah uang sobek Rp100.000 ke calo Rp70.000', feedbackId: 'Kehilangan Rp30.000 di calo plus membayar pajak ganda restoran.', deltas: { cash: -150_000, scoreSecurity: -25 } },
          ],
        },
        {
          id: 's1_uas_m5',
          periodLabelId: 'Bulan 5–6: Cost Per Use & Sengketa Paket Rusak',
          narrativeId:
            'Sepatu kerja rusak dan kamu butuh beli baru (pilih murah Rp120rb cepat jebol vs awet Rp300rb bergaransi), lalu saat paket elektronik tiba pecah, penjual membujukmu klik Selesai dulu.',
          choices: [
            { id: 'c1', labelId: 'Pilih barang tahan lama (Cost Per Use rendah) via escrow resmi & ajukan retur aplikasi berbekal video unboxing tanpa klik Selesai', feedbackId: 'Nilai pakai jangka panjang optimal dan dana sengketa terselamatkan penuh!', deltas: { cash: 200_000, netWorth: 200_000, scoreRisk: 25, scoreSecurity: 25, scoreGoal: 25 }, isRecommended: true },
            { id: 'c2', labelId: 'Beli barang murah cepat rusak di luar aplikasi lalu gagal komplain paket pecah', feedbackId: 'Terjadi pemborosan ganda & kerugian barang cacat tanpa perlindungan escrow.', deltas: { cash: -450_000, scoreRisk: -25, scoreSecurity: -25 } },
          ],
        },
      ],
      explanationCard: card({
        why: 'Kamu lulus proyek Semester 1 apabila mampu menjaga arus kas bulanan tetap positif, mengutamakan kebutuhan primer, teliti membaca struk/uang 3D, serta melindungi dana lewat escrow.',
        type: 'simulation_assumption',
        next: 'Semester 2 akan memperluas keterampilanmu ke rekening bank, transfer BI-FAST/SKNBI/RTGS, QRIS, dan anggaran Sinking Fund!',
      }),
    }
  ),
};
