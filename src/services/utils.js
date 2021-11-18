import axios from 'axios'
import { mainServerUrl } from '../config'

const Api = axios.create({
  baseURL: location.hostname === "localhost" ? 'http://localhost:5000/api/v1' : mainServerUrl,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
})

let convertCryptoToCrypto = []
convertCryptoToCrypto['EOS'] = 'https://www.api.bloks.io/ticker/[object%20Object]'
convertCryptoToCrypto['TLOS'] = 'https://www.api.bloks.io/telos/ticker/[object%20Object]'
convertCryptoToCrypto['LNX'] = 'https://www.api.bloks.io/lynx/ticker/[object%20Object]'


const convertCTC = (currentCurrency, contractCurrency, value) => {

	if(currentCurrency == contractCurrency){
		return value
	}
	
	let newValue
	
	const currentCurrencyToUsd = () => {
		return axios.get(convertCryptoToCrypto["currentCurrency"]).then((result) => {
			return result.data
		})
	}
	
	const contractCurrencyToUsd = () => {
		return axios.get(convertCryptoToCrypto["contractCurrency"]).then((result) => {
			return result.data
		})
	}
	
	console.log('contractCurrencyToUsd', contractCurrencyToUsd)
	
}

const sendAutoCreation = (type,wallet) => {
  return Api.get(`/autocreateevent?type=${type}&wallet=${wallet}`)
}

const transactionRefBlockNumApi = () => {
	return axios.get('https://testnet.lynxchain.io/v1/chain/get_info') //last_irreversible_block_num
}

const transactionRefBlockPrefixApi = () => {
	return axios.post('https://testnet.lynxchain.io/v1/chain/get_block', {"block_num_or_id": 1}) //ref_block_prefix
}

const getExchangeRate = () => {
  return axios.get('https://api.gdax.com/products/EOS-USD/ticker')
}

const getExchangeRateLynx = () => {
	return axios.get('https://graphs2.coinpaprika.com/currency/data/lynx-lynx/1y/?quote=usd')
}

const getExchangeRateTlos = () => {
	return axios.get('https://www.api.bloks.io/telos/ticker/[object%20Object]')
}

const linkSteam = (name,wallet,symbol) => {
  return window.location.replace(
    `${mainServerUrl}/linkSteam?${wallet}=${name}&chain=${symbol}&redirectURL=${window.location.origin}/profile`
  )
}

const fetchUrl = url => {
  return axios.get(url)
}

const unLinkSteam = (name,wallet) => {
  return Api.get(`/unlinkSteam?${wallet}=${name}`)
}

const getUserInfo = (name,wallet) => {
  return Api.get(`/userInfo?${wallet}=${name}`).then(response => {
	  return response
  }).catch(err => {
	return err.response
  })
}

const addBannedEvent = (name,wallet,eventId) => {
	return Api.get(`/addBannedEvent?${wallet}=${name}&eventId=${eventId}`)
}

const addReferralNameArray = (refferer,wallet,name,symbol) => {
  console.log(name)
  return Api.get(`/increaseReferralsArray?${wallet}=${refferer}&refferer=${refferer}&name=${name}&chain=${symbol}`)
}
const updateUserStatsRefferals = (name,wallet,playedgames,symbol) => {
	return Api.get(`/updateUserStatsRefferals?${wallet}=${name}&playedgames=${playedgames}&chain=${symbol}`)
}

const getMonthlyLevels = () => {
	return Api.get(`/getMonthlyLevels`)
}

const getReferralsLevels = () => {
	return Api.get(`/getReferralsLevels`)
}

const isUserSpecial = (name) => {
	return Api.get(`/isUserSpecial?name=${name}`).then(response => {
		  return response
	}).catch(err => {
	  return err.response
	})
}
const getRefSalary = (name) => {
	return Api.get(`/getSumRefSalary?name=${name}`)
}

