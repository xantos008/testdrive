import React, { Fragment, useState } from 'react'
import styles from './footer.module.css'
import { Dropdown } from '../../ui/index'
import { Link as RouteLink } from 'react-router-dom'

const Link = ({ title, url }) => {
  return (
    <RouteLink className={styles.navItem} to={url}>
      {title}
    </RouteLink>
  )
}

const NavBarItem = ({ links }) => {
  return (
    <Fragment>
      <nav className={styles.item}>
        {links.map((data, index) => (
          <Link title={data.title} key={index} url={data.url} />
        ))}
      </nav>
      <div className={styles.divider} />
    </Fragment>
  )
}

const NavBar = ({ items }) => {
  return (
    <Fragment>
      {items.map((links, index) => (
        <NavBarItem links={links} key={index} />
      ))}
    </Fragment>
  )
}

const items = [
  [
    {
      title: 'Profile',
      url: '/profile'
    },
    {
      title: 'Events',
      url: '/'
    },
    {
      title: 'Create Event',
      url: '/'
    }
  ],
  [
    {
      title: 'Help',
      url: '/'
    },
    {
      title: 'Buy EOS',
      url: '/'
    },
    {
      title: 'How to Install EOS Scatter',
      url: '/'
    },
    {
      title: 'How to Link Steam ID',
      url: '/'
    }
  ],
  [
    {
      title: 'User Agreement',
      url: '/'
    },
    {
      title: 'Privacy Policy',
      url: '/'
    },
    {
      title: 'About Us',
      url: '/'
    }
  ]
]

const servers = ['Europe', 'USA']
function Footer() {
  const [currentServer, setCurrentServer] = useState('Europe')

  return (
    <Fragment>
      <footer className={styles.footer}>
        <div className={styles.item}>
          <RouteLink className={styles.logo} to="/">
            <img src="/img/logo-footer.png" alt="logo" />
          </RouteLink>
          <div className={styles.soc}>
            <a className={styles.socItem} href="#" rel="nofollow">
              <img src="/img/soc/twitter.png" alt="twitter" />
            </a>
            <a className={styles.socItem} href="#" rel="nofollow">
              <img src="/img/soc/twitch.png" alt="twitch" />
            </a>
          </div>
        </div>

        <NavBar items={items} />

        <div className={styles.item}>
          <div className={styles.title}>Language</div>
          <div className={styles.lang}>
            <img
              className={styles.langItem}
              src="/img/lang/cn.png"
              alt="china"
            />
            <img
              className={`${styles.langItem} ${styles.langItemActive}`}
              src="/img/lang/us.png"
              alt="us"
            />
          </div>
        </div>

        <div className={styles.item}>
          <div className={styles.title}>Server</div>
          <Dropdown
            list={servers}
            value={currentServer}
            setValue={setCurrentServer}
            blackMode={false}
          />
        </div>
        <div className={`${styles.item} ${styles.age}`}>16+</div>
      </footer>
      <footer className={styles.final}>©2019 farmgame.io</footer>
    </Fragment>
  )
}

export default Footer
