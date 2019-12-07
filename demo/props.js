const patch = snabbdom.patch
const h = snabbdom.h
const thunk = ThunkLib
const container = document.getElementById('container')
const footer = document.getElementById('footer')

// const vnode1 = patch(container, h('img', {
//     props: {
//         src: 'http://localhost:8080/2'
//     }
// }))

// function fn() {
//     patch(vnode1, h('img', {
//         props: {
//             src: 'http://localhost:8080/3'
//         }
//     }))
// }

// const vnode2 = patch(footer, h('div', {
//     on: {
//         click: () => {
//             fn()
//         }
//     }
// }, 'button'))


const vnode1 = patch(container, h('input', {
    props: {
        value: '2'
    }
}))

function fn() {
    patch(vnode1, h('input', {
        props: {
            value: '3'
        }
    }))
}

const vnode2 = patch(footer, h('div.btn', {
    on: {
        click: () => {
            fn()
        }
    }
}, 'button'))