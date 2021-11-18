import React, {useContext} from 'react'
import { observer } from 'mobx-react'
import styles from './sponsorship.module.css'
import LangContext from '../../components/Lang/context/LangContext'


function SponsorshipContainerMobile({ left, right, mobileView }) {
  const { currentLangData } = useContext(LangContext)
  
  return (
    <div className={styles.sponsorship}>
      <div className={styles.left}>
        <div className={styles.sponsorshipTitle}>{currentLangData.rate}</div>
        {left}
      </div>
    </div>
  )
}

export default observer(SponsorshipContainerMobile)