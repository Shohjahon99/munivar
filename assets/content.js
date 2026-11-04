/* =========================================================
   MUNIVAR — sayt mazmuni.
   Matnlar 3 tilda: { uz, ru, en }. Rasm/video — /media papkasida.
   Bo'sh ro'yxat (items: []) bo'lsa, o'sha bo'lim ko'rsatilmaydi.
   ========================================================= */
window.SITE = {
  langs: ["uz", "ru", "en"],
  defaultLang: "uz",

  // true — haqiqiy ma'lumot yo'q bo'limlarda "samples" (namuna) ko'rsatiladi, "Namuna" belgisi bilan.
  // Haqiqiy ma'lumot kiritilgan bo'limda namuna avtomatik ishlatilmaydi. Hammasi tayyor bo'lgach: false.
  demo: true,

  brand: {
    name: "MUNIVAR",
    mark: "media/brand/mark.png",   // shaffof emblema (CSS orqali ranglanadi)
    city: { uz: "Toshkent", ru: "Ташкент", en: "Tashkent" },
    tagline: { uz: "Nafosat va o'ziga xoslik", ru: "Изящество и индивидуальность", en: "Elegance and individuality" }
  },

  // Saytning internetdagi manzili (SEO, ulashish havolalari uchun). Domen ulansa shu yer o'zgaradi.
  siteUrl: "https://munivar.uz/",

  contacts: {
    phones: ["+998 90 126 25 80", "+998 98 126 25 80"],
    instagram: "munivar_2019",
    telegram: "muslimam_libas_2019",   // username yoki to'liq havola
    telegramLabel: { uz: "MUNIVAR kanali", ru: "Канал MUNIVAR", en: "MUNIVAR channel" },
    whatsapp: ""           // masalan: "998901262580"
  },

  // Buyurtma va arizalar shu Telegram akkauntiga xabar bo'lib boradi (kanal emas, shaxsiy akkaunt bo'lishi kerak)
  orderTelegram: "muslimam_libas_2019",

  // Ixtiyoriy server (Telegram bot). Bo'sh bo'lsa ariza to'g'ridan-to'g'ri Telegram chatga yuboriladi.
  //  - Cloudflare Worker: "https://munivar-order.<akkaunt>.workers.dev"
  //  - PHP hosting: "api/send.php"
  orderEndpoint: "https://adjxdgfifzmepjrxdbte.supabase.co/functions/v1/munivar-order",

  // Mahsulotlar (admin panel shu yerga saqlaydi). Topilmasa data/products.json ishlatiladi.
  productsUrl: "https://adjxdgfifzmepjrxdbte.supabase.co/storage/v1/object/public/munivar/products.json",

  // Showroom — address bo'sh bo'lsa bo'lim ko'rinmaydi va formada "Showroomga tashrif" varianti yashiriladi
  showroom: {
    address: { uz: "Toshkent, Olmazor tumani, Qiziltut ko'chasi, 51", ru: "Ташкент, Алмазарский район, ул. Кызылтут, 51", en: "51 Qiziltut St, Olmazor district, Tashkent" },
    landmark: { uz: "Marwa hotel", ru: "Отель Marwa", en: "Marwa Hotel" },
    hours: { uz: "Har kuni: 9:00 – 21:00", ru: "Ежедневно: 9:00 – 21:00", en: "Daily: 9:00 am – 9:00 pm" },
    lat: 41.326849, lng: 69.229467,
    mapLink: "https://yandex.uz/maps/10335/tashkent/house/qiziltut_ko_chasi_51/YkAYdAVpTUMAQFprfX9zd3RnbQ==/?ll=69.229467%2C41.326850&z=17"
  },

  hero: {
    video: "media/video/hero.mp4",
    videoMobile: "media/video/hero-mobile.mp4",
    poster: "media/video/hero-poster.jpg",
    posterMobile: "media/video/hero-poster-mobile.jpg",
    kicker: { uz: "Fashion Week podiumida", ru: "На подиуме Fashion Week", en: "On the Fashion Week runway" },
    lead: {
      uz: "Zamonaviy ayolning nafisligi, didi va individualligini ifodalovchi premium liboslar.",
      ru: "Премиальные платья, выражающие изящество, вкус и индивидуальность современной женщины.",
      en: "Premium dresses that express the elegance, taste and individuality of the modern woman."
    }
  },

  trust: [
    { n: { uz: "11 yil", ru: "11 лет", en: "11 years" }, l: { uz: "Moda sohasida tajriba", ru: "опыта в моде", en: "in fashion" } },
    { n: "Fashion Week", l: { uz: "Podium namoyishi", ru: "Показ на подиуме", en: "Runway show" } },
    { n: { uz: "Qo'lda", ru: "Вручную", en: "Handmade" }, l: { uz: "Kashta va munchoq bezak", ru: "Вышивка и бисер", en: "Embroidery & beadwork" } },
    { n: { uz: "Individual", ru: "Индивидуально", en: "Bespoke" }, l: { uz: "O'lchov bo'yicha tikish", ru: "Пошив по меркам", en: "Made to measure" } }
  ],

  looks: {
    cats: [
      { id: "all",   t: { uz: "Barchasi", ru: "Все", en: "All" } },
      { id: "qora",  t: { uz: "Qora nafislik", ru: "Чёрная классика", en: "Black elegance" } },
      { id: "naqsh", t: { uz: "Naqshli kapa", ru: "Кейп с узором", en: "Embroidered cape" } },
      { id: "moviy", t: { uz: "Havorang", ru: "Небесный", en: "Sky blue" } },
      { id: "bordo", t: { uz: "Bordo gullar", ru: "Бордовые цветы", en: "Burgundy blooms" } }
    ],
    // img: media/looks/look-XX-700.webp va -1400.webp
    items: [
      { cat: "moviy", img: "10" }, { cat: "qora",  img: "02" }, { cat: "naqsh", img: "08" },
      { cat: "bordo", img: "18" }, { cat: "moviy", img: "14" }, { cat: "naqsh", img: "05" },
      { cat: "qora",  img: "03" }, { cat: "bordo", img: "16" }, { cat: "moviy", img: "09" },
      { cat: "qora",  img: "12" }, { cat: "naqsh", img: "07" }, { cat: "moviy", img: "13" },
      { cat: "qora",  img: "19" }, { cat: "moviy", img: "11" }, { cat: "naqsh", img: "06" },
      { cat: "bordo", img: "17" }, { cat: "qora",  img: "04" }, { cat: "moviy", img: "15" }
    ]
  },

  craft: [
    { img: "media/craft/kashta.webp",
      t: { uz: "Rangli kashta", ru: "Цветная вышивка", en: "Colour embroidery" },
      d: { uz: "Nafis naqshlar, payetka va munchoq popuklar bilan boyitilgan kapa.",
           ru: "Изысканный узор, пайетки и бисерная бахрома на кейпе.",
           en: "Intricate patterns finished with sequins and beaded fringe." } },
    { img: "media/craft/gullar.webp",
      t: { uz: "Hajmli gullar", ru: "Объёмные цветы", en: "3D blooms" },
      d: { uz: "Matodan qo'lda yasalgan gullar va qora munchoq bezaklar.",
           ru: "Цветы из ткани ручной работы и чёрный бисер.",
           en: "Hand-shaped fabric flowers with black bead detailing." } },
    { img: "media/craft/munchoq.webp",
      t: { uz: "Munchoq va payetka", ru: "Бисер и пайетки", en: "Beads & sequins" },
      d: { uz: "Yelkadan tushuvchi gul naqshlari — har bir chok qo'l mehnati.",
           ru: "Цветочный узор, спадающий с плеч — каждый стежок вручную.",
           en: "Floral work cascading from the shoulders — every stitch by hand." } }
  ],

  // "Qanday obrazga libos qidirdingiz?" — bosilganda buyurtma formasi shu tanlov bilan ochiladi
  occasions: [
    { uz: "Marry me uchun", ru: "Для «Marry me»", en: "For a “Marry me” moment" },
    { uz: "To'y egalari uchun", ru: "Для хозяев свадьбы", en: "For the wedding hosts" },
    { uz: "Kelinga sovg'aga", ru: "В подарок невесте", en: "As a gift for the bride" },
    { uz: "Look liboslar", ru: "Look-платья", en: "Look dresses" }
  ],

  // Yulduzlar fikri — ma'lumot kelganda to'ldiriladi
  stars: [],
  // Mijozlar fikri. Ikki xil yozish mumkin:
  //   { q: {uz,ru,en}, who: "Dilnoza · Toshkent", photo: "media/reviews/1.webp" }   — matnli fikr
  //   { shot: "media/reviews/s1.webp" }                                             — Instagram/Telegram skrinshoti
  reviews: [],

  // Ko'p so'raladigan savollar. Javobi (a) bo'sh savollar ko'rsatilmaydi.
  faq: [
    { q: { uz: "Libos tikish qancha vaqt oladi?", ru: "Сколько времени занимает пошив?", en: "How long does tailoring take?" },
      a: { uz: "", ru: "", en: "" } },
    { q: { uz: "Tayyor liboslar bormi yoki faqat buyurtma asosidami?", ru: "Есть ли готовые платья или только на заказ?", en: "Do you have ready-made dresses or only made to order?" },
      a: { uz: "", ru: "", en: "" } },
    { q: { uz: "O'lchovni qanday beraman? Showroomga kelishim shartmi?", ru: "Как передать мерки? Обязательно ли приходить в шоурум?", en: "How do I give my measurements? Do I have to visit the showroom?" },
      a: { uz: "", ru: "", en: "" } },
    { q: { uz: "Narxlar qancha turadi?", ru: "Сколько стоят платья?", en: "How much do the dresses cost?" },
      a: { uz: "", ru: "", en: "" } },
    { q: { uz: "To'lov qanday amalga oshiriladi? Oldindan to'lov bormi?", ru: "Как происходит оплата? Нужна ли предоплата?", en: "How does payment work? Is a deposit required?" },
      a: { uz: "", ru: "", en: "" } },
    { q: { uz: "Viloyatlarga va chet elga yetkazib berasizmi?", ru: "Доставляете ли в регионы и за рубеж?", en: "Do you deliver to other regions and abroad?" },
      a: { uz: "", ru: "", en: "" } },
    { q: { uz: "Rang yoki modelni o'zgartirib tiktirsa bo'ladimi?", ru: "Можно ли изменить цвет или модель?", en: "Can I change the colour or the design?" },
      a: { uz: "", ru: "", en: "" } },
    { q: { uz: "Libos mos kelmasa, tuzatib berasizmi?", ru: "Если платье не подойдёт, вы его подгоните?", en: "If the dress doesn't fit, will you alter it?" },
      a: { uz: "", ru: "", en: "" } }
  ],

  founder: {
    name: { uz: "Muslima To'lqunova", ru: "Муслима Тулкунова", en: "Muslima Tulkunova" },
    photo: "",   // asoschi surati bo'lsa: "media/brand/founder.webp" — dizayner kartochkasida chiqadi
    // Bo'lim kompozitsiyasi: katta rasm + kichik detal
    images: ["media/looks/look-13-1400.webp", "media/craft/gullar.webp"],
    role: { uz: "Asoschi va dizayner", ru: "Основатель и дизайнер", en: "Founder & designer" },
    exp: { uz: "Modada 11 yillik tajriba", ru: "11 лет в моде", en: "11 years in fashion" },
    about: {
      uz: "MUNIVAR — zamonaviy ayolning nafisligi, didi va individualligini ifodalovchi premium liboslar brendi.",
      ru: "MUNIVAR — премиальный бренд одежды, выражающий изящество, вкус и индивидуальность современной женщины.",
      en: "MUNIVAR is a premium womenswear brand expressing the elegance, taste and individuality of the modern woman."
    },
    bio: {
      uz: "Har bir kolleksiya dizayner Muslima To'lqunovaning tajribasi, ijodiy qarashlari va ayol go'zalligiga bo'lgan yondashuvi asosida yaratiladi.",
      ru: "Каждая коллекция создаётся на основе опыта, творческого видения и подхода к женской красоте дизайнера Муслимы Тулкуновой.",
      en: "Every collection is shaped by designer Muslima Tulkunova's experience, creative vision and approach to feminine beauty."
    },
    motto: {
      uz: "Har bir libosda o'ziga xoslik, har bir ayolda betakrorlik.",
      ru: "В каждом платье — своеобразие, в каждой женщине — неповторимость.",
      en: "Distinction in every dress, uniqueness in every woman."
    }
  }
};

