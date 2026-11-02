import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Download, ExternalLink, Link2, LoaderCircle, X } from "lucide-react";
import { useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { validateVideoLink, videoPlatforms, type VideoPlatform } from "@/lib/video-links";
import { prepareVideo } from "@/lib/video-download.functions";
import type { VideoDownloadResult } from "@/lib/video-download";
import { panel, ToolLayout } from "./ToolLayout";
import type { LanguageCode } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";

type VideoDownloaderTexts = {
  intro: string;
  placeholder: string;
  qualityLabel: string;
  authCheckbox: string;
  downloadButton: string;
  downloading: string;
  platformsLabel: string;
  videoReady: string;
  download: string;
  viewOriginal: string;
  prepare: string;
  authError: string;
  prepareError: string;
  faq: Array<{ q: string; a: string }>;
};

function getVideoTexts(lang: LanguageCode, platform: VideoPlatform): VideoDownloaderTexts {
  const t = getTranslations(lang);
  const info = videoPlatforms[platform];
  
  const texts: Record<LanguageCode, VideoDownloaderTexts> = {
    pt: {
      intro: `${info.formats}. Cole o link de um vídeo seu ou autorizado para preparar o arquivo.`,
      placeholder: "Cole o link do vídeo aqui",
      qualityLabel: "Qualidade",
      authCheckbox: "Confirmo que o vídeo é meu ou tenho autorização para baixá-lo",
      downloadButton: "Preparar vídeo",
      downloading: "Preparando…",
      platformsLabel: "Plataformas de vídeo",
      videoReady: "Vídeo pronto",
      download: "Baixar",
      viewOriginal: "Ver original",
      prepare: "Preparar outro",
      authError: "Confirme que o vídeo é seu ou que você tem autorização para baixá-lo.",
      prepareError: "Não foi possível preparar o vídeo. Tente novamente.",
      faq: [
        {
          q: `Como baixar um vídeo do ${info.name}?`,
          a: "Cole o link público, confirme que tem autorização e prepare o vídeo. Quando o arquivo estiver pronto, use o botão de download.",
        },
        {
          q: "Posso baixar vídeos privados ou protegidos?",
          a: "Não. A ferramenta não contorna login, pagamento ou proteção de conteúdo. Respeite os direitos autorais e as regras da plataforma.",
        },
        {
          q: "É gratuito e sem cadastro?",
          a: "Sim, para os visitantes do i-Tools. A disponibilidade depende dos créditos e limites do serviço de download.",
        },
        {
          q: "Meus links são enviados a outro serviço?",
          a: "Sim. O link é enviado ao FastSaver para obter o arquivo. Não envie links que contenham informações privadas ou credenciais.",
        },
        {
          q: "Por que o link de download expirou?",
          a: "Os arquivos são disponibilizados temporariamente. Baixe logo após preparar; se o link expirar, prepare o vídeo novamente.",
        },
      ],
    },
    en: {
      intro: `${info.formats}. Paste the link to your video or one you're authorized to download to prepare the file.`,
      placeholder: "Paste video link here",
      qualityLabel: "Quality",
      authCheckbox: "I confirm this video is mine or I have permission to download it",
      downloadButton: "Prepare video",
      downloading: "Preparing…",
      platformsLabel: "Video platforms",
      videoReady: "Video ready",
      download: "Download",
      viewOriginal: "View original",
      prepare: "Prepare another",
      authError: "Confirm that the video is yours or that you have permission to download it.",
      prepareError: "Unable to prepare the video. Please try again.",
      faq: [
        {
          q: `How to download a ${info.name} video?`,
          a: "Paste the public link, confirm you have authorization, and prepare the video. When the file is ready, use the download button.",
        },
        {
          q: "Can I download private or protected videos?",
          a: "No. The tool does not bypass login, payment, or content protection. Respect copyright and platform rules.",
        },
        {
          q: "Is it free and without registration?",
          a: "Yes, for i-Tools visitors. Availability depends on credits and download service limits.",
        },
        {
          q: "Are my links sent to another service?",
          a: "Yes. The link is sent to FastSaver to obtain the file. Do not send links containing private information or credentials.",
        },
        {
          q: "Why did the download link expire?",
          a: "Files are available temporarily. Download soon after preparing; if the link expires, prepare the video again.",
        },
      ],
    },
    es: {
      intro: `${info.formats}. Pega el enlace de tu video o uno que estés autorizado a descargar para preparar el archivo.`,
      placeholder: "Pega el enlace del video aquí",
      qualityLabel: "Calidad",
      authCheckbox: "Confirmo que este video es mío o tengo permiso para descargarlo",
      downloadButton: "Preparar video",
      downloading: "Preparando…",
      platformsLabel: "Plataformas de video",
      videoReady: "Video listo",
      download: "Descargar",
      viewOriginal: "Ver original",
      prepare: "Preparar otro",
      authError: "Confirma que el video es tuyo o que tienes permiso para descargarlo.",
      prepareError: "No se pudo preparar el video. Inténtalo de nuevo.",
      faq: [
        {
          q: `¿Cómo descargar un video de ${info.name}?`,
          a: "Pega el enlace público, confirma que tienes autorización y prepara el video. Cuando el archivo esté listo, usa el botón de descarga.",
        },
        {
          q: "¿Puedo descargar videos privados o protegidos?",
          a: "No. La herramienta no elude el inicio de sesión, el pago o la protección de contenido. Respeta los derechos de autor y las reglas de la plataforma.",
        },
        {
          q: "¿Es gratis y sin registro?",
          a: "Sí, para los visitantes de i-Tools. La disponibilidad depende de los créditos y límites del servicio de descarga.",
        },
        {
          q: "¿Mis enlaces se envían a otro servicio?",
          a: "Sí. El enlace se envía a FastSaver para obtener el archivo. No envíes enlaces que contengan información privada o credenciales.",
        },
        {
          q: "¿Por qué caducó el enlace de descarga?",
          a: "Los archivos están disponibles temporalmente. Descarga poco después de preparar; si el enlace caduca, prepara el video nuevamente.",
        },
      ],
    },
    fr: {
      intro: `${info.formats}. Collez le lien de votre vidéo ou d'une vidéo que vous êtes autorisé à télécharger pour préparer le fichier.`,
      placeholder: "Collez le lien de la vidéo ici",
      qualityLabel: "Qualité",
      authCheckbox: "Je confirme que cette vidéo est la mienne ou que j'ai la permission de la télécharger",
      downloadButton: "Préparer la vidéo",
      downloading: "Préparation…",
      platformsLabel: "Plateformes vidéo",
      videoReady: "Vidéo prête",
      download: "Télécharger",
      viewOriginal: "Voir l'original",
      prepare: "Préparer une autre",
      authError: "Confirmez que la vidéo est la vôtre ou que vous avez la permission de la télécharger.",
      prepareError: "Impossible de préparer la vidéo. Veuillez réessayer.",
      faq: [
        {
          q: `Comment télécharger une vidéo ${info.name} ?`,
          a: "Collez le lien public, confirmez que vous avez l'autorisation et préparez la vidéo. Lorsque le fichier est prêt, utilisez le bouton de téléchargement.",
        },
        {
          q: "Puis-je télécharger des vidéos privées ou protégées ?",
          a: "Non. L'outil ne contourne pas la connexion, le paiement ou la protection du contenu. Respectez les droits d'auteur et les règles de la plateforme.",
        },
        {
          q: "Est-ce gratuit et sans inscription ?",
          a: "Oui, pour les visiteurs d'i-Tools. La disponibilité dépend des crédits et des limites du service de téléchargement.",
        },
        {
          q: "Mes liens sont-ils envoyés à un autre service ?",
          a: "Oui. Le lien est envoyé à FastSaver pour obtenir le fichier. N'envoyez pas de liens contenant des informations privées ou des identifiants.",
        },
        {
          q: "Pourquoi le lien de téléchargement a-t-il expiré ?",
          a: "Les fichiers sont disponibles temporairement. Téléchargez peu après la préparation ; si le lien expire, préparez à nouveau la vidéo.",
        },
      ],
    },
    de: {
      intro: `${info.formats}. Fügen Sie den Link zu Ihrem Video oder einem Video ein, das Sie herunterladen dürfen, um die Datei vorzubereiten.`,
      placeholder: "Videolink hier einfügen",
      qualityLabel: "Qualität",
      authCheckbox: "Ich bestätige, dass dieses Video mir gehört oder ich die Erlaubnis habe, es herunterzuladen",
      downloadButton: "Video vorbereiten",
      downloading: "Vorbereitung…",
      platformsLabel: "Videoplattformen",
      videoReady: "Video bereit",
      download: "Herunterladen",
      viewOriginal: "Original ansehen",
      prepare: "Weiteres vorbereiten",
      authError: "Bestätigen Sie, dass das Video Ihnen gehört oder Sie die Erlaubnis zum Herunterladen haben.",
      prepareError: "Das Video konnte nicht vorbereitet werden. Bitte versuchen Sie es erneut.",
      faq: [
        {
          q: `Wie lade ich ein ${info.name}-Video herunter?`,
          a: "Fügen Sie den öffentlichen Link ein, bestätigen Sie, dass Sie die Berechtigung haben, und bereiten Sie das Video vor. Wenn die Datei bereit ist, verwenden Sie die Download-Schaltfläche.",
        },
        {
          q: "Kann ich private oder geschützte Videos herunterladen?",
          a: "Nein. Das Tool umgeht nicht Anmeldung, Zahlung oder Inhaltsschutz. Respektieren Sie Urheberrechte und Plattformregeln.",
        },
        {
          q: "Ist es kostenlos und ohne Registrierung?",
          a: "Ja, für i-Tools-Besucher. Die Verfügbarkeit hängt von Credits und Download-Service-Limits ab.",
        },
        {
          q: "Werden meine Links an einen anderen Service gesendet?",
          a: "Ja. Der Link wird an FastSaver gesendet, um die Datei zu erhalten. Senden Sie keine Links mit privaten Informationen oder Anmeldedaten.",
        },
        {
          q: "Warum ist der Download-Link abgelaufen?",
          a: "Dateien sind vorübergehend verfügbar. Laden Sie kurz nach der Vorbereitung herunter; wenn der Link abläuft, bereiten Sie das Video erneut vor.",
        },
      ],
    },
    it: {
      intro: `${info.formats}. Incolla il link del tuo video o di uno che sei autorizzato a scaricare per preparare il file.`,
      placeholder: "Incolla il link del video qui",
      qualityLabel: "Qualità",
      authCheckbox: "Confermo che questo video è mio o ho il permesso di scaricarlo",
      downloadButton: "Prepara video",
      downloading: "Preparazione…",
      platformsLabel: "Piattaforme video",
      videoReady: "Video pronto",
      download: "Scarica",
      viewOriginal: "Vedi originale",
      prepare: "Prepara un altro",
      authError: "Conferma che il video è tuo o che hai il permesso di scaricarlo.",
      prepareError: "Impossibile preparare il video. Riprova.",
      faq: [
        {
          q: `Come scaricare un video ${info.name}?`,
          a: "Incolla il link pubblico, conferma di avere l'autorizzazione e prepara il video. Quando il file è pronto, usa il pulsante di download.",
        },
        {
          q: "Posso scaricare video privati o protetti?",
          a: "No. Lo strumento non aggira login, pagamento o protezione dei contenuti. Rispetta i diritti d'autore e le regole della piattaforma.",
        },
        {
          q: "È gratuito e senza registrazione?",
          a: "Sì, per i visitatori di i-Tools. La disponibilità dipende dai crediti e dai limiti del servizio di download.",
        },
        {
          q: "I miei link vengono inviati a un altro servizio?",
          a: "Sì. Il link viene inviato a FastSaver per ottenere il file. Non inviare link contenenti informazioni private o credenziali.",
        },
        {
          q: "Perché il link di download è scaduto?",
          a: "I file sono disponibili temporaneamente. Scarica subito dopo la preparazione; se il link scade, prepara nuovamente il video.",
        },
      ],
    },
    nl: {
      intro: `${info.formats}. Plak de link naar uw video of een video die u mag downloaden om het bestand voor te bereiden.`,
      placeholder: "Plak videolink hier",
      qualityLabel: "Kwaliteit",
      authCheckbox: "Ik bevestig dat deze video van mij is of dat ik toestemming heb om hem te downloaden",
      downloadButton: "Video voorbereiden",
      downloading: "Voorbereiden…",
      platformsLabel: "Videoplatforms",
      videoReady: "Video klaar",
      download: "Downloaden",
      viewOriginal: "Bekijk origineel",
      prepare: "Bereid een andere voor",
      authError: "Bevestig dat de video van u is of dat u toestemming heeft om deze te downloaden.",
      prepareError: "Kan de video niet voorbereiden. Probeer het opnieuw.",
      faq: [
        {
          q: `Hoe download ik een ${info.name}-video?`,
          a: "Plak de openbare link, bevestig dat u toestemming hebt en bereid de video voor. Wanneer het bestand klaar is, gebruik de downloadknop.",
        },
        {
          q: "Kan ik privé of beschermde video's downloaden?",
          a: "Nee. De tool omzeilt geen login, betaling of inhoudsbescherming. Respecteer auteursrechten en platformregels.",
        },
        {
          q: "Is het gratis en zonder registratie?",
          a: "Ja, voor i-Tools-bezoekers. Beschikbaarheid hangt af van credits en downloadservicelimieten.",
        },
        {
          q: "Worden mijn links naar een andere service gestuurd?",
          a: "Ja. De link wordt naar FastSaver gestuurd om het bestand te verkrijgen. Stuur geen links met privé-informatie of inloggegevens.",
        },
        {
          q: "Waarom is de downloadlink verlopen?",
          a: "Bestanden zijn tijdelijk beschikbaar. Download kort na voorbereiding; als de link verloopt, bereid de video opnieuw voor.",
        },
      ],
    },
    pl: {
      intro: `${info.formats}. Wklej link do swojego filmu lub filmu, który masz pozwolenie pobrać, aby przygotować plik.`,
      placeholder: "Wklej link do filmu tutaj",
      qualityLabel: "Jakość",
      authCheckbox: "Potwierdzam, że ten film jest mój lub mam pozwolenie na jego pobranie",
      downloadButton: "Przygotuj film",
      downloading: "Przygotowywanie…",
      platformsLabel: "Platformy wideo",
      videoReady: "Film gotowy",
      download: "Pobierz",
      viewOriginal: "Zobacz oryginał",
      prepare: "Przygotuj kolejny",
      authError: "Potwierdź, że film jest Twój lub że masz pozwolenie na jego pobranie.",
      prepareError: "Nie udało się przygotować filmu. Spróbuj ponownie.",
      faq: [
        {
          q: `Jak pobrać film z ${info.name}?`,
          a: "Wklej publiczny link, potwierdź, że masz autoryzację i przygotuj film. Gdy plik będzie gotowy, użyj przycisku pobierania.",
        },
        {
          q: "Czy mogę pobierać prywatne lub chronione filmy?",
          a: "Nie. Narzędzie nie omija logowania, płatności ani ochrony treści. Szanuj prawa autorskie i zasady platformy.",
        },
        {
          q: "Czy jest to bezpłatne i bez rejestracji?",
          a: "Tak, dla odwiedzających i-Tools. Dostępność zależy od kredytów i limitów usługi pobierania.",
        },
        {
          q: "Czy moje linki są wysyłane do innej usługi?",
          a: "Tak. Link jest wysyłany do FastSaver w celu uzyskania pliku. Nie wysyłaj linków zawierających prywatne informacje lub dane uwierzytelniające.",
        },
        {
          q: "Dlaczego link do pobierania wygasł?",
          a: "Pliki są dostępne tymczasowo. Pobierz wkrótce po przygotowaniu; jeśli link wygaśnie, przygotuj film ponownie.",
        },
      ],
    },
    ru: {
      intro: `${info.formats}. Вставьте ссылку на ваше видео или видео, которое вы имеете право скачать, чтобы подготовить файл.`,
      placeholder: "Вставьте ссылку на видео здесь",
      qualityLabel: "Качество",
      authCheckbox: "Я подтверждаю, что это видео принадлежит мне или у меня есть разрешение на его загрузку",
      downloadButton: "Подготовить видео",
      downloading: "Подготовка…",
      platformsLabel: "Видеоплатформы",
      videoReady: "Видео готово",
      download: "Скачать",
      viewOriginal: "Посмотреть оригинал",
      prepare: "Подготовить другое",
      authError: "Подтвердите, что видео принадлежит вам или у вас есть разрешение на его загрузку.",
      prepareError: "Не удалось подготовить видео. Попробуйте снова.",
      faq: [
        {
          q: `Как скачать видео с ${info.name}?`,
          a: "Вставьте публичную ссылку, подтвердите, что у вас есть авторизация, и подготовьте видео. Когда файл будет готов, используйте кнопку загрузки.",
        },
        {
          q: "Могу ли я скачивать частные или защищенные видео?",
          a: "Нет. Инструмент не обходит вход, оплату или защиту контента. Уважайте авторские права и правила платформы.",
        },
        {
          q: "Это бесплатно и без регистрации?",
          a: "Да, для посетителей i-Tools. Доступность зависит от кредитов и лимитов службы загрузки.",
        },
        {
          q: "Мои ссылки отправляются в другой сервис?",
          a: "Да. Ссылка отправляется в FastSaver для получения файла. Не отправляйте ссылки, содержащие личную информацию или учетные данные.",
        },
        {
          q: "Почему истек срок действия ссылки для загрузки?",
          a: "Файлы доступны временно. Загрузите вскоре после подготовки; если ссылка истечет, подготовьте видео снова.",
        },
      ],
    },
    uk: {
      intro: `${info.formats}. Вставте посилання на ваше відео або відео, яке ви маєте право завантажити, щоб підготувати файл.`,
      placeholder: "Вставте посилання на відео тут",
      qualityLabel: "Якість",
      authCheckbox: "Я підтверджую, що це відео належить мені або я маю дозвіл на його завантаження",
      downloadButton: "Підготувати відео",
      downloading: "Підготовка…",
      platformsLabel: "Відеоплатформи",
      videoReady: "Відео готове",
      download: "Завантажити",
      viewOriginal: "Переглянути оригінал",
      prepare: "Підготувати інше",
      authError: "Підтвердьте, що відео належить вам або ви маєте дозвіл на його завантаження.",
      prepareError: "Не вдалося підготувати відео. Спробуйте ще раз.",
      faq: [
        {
          q: `Як завантажити відео з ${info.name}?`,
          a: "Вставте публічне посилання, підтвердьте, що ви маєте авторизацію, і підготуйте відео. Коли файл буде готовий, використайте кнопку завантаження.",
        },
        {
          q: "Чи можу я завантажувати приватні або захищені відео?",
          a: "Ні. Інструмент не обходить вхід, оплату або захист контенту. Поважайте авторські права та правила платформи.",
        },
        {
          q: "Це безкоштовно і без реєстрації?",
          a: "Так, для відвідувачів i-Tools. Доступність залежить від кредитів та лімітів служби завантаження.",
        },
        {
          q: "Мої посилання надсилаються до іншого сервісу?",
          a: "Так. Посилання надсилається до FastSaver для отримання файлу. Не надсилайте посилання, що містять особисту інформацію або облікові дані.",
        },
        {
          q: "Чому закінчився термін дії посилання для завантаження?",
          a: "Файли доступні тимчасово. Завантажте невдовзі після підготовки; якщо посилання закінчиться, підготуйте відео знову.",
        },
      ],
    },
    tr: {
      intro: `${info.formats}. Dosyayı hazırlamak için videonuzun veya indirme yetkisine sahip olduğunuz bir videonun bağlantısını yapıştırın.`,
      placeholder: "Video bağlantısını buraya yapıştırın",
      qualityLabel: "Kalite",
      authCheckbox: "Bu videonun bana ait olduğunu veya indirme iznim olduğunu onaylıyorum",
      downloadButton: "Videoyu hazırla",
      downloading: "Hazırlanıyor…",
      platformsLabel: "Video platformları",
      videoReady: "Video hazır",
      download: "İndir",
      viewOriginal: "Orijinali görüntüle",
      prepare: "Başka bir tane hazırla",
      authError: "Videonun size ait olduğunu veya indirme izniniz olduğunu onaylayın.",
      prepareError: "Video hazırlanamadı. Lütfen tekrar deneyin.",
      faq: [
        {
          q: `${info.name} videosu nasıl indirilir?`,
          a: "Genel bağlantıyı yapıştırın, yetkiniz olduğunu onaylayın ve videoyu hazırlayın. Dosya hazır olduğunda, indirme düğmesini kullanın.",
        },
        {
          q: "Özel veya korumalı videoları indirebilir miyim?",
          a: "Hayır. Araç, giriş, ödeme veya içerik korumasını atlamaz. Telif haklarına ve platform kurallarına saygı gösterin.",
        },
        {
          q: "Ücretsiz ve kayıt gerektirmeden mi?",
          a: "Evet, i-Tools ziyaretçileri için. Kullanılabilirlik, kredi ve indirme hizmeti limitlerineğlıdır.",
        },
        {
          q: "Bağlantılarım başka bir hizmete mi gönderiliyor?",
          a: "Evet. Bağlantı, dosyayı almak için FastSaver'a gönderilir. Özel bilgiler veya kimlik bilgileri içeren bağlantılar göndermeyin.",
        },
        {
          q: "İndirme bağlantısı neden sona erdi?",
          a: "Dosyalar geçici olarak kullanılabilir. Hazırladıktan kısa bir süre sonra indirin; bağlantı sona ererse, videoyu yeniden hazırlayın.",
        },
      ],
    },
    ar: {
      intro: `${info.formats}. الصق رابط الفيديو الخاص بك أو الفيديو المصرح لك بتنزيله لإعداد الملف.`,
      placeholder: "الصق رابط الفيديو هنا",
      qualityLabel: "الجودة",
      authCheckbox: "أؤكد أن هذا الفيديو ملكي أو لدي إذن بتنزيله",
      downloadButton: "تحضير الفيديو",
      downloading: "جارٍ التحضير…",
      platformsLabel: "منصات الفيديو",
      videoReady: "الفيديو جاهز",
      download: "تحميل",
      viewOriginal: "عرض الأصل",
      prepare: "تحضير آخر",
      authError: "أكد أن الفيديو ملكك أو أن لديك إذنًا بتنزيله.",
      prepareError: "تعذر تحضير الفيديو. يرجى المحاولة مرة أخرى.",
      faq: [
        {
          q: `كيف أقوم بتنزيل فيديو ${info.name}؟`,
          a: "الصق الرابط العام، أكد أن لديك تصريحًا، وقم بتحضير الفيديو. عندما يكون الملف جاهزًا، استخدم زر التنزيل.",
        },
        {
          q: "هل يمكنني تنزيل مقاطع فيديو خاصة أو محمية؟",
          a: "لا. لا تتجاوز الأداة تسجيل الدخول أو الدفع أو حماية المحتوى. احترم حقوق النشر وقواعد المنصة.",
        },
        {
          q: "هل هو مجاني وبدون تسجيل؟",
          a: "نعم، لزوار i-Tools. يعتمد التوفر على الاعتمادات وحدود خدمة التنزيل.",
        },
        {
          q: "هل يتم إرسال روابطي إلى خدمة أخرى؟",
          a: "نعم. يتم إرسال الرابط إلى FastSaver للحصول على الملف. لا ترسل روابط تحتوي على معلومات خاصة أو بيانات اعتماد.",
        },
        {
          q: "لماذا انتهت صلاحية رابط التنزيل؟",
          a: "الملفات متاحة مؤقتًا. قم بالتنزيل بعد التحضير مباشرة؛ إذا انتهت صلاحية الرابط، قم بتحضير الفيديو مرة أخرى.",
        },
      ],
    },
    hi: {
      intro: `${info.formats}. फ़ाइल तैयार करने के लिए अपने वीडियो या जिसे डाउनलोड करने की अनुमति है उसका लिंक पेस्ट करें।`,
      placeholder: "वीडियो लिंक यहाँ पेस्ट करें",
      qualityLabel: "गुणवत्ता",
      authCheckbox: "मैं पुष्टि करता/करती हूँ कि यह वीडियो मेरा है या मुझे इसे डाउनलोड करने की अनुमति है",
      downloadButton: "वीडियो तैयार करें",
      downloading: "तैयार किया जा रहा है…",
      platformsLabel: "वीडियो प्लेटफ़ॉर्म",
      videoReady: "वीडियो तैयार",
      download: "डाउनलोड करें",
      viewOriginal: "मूल देखें",
      prepare: "दूसरा तैयार करें",
      authError: "पुष्टि करें कि वीडियो आपका है या आपके पास इसे डाउनलोड करने की अनुमति है।",
      prepareError: "वीडियो तैयार नहीं किया जा सका। कृपया पुनः प्रयास करें।",
      faq: [
        {
          q: `${info.name} वीडियो कैसे डाउनलोड करें?`,
          a: "सार्वजनिक लिंक पेस्ट करें, पुष्टि करें कि आपके पास प्राधिकरण है, और वीडियो तैयार करें। जब फ़ाइल तैयार हो, तो डाउनलोड बटन का उपयोग करें।",
        },
        {
          q: "क्या मैं निजी या सुरक्षित वीडियो डाउनलोड कर सकता/सकती हूँ?",
          a: "नहीं। उपकरण लॉगिन, भुगतान या सामग्री सुरक्षा को बायपास नहीं करता है। कॉपीराइट और प्लेटफ़ॉर्म नियमों का सम्मान करें।",
        },
        {
          q: "क्या यह निःशुल्क और बिना पंजीकरण के है?",
          a: "हाँ, i-Tools आगंतुकों के लिए। उपलब्धता क्रेडिट और डाउनलोड सेवा सीमाओं पर निर्भर करती है।",
        },
        {
          q: "क्या मेरे लिंक दूसरी सेवा को भेजे जाते हैं?",
          a: "हाँ। फ़ाइल प्राप्त करने के लिए लिंक FastSaver को भेजा जाता है। निजी जानकारी या क्रेडेंशियल्स वाले लिंक न भेजें।",
        },
        {
          q: "डाउनलोड लिंक की समय सीमा क्यों समाप्त हो गई?",
          a: "फ़ाइलें अस्थायी रूप से उपलब्ध हैं। तैयार करने के तुरंत बाद डाउनलोड करें; यदि लिंक की समय सीमा समाप्त हो जाती है, तो वीडियो को फिर से तैयार करें।",
        },
      ],
    },
    id: {
      intro: `${info.formats}. Tempel tautan ke video Anda atau video yang Anda izinkan untuk diunduh untuk menyiapkan file.`,
      placeholder: "Tempel tautan video di sini",
      qualityLabel: "Kualitas",
      authCheckbox: "Saya mengonfirmasi bahwa video ini milik saya atau saya memiliki izin untuk mengunduhnya",
      downloadButton: "Siapkan video",
      downloading: "Menyiapkan…",
      platformsLabel: "Platform video",
      videoReady: "Video siap",
      download: "Unduh",
      viewOriginal: "Lihat asli",
      prepare: "Siapkan yang lain",
      authError: "Konfirmasikan bahwa video adalah milik Anda atau Anda memiliki izin untuk mengunduhnya.",
      prepareError: "Tidak dapat menyiapkan video. Silakan coba lagi.",
      faq: [
        {
          q: `Bagaimana cara mengunduh video ${info.name}?`,
          a: "Tempel tautan publik, konfirmasi bahwa Anda memiliki otorisasi, dan siapkan video. Ketika file sudah siap, gunakan tombol unduh.",
        },
        {
          q: "Bisakah saya mengunduh video pribadi atau terlindungi?",
          a: "Tidak. Alat ini tidak melewati login, pembayaran, atau perlindungan konten. Hormati hak cipta dan aturan platform.",
        },
        {
          q: "Apakah gratis dan tanpa pendaftaran?",
          a: "Ya, untuk pengunjung i-Tools. Ketersediaan tergantung pada kredit dan batas layanan unduhan.",
        },
        {
          q: "Apakah tautan saya dikirim ke layanan lain?",
          a: "Ya. Tautan dikirim ke FastSaver untuk mendapatkan file. Jangan kirim tautan yang berisi informasi pribadi atau kredensial.",
        },
        {
          q: "Mengapa tautan unduhan kedaluwarsa?",
          a: "File tersedia sementara. Unduh segera setelah menyiapkan; jika tautan kedaluwarsa, siapkan video lagi.",
        },
      ],
    },
    ja: {
      intro: `${info.formats}。ファイルを準備するために、あなたの動画またはダウンロードが許可されている動画のリンクを貼り付けてください。`,
      placeholder: "動画リンクをここに貼り付け",
      qualityLabel: "品質",
      authCheckbox: "この動画が自分のものであるか、ダウンロードする許可があることを確認します",
      downloadButton: "動画を準備",
      downloading: "準備中…",
      platformsLabel: "動画プラットフォーム",
      videoReady: "動画準備完了",
      download: "ダウンロード",
      viewOriginal: "元を表示",
      prepare: "別のものを準備",
      authError: "動画があなたのものであるか、ダウンロードする許可があることを確認してください。",
      prepareError: "動画を準備できませんでした。もう一度お試しください。",
      faq: [
        {
          q: `${info.name}動画をダウンロードする方法は？`,
          a: "公開リンクを貼り付け、許可があることを確認し、動画を準備します。ファイルの準備ができたら、ダウンロードボタンを使用します。",
        },
        {
          q: "プライベートまたは保護された動画をダウンロードできますか？",
          a: "いいえ。このツールはログイン、支払い、またはコンテンツ保護を回避しません。著作権とプラットフォームルールを尊重してください。",
        },
        {
          q: "無料で登録不要ですか？",
          a: "はい、i-Tools訪問者向けです。利用可能性はクレジットとダウンロードサービスの制限に依存します。",
        },
        {
          q: "私のリンクは別のサービスに送信されますか？",
          a: "はい。リンクはファイルを取得するためにFastSaverに送信されます。個人情報や認証情報を含むリンクを送信しないでください。",
        },
        {
          q: "ダウンロードリンクが期限切れになったのはなぜですか？",
          a: "ファイルは一時的に利用可能です。準備後すぐにダウンロードしてください。リンクが期限切れになった場合は、動画を再度準備してください。",
        },
      ],
    },
    ko: {
      intro: `${info.formats}. 파일을 준비하기 위해 본인의 비디오 또는 다운로드 권한이 있는 비디오 링크를 붙여넣으세요.`,
      placeholder: "비디오 링크를 여기에 붙여넣기",
      qualityLabel: "품질",
      authCheckbox: "이 비디오가 내 것이거나 다운로드할 권한이 있음을 확인합니다",
      downloadButton: "비디오 준비",
      downloading: "준비 중…",
      platformsLabel: "비디오 플랫폼",
      videoReady: "비디오 준비 완료",
      download: "다운로드",
      viewOriginal: "원본 보기",
      prepare: "다른 것 준비",
      authError: "비디오가 귀하의 것이거나 다운로드할 권한이 있음을 확인하세요.",
      prepareError: "비디오를 준비할 수 없습니다. 다시 시도하세요.",
      faq: [
        {
          q: `${info.name} 비디오를 다운로드하는 방법은?`,
          a: "공개 링크를 붙여넣고 권한이 있음을 확인한 후 비디오를 준비합니다. 파일이 준비되면 다운로드 버튼을 사용합니다.",
        },
        {
          q: "비공개 또는 보호된 비디오를 다운로드할 수 있나요?",
          a: "아니요. 이 도구는 로그인, 결제 또는 콘텐츠 보호를 우회하지 않습니다. 저작권 및 플랫폼 규칙을 존중하세요.",
        },
        {
          q: "무료이며 등록이 필요 없나요?",
          a: "예, i-Tools 방문자용입니다. 가용성은 크레딧 및 다운로드 서비스 제한에 따라 다릅니다.",
        },
        {
          q: "내 링크가 다른 서비스로 전송되나요?",
          a: "예. 파일을 얻기 위해 링크가 FastSaver로 전송됩니다. 개인 정보 또는 자격 증명이 포함된 링크를 보내지 마세요.",
        },
        {
          q: "다운로드 링크가 만료된 이유는 무엇인가요?",
          a: "파일은 일시적으로 사용 가능합니다. 준비 후 곧바로 다운로드하세요. 링크가 만료되면 비디오를 다시 준비하세요.",
        },
      ],
    },
    zh: {
      intro: `${info.formats}。粘贴您的视频或您有权下载的视频的链接以准备文件。`,
      placeholder: "在此粘贴视频链接",
      qualityLabel: "质量",
      authCheckbox: "我确认此视频是我的或我有权下载它",
      downloadButton: "准备视频",
      downloading: "准备中…",
      platformsLabel: "视频平台",
      videoReady: "视频已准备好",
      download: "下载",
      viewOriginal: "查看原始",
      prepare: "准备另一个",
      authError: "确认视频是您的或您有权下载它。",
      prepareError: "无法准备视频。请重试。",
      faq: [
        {
          q: `如何下载${info.name}视频？`,
          a: "粘贴公共链接，确认您有授权，并准备视频。当文件准备好时，使用下载按钮。",
        },
        {
          q: "我可以下载私人或受保护的视频吗？",
          a: "不可以。该工具不绕过登录、付款或内容保护。尊重版权和平台规则。",
        },
        {
          q: "免费且无需注册吗？",
          a: "是的，适用于i-Tools访问者。可用性取决于积分和下载服务限制。",
        },
        {
          q: "我的链接会发送到其他服务吗？",
          a: "是的。链接被发送到FastSaver以获取文件。不要发送包含私人信息或凭据的链接。",
        },
        {
          q: "为什么下载链接过期了？",
          a: "文件暂时可用。准备后立即下载；如果链接过期，请重新准备视频。",
        },
      ],
    },
    vi: {
      intro: `${info.formats}. Dán liên kết đến video của bạn hoặc video bạn được phép tải xuống để chuẩn bị tệp.`,
      placeholder: "Dán liên kết video vào đây",
      qualityLabel: "Chất lượng",
      authCheckbox: "Tôi xác nhận video này là của tôi hoặc tôi có quyền tải xuống",
      downloadButton: "Chuẩn bị video",
      downloading: "Đang chuẩn bị…",
      platformsLabel: "Nền tảng video",
      videoReady: "Video đã sẵn sàng",
      download: "Tải xuống",
      viewOriginal: "Xem gốc",
      prepare: "Chuẩn bị video khác",
      authError: "Xác nhận rằng video là của bạn hoặc bạn có quyền tải xuống.",
      prepareError: "Không thể chuẩn bị video. Vui lòng thử lại.",
      faq: [
        {
          q: `Làm cách nào để tải xuống video ${info.name}?`,
          a: "Dán liên kết công khai, xác nhận bạn có ủy quyền và chuẩn bị video. Khi tệp sẵn sàng, sử dụng nút tải xuống.",
        },
        {
          q: "Tôi có thể tải xuống video riêng tư hoặc được bảo vệ không?",
          a: "Không. Công cụ không vượt qua đăng nhập, thanh toán hoặc bảo vệ nội dung. Tôn trọng bản quyền và quy tắc nền tảng.",
        },
        {
          q: "Có miễn phí và không cần đăng ký không?",
          a: "Có, dành cho khách truy cập i-Tools. Tính khả dụng phụ thuộc vào tín dụng và giới hạn dịch vụ tải xuống.",
        },
        {
          q: "Liên kết của tôi có được gửi đến dịch vụ khác không?",
          a: "Có. Liên kết được gửi đến FastSaver để lấy tệp. Đừng gửi liên kết chứa thông tin cá nhân hoặc thông tin xác thực.",
        },
        {
          q: "Tại sao liên kết tải xuống hết hạn?",
          a: "Tệp có sẵn tạm thời. Tải xuống ngay sau khi chuẩn bị; nếu liên kết hết hạn, hãy chuẩn bị lại video.",
        },
      ],
    },
  };
  
  return texts[lang] || texts.pt;
}

export function LocalizedVideoDownloader({ 
  platform, 
  lang = "pt" 
}: { 
  platform: VideoPlatform;
  lang?: LanguageCode;
}) {
  const info = videoPlatforms[platform];
  const t = getTranslations(lang);
  const texts = getVideoTexts(lang, platform);
  const id = useId();
  const [url, setUrl] = useState("");
  const [quality, setQuality] = useState<"360p" | "480p" | "720p" | "1080p">("720p");
  const [authorized, setAuthorized] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<VideoDownloadResult | null>(null);
  const prepare = useServerFn(prepareVideo);
  const revision = useRef(0);

  function reset() {
    revision.current++;
    setResult(null);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const link = validateVideoLink(url, platform);
    if (!link.valid) {
      setResult({ ok: false, error: link.error });
      return;
    }
    if (!authorized) {
      setResult({
        ok: false,
        error: texts.authError,
      });
      return;
    }
    const current = ++revision.current;
    setBusy(true);
    setResult(null);
    try {
      const response = await prepare({
        data: { platform, url: link.url, quality, authorized: true },
      });
      if (current === revision.current) setResult(response);
    } catch {
      if (current === revision.current)
        setResult({ ok: false, error: texts.prepareError });
    } finally {
      setBusy(false);
    }
  }

  const toolTranslation = t.tools[info.slug as keyof typeof t.tools];
  const category = info.category;
  const categoryTranslation = category ? t.categories[category as keyof typeof t.categories] : undefined;

  return (
    <ToolLayout
      slug={info.slug}
      intro={texts.intro}
      faq={texts.faq}
      lang={lang}
      toolName={toolTranslation?.name}
      categoryName={categoryTranslation?.name}
      translations={{
        home: t.nav.home,
        faq: t.common.faq,
        alsoIn: t.common.alsoIn,
      }}
    >
      <nav
        aria-label={texts.platformsLabel}
        className="mb-6 flex flex-wrap gap-x-6 gap-y-3 border-b border-border pb-4 text-sm"
      >
        {(Object.keys(videoPlatforms) as VideoPlatform[]).map((key) => (
          <Link
            key={key}
            to={lang === "pt" ? "/$tool" : "/$lang/$tool"}
            params={lang === "pt" ? { tool: videoPlatforms[key].slug } : { lang, tool: videoPlatforms[key].slug }}
            aria-current={key === platform ? "page" : undefined}
            className={
              key === platform
                ? "font-semibold text-primary underline underline-offset-8"
                : "text-muted-foreground hover:text-foreground"
            }
          >
            {videoPlatforms[key].name}
          </Link>
        ))}
      </nav>
      <div className={panel}>
        <form onSubmit={submit} className="space-y-6">
          <div>
            <label htmlFor={id} className="mb-2 block text-sm font-medium">
              {texts.placeholder}
            </label>
            <input
              id={id}
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                reset();
              }}
              placeholder={`https://${info.domain}/...`}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={busy}
            />
          </div>
          <div>
            <label htmlFor={`${id}-quality`} className="mb-2 block text-sm font-medium">
              {texts.qualityLabel}
            </label>
            <select
              id={`${id}-quality`}
              value={quality}
              onChange={(e) => setQuality(e.target.value as any)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={busy}
            >
              <option value="360p">360p</option>
              <option value="480p">480p</option>
              <option value="720p">720p (HD)</option>
              <option value="1080p">1080p (Full HD)</option>
            </select>
          </div>
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={authorized}
              onChange={(e) => setAuthorized(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300"
              disabled={busy}
            />
            <span className="leading-relaxed">{texts.authCheckbox}</span>
          </label>
          <Button type="submit" disabled={busy || !url.trim()} className="w-full">
            {busy ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                {texts.downloading}
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" aria-hidden />
                {texts.downloadButton}
              </>
            )}
          </Button>
        </form>
        {result && (
          <div className="mt-6 animate-in fade-in slide-in-from-top-2">
            {result.ok ? (
              <div className="space-y-3 rounded-md bg-green-50 p-4 dark:bg-green-950/20">
                <p className="flex items-center gap-2 text-sm font-semibold text-green-900 dark:text-green-100">
                  <Download className="h-4 w-4" aria-hidden />
                  {texts.videoReady}
                </p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={result.downloadUrl}
                    download
                    className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                  >
                    <Download className="h-4 w-4" aria-hidden />
                    {texts.download}
                  </a>
                  <a
                    href={result.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-green-600 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-50 dark:text-green-100 dark:hover:bg-green-950/40"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden />
                    {texts.viewOriginal}
                  </a>
                </div>
                <button
                  type="button"
                  onClick={reset}
                  className="flex items-center gap-2 text-sm text-green-700 hover:text-green-900 dark:text-green-300 dark:hover:text-green-100"
                >
                  <Link2 className="h-4 w-4" aria-hidden />
                  {texts.prepare}
                </button>
              </div>
            ) : (
              <div className="rounded-md bg-red-50 p-4 dark:bg-red-950/20">
                <p className="flex items-start gap-2 text-sm text-red-900 dark:text-red-100">
                  <X className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden />
                  <span>{result.error}</span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
