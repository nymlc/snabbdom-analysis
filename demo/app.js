const patch = snabbdom.patch
const h = snabbdom.h

const container = document.getElementById('container')

// const vnode = h('svg', {
//     attrs: {
//         width: '100%',
//         height: '100%'
//     },
// }, [h('rect', {
//     attrs: {
//         width: 300,
//         height: 100
//     },
//     style: {
//         fill: 'rgb(0, 0, 255)',
//         strokeWidth: 1,
//         stroke: 'rgb(0, 0, 0)'
//     }
// })])
const vnode = h('div#a', 'abc')
console.log(vnode)
patch(container, vnode)

// const newVnode = h('div', {
//     id: 'container'
// }, [
//     h('span', {
//         style: {
//             fontWeight: 'normal',
//             fontStyle: 'italic'
//         }
//     }, 'This is now italic type'),
//     ' and this is still just normal text',
//     h('a', {
//         props: {
//             href: '/bar'
//         }
//     }, 'I\'ll take you places!')
// ])
// setTimeout(() => {
//     patch(vnode, newVnode)
// }, 7000)


// const footer = document.getElementById('footer')

// function getList(count) {
//     return h(
//         'ul', {
//             id: 'footer',
//             className: 'hello hi',
//             style: {
//                 color: '#666'
//             }
//         },
//         Array.apply(null, {
//             length: count
//         })
//         .map((v, i) => i + 1)
//         .map(n => h(
//             'li', {
//                 className: 'item',
//                 key: n
//             },
//             `number is ${n}`
//         ))
//     )
// }
// const sVnode = getList(3)
// patch(footer, sVnode)

// setTimeout(() => {
//     patch(sVnode, getList(10))
// }, 4000)