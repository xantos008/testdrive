import React from 'react'
import styles from './nickname.module.css'

function Nickname({ username, avatarUrl, profileUrl, big }) {
  return (
    <div className={`${styles.nickname} ${big ? styles.nicknameBig : ''}`}>
      <img className={styles.nicknameAva} src={avatarUrl} alt="avatar" />
      {username}
      <a href={profileUrl} target="_blank" rel="nofollow">
        <img className={styles.nicknameSteam} src="/img/soc/steam.png" />
      </a>
    </div>
  )
}

export default Nickname
