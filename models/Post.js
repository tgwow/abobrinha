let MongoDocument = require('./MongoDocument')

module.exports = class Post extends MongoDocument {
    constructor (data) {
        super(data);
        this._id = data._id;
        this.title = data.title;
        this.description = data.description;
        this.idUser = data.idUser;
        this.collection = 'posts';
    }

    static findOne (_id) {
        return super.findOne(_id, 'posts').then((result) => {
            return new Post(result);
        });
    }
        
    static find (query, order = {}) {
        return super.find(query, order, 4, 'posts').then((result) => {
            return result.map((p) => new Post(p))
        });
    }

    static delete (id) {
        return super.delete(id).then((result) => {
            return result.deletedCount;
        })
        
    }   
};
