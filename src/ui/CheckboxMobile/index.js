import React, { Fragment } from 'react'
import styles from './checkbox.module.css'

function CheckboxMobile({ value, onToggle, label }) {
  return (
    <Fragment>
		<label htmlFor="rb2" className={styles.mobilePasswordSwitcher}>
		  <input
			className={styles.input}
			type="checkbox"
			name="rb"
			id="rb2"
			checked={value}
			onChange={onToggle}
		  />
		  <span className={`${styles.sliderPassword} ${styles.sliderRoundPassword}`}></span>
		</label>
		<span className={styles.robit}>{label}</span>
    </Fragment>
  )
}

export default CheckboxMobile
