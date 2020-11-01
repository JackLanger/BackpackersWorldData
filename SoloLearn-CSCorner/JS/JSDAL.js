/* AUTHOR : JACK Langer
 * 
 * 
 * Do not Copy Code without permission
 *performance is really bad when you get all countrys once the data fills the form properly i will work on performance. 
 * 
 * */

window.onload = getCountries('https://restcountries.eu/rest/v2/all');

function filterCountries() {
    getCountryURL()
    .then(getCountries)
}

/**
 *
 * Get the user input from the search field and create the url for the getCountry Method
 * 
 * */
function getCountryURL() {

    let baseLink = 'https://restcountries.eu/rest/v2/name/';
    let output = 'https://restcountries.eu/rest/v2/all';
    let input = $('#country_name').val();

    return new Promise((resolve, reject) => {

        if (input === "" || input === "undefined") {
            output = 'https://restcountries.eu/rest/v2/all';
        }
        else {
            output = baseLink + input;
        }

        $('#country_name').val('');
        resolve(output);
    });
}

/**
 *  
 * 
 * use the param passed by getCountryUrl to fetch countrys and prepare them for the screen output. prepare data for further work.
 *  
 * 
 * @param {any} url
 */

function getCountries(url) {

    //clear content
    $('#countries').empty();

    //if the url gets back all build flags else get detail view

    if (url == 'https://restcountries.eu/rest/v2/all') {
        fetch(url).then(response => response.json()).then(data => {
            for (var key in data) {
                buildUiBase(data[key]);
            }
        })
    }
    else
    {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            let eur = fetchExchangeRate('EUR');
            let usd = fetchExchangeRate('USD');
            let gbp = fetchExchangeRate('GBP');

            Promise.all([eur,usd,gbp])
                .then(([eurData, usdData, gbpData]) => {
                //specific country data as well as currencie data build the currency ui here! 
                for (var key in data) {
                    //pass both data sets to the UI builder
                    buildUiCountries(data[key], eurData, usdData, gbpData);
                }
            });
        });
    };
}



/**
 * 
 * 
 * take the currency code and fetch currency exchange rate based on the Eur
 * @param {any} currencyCode
 * 
 * 
 */

function fetchExchangeRate(currencyCode) {

    return new Promise((resolve, reject) => {
        var currencyUrlBase = 'https://api.exchangeratesapi.io/latest?base=';
        var fullUrl = currencyUrlBase + currencyCode;

    fetch(fullUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error("currency not found");
            }
        })
        .then(data => {
            resolve(data);
        })
        .catch(err => console.log(err));
    });
}


/**
 * 
 * 
 * generate the html for each country and populate with appropriate data
 * @param {any} country
 * 
 * 
 */
