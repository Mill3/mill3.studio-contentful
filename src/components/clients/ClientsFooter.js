import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { Flex, Box } from 'rebass'
import { injectIntl } from 'gatsby-plugin-intl'

import { ArrowButton } from '@components/buttons'
import Container from '@styles/Container'
import ChipButton from '@components/buttons/ChipButton'
import ClientsTicker from '@components/clients/ClientsTicker'
import ClientsList from '@components/clients/ClientsList'

const ClientsFooter = ({ intl, limit = 18, asList = false, switchButton = true, ...rest }, { getScrollbar }) => {
  const [list, setList] = useState(asList)
  const [listLimit, setLimit] = useState(limit)
  const ref = useRef()

  return (
    <Box as="footer" {...rest}>
      {switchButton && (
        <Flex justifyContent={`flex-end`} px={[4, 3, 6]} mb={list ? ['-25px', 0] : ['-55px']}>
          <ChipButton onClick={e => setList(!list)}>
            {intl.formatMessage({ id: !list ? 'Show list' : 'Ticker please!' }).toString()}
          </ChipButton>
        </Flex>
      )}

      <Box mt={list && switchButton ? [0, 0, 2] : [0]}>
        {/* show client list */}
        {list && (
          <Container>
            <ClientsList fwdRef={ref} limit={listLimit} />
          </Container>
        )}

        {/* show more/less button */}
        {list && (
          <Flex pt={54} as="nav" justifyContent="center">
            <button
              className="btn-reset"
              onClick={() => {
                if( ref.current ) {
                  const { y } = ref.current.getBoundingClientRect()
                  const height = listLimit * 81

                  getScrollbar(scrollbar => {
                    const offset = scrollbar.offset.y
                    const top = y + height + offset - 100

                    if( listLimit ) {
                      // expand list
                      setLimit(null)

                      // scroll list to top
                      scrollbar.scrollTo(0, top, 1200)
                    } else {
                      // scroll list to top
                      scrollbar.scrollTo(0, top, 1200, {
                        callback: () => {
                          // collapse list
                          setLimit(limit)
                        }
                      })
                    }
                  })
                }
                else setLimit(listLimit ? null : limit)
              }}
            >
              <ArrowButton arrow={false}>{intl.formatMessage({ id: listLimit ? 'clients.showMoreButton' : 'clients.showLessButton'}).toString()}</ArrowButton>
            </button>
          </Flex>
        )}

        {/* show ticker */}
        {!list && <ClientsTicker quantity={5} />}
      </Box>
    </Box>
  )
}

ClientsFooter.contextTypes = {
  getScrollbar: PropTypes.func,
}

export default injectIntl(ClientsFooter)
