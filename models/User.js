let MongoDocument = require('./MongoDocument')

module.exports = class User extends MongoDocument {
    constructor (data) {
        super(data);
        this.login = data.login;
        this.email = data.email;
        this.address = data.address;
        this.password = data.password;
        this._id = data._id;
        this.collection = 'users';
    }
    static findOne (_id) {
        return super.findOne(_id, 'users').then((result) => {
            return new User(result);
        });
    }
        
    static find (query = {}, order = {}) {
        return super.find(query, order, 0, 'users').then((result) => {
            return result.map((u) => new User(u))
        });
    }

};
