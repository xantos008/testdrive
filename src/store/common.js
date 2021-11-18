import { observable, action } from 'mobx'

class Common {
  @observable loading = false
  @observable error = null

  @action startLoading() {
    this.loading = true
  }

  @action endLoading() {
    this.loading = false
  }

  @action setError(payload) {
    this.error = payload
  }

  @action clearError() {
    this.error = null
  }
}

export default new Common()
