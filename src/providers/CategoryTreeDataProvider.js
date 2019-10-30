const vscode = require('vscode');
const Category = require('../models/Category');

class CategoryTreeDataProvider {
    constructor(model) {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }

    refresh() {

    }

    getTreeItem(element) {
        /*
        return {
            resourceUri: element.resurce,
            collapsibleState: element.isDirectory ? vscode.TreeItemCollapsibleState.Collapsed : void 0,
            command: element.isDirectory ? void 0 : {
                command: 'ftpExplorer.openFtpResource',
                arguments: [element.resource],
                title: 'Open FTP Resource'
            }
        }
        */
    }

    getChildren(element) {

    }

    getParent(element) {

    }
}

module.exports.CategoryTreeDataProvider = CategoryTreeDataProvider;