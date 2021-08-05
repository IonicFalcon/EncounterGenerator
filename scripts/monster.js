import Biome from "./biome.js";

export default class Monster{
    constructor(data){
        this.MonsterID = data[0];
        this.Name = data[1];
    }

    static GetAllMonsters(DB){
        let query = "SELECT * FROM Monsters";
        let stmt = DB.prepare(query);

        return Monster.GetMonsters(stmt, DB);
    }

    static GetMonstersFromBiome(DB, biomeID){
        let query = `SELECT m.MonsterID, m.Name FROM Monsters m, BiomeMonsters bm WHERE bm.MonsterID = m.MonsterID AND bm.BiomeID = ${biomeID} ORDER BY bm.Weight DESC`;
        let stmt = DB.prepare(query);

        return Monster.GetMonsters(stmt, DB);
    }

    static GetMonsters(stmt, DB){
        let monsters = [];
        while(stmt.step()) monsters.push(new Monster(stmt.get()));

        for(let monster of monsters){
            let query = `SELECT b.BiomeID, b.Name, bm.Weight FROM Biomes b, BiomeMonsters bm WHERE bm.BiomeID = b.BiomeID AND bm.MonsterID = ${monster.MonsterID}`;
            let stmt = DB.prepare(query);

            monster.Biomes = [];
            while (stmt.step()){
                let data = stmt.get();

                monster.Biomes.push([new Biome(data), data[2]]);
            }
        }

        return monsters;
    }
}