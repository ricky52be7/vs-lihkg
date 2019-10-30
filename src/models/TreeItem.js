const vscode = require('vscode');

class Category extends vscode.TreeItem {
    constructor(label, collapsibleState, id) {
        super(label, collapsibleState);
        this.id = id;
    }
}

class Topic extends vscode.TreeItem {
    constructor(label, collapsibleState) {
        super(label, collapsibleState);
    }
}

module.exports = {
    Category,
    Topic
}