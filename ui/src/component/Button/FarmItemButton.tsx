import React from 'react'
import styled, { css } from 'styled-components'
import { AiOutlineReload } from "react-icons/ai"
import { Color } from '../../assets/style/Color'

type ButtonType = {
    color?: string,
    status: 'disable' | 'enable' | 'loading',
    type?: 'primary' | 'secondary',
    action: () => void,
    style?: any,
    children: any,
}

const BtnStyled = styled.div`
border-radius: 3px;
width: 100%;
display: flex;
border: none;
flex-direction: row;
justify-content: center;
align-items: center;
padding: 0px 12px;
height: 100%;
outline: none;
font-weight: 600;
font-size: 12px;
line-height: 18px;
color: #FFFFFF;
${(props: any) => (props.status === 'disable' || props.status === 'loading') && css`
    color: ${Color.white};
    cursor: not-allowed;
    background: ${Color.btnDisable}
`}

${(props: any) => (props.status === 'enable' && Boolean(props.color)) && css`
    border: 2px solid;
    border-color: ${props.color} !important;
    color: ${props.color} !important;
    background: ${Color.btnFarmItemActive}

`}

${(props: any) => (props.status === 'enable' && props.type === 'primary') && css`
    color: ${Color.white};
    cursor: pointer;
    background: ${Color.btnFarmItemActive}
`}
`

const FarmItemButton: React.FC<ButtonType> = (props: ButtonType) => {
    const { status, action, style, children, type } = props

    return (
        <BtnStyled
            color={props.color}
            //@ts-ignore
            status={status}
            type={type}
            style={{ ...style }}
            onClick={() => {
                if (status === 'disable') {
                    return
                } else {
                    action()
                }
            }}
        >
           {children}
        </BtnStyled>
    )
}

FarmItemButton.defaultProps = {
    status: 'disable',
    type: 'primary',

}

export default FarmItemButton