const addKickedEvent = (name,wallet,eventId) => {
	return Api.get(`/addKickedEvent?${wallet}=${name}&eventId=${eventId}`)
}
const removeKickedEvent = (name,wallet) => {
	return Api.get(`/removeKickedEvent?${wallet}=${name}`)
}
const preCheckEvents = (type,eventId,player1 = '',player2 = '',player3 = '',player4 = '',player5 = '',player6 = '',player7 = '',player8 = '',player9 = '',player10 = '') => {
	return Api.get(`/precheckevents?type=${type}&eventId=${eventId}&player1=${player1}&player2=${player2}&player3=${player3}&player4=${player4}&player5=${player5}&player6=${player6}&player7=${player7}&player8=${player8}&player9=${player9}&player10=${player10}`)
}
const forcedCancelEvent = (type,eventId) => {
	return Api.get(`/forcedcancel?type=${type}&eventId=${eventId}`)
}
const getAvaEvent = (type,eventId) => {
	return Api.get(`/getAvaEvent?type=${type}&eventId=${eventId}`).then(response => {
		  return response
	}).catch(err => {
	  return err.response
	})
}
const inviteUsers = (eventId, type) => {
	return Api.get(`/inviteUsers?type=${type}&eventId=${eventId}`).then(response => {
		  return response
	}).catch(err => {
	  return err.response
	})
}
const sendReady = (eventId, type, player, ready) => {
	return Api.get(`/playerReady?type=${type}&eventId=${eventId}&player=${player}&ready=${ready}`).then(response => {
		  return response
	}).catch(err => {
	  return err.response
	})
}
const anyState = (eventId, type, status) => {
	return Api.get(`/anyState?type=${type}&eventId=${eventId}&status=${status}`).then(response => {
		  return response
	}).catch(err => {
	  return err.response
	})
}
const apiLobbyDestroy = (serverAddress) => {
	return axios.get(serverAddress + '/lobby/destroy').then(response => {
		  return response
	}).catch(err => {
	  return err.response
	})
}
const updateLobbyExpires = (eventId, type) => {
	return Api.get(`/updateLobbyExpires?type=${type}&eventId=${eventId}`).then(response => {
		  return response
	}).catch(err => {
	  return err.response
	})
}
const setOnline = (name,wallet,lastTimeSeen) => {
  return Api.get(`/setOnline?${wallet}=${name}&lastTimeSeen=${lastTimeSeen}`).then(response => {
	  return response
  }).catch(err => {
	return err.response
  })
}

const serverTime = () => {
	const server = location.hostname === "localhost" ? 'http://localhost:5000/getServerTime' : 'https://api.farm.game/getServerTime'
	return axios.get(server).then(response => {
		return response.data
	}).catch(err => {
		console.log('err serverTime', err)
		return false;
	});
}

const tempoReady = (method, name,wallet,eventId) => {
	return Api.get(`/tempoReady/${method}?${wallet}=${name}&eventId=${eventId}`).then(response => {
		  return response
	  }).catch(err => {
		return err.response
	  })
}

const getRublesFromUsd = () => {
	return axios.get('https://api.exchangeratesapi.io/latest?symbols=USD&base=RUB').then(response => {
		  return response
	  }).catch(err => {
		return err.response
	  })
}

const participationForTournament = (accountName, tournamentId, avatarUrl, steamId, fio, vk, paymentRate) => {
	return Api.get(`/addTournamentParticipator?accountName=${accountName}&tournamentId=${tournamentId}&avatarUrl=${avatarUrl}&steamId=${steamId}&fio=${fio}&vk=${vk}&paymentRate=${paymentRate}`).then(response => {
	  return response
  }).catch(err => {
	return err.response
  })
}
const getTournamentParticipators = () => {
	return Api.get('/getTournamentParticipators').then(response => {
	  return response
  }).catch(err => {
	return err.response
  })
}

const doApplicationShifr = (eventId, mode) => {
	return Api.get(`/applicationShifr?eventId=${eventId}&mode=${mode}`).then(response => {
		  return response
	  }).catch(err => {
		return err.response
	  })
}
const checkProgramm = () => {
	return axios.get('http://127.0.0.1:9050/').then(response => {
		return response
	}).catch(err => {
		return err.response
	})
}

const createEventApi = (name, contractName, val, memo) => {
	return Api.get(`/createEventApi?username=${name}&contractName=${contractName}&val=${val}&memo=${memo}`).then(response => {
		  return response
	  }).catch(err => {
		return err.response
	  })
}

const participationApi = (name, contractName, quantity, memo) => {
	return Api.get(`/participationApi?username=${name}&contractName=${contractName}&quantity=${quantity}&memo=${memo}`).then(response => {
		  return response
	  }).catch(err => {
		return err.response
	  })
}

const cancelApi = (event_id, user) => {
	return Api.get(`/cancelApi?event_id=${event_id}&username=${user}`).then(response => {
		  return response
	  }).catch(err => {
		return err.response
	  })
}



export {
  sendAutoCreation,
  transactionRefBlockNumApi,
  transactionRefBlockPrefixApi,
  getExchangeRate,
  getExchangeRateLynx,
  getExchangeRateTlos,
  getUserInfo,
  unLinkSteam,
  linkSteam,
  fetchUrl,
  addReferralNameArray,
  updateUserStatsRefferals,
  addBannedEvent,
  getMonthlyLevels,
  isUserSpecial,
  getReferralsLevels,
  getRefSalary,
  addKickedEvent,
  removeKickedEvent,
  preCheckEvents,
  forcedCancelEvent,
  getAvaEvent,
  inviteUsers,
  sendReady,
  anyState,
  apiLobbyDestroy,
  updateLobbyExpires,
  setOnline,
  serverTime,
  tempoReady,
  getRublesFromUsd,
  participationForTournament,
  getTournamentParticipators,
  doApplicationShifr,
  checkProgramm,
  createEventApi,
  participationApi,
  cancelApi
}
