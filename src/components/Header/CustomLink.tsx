import React, { ReactNode } from 'react'
import { CardMedia, Typography } from '@mui/material'
import { Link, useMatch, useResolvedPath } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

export type CustomLinkProps = {
  to?: string
  children: ReactNode
  hasDropdown?: boolean
  onClick?: () => void
}

export const CustomLink: React.FC<CustomLinkProps> = ({
  to = '',
  children,
  hasDropdown = false,
  onClick = () => {},
  ...props
}) => {
  const generatedUuid = uuidv4()
  const resolvedPath = useResolvedPath(to)
  const isActive = to ? useMatch({ path: resolvedPath.pathname, end: true }) : false

  return (
    <li className='nav-item'>
      {hasDropdown ? (
        <Typography
          id={generatedUuid}
          {...props}
          className={isActive ? 'nav-link active' : 'nav-link'}
          onClick={() => onClick()}
        >
          {children}
          <CardMedia
            component='img'
            sx={{ width: 24, height: 24 }}
            image={process.env.PUBLIC_URL + '/images/chevron-down.svg'}
          />
        </Typography>
      ) : (
        <Link
          id={generatedUuid}
          to={to}
          {...props}
          className={isActive ? 'nav-link active' : 'nav-link'}
          onClick={() => onClick()}
        >
          {children}
        </Link>
      )}
    </li>
  )
}
