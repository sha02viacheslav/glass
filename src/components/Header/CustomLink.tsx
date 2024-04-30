import React, { ReactNode } from 'react'
import { Link, useMatch, useNavigate, useResolvedPath } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { DropdownMenuItem } from '@glass/models'

export type CustomLinkProps = {
  to: string
  children: ReactNode
  dropdownItems?: DropdownMenuItem[]
  onClick?: () => void
}

export const CustomLink: React.FC<CustomLinkProps> = ({
  to,
  children,
  dropdownItems,
  onClick = () => {},
  ...props
}) => {
  const navigate = useNavigate()
  const generatedUuid = uuidv4()
  const resolvedPath = useResolvedPath(to)
  const isActive = useMatch({ path: resolvedPath.pathname, end: true })

  const onClickMenuItem = (link: string) => {
    setTimeout(() => {
      navigate(link)
    })
  }

  return (
    <li className={'nav-item' + (dropdownItems?.length ? ' dropdown' : '')}>
      {!!dropdownItems?.length ? (
        <Link
          id={generatedUuid}
          to={to}
          {...props}
          className={isActive ? 'nav-link dropdown-toggle active' : 'nav-link dropdown-toggle'}
          role='button'
          data-bs-toggle='dropdown'
          aria-expanded='false'
          onClick={() => onClick()}
        >
          {children}
        </Link>
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

      {!!dropdownItems?.length && (
        <ul className='dropdown-menu dropdown-menu-dark' aria-labelledby={generatedUuid}>
          {dropdownItems.map((item, index) => (
            <li key={index} className='cursor-pointer'>
              <a className='dropdown-item' onClick={() => onClickMenuItem(item.link)}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}
