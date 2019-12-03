#####thunk
这个其实来源于传名调用与传值调用，就像下文，是先把`1+2`算出来然后传入`fn`（传值），还是把`1+2`整个传入`fn`（传名）
这俩各有优劣，很明显`传值`很简单，但是可能有性能影响，毕竟我传入的值`fn`可能没用。`传名`能避免这个，但是明显麻烦多了
```javascript
function fn(a) {
    return a
}
fn(1 + 2)
```
我们这里`thunk`就是这意思，如下
[demo](https://nymlc.github.io/snabbdom-analysis/dist/thunk.html)
这里`render`方法是返回一个`thunk`函数创建的`vnode`（实际上是仿造的），这时候要是通过`thunk`判定，新旧的`vnode`一样，那么就没必要创建`vnode`去`path、diff`。要是没通过，那么就是不一样的，就会调用`prepatch`钩子时调用传入的`renderNumber`（传入的挂在data.fn），创建一个真正的`vnode`去`path`
```javascript
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
```