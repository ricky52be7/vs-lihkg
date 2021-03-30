const CommandContext = {
    maxPage: 'vs-lihkg:maxPage',
    firstPage: 'vs-lihkg:firstPage'
};

const Constants = {
    SCHEME: 'vs-lihkg',
    INPUT_ERROR: 'page number is out of range'
}

const ImgTagRE = /<img src=\"((\/assets)\/(.*?)\.(.*?))\" class="hkgmoji" \/>/g
const Style = `<style>
    .post{
        padding-bottom: 0.5rem;
        display: flex;
    }
    .like{
        display: flex;
        justify-content: space-between;
    }
    .like > span{
        padding-left: 0.5rem;
        padding-right: 0.5rem;
        cursor: pointer;
        color: gray;
    }
</style>
`
module.exports = {
    CommandContext,
    Constants,
    Markdown: { ImgTagRE, Style }
};