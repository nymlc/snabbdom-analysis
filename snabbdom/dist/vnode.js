export function vnode(sel, data, children, text, elm) {
    let key = data === undefined ? undefined : data.key;
    return { sel, data, children, text, elm, key };
}
export default vnode;
