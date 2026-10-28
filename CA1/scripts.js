//EVENT LISTENER FOR THE CLOTHES SHOP SEARCH FORM
const searchForm = document.getElementById("chothes-form"); // Get the search form element by its ID

if (searchForm) { // Check if the search form exists on the page, preventing errors on pages where it doesn't exist
    searchForm.addEventListener("submit", function(event) { // Add an event listener for the form submission
        event.preventDefault(); // Prevent the default form submission behavior
        searchProducts("products.xml"); 
    });
}

//EVENT LISTENER FOR THE WEATHER APP SEARCH FORM
const weatherForm = document.getElementById("weather-form"); 
if (weatherForm) {
    weatherForm.addEventListener("submit", function(event) { 
        event.preventDefault(); 
        const location = document.getElementById("search-input").value; 
        searchWeather(location); 
    });
}

//FUNCTION TO SEARCH FOR PRODUCTS IN THE XML FILE
async function searchProducts(url) {
    const productList = document.getElementById("product-list"); // Get the product list container by its ID
    productList.classList.remove('has-products'); // Add the class to the product list container
    productList.innerHTML = ""; // Remove the existing product list if it exists

    try{
        const inputValue = document.getElementById("search-input").value; //Get the value from the input field

        if(!validateInput(inputValue)){ //Check if input is valid, if not trown an error and break process
           return productList.innerHTML =
               "<p>Invalid code format, please try again.</p>" +
               "<p>Valid codes are: 101-01, 101-02, 101-03, 101-04, " +
               "201-01, 201-02, 201-03, 201-04, 301-01, 301-02, " +
               "301-03, 301-04</p>"; //Stops loadData()
        }

        const response = await fetch(url); 

        if(!response.ok){ //check the response from fecth the xml
            throw new Error("HTTP" + response.status);
        }

        const text = await response.text();
        const xmlData = new DOMParser().parseFromString(text, "text/xml"); //parse the xml data into a DOM object

        const products = xmlData.getElementsByTagName("product") //get all the products from the xml file

        let matchingProduct = null; 
        
        for(const product of products){ //check if the codeInput matches with any one of the projects 
            const productCode = product.getElementsByTagName("code")[0].textContent;

            if(productCode === inputValue){ 
                matchingProduct = product; //add the matching product to the machingProduct varible, in order to be used after
                break;
            }
        }

        if(!matchingProduct){ //return an error in case of no matching code
            productList.innerHTML =
                "<p>Code doesn't exist, please try again.</p>" +
                "<p>Valid codes are: 101-01, 101-02, 101-03, 101-04, " +
                "201-01, 201-02, 201-03, 201-04, 301-01, 301-02, " +
                "301-03, 301-04</p>";
            return;
        }

        createProduct(matchingProduct); //create the product list

    }catch(error){ //catch any error that might occur during the fetch or parsing process
        productList.innerHTML = "<p>Could not load items: " + error.message + "</p>";
    }
 
    function createProduct(matchingProduct){
        productList.classList.add('has-products'); // Add the class to the product list container for styling purposes

        //image
        const img = document.createElement('img');  
        img.src = matchingProduct.getElementsByTagName("imagePath")[0].textContent;
        img.alt = matchingProduct.getElementsByTagName("name")[0].textContent;
        img.classList.add('img-fluid', 'rounded-4'); // Add a class for styling usinhg bootstrap
        img.id = 'product-image'; // Add an ID for styling purposes
        productList.appendChild(img);

        //information div 
        const productInfo = document.createElement('div');
        productInfo.classList.add('product-info');

        //name
        const h2 = document.createElement('h2');
        h2.textContent = matchingProduct.getElementsByTagName("name")[0].textContent;
        productInfo.appendChild(h2);

        //category and code 
        const pCategoryAndCOde = document.createElement('p');
        pCategoryAndCOde.classList.add('category-code');
        pCategoryAndCOde.textContent = matchingProduct.getElementsByTagName("category")[0].textContent + " | " + matchingProduct.getElementsByTagName("code")[0].textContent;
        productInfo.appendChild(pCategoryAndCOde);

        //price
        const pPrice = document.createElement('p');
        pPrice.classList.add('price');
        pPrice.textContent = "€" + matchingProduct.getElementsByTagName("unitPrice")[0].textContent;
        productInfo.appendChild(pPrice);

        //description
        const pDescription = document.createElement('p');
        pDescription.classList.add('description');
        pDescription.textContent = matchingProduct.getElementsByTagName("description")[0].textContent;
        productInfo.appendChild(pDescription);

        //quantity
        const pQuantity = document.createElement('p');
        pQuantity.classList.add('quantity');
        pQuantity.textContent = "Stock: " + matchingProduct.getElementsByTagName("quantity")[0].textContent;
        productInfo.appendChild(pQuantity);

        productList.appendChild(productInfo); // Append the product info div to the product list
    }
    
    function validateInput(value){ // Validate the input value using a regular expression
            const pattern = /^[0-9]{3}-[0-9]{2}$/; // Regular expression pattern for the format "XXX-XX" where X is a digit
            return pattern.test(value); // Test the input value against the pattern and return true if it matches, false otherwise
    }
}

