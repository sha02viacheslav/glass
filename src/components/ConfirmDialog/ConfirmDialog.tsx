import React from 'react'
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material'

export type ConfirmDialogProps = {
  title: string
  confirmBtn?: string
  cancelBtn?: string
  onConfirm?: () => void
  onCancel?: () => void
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  confirmBtn = 'Yes',
  cancelBtn = 'No',
  onCancel,
  onConfirm,
}) => {
  return (
    <div>
      <Dialog open={true} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
        <DialogActions>
          <Button
            onClick={() => {
              if (onConfirm) onConfirm()
            }}
          >
            {confirmBtn}
          </Button>
          <Button
            onClick={() => {
              if (onCancel) onCancel()
            }}
          >
            {cancelBtn}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
