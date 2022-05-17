import React from 'react'
import styled, { css } from 'styled-components'
import { Color } from '../../assets/style/Color'
import IconLoading from "../loading/Loading";

type ButtonType = {
    color?: string,
    status: 'disable' | 'enable' | 'loading',
    type?: 'primary' | 'secondary',
    action: () => void,
    style?: any,
    children: any,
}

const BtnStyled = styled.div`
border-radius: 39px;
width: 100%;
display: flex;
border: none;
flex-direction: row;
justify-content: center;
align-items: center;
padding: 8px 16px;
height: 100%;
outline: none;
font-weight: 500;
font-size: 14px;
line-height: 22px;
font-style: normal;
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
    background: ${Color.btnSecondaryActive}

`}

${(props: any) => (props.status === 'enable' && props.type === 'primary') && css`
    color: ${Color.white};
    cursor: pointer;
    background: ${Color.btnSecondaryActive}
`}

${(props: any) => (props.status === 'enable' && props.type === 'secondary') && css`
    color: ${Color.white};
    cursor: pointer;
    background: ${Color.btnActive}
`}
`

const SecondaryButton: React.FC<ButtonType> = (props: ButtonType) => {
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
          <>
            {
              status === 'loading' ? <IconLoading /> : children
            }
          </>
        </BtnStyled>
    )
}

SecondaryButton.defaultProps = {
    status: 'disable',
    type: 'primary',

}

export default SecondaryButton
