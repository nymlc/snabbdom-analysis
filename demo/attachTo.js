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