export default async function ConfigureDatabase(){
    //Initalise SQL.js
    const config = {
        locateFile: () => "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.5.0/sql-wasm.wasm"
    };
    
    return await initSqlJs(config).then(async SQL =>{
        console.log("sql.js initalised");
    
        //Read database file and create database object
        const dbFile = await fetch("scripts/DefaultData.db").then(res => res.arrayBuffer());
        return new SQL.Database(new Uint8Array(dbFile));
    })
}