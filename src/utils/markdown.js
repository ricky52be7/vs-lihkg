const { Markdown } = require("../constants");

function convertLocalLink(htmlForPost) {
    return htmlForPost.replace(Markdown.ImgTagRE, '<img src="https://cdn.lihkg.com$1" class="hkgmoji" \/>');
}

function formatDate(replayTime) {
    const now = new Date().getTime()
    const postDate = Number(replayTime) * 1000
    const passMillisec = now - postDate;
    const { interval, scale } = toRelativeDate(passMillisec);

    return `${Math.floor(interval)} ${scale}${interval > 1 ? "s" : ""} ago`
}

function toRelativeDate(millisecond) {
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

module.exports = {
    convertLocalLink,
    formatDate
};