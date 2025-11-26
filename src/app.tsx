import { PropsWithChildren } from 'react'
import { useLaunch } from '@tarojs/taro'
import { StoreProvider } from './context/StoreContext'
import './app.scss'


function App({ children }: PropsWithChildren) {

  useLaunch(() => {
    console.log('App launched.')
  })

  // children 是将要会渲染的页面
  return (
    <StoreProvider>
      {children}
    </StoreProvider>
  )
}

export default App
