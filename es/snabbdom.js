import vnode from './vnode';
import * as is from './is';
import htmlDomApi from './htmldomapi';
function isUndef(s) { return s === undefined; }
function isDef(s) { return s !== undefined; }
const emptyNode = vnode('', {}, [], undefined, undefined);
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
// 根据子节点返回key-index map，便于根据key寻早节点
function createKeyToOldIdx(children, beginIdx, endIdx) {
    var _a;
    const map = {};
    for (let i = beginIdx; i <= endIdx; ++i) {
        const key = (_a = children[i]) === null || _a === void 0 ? void 0 : _a.key;
        if (key !== undefined) {
            map[key] = i;
        }
    }
    return map;
}
// 全局钩子只有这六种
// 节点钩子有8种 init create insert prepatch update postpatch destroy remove 
const hooks = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];
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
    let i, j, cbs = {};
    const api = domApi !== undefined ? domApi : htmlDomApi;
    // 把传入的modules里提供的方法按照hooks分门别类存入cbs，方便之后调用
    for (i = 0; i < hooks.length; ++i) {
        cbs[hooks[i]] = [];
        for (j = 0; j < modules.length; ++j) {
            const hook = modules[j][hooks[i]];
            if (hook !== undefined) {
                cbs[hooks[i]].push(hook);
            }
        }
    }
    // 把真实的dom转成vnode
    function emptyNodeAt(elm) {
        const id = elm.id ? '#' + elm.id : '';
        const c = elm.className ? '.' + elm.className.split(' ').join('.') : '';
        return vnode(api.tagName(elm).toLowerCase() + id + c, {}, [], undefined, elm);
    }

    /**
     * 创建一个删除的回调，根据传入的remove监听器的数量，每次回调运行都会--，为0的时候真正删除元素
     *
     * @param {*} childElm 要删除的子节点
     * @param {*} listeners 监听器的个数
     * @returns
     */
    function createRmCb(childElm, listeners) {
        return function rmCb() {
            if (--listeners === 0) {
                const parent = api.parentNode(childElm);
                api.removeChild(parent, childElm);
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
        let i, data = vnode.data;
        if (data !== undefined) {
            // 就是获取init hook
            /**
                h('div', {
                    hook: {
                        init(vnode) {
                            console.log(vnode)
                        }
                    }
                }, [12])
             */
            // const init = data.hook?.init;
            const init = (_a = data.hook) === null || _a === void 0 ? void 0 : _a.init;
            if (isDef(init)) {
                init(vnode);
                // 因为init hook可能处理了这个vnode导致vnode.data有变化，这里缓存下data下文待用
                data = vnode.data;
            }
        }
        let children = vnode.children, sel = vnode.sel;
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
            const hashIdx = sel.indexOf('#');
            const dotIdx = sel.indexOf('.', hashIdx);
            // 若是id或者class没有的话那么就赋予sel字符长度
            // 和下文的if (hash < dot)配套
            const hash = hashIdx > 0 ? hashIdx : sel.length;
            const dot = dotIdx > 0 ? dotIdx : sel.length;
            // 解析出tagName
            const tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
            
            // 看情况调用createElementNS、或者createElement
            const elm = vnode.elm = isDef(data) && isDef(i = data.ns)
                ? api.createElementNS(i, tag)
                : api.createElement(tag);
            // 要是hash小于dot的话，那么肯定有id，因为id只能在前   #a --> a
            // 没有class的话，dot就是sel长度，也是必然大于大于hash的
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
                    const ch = children[i];
                    if (ch != null) {
                        api.appendChild(elm, createElm(ch, insertedVnodeQueue));
                    }
                }
            }
            // 若是存在文本子节点
            else if (is.primitive(vnode.text)) {
                api.appendChild(elm, api.createTextNode(vnode.text));
            }
            const hook = vnode.data.hook;
            /*
            h('rect', {
                hook: {
                    insert(vnode) {
                        console.log(vnode)
                    }
                }
            })
            */
            if (isDef(hook)) {
                // if (hook.create) hook.create(emptyNode, vnode)
                (_c = (_b = hook).create) === null || _c === void 0 ? void 0 : _c.call(_b, emptyNode, vnode);
                if (hook.insert) {
                    // 若是有insert钩子，那么则将其回调push到insertedVnodeQueue，最后在patch批量触发
                    insertedVnodeQueue.push(vnode);
                }
            }
        }
        else {
            // 没有声明sel，那么就是文本节点，这里其实就是h.js ln: 115
            vnode.elm = api.createTextNode(vnode.text);
        }
        // 返回以上创建的elm
        return vnode.elm;
    }

    /**
     * 批量插入节点
     *
     * @param {*} parentElm 插入到该节点下
     * @param {*} before 插入的相对位置，为null的话那么就是插入到结尾
     * @param {*} vnodes 待插入的nodes数组
     * @param {*} startIdx 插入的开始索引
     * @param {*} endIdx 插入的结束索引，也就是vnodes不一定全部插入
     * @param {*} insertedVnodeQueue
     */
    function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
        for (; startIdx <= endIdx; ++startIdx) {
            const ch = vnodes[startIdx];
            if (ch != null) {
                api.insertBefore(parentElm, createElm(ch, insertedVnodeQueue), before);
            }
        }
    }

    /**
     *手动触发全局以及传入的节点以及其子节点的destory回调
     *
     * @param {*} vnode
     */
    function invokeDestroyHook(vnode) {
        var _a, _b, _c, _d;
        const data = vnode.data;
        if (data !== undefined) {
            // data?.hook?.destroy?.(vnode);
            // 也就是调用该节点的destory回调
            (_d = (_b = (_a = data) === null || _a === void 0 ? void 0 : _a.hook) === null || _b === void 0 ? void 0 : (_c = _b).destroy) === null || _d === void 0 ? void 0 : _d.call(_c, vnode);
            // 触发全局destory回调
            for (let i = 0; i < cbs.destroy.length; ++i)
                cbs.destroy[i](vnode);
            // 递归触发子节点回调
            if (vnode.children !== undefined) {
                for (let j = 0; j < vnode.children.length; ++j) {
                    const child = vnode.children[j];
                    if (child != null && typeof child !== "string") {
                        invokeDestroyHook(child);
                    }
                }
            }
        }
    }

    /**批量删除dom节点
     *就像[vnode1, vnode2]，想删除俩，xxxIdx就得传0, 1
     *
     * @param {*} parentElm 待删除元素的父节点
     * @param {*} vnodes 待删除的节点
     * @param {*} startIdx 删除的起始坐标
     * @param {*} endIdx 删除的结束坐标
     */
    function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
        var _a, _b, _c;
        for (; startIdx <= endIdx; ++startIdx) {
            let listeners, rm, ch = vnodes[startIdx];
            if (ch != null) {
                // 非文本节点就得考虑触发destory之类钩子
                if (isDef(ch.sel)) {
                    // 手动触发destory钩子回调
                    invokeDestroyHook(ch);
                    // 这个+1加的就是因为节点可能有节点remove钩子
                    listeners = cbs.remove.length + 1;
                    // 创建删除回调
                    rm = createRmCb(ch.elm, listeners);
                    for (let i = 0; i < cbs.remove.length; ++i)
                        cbs.remove[i](ch, rm);
                    // const removeHook = ch?.data?.hook?.remove;
                    // 若是该节点有节点删除钩子，那么调用钩子之后再调删除回调
                    const removeHook = (_c = (_b = (_a = ch) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.hook) === null || _c === void 0 ? void 0 : _c.remove;
                    if (isDef(removeHook)) {
                        removeHook(ch, rm);
                    }
                    else {
                        rm();
                    }
                }
                else { // Text node
                    // 文本节点直接删除该节点即可
                    api.removeChild(parentElm, ch.elm);
                }
            }
        }
    }

    /** 
     * 这里是（核心逻辑），也就是如何比较新旧children且更新到dom树
     * 这里会的改变真实的节点顺序
     *
     * @param {*} parentElm 因为涉及到children的更新，所以需要一个父节点
     * @param {*} oldCh 父节点下的旧子节点数组
     * @param {*} newCh 父节点下的新子节点数组
     * @param {*} insertedVnodeQueue
     */
    function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {
        // 新旧开始\结束子节点的索引\节点
        // 新旧开始\结束子节点
        let oldStartIdx = 0, newStartIdx = 0;
        let oldEndIdx = oldCh.length - 1;
        let oldStartVnode = oldCh[0];
        let oldEndVnode = oldCh[oldEndIdx];
        let newEndIdx = newCh.length - 1;
        let newStartVnode = newCh[0];
        let newEndVnode = newCh[newEndIdx];
        // 根据（将需要比对的）旧节点children数组转成key-index映射
        let oldKeyToIdx;
        let idxInOld;
        let elmToMove;
        let before;
        /** 5个比对规则
            1. 旧新首首比对，旧新首索引右移
            2. 旧新尾尾比对，旧新尾索引左移
            3. 旧新首尾比对，旧首索引右移、新尾索引左移
            4. 旧新尾首比对，旧尾索引左移、新首索引右移
            5. 旧新通过key找寻在旧节点组相同的新首节点，新首索引右移（因为新首节点已经比对过了）
         */
        // 新旧节点组有一个遍历完毕就退出循环
        while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
            // 跳过空节点，（规则5的处理）
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
                // 规则1
                patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
                oldStartVnode = oldCh[++oldStartIdx];
                newStartVnode = newCh[++newStartIdx];
            }
            else if (sameVnode(oldEndVnode, newEndVnode)) {
                // 规则2
                patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
                oldEndVnode = oldCh[--oldEndIdx];
                newEndVnode = newCh[--newEndIdx];
            }
            else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
                // 规则3
                patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
                // 插入到旧尾节点之后每一位旧尾结点之后是已经处理过的正确DOM
                api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm));
                oldStartVnode = oldCh[++oldStartIdx];
                newEndVnode = newCh[--newEndIdx];
            }
            else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
                // 规则4
                patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
                // 因为旧尾节点匹配到了，所以把旧尾结点插入到旧首节点的前面
                // 因为首节点之前都是已经处理过的正确DOM
                api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
                oldEndVnode = oldCh[--oldEndIdx];
                newStartVnode = newCh[++newStartIdx];
            }
            else {
                // 创建key-index的map，方便找寻节点
                if (oldKeyToIdx === undefined) {
                    oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
                }
                // 因为之前四个规则都没通过，所以只能将新节点组的首节点作为处理目标
                // 首先根据key在旧节点组找到这个处理目标相似的节点索引
                idxInOld = oldKeyToIdx[newStartVnode.key];
                if (isUndef(idxInOld)) { // New element
                    // 没找到，那么该处理目标必然是新节点
                    api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
                    newStartVnode = newCh[++newStartIdx];
                }
                else {
                    // 找到了，那么取到这个需要移动的旧节点
                    elmToMove = oldCh[idxInOld];
                    // 因为只是key一样，所以需要判断下sel是否一样
                    if (elmToMove.sel !== newStartVnode.sel) {
                        // sel不一样，那么就将这个处理目标转成真实DOM，插入
                        api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
                    }
                    else {
                        // 一样的话其实就相当于前四个规则的sameVnode
                        patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
                        // 然后将旧节点组中对应节点设置为undefined, 代表已经遍历过了，不在遍历
                        // 否则的话没有置为空，就索引没变，那么必然会又遍历到这个已经处理过的节点，就会引发错误
                        // 之前四个规则是相对于++\--索引，这个没办法，因为是无序的
                        oldCh[idxInOld] = undefined;
                        // 插入
                        api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
                    }
                    newStartVnode = newCh[++newStartIdx];
                }
            }
        }
        if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
            // 这里因为是就节点组遍历完毕，所以可能新节点组还有新的节点待添加。
            if (oldStartIdx > oldEndIdx) {
                before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
                addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
            }
            // 反之要是新节点组遍历完，那么可能有旧节点待删除
            else {
                removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
            }
        }
    }

    /**
     *这里是对node进行真正的patch
     这里有个前提，也就是若是进入到这个方法，前提就是通过了sameVnode
        1. 新节点是文本节点，删除旧节点，设置节点文本
        2. 新节点不是文本节点，那么分一下三种：
            i. 新旧子节点都在，走updateChildren
           ii. 新子节点在，旧节点是文本节点。清除旧文本节点，添加新子节点即可
          iii. 新子节点不在旧子节点在，删除旧子节点即可
         iiii. 新子节点不在，旧节点是文本节点，清除文本节点
     * 
     * @param {*} oldVnode
     * @param {*} vnode
     * @param {*} insertedVnodeQueue
     * @returns
     */
    function patchVnode(oldVnode, vnode, insertedVnodeQueue) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        /*
            在patch之前，先调用vnode.data的prepatch钩子
            const hook = vnode.data?.hook;
            hook?.prepatch?.(oldVnode, vnode);
        */
        const hook = (_a = vnode.data) === null || _a === void 0 ? void 0 : _a.hook;
        (_d = (_b = hook) === null || _b === void 0 ? void 0 : (_c = _b).prepatch) === null || _d === void 0 ? void 0 : _d.call(_c, oldVnode, vnode);
        
        const elm = vnode.elm = oldVnode.elm;
        let oldCh = oldVnode.children;
        let ch = vnode.children;
        // 新旧vnode一样的话那么必然没变化，返回即可
        if (oldVnode === vnode)
            return;
        // 若是新vnode有数据，那么调用模块的update回调更新内容，并且调用update hook
        if (vnode.data !== undefined) {
            for (let i = 0; i < cbs.update.length; ++i)
                cbs.update[i](oldVnode, vnode);
            (_g = (_e = vnode.data.hook) === null || _e === void 0 ? void 0 : (_f = _e).update) === null || _g === void 0 ? void 0 : _g.call(_f, oldVnode, vnode);
        }
        // 若不是文本节点
        if (isUndef(vnode.text)) {
            if (isDef(oldCh) && isDef(ch)) {
                // 新旧子节点都在，且不相同，那么更新子节点
                // 这里是（核心逻辑），也就是如何比较新旧children且更新
                if (oldCh !== ch)
                    updateChildren(elm, oldCh, ch, insertedVnodeQueue);
            }
            else if (isDef(ch)) {
                // 若是只是新的子节点存在，那么要是旧的是文本子节点那么清除即可
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
        //patch完，触发postpatch钩子
        // hook?.postpatch?.(oldVnode, vnode);
        (_k = (_h = hook) === null || _h === void 0 ? void 0 : (_j = _h).postpatch) === null || _k === void 0 ? void 0 : _k.call(_j, oldVnode, vnode);
    }
    return function patch(oldVnode, vnode) {
        let i, elm, parent;
        // 创建插入队列，最终都是传入到createElm方法里push要转成dom的每一个vnode
        const insertedVnodeQueue = [];
        // 
        for (i = 0; i < cbs.pre.length; ++i)
            cbs.pre[i]();
        if (!isVnode(oldVnode)) {
            oldVnode = emptyNodeAt(oldVnode);
        }
        if (sameVnode(oldVnode, vnode)) {
            // 若是俩节点相似，那么更新即可
            patchVnode(oldVnode, vnode, insertedVnodeQueue);
        }
        else {
            // 若是不相似，那么把旧节点整个干掉，替换成新的即可
            elm = oldVnode.elm;
            // 获取现有节点的父元素，用于之后插入新元素以及删除旧元素
            parent = api.parentNode(elm);
            // 创建新元素dom
            createElm(vnode, insertedVnodeQueue);
            if (parent !== null) {
                // 这时候vnode里以及挂载了新创建的elm，插入到旧元素之后
                api.insertBefore(parent, vnode.elm, api.nextSibling(elm));
                // 真正去删除旧节点
                removeVnodes(parent, [oldVnode], 0, 0);
            }
        }
        // 循环遍历触发insert钩子，这时候已经插入到DOM树了
        for (i = 0; i < insertedVnodeQueue.length; ++i) {
            insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);
        }
        // patch完成后触发post回调
        for (i = 0; i < cbs.post.length; ++i)
            cbs.post[i]();
        return vnode;
    };
}
