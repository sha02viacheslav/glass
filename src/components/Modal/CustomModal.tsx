import React, { FC, PropsWithChildren } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { Typography, Modal, Box, Divider } from '@mui/material'

type PropComponent = PropsWithChildren<{
  open: boolean
  onClose: () => void
  title?: string
  titleStyle?: React.CSSProperties
  bordered?: boolean
  width?: string | number
}>
export const CustomModal: FC<PropComponent> = ({
  open,
  onClose,
  children,
  title,
  width = 1000,
  bordered = true,
  titleStyle = {},
}) => {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'calc(100% - 34px)',
          maxWidth: width,
          maxHeight: 'calc(100vh - 50px)',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'white',
          boxShadow: '0px 1px 3px 0px #0000004D',
          borderRadius: '6px',
        }}
      >
        <Box>
          <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} sx={{ p: 4 }}>
            <Typography variant='h6' style={{ fontSize: 22, ...titleStyle }}>
              {title || ''}
            </Typography>
            <CloseIcon sx={{ cursor: 'pointer' }} onClick={() => onClose()} />
          </Box>
          {bordered && <Divider />}
        </Box>
        <Box sx={{ p: 4, flex: 1, overflow: 'auto' }}>{children}</Box>
      </Box>
    </Modal>
  )
}
