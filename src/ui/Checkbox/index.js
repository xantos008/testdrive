import React, { Fragment } from 'react'
import styles from './checkbox.module.css'

function Checkbox({ value, onToggle, label }) {
  return (
    <Fragment>
      <input
        className={styles.input}
        type="checkbox"
        name="rb"
        id="rb2"
        checked={value}
        onChange={onToggle}
      />
      <label htmlFor="rb2">{label}</label>
    </Fragment>
  )
}

export default Checkbox
