import { getServerName, getServerGroup } from '../utils/lib'
class SteamInfo {
  constructor(id, username, avatarUrl, profileUrl, steamId, referrals, referralsArray, testgames, registeredTime, wallet, referalPercent, referralsLevel) {
    this.id = id
    this.username = username
    this.avatarUrl = avatarUrl
    this.profileUrl = profileUrl
    this.steamId = steamId
    this.referrals = referralsArray ? referralsArray.length : 0
    this.referralsArray = referralsArray ? referralsArray : []
    this.testgames = testgames
    this.registeredTime = registeredTime
	this.wallet = wallet
	this.referalPercent = referalPercent
	this.referralsLevel = referralsLevel
  }
}

class Event5vs5 {
  constructor(
    created_at,
    discipline,
    expires,
    key,
    lobby_created,
    lobby_private,
    lobby_sponsored,
	event_name,
    mode,
    name_owner,
    players,
    allData,
    price_owner,
    server,
    status,
    realStatus,
    side_winner,
    serverId,
	serverGroup,
	player1_ready,
	player2_ready,
	player3_ready,
	player4_ready,
	player5_ready,
	player6_ready,
	player7_ready,
	player8_ready,
	player9_ready,
	player10_ready,
	microsevice
  ) {
    this.created_at = created_at
    this.discipline = discipline
    this.expires = expires
    this.key = `${key}f`
    this.lobby_created = lobby_created

    // придумать что-нибудь с паролем
    this.lobby_private = lobby_private
    this.lobby_sponsored = !!lobby_sponsored
	this.event_name = event_name ? event_name : name_owner
    //

    this.mode = mode
    this.name_owner = name_owner
    this.radiantTeam = players.filter(item => item.side === 'radiant')
    this.direTeam = players.filter(item => item.side === 'dire')
    this.tSideTeam = players.filter(item => item.side === 'T-side')
    this.ctSideTeam = players.filter(item => item.side === 'CT-side')
    this.player1 = allData.player1
    this.player2 = allData.player2
    this.player3 = allData.player3
    this.player4 = allData.player4
    this.player5 = allData.player5
    this.player6 = allData.player6
    this.player7 = allData.player7
    this.player8 = allData.player8
    this.player9 = allData.player9
    this.player10 = allData.player10
    this.price_owner = parseFloat(price_owner)
    this.server = server
    this.status = status
    this.realStatus = realStatus
    this.side_winner = side_winner
    this.serverId = serverId
    this.serverGroup = serverGroup
	this.player1_ready = player1_ready
	this.player2_ready = player2_ready
	this.player3_ready = player3_ready
	this.player4_ready = player4_ready
	this.player5_ready = player5_ready
	this.player6_ready = player6_ready
	this.player7_ready = player7_ready
	this.player8_ready = player8_ready
	this.player9_ready = player9_ready
	this.player10_ready = player10_ready
	this.microsevice = microsevice
  }
}
const renderSteamInfo = data => {
  return new SteamInfo(
    data._id,
    data.username,
    data.ava,
    data.profileURL,
    data.steamId,
    data.referrals,
    data.referralsArray,
    data.testgames,
    data.registeredTime,
    data.wallet,
	data.referalPercent,
	data.referralsLevel
  )
}

const parsePlayer = item => {
  const rendered = item.split(',')
  return { name: rendered[0], steamId: rendered[1], side: rendered[2], comission: rendered[3] }
}

const renderEvent5vs5 = data => {
  const players = []
  const owner = parsePlayer(data.owner)
  // todo изначально записывать в players owner если lobby_sponsored = 0
  if (data.lobby_sponsored) {
    for (let i = 1; i <= 10; i++) {
      const player = data[`player${i}`]
      if (player) {
        players.push(parsePlayer(player))
      }
    }
  } else {
    players.push(owner)
    for (let i = 1; i <= 9; i++) {
      const player = data[`player${i}`]
      if (player) {
        players.push(parsePlayer(player))
      }
    }
  }

  return new Event5vs5(
    data.created_at,
    data.discipline,
    data.expires,
    data.key,
    data.lobby_created,
    data.lobby_private,
    data.lobby_sponsored,
	data.event_name,
    data.mode,
    owner.name,
    players,
	data,
    data.price_owner,
    data.server,
    data.status,
    data.realStatus,
    data.side_winner,
    data.serverId,
	data.serverGroup,
	data.player1_ready,
	data.player2_ready,
	data.player3_ready,
	data.player4_ready,
	data.player5_ready,
	data.player6_ready,
	data.player7_ready,
	data.player8_ready,
	data.player9_ready,
	data.player10_ready,
	data.microsevice
  )
}

const getStatus = (status, mode) => {
  const is5vs5 = mode === '5 vs 5'
  switch (parseFloat(status)) {
    case 0:
      return 0
    case 1:
      return 1
    case 2:
      return is5vs5 ? 0 : 2
    case 3:
      return is5vs5 ? 1 : 2
    case 4:
      return 4
    case 5:
      return is5vs5 ? 1 : 2
    case 6:
      return 3
  }
}
const getRealStatus = (status) => {
  return parseFloat(status)
}

const renderEvent = data => {
  data.realStatus = getRealStatus(data.status)
  data.status = getStatus(data.status, data.mode)
  data.serverId = data.server
  data.serverGroup = getServerGroup(data.server)
  data.server = getServerName(data.server)
  if (data.mode === '5 vs 5') {
    return renderEvent5vs5(data)
  }
  return data
}


class TournamentEvent {
  constructor(
    created_at,
    discipline,
    expires,
    key,
    lobby_created,
  ) {
    this.created_at = created_at
    this.discipline = discipline
    this.expires = expires
    this.key = `${key}t`
    this.lobby_created = lobby_created
    
  }
}

const renderTournamentEvent = data => {
	return new TournamentEvent(
	data.created_at,
	data.discipline,
	data.expires,
	data.key,
	data.lobby_created,
	)
}

export { renderSteamInfo, renderEvent, renderTournamentEvent }
