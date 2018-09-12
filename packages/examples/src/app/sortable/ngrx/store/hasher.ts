export function hasher(content: string) {
    // SubtleCrypto API returns promises, so that's too annoying
    // this is djb2 by djb.
    let hash = 5381;
    for (let i = 0; i < content.length; i++) {
        hash = (hash << 5) + hash + content.charCodeAt(i);
    }
    return hash;
}

