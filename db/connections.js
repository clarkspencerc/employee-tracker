import mysql  from'mysql2'; 

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'spencer123', 
        database: 'business'
    },
    console.log('connected to the business database')
); 

export default db; 