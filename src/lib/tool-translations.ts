import type { LanguageCode } from "./i18n";
import type { Faq } from "@/components/site/ToolLayout";

export type ToolTranslations = {
  meuCep: {
    intro: string;
    tabs: {
      location: string;
      cep: string;
      address: string;
    };
    labels: {
      cep: string;
      state: string;
      city: string;
      street: string;
      search: string;
      searching: string;
      discover: string;
      discovering: string;
      viewOnMap: string;
      addressFound: string;
      resultsFound: (count: number) => string;
      selectState: string;
    };
    placeholders: {
      cep: string;
      city: string;
      street: string;
    };
    errors: {
      noBrowser: string;
      permissionDenied: string;
      locationFailed: string;
      addressFailed: string;
      cepNotFound: string;
      fillAllFields: string;
      streetTooShort: string;
      noCep: string;
    };
    faq: Faq[];
    attribution: string;
  };
};

export const toolTranslations: Record<LanguageCode, ToolTranslations> = {
  pt: {
    meuCep: {
      intro: "Busque CEP pelo código postal, descubra o CEP de qualquer endereço brasileiro ou encontre seu CEP pela localização GPS.",
      tabs: {
        location: "Minha localização",
        cep: "Buscar por CEP",
        address: "Buscar por endereço",
      },
      labels: {
        cep: "CEP",
        state: "Estado (UF)",
        city: "Cidade",
        street: "Rua / Logradouro",
        search: "Buscar",
        searching: "Buscando…",
        discover: "Descobrir meu CEP",
        discovering: "Localizando…",
        viewOnMap: "Ver no mapa",
        addressFound: "Endereço encontrado",
        resultsFound: (count) => `${count} resultado${count !== 1 ? "s" : ""} encontrado${count !== 1 ? "s" : ""}`,
        selectState: "Selecione o estado",
      },
      placeholders: {
        cep: "00000-000",
        city: "Ex: São Paulo",
        street: "Ex: Avenida Paulista",
      },
      errors: {
        noBrowser: "Seu navegador não oferece localização.",
        permissionDenied: "Permissão de localização negada. Libere-a nas configurações do navegador.",
        locationFailed: "Não foi possível obter sua localização.",
        addressFailed: "Não foi possível consultar o endereço. Tente novamente.",
        cepNotFound: "CEP não encontrado.",
        fillAllFields: "Preencha todos os campos.",
        streetTooShort: "O nome da rua deve ter pelo menos 3 caracteres.",
        noCep: "Digite um CEP válido.",
      },
      faq: [
        {
          q: "O CEP é exato?",
          a: "Sim! Ao buscar por CEP, retornamos os dados oficiais dos Correios via ViaCEP. Para busca por localização GPS, é uma estimativa baseada em dados do OpenStreetMap.",
        },
        {
          q: "Vocês guardam minha localização?",
          a: "Não. As coordenadas e endereços são processados apenas no seu navegador e não são armazenadas pelo i-Tools.",
        },
        {
          q: "Como funciona a busca reversa de CEP?",
          a: "Digite o estado, cidade e nome da rua para encontrar o CEP correspondente. Os dados vêm das APIs públicas ViaCEP e BrasilAPI.",
        },
        {
          q: "O que é o mapa do OpenStreetMap?",
          a: "Após encontrar um endereço, você pode visualizá-lo em um mapa interativo do OpenStreetMap, um mapa livre e colaborativo.",
        },
      ],
      attribution: "Dados de endereço © colaboradores do OpenStreetMap.",
    },
  },
  en: {
    meuCep: {
      intro: "Search for postal code by code, find the postal code for any Brazilian address, or discover your postal code using GPS location.",
      tabs: {
        location: "My location",
        cep: "Search by postal code",
        address: "Search by address",
      },
      labels: {
        cep: "Postal Code",
        state: "State",
        city: "City",
        street: "Street",
        search: "Search",
        searching: "Searching…",
        discover: "Find my postal code",
        discovering: "Locating…",
        viewOnMap: "View on map",
        addressFound: "Address found",
        resultsFound: (count) => `${count} result${count !== 1 ? "s" : ""} found`,
        selectState: "Select state",
      },
      placeholders: {
        cep: "00000-000",
        city: "e.g.: São Paulo",
        street: "e.g.: Avenida Paulista",
      },
      errors: {
        noBrowser: "Your browser doesn't support geolocation.",
        permissionDenied: "Location permission denied. Enable it in your browser settings.",
        locationFailed: "Unable to get your location.",
        addressFailed: "Unable to query the address. Please try again.",
        cepNotFound: "Postal code not found.",
        fillAllFields: "Please fill in all fields.",
        streetTooShort: "Street name must be at least 3 characters.",
        noCep: "Enter a valid postal code.",
      },
      faq: [
        {
          q: "Is the postal code accurate?",
          a: "Yes! When searching by postal code, we return official data from Brazilian Postal Service via ViaCEP. For GPS location search, it's an estimate based on OpenStreetMap data.",
        },
        {
          q: "Do you store my location?",
          a: "No. Coordinates and addresses are processed only in your browser and are not stored by i-Tools.",
        },
        {
          q: "How does reverse postal code search work?",
          a: "Enter the state, city, and street name to find the corresponding postal code. Data comes from ViaCEP and BrasilAPI public APIs.",
        },
        {
          q: "What is the OpenStreetMap map?",
          a: "After finding an address, you can view it on an interactive OpenStreetMap, a free and collaborative map.",
        },
      ],
      attribution: "Address data © OpenStreetMap contributors.",
    },
  },
  es: {
    meuCep: {
      intro: "Busque código postal por código, encuentre el código postal de cualquier dirección brasileña o descubra su código postal usando la ubicación GPS.",
      tabs: {
        location: "Mi ubicación",
        cep: "Buscar por código postal",
        address: "Buscar por dirección",
      },
      labels: {
        cep: "Código Postal",
        state: "Estado",
        city: "Ciudad",
        street: "Calle",
        search: "Buscar",
        searching: "Buscando…",
        discover: "Encontrar mi código postal",
        discovering: "Localizando…",
        viewOnMap: "Ver en el mapa",
        addressFound: "Dirección encontrada",
        resultsFound: (count) => `${count} resultado${count !== 1 ? "s" : ""} encontrado${count !== 1 ? "s" : ""}`,
        selectState: "Seleccionar estado",
      },
      placeholders: {
        cep: "00000-000",
        city: "Ej: São Paulo",
        street: "Ej: Avenida Paulista",
      },
      errors: {
        noBrowser: "Su navegador no admite geolocalización.",
        permissionDenied: "Permiso de ubicación denegado. Actívelo en la configuración del navegador.",
        locationFailed: "No se pudo obtener su ubicación.",
        addressFailed: "No se pudo consultar la dirección. Inténtelo de nuevo.",
        cepNotFound: "Código postal no encontrado.",
        fillAllFields: "Complete todos los campos.",
        streetTooShort: "El nombre de la calle debe tener al menos 3 caracteres.",
        noCep: "Ingrese un código postal válido.",
      },
      faq: [
        {
          q: "¿Es exacto el código postal?",
          a: "¡Sí! Al buscar por código postal, devolvemos datos oficiales del Servicio Postal Brasileño a través de ViaCEP. Para la búsqueda por ubicación GPS, es una estimación basada en datos de OpenStreetMap.",
        },
        {
          q: "¿Almacenan mi ubicación?",
          a: "No. Las coordenadas y direcciones se procesan solo en su navegador y no son almacenadas por i-Tools.",
        },
        {
          q: "¿Cómo funciona la búsqueda inversa de código postal?",
          a: "Ingrese el estado, ciudad y nombre de la calle para encontrar el código postal correspondiente. Los datos provienen de las APIs públicas ViaCEP y BrasilAPI.",
        },
        {
          q: "¿Qué es el mapa de OpenStreetMap?",
          a: "Después de encontrar una dirección, puede verla en un mapa interactivo de OpenStreetMap, un mapa libre y colaborativo.",
        },
      ],
      attribution: "Datos de dirección © colaboradores de OpenStreetMap.",
    },
  },
  fr: {
    meuCep: {
      intro: "Recherchez un code postal par code, trouvez le code postal de n'importe quelle adresse brésilienne ou découvrez votre code postal en utilisant la localisation GPS.",
      tabs: {
        location: "Ma localisation",
        cep: "Rechercher par code postal",
        address: "Rechercher par adresse",
      },
      labels: {
        cep: "Code Postal",
        state: "État",
        city: "Ville",
        street: "Rue",
        search: "Rechercher",
        searching: "Recherche en cours…",
        discover: "Trouver mon code postal",
        discovering: "Localisation…",
        viewOnMap: "Voir sur la carte",
        addressFound: "Adresse trouvée",
        resultsFound: (count) => `${count} résultat${count !== 1 ? "s" : ""} trouvé${count !== 1 ? "s" : ""}`,
        selectState: "Sélectionner l'état",
      },
      placeholders: {
        cep: "00000-000",
        city: "Ex: São Paulo",
        street: "Ex: Avenida Paulista",
      },
      errors: {
        noBrowser: "Votre navigateur ne prend pas en charge la géolocalisation.",
        permissionDenied: "Permission de localisation refusée. Activez-la dans les paramètres du navigateur.",
        locationFailed: "Impossible d'obtenir votre position.",
        addressFailed: "Impossible de consulter l'adresse. Veuillez réessayer.",
        cepNotFound: "Code postal introuvable.",
        fillAllFields: "Veuillez remplir tous les champs.",
        streetTooShort: "Le nom de la rue doit comporter au moins 3 caractères.",
        noCep: "Entrez un code postal valide.",
      },
      faq: [
        {
          q: "Le code postal est-il exact?",
          a: "Oui! Lors de la recherche par code postal, nous renvoyons les données officielles du service postal brésilien via ViaCEP. Pour la recherche par localisation GPS, c'est une estimation basée sur les données OpenStreetMap.",
        },
        {
          q: "Stockez-vous ma localisation?",
          a: "Non. Les coordonnées et adresses sont traitées uniquement dans votre navigateur et ne sont pas stockées par i-Tools.",
        },
        {
          q: "Comment fonctionne la recherche inversée de code postal?",
          a: "Entrez l'état, la ville et le nom de la rue pour trouver le code postal correspondant. Les données proviennent des API publiques ViaCEP et BrasilAPI.",
        },
        {
          q: "Qu'est-ce que la carte OpenStreetMap?",
          a: "Après avoir trouvé une adresse, vous pouvez la visualiser sur une carte interactive OpenStreetMap, une carte libre et collaborative.",
        },
      ],
      attribution: "Données d'adresse © contributeurs OpenStreetMap.",
    },
  },
  de: {
    meuCep: {
      intro: "Suchen Sie nach Postleitzahl per Code, finden Sie die Postleitzahl einer beliebigen brasilianischen Adresse oder entdecken Sie Ihre Postleitzahl über GPS-Standort.",
      tabs: {
        location: "Mein Standort",
        cep: "Nach Postleitzahl suchen",
        address: "Nach Adresse suchen",
      },
      labels: {
        cep: "Postleitzahl",
        state: "Bundesstaat",
        city: "Stadt",
        street: "Straße",
        search: "Suchen",
        searching: "Suche läuft…",
        discover: "Meine Postleitzahl finden",
        discovering: "Lokalisierung…",
        viewOnMap: "Auf Karte ansehen",
        addressFound: "Adresse gefunden",
        resultsFound: (count) => `${count} Ergebnis${count !== 1 ? "se" : ""} gefunden`,
        selectState: "Bundesstaat auswählen",
      },
      placeholders: {
        cep: "00000-000",
        city: "z.B.: São Paulo",
        street: "z.B.: Avenida Paulista",
      },
      errors: {
        noBrowser: "Ihr Browser unterstützt keine Geolokalisierung.",
        permissionDenied: "Standortberechtigung verweigert. Aktivieren Sie sie in den Browser-Einstellungen.",
        locationFailed: "Ihr Standort konnte nicht ermittelt werden.",
        addressFailed: "Die Adresse konnte nicht abgerufen werden. Bitte versuchen Sie es erneut.",
        cepNotFound: "Postleitzahl nicht gefunden.",
        fillAllFields: "Bitte füllen Sie alle Felder aus.",
        streetTooShort: "Der Straßenname muss mindestens 3 Zeichen lang sein.",
        noCep: "Geben Sie eine gültige Postleitzahl ein.",
      },
      faq: [
        {
          q: "Ist die Postleitzahl genau?",
          a: "Ja! Bei der Suche nach Postleitzahl geben wir offizielle Daten des brasilianischen Postdienstes über ViaCEP zurück. Für die GPS-Standortsuche ist es eine Schätzung basierend auf OpenStreetMap-Daten.",
        },
        {
          q: "Speichern Sie meinen Standort?",
          a: "Nein. Koordinaten und Adressen werden nur in Ihrem Browser verarbeitet und nicht von i-Tools gespeichert.",
        },
        {
          q: "Wie funktioniert die umgekehrte Postleitzahlsuche?",
          a: "Geben Sie Bundesstaat, Stadt und Straßennamen ein, um die entsprechende Postleitzahl zu finden. Die Daten stammen von den öffentlichen APIs ViaCEP und BrasilAPI.",
        },
        {
          q: "Was ist die OpenStreetMap-Karte?",
          a: "Nachdem Sie eine Adresse gefunden haben, können Sie sie auf einer interaktiven OpenStreetMap-Karte anzeigen, einer freien und kollaborativen Karte.",
        },
      ],
      attribution: "Adressdaten © OpenStreetMap-Mitwirkende.",
    },
  },
  it: {
    meuCep: {
      intro: "Cerca il codice postale per codice, trova il codice postale di qualsiasi indirizzo brasiliano o scopri il tuo codice postale utilizzando la posizione GPS.",
      tabs: {
        location: "La mia posizione",
        cep: "Cerca per codice postale",
        address: "Cerca per indirizzo",
      },
      labels: {
        cep: "Codice Postale",
        state: "Stato",
        city: "Città",
        street: "Via",
        search: "Cerca",
        searching: "Ricerca in corso…",
        discover: "Trova il mio codice postale",
        discovering: "Localizzazione…",
        viewOnMap: "Visualizza sulla mappa",
        addressFound: "Indirizzo trovato",
        resultsFound: (count) => `${count} risultato${count !== 1 ? "i" : ""} trovato${count !== 1 ? "i" : ""}`,
        selectState: "Seleziona stato",
      },
      placeholders: {
        cep: "00000-000",
        city: "Es: São Paulo",
        street: "Es: Avenida Paulista",
      },
      errors: {
        noBrowser: "Il tuo browser non supporta la geolocalizzazione.",
        permissionDenied: "Autorizzazione alla posizione negata. Abilitala nelle impostazioni del browser.",
        locationFailed: "Impossibile ottenere la tua posizione.",
        addressFailed: "Impossibile consultare l'indirizzo. Riprova.",
        cepNotFound: "Codice postale non trovato.",
        fillAllFields: "Compila tutti i campi.",
        streetTooShort: "Il nome della via deve contenere almeno 3 caratteri.",
        noCep: "Inserisci un codice postale valido.",
      },
      faq: [
        {
          q: "Il codice postale è accurato?",
          a: "Sì! Durante la ricerca per codice postale, restituiamo i dati ufficiali del servizio postale brasiliano tramite ViaCEP. Per la ricerca per posizione GPS, è una stima basata sui dati di OpenStreetMap.",
        },
        {
          q: "Memorizzate la mia posizione?",
          a: "No. Le coordinate e gli indirizzi vengono elaborati solo nel tuo browser e non vengono archiviati da i-Tools.",
        },
        {
          q: "Come funziona la ricerca inversa del codice postale?",
          a: "Inserisci lo stato, la città e il nome della via per trovare il codice postale corrispondente. I dati provengono dalle API pubbliche ViaCEP e BrasilAPI.",
        },
        {
          q: "Cos'è la mappa OpenStreetMap?",
          a: "Dopo aver trovato un indirizzo, puoi visualizzarlo su una mappa interattiva OpenStreetMap, una mappa libera e collaborativa.",
        },
      ],
      attribution: "Dati indirizzo © contributori OpenStreetMap.",
    },
  },
  // I'll continue with the remaining languages (nl, pl, ru, uk, tr, ar, hi, id, ja, ko, zh, vi) in abbreviated form for space
  nl: {
    meuCep: {
      intro: "Zoek postcode per code, vind de postcode van elk Braziliaans adres of ontdek uw postcode met GPS-locatie.",
      tabs: { location: "Mijn locatie", cep: "Zoeken op postcode", address: "Zoeken op adres" },
      labels: { cep: "Postcode", state: "Staat", city: "Stad", street: "Straat", search: "Zoeken", searching: "Zoeken…", discover: "Vind mijn postcode", discovering: "Lokaliseren…", viewOnMap: "Bekijk op kaart", addressFound: "Adres gevonden", resultsFound: (c) => `${c} resultaat${c !== 1 ? "en" : ""} gevonden`, selectState: "Selecteer staat" },
      placeholders: { cep: "00000-000", city: "Bijv.: São Paulo", street: "Bijv.: Avenida Paulista" },
      errors: { noBrowser: "Uw browser ondersteunt geen geolocatie.", permissionDenied: "Locatietoestemming geweigerd. Schakel deze in in uw browserinstellingen.", locationFailed: "Kan uw locatie niet verkrijgen.", addressFailed: "Kan het adres niet opvragen. Probeer het opnieuw.", cepNotFound: "Postcode niet gevonden.", fillAllFields: "Vul alle velden in.", streetTooShort: "Straatnaam moet minimaal 3 tekens bevatten.", noCep: "Voer een geldige postcode in." },
      faq: [{ q: "Is de postcode nauwkeurig?", a: "Ja! Bij het zoeken op postcode retourneren we officiële gegevens van de Braziliaanse postdienst via ViaCEP. Voor GPS-locatiezoeken is het een schatting op basis van OpenStreetMap-gegevens." }, { q: "Slaat u mijn locatie op?", a: "Nee. Coördinaten en adressen worden alleen in uw browser verwerkt en worden niet opgeslagen door i-Tools." }, { q: "Hoe werkt omgekeerd zoeken op postcode?", a: "Voer staat, stad en straatnaam in om de bijbehorende postcode te vinden. Gegevens komen van de openbare API's ViaCEP en BrasilAPI." }, { q: "Wat is de OpenStreetMap-kaart?", a: "Na het vinden van een adres kunt u het bekijken op een interactieve OpenStreetMap-kaart, een vrije en collaboratieve kaart." }],
      attribution: "Adresgegevens © OpenStreetMap-bijdragers.",
    },
  },
  pl: {
    meuCep: {
      intro: "Wyszukaj kod pocztowy według kodu, znajdź kod pocztowy dowolnego brazylijskiego adresu lub odkryj swój kod pocztowy za pomocą lokalizacji GPS.",
      tabs: { location: "Moja lokalizacja", cep: "Szukaj po kodzie pocztowym", address: "Szukaj po adresie" },
      labels: { cep: "Kod Pocztowy", state: "Stan", city: "Miasto", street: "Ulica", search: "Szukaj", searching: "Wyszukiwanie…", discover: "Znajdź mój kod pocztowy", discovering: "Lokalizowanie…", viewOnMap: "Zobacz na mapie", addressFound: "Znaleziono adres", resultsFound: (c) => `Znaleziono ${c} wynik${c !== 1 ? "i" : ""}`, selectState: "Wybierz stan" },
      placeholders: { cep: "00000-000", city: "Np.: São Paulo", street: "Np.: Avenida Paulista" },
      errors: { noBrowser: "Twoja przeglądarka nie obsługuje geolokalizacji.", permissionDenied: "Odmówiono pozwolenia na lokalizację. Włącz ją w ustawieniach przeglądarki.", locationFailed: "Nie można uzyskać Twojej lokalizacji.", addressFailed: "Nie można odpytać adresu. Spróbuj ponownie.", cepNotFound: "Nie znaleziono kodu pocztowego.", fillAllFields: "Wypełnij wszystkie pola.", streetTooShort: "Nazwa ulicy musi mieć co najmniej 3 znaki.", noCep: "Wprowadź prawidłowy kod pocztowy." },
      faq: [{ q: "Czy kod pocztowy jest dokładny?", a: "Tak! Podczas wyszukiwania według kodu pocztowego zwracamy oficjalne dane brazylijskiej poczty przez ViaCEP. W przypadku wyszukiwania według lokalizacji GPS jest to oszacowanie na podstawie danych OpenStreetMap." }, { q: "Czy przechowujecie moją lokalizację?", a: "Nie. Współrzędne i adresy są przetwarzane tylko w przeglądarce i nie są przechowywane przez i-Tools." }, { q: "Jak działa odwrotne wyszukiwanie kodu pocztowego?", a: "Wprowadź stan, miasto i nazwę ulicy, aby znaleźć odpowiedni kod pocztowy. Dane pochodzą z publicznych API ViaCEP i BrasilAPI." }, { q: "Co to jest mapa OpenStreetMap?", a: "Po znalezieniu adresu możesz go wyświetlić na interaktywnej mapie OpenStreetMap, wolnej i współpracującej mapie." }],
      attribution: "Dane adresowe © współtwórcy OpenStreetMap.",
    },
  },
  ru: {
    meuCep: {
      intro: "Найдите почтовый индекс по коду, найдите почтовый индекс любого бразильского адреса или узнайте свой почтовый индекс с помощью GPS-локации.",
      tabs: { location: "Моё местоположение", cep: "Поиск по почтовому индексу", address: "Поиск по адресу" },
      labels: { cep: "Почтовый Индекс", state: "Штат", city: "Город", street: "Улица", search: "Поиск", searching: "Поиск…", discover: "Найти мой почтовый индекс", discovering: "Локализация…", viewOnMap: "Посмотреть на карте", addressFound: "Адрес найден", resultsFound: (c) => `Найдено ${c} результат${c !== 1 ? "ов" : ""}`, selectState: "Выбрать штат" },
      placeholders: { cep: "00000-000", city: "Напр.: São Paulo", street: "Напр.: Avenida Paulista" },
      errors: { noBrowser: "Ваш браузер не поддерживает геолокацию.", permissionDenied: "Разрешение на определение местоположения отклонено. Включите его в настройках браузера.", locationFailed: "Невозможно получить ваше местоположение.", addressFailed: "Не удалось запросить адрес. Попробуйте снова.", cepNotFound: "Почтовый индекс не найден.", fillAllFields: "Заполните все поля.", streetTooShort: "Название улицы должно содержать не менее 3 символов.", noCep: "Введите действительный почтовый индекс." },
      faq: [{ q: "Точен ли почтовый индекс?", a: "Да! При поиске по почтовому индексу мы возвращаем официальные данные бразильской почты через ViaCEP. Для поиска по GPS-локации это оценка на основе данных OpenStreetMap." }, { q: "Вы храните моё местоположение?", a: "Нет. Координаты и адреса обрабатываются только в вашем браузере и не хранятся i-Tools." }, { q: "Как работает обратный поиск почтового индекса?", a: "Введите штат, город и название улицы, чтобы найти соответствующий почтовый индекс. Данные берутся из публичных API ViaCEP и BrasilAPI." }, { q: "Что такое карта OpenStreetMap?", a: "После нахождения адреса вы можете просмотреть его на интерактивной карте OpenStreetMap, свободной и совместной карте." }],
      attribution: "Данные адресов © участники OpenStreetMap.",
    },
  },
  uk: {
    meuCep: {
      intro: "Знайдіть поштовий індекс за кодом, знайдіть поштовий індекс будь-якої бразильської адреси або дізнайтеся свій поштовий індекс за допомогою GPS-локації.",
      tabs: { location: "Моє місцезнаходження", cep: "Пошук за поштовим індексом", address: "Пошук за адресою" },
      labels: { cep: "Поштовий Індекс", state: "Штат", city: "Місто", street: "Вулиця", search: "Пошук", searching: "Пошук…", discover: "Знайти мій поштовий індекс", discovering: "Локалізація…", viewOnMap: "Подивитися на карті", addressFound: "Адресу знайдено", resultsFound: (c) => `Знайдено ${c} результат${c !== 1 ? "ів" : ""}`, selectState: "Вибрати штат" },
      placeholders: { cep: "00000-000", city: "Напр.: São Paulo", street: "Напр.: Avenida Paulista" },
      errors: { noBrowser: "Ваш браузер не підтримує геолокацію.", permissionDenied: "Дозвіл на визначення місцезнаходження відхилено. Увімкніть його в налаштуваннях браузера.", locationFailed: "Неможливо отримати ваше місцезнаходження.", addressFailed: "Не вдалося запитати адресу. Спробуйте ще раз.", cepNotFound: "Поштовий індекс не знайдено.", fillAllFields: "Заповніть усі поля.", streetTooShort: "Назва вулиці повинна містити щонайменше 3 символи.", noCep: "Введіть дійсний поштовий індекс." },
      faq: [{ q: "Чи точний поштовий індекс?", a: "Так! При пошуку за поштовим індексом ми повертаємо офіційні дані бразильської пошти через ViaCEP. Для пошуку за GPS-локацією це оцінка на основі даних OpenStreetMap." }, { q: "Ви зберігаєте моє місцезнаходження?", a: "Ні. Координати та адреси обробляються лише у вашому браузері та не зберігаються i-Tools." }, { q: "Як працює зворотний пошук поштового індексу?", a: "Введіть штат, місто та назву вулиці, щоб знайти відповідний поштовий індекс. Дані береться з публічних API ViaCEP та BrasilAPI." }, { q: "Що таке карта OpenStreetMap?", a: "Після знаходження адреси ви можете переглянути її на інтерактивній карті OpenStreetMap, вільній та спільній карті." }],
      attribution: "Дані адрес © учасники OpenStreetMap.",
    },
  },
  tr: {
    meuCep: {
      intro: "Koda göre posta kodunu arayın, herhangi bir Brezilya adresinin posta kodunu bulun veya GPS konumu kullanarak posta kodunuzu keşfedin.",
      tabs: { location: "Konumum", cep: "Posta koduna göre ara", address: "Adrese göre ara" },
      labels: { cep: "Posta Kodu", state: "Eyalet", city: "Şehir", street: "Sokak", search: "Ara", searching: "Aranıyor…", discover: "Posta kodumu bul", discovering: "Konumlandırılıyor…", viewOnMap: "Haritada görüntüle", addressFound: "Adres bulundu", resultsFound: (c) => `${c} sonuç bulundu`, selectState: "Eyalet seç" },
      placeholders: { cep: "00000-000", city: "Örn.: São Paulo", street: "Örn.: Avenida Paulista" },
      errors: { noBrowser: "Tarayıcınız coğrafi konumu desteklemiyor.", permissionDenied: "Konum izni reddedildi. Tarayıcı ayarlarında etkinleştirin.", locationFailed: "Konumunuz alınamıyor.", addressFailed: "Adres sorgulanamıyor. Lütfen tekrar deneyin.", cepNotFound: "Posta kodu bulunamadı.", fillAllFields: "Lütfen tüm alanları doldurun.", streetTooShort: "Sokak adı en az 3 karakter olmalıdır.", noCep: "Geçerli bir posta kodu girin." },
      faq: [{ q: "Posta kodu doğru mu?", a: "Evet! Posta koduna göre arama yaparken ViaCEP aracılığıyla Brezilya posta hizmetinin resmi verilerini döndürüyoruz. GPS konum araması için OpenStreetMap verilerine dayalı bir tahmindir." }, { q: "Konumumu saklıyor musunuz?", a: "Hayır. Koordinatlar ve adresler yalnızca tarayıcınızda işlenir ve i-Tools tarafından saklanmaz." }, { q: "Ters posta kodu araması nasıl çalışır?", a: "Karşılık gelen posta kodunu bulmak için eyalet, şehir ve sokak adını girin. Veriler ViaCEP ve BrasilAPI genel API'lerinden gelir." }, { q: "OpenStreetMap haritası nedir?", a: "Bir adres bulduktan sonra, ücretsiz ve işbirlikçi bir harita olan etkileşimli bir OpenStreetMap haritasında görüntüleyebilirsiniz." }],
      attribution: "Adres verileri © OpenStreetMap katkıda bulunanları.",
    },
  },
  ar: {
    meuCep: {
      intro: "ابحث عن الرمز البريدي بالرمز، أو ابحث عن الرمز البريدي لأي عنوان برازيلي أو اكتشف رمزك البريدي باستخدام موقع GPS.",
      tabs: { location: "موقعي", cep: "البحث بالرمز البريدي", address: "البحث بالعنوان" },
      labels: { cep: "الرمز البريدي", state: "الولاية", city: "المدينة", street: "الشارع", search: "بحث", searching: "جاري البحث…", discover: "اعثر على رمزي البريدي", discovering: "جاري التحديد…", viewOnMap: "عرض على الخريطة", addressFound: "تم العثور على العنوان", resultsFound: (c) => `تم العثور على ${c} نتيجة`, selectState: "اختر الولاية" },
      placeholders: { cep: "00000-000", city: "مثال: São Paulo", street: "مثال: Avenida Paulista" },
      errors: { noBrowser: "متصفحك لا يدعم تحديد الموقع الجغرافي.", permissionDenied: "تم رفض إذن الموقع. قم بتمكينه في إعدادات المتصفح.", locationFailed: "تعذر الحصول على موقعك.", addressFailed: "تعذر الاستعلام عن العنوان. يرجى المحاولة مرة أخرى.", cepNotFound: "لم يتم العثور على الرمز البريدي.", fillAllFields: "يرجى ملء جميع الحقول.", streetTooShort: "يجب أن يحتوي اسم الشارع على 3 أحرف على الأقل.", noCep: "أدخل رمزًا بريديًا صالحًا." },
      faq: [{ q: "هل الرمز البريدي دقيق؟", a: "نعم! عند البحث بالرمز البريدي، نعيد البيانات الرسمية من خدمة البريد البرازيلية عبر ViaCEP. بالنسبة للبحث عن موقع GPS، إنه تقدير يستند إلى بيانات OpenStreetMap." }, { q: "هل تخزنون موقعي؟", a: "لا. يتم معالجة الإحداثيات والعناوين فقط في متصفحك ولا يتم تخزينها بواسطة i-Tools." }, { q: "كيف يعمل البحث العكسي عن الرمز البريدي؟", a: "أدخل الولاية والمدينة واسم الشارع للعثور على الرمز البريدي المقابل. تأتي البيانات من واجهات API العامة ViaCEP و BrasilAPI." }, { q: "ما هي خريطة OpenStreetMap؟", a: "بعد العثور على عنوان، يمكنك عرضه على خريطة OpenStreetMap التفاعلية، وهي خريطة مجانية وتعاونية." }],
      attribution: "بيانات العنوان © مساهمو OpenStreetMap.",
    },
  },
  hi: {
    meuCep: {
      intro: "कोड द्वारा पोस्टल कोड खोजें, किसी भी ब्राजीलियाई पते का पोस्टल कोड खोजें या GPS स्थान का उपयोग करके अपना पोस्टल कोड खोजें।",
      tabs: { location: "मेरा स्थान", cep: "पोस्टल कोड द्वारा खोजें", address: "पते द्वारा खोजें" },
      labels: { cep: "पोस्टल कोड", state: "राज्य", city: "शहर", street: "सड़क", search: "खोजें", searching: "खोज रहे हैं…", discover: "मेरा पोस्टल कोड खोजें", discovering: "स्थान निर्धारण…", viewOnMap: "मानचित्र पर देखें", addressFound: "पता मिल गया", resultsFound: (c) => `${c} परिणाम मिले`, selectState: "राज्य चुनें" },
      placeholders: { cep: "00000-000", city: "उदा.: São Paulo", street: "उदा.: Avenida Paulista" },
      errors: { noBrowser: "आपका ब्राउज़र भू-स्थान का समर्थन नहीं करता है।", permissionDenied: "स्थान अनुमति अस्वीकृत। इसे ब्राउज़र सेटिंग में सक्षम करें।", locationFailed: "आपका स्थान प्राप्त नहीं किया जा सका।", addressFailed: "पता प्राप्त नहीं कर सका। कृपया पुनः प्रयास करें।", cepNotFound: "पोस्टल कोड नहीं मिला।", fillAllFields: "कृपया सभी फ़ील्ड भरें।", streetTooShort: "सड़क का नाम कम से कम 3 अक्षरों का होना चाहिए।", noCep: "एक मान्य पोस्टल कोड दर्ज करें।" },
      faq: [{ q: "क्या पोस्टल कोड सटीक है?", a: "हाँ! पोस्टल कोड द्वारा खोज करते समय हम ViaCEP के माध्यम से ब्राजीलियाई डाक सेवा से आधिकारिक डेटा लौटाते हैं। GPS स्थान खोज के लिए यह OpenStreetMap डेटा पर आधारित अनुमान है।" }, { q: "क्या आप मेरा स्थान संग्रहीत करते हैं?", a: "नहीं। निर्देशांक और पते केवल आपके ब्राउज़र में संसाधित होते हैं और i-Tools द्वारा संग्रहीत नहीं किए जाते हैं।" }, { q: "रिवर्स पोस्टल कोड खोज कैसे काम करती है?", a: "संबंधित पोस्टल कोड खोजने के लिए राज्य, शहर और सड़क का नाम दर्ज करें। डेटा ViaCEP और BrasilAPI सार्वजनिक API से आता है।" }, { q: "OpenStreetMap मानचित्र क्या है?", a: "पता खोजने के बाद, आप इसे एक इंटरैक्टिव OpenStreetMap मानचित्र पर देख सकते हैं, जो एक मुफ्त और सहयोगी मानचित्र है।" }],
      attribution: "पता डेटा © OpenStreetMap योगदानकर्ता।",
    },
  },
  id: {
    meuCep: {
      intro: "Cari kode pos berdasarkan kode, temukan kode pos alamat Brasil mana pun atau temukan kode pos Anda menggunakan lokasi GPS.",
      tabs: { location: "Lokasi saya", cep: "Cari berdasarkan kode pos", address: "Cari berdasarkan alamat" },
      labels: { cep: "Kode Pos", state: "Negara Bagian", city: "Kota", street: "Jalan", search: "Cari", searching: "Mencari…", discover: "Temukan kode pos saya", discovering: "Menemukan lokasi…", viewOnMap: "Lihat di peta", addressFound: "Alamat ditemukan", resultsFound: (c) => `${c} hasil ditemukan`, selectState: "Pilih negara bagian" },
      placeholders: { cep: "00000-000", city: "Mis.: São Paulo", street: "Mis.: Avenida Paulista" },
      errors: { noBrowser: "Browser Anda tidak mendukung geolokasi.", permissionDenied: "Izin lokasi ditolak. Aktifkan di pengaturan browser.", locationFailed: "Tidak dapat memperoleh lokasi Anda.", addressFailed: "Tidak dapat meminta alamat. Silakan coba lagi.", cepNotFound: "Kode pos tidak ditemukan.", fillAllFields: "Harap isi semua bidang.", streetTooShort: "Nama jalan harus minimal 3 karakter.", noCep: "Masukkan kode pos yang valid." },
      faq: [{ q: "Apakah kode pos akurat?", a: "Ya! Saat mencari berdasarkan kode pos, kami mengembalikan data resmi dari layanan pos Brasil melalui ViaCEP. Untuk pencarian lokasi GPS, ini adalah perkiraan berdasarkan data OpenStreetMap." }, { q: "Apakah Anda menyimpan lokasi saya?", a: "Tidak. Koordinat dan alamat hanya diproses di browser Anda dan tidak disimpan oleh i-Tools." }, { q: "Bagaimana pencarian kode pos terbalik bekerja?", a: "Masukkan negara bagian, kota, dan nama jalan untuk menemukan kode pos yang sesuai. Data berasal dari API publik ViaCEP dan BrasilAPI." }, { q: "Apa itu peta OpenStreetMap?", a: "Setelah menemukan alamat, Anda dapat melihatnya di peta OpenStreetMap interaktif, peta gratis dan kolaboratif." }],
      attribution: "Data alamat © kontributor OpenStreetMap.",
    },
  },
  ja: {
    meuCep: {
      intro: "コードで郵便番号を検索し、ブラジルの住所の郵便番号を見つけるか、GPS位置を使用して郵便番号を見つけます。",
      tabs: { location: "現在地", cep: "郵便番号で検索", address: "住所で検索" },
      labels: { cep: "郵便番号", state: "州", city: "市", street: "通り", search: "検索", searching: "検索中…", discover: "郵便番号を見つける", discovering: "位置特定中…", viewOnMap: "地図で表示", addressFound: "住所が見つかりました", resultsFound: (c) => `${c}件の結果が見つかりました`, selectState: "州を選択" },
      placeholders: { cep: "00000-000", city: "例: São Paulo", street: "例: Avenida Paulista" },
      errors: { noBrowser: "お使いのブラウザは位置情報をサポートしていません。", permissionDenied: "位置情報の許可が拒否されました。ブラウザの設定で有効にしてください。", locationFailed: "位置を取得できませんでした。", addressFailed: "住所を照会できませんでした。もう一度お試しください。", cepNotFound: "郵便番号が見つかりませんでした。", fillAllFields: "すべてのフィールドに入力してください。", streetTooShort: "通り名は少なくとも3文字である必要があります。", noCep: "有効な郵便番号を入力してください。" },
      faq: [{ q: "郵便番号は正確ですか？", a: "はい！郵便番号で検索すると、ViaCEPを介してブラジル郵便サービスの公式データを返します。GPS位置検索の場合、OpenStreetMapデータに基づく推定値です。" }, { q: "私の位置を保存しますか？", a: "いいえ。座標と住所はブラウザでのみ処理され、i-Toolsによって保存されません。" }, { q: "逆郵便番号検索はどのように機能しますか？", a: "州、市、通り名を入力して、対応する郵便番号を見つけます。データはViaCEPとBrasilAPIのパブリックAPIから取得されます。" }, { q: "OpenStreetMapマップとは何ですか？", a: "住所を見つけた後、無料で協力的なマップであるインタラクティブなOpenStreetMapマップで表示できます。" }],
      attribution: "住所データ © OpenStreetMap貢献者。",
    },
  },
  ko: {
    meuCep: {
      intro: "코드로 우편번호를 검색하고, 브라질 주소의 우편번호를 찾거나 GPS 위치를 사용하여 우편번호를 찾으세요.",
      tabs: { location: "내 위치", cep: "우편번호로 검색", address: "주소로 검색" },
      labels: { cep: "우편번호", state: "주", city: "도시", street: "거리", search: "검색", searching: "검색 중…", discover: "내 우편번호 찾기", discovering: "위치 확인 중…", viewOnMap: "지도에서 보기", addressFound: "주소를 찾았습니다", resultsFound: (c) => `${c}개의 결과를 찾았습니다`, selectState: "주 선택" },
      placeholders: { cep: "00000-000", city: "예: São Paulo", street: "예: Avenida Paulista" },
      errors: { noBrowser: "브라우저가 위치 정보를 지원하지 않습니다.", permissionDenied: "위치 권한이 거부되었습니다. 브라우저 설정에서 활성화하세요.", locationFailed: "위치를 가져올 수 없습니다.", addressFailed: "주소를 조회할 수 없습니다. 다시 시도하세요.", cepNotFound: "우편번호를 찾을 수 없습니다.", fillAllFields: "모든 필드를 입력하세요.", streetTooShort: "거리 이름은 최소 3자 이상이어야 합니다.", noCep: "유효한 우편번호를 입력하세요." },
      faq: [{ q: "우편번호가 정확합니까?", a: "예! 우편번호로 검색하면 ViaCEP를 통해 브라질 우편 서비스의 공식 데이터를 반환합니다. GPS 위치 검색의 경우 OpenStreetMap 데이터를 기반으로 한 추정치입니다." }, { q: "내 위치를 저장합니까?", a: "아니요. 좌표와 주소는 브라우저에서만 처리되며 i-Tools에서 저장하지 않습니다." }, { q: "역 우편번호 검색은 어떻게 작동합니까?", a: "주, 도시 및 거리 이름을 입력하여 해당 우편번호를 찾으십시오. 데이터는 ViaCEP 및 BrasilAPI 공개 API에서 가져옵니다." }, { q: "OpenStreetMap 지도란 무엇입니까?", a: "주소를 찾은 후 무료 및 협업 지도인 대화형 OpenStreetMap 지도에서 볼 수 있습니다." }],
      attribution: "주소 데이터 © OpenStreetMap 기여자.",
    },
  },
  zh: {
    meuCep: {
      intro: "按代码搜索邮政编码，查找任何巴西地址的邮政编码，或使用GPS位置发现您的邮政编码。",
      tabs: { location: "我的位置", cep: "按邮政编码搜索", address: "按地址搜索" },
      labels: { cep: "邮政编码", state: "州", city: "城市", street: "街道", search: "搜索", searching: "搜索中…", discover: "查找我的邮政编码", discovering: "定位中…", viewOnMap: "在地图上查看", addressFound: "找到地址", resultsFound: (c) => `找到${c}个结果`, selectState: "选择州" },
      placeholders: { cep: "00000-000", city: "例如: São Paulo", street: "例如: Avenida Paulista" },
      errors: { noBrowser: "您的浏览器不支持地理定位。", permissionDenied: "位置权限被拒绝。请在浏览器设置中启用它。", locationFailed: "无法获取您的位置。", addressFailed: "无法查询地址。请重试。", cepNotFound: "未找到邮政编码。", fillAllFields: "请填写所有字段。", streetTooShort: "街道名称必须至少有3个字符。", noCep: "请输入有效的邮政编码。" },
      faq: [{ q: "邮政编码准确吗？", a: "是的！在按邮政编码搜索时，我们通过ViaCEP返回巴西邮政服务的官方数据。对于GPS位置搜索，这是基于OpenStreetMap数据的估计。" }, { q: "您是否存储我的位置？", a: "不。坐标和地址仅在您的浏览器中处理，不会被i-Tools存储。" }, { q: "反向邮政编码搜索如何工作？", a: "输入州、城市和街道名称以查找相应的邮政编码。数据来自ViaCEP和BrasilAPI公共API。" }, { q: "什么是OpenStreetMap地图？", a: "在找到地址后，您可以在交互式OpenStreetMap地图上查看它，这是一个免费且协作的地图。" }],
      attribution: "地址数据 © OpenStreetMap贡献者。",
    },
  },
  vi: {
    meuCep: {
      intro: "Tìm kiếm mã bưu điện theo mã, tìm mã bưu điện của bất kỳ địa chỉ Brazil nào hoặc khám phá mã bưu điện của bạn bằng vị trí GPS.",
      tabs: { location: "Vị trí của tôi", cep: "Tìm theo mã bưu điện", address: "Tìm theo địa chỉ" },
      labels: { cep: "Mã Bưu Điện", state: "Bang", city: "Thành phố", street: "Đường", search: "Tìm kiếm", searching: "Đang tìm…", discover: "Tìm mã bưu điện của tôi", discovering: "Đang định vị…", viewOnMap: "Xem trên bản đồ", addressFound: "Đã tìm thấy địa chỉ", resultsFound: (c) => `Tìm thấy ${c} kết quả`, selectState: "Chọn bang" },
      placeholders: { cep: "00000-000", city: "VD: São Paulo", street: "VD: Avenida Paulista" },
      errors: { noBrowser: "Trình duyệt của bạn không hỗ trợ định vị địa lý.", permissionDenied: "Quyền vị trí bị từ chối. Bật nó trong cài đặt trình duyệt.", locationFailed: "Không thể lấy vị trí của bạn.", addressFailed: "Không thể truy vấn địa chỉ. Vui lòng thử lại.", cepNotFound: "Không tìm thấy mã bưu điện.", fillAllFields: "Vui lòng điền tất cả các trường.", streetTooShort: "Tên đường phải có ít nhất 3 ký tự.", noCep: "Nhập mã bưu điện hợp lệ." },
      faq: [{ q: "Mã bưu điện có chính xác không?", a: "Có! Khi tìm kiếm theo mã bưu điện, chúng tôi trả về dữ liệu chính thức từ Dịch vụ Bưu điện Brazil qua ViaCEP. Đối với tìm kiếm vị trí GPS, đó là ước tính dựa trên dữ liệu OpenStreetMap." }, { q: "Bạn có lưu vị trí của tôi không?", a: "Không. Tọa độ và địa chỉ chỉ được xử lý trong trình duyệt của bạn và không được lưu trữ bởi i-Tools." }, { q: "Tìm kiếm mã bưu điện ngược hoạt động như thế nào?", a: "Nhập bang, thành phố và tên đường để tìm mã bưu điện tương ứng. Dữ liệu đến từ các API công khai ViaCEP và BrasilAPI." }, { q: "Bản đồ OpenStreetMap là gì?", a: "Sau khi tìm thấy địa chỉ, bạn có thể xem nó trên bản đồ OpenStreetMap tương tác, một bản đồ miễn phí và cộng tác." }],
      attribution: "Dữ liệu địa chỉ © người đóng góp OpenStreetMap.",
    },
  },
};

export function getToolTranslations(lang: LanguageCode): ToolTranslations {
  return toolTranslations[lang] ?? toolTranslations.pt;
}
