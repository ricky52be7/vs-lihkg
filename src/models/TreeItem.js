const vscode = require('vscode');
const { create, PostOrder } = require('lihkg-api');
const htmlToText = require('html-to-text');
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
        this.pageTheadhold = 10;
        this.downloading = false;
        this.posts = [];
    }

    download() {
        this.downloading = true;
        return create().then(client => {
            return client.getThreadContent({
                thread_id: this.threadId,
                page: this.page,
                order: PostOrder
            });
        }).then(rst => {
            this.posts = this.posts.concat(rst.response.item_data);
        });
    }

    showTopic() {
        this.download().then(async () => {
            let uri = vscode.Uri.parse(this.getContent(), true);
            let doc = await vscode.workspace.openTextDocument(uri);
            await vscode.window.showTextDocument(doc, { preview: false });
        }).then(() => {
            this.downloading = false;
            //this.addTextEditorVisibleRangesListener();
        });
    }

    async update(textEditor, document) {
        let currentRange = textEditor.visibleRanges[0];
        this.page++;
        this.download().then(async () => {
            let newContent = this.getContent().replace("vs-lihkg:", "");
            return textEditor.edit((editBuilder) => {
                editBuilder.replace(new vscode.Range(0, 0, document.lineCount, this.label.length + 2), newContent);
            });
            //await vscode.window.showTextDocument(newUri, { preview: false });
        }).then((success) => {
            this.downloading = false;
            //textEditor.revealRange(currentRange);
        });
    }

    addTextEditorVisibleRangesListener() {
        let self = this;
        vscode.window.onDidChangeTextEditorVisibleRanges(async (event) => {
            let textEditor = event.textEditor;
            //console.log(textEditor.document.uri.scheme);
            if (textEditor.document.uri.scheme != "vs-lihkg") {
                return;
            }
            if ((textEditor.visibleRanges[0].end.line > textEditor.document.lineCount - self.pageTheadhold) && !self.downloading) {
                await self.update(textEditor, textEditor.document);
            }
        });
    }

    getContent() {
        //console.log(thread);
        let doc = this.posts.map(data => {
            //console.log(data);
            return `\t${data.user_nickname}() {\n\t\t${htmlToText.fromString(data.msg).replace(/\n/g, '\n\t\t').replace(/\?/g, "%3F").replace(/#/g, "%23")}\n\t}`
        }).join('\n\n');

        return `vs-lihkg:public class ${this.label} {\n${doc}\n}\n\n//${this.label}`;
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