/* Interfeys matnlari */
window.UI = {
  uz: {
    nav: ["Do'kon", "Kolleksiya", "Brend haqida", "Showroom", "Aloqa"],
    order: "Buyurtma berish", seeCollection: "Kolleksiyani ko'rish", swipe: "← Suring →",
    looksEyebrow: "Kolleksiya", looksTitle: "Liboslar", looksLead: "Siz uchun qaysi libos?",
    craftEyebrow: "Hunar", craftTitle: "Har bir chok — qo'lda",
    occEyebrow: "Qanday tadbirga?",
    starsEyebrow: "Ishonch", starsTitle: "Yulduzlar tanlovi",
    revEyebrow: "Fikrlar", revTitle: "Mijozlarimiz fikri",
    founderEyebrow: "Brend haqida", ig: "Instagram profili →",
    orderEyebrow: "Buyurtma", orderTitle: "Libosingizni buyurtma qiling",
    orderLead: "O'lchov bo'yicha individual tikish. Showroomga tashrif yoki online buyurtma.",
    consult: "Konsultatsiyaga yozilish", phone: "Telefon",
    mIntro: "Sizga mos obraz tanlashimiz uchun ariza qoldiring — tez orada bog'lanamiz.",
    qType: "Online buyurtma yoki showroomga tashrif?", tOnline: "Online buyurtma", tVisit: "Showroomga tashrif",
    qName: "Ism-familiyangiz", pName: "Ismingiz", qPhone: "Telefon raqamingiz", send: "Yuborish", sending: "Yuborilmoqda…",
    errFill: "Iltimos, barcha maydonlarni to'ldiring.", ok: "Rahmat! Arizangiz qabul qilindi, tez orada bog'lanamiz.",
    errSend: "Yuborib bo'lmadi. Iltimos, telefon orqali bog'laning:", alt: "yoki qo'ng'iroq qiling:",
    footDesc: "Premium ayollar liboslari brendi. Qo'lda kashta, munchoq va nafis bichim.",
    footMeta: "O'zbekiston", close: "Yopish", prev: "Oldingi", next: "Keyingi", sound: "Ovoz", menu: "Menyu"
  },
  ru: {
    nav: ["Магазин", "Коллекция", "О бренде", "Шоурум", "Контакты"],
    order: "Заказать", seeCollection: "Смотреть коллекцию", swipe: "← Листайте →",
    looksEyebrow: "Коллекция", looksTitle: "Платья", looksLead: "Какое платье для вас?",
    craftEyebrow: "Ремесло", craftTitle: "Каждый стежок — вручную",
    occEyebrow: "Для какого события?",
    starsEyebrow: "Доверие", starsTitle: "Выбор звёзд",
    revEyebrow: "Отзывы", revTitle: "Отзывы клиентов",
    founderEyebrow: "О бренде", ig: "Профиль в Instagram →",
    orderEyebrow: "Заказ", orderTitle: "Закажите своё платье",
    orderLead: "Индивидуальный пошив по меркам. Визит в шоурум или онлайн-заказ.",
    consult: "Записаться на консультацию", phone: "Телефон",
    mIntro: "Оставьте заявку — мы подберём для вас образ и скоро свяжемся.",
    qType: "Онлайн-заказ или визит в шоурум?", tOnline: "Онлайн-заказ", tVisit: "Визит в шоурум",
    qName: "Имя и фамилия", pName: "Ваше имя", qPhone: "Номер телефона", send: "Отправить", sending: "Отправка…",
    errFill: "Пожалуйста, заполните все поля.", ok: "Спасибо! Заявка принята, мы скоро свяжемся.",
    errSend: "Не удалось отправить. Пожалуйста, позвоните:", alt: "или позвоните:",
    footDesc: "Премиальный бренд женской одежды. Ручная вышивка, бисер и изящный крой.",
    footMeta: "Узбекистан", close: "Закрыть", prev: "Назад", next: "Вперёд", sound: "Звук", menu: "Меню"
  },
  en: {
    nav: ["Shop", "Collection", "About", "Showroom", "Contact"],
    order: "Order now", seeCollection: "View collection", swipe: "← Swipe →",
    looksEyebrow: "Collection", looksTitle: "Dresses", looksLead: "Which dress is yours?",
    craftEyebrow: "Craft", craftTitle: "Every stitch by hand",
    occEyebrow: "For which occasion?",
    starsEyebrow: "Trust", starsTitle: "Chosen by stars",
    revEyebrow: "Reviews", revTitle: "What clients say",
    founderEyebrow: "About the brand", ig: "Instagram profile →",
    orderEyebrow: "Order", orderTitle: "Order your dress",
    orderLead: "Bespoke tailoring to your measurements. Visit the showroom or order online.",
    consult: "Book a consultation", phone: "Phone",
    mIntro: "Leave a request and we'll help you choose your look — we'll be in touch soon.",
    qType: "Online order or showroom visit?", tOnline: "Online order", tVisit: "Showroom visit",
    qName: "Full name", pName: "Your name", qPhone: "Phone number", send: "Send", sending: "Sending…",
    errFill: "Please fill in all fields.", ok: "Thank you! Your request has been received — we'll contact you soon.",
    errSend: "Couldn't send. Please call us:", alt: "or call:",
    footDesc: "Premium womenswear brand. Hand embroidery, beadwork and refined cuts.",
    footMeta: "Uzbekistan", close: "Close", prev: "Previous", next: "Next", sound: "Sound", menu: "Menu"
  }
};