function buildUiCountries(country,eur,usd,gbp) {

    // create elements   

    let languages = '';
    let currencies = '';
    let currencieCodes = '';
    let exchangeRateEUR = eur.rates;
    let exchangeRateUSD = usd.rates;
    let exchangeRateGBP = gbp.rates;

    for (let i = 0; i < country.languages.length; i++) {
        if (i === 0) {
            languages += country.languages[i].name;
        }
        else {
            languages += ", " + country.languages[i].name;
        }
    }
    for (let i = 0; i < country.currencies.length; i++) {
        if (i === 0) {
            currencieCodes += country.currencies[i].code;
        }
        else {
            currencieCodes += ", " + country.currencies[i].code;
        }
    }
    for (let i = 0; i < country.currencies.length; i++) {
        if (i === 0) {
            currencies += country.currencies[i].name;
        }
        else {
            currencies += ", " + country.currencies[i].name;
        }
    }

    //divs

    let countryDiv = document.getElementById('countries');
    let customExchangeRateDiv = document.createElement("div");
    let flagContainer = document.createElement("div");
    let customElement = document.createElement("div");
    let contentContainer = document.createElement("div");

    //headings

    let name = document.createElement("h1");
    let exchangeRateHeading = document.createElement("h2");

    //paragraphs

    let region = document.createElement("p");
    let subRegion = document.createElement("p");
    let capital = document.createElement("p");
    let timezone = document.createElement("p");
    let language = document.createElement("p");
    let population = document.createElement("p");
    let currency = document.createElement("p");
    let currencyCode = document.createElement("p");

    //img

    let flag = document.createElement("img");

    // everything else

    let breaks = document.createElement("br");

    //divs

    customElement.className = "country-container";
    customExchangeRateDiv.className = "exchange-rate-container";
    flagContainer.className = "country-flag-container";
    contentContainer.className = "country-content-container";

    //headings

    name.className = "c-name";
    exchangeRateHeading.className = "exchange-rate-heading";

    //paragraphs

    region.className = "c-region";
    subRegion.className = "c-Region";
    population.className = "c-Region";
    capital.className = "c-capital";
    timezone.className = "c-timezone";
    language.className = "c-language";
    currency.className = "c-currency";
    currencyCode.className = "c-code";

    //img

    flag.className = "country-flag";
    flag.src = country.flag;

    // asign values

    name.innerText = country.name;
    region.innerText = "Region: " + country.region;
    subRegion.innerText = "Subregion: " + country.subregion;
    capital.innerText = "Capital: " + country.capital;
    capital.innerText = "Population: " + country.population.toLocaleString();
    timezone.innerText = "Timezone: " + country.timezones;
    language.innerText = "Language: " + languages;
    currency.innerText = "Currency: " + currencies;
    currencyCode.innerText = "Currency Code: " + currencieCodes;
    exchangeRateHeading.innerText = "Exchangerates";

    // add elements to view

    countryDiv.appendChild(customElement);
    //headline
    customElement.appendChild(name);
    //flag
    customElement.appendChild(flagContainer);
    flagContainer.appendChild(flag);
    //content
    customElement.appendChild(contentContainer);
    contentContainer.appendChild(region);
    contentContainer.appendChild(subRegion);
    contentContainer.appendChild(capital);
    contentContainer.appendChild(timezone);
    contentContainer.appendChild(language);
    contentContainer.appendChild(currency);
    contentContainer.appendChild(currencyCode);
    contentContainer.appendChild(exchangeRateHeading);
    contentContainer.appendChild(customExchangeRateDiv);

    //create the exchange rates

    createExParagraph(country, eur, customExchangeRateDiv);
    createExParagraph(country, usd, customExchangeRateDiv);
    createExParagraph(country, gbp, customExchangeRateDiv);
}
/**
 * 
 * build flag buttons for UI 
 * TODO: link Flagicons to filter using the country name
 * @param {any} country
 */

function buildUiBase(country) {

    //divs
    let countryDiv = document.getElementById('countries');
    let flagContainer = document.createElement("div");
    let customElement = document.createElement("div");
    //heads
    let name = document.createElement("h1");
    //paragraphs
    let region = document.createElement("p");

    name.className = "base-name";
    region.className = "base-region";
    flagContainer.className = "base-flag";
    customElement.className = "base-custom";

    //assign data
    name.innerText = country.name;
    region.innerText = "Region: " + country.region;
    flagContainer.style.backgroundImage = "url(" + country.flag + ")";
    flagContainer.style.cursor = "pointer";





    // subscribe clickevent to flag

    flagContainer.addEventListener('click', event => {
        let baseURL = 'https://restcountries.eu/rest/v2/name/';
        let url = baseURL + country.name;

        getCountries(url);
    });

    // build flag 

    countryDiv.appendChild(flagContainer);
    //flagContainer.appendChild(customElement);
    flagContainer.appendChild(name);
    //flagContainer.appendChild(region);
}

/**
 * Create paragraphs with data based on the currency passed into, 
 * the country is for picking the right data set as well as canceling the function if the currency base equals the currency 
 * 
 * @param {any} country
 * @param {any} currency
 * @param {any} div
 */

function createExParagraph(country, currency, div ) {

    let p = document.createElement("p");
    p.className = "exchange-rate";

    let base = currency.base;
    let arr = country.currencies;
    let rates = currency.rates;

    for (let i = 0; i < arr.length; i++) {
        let code = arr[i].code;
        let rate = rates[code];

        if (base === code) {
            return;
        }
        else if (rate === undefined) {
            div.appendChild(p);
            p.innerText = "sorry there is no data for " + base + "/" + code;
        }
        else {
            div.appendChild(p);
            p.innerText = base + "/" + code + " " + rate;
        }
    }
}