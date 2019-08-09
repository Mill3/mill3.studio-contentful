import React from 'react'

const ExternalLink = ({ color = `#000` }) => {
  return (
    <svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
        <g id="ic_pointer" transform="translate(-4.000000, -4.000000)" stroke={color} strokeWidth="2">
            <g id="pointer">
                <g transform="translate(5.000000, 5.000000)">
                    <polyline id="Path-10" points="6 0 14 0 14 8"></polyline>
                    <path d="M14,0 L1.77635684e-15,14" id="Line"></path>
                </g>
            </g>
        </g>
    </g>
</svg>
  )
}

export default ExternalLink
