const fakeRaf = window.fakeRaf;
fakeRaf.use();
const patch = require('../es/snabbdom').init([
    require('../es/modules/style').default,
    require('../es/modules/eventlisteners').default
]);
const h = require('../es/h').default

let container = document.getElementById('container')
let footer = document.getElementById('footer')


var elm, vnode0;
elm = document.createElement('div');
vnode0 = elm;

function style1() {
    var vnode1 = h('i', {
        style: {
            fontSize: '14px',
            delayed: {
                fontSize: '16px'
            }
        }
    });
    var vnode2 = h('i', {
        style: {
            fontSize: '18px',
            delayed: {
                fontSize: '20px'
            }
        }
    }, 'demo');
    elm = patch(vnode0, vnode1).elm;
    container.appendChild(elm)
    console.error(elm.style.fontSize)
    fakeRaf.step();
    fakeRaf.step();
    console.log(elm.style.fontSize)
    elm = patch(vnode1, vnode2).elm;
    console.error(elm.style.fontSize)
    fakeRaf.step();
    fakeRaf.step();
    console.log(elm.style.fontSize)
}

function style2() {
    var btn1 = h('button#btn1', {
        style: {
            transition: 'transform 5s',
            remove: {
                transform: 'translateY(100%)'
            }
        }
    }, ['A button']);
    var btn2 = h('button#btn2', {
        style: {
            transition: 'transform 5s',
            remove: {
                transform: 'translateX(100%)'
            }
        }
    }, ['B button']);
    var vnode1 = h('div.parent', {}, [btn1, btn2]);
    var vnode2 = h('div.parent', {}, [null, null]);
    container.appendChild(vnode0);
    patch(vnode0, vnode1);
    patch(vnode1, vnode2);
    const button1 = document.querySelector('#btn1');
    console.log(button1)
    button1.addEventListener('transitionend', function () {
        console.error(document.querySelector('#btn1'))
    });
    const button2 = document.querySelector('#btn2');
    console.log(button2)
    button2.addEventListener('transitionend', function () {
        console.error(document.querySelector('#btn2'))
    });
}
const flag = localStorage.getItem('style')
if (flag == 2) {
    style2()
} else {
    style1()
}
patch(footer, h('div', [h('div.btn', {
    on: {
        click: () => {
            localStorage.setItem('style', 1)
            location.reload()
        }
    }
}, '下一帧更新Style'), h('div.btn', {
    on: {
        click: () => {
            localStorage.setItem('style', 2)
            location.reload()
        }
    }
}, '应用样式前强制页面回流')]))