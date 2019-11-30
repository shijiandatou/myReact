import Component from '../react/component';
import diff, { diffNode} from './diff';
const ReactDOM={
    render,
};
/**
 * const ele=(
 *  <div className='top' title='2' style='' style={{width:20;}}>
 *       helloe <span>hahah</span>
 *  </div>
 *  );
 */
/**
 * 
 * @param {*} vnode 虚拟dom
 * @param {*} container 容器
 */
function render(vnode,container,dom) {
//    return container.appendChild(_render(vnode));
      return diff(dom,vnode,container);
};
/**
 * 
 * @param {*} dom  设置属性的元素
 * @param {*} key  属性的key
 * @param {*} value 属性的值
 */
export function setAttribute(dom,key,value) {
    
    // 讲属性名className 转化成class
    if(key === 'className'){
        key = 'class';
    };
    // 如果是事件 onClick onBlur
    if(/on\w+/.test(key)){
        // 转成小写
        key = key.toLowerCase();
        // 给元素设置 事件
        dom[key] = value || '';
    }else if(key === 'style'){
        if(!value || typeof value === 'string'){
            dom.style.cssText = value || '';
        }else if(value && typeof value === 'object'){
            // {width:20}
            for(let k in value){
                typeof value[k] === 'number' ? dom.style[k] = value[k] + 'px' : dom.style[k] = value[k];
            }
        }
    }else {
        //其他属性
        if(key in dom){
            dom[key] = value || '';
        }
        value ? dom.setAttribute(key,value): dom.removeAttribute(key);
    }
}
export function createComponent(comp,props){
    let inst;
    console.log(comp);
    
    // 如果是类 定义的组件 创建实例 返回
    if(comp.prototype && comp.prototype.render){
        inst =  new comp(props);
    }else{
        // 函数组件 将函数组件 扩展成类组件 方便后面统一管理
        inst =  new Component(props);
        inst.constructor = comp;
        inst.render = function(){
            return this.constructor(props);
        }
    }
    console.log(inst);
    return inst;
}
export function renderComponent(comp){
    let base = '';
    const renderer = comp.render(); // 返回jsx对象
    // base = _render(renderer);
   
    if(comp.base && comp.componentWillUpdate){
        comp.componentWillUpdate();
    }
    // 节点替换
    // if (comp.base && comp.base.parentNode) {
    //     comp.base.parentNode.replaceChild(base, comp.base)
    // }
    base = diffNode(comp.base, renderer);
    console.log(base,'哈哈哈')
    if(comp.base){ //证明不是第一次
        if (comp.componentDidUpdate) comp.componentDidUpdate();
    }else if(comp.componentDidMount){
        comp.componentDidMount();
    }
  
    comp.base = base;
}
// 设置组件属性
export function setComponentProps(comp,props){
    if(!comp.base){
        if(comp.componentWillMount){
            comp.componentWillMount();
        }
    }else if(comp.componentWillReceiveProps){
        comp.componentWillReceiveProps(props);
    }
    // 设置组件的属性
    comp.props = props;
    // 渲染组件
    renderComponent(comp);
}
// 返回节点对象
function _render(vnode){
    if (vnode === undefined || vnode === null || typeof vnode === 'boolean') vnode = '';
    // 如果vnonde 是字符串
    if(typeof vnode === 'number'){
        vnode = String(vnode);
    }
    if (typeof vnode === 'string') {
        // 创建文本节点 
        return document.createTextNode(vnode);
    }
    //  是一个虚拟的对象
    const { tag, attrs, childrens } = vnode;
    // 如果tag 是函数
    if(typeof tag === 'function'){
        // 1. 创建组件
           const comp =  createComponent(tag,attrs);
           console.log(comp);
        // 2.设置组件的属性
            setComponentProps(comp,attrs);
        // 3. 组件的节点对象返回
        return comp.base;
    }
    // 创建节点对象
    const dom = document.createElement(tag);
    if (attrs) {
        // 有属性
        Object.keys(attrs).forEach(key => {
            const value = attrs[key];
            setAttribute(dom, key, value);
        });
    }
    if(childrens){
        // 递归调用render 方法 
        childrens.forEach(v => render(v, dom));
    }
  

    return dom;
}
export default ReactDOM;