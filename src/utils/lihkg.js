const { create } = require("lihkg-api");
const { PostOrder } = require("lihkg-api/dist/api");
const { Markdown } = require("../constants");
const { convertLocalLink, formatDate } = require("./markdown");

function formPageRequest(thread_id, page) {
    return { thread_id: Number(thread_id), page, order: PostOrder.replyTime };
}

/** @param {import("lihkg-api/dist/model").ContentJSON} thread */
function transformThread({ response: { title, item_data, like_count, dislike_count } }) {
    // main post's like is same as thread's like 
    const mainPost = item_data.find(x => Number(x.post_id) == 1)

    if (!!mainPost)
        Object.assign(mainPost, { like_count, dislike_count })
    return `
${Markdown.Style}
# ${title}
${item_data.map(transformPost).join("")}
`
}

/** @param {import("lihkg-api/dist/model").Post} post  */
function transformPost({ reply_time, msg, user_nickname, msg_num, like_count, dislike_count }) {
    const parsedMsg = convertLocalLink(msg)
    const metaInfo = `> ${msg_num} ${user_nickname} ${formatDate(reply_time)}`
    const comment = `<span>▲${like_count}</span><span>▼${dislike_count}</span>`

    return `
${metaInfo}
<div class="post">
    <div class="like">
        ${comment}
    </div>
    <div>
        ${parsedMsg}
    </div>
</div>
`
}

async function getThread(id, page) {
    const client = await create();
    const res = await client.getThreadContent(formPageRequest(id, page));
    res.response.item_data = await getAllPost(res.response)
    console.log(res);
    const ret = transformThread(res);

    return ret
}

/**
 * @param {import("lihkg-api/dist/model").Thread } thread 
 * @returns {Promise<import("lihkg-api/dist/model").Post[]>}
 */
async function getAllPost({ thread_id, total_page, item_data }) {
    const ret = item_data ?? []
    const client = await create();
    if (!total_page) {
        const { response } = await client.getThreadContent(formPageRequest(thread_id, 1));
        ret.push(...response.item_data)
        total_page = response.total_page
    }
    if (total_page == 1)
        return ret
    const pageList = Array.from({ length: total_page }, (_, i) => i + 1).slice(1, total_page)
    const res = await Promise.all(pageList.map(async page => {
        const { response: { item_data } } = await client.getThreadContent(formPageRequest(thread_id, page));
        return item_data
    }))
    const coalesce = (acc, val) => acc.concat(val);

    ret.push(...res.reduce(coalesce, []))
    return ret
}

module.exports = {
    getThread
}
