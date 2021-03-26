const { create } = require("lihkg-api");
const { PostOrder } = require("lihkg-api/dist/api");
const { commands } = require("vscode");
const { CommandContext } = require("./constants");

function formatDate(replayTime) {
    return new Date(Number(replayTime) * 1000).toString();
}

/** @param {import("lihkg-api/dist/model").ContentJSON} thread */
function transformThread({ response: { title, item_data } }) {
    const ret = ` # ${title}
${item_data.map(transformPost)}
`;
    return ret
}

function transformPost({ reply_time, msg, user_nickname, msg_num }) {
    const metaInfo = `> ${msg_num} ${user_nickname} ${formatDate(reply_time)}`
    const ret = `
${metaInfo}

${msg}
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