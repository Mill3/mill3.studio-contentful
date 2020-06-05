import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex, Box } from 'rebass'
import { injectIntl } from 'react-intl'

import { ArrowButton } from '@components/buttons'
import Container from '@styles/Container'
import ChipButton from '@components/buttons/ChipButton'
import ClientsTicker from '@components/clients/ClientsTicker'
import ClientsList from '@components/clients/ClientsList'

const ClientsFooterContainer = styled.footer``

const ClientsFooter = ({ intl, asList = false, switchButton = true }) => {
  // console.log('limit:', limit)
  const [list, setList] = useState(asList)
  const [limit, setLimit] = useState(18)

  return (
    <ClientsFooterContainer>
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
            <ClientsList limit={limit} />
          </Container>
        )}
        {limit && list &&
          <Flex pt={54} as="nav" justifyContent="center">
            <a href="#" onClick={(e) => setLimit(null)}>
              <ArrowButton arrow={false}>Show full list</ArrowButton>
            </a>
          </Flex>
        }
        {/* show ticker */}
        {!list && <ClientsTicker quantity={5} />}
      </Box>
    </ClientsFooterContainer>
  )
}

export default injectIntl(ClientsFooter)
