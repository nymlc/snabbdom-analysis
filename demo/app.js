const patch = snabbdom.patch
const h = snabbdom.h

const container = document.getElementById('container')

const vnode = h('ul', [h('li', {
    key: 0
}, 'A'), h('li', {
    key: 1
}, 'B'), h('li', {
    key: 2
}, 'C'), h('li', {
    key: 3
}, 'D')])
patch(container, vnode)

const nVnode = h('ul', [h('li', {
    key: 3
}, 'D'), h('li', {
    key: 1
}, 'B'), h('li', {
    key: 2
}, 'C'),h('li', {
    key: 0
}, 'A'), h('li', {
    key: 4
}, 'E')])
setTimeout(function() {
    patch(vnode, nVnode)
}, 3000)