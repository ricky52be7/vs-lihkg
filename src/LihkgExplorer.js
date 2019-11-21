const vscode = require('vscode');
const { LihkgTreeDataProvider } = require('./providers/TreeDataProvider');
const { LihkgTextDocContentProvider } = require('./providers/ContentProvider');
const { CommandContext } = require('./constants');

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
        vscode.commands.registerCommand('vs-lihkg.topic.refresh', this.refresh)

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
        let dataArray = document.uri.path.split(":");
        let threadId = dataArray[0];
        let page = Number(dataArray[1]);
        let totalPage = Number(dataArray[2]);
        page++;
        await vscode.commands.executeCommand("setContext", CommandContext.maxPage, (totalPage <= page));
        await vscode.commands.executeCommand("setContext", CommandContext.firstPage, (1 == page));
        let newUri = document.uri.with({ path: `${threadId}:${page}:${totalPage}` });
        await vscode.window.showTextDocument(newUri, { preview: true });
    }

    async previousPage(content) {
        console.log(content);
        let { document } = vscode.window.activeTextEditor;
        let dataArray = document.uri.path.split(":");
        let threadId = dataArray[0];
        let page = Number(dataArray[1]);
        let totalPage = Number(dataArray[2]);
        page--;
        await vscode.commands.executeCommand("setContext", CommandContext.maxPage, (totalPage <= page));
        await vscode.commands.executeCommand("setContext", CommandContext.firstPage, (1 == page));
        let newUri = document.uri.with({ path: `${threadId}:${page}:${totalPage}` });
        await vscode.window.showTextDocument(newUri, { preview: true });
    }

    refresh(topic) {
        topic.refresh();
    }
}

module.exports = {
    LihkgExplorer
}