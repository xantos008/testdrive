import React, {useContext} from 'react'
import { observer } from 'mobx-react'
import styles from './sponsorship.module.css'
import LangContext from '../../components/Lang/context/LangContext'


function SponsorshipContainer({ left, right, mobileView }) {
  const { currentLangData } = useContext(LangContext)
  
  return (
    <div className={styles.sponsorship}>
      <div className={styles.left}>
        <div className={styles.sponsorshipTitle}>{currentLangData.rate}</div>
        {left}
      </div>
      <div className={styles.sponsorshipSep} />
      <div className={styles.right}>
		<div className={styles.sponsorshipTitle}>{currentLangData.private} / {currentLangData.public}</div>
        {right}
      </div>
    </div>
  )
}

export default observer(SponsorshipContainer)