/* Qo'shimcha interfeys matnlari: libos so'rash, showroom, savol-javob */
Object.assign(window.UI.uz, {
  lookLabel: "Libos", askLook: "Shu libosni so'rash", chosenLook: "Tanlangan libos", removeLook: "Olib tashlash",
  showEyebrow: "Showroom", showTitle: "Bizga tashrif buyuring", addr: "Manzil", landmarkL: "Mo'ljal", hoursL: "Ish vaqti", route: "Xaritada ochish",
  orderLeadOnline: "O'lchovingiz bo'yicha individual tikamiz. Ariza qoldiring — tez orada bog'lanamiz.",
  faqEyebrow: "Savol-javob", faqTitle: "Ko'p beriladigan savollar", faqMore: "Savolingizga javob topmadingizmi? Bizga yozing:"
});
Object.assign(window.UI.ru, {
  lookLabel: "Платье", askLook: "Запросить это платье", chosenLook: "Выбранное платье", removeLook: "Убрать",
  showEyebrow: "Шоурум", showTitle: "Приходите к нам", addr: "Адрес", landmarkL: "Ориентир", hoursL: "Часы работы", route: "Открыть на карте",
  orderLeadOnline: "Индивидуальный пошив по вашим меркам. Оставьте заявку — мы скоро свяжемся.",
  faqEyebrow: "Вопросы и ответы", faqTitle: "Частые вопросы", faqMore: "Не нашли ответ? Напишите нам:"
});
Object.assign(window.UI.en, {
  lookLabel: "Look", askLook: "Ask about this dress", chosenLook: "Selected dress", removeLook: "Remove",
  showEyebrow: "Showroom", showTitle: "Visit us", addr: "Address", landmarkL: "Landmark", hoursL: "Opening hours", route: "Open in maps",
  orderLeadOnline: "Bespoke tailoring to your measurements. Leave a request and we'll be in touch soon.",
  faqEyebrow: "FAQ", faqTitle: "Frequently asked questions", faqMore: "Didn't find your answer? Message us:"
});

