'use strict';

var host = 'localhost',
    database = 'import';

module.exports = {
    host: host,
    database: database,
    db: "mongodb://" + host + "/" + database,
    enterprise_url: 'http://localhost:3002'
}
