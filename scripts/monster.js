export default class Monster{
    static GetAllMonsters(DB){
        let query = "SELECT * FROM Monsters";
        let stmt = DB.prepare(query);

        let monsters = [];
        while(stmt.step()){
            let data = stmt.get();

            let monster = new Monster();
            monster.MonsterID = data[0];
            monster.Name = data[1];

            monsters.push(monster);
        }

        for(let monster of monsters){
            let query = `SELECT b.BiomeID, b.Name, bm.Weight FROM Biomes b, BiomeMonsters bm WHERE bm.BiomeID = b.BiomeID AND bm.MonsterID = ${monster.MonsterID}`;
            let stmt = DB.prepare(query);

            monster.Biomes = [];
            while (stmt.step()) monster.Biomes.push(stmt.get());
        }

        return monsters;
    }
}