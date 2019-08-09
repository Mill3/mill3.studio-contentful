import React, { useState } from 'react'
import { Flex, Box } from 'rebass'
import { injectIntl } from 'react-intl'

import Container from '@styles/Container'
import ChipButton from '@components/buttons/ChipButton'
import ClientsTicker from '@components/clients/ClientsTicker'
import ClientsList from '@components/clients/ClientsList'

const ClientsFooter = ({ intl }) => {
  const [list, setList] = useState(false)

  return (
    <>
      <Flex justifyContent={`flex-end`} px={[4, 3, 6]} mb={list ? ['-25px', 0] : ['-55px']}>
        <ChipButton onClick={e => setList(!list)}>
          {intl.formatMessage({ id: !list ? 'Show list' : 'Ticker please!' }).toString()}
        </ChipButton>
      </Flex>

      <Box mt={list ? [0,0,2] : [0]}>
        {/* show client list */}
        {list && (
          <Container>
            <ClientsList />
          </Container>
        )}
        {/* show ticker */}
        {!list && <ClientsTicker quantity={5} />}
      </Box>
    </>
  )
}

export default injectIntl(ClientsFooter)
