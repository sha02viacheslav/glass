import React, { ChangeEvent, MouseEvent, useEffect, useRef, useState } from 'react'
import { Box, CardMedia, Typography } from '@mui/material'
import { Attachment } from '@glass/models'
import { isBase64PDF } from '@glass/utils/check-type-base64/check-type-base64.util'

type AddPicturesProps = {
  disabled?: boolean
  showUpload?: boolean
  attachments: Attachment[]
  limit?: number
  onChangeFiles?: (files: Attachment[]) => void
  onClickUpload?: () => void
}

type ValidateFileResponse = {
  status: boolean
  message?: string
}

export const AddPictures: React.FC<AddPicturesProps> = ({
  disabled = false,
  showUpload = false,
  attachments,
  limit,
  onChangeFiles = () => {},
  onClickUpload = () => {},
}) => {
  const VALID_FILE_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/bmp', 'application/pdf']
  const inputRef = useRef<HTMLInputElement>(null)
  const [validFiles, setValidFiles] = useState<Attachment[]>([])
  const [errorMessage, setErrorMessage] = useState<string>('')

  const btnOnClick = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()
    inputRef.current?.click()
  }

  const validateFile = (file: File): ValidateFileResponse => {
    // Get the size of the file by files.item(i).size.
    if (Math.round(file.size / 1024) > 25000) {
      return {
        status: false,
        message: 'This file exceeds maximum allowed size of 25 MB',
      }
    }
    if (VALID_FILE_TYPES.indexOf(file.type) === -1) {
      return {
        status: false,
        message: 'Please only submit png, jpeg, gif or bmp',
      }
    }
    return {
      status: true,
    }
  }

  const filesSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    handleFiles(files)
    // Have to release file input element
    e.target.value = ''
  }

  const handleFiles = (files: File[] | FileList | undefined | null) => {
    if (!files?.length) return
    if (limit && files.length + validFiles.length > limit) {
      setErrorMessage(`File submission limited to ${limit} files`)
      return
    }
    let newFiles: File[] = []
    for (let i = 0; i < files.length; i++) {
      const file = validateFile(files[i])
      if (file.status) {
        newFiles = newFiles.concat(files[i])
      } else {
        setErrorMessage(file.message || '')
      }
    }
    handleNewFiles(newFiles)
  }

  const handleNewFiles = (newFiles: File[]) => {
    const promises: Promise<Attachment>[] = []

    newFiles.map((file) => {
      promises.push(
        new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = () => {
            const newAttachment: Attachment = {
              attachment_id: 0,
              name: file.name,
              datas: reader.result as string,
            }
            resolve(newAttachment)
          }
          reader.onerror = (error) => {
            reject(error)
          }
        }),
      )
    })

    Promise.all(promises).then((files) => {
      setValidFiles((pre) => [...pre, ...files])
      onChangeFiles([...validFiles, ...files])
    })
  }

  const deleteFile = (idx: number) => {
    validFiles.splice(idx, 1)
    setValidFiles([...validFiles])
    onChangeFiles([...validFiles])
  }

  const handleClickUpload = () => {
    onClickUpload()
  }

  useEffect(() => {
    setValidFiles(attachments || [])
  }, [attachments])

  const renderFiles = () => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--4, 4px)',
        height: '100px',
        padding: '6px',
        borderRadius: 'var(--4, 4px)',
        border: '1px solid var(--Gray-100, #F2F2F3)',
        background: '#FFF',
        overflow: 'auto',
      }}
    >
      {validFiles.map((file, idx) => (
        <Box key={idx} sx={{ height: '100%', position: 'relative' }} className={'broken-image-wrap'}>
          {isBase64PDF(file.datas) ? (
            <CardMedia
              component='img'
              sx={{
                width: '80%',
                maxWidth: '80px',
                objectFit: 'contain',
              }}
              image={process.env.PUBLIC_URL + '/images/pdf.png'}
              alt='PDF Image'
            />
          ) : (
            <CardMedia
              component='img'
              sx={{
                width: 'auto',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '2px',
              }}
              image={file.datas}
              alt='Broken Image'
            />
          )}

          {!disabled && (
            <Box
              sx={{
                position: 'absolute',
                top: '10px',
                right: '10px',
              }}
            >
              <Box
                sx={{
                  width: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  background: 'var(--Red---Semantic-500, #C22222)',
                  boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 2px 4px 0px rgba(0, 0, 0, 0.20)',
                  cursor: 'pointer',
                }}
                onClick={() => deleteFile(idx)}
              >
                <CardMedia component='img' sx={{}} image={process.env.PUBLIC_URL + '/images/minus.svg'} alt='Minus' />
              </Box>
            </Box>
          )}
        </Box>
      ))}
    </Box>
  )

  return (
    <Box>
      {!disabled && (
        <Box sx={{ marginBottom: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ lineHeight: '150%' }}>Broken glass pictures or videos</Typography>
            <button className='btn-link' onClick={btnOnClick}>
              <label style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}>
                <input
                  ref={inputRef}
                  type='file'
                  className='d-none'
                  onChange={filesSelected}
                  multiple
                  accept={VALID_FILE_TYPES.join(', ')}
                  onClick={(event) => event.stopPropagation()}
                  disabled={disabled}
                />
                + Upload
              </label>
            </button>
          </Box>

          {showUpload && !!validFiles?.length && (
            <button className='btn-stroked round ms-3' onClick={handleClickUpload}>
              <label style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}>Confirm Upload</label>
            </button>
          )}
        </Box>
      )}

      {renderFiles()}

      <div>{errorMessage}</div>
    </Box>
  )
}
