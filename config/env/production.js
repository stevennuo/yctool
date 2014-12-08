'use strict';

var PRIVATE = require('./private')


module.exports = {
    host: PRIVATE.db.host,
    database: PRIVATE.db.database,
    dbUsername: PRIVATE.db.username,
    dbPassword: PRIVATE.db.password,
    db: "mongodb://" + username + ":" + password + "@" + host + "/" + database, port: 9000,
    enterprise_url: PRIVATE.enterprise_url
}
