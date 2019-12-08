// Bindig `requestAnimationFrame` like this fixes a bug in IE/Edge. See #360 and #409.
var raf = (typeof window !== 'undefined' && (window.requestAnimationFrame).bind(window)) || setTimeout;
// 下两帧更改样式，浏览器16帧/ms来渲染，两帧才能看出变化
var nextFrame = function (fn) {
    raf(function () {
        raf(fn);
    });
};
var reflowForced = false;

/**
 *下一帧设置
 *
 * @param {*} obj style对象
 * @param {*} prop 要设置的key
 * @param {*} val 要设置的val
 */
function setNextFrame(obj, prop, val) {
    nextFrame(function () {
        obj[prop] = val;
    });
}

function updateStyle(oldVnode, vnode) {
    var cur, name, elm = vnode.elm,
        oldStyle = oldVnode.data.style,
        style = vnode.data.style;
    if (!oldStyle && !style)
        return;
    if (oldStyle === style)
        return;
    oldStyle = oldStyle || {};
    style = style || {};
    var oldHasDel = 'delayed' in oldStyle;
    for (name in oldStyle) {
        if (!style[name]) {
            // --开头的属性得用removeProperty
            if (name[0] === '-' && name[1] === '-') {
                elm.style.removeProperty(name);
            } else {
                elm.style[name] = '';
            }
        }
    }
    for (name in style) {
        cur = style[name];
        /**
        h('i', {
            style: {
                fontSize: '14px',
                delayed: {
                    fontSize: '16px'
                }
            }
        }) 
         */
        if (name === 'delayed' && style.delayed) {
            for (let name2 in style.delayed) {
                cur = style.delayed[name2];
                if (!oldHasDel || cur !== oldStyle.delayed[name2]) {
                    setNextFrame(elm.style, name2, cur);
                }
            }
        } else if (name !== 'remove' && cur !== oldStyle[name]) { // 如果不是delayed和remove的style，这里的remove是给applyRemoveStyle用的，得过掉了
            if (name[0] === '-' && name[1] === '-') {
                elm.style.setProperty(name, cur);
            } else {
                elm.style[name] = cur;
            }
        }
    }
}
/**
    h('i', {
        style: {
            fontSize: '14px',
            destroy: {
                fontSize: '16px'
            }
        }
    })
*/
// 销毁时要设置的style
function applyDestroyStyle(vnode) {
    var style, name, elm = vnode.elm,
        s = vnode.data.style;
    if (!s || !(style = s.destroy))
        return;
    for (name in style) {
        elm.style[name] = style[name];
    }
}

function applyRemoveStyle(vnode, rm) {
    var s = vnode.data.style;
    if (!s || !s.remove) {
        rm();
        return;
    }
    // 首次remove的时候需要强制回流
    if (!reflowForced) {
        // elm.offsetLeft需要返回最新的布局信息，因此浏览器不得不触发回流重绘来返回正确的值
        // 若是不强制回流，那么transform 3s将直接到最终，自然而然的也就没了transitionend事件的回调触发，也就节点不会被remove掉
        vnode.elm.offsetLeft;
        // 若是同时删除俩个节点，那么回流一次就可以了
        /**
            var vnode1 = h('div.parent', {}, [btn1, btn2]);
            var vnode2 = h('div.parent', {}, [null, null]);
         */
        reflowForced = true;
    }
    var name, elm = vnode.elm,
        i = 0,
        compStyle, style = s.remove,
        amount = 0,
        applied = [];
    for (name in style) {
        // 纪录要删除的节点样式的name
        applied.push(name);
        elm.style[name] = style[name];
    }
    compStyle = getComputedStyle(elm);
    var props = compStyle['transition-property'].split(', ');
    for (; i < props.length; ++i) {
        if (applied.indexOf(props[i]) !== -1)
        // 对需要过渡的属性计数，也就是applied里的不是都需要过渡的属性
            amount++;
    }
    // 过渡效果完了之后才remove节点
    elm.addEventListener('transitionend', function (ev) {
        if (ev.target === elm)
            --amount;
        if (amount === 0)
            rm();
    });
}

function forceReflow() {
    reflowForced = false;
}
export const styleModule = {
    pre: forceReflow,
    create: updateStyle,
    update: updateStyle,
    destroy: applyDestroyStyle,
    remove: applyRemoveStyle
};
export default styleModule;