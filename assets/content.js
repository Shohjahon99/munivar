/* =========================================================
   MUNIVAR — sayt mazmuni.
   Matnlar 3 tilda: { uz, ru, en }. Rasm/video — /media papkasida.
   Bo'sh ro'yxat (items: []) bo'lsa, o'sha bo'lim ko'rsatilmaydi.
   ========================================================= */
window.SITE = {
  langs: ["uz", "ru", "en"],
  defaultLang: "uz",

  brand: {
    name: "MUNIVAR",
    mark: "media/brand/mark.png",   // shaffof emblema (CSS orqali ranglanadi)
    city: { uz: "Toshkent", ru: "Ташкент", en: "Tashkent" },
    tagline: { uz: "Nafosat va o'ziga xoslik", ru: "Изящество и индивидуальность", en: "Elegance and individuality" }
  },

  contacts: {
    phones: ["+998 90 126 25 80", "+998 98 126 25 80"],
    instagram: "muslimam_libas",
    telegram: "https://t.me/+baVhchzzcPBmYzky",   // username yoki to'liq havola
    telegramLabel: { uz: "MUNIVAR kanali", ru: "Канал MUNIVAR", en: "MUNIVAR channel" },
    whatsapp: ""           // masalan: "998901262580"
  },

  // Ariza yuboriladigan server manzili:
  //  - Cloudflare Worker (GitHub Pages uchun): "https://munivar-order.<akkaunt>.workers.dev"
  //  - PHP hosting: "api/send.php"
  orderEndpoint: "api/send.php",

  // Showroom — address bo'sh bo'lsa bo'lim ko'rinmaydi va formada "Showroomga tashrif" varianti yashiriladi
  showroom: {
    address: { uz: "", ru: "", en: "" },       // masalan: "Toshkent, Yunusobod tumani, ... ko'chasi 12"
    landmark: { uz: "", ru: "", en: "" },      // mo'ljal, masalan: "Mega Planet yonida"
    hours: { uz: "", ru: "", en: "" },         // masalan: "Du–Sha: 10:00–19:00"
    lat: null, lng: null,                      // xarita uchun koordinata, masalan 41.3645, 69.2881
    mapLink: ""                                // Yandex/Google xarita havolasi
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

  occasions: [
    { uz: "To'y va nikoh", ru: "Свадьба и никах", en: "Wedding & nikah" },
    { uz: "Kelin salom", ru: "Келин салом", en: "Kelin salom" },
    { uz: "Hayit va bayramlar", ru: "Хайит и праздники", en: "Eid & holidays" },
    { uz: "Kechki tadbirlar", ru: "Вечерние мероприятия", en: "Evening events" },
    { uz: "Oilaviy marosimlar", ru: "Семейные торжества", en: "Family celebrations" },
    { uz: "Kundalik nafis libos", ru: "Изящно каждый день", en: "Everyday elegance" }
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
    nav: ["Liboslar", "Hunar", "Brend haqida", "Buyurtma"],
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
    nav: ["Коллекция", "Ремесло", "О бренде", "Заказ"],
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
    nav: ["Collection", "Craft", "About", "Order"],
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
