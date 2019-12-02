const patch = snabbdom.patch
const h = snabbdom.h
const thunk = ThunkLib
const container = document.getElementById('container')

function renderNumber(num) {
    debugger
    return h('span', num);
}

function render(num) {
    return thunk('div', renderNumber, [num]);
}

const vnode = patch(container, render(1))
// 由于num 相同，renderNumber 不会执行
patch(vnode, render(1))