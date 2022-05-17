import React from "react"
import './style.less'
const MultipleIcon = (props) => {

  const { icons } = props;

  return (

    <div className={'icon-list'}>
      {
        icons.map((icon, index) => {
          return (<img key={index} className={'icon-item'} src={icon} alt="" />);
        })
      }
    </div>
  )
}

export default MultipleIcon