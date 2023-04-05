import React, { ReactNode } from 'react'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Box, Modal, Typography } from '@mui/material'

export type ConfirmDialogProps = {
  title: string
  description: string
  subDescription?: string | ReactNode
  confirmStr?: string
  cancelStr?: string
  backgroundColor?: string
  showIcon?: boolean
  showCancel?: boolean
  onConfirm: () => void
  onCancel?: () => void
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  description,
  subDescription,
  confirmStr = 'Yes',
  cancelStr = 'No',
  showIcon = true,
  showCancel = true,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      open={true}
      aria-labelledby='child-modal-title'
      disableAutoFocus={true}
      aria-describedby='child-modal-description'
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          height: 'auto',
          backgroundColor: '#EEF4F8',
          borderRadius: '20px',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          maxWidth: subDescription ? '550px' : '450px',
          p: 4,
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant='h5' fontWeight={'bold'}>
            {title}
          </Typography>
          {showIcon && <ErrorOutlineIcon sx={{ fontSize: 50, margin: '20px 0px' }} />}
          <Typography
            marginTop={showIcon ? 0 : 4}
            component={'p'}
            dangerouslySetInnerHTML={{ __html: description || '' }}
          />
          {subDescription && <Typography>{subDescription}</Typography>}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '30px',
              gap: '40px',
            }}
          >
            {showCancel && (
              <button className='btn-stroked round' onClick={onCancel}>
                {cancelStr}
              </button>
            )}
            <button className='btn-raised round' onClick={onConfirm}>
              {confirmStr}
            </button>
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}
