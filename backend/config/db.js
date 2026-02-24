require('dotenv').config({
    path: process.env.JEST_WORKER_ID ? '.env.test' : '.env',
    override: true
}); 
const { Pool } = require('pg'); 

const pool = new Pool({ 
    host: process.env.PGHOST, 
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDB,
    port: process.env.PGPORT
}); 

module.exports = pool;