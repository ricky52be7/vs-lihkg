const vscode = require('vscode');
const { create, PostOrder } = require('lihkg-api');
const htmlToText = require('html-to-text');

class LihkgTextDocContentProvider {
    constructor() {
        this.onDidChangeEmitter = new vscode.EventEmitter();
        this.onDidChange = this.onDidChangeEmitter.event;
    }

    provideTextDocumentContent(uri, token) {
        return this.getContent(uri);
    }

    getContent(uri) {
        return create().then(client => {
            return client.getThreadContent({
                thread_id: uri.path,
                page: 1,
                order: PostOrder
            });
        }).then(rst => {
            console.log(rst);
            let reply = rst.response.item_data.map(data => {
                return `\t${data.user_nickname}() {\n\t\t${htmlToText.fromString(data.msg).replace(/\n/g, '\n\t\t')}\n\t}`;
            }).join('\n\n');

            return `public class ${rst.response.title} {\n${reply}\n}`;
        });
    }
}

module.exports = {
    LihkgTextDocContentProvider
}