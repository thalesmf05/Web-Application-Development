const searchForm = document.getElementById("search-form");
searchForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    searchProducts("products.xml"); // Call the searchProducts function with the XML file URL
});

async function searchProducts(url) {
    const table = document.getElementById("result-table");

    // Reset the result section before displaying the next result.
    table.replaceChildren();

    try{
        table.replaceChildren();
        const inputValue = document.getElementById("search-input").value;

        if(!validateInput(inputValue)){ //Check if input is valid, if not trown an error and break process
           return table.innerHTML = "<tr><td>Invalid code, please try again</td></tr>"; //Stops loadData()
        }

        const response = await fetch(url);

        if(!response.ok){ //check the response from fecth the xml
            throw new Error("HTTP" + response.status);
        }

        const text = await response.text();
        const xmlData = new DOMParser().parseFromString(text, "text/xml");

        const products = xmlData.getElementsByTagName("product")

        let matchingProduct = null; 
        
        for(const product of products){ //check if the codeInput matches with any one of the projects 
            const productCode = product.getElementsByTagName("code")[0].textContent;

            if(productCode === inputValue){ 
                matchingProduct = product; //add the matching product to the machingProduct varible, in order to be used after
                break;
            }
        }

        if(!matchingProduct){ //return an error in case of no matching code
            table.innerHTML = "<tr><td>Invalid code, please try again</td></tr>";
            return;
        }

        const headers = ["Category", "Code", "Name", "Description", "Quantity", "Unity Price"];
        addRow(table, headers, "th"); //create the product header

        //fecth data from the machingProduct object
        const category = matchingProduct.getElementsByTagName("category")[0].textContent;
        const code = matchingProduct.getElementsByTagName("code")[0].textContent;
        const name = matchingProduct.getElementsByTagName("name")[0].textContent;
        const description = matchingProduct.getElementsByTagName("description")[0].textContent;
        const quantity = matchingProduct.getElementsByTagName("quantity")[0].textContent;
        const unitPrice = matchingProduct.getElementsByTagName("unitPrice")[0].textContent;

        addRow(table, [category, code, name, description, quantity, unitPrice], "td"); //create the product row

    }catch(error){
        table.innerHTML = "<tr><td>Could not load items: " + error.message + "</td></tr>";
    }

    function addRow(table, values, cellType){
        const row = document.createElement("tr")

        for(const value of values){
            const cell = document.createElement(cellType);

            cell.textContent = value;

            row.appendChild(cell);
        }

        table.appendChild(row);
    }
    
    function validateInput(value){
            const pattern = /^[0-9]{3}-[0-9]{2}$/; 
            return pattern.test(value);
    }
}
