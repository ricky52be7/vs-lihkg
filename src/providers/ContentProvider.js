const vscode = require('vscode');
const { getThread } = require('../utils/lihkg');

/**
 * @implements {vscode.TextDocumentContentProvider}
 */
class LihkgTextDocContentProvider {
    constructor() {
        this.onDidChangeEmitter = new vscode.EventEmitter();
        this.onDidChange = this.onDidChangeEmitter.event;
    }

    async provideTextDocumentContent(uri, _token) {
        const { id, page } = this.extractThreadInfo(uri.path);
        return getThread(id, page)
    }

    extractThreadInfo(path) {
        const dataArray = path.split(":");
        const id = dataArray[0];
        const page = Number(dataArray[1]);
        const totalPage = Number(dataArray[2]);
        return { id, page, totalPage };
    }
}

module.exports = {
    LihkgTextDocContentProvider
}