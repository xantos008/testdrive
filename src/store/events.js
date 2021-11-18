import { observable, action, computed } from 'mobx'
import {
  contractName,
  contractNameLynx,
  environment,
  contractName5vs5,
  contractName5vs5Lynx,
  mainServerUrl,
  allNets
} from '../config'
import User, { eos } from './user'
import Modal from './modal'
import history from '../history'
import Currency from './currency'
import { intDivision, checkAccess, checkWinStatus5vs5 } from '../utils/lib'
import { 
  sendAutoCreation,
  transactionRefBlockNumApi,
  transactionRefBlockPrefixApi,
  fetchUrl,
  addBannedEvent,
  preCheckEvents,
  forcedCancelEvent,
  getUserInfo as getUserInfoApi,
  isUserSpecial,
  getAvaEvent,
  inviteUsers,
  sendReady,
  apiLobbyDestroy,
  anyState,
  updateLobbyExpires,
  tempoReady,
  doApplicationShifr,
  createEventApi,
  participationApi,
  cancelApi
} from '../services/utils'

import { renderEvent } from './schemas'

function chkDuplicates(arr,justCheck){
  var len = arr.length, tmp = {}, arrtmp = arr.slice(), dupes = [];
  arrtmp.sort();
  while(len--){
   var val = arrtmp[len];
   if (/nul|nan|infini/i.test(String(val))){
     val = String(val);
    }
    if (tmp[JSON.stringify(val)] && val.length > 0){
       if (justCheck) {return true;}
       dupes.push(val);
    }
    tmp[JSON.stringify(val)] = true;
  }
  return justCheck ? false : dupes.length ? dupes : null;
}
function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

class Events {
  @observable myEvents = []
  @observable myActiveEvents = []
  @observable testFinished = []
  @observable events = []
  @observable allEvents = []
  @observable allEventsSnapshot = this.allEvents
  @observable contractName = allNets[User.wallet][User.symbol]["contractName"]
  @observable contractName5vs5 = allNets[User.wallet][User.symbol]["contractName5vs5"]
  @observable visitedEvent = false
  @observable showModalInvites = false
  @observable totalEvents = 0
  @observable wonEvents = 0
  @observable sponsorEvents = 0
  
  @observable eventsSort = {
    type: 'number',
    query: 'key',
    reverse: false
  }
  @observable steamCollection = new Map()

  @observable myEventsSort = {
    type: 'number',
    query: 'key',
    reverse: false
  }

  @observable eventsPage = 1
  @observable myEventsPage = 1

  @action setEventsPage(val) {
    console.log(val)
    const pagesCount = intDivision(this.events.length)
    if (val !== 0 && val !== pagesCount + 1) {
      this.eventsPage = val
    }
  }
  @action setMyEventsPage(val) {
    console.log(val)
    const pagesCount = intDivision(this.myEvents.length)
    if (val !== 0 && val !== pagesCount + 1) {
      this.myEventsPage = val
    }
  }

  @observable loading = true
  // todo remove dry logic (for table filter: sort, pagination)
  @action setEventsSort(config) {
    this.eventsSort = { ...this.eventsSort, ...config }
  }

  @action setMyEventsSort(config) {
    this.myEventsSort = { ...this.myEventsSort, ...config }
  }
    
  @action async getEventsInitial() {
    try {
      await this.getEvents()
    } finally {
      this.loading = false
    }
  }

  getEventByKey(key) {
    return computed(() => {
      return this.allEvents.find(item => {
        if (item.mode === '5 vs 5') {
          return item.key === key
        }
        return item.key === Number(key)
      })
    }).get()
  }

  @computed get filteredEvents() {
    const events = [...this.events]
    const sort = this.eventsSort

    if (sort.type === 'string') {
      const sortedEvents = events.sort((a, b) => {
        return a[sort.query].toLowerCase() < b[sort.query].toLowerCase()
      })
      return sort.reverse ? sortedEvents.reverse() : sortedEvents
    } else {
      const sortedEvents = events.sort((a, b) => {
        return Number(b[sort.query]) - Number(a[sort.query])
      })
      return sort.reverse ? sortedEvents.reverse() : sortedEvents
    }
  }

  @computed get filteredMyEvents() {
    const events = [...this.myEvents]
    const sort = this.myEventsSort
    if (sort.type === 'string') {
      const sortedEvents = events.sort((a, b) => {
        return a[sort.query].toLowerCase() < b[sort.query].toLowerCase()
      })
      return sort.reverse ? sortedEvents.reverse() : sortedEvents
    } else {
      const sortedEvents = events.sort((a, b) => {
        return Number(b[sort.query]) - Number(a[sort.query])
      })
      return sort.reverse ? sortedEvents.reverse() : sortedEvents
    }
  }

