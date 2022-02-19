const url = "https://api.nobelprize.org/v1/prize.json";
fetch(url)
    .then((res) => {
        return res.json();
    })
    .then((result) => {
        localStorage.setItem("prizes", JSON.stringify(result["prizes"]));
        let categories = [];
        let details = [];
        let duplicates = [];

        for(prize of result["prizes"]){
            categories.push(prize["category"]);
        }

        uniq_categories = [...new Set(categories)];

        for(let val of uniq_categories){
            let form = document.getElementById("categories-dropdown");
            let option = document.createElement("option");
            option.text = capitalizeFirstLetter(val);
            form.add(option);
        }

        for(let i = 1901; i < 2019; i++){
            let form = document.getElementById("year-dropdown");
            let option = document.createElement("option");
            option.text = i;
            form.add(option);
        }

        for(prize of result["prizes"]){
            if(prize["laureates"] != undefined){
                for(winners of prize["laureates"]){
                    if(!winners["surname"])
                        continue;

                    details.push({
                        id: winners["id"],
                        name: winners["firstname"] + " " + winners["surname"]
                    });                    
                }
            }
        }       

        details.sort((a, b) => {
            return a.id - b.id;
        })

        let init = -1;
        let dupe = 0;

        for(detail of details){
            if(detail["id"] == init){
                if(dupe == 0){
                    duplicates.push(detail["name"]);
                    dupe = 1
                }
                
            }

            else{
                init = detail["id"];
                dupe = 0
            }
        }

        duplicates.sort();

        for (let val of duplicates) {
            let table = document.getElementById("myTable");
            let row = table.insertRow();
            let cell = row.insertCell();
            cell.innerHTML = val;
        }

        

    })
    .catch((err) => {
        console.log(err);
    })

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function filterResults() {
    let year = document.getElementById("year-dropdown").value;
    let category = document.getElementById("categories-dropdown").value;
    category = category.charAt(0).toLowerCase() + category.slice(1);

    let prizes = JSON.parse(localStorage.getItem("prizes"));

    const div = document.getElementById("results");
    div.innerHTML = "";
    let h1 = document.createElement("h3");
    h1.textContent = capitalizeFirstLetter(category) + " " + year;
    div.appendChild(h1)

    for(prize of prizes){
        if(prize["category"] == category && prize["year"] == year){
            if(prize["laureates"]){
                for(winners of prize["laureates"]){
                    let h2 = document.createElement("h3");
                    h2.textContent = winners["firstname"];
                    if(winners["surname"])
                        h2.textContent += " " + winners["surname"];
                    
                    div.appendChild(h2);
                }
                break;
            }
            
        }
        
    }
}