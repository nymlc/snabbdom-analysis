import { init } from './snabbdom';
import { attributesModule } from './modules/attributes'; // for setting attributes on DOM elements
import { classModule } from './modules/class'; // makes it easy to toggle classes
import { propsModule } from './modules/props'; // for setting properties on DOM elements
import { styleModule } from './modules/style'; // handles styling on elements with support for animations
import { eventListenersModule } from './modules/eventlisteners'; // attaches event listeners
import { h } from './h'; // helper function for creating vnodes
var patch = init([
    attributesModule,
    classModule,
    propsModule,
    styleModule,
    eventListenersModule
]);
// 创建Virtual DOM（h）、比较新旧DOM且更新UI（patch）
export const snabbdomBundle = { patch, h: h };
export default snabbdomBundle;
