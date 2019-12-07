
/**
 *这里才是真正的触发事件回调
 *
 * @param {*} handler 事件回调，也就是挂载在vnode.on.xxx上的
 * @param {*} vnode 挂在事件的vnode
 * @param {*} event 触发的原生event对象
 */
function invokeHandler(handler, vnode, event) {
    if (typeof handler === "function") {
        // call function handler
        handler.call(vnode, event, vnode);
    }
    else if (typeof handler === "object") {
        /**
         on: {
            click: [fn, arg1]
        }
         */
        // call handler with arguments
        if (typeof handler[0] === "function") {
            // 若是第一项是函数，那么余下的都是参数
            // special case for single argument for performance
            if (handler.length === 2) {
                // 当长度为2的时候，用call，优化性能
                handler[0].call(vnode, handler[1], event, vnode);
            }
            else {
                var args = handler.slice(1);
                args.push(event);
                args.push(vnode);
                handler[0].apply(vnode, args);
            }
        }
        else {
            /**
                 on: {
                    click: [[fn, arg1], [fn]]
                }
            */
            // call multiple handlers
            for (var i = 0; i < handler.length; i++) {
                invokeHandler(handler[i], vnode, event);
            }
        }
    }
}
function handleEvent(event, vnode) {
    // 跳过event和vnode取到事件名（click）、on对象（on: {
    //     click: () => {
    //         fn()
    //     }
    // }）
    var name = event.type, on = vnode.data.on;
    // call event handler(s) if exists
    if (on && on[name]) {
        // 若是on里有注册触发的事件
        invokeHandler(on[name], vnode, event);
    }
}
function createListener() {
    return function handler(event) {
        // 事件触发，触发到此函数
        // 这里的handler就是之前的listener，挂载了vnode数据
        handleEvent(event, handler.vnode);
    };
}
function updateEventListeners(oldVnode, vnode) {
    var oldOn = oldVnode.data.on, oldListener = oldVnode.listener, oldElm = oldVnode.elm, on = vnode && vnode.data.on, elm = (vnode && vnode.elm), name;
    // optimization for reused immutable handlers
    if (oldOn === on) {
        return;
    }
    // remove existing listeners which no longer used
    if (oldOn && oldListener) {
        // if element changed or deleted we remove all existing listeners unconditionally
        if (!on) {
            for (name in oldOn) {
                // remove listener if element was changed or existing listeners removed
                oldElm.removeEventListener(name, oldListener, false);
            }
        }
        else {
            for (name in oldOn) {
                // remove listener if existing listener removed
                if (!on[name]) {
                    oldElm.removeEventListener(name, oldListener, false);
                }
            }
        }
    }
    // add new listeners which has not already attached
    if (on) {
        // reuse existing listener or create new
        // 复用老监听器，这里很巧妙。因为这个listener都是createListener创建的，他返回一个函数对象，
        // 下面赋值给它vnode，那么触发到这个函数的时候，在函数内部只需要取本函数就可以取到挂载到上面的vnode
        var listener = vnode.listener = oldVnode.listener || createListener();
        // update vnode for listener
        // 更新监听器的vnode
        listener.vnode = vnode;
        // if element changed or added we add all needed listeners unconditionally
        if (!oldOn) {
            for (name in on) {
                // add listener if element was changed or new listeners added
                elm.addEventListener(name, listener, false);
            }
        }
        else {
            for (name in on) {
                // add listener if new listener added
                if (!oldOn[name]) {
                    elm.addEventListener(name, listener, false);
                }
            }
        }
    }
}
export const eventListenersModule = {
    create: updateEventListeners,
    update: updateEventListeners,
    destroy: updateEventListeners
};
export default eventListenersModule;
