(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["snabbdom"] = factory();
	else
		root["snabbdom"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = h;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vnode__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__is__ = __webpack_require__(2);



/**
 *svg使用xml格式定义图图像，所以需要给svg添加namespace，也就是它内部的标签节点需要按照svg标准来渲染
 *
 * @param {*} data svg vnode的data
 * @param {*} children 
 * @param {*} sel svg、svg#xxx、svg.xxx
 */
/*
const vnode = h('svg', {
    attrs: {
        width: '100%',
        height: '100%'
    },
}, [h('rect', {
    attrs: {
        width: 300,
        height: 100
    },
    style: {
        fill: 'rgb(0, 0, 255)',
        strokeWidth: 1,
        stroke: 'rgb(0, 0, 0)'
    }
})])
*/
function addNS(data, children, sel) {
    data.ns = 'http://www.w3.org/2000/svg';
    // <foreignObject>元素的作用是可以在其中使用具有其它XML命名空间的XML元素
    // 就像它内部可以使用xhtml标准解析
    // <svg xmlns="http://www.w3.org/2000/svg">
    //     <foreignObject width="120" height="50">
    //         <body xmlns="http://www.w3.org/1999/xhtml">
    //             <p>文字。</p>
    //         </body>
    //     </foreignObject>
    // </svg>
    // 它本身不用添加ns
    if (sel !== 'foreignObject' && children !== undefined) {
        for (let i = 0; i < children.length; ++i) {
            let childData = children[i].data;
            if (childData !== undefined) {
                addNS(childData, children[i].children, children[i].sel);
            }
        }
    }
}

/**
 *就是处理传进来的参数，创建一个Vnode对象，就像Vue里的render函数一样
 *
 * @export
 * @param {*} sel 节点类型
 * @param {*} b 
 * @param {*} c
 * @returns
 */
function h(sel, b, c) {
    var data = {}, children, text, i;
    if (c !== undefined) {
        // 若是三参均在，那么b就是data、c就是children
        data = b;
        if (__WEBPACK_IMPORTED_MODULE_1__is__["a" /* array */](c)) {
            // 'div', { id: 'container'}, [vnode1, vnode2...]
            // 若是c是数组，那么就是vnode子元素
            children = c;
        }
        else if (__WEBPACK_IMPORTED_MODULE_1__is__["b" /* primitive */](c)) {
            // 'div', { id: 'container'}, 123
            // 若c是字符串或者数字，那么该节点就是文本节点
            text = c;
        }
        else if (c && c.sel) {
            // 'div', { id: 'container'}, vnode1
            // 若是这种传参，那么转成数组即可
            children = [c];
        }
    }
    else if (b !== undefined) {
        if (__WEBPACK_IMPORTED_MODULE_1__is__["a" /* array */](b)) {
            // 'div', [vnode1, vnode2...]
            children = b;
        }
        else if (__WEBPACK_IMPORTED_MODULE_1__is__["b" /* primitive */](b)) {
            // 'div', 123
            text = b;
        }
        else if (b && b.sel) {
            // 'div', vnode1
            children = [b];
        }
        else {
            // 'div', {
            //     style: {
            //         fontWeight: 'normal',
            //         fontStyle: 'italic'
            //     }
            // }
            data = b;
        }
    }
    /*
    h('div', {
        style: {
            fontWeight: 'normal',
            fontStyle: 'italic'
        }
    }, [1, 2, 3])*/
    // 这时候判断下children是否存在，存在的话就判断下每项子元素是否是数字或者字符串，是的话就把它转成vnode对象
    if (children !== undefined) {
        for (i = 0; i < children.length; ++i) {
            if (__WEBPACK_IMPORTED_MODULE_1__is__["b" /* primitive */](children[i]))
                children[i] = Object(__WEBPACK_IMPORTED_MODULE_0__vnode__["b" /* vnode */])(undefined, undefined, undefined, children[i], undefined);
        }
    }
    // sel: svg、svg#xxx、svg.xxx
    // 也就是这个节点是svg的话那么需要处理下namespace的问题
    if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g' &&
        (sel.length === 3 || sel[3] === '.' || sel[3] === '#')) {
        addNS(data, children, sel);
    }
    return Object(__WEBPACK_IMPORTED_MODULE_0__vnode__["b" /* vnode */])(sel, data, children, text, undefined);
}
;
/* unused harmony default export */ var _unused_webpack_default_export = (h);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = vnode;
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
function vnode(sel, data, children, text, elm) {
    // 用于vnode之间的比对
    let key = data === undefined ? undefined : data.key;
    return { sel, data, children, text, elm, key };
}
/* harmony default export */ __webpack_exports__["a"] = (vnode);


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = primitive;
// Array.isArray引用，若是想换下判断array的方法就很方便了
const array = Array.isArray;
/* harmony export (immutable) */ __webpack_exports__["a"] = array;

// 其实就是为了方便传参用的，毕竟比如我生成一个textContent是abc的div，还写一大串，显得有点麻烦
function primitive(s) {
    return typeof s === 'string' || typeof s === 'number';
}


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__snabbdom__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_attributes__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modules_class__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__modules_props__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__modules_style__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__modules_eventlisteners__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__h__ = __webpack_require__(0);

 // for setting attributes on DOM elements
 // makes it easy to toggle classes
 // for setting properties on DOM elements
 // handles styling on elements with support for animations
 // attaches event listeners
 // helper function for creating vnodes
var patch = Object(__WEBPACK_IMPORTED_MODULE_0__snabbdom__["a" /* init */])([
    __WEBPACK_IMPORTED_MODULE_1__modules_attributes__["a" /* attributesModule */],
    __WEBPACK_IMPORTED_MODULE_2__modules_class__["a" /* classModule */],
    __WEBPACK_IMPORTED_MODULE_3__modules_props__["a" /* propsModule */],
    __WEBPACK_IMPORTED_MODULE_4__modules_style__["a" /* styleModule */],
    __WEBPACK_IMPORTED_MODULE_5__modules_eventlisteners__["a" /* eventListenersModule */]
]);
// 创建Virtual DOM（h）、比较新旧DOM且更新UI（patch）
const snabbdomBundle = { patch, h: __WEBPACK_IMPORTED_MODULE_6__h__["a" /* h */] };
/* harmony export (immutable) */ __webpack_exports__["snabbdomBundle"] = snabbdomBundle;

/* harmony default export */ __webpack_exports__["default"] = (snabbdomBundle);


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = init;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vnode__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__is__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__htmldomapi__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__h__ = __webpack_require__(0);
/* unused harmony reexport h */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__thunk__ = __webpack_require__(6);
/* unused harmony reexport thunk */



function isUndef(s) { return s === undefined; }
function isDef(s) { return s !== undefined; }
const emptyNode = Object(__WEBPACK_IMPORTED_MODULE_0__vnode__["a" /* default */])('', {}, [], undefined, undefined);
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



/**
 *根据传入的modules和domApi返回一个path函数
 *方便扩展，而且不同的平台就像Weex的domApi也可以自定义
 * 
 * @export
 * @param {*} modules 
 * @param {*} domApi
 * @returns
 */
function init(modules, domApi) {
    let i, j, cbs = {};
    const api = domApi !== undefined ? domApi : __WEBPACK_IMPORTED_MODULE_2__htmldomapi__["a" /* default */];
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
        return Object(__WEBPACK_IMPORTED_MODULE_0__vnode__["a" /* default */])(api.tagName(elm).toLowerCase() + id + c, {}, [], undefined, elm);
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
            if (__WEBPACK_IMPORTED_MODULE_1__is__["a" /* array */](children)) {
                for (i = 0; i < children.length; ++i) {
                    const ch = children[i];
                    if (ch != null) {
                        api.appendChild(elm, createElm(ch, insertedVnodeQueue));
                    }
                }
            }
            // 若是存在文本子节点
            else if (__WEBPACK_IMPORTED_MODULE_1__is__["b" /* primitive */](vnode.text)) {
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


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function createElement(tagName) {
    return document.createElement(tagName);
}
function createElementNS(namespaceURI, qualifiedName) {
    return document.createElementNS(namespaceURI, qualifiedName);
}
function createTextNode(text) {
    return document.createTextNode(text);
}
function createComment(text) {
    return document.createComment(text);
}
function insertBefore(parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
}
function removeChild(node, child) {
    node.removeChild(child);
}
function appendChild(node, child) {
    node.appendChild(child);
}
function parentNode(node) {
    return node.parentNode;
}
function nextSibling(node) {
    return node.nextSibling;
}
function tagName(elm) {
    return elm.tagName;
}
function setTextContent(node, text) {
    node.textContent = text;
}
function getTextContent(node) {
    return node.textContent;
}
function isElement(node) {
    return node.nodeType === 1;
}
function isText(node) {
    return node.nodeType === 3;
}
function isComment(node) {
    return node.nodeType === 8;
}
const htmlDomApi = {
    createElement,
    createElementNS,
    createTextNode,
    createComment,
    insertBefore,
    removeChild,
    appendChild,
    parentNode,
    nextSibling,
    tagName,
    setTextContent,
    getTextContent,
    isElement,
    isText,
    isComment,
};
/* unused harmony export htmlDomApi */

/* harmony default export */ __webpack_exports__["a"] = (htmlDomApi);


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__h__ = __webpack_require__(0);

function copyToThunk(vnode, thunk) {
    thunk.elm = vnode.elm;
    vnode.data.fn = thunk.data.fn;
    vnode.data.args = thunk.data.args;
    thunk.data = vnode.data;
    thunk.children = vnode.children;
    thunk.text = vnode.text;
    thunk.elm = vnode.elm;
}
function init(thunk) {
    const cur = thunk.data;
    const vnode = cur.fn.apply(undefined, cur.args);
    copyToThunk(vnode, thunk);
}
function prepatch(oldVnode, thunk) {
    let i, old = oldVnode.data, cur = thunk.data;
    const oldArgs = old.args, args = cur.args;
    if (old.fn !== cur.fn || oldArgs.length !== args.length) {
        copyToThunk(cur.fn.apply(undefined, args), thunk);
        return;
    }
    for (i = 0; i < args.length; ++i) {
        if (oldArgs[i] !== args[i]) {
            copyToThunk(cur.fn.apply(undefined, args), thunk);
            return;
        }
    }
    copyToThunk(oldVnode, thunk);
}
const thunk = function thunk(sel, key, fn, args) {
    if (args === undefined) {
        args = fn;
        fn = key;
        key = undefined;
    }
    return Object(__WEBPACK_IMPORTED_MODULE_0__h__["a" /* h */])(sel, {
        key: key,
        hook: { init, prepatch },
        fn: fn,
        args: args
    });
};
/* unused harmony export thunk */

/* unused harmony default export */ var _unused_webpack_default_export = (thunk);


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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
const attributesModule = { create: updateAttrs, update: updateAttrs };
/* harmony export (immutable) */ __webpack_exports__["a"] = attributesModule;

/* unused harmony default export */ var _unused_webpack_default_export = (attributesModule);


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function updateClass(oldVnode, vnode) {
    var cur, name, elm = vnode.elm, oldClass = oldVnode.data.class, klass = vnode.data.class;
    if (!oldClass && !klass)
        return;
    if (oldClass === klass)
        return;
    oldClass = oldClass || {};
    klass = klass || {};
    for (name in oldClass) {
        if (!klass[name]) {
            elm.classList.remove(name);
        }
    }
    for (name in klass) {
        cur = klass[name];
        if (cur !== oldClass[name]) {
            // .classList.add 、 .classList.remove
            elm.classList[cur ? 'add' : 'remove'](name);
        }
    }
}
const classModule = { create: updateClass, update: updateClass };
/* harmony export (immutable) */ __webpack_exports__["a"] = classModule;

/* unused harmony default export */ var _unused_webpack_default_export = (classModule);


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function updateProps(oldVnode, vnode) {
    var key, cur, old, elm = vnode.elm, oldProps = oldVnode.data.props, props = vnode.data.props;
    if (!oldProps && !props)
        return;
    if (oldProps === props)
        return;
    oldProps = oldProps || {};
    props = props || {};
    for (key in oldProps) {
        if (!props[key]) {
            delete elm[key];
        }
    }
    for (key in props) {
        cur = props[key];
        old = oldProps[key];
        if (old !== cur && (key !== 'value' || elm[key] !== cur)) {
            elm[key] = cur;
        }
    }
}
const propsModule = { create: updateProps, update: updateProps };
/* harmony export (immutable) */ __webpack_exports__["a"] = propsModule;

/* unused harmony default export */ var _unused_webpack_default_export = (propsModule);


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// Bindig `requestAnimationFrame` like this fixes a bug in IE/Edge. See #360 and #409.
var raf = (typeof window !== 'undefined' && (window.requestAnimationFrame).bind(window)) || setTimeout;
var nextFrame = function (fn) { raf(function () { raf(fn); }); };
var reflowForced = false;
function setNextFrame(obj, prop, val) {
    nextFrame(function () { obj[prop] = val; });
}
function updateStyle(oldVnode, vnode) {
    var cur, name, elm = vnode.elm, oldStyle = oldVnode.data.style, style = vnode.data.style;
    if (!oldStyle && !style)
        return;
    if (oldStyle === style)
        return;
    oldStyle = oldStyle || {};
    style = style || {};
    var oldHasDel = 'delayed' in oldStyle;
    for (name in oldStyle) {
        if (!style[name]) {
            if (name[0] === '-' && name[1] === '-') {
                elm.style.removeProperty(name);
            }
            else {
                elm.style[name] = '';
            }
        }
    }
    for (name in style) {
        cur = style[name];
        if (name === 'delayed' && style.delayed) {
            for (let name2 in style.delayed) {
                cur = style.delayed[name2];
                if (!oldHasDel || cur !== oldStyle.delayed[name2]) {
                    setNextFrame(elm.style, name2, cur);
                }
            }
        }
        else if (name !== 'remove' && cur !== oldStyle[name]) {
            if (name[0] === '-' && name[1] === '-') {
                elm.style.setProperty(name, cur);
            }
            else {
                elm.style[name] = cur;
            }
        }
    }
}
function applyDestroyStyle(vnode) {
    var style, name, elm = vnode.elm, s = vnode.data.style;
    if (!s || !(style = s.destroy))
        return;
    for (name in style) {
        elm.style[name] = style[name];
    }
}
function applyRemoveStyle(vnode, rm) {
    var s = vnode.data.style;
    if (!s || !s.remove) {
        rm();
        return;
    }
    if (!reflowForced) {
        vnode.elm.offsetLeft;
        reflowForced = true;
    }
    var name, elm = vnode.elm, i = 0, compStyle, style = s.remove, amount = 0, applied = [];
    for (name in style) {
        applied.push(name);
        elm.style[name] = style[name];
    }
    compStyle = getComputedStyle(elm);
    var props = compStyle['transition-property'].split(', ');
    for (; i < props.length; ++i) {
        if (applied.indexOf(props[i]) !== -1)
            amount++;
    }
    elm.addEventListener('transitionend', function (ev) {
        if (ev.target === elm)
            --amount;
        if (amount === 0)
            rm();
    });
}
function forceReflow() {
    reflowForced = false;
}
const styleModule = {
    pre: forceReflow,
    create: updateStyle,
    update: updateStyle,
    destroy: applyDestroyStyle,
    remove: applyRemoveStyle
};
/* harmony export (immutable) */ __webpack_exports__["a"] = styleModule;

/* unused harmony default export */ var _unused_webpack_default_export = (styleModule);


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function invokeHandler(handler, vnode, event) {
    if (typeof handler === "function") {
        // call function handler
        handler.call(vnode, event, vnode);
    }
    else if (typeof handler === "object") {
        // call handler with arguments
        if (typeof handler[0] === "function") {
            // special case for single argument for performance
            if (handler.length === 2) {
                handler[0].call(vnode, handler[1], event, vnode);
            }
            else {
                var args = handler.slice(1);
                args.push(event);
                args.push(vnode);
                handler[0].apply(vnode, args);
            }
        }
        else {
            // call multiple handlers
            for (var i = 0; i < handler.length; i++) {
                invokeHandler(handler[i], vnode, event);
            }
        }
    }
}
function handleEvent(event, vnode) {
    var name = event.type, on = vnode.data.on;
    // call event handler(s) if exists
    if (on && on[name]) {
        invokeHandler(on[name], vnode, event);
    }
}
function createListener() {
    return function handler(event) {
        handleEvent(event, handler.vnode);
    };
}
function updateEventListeners(oldVnode, vnode) {
    var oldOn = oldVnode.data.on, oldListener = oldVnode.listener, oldElm = oldVnode.elm, on = vnode && vnode.data.on, elm = (vnode && vnode.elm), name;
    // optimization for reused immutable handlers
    if (oldOn === on) {
        return;
    }
    // remove existing listeners which no longer used
    if (oldOn && oldListener) {
        // if element changed or deleted we remove all existing listeners unconditionally
        if (!on) {
            for (name in oldOn) {
                // remove listener if element was changed or existing listeners removed
                oldElm.removeEventListener(name, oldListener, false);
            }
        }
        else {
            for (name in oldOn) {
                // remove listener if existing listener removed
                if (!on[name]) {
                    oldElm.removeEventListener(name, oldListener, false);
                }
            }
        }
    }
    // add new listeners which has not already attached
    if (on) {
        // reuse existing listener or create new
        var listener = vnode.listener = oldVnode.listener || createListener();
        // update vnode for listener
        listener.vnode = vnode;
        // if element changed or added we add all needed listeners unconditionally
        if (!oldOn) {
            for (name in on) {
                // add listener if element was changed or new listeners added
                elm.addEventListener(name, listener, false);
            }
        }
        else {
            for (name in on) {
                // add listener if new listener added
                if (!oldOn[name]) {
                    elm.addEventListener(name, listener, false);
                }
            }
        }
    }
}
const eventListenersModule = {
    create: updateEventListeners,
    update: updateEventListeners,
    destroy: updateEventListeners
};
/* harmony export (immutable) */ __webpack_exports__["a"] = eventListenersModule;

/* unused harmony default export */ var _unused_webpack_default_export = (eventListenersModule);


/***/ })
/******/ ])["default"];
});
//# sourceMappingURL=snabbdom.js.map