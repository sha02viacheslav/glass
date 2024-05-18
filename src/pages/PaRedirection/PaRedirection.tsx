import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export const PaRedirection: React.FC = ({}) => {
  const { id: quoteId } = useParams()

  const navigate = useNavigate()

  useEffect(() => {
    // Redirecting to quote page
    navigate(`/quote/${quoteId}`)
  }, [])

  return <></>
}
