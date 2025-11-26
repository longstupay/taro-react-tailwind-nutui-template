import { PropsWithChildren } from 'react'
import { useLaunch } from '@tarojs/taro'
import './app.scss'
// 引入所有组件的样式文件
import '@nutui/nutui-react-taro/dist/style.css';

function App({ children }: PropsWithChildren) {

  useLaunch(() => {
    console.log('App launched.')
  })

  // children 是将要会渲染的页面
  return children
}

export default App
