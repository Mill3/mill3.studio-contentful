import React from 'react'
import styled from 'styled-components';
import { TransitionState } from 'gatsby-plugin-transition-link'

const Debug = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1rem;
  background: red;
  font-size: .9rem;
  opacity: 0;
  &:hover {
    opacity: 1;
  }
`

function print_r(o) {
  if (typeof window === `undefined`) return

  return JSON.stringify(o, null, '\t')
    .replace(/\n/g, '<br>')
    .replace(/\t/g, '&nbsp;&nbsp;&nbsp;')
}

function DisplayState() {
  return (
    <TransitionState>
      {context =>
        context ? (
          <Debug style={{ marginTop: '100px' }}>
            {console.log(context)}
            <pre dangerouslySetInnerHTML={{ __html: print_r(context) }} />
          </Debug>
        ) : <div>{console.log(context)}</div>
      }
    </TransitionState>
  )
}

export default DisplayState