const vscode = require('vscode');
const { LihkgTreeDataProvider } = require('./providers/TreeDataProvider');
const { LihkgTextDocContentProvider } = require('./providers/ContentProvider');

class LihkgExplorer {
    constructor(context) {
        console.log("Creating LihkgExplorer");
        this.context = context;
        this.viewer = vscode.window.createTreeView('lihkg-view', {
            treeDataProvider: new LihkgTreeDataProvider()
        });

        vscode.commands.registerCommand('More.more', (more) => more.callback());
        vscode.commands.registerCommand('Topic.showTopic', (topic) => topic.showTopic());
        vscode.commands.registerCommand('lihkg.nextPage', (v) => console.log(v));

        const scheme = "vs-lihkg";
        vscode.workspace.registerTextDocumentContentProvider(scheme, new LihkgTextDocContentProvider);
    }
}

module.exports = {
    LihkgExplorer
}