  @action async getEvents() {

    const response = await Promise.all([
      eos.getTableRows({
        scope: this.contractName,
        code: this.contractName,
        table: 'events',
        limit: 10000,
        json: true
      }),
      eos.getTableRows({
        scope: this.contractName5vs5,
        code: this.contractName5vs5,
        table: 'events',
        limit: 10000,
        json: true
      })
    ])
	
    const res = [...response[0].rows, ...response[1].rows].map(data =>
      renderEvent(data)
    )

    const now = User.time
    const myEventsResult = []
    const myActiveEventsResult = []
    const eventsResult = []
    const allEventsResult = []
	const testFinishedResult = []
    for (const item of res) {
		if(now > item.created_at){
			let findPlayer1 = ''
			let findPlayer2 = ''
			let eventBanned = false
			let eventKicked = false
			let customEventAvatar = ''
			let customEventBackground = ''
			let isTest = ''

			const is5vs5 = item.mode === '5 vs 5'
			
			if(!is5vs5){
				if(item.player1){
					findPlayer1 = item.player1.split(',')[0]
				}
				if(item.player2){
					findPlayer2 = item.player2.split(',')[0]
				}
			}
			
		  const access =
			(is5vs5 && checkAccess(item, User.name)) ||
			findPlayer1 === User.name ||
			findPlayer2 === User.name
			
		  if(User.bannedEvent){
			  User.bannedEvent.map(ban => {
				  if(ban == item.key){
					  if(!localStorage.getItem('event-' + item.key)){
						eventBanned = true
						localStorage.setItem('event-' + item.key, 'ok')
					  }
				  }
			  })
		  }
		 
		  if(User.kickedEvent){
			  User.kickedEvent.map(kick => {
				  if(kick == item.key){
					  eventKicked = true
				  }
			  })
		  }
		  
		  if(eventBanned){
			Modal.open('youWereKickedAndBannedModal')
			history.push('/')
		  }
		  if(eventKicked){
			User.removeKickedEventUser()
			Modal.open('youWereKickedModal')
			history.push('/')
		  }
		  
		  item.realStatus = parseFloat(item.realStatus)
		  item.status = parseFloat(item.status)
		  
		  const isMyEvent =
			access &&
			!eventBanned &&
			item.realStatus === 6 
		  const isTestEvent = access && !eventBanned && item.realStatus === 6 && item.lobby_sponsored !== 0 && (item.name_owner == this.contractName || item.name_owner == this.contractName5vs5)
		  
		  const isAvailableEvent =
			(!is5vs5 && item.realStatus < 3.5) ||
			(now < item.expires && item.realStatus < 3.5)
			&& !eventBanned
			
		  const isMyActiveEvent = access && !eventBanned && ( (item.realStatus < 6 && item.realStatus > 1) || item.name_owner == User.name ) && item.realStatus !== 6 && item.realStatus !== 4 && now < item.expires
		  const isMyActiveEventSponsored = item.realStatus < 6 && item.realStatus !== 4 && item.name_owner == User.name && !eventBanned && now < item.expires
		  const activeAccessableEvent = access && item.realStatus < 6 && item.realStatus !== 4 && !eventBanned && now < item.expires
		  
		  let payable = parseInt(item.payable)
		  
		  if(isMyActiveEvent && payable === 0 && item.name_owner == User.name && item.owner.split(',')[0] == User.name && item.player1.split(',')[0] == User.name){
			if(!localStorage.getItem('paymantevent-' + item.key)){
				localStorage.setItem('paymantevent-' + item.key, 'starts')
				doApplicationShifr(parseFloat(item.key), item.mode).then(result => {
				  if(result.data.success == 'true'){
					  item.payable = 1
					  localStorage.removeItem('paymantevent-' + item.key)
				  }
			  })
			}
		  }
		  
		  if(isMyActiveEvent || isMyActiveEventSponsored || activeAccessableEvent || isAvailableEvent){
			  getAvaEvent(item.mode, parseInt(item.key)).then(customAva => {
				if(customAva && customAva.data && customAva.data.success == 'true'){
					customEventAvatar = customAva.data.data[0].eventAva
					customEventBackground = customAva.data.data[0].backgroundAva
					isTest = customAva.data.data[0].isTest
					
					item.customAva = customEventAvatar
					item.customBackground = customEventBackground
				} else {
					customEventAvatar = ''
					customEventBackground = ''
					isTest = ''
					
					item.customAva = customEventAvatar
					item.customBackground = customEventBackground
				}
			})
		  }
		  
		  const userInfo = await User.getUserInfo(item.name_owner, User.wallet)
		  const eventsGrain = {
			  ...item,
			  username: userInfo ? userInfo.username : '',
			  avatarUrl: userInfo ? userInfo.avatarUrl : '',
			  profileUrl: userInfo ? userInfo.profileUrl : '',
			  wallet: userInfo ? userInfo.wallet : ''
		  }
		  allEventsResult.push(eventsGrain)
		  
		  if(isMyActiveEvent || isMyActiveEventSponsored || activeAccessableEvent){
			
			const localResult = {
			  ...item,
			  username: userInfo ? userInfo.username : '',
			  avatarUrl: userInfo ? userInfo.avatarUrl : '',
			  profileUrl: userInfo ? userInfo.profileUrl : '',
			  wallet: userInfo ? userInfo.wallet : ''
			}
			
			myActiveEventsResult.push(localResult)
		  }
		  
		  if(isTestEvent){
			  testFinishedResult.push(item)
		  }
		  if (isMyEvent) {
			this.totalEvents = 0
			this.wonEvents = 0
			this.sponsorEvents = 0
			
			
			const localResult = {
			  ...item,
			  username: userInfo ? userInfo.username : '',
			  avatarUrl: userInfo ? userInfo.avatarUrl : '',
			  profileUrl: userInfo ? userInfo.profileUrl : '',
			  wallet: userInfo ? userInfo.wallet : ''
			}
			myEventsResult.push(localResult)
			
			this.totalEvents = this.totalEvents + 1
			if(is5vs5){
				if(checkWinStatus5vs5(item, User.name)){
					this.wonEvents = this.wonEvents + 1
				}
			} else {
				if(item.steam_id_winner === User.steam.steamId){
					this.wonEvents = this.wonEvents + 1
				}
			}
			
			if(item.lobby_sponsored !== 0 && item.lobby_sponsored !== '0' && item.lobby_sponsored !== false){
				this.sponsorEvents = this.sponsorEvents + 1
			}
			
		  } else if (isAvailableEvent) {
			  
			const localResult = {
			  ...item,
			  username: userInfo ? userInfo.username : '',
			  avatarUrl: userInfo ? userInfo.avatarUrl : '',
			  profileUrl: userInfo ? userInfo.profileUrl : '',
			  wallet: userInfo ? userInfo.wallet : ''
			}
			eventsResult.push(localResult)
		  }
		}
	}
    this.myEvents = myEventsResult
	this.myActiveEvents = myActiveEventsResult
	this.testFinished = testFinishedResult
    this.allEventsSnapshot = this.allEvents
    this.events = eventsResult
	this.allEvents = allEventsResult
	
    console.log('events', eventsResult)
    console.log('myEvents', myEventsResult)	

	return {
		myEvents: myEventsResult,
		myActiveEvents: myActiveEventsResult,
		testFinished: testFinishedResult,
		events: eventsResult,
		allEvents: allEventsResult,
	}
  }
  
