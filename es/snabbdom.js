import vnode from './vnode';
import * as is from './is';
import htmlDomApi from './htmldomapi';
function isUndef(s) { return s === undefined; }
function isDef(s) { return s !== undefined; }
var emptyNode = vnode('', {}, [], undefined, undefined);
/**
 *判断俩个node是否一样，也就是是否需要被替换
 *
 * @param {*} vnode1
 * @param {*} vnode2
 * @returns
 */
function sameVnode(vnode1, vnode2) {
    // key一样，且节点type也得一样
    // 这俩一样的话其它的修改下属性就好了
    return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
}

function isVnode(vnode) {
    return vnode.sel !== undefined;
}
function createKeyToOldIdx(children, beginIdx, endIdx) {
    var _a;
    var map = {};
    for (var i = beginIdx; i <= endIdx; ++i) {
        var key = (_a = children[i]) === null || _a === void 0 ? void 0 : _a.key;
        if (key !== undefined) {
            map[key] = i;
        }
    }
    return map;
}
var hooks = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];
export { h } from './h';
export { thunk } from './thunk';

/**
 *根据传入的modules和domApi返回一个path函数
 *方便扩展，而且不同的平台就像Weex的domApi也可以自定义
 * 
 * @export
 * @param {*} modules 
 * @param {*} domApi
 * @returns
 */
