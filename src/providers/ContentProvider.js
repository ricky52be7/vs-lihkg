const vscode = require('vscode');
const { LIHKG } = require('../lihkg');

/**
 * @implements {vscode.TextDocumentContentProvider}
 */
class LihkgTextDocContentProvider {
    constructor() {
        this.onDidChangeEmitter = new vscode.EventEmitter();
        this.onDidChange = this.onDidChangeEmitter.event;
    }

    async provideTextDocumentContent(uri, token) {
        return this.getContent(uri.path);
    }

    async getContent(path) {
        const dataArray = path.split(":");
        const id = dataArray[0];
        const page = Number(dataArray[1]);
        const totlePage = Number(dataArray[2]);
        return LIHKG.getThread(id, page, totlePage)
    }
}

module.exports = {
    LihkgTextDocContentProvider
}