import React, {useContext} from 'react'
import { Modal, Head, Body } from './Modal'
import { Button, NewIconButton, SimpleButton } from '../../ui/index'
import styles from './modal.module.css'
import { useStores } from '../../utils/hooks'
import { observer } from 'mobx-react'
import LangContext from '../../components/Lang/context/LangContext'

function LeaveEventModal({onClickLeaveEvent}) {
  const { currentLangData } = useContext(LangContext)
  const { modal, events } = useStores()
  const isMobile = window.innerWidth < 768
  const [canClick, setCanClick] = useState(true)
  
  let is5vs5, event, onClickLeave
  
  if(modal.currentData.mode) {
  
	  is5vs5 = modal.currentData.mode === '5 vs 5'
	  event = modal.currentData
	  
	  onClickLeave = () => {
		setCanClick(false)
		if(is5vs5){
			events.leave(event.key).then(() => {
			  modal.close('leaveEvent')
			})
		} else {
			events.leave1v1(event.key).then(() => {
			  modal.close('leaveEvent')
			})
		}
	  }
  } else {
	  onClickLeave = onClickLeaveEvent
  }
  
  const closeModal = () => {
    modal.close('leaveEvent')
  }

  return (
    <Modal visible={modal.visible.leaveEvent} onBackgroundPress={closeModal} isMobile={isMobile}>
      <Head>
		{currentLangData.areYouLeave}
		<div className={`${styles.closeIcon}`} onClick={closeModal}><img src="/img/closeDesktop.png" /></div>
	  </Head>
      <Body>
        <div className={styles.blockCenter}>
          <NewIconButton
            title={currentLangData.leveBig}
            onClick={canClick ? onClickLeave : null}
			img="/img/buttonIcons/leave.png"
          />
          <SimpleButton title={currentLangData.cancelBig} onClick={closeModal} className={styles.leaveButtonUpd} />
        </div>
      </Body>
    </Modal>
  )
}

export default observer(LeaveEventModal)
