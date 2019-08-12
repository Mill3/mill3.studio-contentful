import locales from '@locales/locales'
import locale2 from 'locale2'

export const detectLocale = () => {
  // console.log(locale2);
  return locale2.split(`-`)[0]
}

export const getLocale = (location) => {
  const parts = location.pathname.split(`/`).filter(function(e){return e})
  return parts.length > 0 ? parts[0] : locales['en'].path
}

export const pathIsLocaleRoot = (location) => {
  // get all parts of current location, filter will discard empty array cells
  const parts = location.pathname.split(`/`).filter(function(e){return e})

  // if lenght is 1, we are on landing page
  return parts.length === 1
}

export default pathIsLocaleRoot