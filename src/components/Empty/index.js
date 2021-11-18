import React, {useContext} from 'react'
import styles from './empty.module.css'
import { Button, CreateEventButton } from '../../ui/index'
import { Link } from 'react-router-dom'
import LangContext from '../Lang/context/LangContext'

function EmptyEvents() {
  const { currentLangData } = useContext(LangContext)
  return (
    <div className={styles.empty}>
      <div className={styles.title}>{currentLangData.notFoundAnyEvent}</div>
      <div className={styles.titleSub}>{currentLangData.youCanCreateFirst}</div>
      <CreateEventButton />
      <Link to="/profile" className={styles.btn}>
        <Button color="red" title={currentLangData.goToProfileButton} />
      </Link>
    </div>
  )
}

function EmptyProfile() {
  const { currentLangData } = useContext(LangContext)
  return (
    <div className={styles.empty}>
      <div className={styles.title}>
        {currentLangData.userNotParticipatedFirst} 
        <br />
        {currentLangData.userNotParticipatedSecond} 
      </div>
      <div className={styles.titleSub}>
        {currentLangData.createOrParticipateFirst}
        <br />
        {currentLangData.createOrParticipateSecond}
      </div>
      <CreateEventButton />
      <Link to="/" exact="true" className={styles.btn}>
        <Button color="red" title={currentLangData.goToEventsButton} />
      </Link>
    </div>
  )
}

export { EmptyEvents, EmptyProfile }
