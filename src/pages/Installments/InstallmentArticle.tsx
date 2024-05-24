import React, { ReactNode } from 'react'
import { Box, Typography } from '@mui/material'

export type InstallmentArticleProps = {
  index: number
  title: string | ReactNode
  contents: ReactNode[]
}

export const InstallmentArticle: React.FC<InstallmentArticleProps> = ({ index, title, contents }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
      id={'article-' + index}
    >
      <Typography
        sx={{
          color: 'var(--Gray-800, #14151f)',
          fontSize: { xs: 20, lg: 30 },
          fontStyle: 'normal',
          fontWeight: 700,
          lineHeight: '140%',
        }}
      >
        {index}.&nbsp;&nbsp;{title}
      </Typography>
      {contents.map((item, contentIndex) => (
        <Box
          key={contentIndex}
          sx={{
            color: 'var(--Gray-700, #474747)',
            fontSize: { xs: 16, lg: 20 },
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '170%',
          }}
        >
          {item}
        </Box>
      ))}
    </Box>
  )
}
