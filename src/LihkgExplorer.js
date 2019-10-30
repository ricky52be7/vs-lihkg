const vscode = require('vscode');
const { LihkgTreeDataProvider } = require('./providers/TreeDataProvider');
const { Topic } = require('./models/TreeItem');

class LihkgExplorer {
    constructor(context) {
        console.log("Creating LihkgExplorer");
        this.context = context;
        this.viewer = vscode.window.createTreeView('lihkg-view', {
            treeDataProvider: new LihkgTreeDataProvider()
        });

        vscode.commands.registerCommand('More.more', (more) => more.callback());
        vscode.commands.registerCommand('Topic.showTopic', (topic) => topic.showTopic());

        const scheme = "vs-lihkg";
        vscode.workspace.registerTextDocumentContentProvider(scheme, new Topic);
        //this.context.subscriptions.push();
    }
}

module.exports = {
    LihkgExplorer
}