/* =========================================================
   NAMUNA MA'LUMOTLAR — faqat SITE.demo = true bo'lganda, haqiqiy
   ma'lumot yo'q bo'limlarda "Namuna" belgisi bilan ko'rsatiladi.
   Haqiqiy ma'lumotlar yuqoridagi showroom / reviews / faq ga yoziladi.
   ========================================================= */
window.SITE.samples = {
  showroom: {
    address: { uz: "Toshkent shahri (aniq manzil kiritiladi)", ru: "г. Ташкент (точный адрес будет добавлен)", en: "Tashkent (exact address to be added)" },
    landmark: { uz: "Mo'ljal kiritiladi", ru: "Ориентир будет добавлен", en: "Landmark to be added" },
    hours: { uz: "Du–Sha: 10:00–19:00", ru: "Пн–Сб: 10:00–19:00", en: "Mon–Sat: 10:00–19:00" },
    lat: 41.3111, lng: 69.2797, mapLink: ""
  },
  reviews: [
    { q: { uz: "Libos kutganimdan ham chiroyli chiqdi. Kashtalari juda nafis, to'yda hamma so'radi.",
           ru: "Платье получилось даже красивее, чем я ожидала. Вышивка очень изящная — на свадьбе все спрашивали.",
           en: "The dress turned out even more beautiful than I expected. The embroidery is so delicate — everyone asked about it." },
      who: { uz: "Mijoz · Toshkent", ru: "Клиент · Ташкент", en: "Client · Tashkent" } },
    { q: { uz: "O'lchovni online berdim, libos aynan qomatimga mos keldi. Rahmat, Muslima opa!",
           ru: "Мерки передала онлайн, платье село идеально. Спасибо, Муслима!",
           en: "I sent my measurements online and the dress fit perfectly. Thank you, Muslima!" },
      who: { uz: "Mijoz · Samarqand", ru: "Клиент · Самарканд", en: "Client · Samarkand" } },
    { q: { uz: "Mato sifati va tikilishi a'lo darajada. Keyingi bayramga yana buyurtma beraman.",
           ru: "Качество ткани и пошива на высоте. К следующему празднику закажу снова.",
           en: "Excellent fabric and tailoring. I'll order again for the next celebration." },
      who: { uz: "Mijoz · Farg'ona", ru: "Клиент · Фергана", en: "Client · Fergana" } }
  ],
  // faq dagi savollar tartibida
  faqAnswers: [
    { uz: "Odatda 2–4 hafta. Aniq muddat model va bezak murakkabligiga bog'liq — konsultatsiyada aytamiz.",
      ru: "Обычно 2–4 недели. Точный срок зависит от модели и сложности отделки — уточним на консультации.",
      en: "Usually 2–4 weeks. The exact time depends on the design and embellishment — we'll confirm at the consultation." },
    { uz: "Asosan buyurtma asosida tikamiz. Ayrim modellar tayyor holda ham bo'lishi mumkin — so'rang.",
      ru: "В основном шьём на заказ. Некоторые модели могут быть в наличии — уточняйте.",
      en: "We mainly make to order. Some designs may be available ready-made — just ask." },
    { uz: "Showroomda o'lchov olamiz. Kela olmasangiz, o'lchov olish bo'yicha yo'riqnoma yuboramiz.",
      ru: "Снимем мерки в шоуруме. Если не можете прийти — отправим инструкцию по снятию мерок.",
      en: "We take measurements in the showroom. If you can't come, we'll send you a measuring guide." },
    { uz: "Narx model, mato va bezakka qarab belgilanadi. Aniq narxni konsultatsiyada aytamiz.",
      ru: "Цена зависит от модели, ткани и отделки. Точную стоимость назовём на консультации.",
      en: "Pricing depends on the design, fabric and embellishment. We'll quote the exact price at the consultation." },
    { uz: "Buyurtma oldindan to'lov bilan qabul qilinadi, qolgan qismi libos topshirilganda to'lanadi.",
      ru: "Заказ принимается по предоплате, остаток — при получении платья.",
      en: "Orders are confirmed with a deposit; the balance is paid on delivery." },
    { uz: "Ha, O'zbekiston bo'ylab va chet elga yetkazib berish mumkin. Narxi va muddati manzilga bog'liq.",
      ru: "Да, доставляем по Узбекистану и за рубеж. Стоимость и сроки зависят от адреса.",
      en: "Yes, we deliver across Uzbekistan and abroad. Cost and timing depend on the destination." },
    { uz: "Ha, rang, mato va bichimni siz bilan kelishgan holda o'zgartirish mumkin.",
      ru: "Да, цвет, ткань и крой можно изменить по согласованию с вами.",
      en: "Yes, the colour, fabric and cut can be adjusted in agreement with you." },
    { uz: "Ha, topshirishda libos qaddi-qomatingizga moslab beriladi.",
      ru: "Да, при примерке платье подгоняется по вашей фигуре.",
      en: "Yes, at the fitting the dress is adjusted to your figure." }
  ]
};
window.UI.uz.sample = "Namuna";
window.UI.ru.sample = "Пример";
window.UI.en.sample = "Sample";

