const xlinkNS = 'http://www.w3.org/1999/xlink';
const xmlNS = 'http://www.w3.org/XML/1998/namespace';
const colonChar = 58;
const xChar = 120;
/**
 *
 *
 * @param {*} oldVnode 老node
 * @param {*} vnode 新node
 * @returns
 */
function updateAttrs(oldVnode, vnode) {
    var key, elm = vnode.elm, oldAttrs = oldVnode.data.attrs, attrs = vnode.data.attrs;
    if (!oldAttrs && !attrs)
        return;
    if (oldAttrs === attrs)
        return;
    oldAttrs = oldAttrs || {};
    attrs = attrs || {};
    // update modified attributes, add new attributes
    // 遍历新node的attrs，若是和旧的不一样，那么久更新attr
    for (key in attrs) {
        const cur = attrs[key];
        const old = oldAttrs[key];
        if (old !== cur) {
            if (cur === true) {
                // 若新的值是true，那么久设置为空
                // 其实就是<input autofocus />、<input autofocus="true" />
                elm.setAttribute(key, "");
            }
            else if (cur === false) {
                // 若是false，那么删掉这个属性
                elm.removeAttribute(key);
            }
            else {
                // 要是属性名是不是x开头，就像width、height
                if (key.charCodeAt(0) !== xChar) {
                    elm.setAttribute(key, cur);
                }
                // key: xml:lang
                else if (key.charCodeAt(3) === colonChar) {
                    // Assume xml namespace
                    elm.setAttributeNS(xmlNS, key, cur);
                }
                // key: xmlns:xlink、xlink:href
                else if (key.charCodeAt(5) === colonChar) {
                    // Assume xlink namespace
                    elm.setAttributeNS(xlinkNS, key, cur);
                }
                else {
                    elm.setAttribute(key, cur);
                }
            }
        }
    }
    // remove removed attributes
    // use `in` operator since the previous `for` iteration uses it (.i.e. add even attributes with undefined value)
    // the other option is to remove all attributes with value == undefined
    for (key in oldAttrs) {
        if (!(key in attrs)) {
            elm.removeAttribute(key);
        }
    }
}
export const attributesModule = { create: updateAttrs, update: updateAttrs };
export default attributesModule;
