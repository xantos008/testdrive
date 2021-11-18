import React, { useState, useEffect } from 'react'
import { observable, action, computed } from 'mobx'
import Currency from './currency'
import Modal from './modal'
import { renderSteamInfo } from './schemas'
import Events from './events'
import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';
import Eos from 'eosjs'
import EosApi from 'eosjs-api'
import {
  getUserInfo as getUserInfoApi,
  linkSteam as linkSteamApi,
  unLinkSteam as unLinkSteamApi,
  updateUserStatsRefferals as updateStatsRefsApi,
  addReferralNameArray,
  getMonthlyLevels,
  isUserSpecial,
  getReferralsLevels,
  getRefSalary,
  addKickedEvent,
  removeKickedEvent,
  serverTime,
  transactionRefBlockNumApi,
  transactionRefBlockPrefixApi,
  fetchUrl,
  checkProgramm
} from '../services/utils'
import { checkWinStatus5vs5 } from '../utils/lib'
import { network, networkLynx, networkTelos, contractsNameList, allNets } from '../config'


ScatterJS.plugins(new ScatterEOS())

let scatter, eos, lynxWallet, eosConfig



class User {
  @observable pageTitle = document.title
  @observable name = ''
  @observable isAuthenticated = false
  @observable isGuest = false
  @observable isProgramOn = false
  @observable steam = {
    avatarUrl: '',
    username: '',
    id: '',
    referrals: 0,
	testgames: 0,
	referralsArray: [],
	referralsLevel: 0,
	referalPercent: 0,
  }
  @observable symbol = 'EOS'
  @observable wallet = 'scatterAccount'
  @observable isSteamLinked = false
  @observable isInitializated = false
  @observable registeredTime = ''
  @observable canParticipate = true
  @observable bannedEvent = []
  @observable kickedEvent = []
  @observable playedGamesInMoths = 0
  @observable referralListing = []
  @observable levelsListing = []
  @observable referallSalary = 0
  @observable userSpecial = false
  @observable time = 0
  @observable oldTime = 0

  @computed get stats() {
	
    let wonMoney = 0
    let wonMatches = 0
	let testGames = Events.testFinished.length
	let allGames = Events.myEvents.length
	let allSponsored = 0
	let testGamesWonMoney = 0
	let testGamesWonMatches = 0
	let cn = 0
	let multi = 2
	
    Events.myEvents.map(item => {
      const is5vs5 = item.mode === '5 vs 5'
	  
	  if(item.lobby_sponsored){
		  multi = 1
	  }
		if(item.lobby_sponsored !== 0 && item.lobby_sponsored !== '0' && item.lobby_sponsored !== false){
			allSponsored += 1
		}
	  
	  
      if (!is5vs5 && item.steam_id_winner === this.steam.steamId) {
		for(cn = 0; cn < contractsNameList.length; cn++){
			if(item.name_owner == contractsNameList[cn]){
				if(parseInt(item.isTest) == 1){
					testGamesWonMatches += 1
					testGamesWonMoney += (item.price_owner * multi * (100 - Currency.commission)) / 100
				}
			}
		}
		
        wonMatches += 1
        wonMoney +=
          ((item.rate_total / 10000) * multi * (100 - Currency.commission)) / 100
      } else if (
        is5vs5 &&
        item.status === 3 &&
        checkWinStatus5vs5(item, this.name)
      ) {
		for(cn = 0; cn < contractsNameList.length; cn++){
			if(item.name_owner == contractsNameList[cn]){
				testGamesWonMatches += 1
				testGamesWonMoney += (item.price_owner * multi * (100 - Currency.commission)) / 100
			}
		}
        wonMatches += 1
        wonMoney += (item.price_owner * multi * (100 - Currency.commission)) / 100
      }
    })
    return {
      wonMoney,
      wonMatches,
	  testGames,
	  testGamesWonMoney,
	  testGamesWonMatches,
	  allGames,
	  allSponsored
    }
  }
  
  @action checkParticipation(){
	Currency.getTlosFromRub(100)
	let chiko = true
	Events.allEvents.map(item => {
		const is5vs5 = item.mode === '5 vs 5'
		const now = this.time
		if(item.realStatus < 6 && item.realStatus !== 4 && now < item.expires){
			if(is5vs5){
				item.direTeam.map(parter => {
					if(parter.name === this.name){
						chiko = false
					}
				})
				item.radiantTeam.map(parter => {
					if(parter.name === this.name){
						chiko = false
					}
				})
			} else {
				if(item.player1.split(',')[0] === this.name || item.player2.split(',')[0] === this.name){
					chiko = false
				}
			}
		}
	})
	this.canParticipate = chiko
  }

