const vscode = require('vscode');
const { create } = require('lihkg-api');
const { Category, Topic } = require('../models/TreeItem');

class LihkgTreeDataProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }

    refresh() {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element) {
        return element;
    }

    getChildren(element) {
        if (!element) {
            return create().then(client => {
                return client.getProperty();
            }).then(rst => {
                console.log('Property', rst);
                return rst.response.category_list.map(category => {
                    return new Category(
                        category.name,
                        vscode.TreeItemCollapsibleState.Collapsed,
                        category.cat_id
                    );
                });
            });
        } else if (element instanceof Category) {
            return create().then(client => {
                return client.getTopicList({
                    cat_id: element.id,
                    page: 1,
                    count: 60,
                    sub_cat_id: -1
                });
            }).then(rst => {
                console.log('Topic', rst);
                return rst.response.items.map(topic => {
                    return new Topic(topic.title, vscode.TreeItemCollapsibleState.None);
                });
            });
        }

    }
}

module.exports = {
    LihkgTreeDataProvider
}