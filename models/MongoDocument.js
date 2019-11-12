let client = require('mongodb').MongoClient,
    ObjectId = require('mongodb').ObjectId;
let config = require('./config');
let conn = client.connect(process.env.MONGODB_URI || config.uri).then((conn) => {
    return {
        db: conn.db('heroku_4dd2fbxv'),
        close: function () {
            conn.close();
        }
    };
});
conn.catch((err) => {
    throw err;
});
module.exports = class MongoDocument {
    save () {
        if (this._id) {
            return conn.then((conn) => {
                return conn.db.collection(this.collection).updateOne({_id: this._id}, {$set: this});
            });
        }
        return conn.then((conn) => {
                return conn.db.collection(this.collection).insertOne(this);
        }).catch((err) => {
            if (err) throw err;
        })
    }

    delete () {
        if (this._id) {
            return conn.then((conn) => {
                return conn.db.collection(this.collection).deleteOne({_id: this._id});
            });
        }
        return null;
    }

    static findOne (_id, collection) {
        return conn.then((conn) => {
            return conn.db.collection(collection).findOne({_id: ObjectId(_id)});
        });
    }

    static find (query = {}, sort = {}, limit = 5, collection) {
        /*return conn.then((conn) => {
            return conn.db.collection(collection).find(query)
                          .sort(sort).limit(limit).toArray();
        });*/
        return conn.then((conn) => {
            return conn.db.collection(collection).find(query).toArray();
        });
    }
    //{ projection : { profissao: 1,nome: 1, _id: 0}
    //projection : { field: 1 } -- retorna apenas o campo field. O id é retornado por padrao;
    static close() {
        conn.then((conn) => {
            conn.close();
        });
    }
};
