

//
// Extract content type from a mime-type value
// return string
//

export const CONTENT_TYPES = {
  'video': 'video',
  'image': 'image',
  'default': null
}

export const getContentType = contentType => {
  if (contentType.match(CONTENT_TYPES['video']) && contentType.match(CONTENT_TYPES['video']).index >= 0) {
    return CONTENT_TYPES['video']
  }

  if (contentType.match(CONTENT_TYPES['image']) && contentType.match(CONTENT_TYPES['image']).index >= 0) {
    return CONTENT_TYPES['image']
  }

  // default is null
  return CONTENT_TYPES['default']
}