import { scatterRegex, serverList } from '../config'
import md5 from './crypto'
function copyToClipboard(text) {
  if (window.clipboardData && window.clipboardData.setData) {
    // IE specific code path to prevent textarea being shown while dialog is visible.
    return clipboardData.setData('Text', text)
  } else if (
    document.queryCommandSupported &&
    document.queryCommandSupported('copy')
  ) {
    var textarea = document.createElement('textarea')
    textarea.textContent = text
    textarea.style.position = 'fixed' // Prevent scrolling to bottom of page in MS Edge.
    document.body.appendChild(textarea)
    textarea.select()
    try {
      return document.execCommand('copy') // Security exception may be thrown by some browsers.
    } catch (ex) {
      console.warn('Copy to clipboard failed.', ex)
      return false
    } finally {
      document.body.removeChild(textarea)
    }
  }
}

function intDivision(val) {
  const remainderPart = val % 10
  const intPart = Math.floor(val / 10)
  return remainderPart !== 0 ? intPart + 1 : intPart
}

function hashCode(str) {
  return md5(str).substr(4, 6)
}
function checkAccess(event, name) {
  if (event.name_owner === name) {
    return true
  }
  const arr = [...event.direTeam, ...event.radiantTeam]
  const result = arr.findIndex(item => item.name === name)
  return result !== -1
}
function checkWinStatus5vs5(event, name) {
  if (event.sponsored && event.name_owner === name) {
    return true
  }
  const isWinDire = event.side_winner === 'dire'
  const isPlayerDire =
    event.direTeam.findIndex(item => item.name === name) !== -1
  return (isWinDire && isPlayerDire) || (!isWinDire && !isPlayerDire)
}

function checkScatterRegex(username) {
  return scatterRegex.test(username)
}
function getServerName(id) {
  const server = serverList.find(item => item.value === Number(id))
  if (server) {
    return server.title
  }
  return 'Unspecified'
}
function getServerGroup(id) {
  const server = serverList.find(item => item.value === Number(id))
  if (server) {
    return server.group
  }
  return 'Unspecified'
}
export {
  copyToClipboard,
  intDivision,
  hashCode,
  checkAccess,
  checkScatterRegex,
  getServerName,
  getServerGroup,
  checkWinStatus5vs5
}
