const vscode = require('vscode');
const { create } = require('lihkg-api');
const { Category } = require('../models/Category');

class CategoryTreeDataProvider {
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
        return create().then(client => {
            return client.getProperty();
        }).then(rst => {
            console.log(rst);
            return rst.response.category_list.map(category => {
                return new Category(category.name, vscode.TreeItemCollapsibleState.None);
            });
        });
    }
}

module.exports = {
    CategoryTreeDataProvider
}