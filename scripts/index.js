import ConfigureDatabase from "./configureDB.js";
import Monster from "./monster.js";
import Biome from "./biome.js";

//TODO
//1. Finish regular functionality
//2. Move event listeners to seperate files
//3. Combine some verbose functions together
//4. Somehow add DB object to static parent object for Biome and Monster
//5. Add error handling for SQL queries
//6. Comment code!

async function setup(){
    window.DB = await ConfigureDatabase();

    let biomes = Biome.GetAllBiomes(window.DB);

    let biomeSelect = document.querySelector("#biome");
    for(const biome of biomes){
        let option = document.createElement("option");

        option.value = biome.BiomeID;
        option.innerHTML = biome.Name;

        biomeSelect.appendChild(option);
    }
    
}

$("#generate").click(() =>{
    let monsters = Monster.GetAllMonsters(window.DB);
    console.log(monsters);

})

$("#editData").click(() => {
    document.querySelector("#generateForm").classList.toggle("hidden");
    document.querySelector("#dataSource").classList.toggle("hidden");

    resetSelectColumn(true);
    resetSelectColumn(false);
});

$(".modalClose").click(event => event.target.offsetParent.classList.add("hidden"))

function resetSelectColumn(isBiome, biomeID = null){
    let data = isBiome ? Biome.GetAllBiomes(window.DB) : Monster.GetMonstersFromBiome(window.DB, biomeID);
    let select = document.querySelector(isBiome ? "#biomes ul" : "#biomeMonsters ul");
    select.innerHTML = "";

    //Just reset monster column without filling it
    if(!isBiome && biomeID == null) return;

    for(const record of data){
        let li = document.createElement("li");
        let radio = document.createElement("input");

        radio.type = "radio";
        radio.name = isBiome ? "biome" : "monster";
        radio.value = record.BiomeID ?? record.MonsterID;
        radio.id = record.Name;
        radio.classList.add("hidden");

        if (isBiome) radio.addEventListener("change", biomeSelectEvent);

        let label = document.createElement("label");
        label.innerHTML = record.Name;
        label.htmlFor = record.Name;

        li.appendChild(radio);
        li.appendChild(label);

        select.appendChild(li);
    }

    let li = document.createElement("li");
    li.classList.add("addButton");
    li.innerHTML = "Add New...";

    li.addEventListener("click", () => {
        if(isBiome){
            let addBiome = document.querySelector("#addBiome");

            addBiome.classList.remove("hidden");
            addBiome.querySelector(".message").innerHTML = "";
        } else{
            let addMonster = document.querySelector("#addMonster");

            addMonster.classList.remove("hidden");
            addMonster.querySelector(".message").innerHTML = "";

            document.querySelector("#monsterName_add select").classList.remove("hidden");
            document.querySelector("#monsterName_add input").classList.add("hidden");

            //Get all current possible encounters for selected biome
            let biomeMonsters = document.querySelectorAll("#biomeMonsters label");
            biomeMonsters = Array.from(biomeMonsters).map(label => label.innerHTML);

            //If monster already in encounter, don't add it to drop down list
            let monsters = Monster.GetAllMonsters(window.DB).filter(monster => {
                return !biomeMonsters.includes(monster.Name);
            });
            
            let monsterSelect = document.querySelector("#monsterName_add select");

            monsterSelect.innerHTML = "";
            for(const monster of monsters){
                let option = document.createElement("option");

                option.innerHTML = monster.Name;
                monsterSelect.appendChild(option);
            }

            let option = document.createElement("option");
            option.classList.add("addButton");
            option.innerHTML = "Add New..."

            monsterSelect.appendChild(option);
        }
    })

    select.appendChild(li);
}

function biomeSelectEvent(event){
    let biomeID = event.target.value;
    resetSelectColumn(false, biomeID);
}

$("#editBiomeButton").click(event => {
    event.preventDefault();

    const biomeSelect = document.querySelectorAll("input[name='biome']");
    for(const biome of biomeSelect){
        if (biome.checked){
            const editModal = document.querySelector("#editBiome");
        
            editModal.classList.remove("hidden");
            editModal.querySelector(".message").innerHTML = "";
        
            const biomeID = document.querySelector("#biomeID_edit");
            const biomeName = document.querySelector("#biomeName_edit");

            biomeID.value = biome.value;
            biomeName.value = document.querySelector(`label[for="${biome.id}"]`).innerHTML;

            break;
        }
    }
})

