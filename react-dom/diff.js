import { setAttribute, setComponentProps, createComponent} from './index';
function diff(dom,vnode,container){
    // 对比节点的变化
    const ret = diffNode(dom,vnode);

    if(container){
        container.appendChild(ret);
    }
    return ret;
};
export function diffNode (dom,vnode){
    let out = dom;
    if (vnode === undefined || vnode === null || typeof vnode === 'boolean') vnode = '';
    // 如果vnonde 是字符串
    if (typeof vnode === 'number') {
        vnode = String(vnode);
    }
    if (typeof vnode === 'string') {
        if(dom && dom.nodeType === '3'){
            if(dom.textContent !== vnode){
                // 更新 文本内容
                dom.textContent = vnode;
            }
        }else{
            out = document.createTextNode(vnode);
            if(dom && dom.parentNode){
                console.log('dom',dom)
                dom.parentNode.replaceChild(out,dom);
            }
        }
        return out;
    }
    if(typeof vnode.tag === 'function'){
        return diffComponent(out,vnode);
    }
    // 非文本 对象 dom 节点
    if (!dom || !isSameNodeType(dom, vnode)) {
        out = document.createElement(vnode.tag);
        if (dom) {
            [...dom.childNodes].map(out.appendChild);    // 将原来的子节点移到新节点下

            if (dom.parentNode) {
                dom.parentNode.replaceChild(out, dom);    // 移除掉原来的DOM对象
            }
        }
    }
    // 比较子节点
    if(vnode.childrens && vnode.childrens.length>0 || (out.childNodes && out.childNodes.length>0)){
        // d对比组件 或者子节点
        diffChildren(out,vnode.childrens);
    }
    diffAttribute(out, vnode);
    return out;
};
function diffComponent(dom,vnode){
    let comp = dom;
    // 如果组件没有变化，重新设置props
    if(comp && comp.constructor === vnode.tag){
        setComponentProps(comp,vnode.attrs);
        dom = comp.base;
    }else{
        // 组件类型发生变化
        if(comp){
            unmountComonent(comp);
            comp = null;
        }
        comp = createComponent(vnode.tag,vnode.attrs);
        setComponentProps(comp,vnode.attrs);
        dom = comp.base;

    };
    return dom;
}
function unmountComonent(comp){
    if (comp.componentWillUnmount) comp.componentWillUnmount();
    removeNode(comp.base);
}
function removeNode(dom){
    if(dom && dom.parentNode){
        dom.parentNode.removeNode(dom);
    }
}
/**
 * 
 * @param {*} dom  原有的节点
 * @param {*} vnode 新的的节点
 */
function diffAttribute(dom,vnode) {
    // 保存之前的所有属性
    const oldAttrs ={};
    const newAttrs =vnode.attrs;
    const domAttrs = dom.attributes;
    console.log(domAttrs,'adsda');
    
    [...domAttrs].forEach(item=>{
        oldAttrs[item.name]=item.value;
    });
    // 比较
    // 如果原来的属性跟新的属性对比，不在新的属性中，则将其移除掉(值设为undefined)
    for(let key in oldAttrs){
        if(!(key in newAttrs)){
            setAttribute(dom,key,undefined);
        }
    }
    // 更新 
    for(let key in newAttrs){
        if(oldAttrs[key]!==newAttrs[key]){
            // 值不同
            setAttribute(dom,key,newAttrs[key])
        }
    }
}
function diffChildren(dom,vchildren){
    const domChildren = dom.childNodes;
    const children = [];
    const keyed = {};
    // 将有key的节点和没有key的节点分开
    if (domChildren.length > 0) {
        for (let i = 0; i < domChildren.length; i++) {
            const child = domChildren[i];
            const key = child.key;
            if (key) {
                keyedLen++;
                keyed[key] = child;
            } else {
                children.push(child);
            }
        }
    }
    if (vchildren && vchildren.length > 0) {
        let min = 0;
        let childrenLen = children.length;
        for (let i = 0; i < vchildren.length; i++) {
            const vchild = vchildren[i];
            const key = vchild.key;
            let child;
            if (key) {
                if (keyed[key]) {
                    child = keyed[key];
                    keyed[key] = undefined;
                }
            } else if (min < childrenLen) {
                for (let j = min; j < childrenLen; j++) {
                    let c = children[j];
                    if (c && isSameNodeType(c, vchild)) {
                        child = c;
                        children[j] = undefined;
                        if (j === childrenLen - 1) childrenLen--;
                        if (j === min) min++;
                        break;
                    }
                }

            }
            child = diffNode(child, vchild);

            const f = domChildren[i];
            if (child && child !== dom && child !== f) {
                if (!f) {
                    dom.appendChild(child);
                } else if (child === f.nextSibling) {
                    removeNode(f);
                } else {
                    dom.insertBefore(child, f);
                }
            }
        }
    }
}
function isSameNodeType(dom, vnode) {
    if (typeof vnode === 'string' || typeof vnode === 'number') {
        return dom.nodeType === 3;
    }

    if (typeof vnode.tag === 'string') {
        return dom.nodeName.toLowerCase() === vnode.tag.toLowerCase();
    }

    return dom && dom._component && dom._component.constructor === vnode.tag;
}
export default diff;