//FUNCTION TO SEARCH FOR WEATHER USING THE WEATHER API
async function searchWeather(location) {
    const weatherResults = document.getElementById('weather-results');
    weatherResults.innerHTML = ""; // Clear previous results
    weatherResults.classList.remove('has-result'); // Remove the class from the product list container

    const apiKey = '26c6b8808f324794919160647262810';

    try{
        const response = await fetch('https://api.weatherapi.com/v1/current.json?key=' + apiKey + '&q=' + encodeURIComponent(location));

        if(!response.ok){
            throw new Error("HTTP" + response.status + " - " + "CITY NOT FOUND");
        }

        const data = await response.json(); //parse the json data into a DOM object

        createWeatherCard(data); //create the weather card
        
    }catch(error){
        weatherResults.innerHTML = "<p>Could not load weather data: " + error.message + "</p>";
    }

    function createWeatherCard(data){
        weatherResults.classList.add('has-result');
        // Extract relevant data from the API response
        const locationName = data.location.name;
        const country = data.location.country;
        const temperature = data.current.temp_c;
        const condition = data.current.condition.text;
        const iconUrl = data.current.condition.icon;
        const feelsLike = data.current.feelslike_c;
        const humidity = data.current.humidity;
        const windSpeed = data.current.wind_kph;

        //City and country
        const h2 = document.createElement('h2');
        h2.textContent = locationName + ", " + country;
        weatherResults.appendChild(h2);

        //Icon
        const icon = document.createElement('img');
        icon.src = iconUrl;
        weatherResults.appendChild(icon);

        //Temperature
        const pTemperature = document.createElement('p');
        pTemperature.classList.add('pTemperature');
        pTemperature.textContent = temperature + "°C";
        weatherResults.appendChild(pTemperature);
        
        //Condition
        const pCondition = document.createElement('p');
        pCondition.classList.add('pCondition');
        pCondition.textContent = condition;
        weatherResults.appendChild(pCondition);

        //Add line 
        const line = document.createElement('hr');
        weatherResults.appendChild(line);

        //Create a row to hold additional weather information
        const additionalInfoRow = document.createElement('div');
        additionalInfoRow.classList.add('row', 'text-center', 'mt-3');

        //Feels like Collum
        const col_feelsLike = document.createElement('div');
        col_feelsLike.classList.add('col-4');

        const feelsLikeIcon = document.createElement('i'); 
        feelsLikeIcon.classList.add('bi', 'bi-thermometer-half'); 
        col_feelsLike.appendChild(feelsLikeIcon);
        
        const pFeelsLike = document.createElement('p');
        pFeelsLike.textContent = "Feels like";
        col_feelsLike.appendChild(pFeelsLike);

        const pTempFeelsLike = document.createElement('p');
        pTempFeelsLike.textContent = feelsLike + "°C";
        col_feelsLike.appendChild(pTempFeelsLike);

        additionalInfoRow.appendChild(col_feelsLike); // Append the "Feels like" column to the additional info row

        //Humidity Collum
        const col_humidity = document.createElement('div');
        col_humidity.classList.add('col-4');
        
        const humidityIcon = document.createElement('i');
        humidityIcon.classList.add('bi', 'bi-droplet-half'); 
        col_humidity.appendChild(humidityIcon);

        const pHumidity = document.createElement('p');
        pHumidity.textContent = "Humidity";
        col_humidity.appendChild(pHumidity);

        const pValueHumidity = document.createElement('p');
        pValueHumidity.textContent = humidity + "%";
        col_humidity.appendChild(pValueHumidity);

        additionalInfoRow.appendChild(col_humidity); // Append the "Humidity" column to the additional info row

        //Wind speed Collum
        const col_windSpeed = document.createElement('div');
        col_windSpeed.classList.add('col-4');
        
        const windSpeedIcon = document.createElement('i');
        windSpeedIcon.classList.add('bi', 'bi-wind'); 
        col_windSpeed.appendChild(windSpeedIcon);

        const pWindSpeed = document.createElement('p');
        pWindSpeed.textContent = "Wind speed";
        col_windSpeed.appendChild(pWindSpeed);

        const pValueWindSpeed = document.createElement('p');
        pValueWindSpeed.textContent = windSpeed + " kph";
        col_windSpeed.appendChild(pValueWindSpeed);
        
        additionalInfoRow.appendChild(col_windSpeed); // Append the "Wind speed" column to the additional info row

        weatherResults.appendChild(additionalInfoRow);

    }

}