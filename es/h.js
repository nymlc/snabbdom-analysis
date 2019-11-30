import { vnode } from './vnode';
import * as is from './is';

/**
 *svg使用xml格式定义图图像，所以需要给svg添加namespace，也就是它内部的标签节点需要按照svg标准来渲染
 *
 * @param {*} data svg vnode的data
 * @param {*} children 
 * @param {*} sel svg、svg#xxx、svg.xxx
 */
/*
const vnode = h('svg', {
    attrs: {
        width: '100%',
        height: '100%'
    },
}, [h('rect', {
    attrs: {
        width: 300,
        height: 100
    },
    style: {
        fill: 'rgb(0, 0, 255)',
        strokeWidth: 1,
        stroke: 'rgb(0, 0, 0)'
    }
})])
*/
function addNS(data, children, sel) {
    data.ns = 'http://www.w3.org/2000/svg';
    // <foreignObject>元素的作用是可以在其中使用具有其它XML命名空间的XML元素
    // 就像它内部可以使用xhtml标准解析
    // <svg xmlns="http://www.w3.org/2000/svg">
    //     <foreignObject width="120" height="50">
    //         <body xmlns="http://www.w3.org/1999/xhtml">
    //             <p>文字。</p>
    //         </body>
    //     </foreignObject>
    // </svg>
    // 它本身不用添加ns
    if (sel !== 'foreignObject' && children !== undefined) {
        for (var i = 0; i < children.length; ++i) {
            var childData = children[i].data;
            if (childData !== undefined) {
                addNS(childData, children[i].children, children[i].sel);
            }
        }
    }
}

/**
 *就是处理传进来的参数，创建一个Vnode对象，就像Vue里的render函数一样
 *
 * @export
 * @param {*} sel 节点类型
 * @param {*} b 
 * @param {*} c
 * @returns
 */
export function h(sel, b, c) {
    var data = {}, children, text, i;
    if (c !== undefined) {
        // 若是三参均在，那么b就是data、c就是children
        data = b;
        if (is.array(c)) {
            // 'div', { id: 'container'}, [vnode1, vnode2...]
            // 若是c是数组，那么就是vnode子元素
            children = c;
        }
        else if (is.primitive(c)) {
            // 'div', { id: 'container'}, 123
            // 若c是字符串或者数字，那么该节点就是文本节点
            text = c;
        }
        else if (c && c.sel) {
            // 'div', { id: 'container'}, vnode1
            // 若是这种传参，那么转成数组即可
            children = [c];
        }
    }
    else if (b !== undefined) {
        if (is.array(b)) {
            // 'div', [vnode1, vnode2...]
            children = b;
        }
        else if (is.primitive(b)) {
            // 'div', 123
            text = b;
        }
        else if (b && b.sel) {
            // 'div', vnode1
            children = [b];
        }
        else {
            // 'div', {
            //     style: {
            //         fontWeight: 'normal',
            //         fontStyle: 'italic'
            //     }
            // }
            data = b;
        }
    }
    /*
    h('div', {
        style: {
            fontWeight: 'normal',
            fontStyle: 'italic'
        }
    }, [1, 2, 3])*/
    // 这时候判断下children是否存在，存在的话就判断下每项子元素是否是数字或者字符串，是的话就把它转成vnode对象
    if (children !== undefined) {
        for (i = 0; i < children.length; ++i) {
            if (is.primitive(children[i]))
                children[i] = vnode(undefined, undefined, undefined, children[i], undefined);
        }
    }
    // sel: svg、svg#xxx、svg.xxx
    // 也就是这个节点是svg的话那么需要处理下namespace的问题
    if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g' &&
        (sel.length === 3 || sel[3] === '.' || sel[3] === '#')) {
        addNS(data, children, sel);
    }
    return vnode(sel, data, children, text, undefined);
}
;
export default h;
//# sourceMappingURL=h.js.map