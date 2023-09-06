import clsx from 'classnames'
import { FC, HTMLAttributes, PropsWithChildren } from 'react'

import styles from './Container.module.scss'

interface ContainerProps {
  variant?: 'xl'
}

const Container: FC<PropsWithChildren<HTMLAttributes<HTMLDivElement>> & ContainerProps> = ({
  variant = 'xl',
  children,
  className,
  ...rest
}) => {
  return (
    <div className={clsx(className, styles.container, variant && styles[variant])} {...rest}>
      {/* @ts-ignore */}
      {children}
    </div>
  )
}

export default Container
