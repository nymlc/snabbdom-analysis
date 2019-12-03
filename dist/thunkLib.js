(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ThunkLib"] = factory();
	else
		root["ThunkLib"] = factory();
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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__h__ = __webpack_require__(1);


// 就是把现有的vnode的数据拷贝到空壳vnode，使得它变成一个真的vnode
function copyToThunk(vnode, thunk) {
    thunk.elm = vnode.elm;
    // 值得注意的是，把空壳vnode的fn和args这俩个比对参数赋值给旧vnode
    // 其实感觉没啥用，因为没有影响到现有的对象。毕竟vnode都是新创的，唯一一个不是新创的那也是通过了校验，也就是fn、args一致
    vnode.data.fn = thunk.data.fn;
    vnode.data.args = thunk.data.args;
    thunk.data = vnode.data;
    thunk.children = vnode.children;
    thunk.text = vnode.text;
    thunk.elm = vnode.elm;
}

// init用于createElement的时候，就没比对。那么需要真正的vnode去创建一个真实的DOM，这个vnode就在init hook里使用fn创建
function init(thunk) {
    const cur = thunk.data;
    const vnode = cur.fn.apply(undefined, cur.args);
    copyToThunk(vnode, thunk);
}
/**
 * prepatch
 *
 * @param {*} oldVnode 旧vnode
 * @param {*} thunk 空壳vnode
 * @returns
 */
function prepatch(oldVnode, thunk) {
    let i, old = oldVnode.data, cur = thunk.data;
    const oldArgs = old.args, args = cur.args;
    // 判断下fn是不是一样的，参数是不是一样的
    if (old.fn !== cur.fn || oldArgs.length !== args.length) {
        // 不一样的话就使用空壳vnode的fn创建一个vnode作为旧node
        copyToThunk(cur.fn.apply(undefined, args), thunk);
        return;
    }
    // 比对下每个参数
    for (i = 0; i < args.length; ++i) {
        if (oldArgs[i] !== args[i]) {
            copyToThunk(cur.fn.apply(undefined, args), thunk);
            return;
        }
    }
    // 若是函数参数一致，那么现有的vnode和要比对的新vnode一样
    copyToThunk(oldVnode, thunk);
}
/**
 * 伪造一个vnode（没有有效的sel、可以有有效的key）
 * sel没什么用，就是用于占位
 * @param {*} sel 
 * @param {*} key 
 * @param {*} fn 这个就是真正创建vnode的方法，一旦前后比对不一致就用这个方法创建真正的vnode
 * @param {*} args 创建vnode所用的参数
 */
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
/* harmony export (immutable) */ __webpack_exports__["thunk"] = thunk;

/* harmony default export */ __webpack_exports__["default"] = (thunk);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = h;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vnode__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__is__ = __webpack_require__(3);



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
                children[i] = Object(__WEBPACK_IMPORTED_MODULE_0__vnode__["a" /* vnode */])(undefined, undefined, undefined, children[i], undefined);
        }
    }
    // sel: svg、svg#xxx、svg.xxx
    // 也就是这个节点是svg的话那么需要处理下namespace的问题
    if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g' &&
        (sel.length === 3 || sel[3] === '.' || sel[3] === '#')) {
        addNS(data, children, sel);
    }
    return Object(__WEBPACK_IMPORTED_MODULE_0__vnode__["a" /* vnode */])(sel, data, children, text, undefined);
}
;
/* unused harmony default export */ var _unused_webpack_default_export = (h);


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = vnode;
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
/* unused harmony default export */ var _unused_webpack_default_export = (vnode);


/***/ }),
/* 3 */
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


/***/ })
/******/ ])["default"];
});
//# sourceMappingURL=thunkLib.js.map