export default class Database {
    static config = {
        locateFile: () => "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.5.0/sql-wasm.wasm"
    }

    static async InitalSetup(){
        return await initSqlJs(Database.config).then(async SQL =>{
            console.log("sql.js initalised");
    
            //Read database file and create database object
            const dbFile = await fetch("scripts/DefaultData.db").then(res => res.arrayBuffer());
            return new SQL.Database(new Uint8Array(dbFile));
        })
    }

    static async UploadDatabase(file){
        return await initSqlJs(Database.config).then(async SQL =>{
            const fr = new FileReader();

            return new Promise((resolve, reject) => {
                fr.onload = () => {
                    let dataArray = new Uint8Array(fr.result);
                    resolve(new SQL.Database(dataArray));
                }

                fr.readAsArrayBuffer(file);
            })
        })  
    }
}