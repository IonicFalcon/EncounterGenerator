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

$("#biomeAdd").click(() =>{
    let biomeName = document.querySelector("#biomeName_add").value;
    let message = document.querySelector("#addBiome .message");
    message.innerHTML = "";

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
    let biomeName = document.querySelector("#biomeName_edit").value;
    let message = document.querySelector("#editBiome .message");
    message.innerHTML = "";

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



setup();