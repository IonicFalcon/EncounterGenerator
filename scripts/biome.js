import Monster from "./monster.js";

export default class Biome{
    constructor(data){
        this.BiomeID = data[0];
        this.Name = data[1];
    }

    static GetAllBiomes(DB){
        let query = "SELECT * FROM Biomes";
        let stmt = DB.prepare(query);

        let biomes = [];
        while(stmt.step()) biomes.push(new Biome(stmt.get()));

        return biomes;
    }

    static AddBiome(DB, biomeName){
        DB.run("INSERT INTO Biomes (Name) VALUES (?)", [biomeName]);
    }

    static EditBiome(DB, biomeID, biomeName){
        DB.run("UPDATE Biomes SET Name = ? WHERE BiomeID = ?", [biomeName, biomeID]);
    }

    static DeleteBiome(DB, biomeID){
        DB.run("DELETE FROM Biomes WHERE BiomeID = ?", [biomeID]);
    }

    static AddEncounter(DB, biomeID, monsterID, weight){
        DB.run("INSERT INTO BiomeMonsters (BiomeID, MonsterID, Weight) VALUES (?, ?, ?)", [biomeID, monsterID, weight]);
    }

    static DeleteEncounter(DB, biomeID, monsterID){
        DB.run("DELETE FROM BiomeMonsters WHERE BiomeID = ? AND MonsterID = ?", [biomeID, monsterID]);
    }

    static EditEncounter(DB, biomeID, originalMonsterID, newMonsterID, weight){
        Biome.DeleteEncounter(DB, biomeID, originalMonsterID);
        Biome.AddEncounter(DB, biomeID, newMonsterID, weight);

        Monster.CleanupMonsters(DB);
    }
}