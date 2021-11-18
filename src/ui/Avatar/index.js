import React, { useMemo, useContext } from 'react'
import styles from './avatar.module.css'
import { observer } from 'mobx-react'
import LangContext from '../../components/Lang/context/LangContext'
function Avatar({ size, url, biga = false, link = false, onClick = null, waiting = false, ready = false, showReadyWaiting = null}) {
  const containerStyle = useMemo(
    () => ({
      width: `${size}px`,
      height: `${size}px`,
      borderWidth: `${size / 10}px`
    }),
    [size]
  )
  
  const { currentLangData } = useContext(LangContext)
  
  return (
    <div className={`${styles.ava} ${biga ? styles.Biga : ''} ${waiting ? styles.avaWaiting : ''} ${ready ? styles.avaReady : ''}`} onClick={onClick} >
	  <div className={styles.preAvaBlock}>
		{link ? (
			<a href={link} target="_blank"><img src={url ? url : '/img/ava.png'} alt="avatar" /></a>
		) : (
			<img src={url ? url : '/img/ava.png'} alt="avatar" />
		)}
		
		<div className={styles.joinText}><span>{currentLangData.join}</span><img src="/img/waitingcircle.png" /></div>
	  </div>
	  {showReadyWaiting && (
		<img src="/img/ready.svg" className={styles.readyPicture} />
	  )}
	  {showReadyWaiting && (
	  	<img src="/img/waiting.svg" className={styles.waitingPicture} />
	  )}
    </div>
  )
}

export default observer(Avatar)
