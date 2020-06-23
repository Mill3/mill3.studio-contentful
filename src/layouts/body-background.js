import React, { useContext } from 'react'
import styled from 'styled-components'
import { Box } from 'rebass'

import { LayoutContext } from '@layouts/layoutContext'

const BodyBackgroundStyle = styled.div`
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    opacity: ${({visible}) => visible ? `1` : `0`};
    transition: opacity 250ms linear;
    will-change: opacity;
`

const BodyBackground = () => {
    const { layoutState } = useContext(LayoutContext)
    const { invertedBody } = layoutState

    return (
        <Box as={BodyBackgroundStyle} bg="black" width={[1]} height="100%" visible={invertedBody} />
    )
}

export default BodyBackground