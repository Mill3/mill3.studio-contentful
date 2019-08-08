//import locales from '@locales'

export const pathIsLocaleRoot = (location) => {
  // get all parts of current location, filter will discard empty array cells
  const parts = location.pathname.split(`/`).filter(function(e){return e})

  // if lenght is 1, we are on landing page
  return parts.length === 1
}

export default pathIsLocaleRoot