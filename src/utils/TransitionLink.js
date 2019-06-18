import React from 'react'
import { Link } from 'gatsby'
import { injectIntl } from 'react-intl'

import LayoutContext from '@components/contexts/LayoutContext'

const TransitionLinkComponent = ({ to, intl: { locale }, title, color, ...props }) => {
  const path = `/${locale}${to}`

  return (
    <LayoutContext.Consumer>
      {(data) => (
        <Link
          {...props}
          to={path}
          onMouseEnter={(e) => data.set({ transitionColor: color, transitionTitle: title })}
        />
      )}
    </LayoutContext.Consumer>
  )
}

export default injectIntl(TransitionLinkComponent)
