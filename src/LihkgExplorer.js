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

        vscode.commands.registerCommand('vs-lihkg.more.more', this.more);
        vscode.commands.registerCommand('vs-lihkg.topic.showTopic', this.showTopic);
        vscode.commands.registerCommand('vs-lihkg.topic.nextPage', this.nextPage);
        vscode.commands.registerCommand('vs-lihkg.topic.previousPage', this.previousPage);

        const scheme = "vs-lihkg";
        vscode.workspace.registerTextDocumentContentProvider(scheme, new LihkgTextDocContentProvider);
    }

    more(more) {
        more.callback();
    }

    showTopic(topic) {
        topic.showTopic();
    }

    async nextPage(content) {
        console.log(content);
        let { document } = vscode.window.activeTextEditor;
        let path = document.uri.path;
        let threadId = path.split(":")[0];
        let page = Number(path.split(":")[1]);
        page++;
        let newUri = document.uri.with({ path: `${threadId}:${page}` });
        await vscode.window.showTextDocument(newUri, { preview: true });
    }

    async previousPage(content) {
        console.log(content);
        let { document } = vscode.window.activeTextEditor;
        let path = document.uri.path;
        let threadId = path.split(":")[0];
        let page = Number(path.split(":")[1]);
        if (page > 1) page--;
        else vscode.window.showErrorMessage("This is the first page");
        let newUri = document.uri.with({ path: `${threadId}:${page}` });
        await vscode.window.showTextDocument(newUri, { preview: true });
    }
}

module.exports = {
    LihkgExplorer
}