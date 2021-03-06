import React from 'react'
import posed from 'react-pose'

import { TRANSITION_INTRO_DELAY, TRANSITION_INTRO_DURATION } from '@utils/constants'
import { LogoSVG } from '@svg/Logo'

const poses = {
  initial: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -80,
    delay: ({ charIndex }) => (TRANSITION_INTRO_DELAY * 0.75) + (charIndex * 15),
    transition: {
      type: 'tween',
      ease: 'backInOut',
      duration: TRANSITION_INTRO_DURATION,
    },
  },
}

const LetterPolygon = posed.polygon(poses)
const LetterPath = posed.path(poses)

const LogoAnimated = ({ inverted, animated }) => {
  return (
    <LogoSVG
      inverted={inverted}
      width="154px"
      height="44px"
      viewBox="0 0 154 44"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="menu_black">
          <g id="Group-9">
            <g id="Group-8">
              <LetterPolygon
                initialPose={`initial`}
                pose={animated ? `out` : `initial`}
                charIndex={5}
                fill="#000000"
                points="34.321 1.03693333 24.0488889 25.2045123 23.2633333 27.4832491 22.5384444 25.2045123 12.2660741 1.03693333 0 1.03693333 0 43.0157637 10.4533333 43.0157637 10.4533333 19.9273427 11.662 24.0654012 18.7916296 43.0157637 27.7951852 43.0157637 34.9253333 24.0654012 36.1334815 19.9273427 36.1334815 43.0157637 46.5870741 43.0157637 46.5870741 1.03693333"
              />
              <LetterPolygon
                initialPose={`initial`}
                pose={animated ? `out` : `initial`}
                charIndex={4}
                fill="#000000"
                points="54.4415926 43.0157895 64.8949259 43.0157895 64.8949259 1.03695906 54.4415926 1.03695906"
              />
              <LetterPolygon
                initialPose={`initial`}
                pose={animated ? `out` : `initial`}
                charIndex={3}
                fill="#000000"
                points="83.2032185 1.03695906 83.2032185 33.3610058 92.2682185 33.3610058 92.2682185 43.0157895 72.7498852 43.0157895 72.7498852 1.03695906"
              />
              <LetterPolygon
                initialPose={`initial`}
                pose={animated ? `out` : `initial`}
                charIndex={2}
                fill="#000000"
                points="110.576589 1.03695906 110.576589 33.3610058 119.641589 33.3610058 119.641589 43.0157895 100.123256 43.0157895 100.123256 1.03695906"
              />
              <LetterPath
                initialPose={`initial`}
                pose={animated ? `out` : `initial`}
                charIndex={1}
                d="M148.733278,3.85530058 C151.2105,6.19424795 152.479315,9.1926807 152.479315,12.8505988 C152.479315,17.1088211 150.304389,19.8671836 147.705833,21.1269731 C151.875241,22.5061544 153.929611,25.6247509 153.929611,30.4817333 C153.929611,38.8774994 148.249759,43.7954643 139.125648,43.7954643 C129.94113,43.7954643 124.382093,38.5180374 124.382093,29.5829497 L134.775019,29.5829497 C134.835685,32.5211719 136.587759,34.1406807 139.488352,34.1406807 C141.904907,34.1406807 143.415611,32.6413357 143.415611,30.0023649 C143.415611,27.1840491 141.663278,25.7441427 138.219278,25.7441427 L134.895833,25.7441427 L134.895833,16.9289614 L138.098204,16.9289614 C140.697019,16.9289614 142.025981,15.7296398 142.025981,13.3309965 C142.025981,11.1713942 140.817574,9.91237661 138.884019,9.91237661 C136.889796,9.91237661 135.379093,11.4114643 135.379093,14.1103883 L124.986167,14.1103883 C124.986167,5.47455205 130.243426,0.257335673 138.642389,0.257335673 C142.932611,0.257335673 146.255537,1.4564 148.733278,3.85530058"
                id="Fill-5"
                fill="#000000"
              />
              <g id="Group-7" transform="translate(124.185185, 0.052749)" />
            </g>
          </g>
        </g>
      </g>
    </LogoSVG>
  )
}

LogoAnimated.defaultProps = {
  inverted: false,
  animated: false,
}

export default React.memo(LogoAnimated)
