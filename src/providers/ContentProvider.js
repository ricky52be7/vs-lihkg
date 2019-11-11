const vscode = require('vscode');
const { create, PostOrder } = require('lihkg-api');
const htmlToText = require('html-to-text');
const { CommandContext } = require('../constants');

class LihkgTextDocContentProvider {
    constructor() {
        this.onDidChangeEmitter = new vscode.EventEmitter();
        this.onDidChange = this.onDidChangeEmitter.event;
    }

    provideTextDocumentContent(uri, token) {
        return this.getContent(uri.path);
    }

    getContent(path) {
        let dataArray = path.split(":");
        let id = dataArray[0];
        let page = Number(dataArray[1]);
        let totlePage = Number(dataArray[2]);
        let result;
        return create().then(client => {
            return client.getThreadContent({
                thread_id: id,
                page: page,
                order: PostOrder
            });
        }).then(rst => {
            console.log(rst);
            result = rst;
            return vscode.commands.executeCommand("setContext", CommandContext.maxPage, (totlePage <= page));
        }).then(() => {
            return vscode.commands.executeCommand("setContext", CommandContext.firstPage, (1 == page));
        }).then(() => {
            let reply = result.response.item_data.map(data => {
                return `\t${data.user_nickname}() {\n\t\t${htmlToText.fromString(data.msg).replace(/\n/g, '\n\t\t')}\n\t}`;
            }).join('\n\n');

            return `public class ${result.response.title} {\n${reply}\n}`;
        });
    }
}

module.exports = {
    LihkgTextDocContentProvider
}