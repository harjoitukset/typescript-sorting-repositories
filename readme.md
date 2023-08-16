# TypeScript: repositorioiden suodattaminen ja lajittelu

Tämän tehtävän tarkoituksena on harjoitella sisäkkäisistä tietorakenteista koostuvan aineiston suodattamista sekä lajittelua tiettyjen ehtojen mukaisesti.

Aineistona käytämme [GitHubin REST-rajapintaa](https://docs.github.com/en/rest) ja sen kautta saatavia tietoja eri repositorioista. [GitHubin rajapinnat](https://docs.github.com/en/rest) mahdollistavat lähes kaikkien GitHubin käyttöön liittyvien operaatioiden suorittamisen ohjelmallisesti. Merkittävä osa operaatioista edellyttää autentikaatioita, mutta tällä kertaa käytämme yksinkertaisuuden vuoksi vain kaikille avointa rajapintaa.

💡 *GitHub tarjoaa rajapintojen käyttämiseksi valmiin [octokit.js](https://github.com/octokit/octokit.js)-kirjaston, jonka käyttäminen olisi todennäköisesti kannattavaa oikeassa sovelluksessa. Tämän tehtävän kannalta on kuitenkin tarkoituksenmukaista käyttää `fetch`-kirjastoa ja määritellä tarvittavat tyypit itse.*


## GitHub classroom

Tehtävä arvostellaan käyttäen [GitHub classroom](https://classroom.github.com/) -palvelua, joka suorittaa ohjelmasi ja tarkastaa sekä pisteyttää tulokset automaattisesti. Taustalla GitHub classroom hyödyntää [GitHub actions](https://github.com/features/actions) -nimistä jatkuvan integroinnin palvelua, johon tutustumme kurssilla lisää myöhemmillä viikoilla.

Voit tarvittaessa lähettää tehtävän tarkastettavaksi monta kertaa. Tee tällöin uusi commit ja vie (push) muutokset GitHubiin. Varmista kuitenkin, että viimeisin tekemäsi commit tuottaa parhaat pisteet.

Kun olet hyväksynyt tehtävän GitHub classroomissa ja saanut repositoriosta henkilökohtaisen kopion, kloonaa se itsellesi `git clone` -komennolla. Siirry sen jälkeen VS Codeen editoimaan tiedostoja.

Kloonatessasi repositoriota **varmista, että Git-osoitteen lopussa on oma GitHub-käyttäjänimesi**. Jos käyttäjänimesi puuttuu osoitteesta, kyseessä ei ole henkilökohtainen kopiosi tehtävästä. Luo tässä tapauksessa oma classroom-kopio tehtävästä itsellesi Teams-tehtävästä löytyvän linkin avulla.

💡 *Automaattisen arvioinnin vuoksi et saa muuttaa annettujen tiedostojen ja funktioiden nimiä, etkä parametrien ja paluuarvojen tyyppejä.*


## Riippuvuuksien asentaminen

Aloita asentamalla projektin riippuvuudet, jotka on määritelty `package.json`-tiedostossa:

```sh
$ npm install
```

Riippuvuudet sisältävät sekä [TypeScript-kielen](https://www.npmjs.com/package/typescript), [Jest-testaustyökalun](https://www.npmjs.com/package/jest) että [`ts-node`](https://www.npmjs.com/package/ts-node)- ja [`ts-jest`](https://www.npmjs.com/package/ts-jest)-paketit TypeScript-kielisen koodin ja testien suorittamiseksi Node.js:llä.

Lisäksi riippuvuuksista löytyy [`node-fetch`](https://www.npmjs.com/package/node-fetch), joka mahdollistaa selaimista tutun `fetch`-funktion hyödyntämisen REST-rajapinnan kutsumiseksi. Node.js sinulta tulee löytyä valmiina.

💡 *Node.js:n [versiosta 18 alkaen](https://nodejs.org/dist/latest/docs/api/globals.html#fetch) `fetch`-funktio kuuluu osaksi standardikirjastoa, eikä vaadi enää erillistä asennusta.*


## Käytettävä tietoaineisto

[GitHubin repositories-rajapinta](https://docs.github.com/en/rest/repos/repos) on GitHubin avoin REST-rajapinta repositorioihin liittyvien operaatioiden suorittamiseksi.

Rajapinnan dokumentaatio löytyy osoitteesta https://docs.github.com/en/rest/repos/repos. Kyseisessä osoitteessa on dokumentoituna esimerkkeineen eri URL-osoitteet, niiden tukemat parametrit ja palautettavien JSON-tietueiden formaatti. Tässä tehtävässä haemme listauksen [yksittäisen organisaation julkisista repositorioista](https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-organization-repositories). Aineiston hakua ei tarvitse toteuttaa itse, vaan selöytyy valmiina [src/client.ts](./src/client.ts)-tiedostosta. Repositorioiden hakeminen organisaation nimellä onnistuu esimerkiksi seuraavasti:

```ts
import { Repository } from "./types/Repository";
import { getRepositories } from "./client";

async function example() {
    let fb: Repository[] = await getRepositories("facebook");
    let ms: Repository[] = await getRepositories("microsoft");
    let google: Repository[] = await getRepositories("google");

    // ...
}
```

Karkeasti supistettuna rajapinnasta saatu vastaus voi näyttää esimerkiksi seuraavalta:

```json
[
  {
    "id": 10270250,
    "name": "react",
    "full_name": "facebook/react",
    "private": false,
    "owner": {
      "login": "facebook",
      "id": 69631
    },
    "html_url": "https://github.com/facebook/react",
    "description": "The library for web and native user interfaces",
    "url": "https://api.github.com/repos/facebook/react",
    "created_at": "2013-05-24T16:15:54Z",
    "updated_at": "2023-08-16T11:19:04Z",
    "pushed_at": "2023-08-16T01:21:01Z",
    "git_url": "git://github.com/facebook/react.git",
    "homepage": "https://react.dev",
    "watchers_count": 211807,
    "language": "JavaScript",
    "archived": false
  }
]
```

Voit kokeilla rajapintaa selaimella esim. osoitteessa https://api.github.com/orgs/python/repos?per_page=100.

Yllä esitetystä tietorakenteesta on jätetty yksinkertaisuuden vuoksi pois suuri osa attribuuteista. Tehtävässä yksittäistä repositoriota vastaava yksinkertaistettu tyyppi on valmiiksi määritettynä [src/types/Repository.ts](./src/types/Repository.ts)-tiedostossa. Tietojen haku on puolestaan toteutettu [src/client.ts](./src/client.ts)-tiedostoon. Näitä tiedostoja ei tarvitse muokata ja niiden muokkaaminen saattaa aiheuttaa virheitä tehtävän tarkastuksessa, ellet päivitä myös testejä vastaamaan muutoksiasi.


## Ohjelman suorittaminen

Tehtävän yksinkertainen tekstikäyttöliittymä on toteutettu valmiiksi [`src/index.ts`-tiedostossa](./src/index.ts). Käyttöliittymän on tarkoitus hakea listaus parametrina annetun organisaation repositorioista ja tulostaa repositoriot annetussa järjestyksessä niiden seuraajien määrän (`watchers_count`) mukaan. Arkistoidut repositoriot (`archived`) tulee jättää tulostamatta.

Ohjelma voidaan suorittaa `ts-node`-työkalulla seuraavasti:

```sh
$ npx ts-node src/index.ts facebook
# listaa repositoriot organisaatiolle "facebook"
```

Mikäli ohjelma järjestää repositoriot oikein ja suodattaa arkistoidut pois, on sen tuloste muodoltaan seuraava:

```md
# Repositories for facebook

* react
  * ⭐ 211821
  * The library for web and native user interfaces
  * JavaScript

* react-native
  * ⭐ 111264
  * A framework for building native applications using React
  * Java
...
```

Tuloste imitoi [markdown](https://en.wikipedia.org/wiki/Markdown)-syntaksia, joskin tehtävän kannalta tulosteella ei ole juuri merkitystä. Annettu valmis koodi huolehtii repositorioiden perustietojen tulostamisesta, mutta **ne ovat satunnaisessa järjestyksessä** ja **arkistoituja repositorioita ei ole suodatettu**.

Kutsut repositorioiden suodattamiseksi ja lajittelemiseksi ovat valmiiksi paikoillaan [src/index.ts](./src/index.ts)-tiedostossa, mutta sinun tehtäväsi on toteuttaa varsinainen logiikka aineiston [suodattamiseksi](./src/filtering.ts) ja [lajittelemiseksi](./src/sorting.ts).

💡 *Koska edellä esitetty käynnistyskomento on määritetty myös [package.json](./package.json)-tiedoston scripts-lohkoon, voidaan ohjelma suorittaa myös vaihtoehtoisesti komennolla `npm start [organisaatio]`.*


## Osa 1: aineiston suodattaminen (2 pistettä)

Tiedostossa [src/filtering.ts](./src/filtering.ts) on määriteltynä seuraava funktio:

```ts
/**
 * Returns a new array of Repositories that only contains those that
 * have not been archived.
 */
export function filterActiveRepositories(repositories: Repository[]): Repository[] {
    // ...
}
```

Tehtäväsi on toteuttaa tähän ☝ funktioon toimintalogiikka, joka suodattaa annetuista repositorioista aktiiviset, eli ne, joita ei ole arkistoitu.

Voit ajaa vain [suodattamista koskevat testit](./src/filtering.test.ts) seuraavalla komennolla:

```sh
$ npm test src/filtering.test.ts
```

Testien kuvaukset voivat auttaa hahmottamaan, minkälaisia tapauksia logiikassa tulee ottaa huomioon:

```
 PASS  src/filtering.test.ts
  filtering archived repositories
    ✓ archived repositories are excluded
    ✓ active repositories are included in array
    ✓ function does not modify the given array
```


## Osa 2: repositorioiden lajittelu (3 pistettä)

Tehtävän toisessa osassa sinun tulee **järjestää** eli **lajitella** repositoriot niiden seuraajien mukaan käyttäen **itse toteuttamaasi lajittelualgoritmia**.

> *"Some examples where you can find direct application of sorting techniques include: Sorting by price, popularity etc in e-commerce websites"*
>
> [The Ohio State University. 7 algorithms and data structures every programmer must know](https://u.osu.edu/cstutorials/2016/11/21/7-algorithms-and-data-structures-every-programmer-must-know/)

Tiedostossa [src/sorting.ts](./src/sorting.ts) on määriteltynä seuraava funktio:

```ts
/**
 * Returns a **new** array, where all Repositories from
 * the given array are sorted by their `watchers_count`.
 *
 * Caller can specify to sort the watchers in ascending
 * order (low to high) or descending order (from high to low).
 *
 * @param repositories to use in sorting
 * @param order either ascending ("asc") or descending ("desc") order.
 */
export function sortByWatchers(repos: Repository[], order: "asc" | "desc"): Repository[] {
  // ...
}
```

💡 *Huomaa, että `order`-parametrissa on hyödynnetty [TypeScriptin vakioiden yhdistämistä](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types). Tyyppijärjestelmä sallii siten vain arvot `"asc"` tai `"desc"`, eikä mitään muita merkkijonoja.*

Toteuta lajittelulogiikkasi yllä esitettyyn funktioon siten, että funktio palauttaa lopuksi **uuden** taulukon, joka on lajiteltu `watchers_count`-arvon mukaan joko laskevassa tai nousevassa järjestyksessä. Voit halutessasi toteuttaa myös erillisiä apufunktioita.

Huomaa, että koodisi tulee lajitella **annettuja repositorio-objekteja**, eli et voi poimia aineistosta esimerkiksi pelkkiä nimiä ja seuraajien määriä ja lajitella niitä.

👮‍♀️🚨 **Tämän harjoituksen tavoitteena on opetella itse toteuttamaan jokin tunnettu lajittelualgoritmi, joten JavaScriptin valmiin `Array.sort`-funktion käyttämistä ei sallita.** 🚨👮‍♀️

Voit ajaa vain [lajittelua koskevat testit](./src/sorting.test.ts) seuraavalla komennolla:

```sh
$ npm test src/sorting.test.ts
```

Testien kuvaukset voivat auttaa hahmottamaan, minkälaisia tapauksia logiikassa tulee ottaa huomioon:

```
 PASS  src/sorting.test.ts
  sorting repositories by watchers count
    ✓ repos can be sorted in ascending order
    ✓ repos can be sorted in descending order
    ✓ sorting an empty array should not throw exceptions
    ✓ sorting should not modify the original array
    ✓ sorting is not allowed to utilize Array.sort
```

💡 *Jos kahdella repositoriolla on tasan sama määrä seuraajia, ei niiden keskinäisellä järjestyksellä ole merkitystä.*


### Yleisimmät lajittelualgoritmit

Voit valita toteutettavan lajittelualgoritmin esimerkiksi seuraavista:

**Lisäyslajittelu eli Insertion Sort**

[https://en.wikipedia.org/wiki/Insertion_sort](https://en.wikipedia.org/wiki/Insertion_sort)

<a title="Simpsons contributor / CC BY-SA (https://creativecommons.org/licenses/by-sa/3.0)" href="https://commons.wikimedia.org/wiki/File:Insertion_sort.gif"><img height="256" alt="Insertion sort" src="https://upload.wikimedia.org/wikipedia/commons/4/42/Insertion_sort.gif"></a>

*Kuva: By Simpsons contributor - Own work, CC BY-SA 3.0, [https://commons.wikimedia.org/w/index.php?curid=17512147](https://commons.wikimedia.org/w/index.php?curid=17512147)*

**Lomituslajittelu eli Merge Sort**

[https://en.wikipedia.org/wiki/Merge_sort](https://en.wikipedia.org/wiki/Merge_sort)

<a title="Swfung8 / CC BY-SA (https://creativecommons.org/licenses/by-sa/3.0)" href="https://commons.wikimedia.org/wiki/File:Merge-sort-example-300px.gif"><img width="256" alt="Merge-sort-example-300px" src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Merge-sort-example-300px.gif" style="border solid silver 1px;"></a>

*Kuva: By Swfung8 - Own work, CC BY-SA 3.0, [https://commons.wikimedia.org/w/index.php?curid=14961648](https://commons.wikimedia.org/w/index.php?curid=14961648)*

**Kuplalajittelu eli Bubble Sort**

[https://en.wikipedia.org/wiki/Bubble_sort](https://en.wikipedia.org/wiki/Bubble_sort)

<a href="https://commons.wikimedia.org/wiki/File:Bubble-sort-example-300px.gif#/media/File:Bubble-sort-example-300px.gif" title="By Swfung8 - Own work, CC BY-SA 3.0, https://commons.wikimedia.org/w/index.php?curid=14953478"><img src="https://upload.wikimedia.org/wikipedia/commons/c/c8/Bubble-sort-example-300px.gif" alt="Bubble-sort-example-300px.gif" width="256" style="border solid silver 1px;"></a>

*Kuva: By Swfung8 - Own work, CC BY-SA 3.0, [https://commons.wikimedia.org/w/index.php?curid=14953478](https://commons.wikimedia.org/w/index.php?curid=14953478)*

**Pikalajittelu eli Quicksort**

[https://en.wikipedia.org/wiki/Quicksort](https://en.wikipedia.org/wiki/Quicksort)

<a href="https://commons.wikimedia.org/wiki/File:Sorting_quicksort_anim.gif#/media/File:Sorting_quicksort_anim.gif" title="By en:User:RolandH, CC BY-SA 3.0, https://commons.wikimedia.org/w/index.php?curid=1965827"><img src="https://upload.wikimedia.org/wikipedia/commons/6/6a/Sorting_quicksort_anim.gif" alt="Sorting quicksort anim.gif" width="256" style="border solid silver 1px;"></a>

*Kuva: By en:User:RolandH, CC BY-SA 3.0, [https://commons.wikimedia.org/w/index.php?curid=1965827](https://commons.wikimedia.org/w/index.php?curid=1965827)*


### Algoritmin valintaperusteet

Voit valita itsellesi mieluisen algoritmin esimerkiksi tutustumalla ensin niiden tehokkuuteen. Voit myös hyvin valita sen, joka vaikuttaa toteutukseltaan sopivan yksinkertaiselta. Muista myös, että voit kysyä Teamsissa neuvoa mihin vain tehtävässä kohtaamaasi haasteeseen liittyen. Todennäköisesti samojen haasteiden parissa kamppailee myös moni muu kurssilainen.

Arvioi lopuksi tehtävää ratkaistessasi lajitteluun kuluvaa aikaa. Miten esimerkiksi aineiston koon kaksinkertaistaminen vaikuttaisi ohjelmasi suoritusaikaan? Kirjoita yhden virkkeen pituinen arvio suorituskyvystä funktiosi yhteyteen kommenttina.

**Huom!** Oikeassa ohjelmistoprojektissa käyttäisit JavaScriptin `Array.sort`-funktiota ja antaisit sille parametrina kahta repositoriota vertailevan vertailufunktion. Voit tutustua aiheeseen esim. [mdn web docs -sivustolla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort). Tässä tehtävässä kuitenkin harjoitellaan algoritmin toteutusta, joten kirjoitamme lajittelun itse.


## Tehtävän testaaminen

Tehtävän yksikkötestit suoritetaan [Jest-työkalun](https://jestjs.io/) avulla komennolla `npm test`:

```sh
$ npm test          # sama kuin `npx jest --verbose --coverage`
```

Varsinaiset testit löytyvät tiedostoista [src/filtering.test.ts](./src/filtering.test.ts) ja [src/sorting.test.ts](./src/sorting.test.ts). Voit halutessasi perehtyä testien sisältöön, mutta se ei ole tehtävän ratkaisemiseksi välttämätöntä.


----

## Lisenssit ja tekijänoikeudet

Tämän oppimateriaalin on kehittänyt Teemu Havulinna ja se on lisensoitu [Creative Commons BY-NC-SA -lisenssillä](https://creativecommons.org/licenses/by-nc-sa/4.0/).


## The GitHub terms of service

Tehtävässä hyödynnetään GitHubin avointa rajapintaa repositorioiden nimien listaamiseksi. Käytettyä dataa sekä GitHubin rajapintaa koskee [GitHubin käyttöehdot](https://docs.github.com/en/site-policy/github-terms/github-terms-of-service).

> *"Abuse or excessively frequent requests to GitHub via the API may result in the temporary or permanent suspension of your Account's access to the API. GitHub, in our sole discretion, will determine abuse or excessive usage of the API. We will make a reasonable attempt to warn you via email prior to suspension."*
>
> https://docs.github.com/en/site-policy/github-terms/github-terms-of-service#h-api-terms
