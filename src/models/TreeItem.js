const vscode = require('vscode');
const { create } = require('lihkg-api');
const { Constants } = require('../constants');

class Category extends vscode.TreeItem {
    constructor(label, collapsibleState, catId, subCategory) {
        super(label, collapsibleState);
        this.catId = catId;
        this.subCategory = subCategory || [];
        this.page = 1;
    }
}

class SubCategory extends vscode.TreeItem {
    constructor(label, collapsibleState, catId, subId) {
        super(label, collapsibleState);
        this.contextValue = "subCategory";
        this.refreshCallback = null;
        this.catId = catId;
        this.subId = subId;
        this.page = 1;
        this.topics = [];
    }

    getTopic() {
        return create().then(client => {
            console.log('Querying Topic...');
            return client.getTopicList({
                cat_id: this.catId,
                page: this.page,
                count: 60,
                sub_cat_id: this.subId
            });
        }).then(rst => {
            console.log(rst);
            if (rst.success == 1) {
                rst.response.items.forEach(topic => {
                    this.topics.push(new Topic(topic, vscode.TreeItemCollapsibleState.None));
                });
            } else {
                vscode.window.showErrorMessage(rst.error_message);
            }
            return this.topics;
        });
    }

    nextPage() {
        this.page++;
        return this.getTopic();
    }

    refresh() {
        this.topics = [];
        this.page = 1;
        let self = this;
        return this.getTopic().then(topics => {
            if (self.refreshCallback != null) {
                self.refreshCallback();
            }
        });
    }

    setRefreshCallback(refreshCallback) {
        this.refreshCallback = refreshCallback;
    }
}
class Topic extends vscode.TreeItem {
    /**
     * @param {import('lihkg-api/dist/model').Thread} param0 
     * @param {*} collapsibleState 
     */
    constructor({ title, thread_id, total_page, like_count, dislike_count }, collapsibleState = vscode.TreeItemCollapsibleState.None) {
        super(title, collapsibleState);
        this.contextValue = "topic";
        this.command = {
            command: 'vs-lihkg.topic.showTopic',
            title: '',
            arguments: [this]
        };
        this.threadId = thread_id;
        this.page = 1;
        this.totalPage = total_page;
        this.description = `▲${like_count} ▼${dislike_count}`
    }

    async showTopic() {
        let styleConfig = vscode.workspace.getConfiguration().get("vslihkg.view.style");
        let uri;
        switch (styleConfig) {
            case 'JAVA':
            default:
                uri = vscode.Uri.parse(`${Constants.SCHEME_JAVA}:${this.threadId}:${this.page}:${this.totalPage}`);
                let doc = await vscode.workspace.openTextDocument(uri);
                await vscode.window.showTextDocument(doc, {preview: true});
                break;
            case 'Markdown':
                uri = vscode.Uri.parse(`${Constants.SCHEME_MARKDOWN}:${this.threadId}:${this.page}:${this.totalPage}`);
                await vscode.commands.executeCommand("markdown.showPreview", uri);

        }
        // let uri = vscode.Uri.parse(`${scheme}:${this.threadId}:${this.page}:${this.totalPage}`);
        // let doc = await vscode.workspace.openTextDocument(uri);
        // await vscode.window.showTextDocument(doc, {preview: true});
        // const uri = vscode.Uri.parse(`vs-lihkg:${this.threadId}:${this.page}:${this.totalPage}`);
        // await vscode.commands.executeCommand("markdown.showPreview", uri);
        
    }
    
    openInBrowser() {
        let uri = vscode.Uri.parse(`https://lihkg.com/thread/${this.threadId}`);
        vscode.commands.executeCommand("vscode.open", uri);
    }
}

class More extends vscode.TreeItem {
    constructor(callback) {
        super("More...", vscode.TreeItemCollapsibleState.None);
        this.callback = callback;
        this.command = {
            command: 'vs-lihkg.more.more',
            title: '',
            arguments: [this]
        };
    }

    more() {
        if (this.callback instanceof Function) {
            this.callback();
        }
    }
}

module.exports = {
    Category,
    SubCategory,
    Topic,
    More
}