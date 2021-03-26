const vscode = require('vscode');
const { LihkgTreeDataProvider } = require('./providers/TreeDataProvider');
const { LihkgTextDocContentProvider } = require('./providers/ContentProvider');
const { CommandContext, Constants, languageId } = require('./constants');

class LihkgExplorer {

    constructor(context) {
        console.log("Creating LihkgExplorer");
        this.updateStatusBarItem = this.updateStatusBarItem.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.previousPage = this.previousPage.bind(this);
        this.jumpPage = this.jumpPage.bind(this);

        this.context = context;
        this.viewer = vscode.window.createTreeView('lihkg-view', {
            treeDataProvider: new LihkgTreeDataProvider()
        });

        this.statusBarView = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
        this.statusBarView.command = 'vs-lihkg.topic.jumpPage';
        vscode.window.onDidChangeActiveTextEditor(this.updateStatusBarItem)

        vscode.commands.registerCommand('vs-lihkg.more.more', this.more);
        vscode.commands.registerCommand('vs-lihkg.topic.showTopic', this.showTopic);
        vscode.commands.registerCommand('vs-lihkg.topic.nextPage', this.nextPage);
        vscode.commands.registerCommand('vs-lihkg.topic.previousPage', this.previousPage);
        vscode.commands.registerCommand('vs-lihkg.topic.refresh', this.refresh);
        vscode.commands.registerCommand('vs-lihkg.topic.openInBrowser', this.openInBrowser);
        vscode.commands.registerCommand('vs-lihkg.topic.jumpPage', this.jumpPage);

        vscode.workspace.registerTextDocumentContentProvider(Constants.SCHEME, new LihkgTextDocContentProvider);
    }

    updateStatusBarItem() {
        let uri = vscode.window.activeTextEditor.document.uri;
        if (uri.scheme === Constants.SCHEME) {
            let dataArray = uri.path.split(":");
            let page = Number(dataArray[1]);
            let totlePage = Number(dataArray[2]);

            this.statusBarView.text = `page ${page} of ${totlePage}`;
            this.statusBarView.show();
        } else {
            this.statusBarView.hide();
        }
    }

    async showPage(threadId, totalPage, page) {
        const document = vscode.window.activeTextEditor.document;
        const newUri = document.uri.with({ path: `${threadId}:${page}:${totalPage}` });

        await vscode.commands.executeCommand("setContext", CommandContext.maxPage, (totalPage <= page));
        await vscode.commands.executeCommand("setContext", CommandContext.firstPage, (1 == page));
        await vscode.window.showTextDocument(newUri, { preview: true });
        await vscode.languages.setTextDocumentLanguage(document, languageId);
    }

    more(more) {
        more.callback();
    }

    showTopic(topic) {
        topic.showTopic();
    }

    async nextPage(content) {
        console.log(content);
        let document = vscode.window.activeTextEditor.document;
        let dataArray = document.uri.path.split(":");
        let threadId = dataArray[0];
        let page = Number(dataArray[1]);
        let totalPage = Number(dataArray[2]);
        page++;
        this.showPage(threadId, totalPage, page);
    }

    async previousPage(content) {
        console.log(content);
        let document = vscode.window.activeTextEditor.document;
        let dataArray = document.uri.path.split(":");
        let threadId = dataArray[0];
        let page = Number(dataArray[1]);
        let totalPage = Number(dataArray[2]);
        page--;
        this.showPage(threadId, totalPage, page);
    }

    refresh(topic) {
        topic.refresh();
    }

    openInBrowser(topic) {
        topic.openInBrowser();
    }

    async jumpPage() {
        let document = vscode.window.activeTextEditor.document;
        let dataArray = document.uri.path.split(":");
        let threadId = dataArray[0];
        let page = Number(dataArray[1]);
        let totalPage = Number(dataArray[2]);

        let targetPage = await vscode.window.showInputBox({
            placeHolder: `1 - ${totalPage}`,
            validateInput: text => {
                return (!isNaN(text) && Number(text) >= 1 && Number(text) <= totalPage) ? null : Constants.INPUT_ERROR;
            }
        });
        console.log(targetPage);
        page = Number(targetPage);

        this.showPage(threadId, totalPage, page);
    }
}

module.exports = {
    LihkgExplorer
}