  @action async getMontlyLevels(){
	const response = await getMonthlyLevels()
	this.levelsListing = response.data.data
	return response.data.data
  }
  
  @action async isUserSpecial(){
	const response = await isUserSpecial(this.name)
	if(response){
		if(response.data){
			if(response.data.data){
				this.userSpecial = response.data.data
				this.steam.referalPercent = response.data.data.refferalComission
				return response.data.data
			}
		}
	}
  }
  
  @action async getReferralsLevels(){
	const response = await getReferralsLevels()
	this.referralListing = response.data.data
	return response.data.data
  }

  @action async getsummRefSalary () {
	  const response = await getRefSalary(this.name)
		if(response){
			if(response.data){
				if(response.data.data){
					this.referallSalary = response.data.data
					return response.data.data
				}
			}
		}
  }

  @action async getSteamInfoInitial() {
    this.steam = await this.getUserInfo(this.name, this.wallet)
	if(this.steam && this.steam.username){
		this.isSteamLinked = true
		this.registeredTime = this.steam.registeredTime
		console.log('steam', this.steam)
	} else {
		this.steam = {
		  avatarUrl: '',
		  username: '',
		  id: ''
		}
		this.isSteamLinked = false
	}
  }
  
  @action async updateStatsRefs() {
	  if(this.isSteamLinked){
		await updateStatsRefsApi(this.name, this.wallet, Events.myEvents.length, this.symbol)
	  }
  }
  
  @action async addKickedEventUser(username, eventId){
	  await addKickedEvent(username, this.wallet, eventId)
  }
  
  @action async removeKickedEventUser(){
	await removeKickedEvent(this.name, this.wallet)
	await this.getUserInfo(this.name, this.wallet, true)
  }
  
  @action async linkSteam() {
    await linkSteamApi(this.name, this.wallet, this.symbol)
    const referrer = localStorage.getItem('ref')
	
	let refName = localStorage.getItem('ref')
	if (refName) {
      await addReferralNameArray(refName, this.wallet, this.name, this.symbol)
      localStorage.removeItem('ref')
	  console.log('Added refferal to array')
    }
	
    // this.steam = await this.getUserInfo(this.name)
    // this.isSteamLinked = true
  }

  @action async getUserInfo(name, wallet, updateUserAfterKick = false) {
	if(localStorage.getItem('currUser')){
		if(localStorage.getItem('currUser').length > 1){
			if(!name || name == undefined){
				name = JSON.parse(localStorage.getItem('currUser')).account.account_name
			}
		}
	}
    if (!Events.steamCollection.has(name) || updateUserAfterKick) {
      const response = await getUserInfoApi(name, wallet)
	  if(response && response.data){
		  if(response.data.data && response.data.data[this.wallet] == this.name){
			  response.data.data.wallet = this.wallet
			  if(response.data.data.bannedEvent){
				this.bannedEvent = response.data.data.bannedEvent
			  }
			  if(response.data.data.kickedEvent){
				this.kickedEvent = response.data.data.kickedEvent
			  }
		  }
	  }
	  if(response && response.data && response.data.data){
		const user = renderSteamInfo(response.data.data)
	  
		Events.steamCollection.set(name, user)
	  
		return user
	  }
    }
    return Events.steamCollection.get(name)
  }

  @action async unLinkSteam() {
    await unLinkSteamApi(this.name, this.wallet)
    this.steam = {
      avatarUrl: '',
      username: '',
      id: ''
    }
    this.isSteamLinked = false
  }
  
  @action async allLogin(chainName, chainWallet, lynxName = ''){
	this.symbol = chainName
	this.wallet = chainWallet
	Currency.curr = chainName

	const networkNet = allNets[chainWallet][chainName]["network"]
	
	if(chainWallet == 'lynxAccount'){
		localStorage.setItem('currUser', JSON.stringify(lynxName))
		lynxWallet = lynxName
		
		eos = Eos(networkNet)
		
		this.name = lynxWallet.account.account_name
		localStorage.setItem('thissymbol', this.symbol)
		localStorage.setItem('thisWallet', this.wallet)

		this.isAuthenticated = true
	} else {
		const connected = await ScatterJS.connect('Farmgame', { network: networkNet })
		
		if (!connected) {
		  throw 'scatter not found'
		}

		const login = await ScatterJS.login().catch(err => {
				console.log('err', err)
				if(err && err.message && err.message == 'The wallet is locked.'){
					this.isAuthenticated = false
					Modal.open('wombatLoginRestartModal')
				}
			})

        if(!login){
            throw 'restart wombat'
            this.isAuthenticated = false
        }
        if(login && login.error && login.error === true){
            throw 'restart wombat'
            this.isAuthenticated = false
        }
		
		scatter = ScatterJS.scatter
		
		
			if(scatter.identity.hash){
				throw 'wombat not found'
				this.isAuthenticated = false
			}
			
			if(scatter.identity.accounts[0].chainId !== networkNet.chainId){
				throw 'wombat found, but not TLOS chain'
				this.isAuthenticated = false
			}
		
		localStorage.setItem('thissymbol', this.symbol)
		localStorage.setItem('thisWallet', this.wallet)
		eos = scatter.eos(networkNet, Eos)
		this.isAuthenticated = true
	}
	
  }

