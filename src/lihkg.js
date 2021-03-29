const { create } = require("lihkg-api");
const { PostOrder } = require("lihkg-api/dist/api");
const { commands } = require("vscode");
const { CommandContext } = require("./constants");
const re = /<img src=\"((\/assets)\/(.*?)\.(.*?))\" class="hkgmoji" \/>/g
const style = `
<link>
<style>
.post{
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
function formatDate(replayTime) {
    const now = new Date().getTime()
    const postDate = Number(replayTime) * 1000
    const passMillisec = now - postDate;
    const { interval, scale } = toDynamicDate(passMillisec);

    return `${Math.floor(interval)} ${scale}${interval > 1 ? "s" : ""} ago`
}

function toDynamicDate(millisecond) {
    if ((millisecond /= 1e3) > 1 && millisecond < 60)
        return { interval: millisecond, scale: "second" };
    if ((millisecond /= 60) > 1 && millisecond < 60)
        return { interval: millisecond, scale: "minute" };
    if ((millisecond /= 60) > 1 && millisecond < 24)
        return { interval: millisecond, scale: "hour" };
    if ((millisecond /= 24) > 1 && millisecond < 30)
        return { interval: millisecond, scale: "day" };
    if ((millisecond /= 30) > 1 && millisecond < 365 / 30)
        return { interval: millisecond, scale: "month" };
    if ((millisecond = millisecond * 30 / 365) > 1)
        return { interval: millisecond, scale: "year" };
}

/** @param {import("lihkg-api/dist/model").ContentJSON} thread */
function transformThread({ response: { title, item_data, like_count, dislike_count } }) {
    // main post's like is same as thread's like 
    Object.assign(item_data[0], { like_count, dislike_count })
    const ret = `${style}
# ${title}
${item_data.map(transformPost).join("")}
`;
    return ret
}

/** @param {import("lihkg-api/dist/model").Post} post  */
function transformPost({ reply_time, msg, user_nickname, msg_num, like_count, dislike_count }) {
    const emojiParsed = msg.replace(re, '<img src="https://cdn.lihkg.com$1" class="hkgmoji" \/>')
    const metaInfo = `> ${msg_num} ${user_nickname} ${formatDate(reply_time)}`
    const comment = `<span>▲${like_count}</span><span>▼${dislike_count}</span>`
    const ret = `
${metaInfo}
<div class="post">
    <div class="like">
        ${comment}
    </div>
    <div>
        ${emojiParsed}
    </div>
</div>
`
    return ret
}

async function getThread(id, page, totlePage) {
    const client = await create();
    const req = {
        thread_id: id,
        page: page,
        order: PostOrder.replyTime
    };
    const res = await client.getThreadContent(req);

    await commands.executeCommand("setContext", CommandContext.maxPage, (totlePage <= page));
    await commands.executeCommand("setContext", CommandContext.firstPage, (1 == page));
    console.log(res);
    return transformThread(res)
}

exports.LIHKG = {
    getThread
}