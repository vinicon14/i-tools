import type { LanguageCode } from "./i18n";

export type Translations = {
  lang: LanguageCode;
  site: {
    name: string;
    tagline: string;
    description: string;
    titleTemplate: string;
  };
  categories: {
    arquivos: { name: string; description: string };
    imagens: { name: string; description: string };
    texto: { name: string; description: string };
    calculadoras: { name: string; description: string };
    produtividade: { name: string; description: string };
    desenvolvedores: { name: string; description: string };
  };
  tools: {
    [key: string]: {
      name: string;
      summary: string;
    };
  };
  nav: {
    home: string;
    about: string;
    contact: string;
    privacy: string;
    terms: string;
    search: string;
    categories: string;
    openMenu: string;
    skipToContent: string;
  };
  common: {
    available: string;
    comingSoon: string;
    loading: string;
    error: string;
    copy: string;
    copied: string;
    download: string;
    selectLanguage: string;
    faq: string;
    alsoIn: string;
    notFound: string;
    notFoundDescription: string;
    backToHome: string;
    advertisement: string;
  };
};

export const translations: Record<LanguageCode, Omit<Translations, 'lang'>> = {
  pt: {
    site: {
      name: "i-Tools",
      tagline: "Ferramentas inteligentes para simplificar seu dia.",
      description: "Ferramentas online gratuitas para arquivos, imagens, texto, cálculos e desenvolvimento. Direto no navegador, sem cadastro e sem instalação.",
      titleTemplate: "%s — i-Tools",
    },
    categories: {
      arquivos: {
        name: "Arquivos e documentos",
        description: "Converter, juntar e organizar PDFs e outros arquivos.",
      },
      imagens: {
        name: "Imagens e design",
        description: "Comprimir, redimensionar e converter imagens.",
      },
      texto: {
        name: "Texto e escrita",
        description: "Contar, formatar e transformar textos.",
      },
      calculadoras: {
        name: "Calculadoras",
        description: "Porcentagens, datas, finanças e unidades.",
      },
      produtividade: {
        name: "Produtividade",
        description: "QR Codes, listas e utilitários do dia a dia.",
      },
      desenvolvedores: {
        name: "Desenvolvedores",
        description: "Formatadores, geradores e conversores técnicos.",
      },
    },
    tools: {
      "baixar-video-youtube": {
        name: "Baixar vídeo do YouTube",
        summary: "Baixe vídeos e Shorts públicos autorizados, com escolha de qualidade.",
      },
      "baixar-video-tiktok": {
        name: "Baixar vídeo do TikTok sem marca d'água",
        summary: "Baixe vídeos públicos do TikTok sem marca d'água que sejam seus ou autorizados.",
      },
      "baixar-video-instagram": {
        name: "Baixar vídeo do Instagram",
        summary: "Baixe Reels e vídeos públicos seus ou com autorização.",
      },
      qr: {
        name: "Gerador de QR Code",
        summary: "Transforme qualquer URL em um QR Code pronto para baixar.",
      },
      "comprimir-imagem": {
        name: "Compressor de imagens",
        summary: "Comprima JPG, PNG e WebP com controle de qualidade.",
      },
      pdf: {
        name: "Conversor de PDF",
        summary: "Converta imagens e TXT em PDF ou PDF em imagens PNG.",
      },
      senhas: {
        name: "Gerador de senhas",
        summary: "Senhas fortes e aleatórias, geradas no seu dispositivo.",
      },
      "contador-de-palavras": {
        name: "Contador de palavras",
        summary: "Palavras, caracteres e tempo de leitura de qualquer texto.",
      },
      json: {
        name: "Formatador JSON",
        summary: "Valide e formate JSON com legibilidade.",
      },
      "meu-ip": {
        name: "Qual é meu IP",
        summary: "Veja o endereço IP público da sua conexão.",
      },
      "meu-cep": {
        name: "Consulta CEP e Endereço",
        summary: "Busque CEP, descubra endereços ou encontre o código postal pela localização.",
      },
      "redimensionar-imagem": {
        name: "Redimensionador de imagens",
        summary: "Ajuste largura e altura para redes sociais e sites.",
      },
      porcentagem: {
        name: "Calculadora de porcentagem",
        summary: "Descontos, aumentos e variações em segundos.",
      },
      "paleta-de-cores": {
        name: "Gerador de paletas",
        summary: "Combinações de cores com códigos HEX e RGB.",
      },
      cronometro: {
        name: "Cronômetro e timer",
        summary: "Contagem regressiva e pomodoro no navegador.",
      },
    },
    nav: {
      home: "Início",
      about: "Sobre o i-Tools",
      contact: "Contato",
      privacy: "Privacidade",
      terms: "Termos",
      search: "Buscar",
      categories: "Categorias",
      openMenu: "Abrir menu",
      skipToContent: "Pular para o conteúdo",
    },
    common: {
      available: "Disponível",
      comingSoon: "Em breve",
      loading: "Carregando",
      error: "Erro",
      copy: "Copiar",
      copied: "Copiado!",
      download: "Baixar",
      selectLanguage: "Selecionar idioma",
      faq: "Perguntas frequentes",
      alsoIn: "Também em",
      notFound: "Página não encontrada",
      notFoundDescription: "Esta página não existe ou foi movida.",
      backToHome: "Voltar ao início",
      advertisement: "Publicidade",
    },
  },
  en: {
    site: {
      name: "i-Tools",
      tagline: "Smart tools to simplify your day.",
      description: "Free online tools for files, images, text, calculations, and development. Right in your browser, no signup, no installation.",
      titleTemplate: "%s — i-Tools",
    },
    categories: {
      arquivos: {
        name: "Files and Documents",
        description: "Convert, merge, and organize PDFs and other files.",
      },
      imagens: {
        name: "Images and Design",
        description: "Compress, resize, and convert images.",
      },
      texto: {
        name: "Text and Writing",
        description: "Count, format, and transform text.",
      },
      calculadoras: {
        name: "Calculators",
        description: "Percentages, dates, finance, and units.",
      },
      produtividade: {
        name: "Productivity",
        description: "QR Codes, lists, and everyday utilities.",
      },
      desenvolvedores: {
        name: "Developers",
        description: "Formatters, generators, and technical converters.",
      },
    },
    tools: {
      "baixar-video-youtube": {
        name: "YouTube Video Downloader",
        summary: "Download authorized public videos and Shorts, with quality options.",
      },
      "baixar-video-tiktok": {
        name: "TikTok Video Downloader Without Watermark",
        summary: "Download public TikTok videos without watermark that are yours or authorized.",
      },
      "baixar-video-instagram": {
        name: "Instagram Video Downloader",
        summary: "Download your Reels and public videos with authorization.",
      },
      qr: {
        name: "QR Code Generator",
        summary: "Turn any URL into a downloadable QR Code.",
      },
      "comprimir-imagem": {
        name: "Image Compressor",
        summary: "Compress JPG, PNG, and WebP with quality control.",
      },
      pdf: {
        name: "PDF Converter",
        summary: "Convert images and TXT to PDF or PDF to PNG images.",
      },
      senhas: {
        name: "Password Generator",
        summary: "Strong random passwords, generated on your device.",
      },
      "contador-de-palavras": {
        name: "Word Counter",
        summary: "Words, characters, and reading time for any text.",
      },
      json: {
        name: "JSON Formatter",
        summary: "Validate and format JSON with readability.",
      },
      "meu-ip": {
        name: "What's My IP",
        summary: "See your connection's public IP address.",
      },
      "meu-cep": {
        name: "Postal Code and Address Lookup",
        summary: "Search postal codes, find addresses, or discover the code by location.",
      },
      "redimensionar-imagem": {
        name: "Image Resizer",
        summary: "Adjust width and height for social media and websites.",
      },
      porcentagem: {
        name: "Percentage Calculator",
        summary: "Discounts, increases, and variations in seconds.",
      },
      "paleta-de-cores": {
        name: "Color Palette Generator",
        summary: "Color combinations with HEX and RGB codes.",
      },
      cronometro: {
        name: "Stopwatch and Timer",
        summary: "Countdown and pomodoro in your browser.",
      },
    },
    nav: {
      home: "Home",
      about: "About i-Tools",
      contact: "Contact",
      privacy: "Privacy",
      terms: "Terms",
      search: "Search",
      categories: "Categories",
      openMenu: "Open menu",
      skipToContent: "Skip to content",
    },
    common: {
      available: "Available",
      comingSoon: "Coming soon",
      loading: "Loading",
      error: "Error",
      copy: "Copy",
      copied: "Copied!",
      download: "Download",
      selectLanguage: "Select language",
      faq: "Frequently Asked Questions",
      alsoIn: "Also in",
      notFound: "Page not found",
      notFoundDescription: "This page doesn't exist or has been moved.",
      backToHome: "Back to home",
      advertisement: "Advertisement",
    },
  },
  es: {
    site: {
      name: "i-Tools",
      tagline: "Herramientas inteligentes para simplificar tu día.",
      description: "Herramientas en línea gratuitas para archivos, imágenes, texto, cálculos y desarrollo. Directo en tu navegador, sin registro y sin instalación.",
      titleTemplate: "%s — i-Tools",
    },
    categories: {
      arquivos: {
        name: "Archivos y Documentos",
        description: "Convertir, combinar y organizar PDFs y otros archivos.",
      },
      imagens: {
        name: "Imágenes y Diseño",
        description: "Comprimir, redimensionar y convertir imágenes.",
      },
      texto: {
        name: "Texto y Escritura",
        description: "Contar, formatear y transformar textos.",
      },
      calculadoras: {
        name: "Calculadoras",
        description: "Porcentajes, fechas, finanzas y unidades.",
      },
      produtividade: {
        name: "Productividad",
        description: "Códigos QR, listas y utilidades diarias.",
      },
      desenvolvedores: {
        name: "Desarrolladores",
        description: "Formateadores, generadores y convertidores técnicos.",
      },
    },
    tools: {
      "baixar-video-youtube": {
        name: "Descargar Video de YouTube",
        summary: "Descarga videos y Shorts públicos autorizados, con opciones de calidad.",
      },
      "baixar-video-tiktok": {
        name: "Descargar Video de TikTok sin Marca de Agua",
        summary: "Descarga videos públicos de TikTok sin marca de agua que sean tuyos o autorizados.",
      },
      "baixar-video-instagram": {
        name: "Descargar Video de Instagram",
        summary: "Descarga tus Reels y videos públicos con autorización.",
      },
      qr: {
        name: "Generador de Código QR",
        summary: "Convierte cualquier URL en un código QR listo para descargar.",
      },
      "comprimir-imagem": {
        name: "Compresor de Imágenes",
        summary: "Comprime JPG, PNG y WebP con control de calidad.",
      },
      pdf: {
        name: "Conversor de PDF",
        summary: "Convierte imágenes y TXT a PDF o PDF a imágenes PNG.",
      },
      senhas: {
        name: "Generador de Contraseñas",
        summary: "Contraseñas fuertes y aleatorias, generadas en tu dispositivo.",
      },
      "contador-de-palavras": {
        name: "Contador de Palabras",
        summary: "Palabras, caracteres y tiempo de lectura de cualquier texto.",
      },
      json: {
        name: "Formateador JSON",
        summary: "Valida y formatea JSON con legibilidad.",
      },
      "meu-ip": {
        name: "Cuál es mi IP",
        summary: "Ve la dirección IP pública de tu conexión.",
      },
      "meu-cep": {
        name: "Consulta Código Postal y Dirección",
        summary: "Busca códigos postales, encuentra direcciones o descubre el código por ubicación.",
      },
      "redimensionar-imagem": {
        name: "Redimensionador de Imágenes",
        summary: "Ajusta ancho y alto para redes sociales y sitios web.",
      },
      porcentagem: {
        name: "Calculadora de Porcentajes",
        summary: "Descuentos, aumentos y variaciones en segundos.",
      },
      "paleta-de-cores": {
        name: "Generador de Paletas",
        summary: "Combinaciones de colores con códigos HEX y RGB.",
      },
      cronometro: {
        name: "Cronómetro y Temporizador",
        summary: "Cuenta regresiva y pomodoro en tu navegador.",
      },
    },
    nav: {
      home: "Inicio",
      about: "Acerca de i-Tools",
      contact: "Contacto",
      privacy: "Privacidad",
      terms: "Términos",
      search: "Buscar",
      categories: "Categorías",
      openMenu: "Abrir menú",
      skipToContent: "Saltar al contenido",
    },
    common: {
      available: "Disponible",
      comingSoon: "Próximamente",
      loading: "Cargando",
      error: "Error",
      copy: "Copiar",
      copied: "¡Copiado!",
      download: "Descargar",
      selectLanguage: "Seleccionar idioma",
      faq: "Preguntas Frecuentes",
      alsoIn: "También en",
      notFound: "Página no encontrada",
      notFoundDescription: "Esta página no existe o ha sido movida.",
      backToHome: "Volver al inicio",
      advertisement: "Publicidad",
    },
  },
  fr: {
    site: {
      name: "i-Tools",
      tagline: "Des outils intelligents pour simplifier votre journée.",
      description: "Outils en ligne gratuits pour les fichiers, images, texte, calculs et développement. Directement dans votre navigateur, sans inscription et sans installation.",
      titleTemplate: "%s — i-Tools",
    },
    categories: {
      arquivos: {
        name: "Fichiers et Documents",
        description: "Convertir, fusionner et organiser des PDFs et autres fichiers.",
      },
      imagens: {
        name: "Images et Design",
        description: "Compresser, redimensionner et convertir des images.",
      },
      texto: {
        name: "Texte et Écriture",
        description: "Compter, formater et transformer du texte.",
      },
      calculadoras: {
        name: "Calculatrices",
        description: "Pourcentages, dates, finances et unités.",
      },
      produtividade: {
        name: "Productivité",
        description: "Codes QR, listes et utilitaires quotidiens.",
      },
      desenvolvedores: {
        name: "Développeurs",
        description: "Formateurs, générateurs et convertisseurs techniques.",
      },
    },
    tools: {
      "baixar-video-youtube": {
        name: "Télécharger Vidéo YouTube",
        summary: "Téléchargez des vidéos et Shorts publics autorisés, avec choix de qualité.",
      },
      "baixar-video-tiktok": {
        name: "Télécharger Vidéo TikTok sans Filigrane",
        summary: "Téléchargez des vidéos TikTok publiques sans filigrane qui sont les vôtres ou autorisées.",
      },
      "baixar-video-instagram": {
        name: "Télécharger Vidéo Instagram",
        summary: "Téléchargez vos Reels et vidéos publiques avec autorisation.",
      },
      qr: {
        name: "Générateur de Code QR",
        summary: "Transformez n'importe quelle URL en code QR prêt à télécharger.",
      },
      "comprimir-imagem": {
        name: "Compresseur d'Images",
        summary: "Compressez JPG, PNG et WebP avec contrôle de qualité.",
      },
      pdf: {
        name: "Convertisseur PDF",
        summary: "Convertissez images et TXT en PDF ou PDF en images PNG.",
      },
      senhas: {
        name: "Générateur de Mots de Passe",
        summary: "Mots de passe forts et aléatoires, générés sur votre appareil.",
      },
      "contador-de-palavras": {
        name: "Compteur de Mots",
        summary: "Mots, caractères et temps de lecture de tout texte.",
      },
      json: {
        name: "Formateur JSON",
        summary: "Validez et formatez JSON avec lisibilité.",
      },
      "meu-ip": {
        name: "Quelle est mon IP",
        summary: "Voyez l'adresse IP publique de votre connexion.",
      },
      "meu-cep": {
        name: "Recherche Code Postal et Adresse",
        summary: "Recherchez des codes postaux, trouvez des adresses ou découvrez le code par localisation.",
      },
      "redimensionar-imagem": {
        name: "Redimensionneur d'Images",
        summary: "Ajustez largeur et hauteur pour réseaux sociaux et sites web.",
      },
      porcentagem: {
        name: "Calculateur de Pourcentage",
        summary: "Remises, augmentations et variations en secondes.",
      },
      "paleta-de-cores": {
        name: "Générateur de Palettes",
        summary: "Combinaisons de couleurs avec codes HEX et RGB.",
      },
      cronometro: {
        name: "Chronomètre et Minuteur",
        summary: "Compte à rebours et pomodoro dans votre navigateur.",
      },
    },
    nav: {
      home: "Accueil",
      about: "À propos d'i-Tools",
      contact: "Contact",
      privacy: "Confidentialité",
      terms: "Conditions",
      search: "Rechercher",
      categories: "Catégories",
      openMenu: "Ouvrir le menu",
      skipToContent: "Aller au contenu",
    },
    common: {
      available: "Disponible",
      comingSoon: "Bientôt disponible",
      loading: "Chargement",
      error: "Erreur",
      copy: "Copier",
      copied: "Copié !",
      download: "Télécharger",
      selectLanguage: "Sélectionner la langue",
      faq: "Questions Fréquentes",
      alsoIn: "Également dans",
      notFound: "Page non trouvée",
      notFoundDescription: "Cette page n'existe pas ou a été déplacée.",
      backToHome: "Retour à l'accueil",
      advertisement: "Publicité",
    },
  },
  de: {
    site: {
      name: "i-Tools",
      tagline: "Intelligente Werkzeuge zur Vereinfachung Ihres Tages.",
      description: "Kostenlose Online-Tools für Dateien, Bilder, Text, Berechnungen und Entwicklung. Direkt in Ihrem Browser, ohne Anmeldung und ohne Installation.",
      titleTemplate: "%s — i-Tools",
    },
    categories: {
      arquivos: {
        name: "Dateien und Dokumente",
        description: "PDFs und andere Dateien konvertieren, zusammenführen und organisieren.",
      },
      imagens: {
        name: "Bilder und Design",
        description: "Bilder komprimieren, skalieren und konvertieren.",
      },
      texto: {
        name: "Text und Schreiben",
        description: "Text zählen, formatieren und transformieren.",
      },
      calculadoras: {
        name: "Rechner",
        description: "Prozentsätze, Daten, Finanzen und Einheiten.",
      },
      produtividade: {
        name: "Produktivität",
        description: "QR-Codes, Listen und alltägliche Hilfsmittel.",
      },
      desenvolvedores: {
        name: "Entwickler",
        description: "Formatierer, Generatoren und technische Konverter.",
      },
    },
    tools: {
      "baixar-video-youtube": {
        name: "YouTube Video Downloader",
        summary: "Laden Sie autorisierte öffentliche Videos und Shorts mit Qualitätsoptionen herunter.",
      },
      "baixar-video-tiktok": {
        name: "TikTok Video Downloader ohne Wasserzeichen",
        summary: "Laden Sie öffentliche TikTok-Videos ohne Wasserzeichen herunter, die Ihnen gehören oder autorisiert sind.",
      },
      "baixar-video-instagram": {
        name: "Instagram Video Downloader",
        summary: "Laden Sie Ihre Reels und öffentlichen Videos mit Autorisierung herunter.",
      },
      qr: {
        name: "QR-Code Generator",
        summary: "Verwandeln Sie jede URL in einen herunterladbaren QR-Code.",
      },
      "comprimir-imagem": {
        name: "Bildkompressor",
        summary: "Komprimieren Sie JPG, PNG und WebP mit Qualitätskontrolle.",
      },
      pdf: {
        name: "PDF Konverter",
        summary: "Konvertieren Sie Bilder und TXT in PDF oder PDF in PNG-Bilder.",
      },
      senhas: {
        name: "Passwortgenerator",
        summary: "Starke Zufallspasswörter, generiert auf Ihrem Gerät.",
      },
      "contador-de-palavras": {
        name: "Wortzähler",
        summary: "Wörter, Zeichen und Lesezeit für jeden Text.",
      },
      json: {
        name: "JSON Formatierer",
        summary: "JSON mit Lesbarkeit validieren und formatieren.",
      },
      "meu-ip": {
        name: "Was ist meine IP",
        summary: "Sehen Sie die öffentliche IP-Adresse Ihrer Verbindung.",
      },
      "meu-cep": {
        name: "Postleitzahl- und Adresssuche",
        summary: "Suchen Sie Postleitzahlen, finden Sie Adressen oder entdecken Sie den Code nach Standort.",
      },
      "redimensionar-imagem": {
        name: "Bildgrößenanpasser",
        summary: "Passen Sie Breite und Höhe für soziale Medien und Websites an.",
      },
      porcentagem: {
        name: "Prozentrechner",
        summary: "Rabatte, Erhöhungen und Variationen in Sekunden.",
      },
      "paleta-de-cores": {
        name: "Palettengenerator",
        summary: "Farbkombinationen mit HEX- und RGB-Codes.",
      },
      cronometro: {
        name: "Stoppuhr und Timer",
        summary: "Countdown und Pomodoro in Ihrem Browser.",
      },
    },
    nav: {
      home: "Startseite",
      about: "Über i-Tools",
      contact: "Kontakt",
      privacy: "Datenschutz",
      terms: "Bedingungen",
      search: "Suchen",
      categories: "Kategorien",
      openMenu: "Menü öffnen",
      skipToContent: "Zum Inhalt springen",
    },
    common: {
      available: "Verfügbar",
      comingSoon: "Demnächst",
      loading: "Laden",
      error: "Fehler",
      copy: "Kopieren",
      copied: "Kopiert!",
      download: "Herunterladen",
      selectLanguage: "Sprache wählen",
      faq: "Häufig Gestellte Fragen",
      alsoIn: "Auch in",
      notFound: "Seite nicht gefunden",
      notFoundDescription: "Diese Seite existiert nicht oder wurde verschoben.",
      backToHome: "Zurück zur Startseite",
      advertisement: "Werbung",
    },
  },
  it: {
    site: {
      name: "i-Tools",
      tagline: "Strumenti intelligenti per semplificare la tua giornata.",
      description: "Strumenti online gratuiti per file, immagini, testo, calcoli e sviluppo. Direttamente nel tuo browser, senza registrazione e senza installazione.",
      titleTemplate: "%s — i-Tools",
    },
    categories: {
      arquivos: {
        name: "File e Documenti",
        description: "Convertire, unire e organizzare PDF e altri file.",
      },
      imagens: {
        name: "Immagini e Design",
        description: "Comprimere, ridimensionare e convertire immagini.",
      },
      texto: {
        name: "Testo e Scrittura",
        description: "Contare, formattare e trasformare testo.",
      },
      calculadoras: {
        name: "Calcolatrici",
        description: "Percentuali, date, finanze e unità.",
      },
      produtividade: {
        name: "Produttività",
        description: "Codici QR, liste e utilità quotidiane.",
      },
      desenvolvedores: {
        name: "Sviluppatori",
        description: "Formattatori, generatori e convertitori tecnici.",
      },
    },
    tools: {
      "baixar-video-youtube": {
        name: "Scarica Video YouTube",
        summary: "Scarica video e Shorts pubblici autorizzati, con opzioni di qualità.",
      },
      "baixar-video-tiktok": {
        name: "Scarica Video TikTok senza Filigrana",
        summary: "Scarica video TikTok pubblici senza filigrana che sono tuoi o autorizzati.",
      },
      "baixar-video-instagram": {
        name: "Scarica Video Instagram",
        summary: "Scarica i tuoi Reels e video pubblici con autorizzazione.",
      },
      qr: {
        name: "Generatore di Codice QR",
        summary: "Trasforma qualsiasi URL in un codice QR pronto per il download.",
      },
      "comprimir-imagem": {
        name: "Compressore di Immagini",
        summary: "Comprimi JPG, PNG e WebP con controllo della qualità.",
      },
      pdf: {
        name: "Convertitore PDF",
        summary: "Converti immagini e TXT in PDF o PDF in immagini PNG.",
      },
      senhas: {
        name: "Generatore di Password",
        summary: "Password forti e casuali, generate sul tuo dispositivo.",
      },
      "contador-de-palavras": {
        name: "Contatore di Parole",
        summary: "Parole, caratteri e tempo di lettura per qualsiasi testo.",
      },
      json: {
        name: "Formattatore JSON",
        summary: "Valida e formatta JSON con leggibilità.",
      },
      "meu-ip": {
        name: "Qual è il mio IP",
        summary: "Visualizza l'indirizzo IP pubblico della tua connessione.",
      },
      "meu-cep": {
        name: "Ricerca Codice Postale e Indirizzo",
        summary: "Cerca codici postali, trova indirizzi o scopri il codice per posizione.",
      },
      "redimensionar-imagem": {
        name: "Ridimensionatore di Immagini",
        summary: "Regola larghezza e altezza per social media e siti web.",
      },
      porcentagem: {
        name: "Calcolatore di Percentuale",
        summary: "Sconti, aumenti e variazioni in secondi.",
      },
      "paleta-de-cores": {
        name: "Generatore di Palette",
        summary: "Combinazioni di colori con codici HEX e RGB.",
      },
      cronometro: {
        name: "Cronometro e Timer",
        summary: "Conto alla rovescia e pomodoro nel tuo browser.",
      },
    },
    nav: {
      home: "Home",
      about: "Su i-Tools",
      contact: "Contatto",
      privacy: "Privacy",
      terms: "Termini",
      search: "Cerca",
      categories: "Categorie",
      openMenu: "Apri menu",
      skipToContent: "Salta al contenuto",
    },
    common: {
      available: "Disponibile",
      comingSoon: "Prossimamente",
      loading: "Caricamento",
      error: "Errore",
      copy: "Copia",
      copied: "Copiato!",
      download: "Scarica",
      selectLanguage: "Seleziona lingua",
      faq: "Domande Frequenti",
      alsoIn: "Anche in",
      notFound: "Pagina non trovata",
      notFoundDescription: "Questa pagina non esiste o è stata spostata.",
      backToHome: "Torna alla home",
      advertisement: "Pubblicità",
    },
  },
  nl: {
    site: {
      name: "i-Tools",
      tagline: "Slimme tools om je dag te vereenvoudigen.",
      description: "Gratis online tools voor bestanden, afbeeldingen, tekst, berekeningen en ontwikkeling. Direct in je browser, zonder registratie en zonder installatie.",
      titleTemplate: "%s — i-Tools",
    },
    categories: {
      arquivos: {
        name: "Bestanden en Documenten",
        description: "PDF's en andere bestanden converteren, samenvoegen en organiseren.",
      },
      imagens: {
        name: "Afbeeldingen en Design",
        description: "Afbeeldingen comprimeren, schalen en converteren.",
      },
      texto: {
        name: "Tekst en Schrijven",
        description: "Tekst tellen, formatteren en transformeren.",
      },
      calculadoras: {
        name: "Rekenmachines",
        description: "Percentages, datums, financiën en eenheden.",
      },
      produtividade: {
        name: "Productiviteit",
        description: "QR-codes, lijsten en dagelijkse hulpmiddelen.",
      },
      desenvolvedores: {
        name: "Ontwikkelaars",
        description: "Formatters, generatoren en technische converters.",
      },
    },
    tools: {
      "baixar-video-youtube": {
        name: "YouTube Video Downloader",
        summary: "Download geautoriseerde openbare video's en Shorts, met kwaliteitsopties.",
      },
      "baixar-video-tiktok": {
        name: "TikTok Video Downloader zonder Watermerk",
        summary: "Download openbare TikTok-video's zonder watermerk die van jou zijn of geautoriseerd.",
      },
      "baixar-video-instagram": {
        name: "Instagram Video Downloader",
        summary: "Download je Reels en openbare video's met autorisatie.",
      },
      qr: {
        name: "QR-Code Generator",
        summary: "Verander elke URL in een downloadbare QR-code.",
      },
      "comprimir-imagem": {
        name: "Afbeeldingscompressor",
        summary: "Comprimeer JPG, PNG en WebP met kwaliteitscontrole.",
      },
      pdf: {
        name: "PDF Converter",
        summary: "Converteer afbeeldingen en TXT naar PDF of PDF naar PNG-afbeeldingen.",
      },
      senhas: {
        name: "Wachtwoordgenerator",
        summary: "Sterke willekeurige wachtwoorden, gegenereerd op je apparaat.",
      },
      "contador-de-palavras": {
        name: "Woordenteller",
        summary: "Woorden, tekens en leestijd voor elke tekst.",
      },
      json: {
        name: "JSON Formatter",
        summary: "Valideer en formatteer JSON met leesbaarheid.",
      },
      "meu-ip": {
        name: "Wat is mijn IP",
        summary: "Zie het openbare IP-adres van je verbinding.",
      },
      "meu-cep": {
        name: "Postcode en Adres Opzoeken",
        summary: "Zoek postcodes, vind adressen of ontdek de code per locatie.",
      },
      "redimensionar-imagem": {
        name: "Afbeeldingsschaler",
        summary: "Pas breedte en hoogte aan voor sociale media en websites.",
      },
      porcentagem: {
        name: "Percentage Calculator",
        summary: "Kortingen, verhogingen en variaties in seconden.",
      },
      "paleta-de-cores": {
        name: "Palet Generator",
        summary: "Kleurencombinaties met HEX- en RGB-codes.",
      },
      cronometro: {
        name: "Stopwatch en Timer",
        summary: "Aftellen en pomodoro in je browser.",
      },
    },
    nav: {
      home: "Home",
      about: "Over i-Tools",
      contact: "Contact",
      privacy: "Privacy",
      terms: "Voorwaarden",
      search: "Zoeken",
      categories: "Categorieën",
      openMenu: "Menu openen",
      skipToContent: "Ga naar inhoud",
    },
    common: {
      available: "Beschikbaar",
      comingSoon: "Binnenkort",
      loading: "Laden",
      error: "Fout",
      copy: "Kopiëren",
      copied: "Gekopieerd!",
      download: "Downloaden",
      selectLanguage: "Selecteer taal",
      faq: "Veelgestelde Vragen",
      alsoIn: "Ook in",
      notFound: "Pagina niet gevonden",
      notFoundDescription: "Deze pagina bestaat niet of is verplaatst.",
      backToHome: "Terug naar home",
      advertisement: "Advertentie",
    },
  },
  pl: {
    site: {
      name: "i-Tools",
      tagline: "Inteligentne narzędzia upraszczające Twój dzień.",
      description: "Darmowe narzędzia online do plików, obrazów, tekstu, obliczeń i rozwoju. Bezpośrednio w przeglądarce, bez rejestracji i bez instalacji.",
      titleTemplate: "%s — i-Tools",
    },
    categories: {
      arquivos: {
        name: "Pliki i Dokumenty",
        description: "Konwertuj, łącz i organizuj pliki PDF i inne pliki.",
      },
      imagens: {
        name: "Obrazy i Design",
        description: "Kompresuj, skaluj i konwertuj obrazy.",
      },
      texto: {
        name: "Tekst i Pisanie",
        description: "Licz, formatuj i przekształcaj tekst.",
      },
      calculadoras: {
        name: "Kalkulatory",
        description: "Procenty, daty, finanse i jednostki.",
      },
      produtividade: {
        name: "Produktywność",
        description: "Kody QR, listy i codzienne narzędzia.",
      },
      desenvolvedores: {
        name: "Programiści",
        description: "Formatery, generatory i konwertery techniczne.",
      },
    },
    tools: {
      "baixar-video-youtube": {
        name: "Pobieranie Wideo z YouTube",
        summary: "Pobieraj autoryzowane publiczne filmy i Shorts, z opcjami jakości.",
      },
      "baixar-video-tiktok": {
        name: "Pobieranie Wideo z TikTok bez Znaku Wodnego",
        summary: "Pobieraj publiczne filmy TikTok bez znaku wodnego, które są Twoje lub autoryzowane.",
      },
      "baixar-video-instagram": {
        name: "Pobieranie Wideo z Instagram",
        summary: "Pobieraj swoje Reels i publiczne filmy z autoryzacją.",
      },
      qr: {
        name: "Generator Kodu QR",
        summary: "Przekształć każdy URL w kod QR gotowy do pobrania.",
      },
      "comprimir-imagem": {
        name: "Kompresor Obrazów",
        summary: "Kompresuj JPG, PNG i WebP z kontrolą jakości.",
      },
      pdf: {
        name: "Konwerter PDF",
        summary: "Konwertuj obrazy i TXT na PDF lub PDF na obrazy PNG.",
      },
      senhas: {
        name: "Generator Haseł",
        summary: "Silne losowe hasła, generowane na Twoim urządzeniu.",
      },
      "contador-de-palavras": {
        name: "Licznik Słów",
        summary: "Słowa, znaki i czas czytania dla każdego tekstu.",
      },
      json: {
        name: "Formater JSON",
        summary: "Waliduj i formatuj JSON z czytelnością.",
      },
      "meu-ip": {
        name: "Jaki jest mój IP",
        summary: "Zobacz publiczny adres IP Twojego połączenia.",
      },
      "meu-cep": {
        name: "Wyszukiwanie Kodu Pocztowego i Adresu",
        summary: "Szukaj kodów pocztowych, znajdź adresy lub odkryj kod według lokalizacji.",
      },
      "redimensionar-imagem": {
        name: "Zmiana Rozmiaru Obrazów",
        summary: "Dostosuj szerokość i wysokość dla mediów społecznościowych i stron.",
      },
      porcentagem: {
        name: "Kalkulator Procentowy",
        summary: "Zniżki, podwyżki i wariacje w sekundach.",
      },
      "paleta-de-cores": {
        name: "Generator Palet",
        summary: "Kombinacje kolorów z kodami HEX i RGB.",
      },
      cronometro: {
        name: "Stoper i Timer",
        summary: "Odliczanie i pomodoro w przeglądarce.",
      },
    },
    nav: {
      home: "Strona główna",
      about: "O i-Tools",
      contact: "Kontakt",
      privacy: "Prywatność",
      terms: "Warunki",
      search: "Szukaj",
      categories: "Kategorie",
      openMenu: "Otwórz menu",
      skipToContent: "Przejdź do treści",
    },
    common: {
      available: "Dostępne",
      comingSoon: "Wkrótce",
      loading: "Ładowanie",
      error: "Błąd",
      copy: "Kopiuj",
      copied: "Skopiowano!",
      download: "Pobierz",
      selectLanguage: "Wybierz język",
      faq: "Najczęściej Zadawane Pytania",
      alsoIn: "Również w",
      notFound: "Strona nie znaleziona",
      notFoundDescription: "Ta strona nie istnieje lub została przeniesiona.",
      backToHome: "Powrót do strony głównej",
      advertisement: "Reklama",
    },
  },
  ru: {
    site: {
      name: "i-Tools",
      tagline: "Умные инструменты для упрощения вашего дня.",
      description: "Бесплатные онлайн-инструменты для файлов, изображений, текста, расчетов и разработки. Прямо в браузере, без регистрации и без установки.",
      titleTemplate: "%s — i-Tools",
    },
    categories: {
      arquivos: {
        name: "Файлы и Документы",
        description: "Конвертировать, объединять и организовывать PDF и другие файлы.",
      },
      imagens: {
        name: "Изображения и Дизайн",
        description: "Сжимать, масштабировать и конвертировать изображения.",
      },
      texto: {
        name: "Текст и Письмо",
        description: "Подсчитывать, форматировать и преобразовывать текст.",
      },
      calculadoras: {
        name: "Калькуляторы",
        description: "Проценты, даты, финансы и единицы измерения.",
      },
      produtividade: {
        name: "Продуктивность",
        description: "QR-коды, списки и повседневные утилиты.",
      },
      desenvolvedores: {
        name: "Разработчики",
        description: "Форматеры, генераторы и технические конвертеры.",
      },
    },
    tools: {
      "baixar-video-youtube": {
        name: "Загрузчик Видео с YouTube",
        summary: "Загружайте авторизованные публичные видео и Shorts с выбором качества.",
      },
      "baixar-video-tiktok": {
        name: "Загрузчик Видео с TikTok без Водяного Знака",
        summary: "Загружайте публичные видео TikTok без водяного знака, которые являются вашими или авторизованными.",
      },
      "baixar-video-instagram": {
        name: "Загрузчик Видео с Instagram",
        summary: "Загружайте свои Reels и публичные видео с авторизацией.",
      },
      qr: {
        name: "Генератор QR-Кодов",
        summary: "Превратите любой URL в загружаемый QR-код.",
      },
      "comprimir-imagem": {
        name: "Компрессор Изображений",
        summary: "Сжимайте JPG, PNG и WebP с контролем качества.",
      },
      pdf: {
        name: "Конвертер PDF",
        summary: "Конвертируйте изображения и TXT в PDF или PDF в изображения PNG.",
      },
      senhas: {
        name: "Генератор Паролей",
        summary: "Сильные случайные пароли, созданные на вашем устройстве.",
      },
      "contador-de-palavras": {
        name: "Счетчик Слов",
        summary: "Слова, символы и время чтения для любого текста.",
      },
      json: {
        name: "Форматер JSON",
        summary: "Проверяйте и форматируйте JSON с читаемостью.",
      },
      "meu-ip": {
        name: "Какой мой IP",
        summary: "Посмотрите публичный IP-адрес вашего соединения.",
      },
      "meu-cep": {
        name: "Поиск Почтового Индекса и Адреса",
        summary: "Ищите почтовые индексы, находите адреса или узнайте индекс по местоположению.",
      },
      "redimensionar-imagem": {
        name: "Масштабировщик Изображений",
        summary: "Настройте ширину и высоту для социальных сетей и веб-сайтов.",
      },
      porcentagem: {
        name: "Калькулятор Процентов",
        summary: "Скидки, увеличения и вариации за секунды.",
      },
      "paleta-de-cores": {
        name: "Генератор Палитр",
        summary: "Цветовые комбинации с кодами HEX и RGB.",
      },
      cronometro: {
        name: "Секундомер и Таймер",
        summary: "Обратный отсчет и помодоро в вашем браузере.",
      },
    },
    nav: {
      home: "Главная",
      about: "О i-Tools",
      contact: "Контакт",
      privacy: "Конфиденциальность",
      terms: "Условия",
      search: "Поиск",
      categories: "Категории",
      openMenu: "Открыть меню",
      skipToContent: "Перейти к содержимому",
    },
    common: {
      available: "Доступно",
      comingSoon: "Скоро",
      loading: "Загрузка",
      error: "Ошибка",
      copy: "Копировать",
      copied: "Скопировано!",
      download: "Загрузить",
      selectLanguage: "Выбрать язык",
      faq: "Часто Задаваемые Вопросы",
      alsoIn: "Также в",
      notFound: "Страница не найдена",
      notFoundDescription: "Эта страница не существует или была перемещена.",
      backToHome: "Вернуться на главную",
      advertisement: "Реклама",
    },
  },
  uk: {
    site: {
      name: "i-Tools",
      tagline: "Розумні інструменти для спрощення вашого дня.",
      description: "Безкоштовні онлайн-інструменти для файлів, зображень, тексту, розрахунків та розробки. Прямо в браузері, без реєстрації та без встановлення.",
      titleTemplate: "%s — i-Tools",
    },
    categories: {
      arquivos: {
        name: "Файли та Документи",
        description: "Конвертувати, об'єднувати та організовувати PDF та інші файли.",
      },
      imagens: {
        name: "Зображення та Дизайн",
        description: "Стискати, масштабувати та конвертувати зображення.",
      },
      texto: {
        name: "Текст та Письмо",
        description: "Підраховувати, форматувати та перетворювати текст.",
      },
      calculadoras: {
        name: "Калькулятори",
        description: "Відсотки, дати, фінанси та одиниці виміру.",
      },
      produtividade: {
        name: "Продуктивність",
        description: "QR-коди, списки та щоденні утиліти.",
      },
      desenvolvedores: {
        name: "Розробники",
        description: "Форматери, генератори та технічні конвертери.",
      },
    },
    tools: {
      "baixar-video-youtube": {
        name: "Завантажувач Відео з YouTube",
        summary: "Завантажуйте авторизовані публічні відео та Shorts з вибором якості.",
      },
      "baixar-video-tiktok": {
        name: "Завантажувач Відео з TikTok без Водяного Знаку",
        summary: "Завантажуйте публічні відео TikTok без водяного знаку, які є вашими або авторизованими.",
      },
      "baixar-video-instagram": {
        name: "Завантажувач Відео з Instagram",
        summary: "Завантажуйте свої Reels та публічні відео з авторизацією.",
      },
      qr: {
        name: "Генератор QR-Кодів",
        summary: "Перетворіть будь-який URL на завантажуваний QR-код.",
      },
      "comprimir-imagem": {
        name: "Компресор Зображень",
        summary: "Стискайте JPG, PNG та WebP з контролем якості.",
      },
      pdf: {
        name: "Конвертер PDF",
        summary: "Конвертуйте зображення та TXT у PDF або PDF у зображення PNG.",
      },
      senhas: {
        name: "Генератор Паролів",
        summary: "Сильні випадкові паролі, створені на вашому пристрої.",
      },
      "contador-de-palavras": {
        name: "Лічильник Слів",
        summary: "Слова, символи та час читання для будь-якого тексту.",
      },
      json: {
        name: "Форматер JSON",
        summary: "Перевіряйте та форматуйте JSON з читабельністю.",
      },
      "meu-ip": {
        name: "Який мій IP",
        summary: "Подивіться публічну IP-адресу вашого з'єднання.",
      },
      "meu-cep": {
        name: "Пошук Поштового Індексу та Адреси",
        summary: "Шукайте поштові індекси, знаходьте адреси або дізнайтеся індекс за місцезнаходженням.",
      },
      "redimensionar-imagem": {
        name: "Масштабувальник Зображень",
        summary: "Налаштуйте ширину та висоту для соціальних мереж та веб-сайтів.",
      },
      porcentagem: {
        name: "Калькулятор Відсотків",
        summary: "Знижки, збільшення та варіації за секунди.",
      },
      "paleta-de-cores": {
        name: "Генератор Палітр",
        summary: "Колірні комбінації з кодами HEX та RGB.",
      },
      cronometro: {
        name: "Секундомір та Таймер",
        summary: "Зворотний відлік та помодоро у вашому браузері.",
      },
    },
    nav: {
      home: "Головна",
      about: "Про i-Tools",
      contact: "Контакт",
      privacy: "Конфіденційність",
      terms: "Умови",
      search: "Пошук",
      categories: "Категорії",
      openMenu: "Відкрити меню",
      skipToContent: "Перейти до вмісту",
    },
    common: {
      available: "Доступно",
      comingSoon: "Незабаром",
      loading: "Завантаження",
      error: "Помилка",
      copy: "Копіювати",
      copied: "Скопійовано!",
      download: "Завантажити",
      selectLanguage: "Вибрати мову",
      faq: "Часті Запитання",
      alsoIn: "Також у",
      notFound: "Сторінка не знайдена",
      notFoundDescription: "Ця сторінка не існує або була переміщена.",
      backToHome: "Повернутися на головну",
      advertisement: "Реклама",
    },
  },
  tr: {
    site: {
      name: "i-Tools",
      tagline: "Gününüzü basitleştiren akıllı araçlar.",
      description: "Dosyalar, resimler, metin, hesaplamalar ve geliştirme için ücretsiz çevrimiçi araçlar. Tarayıcınızda doğrudan, kayıt yok, kurulum yok.",
      titleTemplate: "%s — i-Tools",
    },
    categories: {
      arquivos: {
        name: "Dosyalar ve Belgeler",
        description: "PDF'leri ve diğer dosyaları dönüştürün, birleştirin ve düzenleyin.",
      },
      imagens: {
        name: "Resimler ve Tasarım",
        description: "Resimleri sıkıştırın, ölçeklendirin ve dönüştürün.",
      },
      texto: {
        name: "Metin ve Yazma",
        description: "Metni sayın, biçimlendirin ve dönüştürün.",
      },
      calculadoras: {
        name: "Hesap Makineleri",
        description: "Yüzdeler, tarihler, finans ve birimler.",
      },
      produtividade: {
        name: "Üretkenlik",
        description: "QR Kodları, listeler ve günlük araçlar.",
      },
      desenvolvedores: {
        name: "Geliştiriciler",
        description: "Biçimlendiriciler, üreteçler ve teknik dönüştürücüler.",
      },
    },
    tools: {
      "baixar-video-youtube": {
        name: "YouTube Video İndirici",
        summary: "Kalite seçenekleriyle yetkili genel videoları ve Shorts'ları indirin.",
      },
      "baixar-video-tiktok": {
        name: "TikTok Video İndirici Filigransız",
        summary: "Size ait veya yetkili genel TikTok videolarını filigransız indirin.",
      },
      "baixar-video-instagram": {
        name: "Instagram Video İndirici",
        summary: "Yetki ile Reels'lerinizi ve genel videolarınızı indirin.",
      },
      qr: {
        name: "QR Kod Oluşturucu",
        summary: "Herhangi bir URL'yi indirilebilir bir QR koduna dönüştürün.",
      },
      "comprimir-imagem": {
        name: "Resim Sıkıştırıcı",
        summary: "Kalite kontrolü ile JPG, PNG ve WebP'yi sıkıştırın.",
      },
      pdf: {
        name: "PDF Dönüştürücü",
        summary: "Resimleri ve TXT'yi PDF'ye veya PDF'yi PNG resimlerine dönüştürün.",
      },
      senhas: {
        name: "Şifre Oluşturucu",
        summary: "Cihazınızda oluşturulan güçlü rastgele şifreler.",
      },
      "contador-de-palavras": {
        name: "Kelime Sayacı",
        summary: "Herhangi bir metin için kelimeler, karakterler ve okuma süresi.",
      },
      json: {
        name: "JSON Biçimlendirici",
        summary: "JSON'u okunabilirlikle doğrulayın ve biçimlendirin.",
      },
      "meu-ip": {
        name: "IP'm Nedir",
        summary: "Bağlantınızın genel IP adresini görün.",
      },
      "meu-cep": {
        name: "Posta Kodu ve Adres Sorgulama",
        summary: "Posta kodlarını arayın, adresleri bulun veya konuma göre kodu keşfedin.",
      },
      "redimensionar-imagem": {
        name: "Resim Yeniden Boyutlandırıcı",
        summary: "Sosyal medya ve web siteleri için genişlik ve yüksekliği ayarlayın.",
      },
      porcentagem: {
        name: "Yüzde Hesaplayıcı",
        summary: "Saniyeler içinde indirimler, artışlar ve varyasyonlar.",
      },
      "paleta-de-cores": {
        name: "Palet Oluşturucu",
        summary: "HEX ve RGB kodları ile renk kombinasyonları.",
      },
      cronometro: {
        name: "Kronometre ve Zamanlayıcı",
        summary: "Tarayıcınızda geri sayım ve pomodoro.",
      },
    },
    nav: {
      home: "Ana Sayfa",
      about: "i-Tools Hakkında",
      contact: "İletişim",
      privacy: "Gizlilik",
      terms: "Şartlar",
      search: "Ara",
      categories: "Kategoriler",
      openMenu: "Menüyü aç",
      skipToContent: "İçeriğe atla",
    },
    common: {
      available: "Mevcut",
      comingSoon: "Yakında",
      loading: "Yükleniyor",
      error: "Hata",
      copy: "Kopyala",
      copied: "Kopyalandı!",
      download: "İndir",
      selectLanguage: "Dil seç",
      faq: "Sık Sorulan Sorular",
      alsoIn: "Ayrıca",
      notFound: "Sayfa bulunamadı",
      notFoundDescription: "Bu sayfa mevcut değil veya taşındı.",
      backToHome: "Ana sayfaya dön",
      advertisement: "Reklam",
    },
  },
  ar: {
    site: {
      name: "i-Tools",
      tagline: "أدوات ذكية لتبسيط يومك.",
      description: "أدوات مجانية عبر الإنترنت للملفات والصور والنصوص والحسابات والتطوير. مباشرة في متصفحك، بدون تسجيل وبدون تثبيت.",
      titleTemplate: "%s — i-Tools",
    },
    categories: {
      arquivos: {
        name: "الملفات والمستندات",
        description: "تحويل ودمج وتنظيم ملفات PDF وغيرها من الملفات.",
      },
      imagens: {
        name: "الصور والتصميم",
        description: "ضغط وتغيير حجم وتحويل الصور.",
      },
      texto: {
        name: "النص والكتابة",
        description: "عد وتنسيق وتحويل النصوص.",
      },
      calculadoras: {
        name: "الآلات الحاسبة",
        description: "النسب المئوية والتواريخ والتمويل والوحدات.",
      },
      produtividade: {
        name: "الإنتاجية",
        description: "رموز QR والقوائم والأدوات اليومية.",
      },
      desenvolvedores: {
        name: "المطورون",
        description: "المنسقون والمولدون والمحولون التقنيون.",
      },
    },
    tools: {
      "baixar-video-youtube": {
        name: "تنزيل فيديو YouTube",
        summary: "قم بتنزيل مقاطع الفيديو والـ Shorts العامة المصرح بها، مع خيارات الجودة.",
      },
      "baixar-video-tiktok": {
        name: "تنزيل فيديو TikTok بدون علامة مائية",
        summary: "قم بتنزيل مقاطع فيديو TikTok العامة بدون علامة مائية التي تخصك أو المصرح بها.",
      },
      "baixar-video-instagram": {
        name: "تنزيل فيديو Instagram",
        summary: "قم بتنزيل Reels ومقاطع الفيديو العامة الخاصة بك بتصريح.",
      },
      qr: {
        name: "مولد رمز QR",
        summary: "حوّل أي URL إلى رمز QR قابل للتنزيل.",
      },
      "comprimir-imagem": {
        name: "ضاغط الصور",
        summary: "اضغط JPG و PNG و WebP مع التحكم في الجودة.",
      },
      pdf: {
        name: "محول PDF",
        summary: "حوّل الصور و TXT إلى PDF أو PDF إلى صور PNG.",
      },
      senhas: {
        name: "مولد كلمات المرور",
        summary: "كلمات مرور قوية وعشوائية، يتم إنشاؤها على جهازك.",
      },
      "contador-de-palavras": {
        name: "عداد الكلمات",
        summary: "الكلمات والأحرف ووقت القراءة لأي نص.",
      },
      json: {
        name: "منسق JSON",
        summary: "التحقق من صحة JSON وتنسيقه مع قابلية القراءة.",
      },
      "meu-ip": {
        name: "ما هو IP الخاص بي",
        summary: "اطلع على عنوان IP العام لاتصالك.",
      },
      "meu-cep": {
        name: "البحث عن الرمز البريدي والعنوان",
        summary: "ابحث عن الرموز البريدية أو اعثر على العناوين أو اكتشف الرمز حسب الموقع.",
      },
      "redimensionar-imagem": {
        name: "مغير حجم الصور",
        summary: "اضبط العرض والارتفاع لوسائل التواصل الاجتماعي والمواقع.",
      },
      porcentagem: {
        name: "حاسبة النسبة المئوية",
        summary: "الخصومات والزيادات والتغيرات في ثوانٍ.",
      },
      "paleta-de-cores": {
        name: "مولد اللوحات",
        summary: "مجموعات ألوان مع أكواد HEX و RGB.",
      },
      cronometro: {
        name: "ساعة التوقيت والمؤقت",
        summary: "العد التنازلي وبومودورو في متصفحك.",
      },
    },
    nav: {
      home: "الصفحة الرئيسية",
      about: "حول i-Tools",
      contact: "اتصل",
      privacy: "الخصوصية",
      terms: "الشروط",
      search: "بحث",
      categories: "الفئات",
      openMenu: "فتح القائمة",
      skipToContent: "انتقل إلى المحتوى",
    },
    common: {
      available: "متاح",
      comingSoon: "قريباً",
      loading: "جاري التحميل",
      error: "خطأ",
      copy: "نسخ",
      copied: "تم النسخ!",
      download: "تنزيل",
      selectLanguage: "اختر اللغة",
      faq: "الأسئلة الشائعة",
      alsoIn: "أيضاً في",
      notFound: "الصفحة غير موجودة",
      notFoundDescription: "هذه الصفحة غير موجودة أو تم نقلها.",
      backToHome: "العودة إلى الصفحة الرئيسية",
      advertisement: "إعلان",
    },
  },
  hi: {
    site: {
      name: "i-Tools",
      tagline: "आपके दिन को सरल बनाने के लिए स्मार्ट उपकरण।",
      description: "फ़ाइलों, छवियों, टेक्स्ट, गणना और विकास के लिए मुफ्त ऑनलाइन उपकरण। सीधे आपके ब्राउज़र में, बिना साइनअप और बिना इंस्टॉलेशन।",
      titleTemplate: "%s — i-Tools",
    },
    categories: {
      arquivos: {
        name: "फ़ाइलें और दस्तावेज़",
        description: "PDF और अन्य फ़ाइलों को परिवर्तित, विलय और व्यवस्थित करें।",
      },
      imagens: {
        name: "छवियाँ और डिज़ाइन",
        description: "छवियों को संपीड़ित, पुनः आकार और परिवर्तित करें।",
      },
      texto: {
        name: "टेक्स्ट और लेखन",
        description: "टेक्स्ट की गणना, स्वरूपण और रूपांतरण करें।",
      },
      calculadoras: {
        name: "कैलकुलेटर",
        description: "प्रतिशत, तारीखें, वित्त और इकाइयाँ।",
      },
      produtividade: {
        name: "उत्पादकता",
        description: "QR कोड, सूचियाँ और दैनिक उपयोगिताएँ।",
      },
      desenvolvedores: {
        name: "डेवलपर्स",
        description: "फॉर्मेटर्स, जेनरेटर्स और तकनीकी कन्वर्टर्स।",
      },
    },
    tools: {
      "baixar-video-youtube": {
        name: "YouTube वीडियो डाउनलोडर",
        summary: "गुणवत्ता विकल्पों के साथ अधिकृत सार्वजनिक वीडियो और Shorts डाउनलोड करें।",
      },
      "baixar-video-tiktok": {
        name: "TikTok वीडियो डाउनलोडर वॉटरमार्क के बिना",
        summary: "सार्वजनिक TikTok वीडियो वॉटरमार्क के बिना डाउनलोड करें जो आपके हैं या अधिकृत हैं।",
      },
      "baixar-video-instagram": {
        name: "Instagram वीडियो डाउनलोडर",
        summary: "अधिकार के साथ अपने Reels और सार्वजनिक वीडियो डाउनलोड करें।",
      },
      qr: {
        name: "QR कोड जेनरेटर",
        summary: "किसी भी URL को डाउनलोड करने योग्य QR कोड में बदलें।",
      },
      "comprimir-imagem": {
        name: "छवि कम्प्रेसर",
        summary: "गुणवत्ता नियंत्रण के साथ JPG, PNG और WebP को संपीड़ित करें।",
      },
      pdf: {
        name: "PDF कन्वर्टर",
        summary: "छवियों और TXT को PDF में या PDF को PNG छवियों में परिवर्तित करें।",
      },
      senhas: {
        name: "पासवर्ड जेनरेटर",
        summary: "आपके डिवाइस पर बनाए गए मजबूत यादृच्छिक पासवर्ड।",
      },
      "contador-de-palavras": {
        name: "शब्द काउंटर",
        summary: "किसी भी टेक्स्ट के लिए शब्द, वर्ण और पढ़ने का समय।",
      },
      json: {
        name: "JSON फॉर्मेटर",
        summary: "पठनीयता के साथ JSON को मान्य और स्वरूपित करें।",
      },
      "meu-ip": {
        name: "मेरा IP क्या है",
        summary: "अपने कनेक्शन का सार्वजनिक IP पता देखें।",
      },
      "meu-cep": {
        name: "पोस्टल कोड और पता खोज",
        summary: "पोस्टल कोड खोजें, पते ढूंढें या स्थान के अनुसार कोड खोजें।",
      },
      "redimensionar-imagem": {
        name: "छवि रीसाइज़र",
        summary: "सोशल मीडिया और वेबसाइटों के लिए चौड़ाई और ऊंचाई समायोजित करें।",
      },
      porcentagem: {
        name: "प्रतिशत कैलकुलेटर",
        summary: "सेकंड में छूट, वृद्धि और विविधताएं।",
      },
      "paleta-de-cores": {
        name: "पैलेट जेनरेटर",
        summary: "HEX और RGB कोड के साथ रंग संयोजन।",
      },
      cronometro: {
        name: "स्टॉपवॉच और टाइमर",
        summary: "आपके ब्राउज़र में काउंटडाउन और पोमोडोरो।",
      },
    },
    nav: {
      home: "होम",
      about: "i-Tools के बारे में",
      contact: "संपर्क करें",
      privacy: "गोपनीयता",
      terms: "शर्तें",
      search: "खोजें",
      categories: "श्रेणियाँ",
      openMenu: "मेनू खोलें",
      skipToContent: "सामग्री पर जाएँ",
    },
    common: {
      available: "उपलब्ध",
      comingSoon: "जल्द आ रहा है",
      loading: "लोड हो रहा है",
      error: "त्रुटि",
      copy: "कॉपी करें",
      copied: "कॉपी किया गया!",
      download: "डाउनलोड करें",
      selectLanguage: "भाषा चुनें",
      faq: "अक्सर पूछे जाने वाले प्रश्न",
      alsoIn: "यह भी",
      notFound: "पृष्ठ नहीं मिला",
      notFoundDescription: "यह पृष्ठ मौजूद नहीं है या स्थानांतरित किया गया है।",
      backToHome: "होम पर वापस जाएं",
      advertisement: "विज्ञापन",
    },
  },
  id: {
    site: {
      name: "i-Tools",
      tagline: "Alat pintar untuk menyederhanakan hari Anda.",
      description: "Alat online gratis untuk file, gambar, teks, perhitungan, dan pengembangan. Langsung di browser Anda, tanpa pendaftaran dan tanpa instalasi.",
      titleTemplate: "%s — i-Tools",
    },
    categories: {
      arquivos: {
        name: "File dan Dokumen",
        description: "Konversi, gabungkan, dan atur PDF dan file lainnya.",
      },
      imagens: {
        name: "Gambar dan Desain",
        description: "Kompres, ubah ukuran, dan konversi gambar.",
      },
      texto: {
        name: "Teks dan Penulisan",
        description: "Hitung, format, dan transformasi teks.",
      },
      calculadoras: {
        name: "Kalkulator",
        description: "Persentase, tanggal, keuangan, dan unit.",
      },
      produtividade: {
        name: "Produktivitas",
        description: "Kode QR, daftar, dan utilitas sehari-hari.",
      },
      desenvolvedores: {
        name: "Pengembang",
        description: "Formatter, generator, dan konverter teknis.",
      },
    },
    tools: {
      "baixar-video-youtube": {
        name: "Pengunduh Video YouTube",
        summary: "Unduh video dan Shorts publik yang diotorisasi, dengan pilihan kualitas.",
      },
      "baixar-video-tiktok": {
        name: "Pengunduh Video TikTok Tanpa Watermark",
        summary: "Unduh video TikTok publik tanpa watermark yang milik Anda atau diotorisasi.",
      },
      "baixar-video-instagram": {
        name: "Pengunduh Video Instagram",
        summary: "Unduh Reels dan video publik Anda dengan otorisasi.",
      },
      qr: {
        name: "Generator Kode QR",
        summary: "Ubah URL apa pun menjadi kode QR yang dapat diunduh.",
      },
      "comprimir-imagem": {
        name: "Kompresor Gambar",
        summary: "Kompres JPG, PNG, dan WebP dengan kontrol kualitas.",
      },
      pdf: {
        name: "Konverter PDF",
        summary: "Konversi gambar dan TXT ke PDF atau PDF ke gambar PNG.",
      },
      senhas: {
        name: "Generator Kata Sandi",
        summary: "Kata sandi acak yang kuat, dihasilkan di perangkat Anda.",
      },
      "contador-de-palavras": {
        name: "Penghitung Kata",
        summary: "Kata, karakter, dan waktu membaca untuk teks apa pun.",
      },
      json: {
        name: "Formatter JSON",
        summary: "Validasi dan format JSON dengan keterbacaan.",
      },
      "meu-ip": {
        name: "Apa IP Saya",
        summary: "Lihat alamat IP publik koneksi Anda.",
      },
      "meu-cep": {
        name: "Pencarian Kode Pos dan Alamat",
        summary: "Cari kode pos, temukan alamat, atau temukan kode berdasarkan lokasi.",
      },
      "redimensionar-imagem": {
        name: "Pengubah Ukuran Gambar",
        summary: "Sesuaikan lebar dan tinggi untuk media sosial dan situs web.",
      },
      porcentagem: {
        name: "Kalkulator Persentase",
        summary: "Diskon, kenaikan, dan variasi dalam hitungan detik.",
      },
      "paleta-de-cores": {
        name: "Generator Palet",
        summary: "Kombinasi warna dengan kode HEX dan RGB.",
      },
      cronometro: {
        name: "Stopwatch dan Timer",
        summary: "Hitung mundur dan pomodoro di browser Anda.",
      },
    },
    nav: {
      home: "Beranda",
      about: "Tentang i-Tools",
      contact: "Kontak",
      privacy: "Privasi",
      terms: "Ketentuan",
      search: "Cari",
      categories: "Kategori",
      openMenu: "Buka menu",
      skipToContent: "Lewati ke konten",
    },
    common: {
      available: "Tersedia",
      comingSoon: "Segera hadir",
      loading: "Memuat",
      error: "Kesalahan",
      copy: "Salin",
      copied: "Disalin!",
      download: "Unduh",
      selectLanguage: "Pilih bahasa",
      faq: "Pertanyaan yang Sering Diajukan",
      alsoIn: "Juga di",
      notFound: "Halaman tidak ditemukan",
      notFoundDescription: "Halaman ini tidak ada atau telah dipindahkan.",
      backToHome: "Kembali ke beranda",
      advertisement: "Iklan",
    },
  },
  ja: {
    site: {
      name: "i-Tools",
      tagline: "あなたの一日をシンプルにするスマートツール。",
      description: "ファイル、画像、テキスト、計算、開発のための無料オンラインツール。ブラウザで直接、サインアップ不要、インストール不要。",
      titleTemplate: "%s — i-Tools",
    },
    categories: {
      arquivos: {
        name: "ファイルと文書",
        description: "PDFやその他のファイルを変換、結合、整理します。",
      },
      imagens: {
        name: "画像とデザイン",
        description: "画像を圧縮、リサイズ、変換します。",
      },
      texto: {
        name: "テキストと執筆",
        description: "テキストをカウント、フォーマット、変換します。",
      },
      calculadoras: {
        name: "電卓",
        description: "パーセンテージ、日付、財務、単位。",
      },
      produtividade: {
        name: "生産性",
        description: "QRコード、リスト、日常のユーティリティ。",
      },
      desenvolvedores: {
        name: "開発者",
        description: "フォーマッター、ジェネレーター、技術的コンバーター。",
      },
    },
    tools: {
      "baixar-video-youtube": {
        name: "YouTube動画ダウンローダー",
        summary: "品質オプション付きで承認された公開動画とShortsをダウンロードします。",
      },
      "baixar-video-tiktok": {
        name: "TikTok動画ダウンローダー ウォーターマークなし",
        summary: "あなたのものまたは承認された公開TikTok動画をウォーターマークなしでダウンロードします。",
      },
      "baixar-video-instagram": {
        name: "Instagram動画ダウンローダー",
        summary: "承認を得てReelsと公開動画をダウンロードします。",
      },
      qr: {
        name: "QRコードジェネレーター",
        summary: "任意のURLをダウンロード可能なQRコードに変換します。",
      },
      "comprimir-imagem": {
        name: "画像圧縮ツール",
        summary: "品質コントロール付きでJPG、PNG、WebPを圧縮します。",
      },
      pdf: {
        name: "PDFコンバーター",
        summary: "画像とTXTをPDFに、またはPDFをPNG画像に変換します。",
      },
      senhas: {
        name: "パスワードジェネレーター",
        summary: "デバイス上で生成される強力なランダムパスワード。",
      },
      "contador-de-palavras": {
        name: "単語カウンター",
        summary: "任意のテキストの単語、文字、読書時間。",
      },
      json: {
        name: "JSONフォーマッター",
        summary: "読みやすさを持ってJSONを検証してフォーマットします。",
      },
      "meu-ip": {
        name: "私のIPは何ですか",
        summary: "接続のパブリックIPアドレスを表示します。",
      },
      "meu-cep": {
        name: "郵便番号と住所検索",
        summary: "郵便番号を検索し、住所を見つけるか、位置で番号を発見します。",
      },
      "redimensionar-imagem": {
        name: "画像リサイザー",
        summary: "ソーシャルメディアとウェブサイトのために幅と高さを調整します。",
      },
      porcentagem: {
        name: "パーセンテージ電卓",
        summary: "秒単位で割引、増加、変動。",
      },
      "paleta-de-cores": {
        name: "パレットジェネレーター",
        summary: "HEXおよびRGBコードによる色の組み合わせ。",
      },
      cronometro: {
        name: "ストップウォッチとタイマー",
        summary: "ブラウザでカウントダウンとポモドーロ。",
      },
    },
    nav: {
      home: "ホーム",
      about: "i-Toolsについて",
      contact: "お問い合わせ",
      privacy: "プライバシー",
      terms: "利用規約",
      search: "検索",
      categories: "カテゴリ",
      openMenu: "メニューを開く",
      skipToContent: "コンテンツにスキップ",
    },
    common: {
      available: "利用可能",
      comingSoon: "近日公開",
      loading: "読み込み中",
      error: "エラー",
      copy: "コピー",
      copied: "コピーしました！",
      download: "ダウンロード",
      selectLanguage: "言語を選択",
      faq: "よくある質問",
      alsoIn: "他にも",
      notFound: "ページが見つかりません",
      notFoundDescription: "このページは存在しないか、移動されました。",
      backToHome: "ホームに戻る",
      advertisement: "広告",
    },
  },
  ko: {
    site: {
      name: "i-Tools",
      tagline: "하루를 단순화하는 스마트 도구.",
      description: "파일, 이미지, 텍스트, 계산 및 개발을 위한 무료 온라인 도구. 브라우저에서 바로, 가입 없음, 설치 없음.",
      titleTemplate: "%s — i-Tools",
    },
    categories: {
      arquivos: {
        name: "파일 및 문서",
        description: "PDF 및 기타 파일을 변환, 병합 및 정리합니다.",
      },
      imagens: {
        name: "이미지 및 디자인",
        description: "이미지를 압축, 크기 조정 및 변환합니다.",
      },
      texto: {
        name: "텍스트 및 글쓰기",
        description: "텍스트를 계산, 서식 지정 및 변환합니다.",
      },
      calculadoras: {
        name: "계산기",
        description: "백분율, 날짜, 재무 및 단위.",
      },
      produtividade: {
        name: "생산성",
        description: "QR 코드, 목록 및 일상 유틸리티.",
      },
      desenvolvedores: {
        name: "개발자",
        description: "포매터, 생성기 및 기술 변환기.",
      },
    },
    tools: {
      "baixar-video-youtube": {
        name: "YouTube 동영상 다운로더",
        summary: "품질 옵션과 함께 승인된 공개 동영상 및 Shorts를 다운로드합니다.",
      },
      "baixar-video-tiktok": {
        name: "TikTok 동영상 다운로더 워터마크 없음",
        summary: "귀하의 것이거나 승인된 공개 TikTok 동영상을 워터마크 없이 다운로드합니다.",
      },
      "baixar-video-instagram": {
        name: "Instagram 동영상 다운로더",
        summary: "승인과 함께 Reels 및 공개 동영상을 다운로드합니다.",
      },
      qr: {
        name: "QR 코드 생성기",
        summary: "모든 URL을 다운로드 가능한 QR 코드로 변환합니다.",
      },
      "comprimir-imagem": {
        name: "이미지 압축기",
        summary: "품질 제어로 JPG, PNG 및 WebP를 압축합니다.",
      },
      pdf: {
        name: "PDF 변환기",
        summary: "이미지 및 TXT를 PDF로 또는 PDF를 PNG 이미지로 변환합니다.",
      },
      senhas: {
        name: "비밀번호 생성기",
        summary: "기기에서 생성된 강력한 무작위 비밀번호.",
      },
      "contador-de-palavras": {
        name: "단어 카운터",
        summary: "모든 텍스트의 단어, 문자 및 읽기 시간.",
      },
      json: {
        name: "JSON 포매터",
        summary: "가독성으로 JSON을 검증하고 포맷합니다.",
      },
      "meu-ip": {
        name: "내 IP는 무엇입니까",
        summary: "연결의 공개 IP 주소를 확인합니다.",
      },
      "meu-cep": {
        name: "우편번호 및 주소 검색",
        summary: "우편번호를 검색하거나 주소를 찾거나 위치별로 번호를 발견합니다.",
      },
      "redimensionar-imagem": {
        name: "이미지 크기 조정기",
        summary: "소셜 미디어 및 웹사이트를 위해 너비와 높이를 조정합니다.",
      },
      porcentagem: {
        name: "백분율 계산기",
        summary: "몇 초 안에 할인, 증가 및 변동.",
      },
      "paleta-de-cores": {
        name: "팔레트 생성기",
        summary: "HEX 및 RGB 코드로 색상 조합.",
      },
      cronometro: {
        name: "스톱워치 및 타이머",
        summary: "브라우저에서 카운트다운 및 포모도로.",
      },
    },
    nav: {
      home: "홈",
      about: "i-Tools 소개",
      contact: "연락처",
      privacy: "개인정보",
      terms: "이용약관",
      search: "검색",
      categories: "카테고리",
      openMenu: "메뉴 열기",
      skipToContent: "콘텐츠로 건너뛰기",
    },
    common: {
      available: "사용 가능",
      comingSoon: "곧 출시",
      loading: "로딩 중",
      error: "오류",
      copy: "복사",
      copied: "복사됨!",
      download: "다운로드",
      selectLanguage: "언어 선택",
      faq: "자주 묻는 질문",
      alsoIn: "또한",
      notFound: "페이지를 찾을 수 없음",
      notFoundDescription: "이 페이지는 존재하지 않거나 이동되었습니다.",
      backToHome: "홈으로 돌아가기",
      advertisement: "광고",
    },
  },
  zh: {
    site: {
      name: "i-Tools",
      tagline: "智能工具，简化您的一天。",
      description: "用于文件、图像、文本、计算和开发的免费在线工具。直接在您的浏览器中，无需注册，无需安装。",
      titleTemplate: "%s — i-Tools",
    },
    categories: {
      arquivos: {
        name: "文件和文档",
        description: "转换、合并和整理PDF及其他文件。",
      },
      imagens: {
        name: "图像和设计",
        description: "压缩、调整大小和转换图像。",
      },
      texto: {
        name: "文本和写作",
        description: "计数、格式化和转换文本。",
      },
      calculadoras: {
        name: "计算器",
        description: "百分比、日期、财务和单位。",
      },
      produtividade: {
        name: "生产力",
        description: "二维码、列表和日常实用工具。",
      },
      desenvolvedores: {
        name: "开发者",
        description: "格式化器、生成器和技术转换器。",
      },
    },
    tools: {
      "baixar-video-youtube": {
        name: "YouTube视频下载器",
        summary: "下载已授权的公开视频和Shorts，具有质量选项。",
      },
      "baixar-video-tiktok": {
        name: "TikTok视频下载器 无水印",
        summary: "下载您的或已授权的公开TikTok视频无水印。",
      },
      "baixar-video-instagram": {
        name: "Instagram视频下载器",
        summary: "通过授权下载您的Reels和公开视频。",
      },
      qr: {
        name: "二维码生成器",
        summary: "将任何URL转换为可下载的二维码。",
      },
      "comprimir-imagem": {
        name: "图像压缩器",
        summary: "通过质量控制压缩JPG、PNG和WebP。",
      },
      pdf: {
        name: "PDF转换器",
        summary: "将图像和TXT转换为PDF或将PDF转换为PNG图像。",
      },
      senhas: {
        name: "密码生成器",
        summary: "在您的设备上生成的强随机密码。",
      },
      "contador-de-palavras": {
        name: "字数统计器",
        summary: "任何文本的字数、字符数和阅读时间。",
      },
      json: {
        name: "JSON格式化器",
        summary: "通过可读性验证和格式化JSON。",
      },
      "meu-ip": {
        name: "我的IP是什么",
        summary: "查看您连接的公共IP地址。",
      },
      "meu-cep": {
        name: "邮政编码和地址查询",
        summary: "搜索邮政编码、查找地址或按位置发现编码。",
      },
      "redimensionar-imagem": {
        name: "图像调整器",
        summary: "调整社交媒体和网站的宽度和高度。",
      },
      porcentagem: {
        name: "百分比计算器",
        summary: "在几秒钟内计算折扣、增加和变化。",
      },
      "paleta-de-cores": {
        name: "调色板生成器",
        summary: "带有HEX和RGB代码的颜色组合。",
      },
      cronometro: {
        name: "秒表和计时器",
        summary: "在浏览器中倒计时和番茄钟。",
      },
    },
    nav: {
      home: "首页",
      about: "关于i-Tools",
      contact: "联系我们",
      privacy: "隐私",
      terms: "条款",
      search: "搜索",
      categories: "类别",
      openMenu: "打开菜单",
      skipToContent: "跳转到内容",
    },
    common: {
      available: "可用",
      comingSoon: "即将推出",
      loading: "加载中",
      error: "错误",
      copy: "复制",
      copied: "已复制！",
      download: "下载",
      selectLanguage: "选择语言",
      faq: "常见问题",
      alsoIn: "还在",
      notFound: "未找到页面",
      notFoundDescription: "此页面不存在或已移动。",
      backToHome: "返回首页",
      advertisement: "广告",
    },
  },
  vi: {
    site: {
      name: "i-Tools",
      tagline: "Công cụ thông minh để đơn giản hóa ngày của bạn.",
      description: "Công cụ trực tuyến miễn phí cho tệp, hình ảnh, văn bản, tính toán và phát triển. Ngay trong trình duyệt của bạn, không cần đăng ký và không cần cài đặt.",
      titleTemplate: "%s — i-Tools",
    },
    categories: {
      arquivos: {
        name: "Tệp và Tài liệu",
        description: "Chuyển đổi, hợp nhất và sắp xếp PDF và các tệp khác.",
      },
      imagens: {
        name: "Hình ảnh và Thiết kế",
        description: "Nén, thay đổi kích thước và chuyển đổi hình ảnh.",
      },
      texto: {
        name: "Văn bản và Viết",
        description: "Đếm, định dạng và chuyển đổi văn bản.",
      },
      calculadoras: {
        name: "Máy tính",
        description: "Phần trăm, ngày tháng, tài chính và đơn vị.",
      },
      produtividade: {
        name: "Năng suất",
        description: "Mã QR, danh sách và tiện ích hàng ngày.",
      },
      desenvolvedores: {
        name: "Nhà phát triển",
        description: "Trình định dạng, trình tạo và bộ chuyển đổi kỹ thuật.",
      },
    },
    tools: {
      "baixar-video-youtube": {
        name: "Trình Tải Video YouTube",
        summary: "Tải xuống video và Shorts công khai được ủy quyền, với tùy chọn chất lượng.",
      },
      "baixar-video-tiktok": {
        name: "Trình Tải Video TikTok Không Có Watermark",
        summary: "Tải xuống video TikTok công khai không có watermark của bạn hoặc được ủy quyền.",
      },
      "baixar-video-instagram": {
        name: "Trình Tải Video Instagram",
        summary: "Tải xuống Reels và video công khai của bạn với ủy quyền.",
      },
      qr: {
        name: "Trình Tạo Mã QR",
        summary: "Chuyển đổi bất kỳ URL nào thành mã QR có thể tải xuống.",
      },
      "comprimir-imagem": {
        name: "Trình Nén Hình ảnh",
        summary: "Nén JPG, PNG và WebP với kiểm soát chất lượng.",
      },
      pdf: {
        name: "Bộ Chuyển đổi PDF",
        summary: "Chuyển đổi hình ảnh và TXT sang PDF hoặc PDF sang hình ảnh PNG.",
      },
      senhas: {
        name: "Trình Tạo Mật khẩu",
        summary: "Mật khẩu ngẫu nhiên mạnh, được tạo trên thiết bị của bạn.",
      },
      "contador-de-palavras": {
        name: "Bộ Đếm Từ",
        summary: "Từ, ký tự và thời gian đọc cho bất kỳ văn bản nào.",
      },
      json: {
        name: "Trình Định dạng JSON",
        summary: "Xác thực và định dạng JSON với khả năng đọc.",
      },
      "meu-ip": {
        name: "IP của tôi là gì",
        summary: "Xem địa chỉ IP công khai của kết nối của bạn.",
      },
      "meu-cep": {
        name: "Tra cứu Mã Bưu điện và Địa chỉ",
        summary: "Tìm kiếm mã bưu điện, tìm địa chỉ hoặc khám phá mã theo vị trí.",
      },
      "redimensionar-imagem": {
        name: "Trình Thay đổi Kích thước Hình ảnh",
        summary: "Điều chỉnh chiều rộng và chiều cao cho mạng xã hội và trang web.",
      },
      porcentagem: {
        name: "Máy Tính Phần trăm",
        summary: "Giảm giá, tăng và biến đổi trong vài giây.",
      },
      "paleta-de-cores": {
        name: "Trình Tạo Bảng màu",
        summary: "Kết hợp màu với mã HEX và RGB.",
      },
      cronometro: {
        name: "Đồng hồ bấm giờ và Hẹn giờ",
        summary: "Đếm ngược và pomodoro trong trình duyệt của bạn.",
      },
    },
    nav: {
      home: "Trang chủ",
      about: "Về i-Tools",
      contact: "Liên hệ",
      privacy: "Quyền riêng tư",
      terms: "Điều khoản",
      search: "Tìm kiếm",
      categories: "Danh mục",
      openMenu: "Mở menu",
      skipToContent: "Bỏ qua đến nội dung",
    },
    common: {
      available: "Có sẵn",
      comingSoon: "Sắp ra mắt",
      loading: "Đang tải",
      error: "Lỗi",
      copy: "Sao chép",
      copied: "Đã sao chép!",
      download: "Tải xuống",
      selectLanguage: "Chọn ngôn ngữ",
      faq: "Câu hỏi Thường gặp",
      alsoIn: "Cũng trong",
      notFound: "Không tìm thấy trang",
      notFoundDescription: "Trang này không tồn tại hoặc đã được di chuyển.",
      backToHome: "Quay lại trang chủ",
      advertisement: "Quảng cáo",
    },
  },
};

export function getTranslations(lang: LanguageCode): Translations {
  const t = translations[lang] ?? translations.pt;
  return { ...t, lang };
}
