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

    static GetMonsterFromID(DB, monsterID){
        let query = "SELECT * FROM Monsters WHERE MonsterID = ?";
        let stmt = DB.prepare(query);

        let monster = new Monster(stmt.get([monsterID]));

        query = `SELECT b.BiomeID, b.Name, bm.Weight FROM Biomes b, BiomeMonsters bm WHERE bm.BiomeID = b.BiomeID AND bm.MonsterID = ${monster.MonsterID}`;
        stmt = DB.prepare(query);

        monster.Biomes = [];
        while (stmt.step()){
            let data = stmt.get();

            monster.Biomes.push([new Biome(data), data[2]]);
        }

        return monster;
    }


    static GetIDFromName(DB, monsterName){
        let query = "SELECT MonsterID FROM Monsters WHERE Name LIKE ?";
        let stmt = DB.prepare(query);

        let ID = stmt.get([monsterName])[0];

        //If ID wasn't returned, must be a new monster
        if(!ID){
            Monster.AddMonster(DB, monsterName);
            return Monster.GetIDFromName(DB, monsterName);
        }

        return ID;
    }

    static AddMonster(DB, monsterName){
        DB.run("INSERT INTO Monsters (Name) VALUES (?)", [monsterName]);
    }

    static DeleteMonster(DB, ID){
        DB.run("DELETE FROM Monsters WHERE MonsterID = ?", [ID]);
    }

    //Monsters don't need to exist if they aren't apart of any biome
    static CleanupMonsters(DB){
        Monster.GetAllMonsters(DB).forEach(monster => {
            if(monster.Biomes.length == 0){
                Monster.DeleteMonster(DB, monster.MonsterID);
            }
        })
    }
}