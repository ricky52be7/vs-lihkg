const vscode = require('vscode');
const { create } = require('lihkg-api');

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
            rst.response.items.forEach(topic => {
                this.topics.push(new Topic(topic.title, vscode.TreeItemCollapsibleState.None, topic.thread_id));
            });
            return this.topics;
        }); 
    }

    nextPage() {
        this.page++;
        return this.getTopic();
    }
}
class Topic extends vscode.TreeItem {
    constructor(label, collapsibleState, threadId) {
        super(label, collapsibleState);
        this.command = {
            command: 'Topic.showTopic',
            title: '',
            arguments: [this]
        };
        this.threadId = threadId;
        this.page = 1;
    }

    async showTopic() {
        let uri = vscode.Uri.parse(`vs-lihkg:${this.threadId}`);
        let doc = await vscode.workspace.openTextDocument(uri);
        await vscode.window.showTextDocument(doc, {preview: true});
        try {
            vscode.commands.registerCommand('lihkg.nextPage', (v) => {
                //console.log(v);
                this.page++;
                this.showTopic();
            }, this);
        } catch(e) {
            console.log(e);
        }
    }
}

class More extends vscode.TreeItem {
    constructor(callback) {
        super("More...", vscode.TreeItemCollapsibleState.None);
        this.callback = callback;
        this.command = {
            command: 'More.more',
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