  @action checkEvents() {
    this.allEvents.map(event => {
      const snapshot = this.allEventsSnapshot.find(
        item => item.key === event.key
      )
      const name_owner = event.name_owner
      const name_accept = event.name_accept
      const status = event.status
      const is5vs5 = event.mode === '5 vs 5'
	  
	  let isSnapshotPlayerHasAccess = false
	  
	  if(snapshot && snapshot.player1 && snapshot.player2){
		if(snapshot.player1.split(',')[0] == User.name){
			isSnapshotPlayerHasAccess = true
		}
		if(snapshot.player2.split(',')[0] == User.name){
			isSnapshotPlayerHasAccess = true
		}
	  }
		
	  
      if (!is5vs5 && snapshot && event.status !== snapshot.status) {

		let findPlayer1Check = ''
		let findPlayer2Check = ''
		
		if(event.player1){
			findPlayer1Check = event.player1.split(',')[0]
		}
		if(event.player2){
			findPlayer2Check = event.player2.split(',')[0]
		}
		
        //результаты answer овнера. Выводятся для accepter
        if (snapshot.status === 1 && User.name !== event.name_owner && isSnapshotPlayerHasAccess) {
			console.log('accepter')
          if (status === 0) {
            Modal.open('rejectAccept')
          } else if (status === 2) {
            Modal.open('answerAccept', event)
          }
          //результаты сыгранной игры. Выводится кога статус переключился с 2 на 3.
        } else if (
          (User.name == findPlayer1Check || User.name == findPlayer2Check) &&
          snapshot.status === 2 &&
          status === 3
        ) {
		  if(!this.visitedEvent){
			//history.push(`/event/${event.key}`)
			//this.visitedEvent = true
		  }
        }
      }

      if (
        !is5vs5 &&
		snapshot &&
        status === 1 &&
		snapshot.player2.length < 2 &&
		snapshot.status === 0 &&
        User.name === name_owner &&
		!event.lobby_sponsored &&
        !Modal.visible.opponentFound
      ) {
		  
		//snapshot.status === 0 &&
			Modal.open('opponentFound', event)
      }	 	  
	  if(!is5vs5 &&
        status === 1 &&
		snapshot &&
		snapshot.player2.length > 1 &&
        User.name === name_owner &&
		!event.lobby_sponsored &&
		(event.player2 == '' || event.player2 == ' ')
	  ) {
			Modal.close('opponentFound')
			Modal.open('opponentSelfLeaved')
		}
    })
	
	this.allEvents.map(event => {
		const is5vs5 = event.mode === '5 vs 5'
		let isPlayerHasAccess = false
		let eventIsReady = false
		const snapshot = this.allEventsSnapshot.find(
          item => item.key === event.key
        )
		
		if(is5vs5){
			if(checkAccess(event, User.name)){
				isPlayerHasAccess = true
			}
		} else {
			if(event.player1 && event.player2){
				if(event.player1.split(',')[0] == User.name){
					isPlayerHasAccess = true
				}
				if(event.player2.split(',')[0] == User.name){
					isPlayerHasAccess = true
				}
			}
		}
		
		if(is5vs5){
			if(event.player1_ready && event.player2_ready && event.player3_ready && event.player4_ready && event.player5_ready && event.player8_ready && event.player7_ready && event.player8_ready && event.player9_ready && event.player10_ready){
				eventIsReady = true
			}
		} else {
			if(event.player1_ready && event.player2_ready){
				eventIsReady = true
			}
		}
		
		if(eventIsReady && event.realStatus == 3 && event.realStatus !== 3.5 && event.realStatus !== 4 && event.realStatus !== 5 && event.realStatus !== 6 && isPlayerHasAccess){
			if(!Modal.visible.invitesWasSended){
				if(snapshot.status !== 3.5 && isPlayerHasAccess && !this.showModalInvites){
					Modal.open('invitesWasSended');
					this.showModalInvites = true;
				}
				this.sendInvtites(parseInt(event.key), is5vs5 ? 5 : 1)
			}
		}
		
		if(event.realStatus === 2 && !is5vs5){
			if(event.player2){
				console.log('start lobby creation...')
				this.createLobby(event, event.key);
			}
		}
		if(event.lobby_sponsored && event.realStatus === 0 && is5vs5){
			let isLast = false
			if(event.direTeam.length == 5 && event.radiantTeam.length == 5){
				if(event.direTeam[4]){
					if(event.direTeam[4].name == User.name){
						isLast = true
					}
				}
				if(event.radiantTeam[4]){
					if(event.radiantTeam[4].name == User.name){
						isLast = true
					}
				}
				if(isLast){
					this.createLobby5vs5Auto(event, event.key)
				}
			}
		}
		if( (event.realStatus === 2 || event.realStatus === 3) && isPlayerHasAccess){
			if(!this.visitedEvent){
				history.push(`/event/${event.key}`)
				this.visitedEvent = true
			}
		}
		
		
		
			let eventPlayersArr = []
			if(is5vs5){
				if(!event.player1_ready && event.player1 !== "" && event.player1 !== " "){
					eventPlayersArr.push(event.player1.split(',')[0])
				}
				if(!event.player2_ready && event.player2 !== "" && event.player2 !== " "){
					eventPlayersArr.push(event.player2.split(',')[0])
				}
				if(!event.player3_ready && event.player3 !== "" && event.player3 !== " "){
					eventPlayersArr.push(event.player3.split(',')[0])
				}
				if(!event.player4_ready && event.player4 !== "" && event.player4 !== " "){
					eventPlayersArr.push(event.player4.split(',')[0])
				}
				if(!event.player5_ready && event.player5 !== "" && event.player5 !== " "){
					eventPlayersArr.push(event.player5.split(',')[0])
				}
				if(!event.player6_ready && event.player6 !== "" && event.player6 !== " "){
					eventPlayersArr.push(event.player6.split(',')[0])
				}
				if(!event.player7_ready && event.player7 !== "" && event.player7 !== " "){
					eventPlayersArr.push(event.player7.split(',')[0])
				}
				if(!event.player8_ready && event.player8 !== "" && event.player8 !== " "){
					eventPlayersArr.push(event.player8.split(',')[0])
				}
				if(!event.player9_ready && event.player9 !== "" && event.player9 !== " "){
					eventPlayersArr.push(event.player9.split(',')[0])
				}
				if(event.lobby_sponsored !== 0 && event.lobby_sponsored == '0'){
					if(!event.player10_ready && event.player10 !== "" && event.player10 !== " "){
						eventPlayersArr.push(event.player10.split(',')[0])
					}
				} else {
					if(!event.player10_ready){
						eventPlayersArr.push(event.name_owner)
					}
				}
			} else {
				if(!event.player1_ready && event.player1 !== "" && event.player1 !== " "){
					eventPlayersArr.push(event.player1.split(',')[0])
				}
				if(!event.player2_ready && event.player2 !== "" && event.player2 !== " "){
					eventPlayersArr.push(event.player2.split(',')[0])
				}
			}
		
		
		
		const now = User.time;
		
		if(event.realStatus !== 4 && event.realStatus == 3 && event.lobby_created !== 0 && event.lobby_created !== '0' && now >= event.lobby_created + 304){
			
			
			eventPlayersArr.map(eventPlayer => {
				(async () => {
					 try {
						const apiTempoReady = await tempoReady('get', eventPlayer, 'wombatAccount', event.key)
						console.log('apiTempoReady', apiTempoReady)
						if(apiTempoReady && apiTempoReady.data && apiTempoReady.data.success == 'true'){
							if(apiTempoReady.data.data && apiTempoReady.data.data[0] && apiTempoReady.data.data[0].readyEvent){
								if(parseInt(apiTempoReady.data.data[0].readyEvent) !== parseInt(event.key)){
									let doCancel = false
									console.log('Times dawn')
									let player1 = '',player2 = '',player3 = '',player4 = '',player5 = '',player6 = '',player7 = '',player8 = '',player9 = '',player10 = ''
									let playersArr = []
									if(is5vs5){
										player1 = event.player1_ready ? event.player1 : ''
										player2 = event.player2_ready ? event.player2 : ''
										player3 = event.player3_ready ? event.player3 : ''
										player4 = event.player4_ready ? event.player4 : ''
										player5 = event.player5_ready ? event.player5 : ''
										player6 = event.player6_ready ? event.player6 : ''
										player7 = event.player7_ready ? event.player7 : ''
										player8 = event.player8_ready ? event.player8 : ''
										player9 = event.player9_ready ? event.player9 : ''
										player10 = event.player10_ready ? event.player10 : ''
										
										if(!event.player1_ready && event.player1 !== "" && event.player1 !== " "){
											playersArr.push(event.player1.split(',')[0])
										}
										if(!event.player2_ready && event.player2 !== "" && event.player2 !== " "){
											playersArr.push(event.player2.split(',')[0])
										}
										if(!event.player3_ready && event.player3 !== "" && event.player3 !== " "){
											playersArr.push(event.player3.split(',')[0])
										}
										if(!event.player4_ready && event.player4 !== "" && event.player4 !== " "){
											playersArr.push(event.player4.split(',')[0])
										}
										if(!event.player5_ready && event.player5 !== "" && event.player5 !== " "){
											playersArr.push(event.player5.split(',')[0])
										}
										if(!event.player6_ready && event.player6 !== "" && event.player6 !== " "){
											playersArr.push(event.player6.split(',')[0])
										}
										if(!event.player7_ready && event.player7 !== "" && event.player7 !== " "){
											playersArr.push(event.player7.split(',')[0])
										}
										if(!event.player8_ready && event.player8 !== "" && event.player8 !== " "){
											playersArr.push(event.player8.split(',')[0])
										}
										if(!event.player9_ready && event.player9 !== "" && event.player9 !== " "){
											playersArr.push(event.player9.split(',')[0])
										}
										if(event.lobby_sponsored !== 0 && event.lobby_sponsored == '0'){
											if(!event.player10_ready && event.player10 !== "" && event.player10 !== " "){
												playersArr.push(event.player10.split(',')[0])
											}
										} else {
											if(!event.player10_ready){
												playersArr.push(event.name_owner)
											}
										}
										
										if(!event.player10_ready && (event.lobby_sponsored == 0 || event.lobby_sponsored == '0' || !event.lobby_sponsored)){
											doCancel = true
										}
										
										if(doCancel) {
											(async () => {
												try {
													const restoreReady = await tempoReady('post', User.name, 'wombatAccount', 0)
													const apiLobbyDestroyCheck = await apiLobbyDestroy(event.microsevice)
													const forcedCancelEventCheck = await forcedCancelEvent(5,parseInt(event.key))
													if(forcedCancelEventCheck && forcedCancelEventCheck.data && forcedCancelEventCheck.data.success == 'true'){
														console.log('timerKickedPlayersList', playersArr)
													}
													
												} catch (e) {
													console.log(e)
												}
											})();

										} else {
										
											(async () => {
												try {
													await updateLobbyExpires(parseInt(event.key),5)
													const preCheckEventsCheck = await preCheckEvents(5,parseInt(event.key), player1, player2, player3, player4, player5, player6, player7, player8, player9, player10)
													
													if(preCheckEventsCheck && preCheckEventsCheck.data && preCheckEventsCheck.data.success == 'true'){
														await sendReady(parseInt(event.key), 5, 1, false)
														await sendReady(parseInt(event.key), 5, 2, false)
														await sendReady(parseInt(event.key), 5, 3, false)
														await sendReady(parseInt(event.key), 5, 4, false)
														await sendReady(parseInt(event.key), 5, 5, false)
														await sendReady(parseInt(event.key), 5, 6, false)
														await sendReady(parseInt(event.key), 5, 7, false)
														await sendReady(parseInt(event.key), 5, 8, false)
														await sendReady(parseInt(event.key), 5, 9, false)
														await sendReady(parseInt(event.key), 5, 10, false)
													}
													
												} catch (e) {
													console.log(e)
												}
											})();
										
										}
									} else {
										if(event.lobby_sponsored !== 0 && event.lobby_sponsored !== '0' && event.lobby_sponsored){
											if(event.player1 && event.player1 !== "" && event.player1 !== " " && !event.player1_ready){
												player1 = event.player2
												player2 = ''
											}
											if(event.player2 && event.player2 !== "" && event.player2 !== " " && !event.player2_ready){
												player1 = event.player1
												player2 = ''
											}
										} else {
											if(event.player1 && event.player1 !== "" && event.player1 !== " " && !event.player1_ready){
												player1 = event.player2
												player2 = ''
											}
											if(event.player2 && event.player2 !== "" && event.player2 !== " " && !event.player2_ready){
												player1 = event.player1
												player2 = ''
											}
										}
										
										if(event.player1 && event.player1 !== "" && event.player1 !== " " && !event.player1_ready && (event.lobby_sponsored == 0 || event.lobby_sponsored == '0' || !event.lobby_sponsored)){
											doCancel = true
										}
										
										if(!event.player1_ready && event.player1 !== "" && event.player1 !== " "){
											playersArr.push(event.player1.split(',')[0])
										}
										if(!event.player2_ready && event.player2 !== "" && event.player2 !== " "){
											playersArr.push(event.player2.split(',')[0])
										}
										
										if(doCancel){
											
											(async () => {
												try {
													const apiLobbyDestroyCheck = await apiLobbyDestroy(event.microsevice)
													const forcedCancelEventCheck = await forcedCancelEvent(1,parseInt(event.key))
													if(forcedCancelEventCheck && forcedCancelEventCheck.data && forcedCancelEventCheck.data.success == 'true'){
														console.log('timerKickedPlayersList', playersArr)
													}
													
												} catch (e) {
													console.log(e)
												}
											})();

										} else {
										
											(async () => {
												try {
													await updateLobbyExpires(parseInt(event.key),1)
													const preCheckEventsCheck = await preCheckEvents(1,parseInt(event.key), player1, player2)
													console.log(preCheckEventsCheck)
													if(preCheckEventsCheck && preCheckEventsCheck.data && preCheckEventsCheck.data.success == 'true'){
														await sendReady(parseInt(event.key), 1, 1, false)
														await sendReady(parseInt(event.key), 1, 2, false)
													}
													
												} catch (e) {
													console.log(e)
												}
											})();
										
										}
									}
								}
							}
							if(apiTempoReady.data.data && apiTempoReady.data.data && apiTempoReady.data.data.readyEvent){
								if(parseInt(apiTempoReady.data.data.readyEvent) !== parseInt(event.key)){
									let doCancel = false
									console.log('Times dawn')
									let player1 = '',player2 = '',player3 = '',player4 = '',player5 = '',player6 = '',player7 = '',player8 = '',player9 = '',player10 = ''
									let playersArr = []
									if(is5vs5){
										player1 = event.player1_ready ? event.player1 : ''
										player2 = event.player2_ready ? event.player2 : ''
										player3 = event.player3_ready ? event.player3 : ''
										player4 = event.player4_ready ? event.player4 : ''
										player5 = event.player5_ready ? event.player5 : ''
										player6 = event.player6_ready ? event.player6 : ''
										player7 = event.player7_ready ? event.player7 : ''
										player8 = event.player8_ready ? event.player8 : ''
										player9 = event.player9_ready ? event.player9 : ''
										player10 = event.player10_ready ? event.player10 : ''
										
										if(!event.player1_ready && event.player1 !== "" && event.player1 !== " "){
											playersArr.push(event.player1.split(',')[0])
										}
										if(!event.player2_ready && event.player2 !== "" && event.player2 !== " "){
											playersArr.push(event.player2.split(',')[0])
										}
										if(!event.player3_ready && event.player3 !== "" && event.player3 !== " "){
											playersArr.push(event.player3.split(',')[0])
										}
										if(!event.player4_ready && event.player4 !== "" && event.player4 !== " "){
											playersArr.push(event.player4.split(',')[0])
										}
										if(!event.player5_ready && event.player5 !== "" && event.player5 !== " "){
											playersArr.push(event.player5.split(',')[0])
										}
										if(!event.player6_ready && event.player6 !== "" && event.player6 !== " "){
											playersArr.push(event.player6.split(',')[0])
										}
										if(!event.player7_ready && event.player7 !== "" && event.player7 !== " "){
											playersArr.push(event.player7.split(',')[0])
										}
										if(!event.player8_ready && event.player8 !== "" && event.player8 !== " "){
											playersArr.push(event.player8.split(',')[0])
										}
										if(!event.player9_ready && event.player9 !== "" && event.player9 !== " "){
											playersArr.push(event.player9.split(',')[0])
										}
										if(event.lobby_sponsored !== 0 && event.lobby_sponsored == '0'){
											if(!event.player10_ready && event.player10 !== "" && event.player10 !== " "){
												playersArr.push(event.player10.split(',')[0])
											}
										} else {
											if(!event.player10_ready){
												playersArr.push(event.name_owner)
											}
										}
										
										if(!event.player10_ready && (event.lobby_sponsored == 0 || event.lobby_sponsored == '0' || !event.lobby_sponsored)){
											doCancel = true
										}
										
										if(doCancel) {
											(async () => {
												try {
													const apiLobbyDestroyCheck = await apiLobbyDestroy(event.microsevice)
													const forcedCancelEventCheck = await forcedCancelEvent(5,parseInt(event.key))
													if(forcedCancelEventCheck && forcedCancelEventCheck.data && forcedCancelEventCheck.data.success == 'true'){
														console.log('timerKickedPlayersList', playersArr)
													}
													
												} catch (e) {
													console.log(e)
												}
											})();

										} else {
										
											(async () => {
												try {
													await updateLobbyExpires(parseInt(event.key),5)
													const preCheckEventsCheck = await preCheckEvents(5,parseInt(event.key), player1, player2, player3, player4, player5, player6, player7, player8, player9, player10)
													
													if(preCheckEventsCheck && preCheckEventsCheck.data && preCheckEventsCheck.data.success == 'true'){
														await sendReady(parseInt(event.key), 5, 1, false)
														await sendReady(parseInt(event.key), 5, 2, false)
														await sendReady(parseInt(event.key), 5, 3, false)
														await sendReady(parseInt(event.key), 5, 4, false)
														await sendReady(parseInt(event.key), 5, 5, false)
														await sendReady(parseInt(event.key), 5, 6, false)
														await sendReady(parseInt(event.key), 5, 7, false)
														await sendReady(parseInt(event.key), 5, 8, false)
														await sendReady(parseInt(event.key), 5, 9, false)
														await sendReady(parseInt(event.key), 5, 10, false)
													}
													
												} catch (e) {
													console.log(e)
												}
											})();
										
										}
									} else {
										if(event.lobby_sponsored !== 0 && event.lobby_sponsored !== '0' && event.lobby_sponsored){
											if(event.player1 && event.player1 !== "" && event.player1 !== " " && !event.player1_ready){
												player1 = event.player2
												player2 = ''
											}
											if(event.player2 && event.player2 !== "" && event.player2 !== " " && !event.player2_ready){
												player1 = event.player1
												player2 = ''
											}
										} else {
											if(event.player1 && event.player1 !== "" && event.player1 !== " " && !event.player1_ready){
												player1 = event.player2
												player2 = ''
											}
											if(event.player2 && event.player2 !== "" && event.player2 !== " " && !event.player2_ready){
												player1 = event.player1
												player2 = ''
											}
										}
										
										if(event.player1 && event.player1 !== "" && event.player1 !== " " && !event.player1_ready && (event.lobby_sponsored == 0 || event.lobby_sponsored == '0' || !event.lobby_sponsored)){
											doCancel = true
										}
										
										if(!event.player1_ready && event.player1 !== "" && event.player1 !== " "){
											playersArr.push(event.player1.split(',')[0])
										}
										if(!event.player2_ready && event.player2 !== "" && event.player2 !== " "){
											playersArr.push(event.player2.split(',')[0])
										}
										
										if(doCancel){
											
											(async () => {
												try {
													const apiLobbyDestroyCheck = await apiLobbyDestroy(event.microsevice)
													const forcedCancelEventCheck = await forcedCancelEvent(1,parseInt(event.key))
													if(forcedCancelEventCheck && forcedCancelEventCheck.data && forcedCancelEventCheck.data.success == 'true'){
														console.log('timerKickedPlayersList', playersArr)
													}
													
												} catch (e) {
													console.log(e)
												}
											})();

										} else {
										
											(async () => {
												try {
													await updateLobbyExpires(parseInt(event.key),1)
													const preCheckEventsCheck = await preCheckEvents(1,parseInt(event.key), player1, player2)
													console.log(preCheckEventsCheck)
													if(preCheckEventsCheck && preCheckEventsCheck.data && preCheckEventsCheck.data.success == 'true'){
														await sendReady(parseInt(event.key), 1, 1, false)
														await sendReady(parseInt(event.key), 1, 2, false)
													}
													
												} catch (e) {
													console.log(e)
												}
											})();
										
										}
									}
								}
							}
						} else {
							let doCancel = false
							console.log('Times dawn')
							let player1 = '',player2 = '',player3 = '',player4 = '',player5 = '',player6 = '',player7 = '',player8 = '',player9 = '',player10 = ''
							let playersArr = []
							if(is5vs5){
								player1 = event.player1_ready ? event.player1 : ''
								player2 = event.player2_ready ? event.player2 : ''
								player3 = event.player3_ready ? event.player3 : ''
								player4 = event.player4_ready ? event.player4 : ''
								player5 = event.player5_ready ? event.player5 : ''
								player6 = event.player6_ready ? event.player6 : ''
								player7 = event.player7_ready ? event.player7 : ''
								player8 = event.player8_ready ? event.player8 : ''
								player9 = event.player9_ready ? event.player9 : ''
								player10 = event.player10_ready ? event.player10 : ''
								
								if(!event.player1_ready && event.player1 !== "" && event.player1 !== " "){
									playersArr.push(event.player1.split(',')[0])
								}
								if(!event.player2_ready && event.player2 !== "" && event.player2 !== " "){
									playersArr.push(event.player2.split(',')[0])
								}
								if(!event.player3_ready && event.player3 !== "" && event.player3 !== " "){
									playersArr.push(event.player3.split(',')[0])
								}
								if(!event.player4_ready && event.player4 !== "" && event.player4 !== " "){
									playersArr.push(event.player4.split(',')[0])
								}
								if(!event.player5_ready && event.player5 !== "" && event.player5 !== " "){
									playersArr.push(event.player5.split(',')[0])
								}
								if(!event.player6_ready && event.player6 !== "" && event.player6 !== " "){
									playersArr.push(event.player6.split(',')[0])
								}
								if(!event.player7_ready && event.player7 !== "" && event.player7 !== " "){
									playersArr.push(event.player7.split(',')[0])
								}
								if(!event.player8_ready && event.player8 !== "" && event.player8 !== " "){
									playersArr.push(event.player8.split(',')[0])
								}
								if(!event.player9_ready && event.player9 !== "" && event.player9 !== " "){
									playersArr.push(event.player9.split(',')[0])
								}
								if(event.lobby_sponsored !== 0 && event.lobby_sponsored == '0'){
									if(!event.player10_ready && event.player10 !== "" && event.player10 !== " "){
										playersArr.push(event.player10.split(',')[0])
									}
								} else {
									if(!event.player10_ready){
										playersArr.push(event.name_owner)
									}
								}
								
								if(!event.player10_ready && (event.lobby_sponsored == 0 || event.lobby_sponsored == '0' || !event.lobby_sponsored)){
									doCancel = true
								}
								
								if(doCancel) {
									(async () => {
										try {
											const apiLobbyDestroyCheck = await apiLobbyDestroy(event.microsevice)
											const forcedCancelEventCheck = await forcedCancelEvent(5,parseInt(event.key))
											if(forcedCancelEventCheck && forcedCancelEventCheck.data && forcedCancelEventCheck.data.success == 'true'){
												console.log('timerKickedPlayersList', playersArr)
											}
											
										} catch (e) {
											console.log(e)
										}
									})();

								} else {
								
									(async () => {
										try {
											await updateLobbyExpires(parseInt(event.key),5)
											const preCheckEventsCheck = await preCheckEvents(5,parseInt(event.key), player1, player2, player3, player4, player5, player6, player7, player8, player9, player10)
											
											if(preCheckEventsCheck && preCheckEventsCheck.data && preCheckEventsCheck.data.success == 'true'){
												await sendReady(parseInt(event.key), 5, 1, false)
												await sendReady(parseInt(event.key), 5, 2, false)
												await sendReady(parseInt(event.key), 5, 3, false)
												await sendReady(parseInt(event.key), 5, 4, false)
												await sendReady(parseInt(event.key), 5, 5, false)
												await sendReady(parseInt(event.key), 5, 6, false)
												await sendReady(parseInt(event.key), 5, 7, false)
												await sendReady(parseInt(event.key), 5, 8, false)
												await sendReady(parseInt(event.key), 5, 9, false)
												await sendReady(parseInt(event.key), 5, 10, false)
											}
											
										} catch (e) {
											console.log(e)
										}
									})();
								
								}
							} else {
								if(event.lobby_sponsored !== 0 && event.lobby_sponsored !== '0' && event.lobby_sponsored){
									if(event.player1 && event.player1 !== "" && event.player1 !== " " && !event.player1_ready){
										player1 = event.player2
										player2 = ''
									}
									if(event.player2 && event.player2 !== "" && event.player2 !== " " && !event.player2_ready){
										player1 = event.player1
										player2 = ''
									}
								} else {
									if(event.player1 && event.player1 !== "" && event.player1 !== " " && !event.player1_ready){
										player1 = event.player2
										player2 = ''
									}
									if(event.player2 && event.player2 !== "" && event.player2 !== " " && !event.player2_ready){
										player1 = event.player1
										player2 = ''
									}
								}
								
								if(event.player1 && event.player1 !== "" && event.player1 !== " " && !event.player1_ready && (event.lobby_sponsored == 0 || event.lobby_sponsored == '0' || !event.lobby_sponsored)){
									doCancel = true
								}
								
								if(!event.player1_ready && event.player1 !== "" && event.player1 !== " "){
									playersArr.push(event.player1.split(',')[0])
								}
								if(!event.player2_ready && event.player2 !== "" && event.player2 !== " "){
									playersArr.push(event.player2.split(',')[0])
								}
								
								if(doCancel){
									
									(async () => {
										try {
											const apiLobbyDestroyCheck = await apiLobbyDestroy(event.microsevice)
											const forcedCancelEventCheck = await forcedCancelEvent(1,parseInt(event.key))
											if(forcedCancelEventCheck && forcedCancelEventCheck.data && forcedCancelEventCheck.data.success == 'true'){
												console.log('timerKickedPlayersList', playersArr)
											}
											
										} catch (e) {
											console.log(e)
										}
									})();

								} else {
								
									(async () => {
										try {
											await updateLobbyExpires(parseInt(event.key),1)
											const preCheckEventsCheck = await preCheckEvents(1,parseInt(event.key), player1, player2)
											console.log(preCheckEventsCheck)
											if(preCheckEventsCheck && preCheckEventsCheck.data && preCheckEventsCheck.data.success == 'true'){
												await sendReady(parseInt(event.key), 1, 1, false)
												await sendReady(parseInt(event.key), 1, 2, false)
											}
											
										} catch (e) {
											console.log(e)
										}
									})();
								
								}
							}
						}
								
					} catch (e) {
						console.log(e)
					}
				
				})();
			});
		}
	})
	
	if(this.myActiveEvents.length == 0){
		this.visitedEvent = false
		this.showModalInvites = false
	}
	
  }

