import { renderComponent } from "../react-dom";
class Component{
    constructor(props = {}){
        this.props = props;
        this.state={}
    }
    setState(change){
        // 对象拷贝
        Object.assign(this.state,change);
        // 渲染组件
        renderComponent(this);
    }
};

export default Component;