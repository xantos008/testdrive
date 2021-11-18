import React, {useContext} from 'react'
import styles from './rate.module.css'
import { observer } from 'mobx-react'
import { useStores } from '../../utils/hooks'
import LangContext from '../../components/Lang/context/LangContext'

function RateMobile({ children, rate, mode, sponsored, className }) {
  const { currentLangData } = useContext(LangContext)
  const { currency } = useStores()
  let multiAbove = 2
  if(sponsored){
	  multiAbove = 1
  }
  return (
    <div className={`${styles.rate} ${className ? className : ''}`}>
      <div>
        <div className={styles.rateTitle}>
			{sponsored ? currentLangData.pricePool : currentLangData.rate}
		</div>
        {children}
      </div>
    </div>
  )
}

RateMobile.defaultProps = {
  mode: '1 vs 1 Mid'
}

export default observer(RateMobile)
