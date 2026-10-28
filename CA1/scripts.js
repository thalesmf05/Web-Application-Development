const searchForm = document.getElementById("search-form");

searchForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    searchProducts("products.xml"); // Call the searchProducts function with the XML file URL
});

async function searchProducts(url) {
    const productList = document.querySelector('.product-list');
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
