/* AUTHOR : JACK Langer
 * 
 * 
 * Do not Copy Code without permission
 *performance is really bad when you get all countrys once the data fills the form properly i will work on performance. 
 * 
 * */

function filterCountries() {
    getCountryURL()
        .then(getCountries)
        .then(data => {
            console.log(data);
        });
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

        $('#countries').empty();
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
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                fetchExchangeRate().then(currencyData => {
                    //specific country data as well as currencie data build the currency ui here! 

                    console.log(currencyData);
                    for (var key in data) {
                        //pass both data sets to the UI builder
                        buildUiCountries(data[key], currencyData);
                        //console.log(data);
                    }
                });
                resolve(data);
            });
    });
}

/**
 * 
 * 
 * take the currency code and fetch currency exchange rate based on the Eur
 * @param {any} currencieCode
 * 
 * 
 */

function fetchExchangeRate() {

    return new Promise((resolve, reject) => {
        var currencyUrlBase = 'https://api.exchangeratesapi.io/latest?base=EUR';

        fetch(currencyUrlBase)
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
    }
    );
}


/**
 * 
 * 
 * generate the html for each country and populate with appropriate data
 * @param {any} country
 * 
 * 
 */
function buildUiCountries(country, currencyData) {

    // create elements


    let languages = '';
    let currencies = '';
    let currencieCodes = '';
    let exchangeRate = currencyData.rates;
    //let EuroRate = exchangeRate[country.currencies[0].code];

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
    let exchangeRateParagraph = document.createElement("p");

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
    exchangeRateParagraph.className = "exchange-rate";

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
    customExchangeRateDiv.appendChild(exchangeRateParagraph);


    for (let i = 0; i < country.currencies.length; i++) {
        let EuroRate = exchangeRate[country.currencies[i].code];
        let exchangeRateParagraph = document.createElement("p");

        if (EuroRate !== undefined) {
            exchangeRateParagraph.innerText = currencyData.base + "/" + country.currencies[i].code + " " + EuroRate;
        }
        else if (currencieCodes === "EUR") {
            exchangeRateParagraph.innerText = currencyData.base + "/" + country.currencies[i].code + " " + 1;
        }
        else {
            exchangeRateParagraph.innerText = "sorry there is no data for " + currencyData.base + "/" + country.currencies[i].code;
        }

        customExchangeRateDiv.appendChild(exchangeRateParagraph);
    }
}