/* Do'kon (mahsulotlar) va Telegram buyurtma matnlari */
Object.assign(window.UI.uz, {
  shopEyebrow: "Do'kon", shopTitle: "Mahsulotlar", shopLead: "Rang va o'lchamni tanlang — buyurtma Telegram orqali bir zumda.",
  sum: "so'm", color: "Rang", size: "O'lcham", qty: "Soni", total: "Jami", off: "chegirma",
  orderTg: "Telegram orqali buyurtma", chooseColor: "Rangni tanlang", chooseSize: "O'lchamni tanlang",
  priceOnReq: "Narxi so'rov bo'yicha", details: "Batafsil",
  orderHello: "Assalomu alaykum! Ushbu mahsulotga buyurtma bermoqchiman:",
  consultHello: "Assalomu alaykum! Konsultatsiyaga yozilmoqchiman.",
  tgOpened: "Telegram ochildi — xabarni yuboring. Matn chiqmasa, u nusxalandi: chatga joylashtiring.",
  name: "Ism", phoneL: "Telefon", typeL: "Turi", lookL: "Libos"
});
Object.assign(window.UI.ru, {
  shopEyebrow: "Магазин", shopTitle: "Товары", shopLead: "Выберите цвет и размер — заказ через Telegram в один клик.",
  sum: "сум", color: "Цвет", size: "Размер", qty: "Количество", total: "Итого", off: "скидка",
  orderTg: "Заказать в Telegram", chooseColor: "Выберите цвет", chooseSize: "Выберите размер",
  priceOnReq: "Цена по запросу", details: "Подробнее",
  orderHello: "Здравствуйте! Хочу заказать этот товар:",
  consultHello: "Здравствуйте! Хочу записаться на консультацию.",
  tgOpened: "Telegram открыт — отправьте сообщение. Если текста нет, он скопирован: вставьте его в чат.",
  name: "Имя", phoneL: "Телефон", typeL: "Тип", lookL: "Платье"
});
Object.assign(window.UI.en, {
  shopEyebrow: "Shop", shopTitle: "Products", shopLead: "Choose a colour and size — order instantly via Telegram.",
  sum: "UZS", color: "Colour", size: "Size", qty: "Quantity", total: "Total", off: "off",
  orderTg: "Order via Telegram", chooseColor: "Choose a colour", chooseSize: "Choose a size",
  priceOnReq: "Price on request", details: "Details",
  orderHello: "Hello! I'd like to order this item:",
  consultHello: "Hello! I'd like to book a consultation.",
  tgOpened: "Telegram is open — send the message. If the text is missing, it's copied: paste it into the chat.",
  name: "Name", phoneL: "Phone", typeL: "Type", lookL: "Dress"
});

