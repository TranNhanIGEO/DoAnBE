const replace_regexp = (str) => {
    return str
        .replace(/[^\w ]/g, '')
        .trim()
}

module.exports = replace_regexp