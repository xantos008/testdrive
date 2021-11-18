import { observable, action, computed } from 'mobx'
import { getExchangeRate, getExchangeRateLynx, getExchangeRateTlos, getRublesFromUsd } from '../services/utils'
import User from './user'
import Events from './events'

class Currency {
  @observable curr = 'EOS'
  @observable chosenSymbol = 'EOS'
  @observable valueEOS = 0
  @observable valueLNX = 0
  @observable exchangeRateRub = 0
  @observable exchangeRate = 0
  @observable commission = 10
  @observable isFirstMonth = false
  @observable nextLevelComission = 0
  @observable playedInMonths = 0
  @observable moreGames = 0

  withUSD(val, signs = 2) {
    return computed(() => {
      if (this.curr === 'EOS' || this.curr === 'LNX' || this.curr === 'TLOS') {
        return val.toFixed(signs)
      } else {
        return (val * this.exchangeRate).toFixed(signs)
      }
    }).get()
  }
  
  getUSD(val, signs = 2) {
    return computed(() => {
		if(this.exchangeRate == 0){
			this.getUSDRate()
			return (val * this.exchangeRate).toFixed(signs)
		} else {
			return (val * this.exchangeRate).toFixed(signs)
		}
    }).get()
  }
  
  getRUB(val, signs = 2) {
	  return computed(() => {
		if(this.exchangeRateRub == 0){
			this.getRUBRate()
			return (val * this.exchangeRateRub).toFixed(signs)
		} else {
			return (val * this.exchangeRateRub).toFixed(signs)
		}
	  }).get()
  }
  
  getTlosFromRub(val, signs = 2) {
	  return computed(() => {
		if(this.exchangeRateRub == 0){
			this.getRUBRate()
		}
		if(this.exchangeRate == 0){
			this.getUSDRate()
		}
		return (( (val * this.exchangeRateRub) / this.exchangeRate).toFixed(signs))
	  }).get()
  }

  @action async getCurr() {
	
    const userInfo = await User.getUserInfo(User.name, User.wallet)
	const getMontlyLevels = await User.getMontlyLevels()
	const getReferralsLevels = await User.getReferralsLevels()
	const getsummRefSalary = await User.getsummRefSalary()
	const isUserSpecial = await User.isUserSpecial()
	const allEventsInBase = await Events.getEvents()
	
    if(userInfo){
      if(userInfo.registeredTime && userInfo.registeredTime !== ''){
			let rD = new Date(userInfo.registeredTime)
			let nD = new Date()
			let calculated, startDate = new Date(), finDate = new Date(), is5vs5, eventDate, playedInMonths = 0, daysLag, countingLevels = 0
			nD.setDate(nD.getDate() - 30)
			
			if(rD > nD){
				console.log('new reg')
				this.commission = 0
				this.isFirstMonth = true
			} else {
				
				daysLag = Math.ceil(Math.abs(nD.getTime() - rD.getTime()) / (1000 * 3600 * 24));
				calculated = daysLag
				while(calculated > 0){
					calculated = calculated - 30
					if(calculated < 0){
						break
					}
				}
				calculated = calculated + 30
				startDate.setDate(startDate.getDate() - calculated)
				finDate.setDate(finDate.getDate() + (30 - calculated))
				
				allEventsInBase.myEvents.map(event => {
					is5vs5 = event.mode === '5 vs 5' 
					eventDate = is5vs5 ? new Date(event.created_at * 1000) : new Date(event.accepted_at * 1000)
					
					if ( eventDate >= startDate && eventDate <= finDate) {
						playedInMonths = playedInMonths + 1
					}
				})
				
				this.playedInMonths = playedInMonths
				
				getMontlyLevels.map(level => {
					countingLevels ++
					if(level.gamesPlayedMax){
						if ( playedInMonths >= level.gamesPlayedMin && playedInMonths <= level.gamesPlayedMax) {
							this.moreGames = level.gamesPlayedMax - playedInMonths
							this.commission = level.commission
							this.nextLevelComission = getMontlyLevels[countingLevels].commission
						}
					} else {
						if ( playedInMonths > level.gamesPlayedMin) {
							this.moreGames = 0
							this.commission = level.commission
						}
					}
				})
				
				if(User.userSpecial){
					this.commission = User.userSpecial.payableCommission
				}
				
			}
		}
	}

	if(!curr || curr !== 'USD'){
		await this.getUSDRate()
	}
    const curr = localStorage.getItem('curr')
    if (!curr) {
      localStorage.setItem('curr', this.chosenSymbol)
    } else {
      if (curr === 'USD') {
        this.curr = 'USD'
        await this.getUSDRate()
      }
    }
  }

  @action async change(curr) {
    localStorage.setItem('curr', curr)
    this.curr = curr
    if (curr === 'USD' && this.exchangeRate === 0) {
      await this.getUSDRate()
    }
  }

  @action async getUSDRate() {
	let response
	if(this.chosenSymbol == 'LNX'){
	  response = await getExchangeRateLynx()
	  const count = response.data[0].price.length - 1	  
	  this.exchangeRate = response.data[0].price[count][1]
	} else if(this.chosenSymbol == 'TLOS'){
		response = await getExchangeRateTlos()
		this.exchangeRate = response.data
	} else {
	  response = await getExchangeRate()
	  this.exchangeRate = response.data.price
	}
  }
  
  @action async getRUBRate() {
	let response
	if(this.chosenSymbol == 'TLOS'){
		response = await getRublesFromUsd()
		this.exchangeRateRub = response.data.rates.USD
	}
  }
  
}

export default new Currency()
