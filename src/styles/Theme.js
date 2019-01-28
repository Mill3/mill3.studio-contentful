import { theme } from 'rebass'
import reboot from 'styled-reboot'

export const colors = {
  text: '#000e1a',
  black: '#121212',
  white: '#fff',
  blue: '#007ce0',
  navy: '#004175',
}

export const breakpoints = [
  `576px`, `768px`, `992px`, `1200px`, `1400px`
]

export const space = [
  0, 4, 8, 16, 32, 64, 128, 256
]

export const fonts = {
  sans: 'Larsseit, Helvetica, system-ui, sans-serif',
  serif: 'GT Super Display, Georgia, serif',
  mono: 'Menlo, monospace',
}

export const fontSizes = [
  12,
  14,
  16,
  20,
  32,
  48,
  64,
  96
]

export const rebootCSS = reboot({
  fontFamilyBase: fonts.sans,
  fontFamilyMonospace: fonts.mono,
  fontFamilySerif: fonts.serif,
  linkColor: colors.blue
});

export default {
  ...theme,
  breakpoints,
  colors,
  space,
  fonts,
  fontSizes
}