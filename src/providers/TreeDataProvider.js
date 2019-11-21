const vscode = require('vscode');
const { create } = require('lihkg-api');
const { Category, SubCategory, Topic, More } = require('../models/TreeItem');

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
                console.log('Querying Property...');
                return client.getProperty();
            }).then(rst => {
                console.log(rst);
                return rst.response.category_list.map(category => {
                    return new Category(
                        category.name,
                        vscode.TreeItemCollapsibleState.Collapsed,
                        category.cat_id,
                        category.sub_category
                    );
                });
            });
        } else if (element instanceof Category) {
            return element.subCategory.map(subCategory => {
                return new SubCategory(
                    subCategory.name,
                    vscode.TreeItemCollapsibleState.Collapsed,
                    subCategory.cat_id,
                    subCategory.sub_cat_id
                );
            });
        } else if (element instanceof SubCategory) {
            let self = this;
            element.setRefreshCallback(function() {
                self._onDidChangeTreeData.fire();
            });
            return element.getTopic().then(topics => {
                //let self = this;
                let result = [...topics];
                result.push(new More(function() {
                    element.nextPage();
                    self._onDidChangeTreeData.fire(element);
                }));
                return result;
            });
        }

    }
}

module.exports = {
    LihkgTreeDataProvider
}