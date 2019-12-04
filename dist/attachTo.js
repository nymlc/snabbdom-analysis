/******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ({

/***/ 6:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(7);


/***/ }),

/***/ 7:
/***/ (function(module, exports) {

const patch = snabbdom.patch
const h = snabbdom.h
const attachTo = AttachToLib

let container = document.getElementById('container')
let footer = document.getElementById('footer')

var elm, vnode0;
elm = document.createElement('div');
vnode0 = elm;

function attachTo1() {
    // remove attcah装饰节点，destroy方法
    var vnode1 = h('div', [
        h('div#wrapper', [
            h('div', 'Some element'),
            attachTo(elm, h('div#attached', 'First text')),
        ]),
    ]);
    var vnode2 = h('div', [
        h('div#wrapper', [
            h('div', 'Some element'),
        ]),
    ]);
    elm = patch(vnode0, vnode1).elm;
    container.appendChild(elm)
    setTimeout(function () {
        elm = patch(vnode1, vnode2).elm;
        container.appendChild(elm)
    }, 3000)
}

function attachTo2() {
    // patchNode俩attcah装饰节点，pre、post方法
    var vnode1 = h('div', [
        h('div#wrapper', [
            h('div', 'Some element'),
            attachTo(elm, h('div#attached', 'First text')),
        ]),
    ]);
    var vnode2 = h('div', [
        h('div#wrapper', [
            h('div', 'Some element'),
            attachTo(elm, h('div#attached', 'New text')),
        ]),
    ]);
    elm = patch(vnode0, vnode1).elm;
    container.appendChild(elm)

    setTimeout(function () {
        elm = patch(vnode1, vnode2).elm;
        container.appendChild(elm)
    }, 3000)
}
const flag = localStorage.getItem('attachTo')
if(flag == 2) {
    attachTo2()
} else {
    attachTo1()
}
const vnode2 = patch(footer, h('div', [h('div.btn', {
    on: {
        click: () => {
            localStorage.setItem('attachTo', 1)
            location.reload()
        }
    }
}, '删除AttachTo节点'), h('div.btn', {
    on: {
        click: () => {
            localStorage.setItem('attachTo', 2)
            location.reload()
        }
    }
}, '比对AttachTo节点')]))

/***/ })

/******/ });