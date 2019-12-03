import { h } from './h';

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
export const thunk = function thunk(sel, key, fn, args) {
    if (args === undefined) {
        args = fn;
        fn = key;
        key = undefined;
    }
    return h(sel, {
        key: key,
        hook: { init, prepatch }, 
        fn: fn,
        args: args
    });
};
export default thunk;
