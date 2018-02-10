/**
 * Caffeine Database Generated Class
 * Editing this class is NOT RECOMMENDED.
 * Changes will be reverted when the file is regenerated.
 * Please edit the generator files instead: header.js, database.gen, footer.js
 */
class Database {
  /**
   * Create the Database.
   * @param {string} host - The database host
   * @param {string} username - The connection username
   * @param {string} password - The connection password
   * @param {string} database - The database to use
   */  
  constructor(host, username, password, database){
    this.host = host;
    this.username = username;
    this.password = password;
    this.database = database;

    this.MySQL = require("mysql");
    
    this.cxn = this.MySQL.createConnection({
      host: this.host,
      user: this.username,
      password: this.password,
      database: this.database
    });
    
    this.cxn.connect((err) => {
      if( err ) return console.log("Error connecting to MySQL. All queries will fail.\n" + err);
      
      console.log("Connected to MySQL! Thread ID: " + this.cxn.threadId);
    });
  }
  
  /**
   * Properly dispose of the Database and close the connection.
   */
  dispose(){
    this.cxn.end();
  }

