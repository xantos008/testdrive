import React, {useContext} from 'react'
import styles from './rate.module.css'
import LangContext from '../../components/Lang/context/LangContext'

function RateContainer({ left, right, mobileView }) {
  const { currentLangData } = useContext(LangContext)
  return (
    <div className={styles.rate}>
      <div className={styles.left}>
        <div className={styles.rateTitle}>{currentLangData.choiseOfSide}</div>
        {left}
      </div>
      <div className={styles.rateSep} />
      <div className={styles.right}>
        <div className={styles.rateTitle}>{currentLangData.private} / {currentLangData.public}</div>
        {right}
      </div>
    </div>
  )
}

export default RateContainer
