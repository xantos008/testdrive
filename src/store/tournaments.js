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
  participationForTournament,
  getTournamentParticipators
} from '../services/utils'

import { renderEvent } from './schemas'

class Tournaments {
  @observable participators = {
	  count: 0,
	  ava1: null,
	  ava2: null,
	  ava3: null,
  }
  
  @action async cancel(key) {

  }
  
  @action async getParticipators(){
	const response = await getTournamentParticipators()
	if(response){
		if(response.data){
			if(response.data.data){
				this.participators.count  = response.data.data.length
				this.participators.ava1  = response.data.data[0] ? response.data.data[0].avatarUrl : null
				this.participators.ava2 = response.data.data[1] ? response.data.data[1].avatarUrl : null
				this.participators.ava3  = response.data.data[2] ? response.data.data[2].avatarUrl : null
				
				return response.data.data
			}
		}
	}
  }
  
  @action async participate(data) {
    const contract = await eos.contract("tournament11", {
      requiredFields: {}
    })

	if(data.paymentRate){
		const val = `${(data.paymentRate / 10 * 10).toFixed(4)} ${User.symbol}`
		const trx = await eos.transfer(User.name, "tournament11", val, "Fee for tournament")
		Modal.close('tournamentParticipateModal')
		if (trx.broadcast) {
			Modal.open('tournamentParticipateSuccessModal')
			participationForTournament(data.accountName, data.tournamentId, data.avatarUrl, data.steamId, data.fio, data.vk, data.paymentRate)
		} else {
		  Modal.open('tournamentParticipateFailedModal')
		}
	} else {
		participationForTournament(data.accountName, data.tournamentId, data.avatarUrl, data.steamId, data.fio, data.vk, data.paymentRate)
		Modal.close('tournamentParticipateModal')
		Modal.open('tournamentParticipateSuccessModal')
	}
  }

}

export default new Tournaments()
