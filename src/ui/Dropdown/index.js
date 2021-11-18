import React, { useState } from 'react'
import styles from './dropdown.module.css'

function Dropdown({
  list,
  value,
  setValue,
  blackMode,
  disabled,
  valueType = 'value',
  mobileSerega,
  hideScroll,
  hideArrow
}) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleList = el => {
    setIsOpen(val => !val)
  }

  const setNewValue = val => {
    setValue(val)
    toggleList()
  }
  const isObjectValue = valueType === 'obj'
  return (
    <div
      className={`${styles.dropdown} ${blackMode ? styles.dropdownBlack : ''} ${mobileSerega ? styles.dropDownMobileNew : ''} ${hideScroll ? styles.hideScroll : ''} ${hideArrow ? styles.hideArrow : ''}`}>
      <div
        className={`${styles.select} ${isOpen ? styles.rotate : ''}`}
        onClick={toggleList}>
        <span>{isObjectValue ? value.title : value}</span>
      </div>
      {!disabled && (
        <ul className={`${styles.menu} ${isOpen ? styles.visible : ''}`}>
          {list.map((val, index) => (
            <li
              key={index}
              onClick={() => {
                setNewValue(val)
              }}>
              {isObjectValue ? val.title : val}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

Dropdown.defaultProps = {
  blackMode: true,
  disabled: false
}

export default Dropdown
