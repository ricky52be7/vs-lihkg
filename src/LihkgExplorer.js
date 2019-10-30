const vscode = require('vscode');
const { LihkgTreeDataProvider } = require('./providers/TreeDataProvider');

class LihkgExplorer {
    constructor(context) {
        console.log("Creating LihkgExplorer");
        this.context = context;
        this.viewer = vscode.window.createTreeView('lihkg-view', {
            treeDataProvider: new LihkgTreeDataProvider()
        });   
    }
}

module.exports = {
    LihkgExplorer
}