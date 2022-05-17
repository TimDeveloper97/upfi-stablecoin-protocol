import React from 'react'
import './loading.less'
import { AiOutlineReload } from 'react-icons/ai'

const IconLoading: React.FC<{}> = (props: any) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <span>Sending request</span>

      <div className="snippet" data-title=".dot-elastic">
        <div className="stage">
          <div className="dot-elastic"></div>
        </div>
      </div>
    </div>
  )
}

export default IconLoading
