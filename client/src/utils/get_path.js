import { replaceCdnDomain } from './fetchers';

/**
 * @param {string} imageId
 * @returns {string}
 */
function getImagePath(imageId) {
  return `/images/${imageId}.jpg`;
}

/**
 * @param {string} movieId
 * @returns {string}
 */
function getMoviePath(movieId) {
  return `/movies/${movieId}.gif`;
}

/**
 * @param {string} soundId
 * @returns {string}
 */
function getSoundPath(soundId) {
  return `/sounds/${soundId}.mp3`;
}

/**
 * @param {string} profileImageId
 * @returns {string}
 */
function getProfileImagePath(profileImageId) {
  return replaceCdnDomain(`/images/profiles/${profileImageId}.jpg`, {
    imageSuffix: '?&width=800',
  });
}

export { getImagePath, getMoviePath, getSoundPath, getProfileImagePath };