  @action async createEvent({ discipline, mode, server, rateFrom, rateTo, eventName, isPrivate, password, isSponsorship, rate}) {
	let memo

	let oneIsPrivate = password ? password : 0
	
	let oneIsSponsorship = Number(isSponsorship)
		
		if(oneIsSponsorship){
			let renderedRate = rate * 10000
			
			
			let renderedRateFrom = rateFrom * 10000
			let renderedRateTo = rateTo * 10000
			if (Currency.curr === 'USD') {
			  renderedRateFrom /= Currency.exchangeRate
			  renderedRateTo /= Currency.exchangeRate
			  renderedRateFrom = parseFloat(renderedRateFrom.toFixed(0))
			  renderedRateTo = parseFloat(renderedRateTo.toFixed(0))
			}
			
			memo =
			  discipline +
			  ',' +
			  mode +
			  ',' +
			  server +
			  ',' +
			  renderedRateFrom +
			  ',' +
			  renderedRateTo +
			  ',' +
			  User.steam.steamId +
			  ',-1' +
			  ',' +
			  eventName + 
			  ',' +
			  oneIsSponsorship + 
			  ',' + 
			  oneIsPrivate + 
			  ',' +
			  renderedRate + 
			  ',' +
			  Currency.commission
			  
			const val = `${(renderedRate / 10000).toFixed(4)} ${User.symbol}`
			
			const trx = await eos.transfer(User.name, this.contractName, val, memo)
			Modal.close('createEvent')
			if (trx.broadcast || trxLynx) {
				User.checkParticipation()
				Modal.open('createEventSponsModal')
				createEventApi(User.name, this.contractName, val, memo);
			} else {
				User.checkParticipation()
				Modal.open('createEventError')
			}
		} else {
		
			let renderedRate = rate * 10000
			
			
			let renderedRateFrom = rateFrom * 10000
			let renderedRateTo = rateTo * 10000
			if (Currency.curr === 'USD') {
			  renderedRateFrom /= Currency.exchangeRate
			  renderedRateTo /= Currency.exchangeRate
			  renderedRateFrom = parseFloat(renderedRateFrom.toFixed(0))
			  renderedRateTo = parseFloat(renderedRateTo.toFixed(0))
			}
			
			memo =
			  discipline +
			  ',' +
			  mode +
			  ',' +
			  server +
			  ',' +
			  renderedRateFrom +
			  ',' +
			  renderedRateTo +
			  ',' +
			  User.steam.steamId +
			  ',-1' +
			  ',' +
			  eventName + 
			  ',' +
			  oneIsSponsorship + 
			  ',' + 
			  oneIsPrivate + 
			  ',' +
			  renderedRate + 
			  ',' +
			  Currency.commission
			  
			const val = `${(renderedRateTo / 10000).toFixed(4)} ${User.symbol}`
			
			const trx = await eos.transfer(User.name, this.contractName, val, memo)
			Modal.close('createEvent')
			if (trx.broadcast || trxLynx) {
				User.checkParticipation()
				Modal.open('createEventSuccess')
				createEventApi(User.name, this.contractName, val, memo);
			} else {
				User.checkParticipation()
				Modal.open('createEventError')
			}
		}
	history.push('/')
  }

