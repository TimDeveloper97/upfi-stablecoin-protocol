import React, {useEffect, useState} from "react";

const MenuIcon = (props) => {
  const {children} = props
  return (
    <div className="sidebar-icon">
      {children}
    </div>
  )
}

export default MenuIcon