/* SEO: har bir til uchun sahifa sarlavhasi va tavsifi */
Object.assign(window.UI.uz, {
  metaTitle: "MUNIVAR — premium ayollar liboslari | Toshkent",
  metaDesc: "MUNIVAR — premium ayollar liboslari: kechki liboslar, kapa va kashtali liboslar. O'lchov bo'yicha tikish, Telegram orqali buyurtma. Toshkent, Olmazor, Qiziltut ko'chasi 51.",
  imgAlt: "MUNIVAR libosi"
});
Object.assign(window.UI.ru, {
  metaTitle: "MUNIVAR — премиальная женская одежда | Ташкент",
  metaDesc: "MUNIVAR — премиальные женские платья: вечерние платья, кейпы и платья с вышивкой. Пошив по меркам, заказ через Telegram. Ташкент, Алмазар, ул. Кызылтут 51.",
  imgAlt: "Платье MUNIVAR"
});
Object.assign(window.UI.en, {
  metaTitle: "MUNIVAR — premium womenswear | Tashkent",
  metaDesc: "MUNIVAR — premium womenswear: evening dresses, capes and embroidered dresses. Made to measure, order via Telegram. 51 Qiziltut St, Tashkent.",
  imgAlt: "MUNIVAR dress"
});

/* Buyurtma berish oynasi */
Object.assign(window.UI.uz, {
  buyNow: "Buyurtma berish", custTitle: "Ma'lumotlaringiz", addrQ: "Manzil", addrPh: "Shahar, tuman, ko'cha (yetkazib berish uchun)",
  commentQ: "Izoh", optional: "(ixtiyoriy)", confirmOrder: "Buyurtmani rasmiylashtirish",
  orderDoneTitle: "Buyurtmangiz rasmiylashtirildi!", orderDoneText: "Tez orada siz bilan bog'lanamiz.",
  continueShop: "Xaridni davom ettirish", sendViaTg: "Telegram orqali yuborish",
  errOrder: "Buyurtmani yuborib bo'lmadi. Telegram orqali yuboring yoki qo'ng'iroq qiling:",
  addrL: "Manzil", commentL: "Izoh", orderNew: "Yangi buyurtma"
});
Object.assign(window.UI.ru, {
  buyNow: "Заказать", custTitle: "Ваши данные", addrQ: "Адрес", addrPh: "Город, район, улица (для доставки)",
  commentQ: "Комментарий", optional: "(необязательно)", confirmOrder: "Оформить заказ",
  orderDoneTitle: "Ваш заказ оформлен!", orderDoneText: "Мы скоро свяжемся с вами.",
  continueShop: "Продолжить покупки", sendViaTg: "Отправить через Telegram",
  errOrder: "Не удалось отправить заказ. Отправьте через Telegram или позвоните:",
  addrL: "Адрес", commentL: "Комментарий", orderNew: "Новый заказ"
});
Object.assign(window.UI.en, {
  buyNow: "Order now", custTitle: "Your details", addrQ: "Address", addrPh: "City, district, street (for delivery)",
  commentQ: "Comment", optional: "(optional)", confirmOrder: "Place order",
  orderDoneTitle: "Your order has been placed!", orderDoneText: "We'll contact you shortly.",
  continueShop: "Continue shopping", sendViaTg: "Send via Telegram",
  errOrder: "Couldn't send the order. Send it via Telegram or call us:",
  addrL: "Address", commentL: "Comment", orderNew: "New order"
});
window.UI.uz.pcs = "dona"; window.UI.ru.pcs = "шт."; window.UI.en.pcs = "pcs";

