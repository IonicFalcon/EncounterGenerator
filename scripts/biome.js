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
}