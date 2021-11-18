import React from 'react'
import styles from './modal.module.css'

function Modal({ onBackgroundPress, children, visible, style, isMobile, onlyBody }) {
  return (
    <div className={`${styles.overlay} ${visible ? styles.active : ''}`}>
      <div className={styles.close} onClick={onBackgroundPress} />
      <div className={`${styles.group} ${isMobile ? styles.mobileGroupNew : ''}`}>
        <div className={`${styles.popup} ${isMobile ? styles.mobilePopup : ''} ${onlyBody ? styles.fullBorder : ''}`} style={style}>
          {children}
        </div>
      </div>
    </div>
  )
}

function Body({ children, hideBack = 'off', onlyBody }) {
  return ( 
	<div className={`${hideBack === 'on' ? styles.bodyNoBack : styles.body} ${onlyBody ? styles.fullBorder : ''}`}>{children}</div> 
  )
}

function Head({ children, status }) {
  return (
    <div
      className={`${styles.head} ${status === 'error' ? styles.error : ''} ${
        status === 'success' ? styles.success : ''
      }`}>
      {children}
    </div>
  )
}

export { Modal, Body, Head }
