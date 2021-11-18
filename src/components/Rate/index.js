import React, {useContext} from 'react'
import styles from './rate.module.css'
import { observer } from 'mobx-react'
import { useStores } from '../../utils/hooks'
import LangContext from '../../components/Lang/context/LangContext'

function Rate({ children, rate, mode, sponsored, className }) {
  const { currentLangData } = useContext(LangContext)
  const { currency } = useStores()
  let multiAbove = 2
  if(sponsored){
	  multiAbove = 1
  }
  return (
    <div className={`${styles.rate} ${className ? className : ''}`}>
      <div>
        <div className={styles.rateTitle}>{currentLangData.rate}</div>
        {children}
      </div>
      <div className={styles.rateSep} />
      <div>
        <div className={styles.rateTitle}>
          {mode === '5 vs 5' ? '' : currentLangData.maximum} {currentLangData.possibleWin}
        </div>
        <div className={styles.right}>
          <span className={styles.green}>
            {((rate * multiAbove * (100 - currency.commission)) / 100).toFixed(2)}
          </span>
          <span className={styles.rateCurr}>{` ${currency.curr}`}</span>
          <div className={styles.comis}>{currentLangData.takingCommission}</div>
        </div>
      </div>
    </div>
  )
}

Rate.defaultProps = {
  mode: '1 vs 1 Mid'
}

export default observer(Rate)
