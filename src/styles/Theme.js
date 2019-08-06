import { theme } from 'rebass'
import reboot from 'styled-reboot'

export const colors = {
  text: '#000e1a',
  black: '#121212',
  gray: '#9B9B9B',
  white: '#ffffff',
  blue: '#3426F1',
  navy: '#004175',
  purple: '#3426F1',
  lightGray: '#f7f7f7',
}

export const breakpoints = [
  `576px`, `768px`, `992px`, `1200px`, `1441px`, `1600px`
]

export const space = [
  0, 4, 8, 16, 32, 64, 128, 256
]

export const fonts = {
  sans: 'Larsseit, Helvetica, system-ui, sans-serif',
  serif: 'GT Super Display, Georgia, serif',
  headings: 'GT Super Display, Georgia, serif',
  mono: 'Menlo, monospace',
}

export const fontSizes = [
  12,
  15,
  18,
  20,
  28,
  42,
  52,
  96
]

export const header = {
  height: 105,
}

export const rebootCSS = reboot({
  fontFamilyBase: fonts.sans,
  fontFamilyMonospace: fonts.mono,
  fontFamilySerif: fonts.serif,
  fontWeightBase: 300,
  linkColor: colors.blue
});

export default {
  ...theme,
  breakpoints,
  colors,
  space,
  fonts,
  fontSizes,
  header
}