  @action async createEvent5vs5({
	discipline,
    mode,
    server,
    rate,
	eventName,
    isPrivate,
    password,
    isSponsorship,
    side
  }) {
	let memo
		let renderedRate = rate * 10000

		if (Currency.curr === 'USD') {
		  renderedRate /= Currency.exchangeRate
		  renderedRate = parseFloat(renderedRate.toFixed(0))
		}
    
		memo = `${discipline},${mode},${server},${
		  isPrivate ? password : 0
		},${renderedRate},${User.steam.steamId},${Number(isSponsorship)},-1,${side},${eventName},${Currency.commission}`
		const val = `${(renderedRate / 10000).toFixed(4)} ${User.symbol}`
		const trx = await eos.transfer(User.name, this.contractName5vs5, val, memo)
		Modal.close('createEvent')
		if (trx.broadcast) {
		  if(isSponsorship){
			 User.checkParticipation()
			 createEventApi(User.name, this.contractName5vs5, val, memo);
			 Modal.open('createEventSponsModal')
		  } else {
			User.checkParticipation()
			Modal.open('createEventSuccess')
		  }
		} else {
		  User.checkParticipation()
		  Modal.open('createEventError')
		}
	history.push('/')
  }

  @action async participate5vs5(event, password, side) {
    if (User.steam.username === event.name_owner && (event.lobby_sponsored === 0 || event.lobby_sponsored === '0') ) {
      alert('Steam account must be different')
      return false
    }
    const renderedPassword = event.lobby_private === '0' ? '0' : password
    const rate = event.price_owner * 10000
    const steamId = User.steam.steamId
    const key = parseInt(event.key)
    
	let rateLynx = 0
	
	console.log(event)
	
    if (!event.lobby_sponsored) {
	  
		  const memo = `${event.discipline},5 vs 5,${event.serverId},${renderedPassword},${rate},${steamId},0,${key},${side},${Currency.commission}`

		  const val = `${event.price_owner.toFixed(4)} ${User.symbol}`
		  try {
			const trx = await eos.transfer(User.name, this.contractName5vs5, val, memo)
			Modal.close('participate5vs5')
			if (trx.broadcast) {
			  await participationApi(User.name, this.contractName5vs5, val, memo)
			  User.checkParticipation()
			  history.push(`/event/${event.key}`)
			} else {
			  User.checkParticipation()
			  Modal.open('error')
			}
		  } catch (json) {
			User.checkParticipation()
			if(json){
				console.log(json)
			}
			Modal.close('participate5vs5')
		  }
    } else { //sponsored
      const contract = await eos.contract(this.contractName5vs5, {
        requiredFields: {}
      })
		  try {
			const res = await contract.parsponsored(
			  {
				event_id: key,
				user: User.name,
				password: renderedPassword,
				steam_id: steamId,
				side: side,
				user_commission: Currency.commission
			  },
			  {
				scope: this.contractName5vs5,
				authorization: [User.name]
			  }
			)
			
			Modal.close('participate5vs5')
			if (res.broadcast) {
			  User.checkParticipation()
			  history.push(`/event/${event.key}`)
			} else {
			  User.checkParticipation()
			  Modal.open('error')
			}
		  } catch (json) {
			User.checkParticipation()
			if(json){
				console.log(json)
			}
			Modal.close('participate5vs5')
		  }
    }
  }
  
