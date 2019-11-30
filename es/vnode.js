/**Vnode对象类型
 *
 *
 * @export
 * @param {*} sel 节点类型，eg：div、span#a.b（<span id="a" class="b">）
 * @param {*} data 节点数据，包括style、attr、event等等
 * @param {*} children 子元素数组
 * @param {*} text 节点的文本内容
 * @param {*} elm 该vnode对应的真实的element
 * @returns
 */
// 值得注意的是，text按理可以放进children，不过因为有了text，那么肯定就没有children，反之亦然。所以单独放出来，便于处理
export function vnode(sel, data, children, text, elm) {
    // 用于vnode之间的比对
    let key = data === undefined ? undefined : data.key;
    return { sel, data, children, text, elm, key };
}
export default vnode;
