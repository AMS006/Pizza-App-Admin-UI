import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import 'antd/dist/reset.css'
import { ConfigProvider } from 'antd'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider theme={{
      token: {
        colorPrimary: '#367181',
        colorLink: '#367181',
      }
    }}>
      <RouterProvider router={router} />
    </ConfigProvider>
  </React.StrictMode>,
)