  @action async participate(event, bet, password) {
    if (User.steam.steamId === event.steam_id_owner && (event.lobby_sponsored === 0 || event.lobby_sponsored === '0') ) {
      alert('Steam account must be different')
      return false
    }
	
	let memo = ""
	let val = bet
	
	let renderedPassword = event.lobby_private === '0' ? '0' : password

	if (!event.lobby_sponsored) {
		let lastPlayer = false
	
		if(event.player1 && event.player1 !== "" && event.player1 !== " "){
			lastPlayer = true
		}
		
		memo =
		  event.discipline +
		  ',' +
		  event.mode +
		  ',' +
		  event.serverId +
		  ',' +
		  event.rate_from +
		  ',' +
		  event.rate_to +
		  ',' +
		  User.steam.steamId +
		  ',' +
		  event.key +
		  ',' +
		  event.eventName + 
		  ',' +
		  event.lobby_sponsored + 
		  ',' + 
		  renderedPassword + 
		  ',' +
		  bet + 
		  ',' +
		  Currency.commission

		if (Currency.curr === 'USD') {
		  val /= Currency.exchangeRate
		}
		val = parseFloat(val).toFixed(8)
		
			
			const quantity = parseFloat(val).toFixed(4) + " " + User.symbol
			
			try {
			  const trx = await eos.transfer(User.name, this.contractName, quantity, memo)
			  Modal.close('accept')
			  if (trx.broadcast) {
				await participationApi(User.name, this.contractName, quantity, memo)
				User.checkParticipation()
				if(!lastPlayer){
					Modal.open('acceptTrue')
				} else {
					if(event.realStatus < 3 && event.microsevice && event.microsevice.length > 2 && event.lobby_sponsored !== 0 && event.lobby_sponsored !== '0'){
						const saveThirdState = await anyState(parseInt(event.key), 1, 3)
						const moreTime = await updateLobbyExpires(parseInt(event.key),1)
					}
				}
			  } else {
				User.checkParticipation()
				Modal.open('error')
			  }
			} catch (json) {
			  Modal.close('accept')
			  User.checkParticipation()
			  if(json){
				console.log(json)
			  }
			}
		
	} else { // if it is sponsored
		let lastPlayer = false
	
		if(event.player1 && event.player1 !== "" && event.player1 !== " "){
			lastPlayer = true
		}
	 
		memo =
		  event.discipline +
		  ',' +
		  event.mode +
		  ',' +
		  event.serverId +
		  ',' +
		  event.rate_from +
		  ',' +
		  event.rate_to +
		  ',' +
		  User.steam.steamId +
		  ',' +
		  event.key +
		  ',' +
		  Currency.commission
		
			try {
			  const contract = await eos.contract(this.contractName, { requiredFields: {} })
			  const trx = await contract.parsponsored(
				  {
					event_id: event.key,
					user: User.name,
					password: renderedPassword,
					steam_id: User.steam.steamId,
					user_commission: Currency.commission
				  },
				  {
					scope: this.contractName,
					authorization: [User.name]
				  }
			  )
			  
			  Modal.close('accept')
			  if (trx.broadcast) {
				if(!lastPlayer){
					Modal.open('acceptTrue')
				} else {
					if(event.realStatus < 3 && event.microsevice && event.microsevice.length > 2 && event.lobby_sponsored !== 0 && event.lobby_sponsored !== '0'){
						const saveThirdState = await anyState(parseInt(event.key), 1, 3)
						const moreTime = await updateLobbyExpires(parseInt(event.key),1)
					}
				}
			  } else {
				Modal.open('error')
			  }
			} catch (json) {
			  Modal.close('accept')
			  User.checkParticipation()
			  if(json){
				console.log(json)
			  }
			}
		

	}
	
  }

