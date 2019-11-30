import React from './react';
import ReactDOM  from './react-dom';
const ele=(
    <div className='top'>
        helloe <span id='12'>hahah</span>
    </div>
);
// function Home(){
//     return(
//         <div className='top'>
//             helloe <span id='12'>hahah</span>
//         </div>
//     )
// };
class Home extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            num:0
        }
    };
    componentDidMount(){
        console.log('加载完成')
    };
    componentWillMount(){
        console.log('组件即将完成');
    }
    componentWillUpdate(){
       console.log('即将更新');
    };
    componentDidUpdate(){
        console.log('更新完了');
        
    }

    click(){
        const {num } = this.state;
        this.setState({
            num:num+1
        })
    }
    render(){
        return(
            <div className='top' {...this.props}>
                <h1>count: {this.state.num}</h1>
                <button onClick={this.click.bind(this)}>点我</button>
            </div>
        )
       
    }
}
ReactDOM.render(<Home/>,document.querySelector('#root'));

