import React, { ReactNode } from 'react'
import { Link, useMatch, useResolvedPath } from 'react-router-dom'

export type CustomLinkProps = {
  to: string
  children: ReactNode
}

export const CustomLink: React.FC<CustomLinkProps> = ({ to, children, ...props }) => {
  const resolvedPath = useResolvedPath(to)
  const isActive = useMatch({ path: resolvedPath.pathname, end: true })

  return (
    <li className='nav-item'>
      <Link to={to} {...props} className={isActive ? 'nav-link active' : 'nav-link'}>
        {children}
      </Link>
    </li>
  )
}
