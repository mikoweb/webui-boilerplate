# jQuery Hash Router
Mechanizm trasowania w jQuery.

- [Strona demo](http://mikoweb.pl/projects/jquery-hash-router/example.html)
- [Wstęp](#wst%C4%99p)
    - [Prosty przykład tworzenia nowej ścieżki](#prosty-przyk%C5%82ad-tworzenia-nowej-%C5%9Bcie%C5%BCki)
    - [Duplikacja adresów - jak się ustrzec błędów?](#duplikacja-adres%C3%B3w---jak-si%C4%99-ustrzec-b%C5%82%C4%99d%C3%B3w)
- [Ścieżki](#%C5%9Acie%C5%BCki)
    - [Parametry](#parametry)
        - [Jak router interpretuje parametry?](#jak-router-interpretuje-parametry)
    - [Separator grup](#separator-grup)
    - [Separatory parametrów](#separatory-parametr%C3%B3w)
    - [Separatory wyrazów](#separatory-wyraz%C3%B3w)
    - [Separator dziesiętny](#separator-dziesi%C4%99tny)
- [Kontroler](#kontroler)
    - [setEvent](#setevent)
    - [setResponse](#setresponse)
    - [addNavigation](#addnavigation)

## Wstęp
W sekcji head dodaj skrypty z poniższego listingu.

```html
<script type="text/javascript" src="http://code.jquery.com/jquery-2.1.0.min.js"></script>
<script type="text/javascript" src="jquery.sprintf.js"></script>
<script type="text/javascript" src="jquery.hashchange.js"></script>
<script type="text/javascript" src="jquery.hash-router.js"></script>
<script type="text/javascript" src="jquery.hash-router-ajax-response.js"></script>
```

Plik `jquery.hash-router-ajax-response.js` jest opcjonalny, rozszerza funkcjonalność o nowy prototyp `AjaxResponse`, który służy do obsługi AJAX-owych requestów.<br />
Plugin [jquery.hashchange.js](https://github.com/georgekosmidis/jquery-hashchange) dodaje obsługę zdarzenia `jQuery(window).hashchange()` oraz emuluje zachowanie [window.onhashchange](https://developer.mozilla.org/en-US/docs/Web/API/Window.onhashchange) w starszych wersjach IE.<br />
Plugin [jquery.sprintf.js](https://github.com/azatoth/jquery-sprintf) naśladuje znane z języka C funkcje `printf` i `sprintf`.

### Prosty przykład tworzenia nowej ścieżki
Do interfejsu routera odwołujemy się poprzez metodę `$.hashRouter()`. Należy przy tym pamiętać, że w pamięci istnieje tylko jedna instancja routera. Każdorazowe wywołanie `$.hashRouter()` nie tworzy nowych obiektów, działamy cały czas na tym samym obiekcie.

```js
var router = $.hashRouter();
```

Nową ścieżkę dodajemy poprzez wywołanie metody `addRoute(path, controller)`, która jako pierwszy parametr przyjmuje łańcuch znaków rozpoczynający się od znaku slash, a jako drugi parametr obiekt `$.hashRouter.controller()`.

```js
    router.addRoute('/hello-world.html',
        $.hashRouter.controller()
            .setEvent({
                action: function(container, properties) {
                    alert('hello world!');
                }
            })
    );
```

Na samym końcu należy wywołać metodę `getReady()`, która spowoduje przestawienie routera w tryb „nasłuchiwania” - od tego momentu wpisanie w pasek adresu końcówki `#/hello-world.html` spowoduje wyświetlenie komunikatu o treści `hello world!`. Od tej chwili nie można już dodawać kolejnych ścieżek do routera. Wywołanie metody `addRoute()` co prawda nie spowoduje błędu ale ścieżka nie zostanie zarejestrowana.

```js
router.getReady();
```

A co jeśli chcielibyśmy zatrzymać „nasłuchiwanie”? Jest to możliwe dzięki metodzie `stopReady()`. Wywołanie tej metody odblokowuje `addRoute()`, zatem będzie możliwe ponowne rejestrowanie ścieżek.

### Duplikacja adresów - jak się ustrzec błędów?

Co się stanie kiedy spróbujemy zarejestrować ścieżkę, która została już zarejestrowana wcześniej? Przyjrzyjmy się poniższemu przykładowi.

```js
    var path1, path2;

    path1 = router.addRoute('/hello-world.html',
        $.hashRouter.controller()
            .setEvent({
                action: function(container, properties) {
                    alert('hello world!');
                }
            })
    );
    path2 = router.addRoute('/hello-world.html',
        $.hashRouter.controller()
            .setEvent({
                action: function(container, properties) {
                    alert('hello NEW world!');
                }
            })
    );
```

Druga próba dodania tej samej ścieżki nie spowoduje jej unieważnienia i nie nadpisze kontrolera. Operacja nie wyświetli żadnego błędu. Wszytko wygląda pięknie ale w takim razie skąd mamy mieć pewność, że ścieżka została zarejestrowana? Nie na darmo w tym przykładzie użyto dwóch dodatkowych zmiennych `path1`, `path1`. Jeśli wszystko pójdzie zgodnie z planem metoda `addRoute()` zwróci referencje do kontrolera, natomiast jeśli napotka jakiś błąd np. ścieżka ma niewłaściwy format lub została zarejestrowana wcześniej zostanie zwrócona wartość `false`. Dzięki temu możemy w pewien sposób zapanować nad potencjalnymi pomyłkami jednak najlepszym pomysłem będzie trzymanie wszystkich ścieżek w jednym miejscu wewnątrz aplikacji, aniżeli rozsianie po różnych zakamarkach kodu.

## Ścieżki
Każda poprawna ścieżka powinna rozpoczynać się od znaku `/` i powinna składać się jedynie ze znaków alfanumerycznych, opcjonalnie rozdzielonych odpowiednimi separatorami. Ścieżki ponadto mogą zawierać parametry. Każdy parametr rozpoczyna się znakiem `%` a mała literka występująca tuż za nim oznacza typ parametru. Ścieżka to nic innego jak łańcuch znaków w pasku adresu, który występuje tuż za znakiem `#`, czyli jest to de facto pole `location.hash`.

### Parametry
Parametry ścieżki są to zmienne, odczytywane z pola `location.hash`. Jeśli ścieżka zawiera więcej niż jeden parametr to każdy z nich powinien być rozdzielony znakiem separatora.<br />
Router obsługuje następujące rodzaje parametrów:

- `%s`: łańcuch znaków
- `%u`: liczba naturalna
- `%d`: liczba całkowita
- `%f`: liczba rzeczywista ze znakiem `|` jako separator dziesiętny

#### Jak router interpretuje parametry?
Załóżmy że chcemy zrobić prostą ścieżkę z dwoma parametrami, w której pierwszy z nich będzie oznaczał ID artykułu a drugi nazwę artykułu.

```js
    router.addRoute('/%u,%s', $.hashRouter.controller());
```

Gdyśmy w pasku adresu przeglądarki wpisali `http://localhost/#/32,lorem-ipsum` router jako pierwszą zmienną przechwyci liczbę `32` a jako drugą łańcuch znaków `lorem-ipsum`. Należy pamiętać, że typ wartości ma znaczenie.<br /><br />
**Rozważmy taki przykład:**<br />
Wpisujemy do paska adresu url: `http://localhost/#/32,124` uprzednio rejestrując ścieżkę `/%u,%s`. Czy ścieżka zostanie dopasowana do wzorca?<br />
Odpowiedź brzmi: nie. Dlaczego? Ponieważ `/32,124` to nic innego jak `/%u,%u` a my zarejestrowaliśmy ścieżkę `/%u,%s`.

Jest jeszcze kilka zasad, o których warto pamiętać:

- %s-%s = %s
- %s_%s = %s
- %d%f%u = %u
- %u%s% = %s

### Separator grup
`/` - znak rozdzielający grupy parametrów.

**Przykład**

```
/lorem/%u,ipsum/%s
```

Ścieżka zostanie rozbita na:

1. lorem
2. %u,ipsum
3. %s

### Separatory parametrów
`,` `~` `:` `;` `.` - znaki rozdzielające parametry w grupie

**Przykład**

```
/blog/item;%u;%s/%u
```

W pierwszej kolejności ścieżka zostanie rozbita na grupy:

1. blog
2. item;%u;%s
3. %u

Następnie każda z grup zostanie rozbita na pojedyncze parametry:

1. {blog}
2. {item, %u, %s}
3. {%u}

### Separatory wyrazów
`-` `_` - znaki rozdzielające wyrazy w łańcuchach tekstowych, zastępują znak spacji.

**Przykład**

```
/title-page-example
```

Powyższa ścieżka zostanie zinterpretowana jako pojedynczy parametr `%s`.

### Separator dziesiętny
`|` - znak zastępuje kropkę w parametrach `%f`, ponieważ kropka jest zarezerwowana dla separatorów parametrów.

**Przykład**

```
/float-is,12|65
```

Router przechwyci wyrażenie `12|65` jako pojedynczy parametr `%f`. Wartość tego parametru wynosi `12.65`.

## Kontroler
Kontroler pełni rolę zarządcy naszej ścieżki. Kiedy w pasku adresu wpisujemy jakiś adres zawierający `#/` router próbuje go dopasować do którejś z zarejestrowanych ścieżek i jeśli mu się uda, wykonuje jakąś czynność. To co zostanie zrobione po wpisaniu adresu zależy właśnie od kontrolera.

W poprzednich przykładach używaliśmy obiektu `$.hashRouter.controller()` jako drugiego parametru metody `addRoute()`. <br />
W tym rozdziale zostaną omówione metody:

- controller.setEvent({Object} setup)
- controller.setResponse({Object} setup, {string} responseType)
- controller.addNavigation({Object} setup, {string} navType)

### setEvent
Metoda służy do definiowania zdarzeń. Jako argument przyjmuje obiekt zawierający pola: `action` `before` `after` `error`. Pola muszą być zdefiniowane jako funkcje. Jeśli pominiemy któreś z pól, zostanie ono utworzone automatycznie jako pusta funkcja: `function() {}`.

```js
$.hashRouter.controller()
    .setEvent({
        action: function(container, properties) {
            ...
        },
        before: function(container, properties) {
            ...
        },
        after: function(container, properties) {
            ...
        },
        error : function(e, container, properties) {
            ...
        }
    })
```

Do czego służą poszczególne funkcje zostanie wyjaśnione przy okazji omawiania metody `setResponse()`. Na razie skupmy się na argumentach funkcji.

`container` - jest to obiekt jQuery zawierający element drzewa DOM, do którego możemy np. załadować treść newsa.

`properties` - obiekt posiadający pola `args`: tablica parametrów odczytanych z adresu URL; `path`: przechwycona ścieżka; `pattern`:  dopasowanie do zarejestrowanej ścieżki.

`e` - obiekt zawierający komunikat błędu

### setResponse
Za pomocą tej metody definiujemy obiekt odpowiedzi. Co robi obiekt odpowiedzi? Jego zadaniem jest przygotowanie odpowiednich wartości w zależności od przechwyconych parametrów i wywołanie we właściwym czasie właściwych zdarzeń. Najprostsza odpowiedź nie robi prawie nic poza wywołaniem eventów w kolejności: `before`, `action`, `after` a w razie niepowodzenia `error`. Bardziej rozbudowany podtyp odpowiedzi, którym jest `AjaxResponse` ma za zadanie obsłużyć AJAX-owy request za pomocą wbudowanej w bibliotekę jQuery metody `ajax()`.

```js
$.hashRouter.controller()
    .setEvent()
    .setResponse({
        container: $('#myContainer')
    })
```

Na powyższym przykładzie ustawiliśmy w kontrolerze najprostszy typ odpowiedzi. Metoda przyjmuje jeden obiektowy parametr z polem `container`. Na zdefiniowanym kontenerze możemy potem operować wewnątrz każdego z eventów.

Bardziej zaawansowanym obiektem jest `AjaxResponse`.

```js
$.hashRouter.controller()
    .setEvent({
        action: function(container, properties, html) {
            container.html(html);
        }
    })
    .setResponse({
        container: $('#myContainer'),
        url: 'resources/ajax/demo-%u.html',
        loadingDelay: 200
    }, 'AjaxResponse'))
```

W tym przykładzie pojawił się drugi argument, który mówi że będziemy używali obiektu `AjaxResponse`. W pierwszym argumencie pojawiły się dodatkowe pola: `url` `loadingDelay`. Pierwsze to adres URL z jakiego będziemy otrzymywali odpowiedź serwera np. w formacie `html` albo `json`. Możemy ją potem przetworzyć wewnątrz eventu `action` i wczytać do naszego kontenera. Pole `loadingDelay` to opóźnienie ładowania, które możemy wykorzystać do zrobienia efektownego preloadera. W przykładzie nie zademonstrowano wszystkich możliwości tego obiektu. Poza `url` i `loadingDelay` można zdefiniować: `cache` `dataType` `contentType` `timeout` `type` `data`. W zasadzie `AjaxResponse` jest to nic innego jak nakładka na `jQuery.ajax()`. Warto odwiedzić witrynę [api.jquery.com](https://api.jquery.com/jQuery.ajax/) aby dowiedzieć się więcej na temat `jQuery.ajax()`.

Obiekt odpowiedzi został omówiony w dużym skrócie i żeby wykorzystać w 100% jego możliwości należałoby bardziej zagłębić się w eventy `before`, `after` i `error`. Jeśli ktoś miał wcześniej styczność z ajaxem w jQuery, nie powinien mieć problemów ze zrozumieniem przykładu.<br />
Zdarzenie `before` zostanie wywołane zanim `ajax()` wyśle żądanie do serwera. Zdarzenie `action` zostanie wywołane kiedy otrzymamy odpowiedź od serwera bez żadnych błędów. Zdarzenie `after` będzie obsłużone po zakończeniu żądania do serwera natomiast `error` kiedy serwer zwróci błąd np. 404 not found.<br />
Warto również przeanalizować kod w plikach [example.js](example.js) i [example.html](example.html).

### addNavigation
Załóżmy, że na stronie istnieje pewien kontener zawierający listę odnośników tekstowych tworzących nawigację. Ważne jest aby nawigacja była dostępna dla wszystkich w tym użytkowników z wyłączoną obsługą JavaScript. Gdybyśmy stworzyli aplikacje ajaxową, w której wszystkie elementy w tym nawigacja są tworzone dynamiczne za pomocą skryptów, uniemożliwilibyśmy tym samym dostęp do poszczególnych sekcji serwisu dla niektórych użytkowników oraz botów indeksujących.<br />
Jednym ze sposobów rozwiązania tego problemu jest stworzenie w pierwszej kolejności klasycznej wersji strony a dopiero potem przystosowanie jej do technologii AJAX. Po pierwsze strona jest wtedy dostępna dla wszystkich, a po drugie oddzielimy warstwę logiki od prezentacji.

`addNavigation` dodaje do kontrolera obiekt obsługujący nawigację na stronie. Kontroler może posiadać dowolną ilość takich obiektów.<br />
Obiekt nawigacji ma za zadanie przykrycia istniejących na stronie odnośników nowymi odnośnikami, które będą przechwytywane poprzez nasz mechanizm routingu, dzięki czemu będziemy mogli w nieinwazyjny sposób zamienić naszą nudną statyczną witrynę w interaktywną aplikację.

**Przykład**

```html
<ul id="navigation">
    <li><a href="page1.html" data-params="1">Page 1</a></li>
    <li><a href="page2.html" data-params="2">Page 2</a></li>
    <li><a href="page3.html" data-params="3">Page 3</a></li>
    <li><a href="page4.html" data-params="4">Page 4</a></li>
</ul>
```

```js
router.addRoute('/page,%u.html',
    $.hashRouter.controller()
        .setEvent()
        .setResponse()
        .addNavigation({
            container: $('#navigation'),
            itemsQuery: 'a',
            eventName: 'click'
        })
);
```

W przykładzie jako argument metody `addNavigation()` przekazaliśmy trz pola:

- `container`: kontener, w którym umieściliśmy odnośniki
- `itemsQuery`: zapytanie wyszukujące odnośniki w kontenerze - w tym przypadku będziemy szukać znaczników `<a>`
- `eventName`: nazwa zdarzenia - w tym przypadku kliknięcie spowoduje zmianę wartości pola `location.hash` na `/page,%u.html`, gdzie `%u` zostanie zamienione na wartość atrybutu `data-params`

Znaczniki `<a>` zawierają atrybut `data-params`, który określa wartości parametrów ścieżki. W przykładzie mamy tylko jeden parametr `%u` jednak możemy zdefiniować dowolną ilość parametrów. Wtedy kolejne wartości rozdzielamy znakiem `/` np. `data-params="54/page-title/html"`.

`addNavigation` obsługuje jeszcze jedno pole o nazwie `onEvent`, które domyślnie jest zdefiniowane następująco:

```js
onEvent: function (params, container, item) {
    location.hash = $.sprintf.apply(null, $.merge([this.getPath()], params));
}               
```
 