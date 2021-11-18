import React, { useState } from 'react'
import styles from './switch.module.css'
import { useStores } from '../../utils/hooks'
import { observer } from 'mobx-react'
function Switch() {
  const { currency } = useStores()

  const toggle = () => {
    if (currency.curr === currency.chosenSymbol) {
      currency.change('USD')
    } else {
      currency.change(currency.chosenSymbol)
    }
  }
  
  let stylesBSwitcher
  
  if(currency.chosenSymbol == 'LNX'){
	  stylesBSwitcher = styles.switcherLNX
  } else if(currency.chosenSymbol == 'TLOS'){
	  stylesBSwitcher = styles.switcherTLOS
  } else {
	  stylesBSwitcher = styles.switcher
  }
  
  return (
    <div className={stylesBSwitcher}>
      <div
        className={`${styles.checkBox} ${
          currency.curr === 'USD' ? styles.active : ''
        }`}>
        <input type="checkbox" id="checkbox-1" />
        <label htmlFor="checkbox-1" onClick={toggle}>
          <span className={styles.circle} />
        </label>
      </div>
    </div>
  )
}

export default observer(Switch)
