const vscode = require('vscode');


class Category extends vscode.TreeItem {
    constructor(label, collapsibleState) {
        super(label, collapsibleState);
    }
}

module.exports = {
    Category
}