  @action async sendBlockchainAnswer(event, status) {
    const contract = await eos.contract(this.contractName, { requiredFields: {} })
		let curStatus = status
		if(event.microsevice && event.microsevice.length > 2){
			curStatus = 3
		}
		const res = await contract.answer(
		  {
			event_id: event.key,
			user: User.name,
			status: status
		  },
		  {
			scope: this.contractName,
			authorization: [User.name]
		  }
		)
		Modal.close('opponentFound')
		if (res.broadcast) {
		  User.checkParticipation()
		  if (status === 0) {
			Modal.open('answerFalse')
		  }
		  if (status === 2) {
			if( (event.microsevice == '' || event.microsevice == ' ') ){
				this.createLobby(event, event.key)
			}
		  }
		  if(curStatus == 3){
			  const saveThirdState = await anyState(parseInt(event.key), 1, 3)
			  const moreTime = await updateLobbyExpires(parseInt(event.key),1)
		  }
		} else {
		  User.checkParticipation()
		  Modal.open('error')
		}
  }
  
  @action async createLobby5vs5Auto(event, event_id) {
	let chWallet
	
	if(User.symbol == 'LNX'){
		chWallet = 'Lynx'
	} else if(User.symbol == 'TLOS'){
		chWallet = 'Telos'
	} else {
		chWallet = 'Eos'
	}
	
	let evId = parseInt(event_id)
	
	//const check = await(fetchUrl('preCheckEvents'))
	
    //Modal.open('lobbyCreating')
    const getServerUrl = `${mainServerUrl}/farmSwitcher?environment=${environment}&event_id=${evId}&type=5&wallet=${chWallet}`
    const serverURL = await fetchUrl(getServerUrl)

    if (serverURL.data === 'no free servers') {
      //Modal.close('lobbyCreating')
      //Modal.open('lobbyError')
    } else {
	  await sleep(5000)
		  if(event.microsevice == ''){
			  const url = `${mainServerUrl}/eventslobby?serverUrlAddress=${serverURL.data}&eventId=${evId}&type=5&wallet=${chWallet}`
			  const res = await fetchUrl(url)
			  //Modal.close('lobbyCreating')
			  history.push(`/event/${event_id}`)
		  }
	  
    }
  }

  @action async createLobby(event, event_id) {
	let chWallet
	if(User.symbol == 'LNX'){
		chWallet = 'Lynx'
	} else if(User.symbol == 'TLOS'){
		chWallet = 'Telos'
	} else {
		chWallet = 'Eos'
	}
	
    //Modal.open('lobbyCreating')
    const getServerUrl = `${mainServerUrl}/farmSwitcher?environment=${environment}&event_id=${event_id}&type=1&wallet=${chWallet}`
    const serverURL = await fetchUrl(getServerUrl)

    if (serverURL.data === 'no free servers') {
      //Modal.close('lobbyCreating')
      //Modal.open('lobbyError')
    } else {
		  if(event.microsevice == ''){
			  const url = `${mainServerUrl}/eventslobby?serverUrlAddress=${serverURL.data}&eventId=${event_id}&type=1&wallet=${chWallet}`
			  const res = await fetchUrl(url)
			  //Modal.close('lobbyCreating')
			  history.push(`/event/${event_id}`)
		  }
    }
  }
  
