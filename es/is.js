// Array.isArray引用，若是想换下判断array的方法就很方便了
export const array = Array.isArray;
// 其实就是为了方便传参用的，毕竟比如我生成一个textContent是abc的div，还写一大串，显得有点麻烦
export function primitive(s) {
    return typeof s === 'string' || typeof s === 'number';
}
