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
        // value比较特殊，按理而言old应该和elm[key]一样的，不过value可以很轻松的被改变，就像输入框什么的，所以要是已经改成新值的话也就不用设置了
        // 其实src之类的也是可以通过dom先修改在patch的，只是花费更高罢了
        // old、cur、key、elm[key]   2、3、value、3
        if (old !== cur && (key !== 'value' || elm[key] !== cur)) {
            elm[key] = cur;
        }
    }
}
export const propsModule = { create: updateProps, update: updateProps };
export default propsModule;
