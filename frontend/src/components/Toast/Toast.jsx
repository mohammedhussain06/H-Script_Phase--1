import React, { useEffect } from 'react'
import './Toast.css'

/**
 * Toast — simple notification popup
 * Props: message, type ('success'|'error'|'info'), onClose
 */
export default function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2800)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div className={`toast toast--${type}`} role="alert">
      <span className="toast__icon">
        {type === 'success' ? '✓' : type === 'error' ? '✖' : 'ℹ'}
      </span>
      <span className="toast__msg">{message}</span>
      <button className="toast__close" onClick={onClose}>×</button>
    </div>
  )
}
