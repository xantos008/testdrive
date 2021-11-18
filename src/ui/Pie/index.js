import React from 'react'
import styles from './pie.module.css'

function Pie({ big, title, value }) {
  return (
    <div className={`${styles.pie} ${big ? styles.pieBig : ''}`}>
      <div className={styles.bg} />
      <div className={styles.bgTop} />
      <div className={styles.content}>
        <div className={styles.rotate}>
          <div className={styles.count}>{value}</div>
          <div className={styles.text}>{title}</div>
        </div>
      </div>
      <svg viewBox="0 0 32 32">
        <circle
          r="16"
          cx="16"
          cy="16"
          style={{ strokeDasharray: '101, 100' }}
        />
      </svg>
    </div>
  )
}

export default Pie
