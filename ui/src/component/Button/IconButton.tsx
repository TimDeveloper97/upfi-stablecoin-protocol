import React, { Children } from 'react'
import styled, { css } from 'styled-components'

const IconButton: React.FC<{onClick: () => void}> = ({onClick, children}) => {
    const BtnStyled = styled.div`
    border: none;
    width: 35px;
    height: 35px;
    margin-left: 8px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      background: #E5E5E5
    }
`
    return (
            <BtnStyled
                onClick={onClick}
            >
                {children}
            </BtnStyled>
    )
}

export default IconButton