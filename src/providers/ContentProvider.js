const vscode = require('vscode');

class LihkgTextDocContentProvider {
    constructor() {
        this.onDidChangeEmitter = new vscode.EventEmitter();
        this.onDidChange = this.onDidChangeEmitter.event;
    }
    provideTextDocumentContent(uri, token) {
        return uri.path;
    }
}

module.exports = {
    LihkgTextDocContentProvider
}