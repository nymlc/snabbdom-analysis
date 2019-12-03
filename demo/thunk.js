const patch = snabbdom.patch
const h = snabbdom.h
const thunk = ThunkLib
const container = document.getElementById('container')

function renderNumber(num) {
    return h('span', num);
}

function render(num) {
    return thunk('div', renderNumber, [num]);
}

// 这里会调用renderNumber创建一个vnode，因为path内肯定走createElement，所以会调用init hook钩子
const vnode1 = patch(container, render(1))
// 这里因为render(1)创建的空壳vnode(vnode2)的fn、args和vnode的一样，所以会把vnode的属性赋值(copyToThunk)给vnode2
// 这样子自然不会调用renderNumber
const vnode2 = patch(vnode1, render(1))