import React, { ReactNode } from 'react'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Box, Modal, Typography } from '@mui/material'

export type ConfirmDialogProps = {
  title: string
  description?: string | ReactNode
  subDescription?: string | ReactNode
  confirmStr?: string
  cancelStr?: string
  confirmButtonType?: 'primary' | 'danger'
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
  confirmButtonType = 'primary',
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
          borderRadius: '12px',
          maxWidth: subDescription ? '550px' : '450px',
          p: 6,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: '18px', fontWeight: '700', lineHeight: '140%' }}>{title}</Typography>
          {showIcon && <ErrorOutlineIcon sx={{ fontSize: 50, margin: '20px 0px' }} />}
          {description ? (
            <Typography
              marginTop={showIcon ? 0 : 4}
              sx={{ fontSize: '14px', fontWeight: '400', lineHeight: '20px', letterSpacing: '0.25px' }}
            >
              {description}
            </Typography>
          ) : (
            <Box marginTop={showIcon ? 0 : 7}></Box>
          )}
          {subDescription && <Typography>{subDescription}</Typography>}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6, marginLeft: -4, gap: 2 }}>
            {showCancel && (
              <button className='btn-transparent' onClick={onCancel}>
                {cancelStr}
              </button>
            )}
            <button
              className={confirmButtonType === 'primary' ? 'btn-stroked transparent' : 'btn-transparent danger'}
              onClick={onConfirm}
            >
              {confirmStr}
            </button>
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}
