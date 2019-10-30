const { Lihkg } = require('lihkg-api');

class Category {
    constructor() {
        this.client = Lihkg();
    }

    roots() {
        return this.client.then(client => {
            return client.getTopicList({
                cat_id: "15",
                page: 1,
                count: 100,
                sub_cat_id: -1
            });
        }).then(rst => {
            return rst;
        })
    }
}

module.exports.Category = Category;