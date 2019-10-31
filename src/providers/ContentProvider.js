class LihkgTextDocContentProvider {
    provideTextDocumentContent(uri, token) {
        return uri.path;
    }
}

module.exports = {
    LihkgTextDocContentProvider
}