import React, { useContext } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Switch, Avatar } from '../../ui/index'
import styles from './header.module.css'
import { useStores } from '../../utils/hooks'
import { observer } from 'mobx-react'
import LangSwitch from '../../components/Lang/LangSwitch'
import LangContext from '../../components/Lang/context/LangContext';

function HeaderMainScreen() {
  const { user, currency, modal } = useStores()
  const { currentLangData } = useContext(LangContext);

  const logout = () => {
    user.logout()
  }

  const openCreateEventModal = () => {
    modal.openCreateEvent()
  }

  return (
    <header className={styles.header}>
      <Link className={styles.logo} to="/">
        <img src="/img/logo.svg" alt="logo" />
      </Link>
	  <LangSwitch isHeader={true} />
    </header>
  )
}

export default observer(HeaderMainScreen)
