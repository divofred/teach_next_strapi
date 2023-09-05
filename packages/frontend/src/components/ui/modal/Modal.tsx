import React, { FC } from 'react'

import { closeIcon } from '@/src/constants/constants'

import { User } from '@/src/types/types'

import styles from './Modal.module.scss'
import Portal from './Portal/Portal'

interface ModalTypes {
  user?: User
  closeClickHandler: () => void
}

const Modal: FC<ModalTypes> = ({ closeClickHandler }) => {
  return (
    <Portal>
      <article className={styles.modal}>
        <div className={styles.overlay} onClick={closeClickHandler}></div>
        <div className={styles.cardWithExit}>
          <div className={styles.exit}>{closeIcon}</div>
        </div>
      </article>
    </Portal>
  )
}

export default React.memo(Modal)