  @action async login() {
	/*const networksArr = [network, networkTelos]
	const initScatter = index => {
	  console.log('eos start');
	  eos = ScatterJS.scatter.eos(networksArr[index], Eos);
	  console.log('error would occure above with desktop version');
	  return true;
	};
	*/
    const connected = await ScatterJS.connect('Farmgame', { network })
    if (!connected) {
      throw 'scatter not found'
    }
    const login = await ScatterJS.login()
	if(!login){
		Modal.open('wombatLoginRestartModal')
		throw 'restart wombat'
		this.isAuthenticated = false
	}
	if(login && login.error && login.error === true){
		Modal.open('wombatLoginRestartModal')
		throw 'restart wombat'
		this.isAuthenticated = false
	}
    scatter = ScatterJS.scatter
    eos = scatter.eos(network, Eos)
	this.symbol = 'EOS'
	this.wallet = 'scatterAccount'
    this.isAuthenticated = true
  }
  
  @action async loginLynx(lynxName) {
    localStorage.setItem('currUser', JSON.stringify(lynxName))
	lynxWallet = lynxName
	if(lynxName.chainId == 'f11d5128e07177823924a07df63bf59fbd07e52c44bc77d16acc1c6e9d22d37b'){
		eos = Eos({
		  chainId: 'f11d5128e07177823924a07df63bf59fbd07e52c44bc77d16acc1c6e9d22d37b',

		  httpEndpoint: 'https://testnet.lynxchain.io',
		  expireInSeconds: 60,
		  symbol: 'LNX',
		  broadcast: true,
		  verbose: true, // API activity
		  sign: true
		})
	} else {
		eos = Eos({
		  chainId: 'b62febe5aadff3d5399090b9565cb420387d3c66f2ccd7c7ac1f532c4f50f573',

		  httpEndpoint: 'https://lynx.cryptolions.io',
		  expireInSeconds: 60,
		  symbol: 'LNX',
		  broadcast: true,
		  verbose: true, // API activity
		  sign: true
		})
	}
	
	this.name = lynxWallet.account.account_name
	this.symbol = 'LNX'
	this.wallet = 'lynxAccount'
	Currency.curr = 'LNX'

	this.isAuthenticated = true
	
  }

  @action async getBalance() {
	
	Currency.chosenSymbol = this.symbol
		const res = await eos.getTableRows({
		  code: 'eosio.token',
		  scope: this.name,
		  table: 'accounts',
		  json: true
		})
		
		let balance = 0
		for (let i = 0; i < res.rows.length; i++) {
		  if (res.rows[i].balance.split(' ')[1] === this.symbol) {
			balance = parseFloat(parseFloat(res.rows[i].balance.split(' ')[0]).toFixed(2))
		  }
		}
		
		if(this.symbol == 'LNX'){
			if (Currency.valueLNX !== balance) {
			  Currency.valueLNX = balance
			}
		} else {
			if (Currency.valueEOS !== balance) {
			  Currency.valueEOS = balance
			}
		}
		
  }
  
  @action async getTime(){
	  let resultOfIt
	  if(this.time){
		  this.oldTime = this.time
	  }
	  const abloTime = await serverTime();
	  if(abloTime && abloTime.data){
		this.time = abloTime.data
		resultOfIt = abloTime.data
	  } else {
		  this.time = this.oldTime
		  resultOfIt = this.oldTime
	  }
	  return resultOfIt;
  }
  