/* Mijoz talabi: buyurtma formasi savollari, obraz bo'limi, katalog tugmasi */
Object.assign(window.UI.uz, {
  consult: "Buyurtma berish", mIntro: "Ma'lumotlaringizni qoldiring — tez orada siz bilan bog'lanamiz.",
  send: "Buyurtma uchun bosing", seeCatalog: "Katalog ko'rish",
  occEyebrow: "Obraz", occTitle: "Qanday obrazga libos qidirdingiz?",
  qCity: "Qayerdansiz?", pCity: "Shahar yoki viloyat",
  qEvent: "Qanday tadbir uchun qidirdingiz?", eventPick: "Tanlang", eventOther: "Boshqa",
  qSize: "Hozirda razmeringiz qanday?", pSize: "Masalan: 46 yoki M",
  cityL: "Qayerdan", eventL: "Tadbir", sizeL: "Razmer",
  ok: "Rahmat! Buyurtmangiz qabul qilindi, tez orada siz bilan bog'lanamiz.",
  consultHello: "Assalomu alaykum! Buyurtma bermoqchiman."
});
Object.assign(window.UI.ru, {
  consult: "Оформить заказ", mIntro: "Оставьте свои данные — мы скоро свяжемся с вами.",
  send: "Нажмите, чтобы заказать", seeCatalog: "Смотреть каталог",
  occEyebrow: "Образ", occTitle: "Для какого образа вы ищете платье?",
  qCity: "Откуда вы?", pCity: "Город или область",
  qEvent: "Для какого события ищете?", eventPick: "Выберите", eventOther: "Другое",
  qSize: "Какой у вас сейчас размер?", pSize: "Например: 46 или M",
  cityL: "Откуда", eventL: "Событие", sizeL: "Размер",
  ok: "Спасибо! Заказ принят, мы скоро свяжемся с вами.",
  consultHello: "Здравствуйте! Хочу сделать заказ."
});
Object.assign(window.UI.en, {
  consult: "Place an order", mIntro: "Leave your details — we'll contact you shortly.",
  send: "Tap to order", seeCatalog: "View catalogue",
  occEyebrow: "Look", occTitle: "What look are you shopping for?",
  qCity: "Where are you from?", pCity: "City or region",
  qEvent: "What occasion is it for?", eventPick: "Choose", eventOther: "Other",
  qSize: "What is your current size?", pSize: "E.g. 46 or M",
  cityL: "From", eventL: "Occasion", sizeL: "Size",
  ok: "Thank you! Your order has been received — we'll contact you soon.",
  consultHello: "Hello! I'd like to place an order."
});