  @action async startGame5vs5(event) {
	let chWallet
	if(User.symbol == 'LNX'){
		chWallet = 'Lynx'
	} else if(User.symbol == 'TLOS'){
		chWallet = 'Telos'
	} else {
		chWallet = 'Eos'
	}
    if (User.name !== event.name_owner) {
      Modal.openError('Only the lobby owner can start the game')
      return false
    }
    if (event.direTeam.length !== 5 && event.radiantTeam.length !== 5) {
      Modal.openError('To start the game you need 10 players')
      return false
    }
    const event_id = parseInt(event.key)
    const contract = await eos.contract(this.contractName5vs5, {
      requiredFields: {}
    })
	
		const res = await contract.startevent(
		  {
			event_id: event_id,
			user: User.name
		  },
		  {
			scope: this.contractName5vs5,
			authorization: [User.name]
		  }
		)
		if (res.broadcast) {
			
		  const getServerUrl = `${mainServerUrl}/farmSwitcher?environment=${environment}&event_id=${event_id}&type=5&wallet=${chWallet}`

		  const serverURL = await fetchUrl(getServerUrl)
		  if (serverURL.data === 'no free servers') {
			Modal.openError('No free servers')
		  } else {
			if(event.microsevice == ''){
				const url = `${mainServerUrl}/eventslobby?serverUrlAddress=${serverURL.data}&eventId=${event_id}&type=5&wallet=${chWallet}`
				await fetchUrl(url)
			}
		  }
		} else {
		  Modal.open('error')
		}
	
  }

  @action async cancel(key) {
    const contract = await eos.contract(this.contractName, { requiredFields: {} })
	const curevent = this.getEventByKey(key)
	const microserv = (curevent.microsevice && curevent.microsevice !== "") ? curevent.microsevice : false
		const res = await cancelApi(key, User.name)
		
		if (res.data.success == "true") {
		  User.checkParticipation()
		  Modal.open('cancel')
		  if(microserv){
			  await apiLobbyDestroy(microserv)
		  }
		} else {
		  User.checkParticipation()
		  Modal.open('error')
		}
	history.push('/')
  }
  
  @action async sendInvtites(key, type){
	//Modal.open('lobbyCreating')
	const sendInvite = await inviteUsers(key, type)
	if(sendInvite && sendInvite.data && sendInvite.data.success && sendInvite.data.success == 'true'){
		if(!Modal.visible.invitesWasSended){
			
		}
	}
  }
  
  @action async sendReadyState(key, type, player, ready){
	  Modal.open('confirmingReady')
	  const sendInvite = await sendReady(key, type, player, ready)

	  if(sendInvite && sendInvite.data && sendInvite.data.success && sendInvite.data.success == 'true'){
		Modal.close('confirmingReady')
	  } else {
		  Modal.close('readyConfirmed')
		  Modal.open('confirmedFailed')
	  }
  }
  
  // todo сделать из этого функциональну/ штуку для киков и тд
  @action async cancel5vs5(key, leave = false) {
    const contract = await eos.contract(this.contractName5vs5, {
      requiredFields: {}
    })
	const curevent = this.getEventByKey(key)
	const microserv = (curevent.microsevice && curevent.microsevice !== "") ? curevent.microsevice : false
	let res, doApi, allRes
	if(leave) {
		res = await contract.leaveevent(
		  {
			event_id: parseInt(key),
			user: User.name,
			user_leave: User.name
		  },
		  {
			scope: this.contractName5vs5,
			authorization: [User.name]
		  }
		)
		doApi = false
	} else {
		const res = await cancelApi(key, User.name)
		doApi = true
	}
	if(doApi){
		allRes = res.data.success == true
	} else {
		allRes = res.broadcast
	}
	if (allRes) {
	  User.checkParticipation()
	  if(microserv){
		  await apiLobbyDestroy(microserv)
	  }
	  Modal.open('cancel')

	} else {
	  User.checkParticipation()
	  Modal.open('error')
	}
	history.push('/')
  }
  
  @action async leave1v1(key) {
	  console.log(this.contractName)
			try {
				const contract = await eos.contract(this.contractName, { requiredFields: {} })
				const trx = await contract.leave(
					{
						event_id: parseInt(key),
						user: User.name,
						user_leave: User.name
					},
					{
						scope: this.contractName,
						authorization: [User.name]
					}
				)
				
				if (trx.broadcast) {
					User.checkParticipation()
					await sendReady(parseInt(key), 1, 1, false)
					await sendReady(parseInt(key), 1, 2, false)
					await anyState(parseInt(key), 1, 0)
				} else {
					User.checkParticipation()
					Modal.open('error')
				}
				
			} catch (json) {
			  User.checkParticipation()
			}
  }
  
  @action async leave(key) {
    const contract = await eos.contract(this.contractName5vs5, {
      requiredFields: {}
    })
	if(User.wallet == 'lynxAccount'){
		let transaction = {
			actions: [{
				account: this.contractName5vs5,
				name: "leaveevent",
				authorization: [
					{
						actor: User.name,
						permission: "active",
					}
				],
				data: {
					from: this.contractName5vs5,
					receiver: User.name,
					transfer: false,
					event_id: parseInt(key),
					user: User.name,
					user_leave: User.name
				}
			}],
		}
		
		let result;
		
		try {
			result = await window.lynxMobile.transact(transaction);
			if(result){
				User.checkParticipation()
			} else {
				User.checkParticipation()
				Modal.open('error')
			}
		} catch (err) {
			User.checkParticipation()
		}
	} else {
		const res = await contract.leaveevent(
		  {
			event_id: parseInt(key),
			user: User.name,
			user_leave: User.name
		  },
		  {
			scope: this.contractName5vs5,
			authorization: [User.name]
		  }
		)
		if (res.broadcast) {
		  User.checkParticipation()
		} else {
		  User.checkParticipation()
		}
	}
  }

  @action async kick(key, user, banned = false) {
    const contract = await eos.contract(this.contractName5vs5, {
      requiredFields: {}
    })
	if(User.wallet == 'lynxAccount'){
		let transaction = {
			actions: [{
				account: this.contractName5vs5,
				name: "leaveevent",
				authorization: [
					{
						actor: User.name,
						permission: "active",
					}
				],
				data: {
					from: this.contractName5vs5,
					receiver: User.name,
					transfer: false,
					event_id: parseInt(key),
					user: User.name,
					user_leave: user
				}
			}],
		}
		
		let result;
		
		try {
			result = await window.lynxMobile.transact(transaction);
			if(!result){
				Modal.open('error')
			} else {
				Modal.open('playerWasDeletedFromEvent')
				if(banned){
					const addBan = await addBannedEvent(user, User.wallet, key)
				} else {
					const addKicked = await User.addKickedEventUser(user, key)
				}
			}
		} catch (err) {
			 Modal.open('error')
		}
	} else {
		const res = await contract.leaveevent(
		  {
			event_id: parseInt(key),
			user: User.name,
			user_leave: user
		  },
		  {
			scope: this.contractName5vs5,
			authorization: [User.name]
		  }
		)
		if (!res.broadcast) {
		  Modal.open('error')
		} else {
			Modal.open('playerWasDeletedFromEvent')
			if(banned){
				const addBan = await addBannedEvent(user, User.wallet, key)
			} else {
				const addKicked = await User.addKickedEventUser(user, key)
			}
		}
	}
  }

  @action async changeSide(key, side) {
    const contract = await eos.contract(this.contractName5vs5, {
      requiredFields: {}
    })
	if(User.wallet == 'lynxAccount'){
		let transaction = {
			actions: [{
				account: this.contractName5vs5,
				name: "changeside",
				authorization: [
					{
						actor: User.name,
						permission: "active",
					}
				],
				data: {
					from: this.contractName5vs5,
					receiver: User.name,
					transfer: false,
					event_id: parseInt(key),
					user: User.name,
					new_side: side
				}
			}],
		}
		
		let result;
		
		try {
			result = await window.lynxMobile.transact(transaction);
			if(!result){
				Modal.open('error')
			}
		} catch (err) {
			Modal.open('error')
		}
	} else {
		const res = await contract.changeside(
		  {
			event_id: parseInt(key),
			user: User.name,
			new_side: side
		  },
		  {
			scope: this.contractName5vs5,
			authorization: [User.name]
		  }
		)
		if (!res.broadcast) {
		  Modal.open('error')
		}
	}
  }
}

export default new Events()
