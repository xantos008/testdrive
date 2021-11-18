import { observable, action } from 'mobx'
import User from './user'
import Events from './events'
class Modal {
  @observable visible = {
    steam: false,
    createEvent: false,
    pandasBotModal: false,
    error: false,
    cancel: false,
    createEventSuccess: false,
    createEventError: false,
    acceptTrue: false,
    testGamesEnd: false,
    accept: false,
    rejectAccept: false,
    answerFalse: false,
    lobbyCreating: false,
    lobbyError: false,
    answerAccept: false,
    opponentFound: false,
    createEventAbuse: false,
    participate5vs5: false,
    error2: false,
    leaveEvent: false
  }
  @observable currentData = { rate_to: 0, rate_from: 5 }
  @observable errorText = 'Error.'
  @action open(name, currentData = null) {
	document.body.setAttribute('style', 'overflow:hidden')
    this.visible[name] = true
    if (currentData) {
      this.currentData = currentData
    }
  }

  @action openError(text) {
	document.body.setAttribute('style', 'overflow:hidden')
    this.errorText = text
    this.open('error2')
  }

  @action close(name) {
	document.body.removeAttribute('style')
    this.visible[name] = false
  }
  // todo для продакшена поменять
  @action openCreateEvent() {
	document.body.setAttribute('style', 'overflow:hidden')
    const data = Events.events.find(item => item.name_owner === User.name)
    if (User.isSteamLinked) {
      // if (!data) {
      this.open('createEvent')
      // } else {
      //   this.open('createEventAbuse')
      // }
    } else {
      this.open('steam')
    }
  }
}

export default new Modal()
