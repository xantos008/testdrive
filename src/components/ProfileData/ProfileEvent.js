import React, {useContext} from 'react'
import styles from './profileData.module.css'
import { Avatar, Loader } from '../../ui/index'
import { observer } from 'mobx-react'
import LangContext from '../../components/Lang/context/LangContext'

function ProfileEvent({ winStatus, data, reverse, noSteam, owner, onClick = () => {}, waiting = false, ready = false, showReadyWaiting = null  }) {
  const { currentLangData } = useContext(LangContext)
  const isOwner = owner === data.name
  console.log('winStatus',winStatus)
  
  return (
    <div
      className={`${styles.profile} ${styles.profileEvent} ${styles.flexOnMobile} ${
        reverse ? styles.reverse : ''
      } ${data.profileUrl ? '' : styles.joinMod}`}>
      <Avatar className={styles.ava} size={130} url={data.avatarUrl} waiting={waiting} showReadyWaiting={showReadyWaiting} ready={ready} link={data.profileUrl ? data.profileUrl : false} onClick={onClick} />
      <div className={styles.info}>
        <div className={styles.titleSub}>{data.name}</div>
        <div className={styles.title}>
		  {data.profileUrl ? (
			<div className={styles.name}><a href={data.profileUrl} target="_blank">{data.username}</a></div>
		  ) : (
			<div className={styles.name}>{data.username}</div>
		  )}
        </div>
		<div className={styles.labels}>
			{isOwner && (
				<div className={`${styles.ownerLable} ${styles.paddingCheck}`}>
					{currentLangData.ownerOfEvent}
				</div>
			)}
			{winStatus !== null && (
			  <div className={`${styles.cachLabel} ${styles.paddingCheck}`}>
				  {winStatus ? (
					<div className={styles.labelWinner}>
					  {currentLangData.anEventwinner}
					</div>
				  ) : (
					<div className={styles.labelLooser}>
					  {currentLangData.anEventlooser}
					</div>
				  )}
			  </div>
			)}
		</div>
      </div>
    </div>
  )
}

export default observer(ProfileEvent)
