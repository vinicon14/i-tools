import type { Faq } from "@/components/site/ToolLayout";
import type { LanguageCode } from "./i18n";

export type QrTranslations = {
  intro: string;
  label: string;
  placeholder: string;
  validHint: string;
  invalidHint: string;
  downloadPng: string;
  downloadSvg: string;
  emptyPreview: string;
  alt: (url: string) => string;
  faq: Faq[];
};

export const qrTranslations: Record<LanguageCode, QrTranslations> = {
  pt: {
    intro: "Cole um link e o QR Code aparece na hora. Baixe em PNG ou SVG.",
    label: "Endereço (URL)",
    placeholder: "https://seusite.com.br",
    validHint: "Pronto! Escaneie com a câmera do celular para testar.",
    invalidHint: "Digite um endereço completo, começando com http:// ou https://",
    downloadPng: "Baixar PNG",
    downloadSvg: "Baixar SVG",
    emptyPreview: "O QR Code aparecerá aqui",
    alt: (url) => `QR Code para ${url}`,
    faq: [
      {
        q: "O QR Code expira?",
        a: "O QR Code estático não tem prazo de expiração. Ele continua apontando para o link informado, mas o site de destino precisa permanecer disponível.",
      },
      {
        q: "Meus links são enviados para algum servidor?",
        a: "Não. O QR Code é gerado inteiramente no seu navegador.",
      },
      {
        q: "Qual formato devo baixar?",
        a: "PNG para uso digital e redes sociais; SVG para impressão em qualquer tamanho sem perder qualidade.",
      },
    ],
  },
  en: {
    intro: "Paste a link and the QR Code appears immediately. Download as PNG or SVG.",
    label: "Address (URL)",
    placeholder: "https://yoursite.com",
    validHint: "Ready! Scan it with your phone camera to test.",
    invalidHint: "Enter a complete address starting with http:// or https://",
    downloadPng: "Download PNG",
    downloadSvg: "Download SVG",
    emptyPreview: "The QR Code will appear here",
    alt: (url) => `QR Code for ${url}`,
    faq: [
      {
        q: "Does the QR Code expire?",
        a: "A static QR Code has no expiration date. It keeps pointing to the link you entered, but the destination site must remain available.",
      },
      {
        q: "Are my links sent to a server?",
        a: "No. The QR Code is generated entirely in your browser.",
      },
      {
        q: "Which format should I download?",
        a: "PNG for digital use and social media; SVG for print at any size without losing quality.",
      },
    ],
  },
  es: {
    intro: "Pega un enlace y el código QR aparece al instante. Descárgalo en PNG o SVG.",
    label: "Dirección (URL)",
    placeholder: "https://tusitio.com",
    validHint: "Listo. Escanéalo con la cámara del móvil para probarlo.",
    invalidHint: "Introduce una dirección completa que empiece por http:// o https://",
    downloadPng: "Descargar PNG",
    downloadSvg: "Descargar SVG",
    emptyPreview: "El código QR aparecerá aquí",
    alt: (url) => `Código QR para ${url}`,
    faq: [
      {
        q: "¿El código QR caduca?",
        a: "Un código QR estático no tiene fecha de caducidad. Sigue apuntando al enlace indicado, pero el sitio de destino debe permanecer disponible.",
      },
      {
        q: "¿Mis enlaces se envían a algún servidor?",
        a: "No. El código QR se genera por completo en tu navegador.",
      },
      {
        q: "¿Qué formato debo descargar?",
        a: "PNG para uso digital y redes sociales; SVG para imprimir a cualquier tamaño sin perder calidad.",
      },
    ],
  },
  fr: {
    intro: "Collez un lien et le QR Code s’affiche tout de suite. Téléchargez-le en PNG ou SVG.",
    label: "Adresse (URL)",
    placeholder: "https://votresite.com",
    validHint: "Prêt ! Scannez-le avec l’appareil photo du téléphone pour tester.",
    invalidHint: "Saisissez une adresse complète commençant par http:// ou https://",
    downloadPng: "Télécharger le PNG",
    downloadSvg: "Télécharger le SVG",
    emptyPreview: "Le QR Code apparaîtra ici",
    alt: (url) => `QR Code pour ${url}`,
    faq: [
      {
        q: "Le QR Code expire-t-il ?",
        a: "Un QR Code statique n’a pas de date d’expiration. Il continue de pointer vers le lien saisi, mais le site de destination doit rester disponible.",
      },
      {
        q: "Mes liens sont-ils envoyés à un serveur ?",
        a: "Non. Le QR Code est généré entièrement dans votre navigateur.",
      },
      {
        q: "Quel format dois-je télécharger ?",
        a: "PNG pour un usage numérique et les réseaux sociaux ; SVG pour l’impression à n’importe quelle taille sans perte de qualité.",
      },
    ],
  },
  de: {
    intro: "Fügen Sie einen Link ein und der QR-Code erscheint sofort. Download als PNG oder SVG.",
    label: "Adresse (URL)",
    placeholder: "https://ihreseite.de",
    validHint: "Fertig! Scannen Sie ihn mit der Handy-Kamera zum Testen.",
    invalidHint: "Geben Sie eine vollständige Adresse ein, die mit http:// oder https:// beginnt",
    downloadPng: "PNG herunterladen",
    downloadSvg: "SVG herunterladen",
    emptyPreview: "Der QR-Code erscheint hier",
    alt: (url) => `QR-Code für ${url}`,
    faq: [
      {
        q: "Läuft der QR-Code ab?",
        a: "Ein statischer QR-Code hat kein Ablaufdatum. Er zeigt weiter auf den eingegebenen Link, die Zielseite muss aber erreichbar bleiben.",
      },
      {
        q: "Werden meine Links an einen Server gesendet?",
        a: "Nein. Der QR-Code wird vollständig in Ihrem Browser erzeugt.",
      },
      {
        q: "Welches Format sollte ich herunterladen?",
        a: "PNG für digitale Nutzung und soziale Medien; SVG für den Druck in beliebiger Größe ohne Qualitätsverlust.",
      },
    ],
  },
  it: {
    intro: "Incolla un link e il QR Code compare subito. Scaricalo in PNG o SVG.",
    label: "Indirizzo (URL)",
    placeholder: "https://iltuosito.it",
    validHint: "Pronto! Scansiona con la fotocamera del telefono per provare.",
    invalidHint: "Inserisci un indirizzo completo che inizia con http:// o https://",
    downloadPng: "Scarica PNG",
    downloadSvg: "Scarica SVG",
    emptyPreview: "Il QR Code apparirà qui",
    alt: (url) => `QR Code per ${url}`,
    faq: [
      {
        q: "Il QR Code scade?",
        a: "Un QR Code statico non ha data di scadenza. Continua a puntare al link inserito, ma il sito di destinazione deve restare disponibile.",
      },
      {
        q: "I miei link vengono inviati a un server?",
        a: "No. Il QR Code è generato interamente nel browser.",
      },
      {
        q: "Quale formato dovrei scaricare?",
        a: "PNG per uso digitale e social; SVG per la stampa a qualsiasi dimensione senza perdere qualità.",
      },
    ],
  },
  nl: {
    intro: "Plak een link en de QR-code verschijnt meteen. Download als PNG of SVG.",
    label: "Adres (URL)",
    placeholder: "https://uwsite.nl",
    validHint: "Klaar! Scan met de camera van je telefoon om te testen.",
    invalidHint: "Voer een volledig adres in dat begint met http:// of https://",
    downloadPng: "PNG downloaden",
    downloadSvg: "SVG downloaden",
    emptyPreview: "De QR-code verschijnt hier",
    alt: (url) => `QR-code voor ${url}`,
    faq: [
      {
        q: "Verloopt de QR-code?",
        a: "Een statische QR-code heeft geen vervaldatum. Hij blijft naar de ingevoerde link wijzen, maar de bestemmingspagina moet beschikbaar blijven.",
      },
      {
        q: "Worden mijn links naar een server gestuurd?",
        a: "Nee. De QR-code wordt volledig in je browser gegenereerd.",
      },
      {
        q: "Welk formaat moet ik downloaden?",
        a: "PNG voor digitaal gebruik en social media; SVG om op elk formaat te printen zonder kwaliteitsverlies.",
      },
    ],
  },
  pl: {
    intro: "Wklej link, a kod QR pojawi się od razu. Pobierz jako PNG lub SVG.",
    label: "Adres (URL)",
    placeholder: "https://twojastrona.pl",
    validHint: "Gotowe! Zeskanuj aparatem telefonu, aby sprawdzić.",
    invalidHint: "Wpisz pełny adres zaczynający się od http:// lub https://",
    downloadPng: "Pobierz PNG",
    downloadSvg: "Pobierz SVG",
    emptyPreview: "Kod QR pojawi się tutaj",
    alt: (url) => `Kod QR dla ${url}`,
    faq: [
      {
        q: "Czy kod QR wygasa?",
        a: "Statyczny kod QR nie ma daty wygaśnięcia. Nadal wskazuje podany link, ale strona docelowa musi pozostać dostępna.",
      },
      {
        q: "Czy moje linki są wysyłane na serwer?",
        a: "Nie. Kod QR jest generowany w całości w przeglądarce.",
      },
      {
        q: "Który format powinienem pobrać?",
        a: "PNG do użytku cyfrowego i w mediach społecznościowych; SVG do druku w dowolnym rozmiarze bez utraty jakości.",
      },
    ],
  },
  ru: {
    intro: "Вставьте ссылку, и QR-код появится сразу. Скачайте в PNG или SVG.",
    label: "Адрес (URL)",
    placeholder: "https://yoursite.com",
    validHint: "Готово! Отсканируйте камерой телефона, чтобы проверить.",
    invalidHint: "Введите полный адрес, начинающийся с http:// или https://",
    downloadPng: "Скачать PNG",
    downloadSvg: "Скачать SVG",
    emptyPreview: "QR-код появится здесь",
    alt: (url) => `QR-код для ${url}`,
    faq: [
      {
        q: "Срок действия QR-кода истекает?",
        a: "У статического QR-кода нет срока действия. Он продолжает указывать на введённую ссылку, но сайт назначения должен оставаться доступным.",
      },
      {
        q: "Отправляются ли мои ссылки на сервер?",
        a: "Нет. QR-код создаётся полностью в вашем браузере.",
      },
      {
        q: "Какой формат скачивать?",
        a: "PNG для цифрового использования и соцсетей; SVG для печати любого размера без потери качества.",
      },
    ],
  },
  uk: {
    intro: "Вставте посилання, і QR-код з’явиться одразу. Завантажте у PNG або SVG.",
    label: "Адреса (URL)",
    placeholder: "https://yoursite.com",
    validHint: "Готово! Відскануйте камерою телефону, щоб перевірити.",
    invalidHint: "Введіть повну адресу, що починається з http:// або https://",
    downloadPng: "Завантажити PNG",
    downloadSvg: "Завантажити SVG",
    emptyPreview: "QR-код з’явиться тут",
    alt: (url) => `QR-код для ${url}`,
    faq: [
      {
        q: "Чи закінчується термін дії QR-коду?",
        a: "Статичний QR-код не має терміну дії. Він і далі вказує на введене посилання, але сайт призначення має залишатися доступним.",
      },
      {
        q: "Чи надсилаються мої посилання на сервер?",
        a: "Ні. QR-код створюється повністю у вашому браузері.",
      },
      {
        q: "Який формат завантажувати?",
        a: "PNG для цифрового використання та соцмереж; SVG для друку будь-якого розміру без втрати якості.",
      },
    ],
  },
  tr: {
    intro: "Bir bağlantı yapıştırın, QR kod hemen görünsün. PNG veya SVG olarak indirin.",
    label: "Adres (URL)",
    placeholder: "https://siteniz.com",
    validHint: "Hazır! Denemek için telefon kamerasıyla tarayın.",
    invalidHint: "http:// veya https:// ile başlayan tam bir adres girin",
    downloadPng: "PNG indir",
    downloadSvg: "SVG indir",
    emptyPreview: "QR kod burada görünecek",
    alt: (url) => `${url} için QR kod`,
    faq: [
      {
        q: "QR kodun süresi doluyor mu?",
        a: "Statik bir QR kodun son kullanma tarihi yoktur. Girdiğiniz bağlantıyı göstermeye devam eder, ancak hedef sitenin erişilebilir kalması gerekir.",
      },
      {
        q: "Bağlantılarım bir sunucuya gönderiliyor mu?",
        a: "Hayır. QR kod tamamen tarayıcınızda oluşturulur.",
      },
      {
        q: "Hangi biçimi indirmeliyim?",
        a: "Dijital kullanım ve sosyal medya için PNG; kalite kaybı olmadan her boyutta baskı için SVG.",
      },
    ],
  },
  ar: {
    intro: "ألصق رابطًا فيظهر رمز الاستجابة السريعة فورًا. نزّله بتنسيق PNG أو SVG.",
    label: "العنوان (URL)",
    placeholder: "https://yoursite.com",
    validHint: "جاهز! امسحه بكاميرا الهاتف للتجربة.",
    invalidHint: "أدخل عنوانًا كاملًا يبدأ بـ http:// أو https://",
    downloadPng: "تنزيل PNG",
    downloadSvg: "تنزيل SVG",
    emptyPreview: "سيظهر رمز الاستجابة السريعة هنا",
    alt: (url) => `رمز استجابة سريعة لـ ${url}`,
    faq: [
      {
        q: "هل ينتهي صلاحية رمز الاستجابة السريعة؟",
        a: "رمز الاستجابة السريعة الثابت ليس له تاريخ انتهاء. يظل يشير إلى الرابط الذي أدخلته، لكن يجب أن يبقى موقع الوجهة متاحًا.",
      },
      {
        q: "هل تُرسل روابطي إلى خادم؟",
        a: "لا. يُنشأ رمز الاستجابة السريعة بالكامل في متصفحك.",
      },
      {
        q: "أي تنسيق يجب أن أنزّله؟",
        a: "PNG للاستخدام الرقمي ووسائل التواصل؛ SVG للطباعة بأي حجم دون فقدان الجودة.",
      },
    ],
  },
  hi: {
    intro: "लिंक चिपकाएँ और QR कोड तुरंत दिखेगा। PNG या SVG में डाउनलोड करें।",
    label: "पता (URL)",
    placeholder: "https://yoursite.com",
    validHint: "तैयार! जाँच के लिए फ़ोन कैमरे से स्कैन करें।",
    invalidHint: "http:// या https:// से शुरू होने वाला पूरा पता लिखें",
    downloadPng: "PNG डाउनलोड करें",
    downloadSvg: "SVG डाउनलोड करें",
    emptyPreview: "QR कोड यहाँ दिखेगा",
    alt: (url) => `${url} के लिए QR कोड`,
    faq: [
      {
        q: "क्या QR कोड की समय सीमा समाप्त होती है?",
        a: "स्थिर QR कोड की कोई समाप्ति तिथि नहीं होती। यह आपके दिए लिंक की ओर इशारा करता रहता है, लेकिन गंतव्य साइट उपलब्ध रहनी चाहिए।",
      },
      {
        q: "क्या मेरे लिंक किसी सर्वर पर भेजे जाते हैं?",
        a: "नहीं। QR कोड पूरी तरह आपके ब्राउज़र में बनता है।",
      },
      {
        q: "मुझे कौन सा फ़ॉर्मेट डाउनलोड करना चाहिए?",
        a: "डिजिटल उपयोग और सोशल मीडिया के लिए PNG; बिना गुणवत्ता खोए किसी भी आकार में छपाई के लिए SVG।",
      },
    ],
  },
  id: {
    intro: "Tempel tautan dan kode QR muncul langsung. Unduh sebagai PNG atau SVG.",
    label: "Alamat (URL)",
    placeholder: "https://situsanda.com",
    validHint: "Siap! Pindai dengan kamera ponsel untuk menguji.",
    invalidHint: "Masukkan alamat lengkap yang dimulai dengan http:// atau https://",
    downloadPng: "Unduh PNG",
    downloadSvg: "Unduh SVG",
    emptyPreview: "Kode QR akan muncul di sini",
    alt: (url) => `Kode QR untuk ${url}`,
    faq: [
      {
        q: "Apakah kode QR kedaluwarsa?",
        a: "Kode QR statis tidak memiliki tanggal kedaluwarsa. Kode tetap mengarah ke tautan yang Anda masukkan, tetapi situs tujuan harus tetap tersedia.",
      },
      {
        q: "Apakah tautan saya dikirim ke server?",
        a: "Tidak. Kode QR dibuat sepenuhnya di peramban Anda.",
      },
      {
        q: "Format mana yang harus saya unduh?",
        a: "PNG untuk penggunaan digital dan media sosial; SVG untuk cetak dalam ukuran apa pun tanpa kehilangan kualitas.",
      },
    ],
  },
  ja: {
    intro: "リンクを貼るとQRコードがすぐに表示されます。PNGまたはSVGでダウンロードできます。",
    label: "アドレス（URL）",
    placeholder: "https://yoursite.com",
    validHint: "完了です。スマホのカメラで読み取って確認できます。",
    invalidHint: "http:// または https:// で始まる完全なアドレスを入力してください",
    downloadPng: "PNGをダウンロード",
    downloadSvg: "SVGをダウンロード",
    emptyPreview: "QRコードはここに表示されます",
    alt: (url) => `${url} のQRコード`,
    faq: [
      {
        q: "QRコードの有効期限はありますか？",
        a: "静的なQRコードに有効期限はありません。入力したリンクを指し続けますが、遷移先のサイトが利用できる必要があります。",
      },
      {
        q: "リンクはサーバーに送信されますか？",
        a: "いいえ。QRコードはブラウザ内だけで生成されます。",
      },
      {
        q: "どの形式をダウンロードすべきですか？",
        a: "デジタル利用やSNSにはPNG、どのサイズでも画質を落とさず印刷するにはSVGです。",
      },
    ],
  },
  ko: {
    intro: "링크를 붙여넣으면 QR 코드가 바로 나타납니다. PNG 또는 SVG로 다운로드하세요.",
    label: "주소(URL)",
    placeholder: "https://yoursite.com",
    validHint: "준비되었습니다. 휴대폰 카메라로 스캔해 확인하세요.",
    invalidHint: "http:// 또는 https://로 시작하는 전체 주소를 입력하세요",
    downloadPng: "PNG 다운로드",
    downloadSvg: "SVG 다운로드",
    emptyPreview: "QR 코드가 여기에 표시됩니다",
    alt: (url) => `${url}용 QR 코드`,
    faq: [
      {
        q: "QR 코드가 만료되나요?",
        a: "정적 QR 코드에는 만료일이 없습니다. 입력한 링크를 계속 가리키지만 대상 사이트는 계속 이용 가능해야 합니다.",
      },
      {
        q: "내 링크가 서버로 전송되나요?",
        a: "아니요. QR 코드는 브라우저에서만 생성됩니다.",
      },
      {
        q: "어떤 형식을 다운로드해야 하나요?",
        a: "디지털 사용과 소셜 미디어에는 PNG, 어떤 크기든 품질 손실 없이 인쇄하려면 SVG입니다.",
      },
    ],
  },
  zh: {
    intro: "粘贴链接后即可显示二维码。可下载为 PNG 或 SVG。",
    label: "地址（URL）",
    placeholder: "https://yoursite.com",
    validHint: "完成！用手机摄像头扫描即可测试。",
    invalidHint: "请输入以 http:// 或 https:// 开头的完整地址",
    downloadPng: "下载 PNG",
    downloadSvg: "下载 SVG",
    emptyPreview: "二维码将显示在这里",
    alt: (url) => `${url} 的二维码`,
    faq: [
      {
        q: "二维码会过期吗？",
        a: "静态二维码没有过期日期。它会继续指向你输入的链接，但目标网站需要保持可访问。",
      },
      {
        q: "我的链接会发送到服务器吗？",
        a: "不会。二维码完全在浏览器中生成。",
      },
      {
        q: "应该下载哪种格式？",
        a: "PNG 适合数字用途和社交媒体；SVG 适合任意尺寸打印且不损失清晰度。",
      },
    ],
  },
  vi: {
    intro: "Dán liên kết và mã QR hiện ngay. Tải xuống dạng PNG hoặc SVG.",
    label: "Địa chỉ (URL)",
    placeholder: "https://yoursite.com",
    validHint: "Xong! Quét bằng camera điện thoại để kiểm tra.",
    invalidHint: "Nhập địa chỉ đầy đủ bắt đầu bằng http:// hoặc https://",
    downloadPng: "Tải PNG",
    downloadSvg: "Tải SVG",
    emptyPreview: "Mã QR sẽ hiện ở đây",
    alt: (url) => `Mã QR cho ${url}`,
    faq: [
      {
        q: "Mã QR có hết hạn không?",
        a: "Mã QR tĩnh không có ngày hết hạn. Nó vẫn trỏ tới liên kết bạn nhập, nhưng trang đích cần tiếp tục khả dụng.",
      },
      {
        q: "Liên kết của tôi có được gửi lên máy chủ không?",
        a: "Không. Mã QR được tạo hoàn toàn trong trình duyệt của bạn.",
      },
      {
        q: "Tôi nên tải định dạng nào?",
        a: "PNG cho dùng kỹ thuật số và mạng xã hội; SVG để in mọi kích thước mà không mất chất lượng.",
      },
    ],
  },
};

export function getQrTranslations(lang: LanguageCode): QrTranslations {
  return qrTranslations[lang] ?? qrTranslations.pt;
}
