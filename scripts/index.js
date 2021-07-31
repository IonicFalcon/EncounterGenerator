import ConfigureDatabase from "./configureDB.js";
import Monster from "./monster.js";

async function main(){
    window.DB = await ConfigureDatabase();

    let query = "SELECT * FROM Biomes";
    let stmt = window.DB.prepare(query);

    let biomes = [];
    while(stmt.step()) biomes.push(stmt.get())

    let biomeSelect = document.querySelector("#biome");
    for(const biome of biomes){
        let option = document.createElement("option");

        option.value = biome[0];
        option.innerHTML = biome[1];

        biomeSelect.appendChild(option);
    }
    
}

document.querySelector("#generate").addEventListener("click", () =>{
    let monsters = Monster.GetAllMonsters(window.DB);
    console.log(monsters);
})

main();