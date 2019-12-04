(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["AttachToLib"] = factory();
	else
		root["AttachToLib"] = factory();
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
/* harmony export (immutable) */ __webpack_exports__["attachTo"] = attachTo;
function pre(vnode, newVnode) {
    const attachData = vnode.data.attachData;
    // Copy created placeholder and real element from old vnode
    // 因为俩个节点相似，所以才会从patchNode方法触发prepatch回调到该方法
    // 那么新旧节点的占位节点和真实节点应该是一样的
    newVnode.data.attachData.placeholder = attachData.placeholder;
    newVnode.data.attachData.real = attachData.real;
    // Mount real element in vnode so the patch process operates on it
    // 因为elm是占位符节点，real才是真是节点，所以要更新只能把elm赋值成真实节点
    vnode.elm = vnode.data.attachData.real;
}
function post(_, vnode) {
    // Mount dummy placeholder in vnode so potential reorders use it
    // pre方法里赋值了vnode,elm，那么这里就得重置
    vnode.elm = vnode.data.attachData.placeholder;
}
function destroy(vnode) {
    // Remove placeholder
    // vnode.elm是placeholder，这里删除span占位节点
    if (vnode.elm !== undefined) {
        vnode.elm.parentNode.removeChild(vnode.elm);
    }
    // Remove real element from where it was inserted
    // 因为占位符被删了，所以elm设置回它本该的elm
    // 若是不赋值回来，那么removeVnodes的时候还是会删除placeholder，这个是不对的
    vnode.elm = vnode.data.attachData.real;
}
function create(_, vnode) {
    const real = vnode.elm, attachData = vnode.data.attachData;
    const placeholder = document.createElement('span');
    // Replace actual element with dummy placeholder
    // Snabbdom will then insert placeholder instead
    // 将占位符赋值给elm，那么就会被挂载到vnode本应在的位置
    vnode.elm = placeholder;
    // 创建的时候将vnode的节点插入到要指定的节点
    attachData.target.appendChild(real);
    attachData.real = real;
    attachData.placeholder = placeholder;
}
function attachTo(target, vnode) {
    if (vnode.data === undefined)
        vnode.data = {};
    if (vnode.data.hook === undefined)
        vnode.data.hook = {};
    const data = vnode.data;
    const hook = vnode.data.hook;
    // target就是要挂载的dom节点、placeholder就是占位节点（span）、real就是根据vnode创建的真实节点
    data.attachData = { target: target, placeholder: undefined, real: undefined };
    hook.create = create;
    hook.prepatch = pre;
    hook.postpatch = post;
    hook.destroy = destroy;
    return vnode;
}
;
/* harmony default export */ __webpack_exports__["default"] = (attachTo);


/***/ })
/******/ ])["default"];
});
//# sourceMappingURL=attachToLib.js.map