$("#deleteBiomeButton").click(event =>{
    event.preventDefault();

    const biomeSelect = document.querySelectorAll("input[name='biome']");
    for(const biome of biomeSelect){
        if(biome.checked){
            const deleteModal = document.querySelector("#deleteBiome");

            deleteModal.classList.remove("hidden");
            deleteModal.querySelector(".message").innerHTML = "Are you sure you want to delete this biome?";

            const biomeID = document.querySelector("#biomeID_delete");
            biomeID.value = biome.value;

            break;

        }
    }
})

$("#back").click(() =>{
    document.querySelector("#generateForm").classList.toggle("hidden");
    document.querySelector("#dataSource").classList.toggle("hidden");
})

$("#monsterName_add select").change(event => {
    if(event.target.selectedOptions[0].classList.contains("addButton")){
        document.querySelector("#monsterName_add select").classList.add("hidden");
        document.querySelector("#monsterName_add input").classList.remove("hidden");
    }
})

$("#biomeAdd").click(() =>{
    let biomeName = document.querySelector("#biomeName_add").value.trim();
    let message = document.querySelector("#addBiome .message");
    message.innerHTML = "";

    if(biomeName.length == 0) return;

    let biomeSelect = document.querySelectorAll("input[name='biome']");
    for(const biome of biomeSelect){
        if(biome.id == biomeName){
            message.innerHTML = "A biome of this name already exists";
            return;
        }
    }

    Biome.AddBiome(window.DB, biomeName);

    message.innerHTML = "Biome was successfully inserted";
    resetSelectColumn(true);
})

$("#biomeEdit").click(() =>{
    let biomeID = document.querySelector("#biomeID_edit").value;
    let biomeName = document.querySelector("#biomeName_edit").value.trim();
    let message = document.querySelector("#editBiome .message");
    message.innerHTML = "";

    if (biomeName.length == 0) return;

    let biomeSelect = document.querySelectorAll("input[name='biome']");
    for(const biome of biomeSelect){
        if(biome.id == biomeName){
            message.innerHTML = "A biome of this name already exists";
            return;
        }
    }

    Biome.EditBiome(window.DB, biomeID, biomeName);

    message.innerHTML = "Biome was successfully updated";
    resetSelectColumn(true);
})

$("#biomeDelete").click(() =>{
    if(confirm("Really delete biome?")){
        let biomeID = document.querySelector("#biomeID_delete").value;
        let message = document.querySelector("#deleteBiome .message");

        Biome.DeleteBiome(window.DB, biomeID);

        message.innerHTML = "Biome was successfully deleted";
        resetSelectColumn(true);
    }
})

$("#monsterAdd").click(() => {
    const nameInput = document.querySelector("#monsterName_add input");
    const nameSelect = document.querySelector("#monsterName_add select");
    const message = document.querySelector("#addMonster .message");
    const biomeSelect = document.querySelectorAll("input[name='biome']");
    const biomeMonsters = Array.from(document.querySelectorAll("#biomeMonsters label")).map(label => label.innerHTML.toLowerCase());
    const weightInput = document.querySelector("#monsterWeight_add");
    
    message.innerHTML = "";

    //Name can be either what they typed in as a new monster OR a pre-existing monster selected from the dropdown
    let monsterName = nameInput.value.trim() || nameSelect.selectedOptions[0].innerHTML.trim();

    if(biomeMonsters.includes(monsterName.toLowerCase())) {
        message.innerHTML = "An encounter with this monster already exists";
        return;
    }
    if(weightInput.value == "" || weightInput.value <= 0){
        message.innerHTML = "An encounter needs a valid numerical weight";
        return;
    }

    let monsterID = Monster.GetIDFromName(window.DB, monsterName);

    let monsterWeight = weightInput.value;
    let biomeID = (() =>{
        for(const biome of biomeSelect){
            if(biome.checked) return biome.value;
        }
    })();

    Biome.AddEncounter(window.DB, biomeID, monsterID, monsterWeight);

    message.innerHTML = "Encounter successfully added";
    resetSelectColumn(false, biomeID);

})



setup();