export function init(modules, domApi) {
    var i, j, cbs = {};
    var api = domApi !== undefined ? domApi : htmlDomApi;
    // 把传入的modules里提供的方法按照hooks分门别类存入cbs，方便之后调用
    for (i = 0; i < hooks.length; ++i) {
        cbs[hooks[i]] = [];
        for (j = 0; j < modules.length; ++j) {
            var hook = modules[j][hooks[i]];
            if (hook !== undefined) {
                cbs[hooks[i]].push(hook);
            }
        }
    }
    // 把真是的dom转成vnode
    function emptyNodeAt(elm) {
        var id = elm.id ? '#' + elm.id : '';
        var c = elm.className ? '.' + elm.className.split(' ').join('.') : '';
        return vnode(api.tagName(elm).toLowerCase() + id + c, {}, [], undefined, elm);
    }
    function createRmCb(childElm, listeners) {
        return function rmCb() {
            if (--listeners === 0) {
                var parent_1 = api.parentNode(childElm);
                api.removeChild(parent_1, childElm);
            }
        };
    }
    /**
     *把vnode转成真实dom
     *
     * @param {*} vnode
     * @param {*} insertedVnodeQueue
     * @returns
     */
    function createElm(vnode, insertedVnodeQueue) {
        var _a, _b, _c;
        var i, data = vnode.data;
        if (data !== undefined) {
            var init_1 = (_a = data.hook) === null || _a === void 0 ? void 0 : _a.init;
            if (isDef(init_1)) {
                init_1(vnode);
                data = vnode.data;
            }
        }
        var children = vnode.children, sel = vnode.sel;
        // sel为!，代表注释节点
        if (sel === '!') {
            // 处理text为undefined情况
            if (isUndef(vnode.text)) {
                vnode.text = '';
            }
            // 创建注释节点且挂载到elm属性上
            vnode.elm = api.createComment(vnode.text);
        }
        else if (sel !== undefined) {
            // Parse selector
            var hashIdx = sel.indexOf('#');
            var dotIdx = sel.indexOf('.', hashIdx);
            // 若是id或者class没有的话
            var hash = hashIdx > 0 ? hashIdx : sel.length;
            var dot = dotIdx > 0 ? dotIdx : sel.length;
            // 解析出tagName
            var tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
            
            // 看情况调用createElementNS、或者createElement
            var elm = vnode.elm = isDef(data) && isDef(i = data.ns)
                ? api.createElementNS(i, tag)
                : api.createElement(tag);
            // 要是hash小于dot的话，那么肯定有id，因为id只能在前   #a --> a
            if (hash < dot)
                elm.setAttribute('id', sel.slice(hash + 1, dot));
            // 设置class   .a.b --> a b
            if (dotIdx > 0)
                elm.setAttribute('class', sel.slice(dot + 1).replace(/\./g, ' '));
            // 调用module create
            for (i = 0; i < cbs.create.length; ++i)
                cbs.create[i](emptyNode, vnode);
            // 若是存在子元素vnode节点，那么递归将子元素插入当前vnode节点中
            if (is.array(children)) {
                for (i = 0; i < children.length; ++i) {
                    var ch = children[i];
                    if (ch != null) {
                        api.appendChild(elm, createElm(ch, insertedVnodeQueue));
                    }
                }
            }
            // 若是存在文本子节点
            else if (is.primitive(vnode.text)) {
                api.appendChild(elm, api.createTextNode(vnode.text));
            }
            var hook = vnode.data.hook;
            if (isDef(hook)) {
                (_c = (_b = hook).create) === null || _c === void 0 ? void 0 : _c.call(_b, emptyNode, vnode);
                if (hook.insert) {
                    insertedVnodeQueue.push(vnode);
                }
            }
        }
        else {
            vnode.elm = api.createTextNode(vnode.text);
        }
        return vnode.elm;
    }
    function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
        for (; startIdx <= endIdx; ++startIdx) {
            var ch = vnodes[startIdx];
            if (ch != null) {
                api.insertBefore(parentElm, createElm(ch, insertedVnodeQueue), before);
            }
        }
    }
    function invokeDestroyHook(vnode) {
        var _a, _b, _c, _d;
        var data = vnode.data;
        if (data !== undefined) {
            (_d = (_b = (_a = data) === null || _a === void 0 ? void 0 : _a.hook) === null || _b === void 0 ? void 0 : (_c = _b).destroy) === null || _d === void 0 ? void 0 : _d.call(_c, vnode);
            for (var i_1 = 0; i_1 < cbs.destroy.length; ++i_1)
                cbs.destroy[i_1](vnode);
            if (vnode.children !== undefined) {
                for (var j_1 = 0; j_1 < vnode.children.length; ++j_1) {
                    var child = vnode.children[j_1];
                    if (child != null && typeof child !== "string") {
                        invokeDestroyHook(child);
                    }
                }
            }
        }
    }
    function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
        var _a, _b, _c;
        for (; startIdx <= endIdx; ++startIdx) {
            var listeners = void 0, rm = void 0, ch = vnodes[startIdx];
            if (ch != null) {
                if (isDef(ch.sel)) {
                    invokeDestroyHook(ch);
                    listeners = cbs.remove.length + 1;
                    rm = createRmCb(ch.elm, listeners);
                    for (var i_2 = 0; i_2 < cbs.remove.length; ++i_2)
                        cbs.remove[i_2](ch, rm);
                    var removeHook = (_c = (_b = (_a = ch) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.hook) === null || _c === void 0 ? void 0 : _c.remove;
                    if (isDef(removeHook)) {
                        removeHook(ch, rm);
                    }
                    else {
                        rm();
                    }
                }
                else { // Text node
                    api.removeChild(parentElm, ch.elm);
                }
            }
        }
    }
    function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {
        var oldStartIdx = 0, newStartIdx = 0;
        var oldEndIdx = oldCh.length - 1;
        var oldStartVnode = oldCh[0];
        var oldEndVnode = oldCh[oldEndIdx];
        var newEndIdx = newCh.length - 1;
        var newStartVnode = newCh[0];
        var newEndVnode = newCh[newEndIdx];
        var oldKeyToIdx;
        var idxInOld;
        var elmToMove;
        var before;
        while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
            if (oldStartVnode == null) {
                oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
            }
            else if (oldEndVnode == null) {
                oldEndVnode = oldCh[--oldEndIdx];
            }
            else if (newStartVnode == null) {
                newStartVnode = newCh[++newStartIdx];
            }
            else if (newEndVnode == null) {
                newEndVnode = newCh[--newEndIdx];
            }
            else if (sameVnode(oldStartVnode, newStartVnode)) {
                patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
                oldStartVnode = oldCh[++oldStartIdx];
                newStartVnode = newCh[++newStartIdx];
            }
            else if (sameVnode(oldEndVnode, newEndVnode)) {
                patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
                oldEndVnode = oldCh[--oldEndIdx];
                newEndVnode = newCh[--newEndIdx];
            }
            else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
                patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
                api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm));
                oldStartVnode = oldCh[++oldStartIdx];
                newEndVnode = newCh[--newEndIdx];
            }
            else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
                patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
                api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
                oldEndVnode = oldCh[--oldEndIdx];
                newStartVnode = newCh[++newStartIdx];
            }
            else {
                if (oldKeyToIdx === undefined) {
                    oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
                }
                idxInOld = oldKeyToIdx[newStartVnode.key];
                if (isUndef(idxInOld)) { // New element
                    api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
                    newStartVnode = newCh[++newStartIdx];
                }
                else {
                    elmToMove = oldCh[idxInOld];
                    if (elmToMove.sel !== newStartVnode.sel) {
                        api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
                    }
                    else {
                        patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
                        oldCh[idxInOld] = undefined;
                        api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
                    }
                    newStartVnode = newCh[++newStartIdx];
                }
            }
        }
        if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
            if (oldStartIdx > oldEndIdx) {
                before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
                addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
            }
            else {
                removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
            }
        }
    }
    function patchVnode(oldVnode, vnode, insertedVnodeQueue) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        var hook = (_a = vnode.data) === null || _a === void 0 ? void 0 : _a.hook;
        (_d = (_b = hook) === null || _b === void 0 ? void 0 : (_c = _b).prepatch) === null || _d === void 0 ? void 0 : _d.call(_c, oldVnode, vnode);
        var elm = vnode.elm = oldVnode.elm;
        var oldCh = oldVnode.children;
        var ch = vnode.children;
        if (oldVnode === vnode)
            return;
        if (vnode.data !== undefined) {
            for (var i_3 = 0; i_3 < cbs.update.length; ++i_3)
                cbs.update[i_3](oldVnode, vnode);
            (_g = (_e = vnode.data.hook) === null || _e === void 0 ? void 0 : (_f = _e).update) === null || _g === void 0 ? void 0 : _g.call(_f, oldVnode, vnode);
        }
        if (isUndef(vnode.text)) {
            if (isDef(oldCh) && isDef(ch)) {
                if (oldCh !== ch)
                    updateChildren(elm, oldCh, ch, insertedVnodeQueue);
            }
            else if (isDef(ch)) {
                if (isDef(oldVnode.text))
                    api.setTextContent(elm, '');
                addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
            }
            else if (isDef(oldCh)) {
                removeVnodes(elm, oldCh, 0, oldCh.length - 1);
            }
            else if (isDef(oldVnode.text)) {
                api.setTextContent(elm, '');
            }
        }
        else if (oldVnode.text !== vnode.text) {
            if (isDef(oldCh)) {
                removeVnodes(elm, oldCh, 0, oldCh.length - 1);
            }
            api.setTextContent(elm, vnode.text);
        }
        (_k = (_h = hook) === null || _h === void 0 ? void 0 : (_j = _h).postpatch) === null || _k === void 0 ? void 0 : _k.call(_j, oldVnode, vnode);
    }
    return function patch(oldVnode, vnode) {
        var i, elm, parent;
        var insertedVnodeQueue = [];
        for (i = 0; i < cbs.pre.length; ++i)
            cbs.pre[i]();
        if (!isVnode(oldVnode)) {
            oldVnode = emptyNodeAt(oldVnode);
        }
        if (sameVnode(oldVnode, vnode)) {
            patchVnode(oldVnode, vnode, insertedVnodeQueue);
        }
        else {
            elm = oldVnode.elm;
            parent = api.parentNode(elm);
            createElm(vnode, insertedVnodeQueue);
            if (parent !== null) {
                api.insertBefore(parent, vnode.elm, api.nextSibling(elm));
                removeVnodes(parent, [oldVnode], 0, 0);
            }
        }
        for (i = 0; i < insertedVnodeQueue.length; ++i) {
            insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);
        }
        for (i = 0; i < cbs.post.length; ++i)
            cbs.post[i]();
        return vnode;
    };
}
//# sourceMappingURL=snabbdom.js.map