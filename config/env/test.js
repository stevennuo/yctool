'use strict';

var host = 'localhost',
    database = 'yangcong-test';

module.exports = {
    host: host,
    database: database,
    db: "mongodb://" + host + "/" + database,
    enterprise_url: 'http://localhost:3002',
    port: 10461
}