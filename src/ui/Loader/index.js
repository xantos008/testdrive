import React from 'react'
import styles from './loader.module.css'

function Loader({ visible, className }) {
  return (
    <div
      className={`${styles.spinner} ${
        visible ? styles.active : ''
      } ${className}`}>
      <div className={styles.bounce1} />
      <div className={styles.bounce2} />
      <div />
    </div>
  )
}

export default Loader
