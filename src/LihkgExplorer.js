const vscode = require('vscode');
const { CategoryTreeDataProvider } = require('./providers/CategoryTreeDataProvider');

class LihkgExplorer {
    constructor(context) {
        console.log("Creating LihkgExplorer");
        this.context = context;
        this.viewer = vscode.window.createTreeView('lihkg-view', {
            treeDataProvider: new CategoryTreeDataProvider()
        });   
    }
}

module.exports = {
    LihkgExplorer
}