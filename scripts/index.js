import ConfigureDatabase from "./configureDB.js";
import Monster from "./monster.js";
import Biome from "./biome.js";

async function main(){
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
            document.querySelector("#addBiome").classList.remove("hidden");
            document.querySelector("#addBiome .message").innerHTML = "";
        }
    })

    select.appendChild(li);
}

function biomeSelectEvent(event){
    let biomeID = event.target.value;
    resetSelectColumn(false, biomeID);
}

$("#back").click( () =>{
    document.querySelector("#generateForm").classList.toggle("hidden");
    document.querySelector("#dataSource").classList.toggle("hidden");
})

$("#biomeAdd").click(event =>{
    let biomeName = document.querySelector("#biomeName_add").value;

    Biome.AddBiome(window.DB, biomeName);

    $(event.target).parents().children(".message")[0].innerHTML = "Biome was successfully inserted";
    resetSelectColumn(true);
})


main();