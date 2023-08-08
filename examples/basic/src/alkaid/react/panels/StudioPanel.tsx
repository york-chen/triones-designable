import React from 'react'
import {useCssInJs, usePosition, usePrefix} from '../hooks'
import {Layout} from '../containers'
import cls from 'classnames'
import {genStudioPanelStyle} from "./styles";


export interface IStudioPanelProps {
    children?: React.ReactNode
    style?: React.CSSProperties
    className?: string
    logo?: React.ReactNode
    actions?: React.ReactNode
    prefixCls?: string
    theme?: string
    position?: React.ComponentProps<typeof Layout>['position']
}

const StudioPanelInternal: React.FC<IStudioPanelProps> = ({
                                                              logo,
                                                              actions,
                                                              ...props
                                                          }) => {
    const prefix = usePrefix('main-panel')
    const position = usePosition()
    const classNameBase = cls('root', position, props.className)

    const {hashId,wrapSSR} = useCssInJs({prefix,styleFun:genStudioPanelStyle})

    if (logo || actions) {
        return wrapSSR(
            <div {...props} className={cls(`${prefix}-container`, classNameBase,hashId)}>
                <div className={prefix + '-header'}>
                    <div className={prefix + '-header-logo'}>{logo}</div>
                    <div className={prefix + '-header-actions'}>{actions}</div>
                </div>
                <div className={prefix}>{props.children}</div>
            </div>
        )
    }
    return (
        wrapSSR(
            <div {...props} className={cls(prefix,classNameBase,hashId)}>
                {props.children}
            </div>
        )
    )
}

export const StudioPanel: React.FC<IStudioPanelProps> = (props) => {
    return (
        <Layout
            theme={props.theme}
            prefixCls={props.prefixCls}
            position={props.position}
        >
            <StudioPanelInternal {...props} />
        </Layout>
    )
}