  @action async autoLogin() {

	const getLynxUser = localStorage.getItem("currUser")
	const settedSymbol = localStorage.getItem("thissymbol")
	const settedWallet = localStorage.getItem("thisWallet")
	
	if(getLynxUser){
		const currUser = JSON.parse(getLynxUser)
		if(currUser){
			if(localStorage.getItem("thissymbol") && localStorage.getItem("thisWallet")){
				this.symbol = settedSymbol
				this.wallet = settedWallet
				Currency.curr = settedSymbol
			}
			await Promise.all([this.allLogin(settedSymbol, settedWallet, currUser), this.getBalance(), Events.getEvents()])
		Events.checkEvents()
		}
	} else {
		
		if(localStorage.getItem("thissymbol") && localStorage.getItem("thisWallet")){
			
			const settedSymbol = localStorage.getItem("thissymbol")
			const settedWallet = localStorage.getItem("thisWallet")
			this.symbol = settedSymbol
			this.wallet = settedWallet
			Currency.curr = settedSymbol

			const networkNet = allNets[settedWallet][settedSymbol]["network"]
			
			const connected = await ScatterJS.connect('Farmgame', { network: networkNet })
			if (!connected) {
			  throw 'scatter not found'
			}
			
			const login = await ScatterJS.login().catch(err => {
				console.log('err', err)
				if(err && err.message && err.message == 'The wallet is locked.'){
					this.isAuthenticated = false
					Modal.open('wombatLoginRestartModal')
				}
			})
			
			scatter = ScatterJS.scatter
			
			console.log(scatter)
			if (scatter.identity) {
				eos = scatter.eos(networkNet, Eos)
				this.isAuthenticated = true
			}
		}
	}
	
	if(!this.isAuthenticated && !this.isGuest){
		this.isGuest = true
		this.symbol = 'TLOS'
		this.wallet = 'wombatAccount'
		Currency.curr = 'TLOS'

		const networkNet = allNets['wombatAccount']['TLOS']["network"]

		eos = Eos({
			chainId: '4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11',
			httpEndpoint: 'https://api.telosfoundation.io:443',
			expireInSeconds: 60,
			broadcast: true,
			verbose: true, // API activity
			sign: true
		})
	}
	
  }

  @action async init() {
	const oldName = this.name
	if(this.isGuest){
		this.wallet = 'wombatAccount'
        this.name = 'japosdhasufbidusfb'
		this.symbol = 'TLOS'
	} else {
		if(this.wallet == 'lynxAccount'){
			this.name = lynxWallet.account.account_name
		} else {
			this.name = scatter.identity.accounts[0].name
		}
	}
	const newName = this.name
	
    await Promise.almost([
	  this.getTime(),
      this.getSteamInfoInitial(),
      this.getBalance(),
      Currency.getCurr(),
      Events.getEventsInitial()
    ])
	
	this.isInitializated = true
	
	if(oldName !== ''){
		if(oldName !== newName){
			location.reload()
		}
	}
	
  }
  
  @action async getProgram(){
	this.isProgramOn = false;
	const setOnlineProgram = () => {
	  this.isProgramOn = true;
	}
	const ws = new WebSocket("ws://127.0.0.1:7358/chat")
	
	ws.addEventListener('open', function (event) {
        //console.log('WebSocket open observed:', event);
		setOnlineProgram();
    });

    // Listen for messages
    ws.addEventListener('message', function (event) {
       //console.log('Message from server ', event.data);
    });

    // Handle errors
    ws.addEventListener('error', function (event) {
       //console.log('WebSocket error observed:', event);
    });
	
  }
  

  @action async update() {
	await this.getTime()
	await this.getProgram()
	if(this.isGuest){
		await Promise.all([
			Events.getEvents()
		]).then(data => {
			Events.checkEvents()
		})

	} else {
		await Promise.all([
			Events.getEvents(), 
			this.getBalance(),
			this.getMontlyLevels(), 
			this.isUserSpecial(), 
			this.getReferralsLevels(),
			this.getUserInfo(this.name, this.wallet, true)
		]).then(data => {
			Events.checkEvents()
			console.log('all loaded')
		})
	}
  }
  
  @action pageTitleUpdate(){
	  this.pageTitle = document.title
  }

  @action async logout() {
	localStorage.setItem('currUser', '')
	localStorage.setItem('thissymbol', '')
	localStorage.setItem('thisWallet', '')
	if(scatter){
		await scatter.forgetIdentity()
	}
    this.isAuthenticated = false
	this.isGuest = true
	const settedSymbol = 'TLOS'
	const settedWallet = 'wombatAccount'
	this.name = 'japosdhasufbidusfb'
	this.symbol = settedSymbol
	this.wallet = settedWallet
	Currency.curr = settedSymbol

	const networkNet = allNets[settedWallet][settedSymbol]["network"]

	eos = Eos({
		chainId: '4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11',
		httpEndpoint: 'https://api.telosfoundation.io:443',
		expireInSeconds: 60,
		broadcast: true,
		verbose: true, // API activity
		sign: true
	})
  }
  
}

export default new User()

export { eos, scatter }
