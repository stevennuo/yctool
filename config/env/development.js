'use strict';

var host = 'localhost',
    database = 'yangcong-dev';

module.exports = {
    host: host,
    database: database,
    db: "mongodb://" + host + "/" + database,
    enterprise_url: 'http://localhost:3002'
}
