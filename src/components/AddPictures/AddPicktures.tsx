import './style.css'
import React, { useState, useRef, useEffect, ChangeEvent, MouseEvent } from 'react'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import { Attachment } from '@glass/models'

type AddPicturesProps = {
  size?: 'small' | 'medium'
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
  size = 'medium',
  disabled = false,
  showUpload = false,
  attachments,
  limit,
  onChangeFiles = () => {},
  onClickUpload = () => {},
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [validFiles, setValidFiles] = useState<Attachment[]>([])
  const [errorMessage, setErrorMessage] = useState<string>('')

  const btnOnClick = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()
    inputRef.current?.click()
  }

  const validateFile = (file: File): ValidateFileResponse => {
    // Get the size of the file by files.item(i).size.
    const validTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/bmp']
    if (Math.round(file.size / 1024) > 25000) {
      return {
        status: false,
        message: 'This file exceeds maximum allowed size of 25 MB',
      }
    }
    if (validTypes.indexOf(file.type) === -1) {
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
    <div className='row'>
      {validFiles.map((file, idx) => (
        <div key={idx} className={(size === 'small' ? 'col-4 col-lg-3' : 'col-6 col-lg-4') + ' broken-image-wrap mb-4'}>
          <div className='square'>
            <div>
              <img src={file.datas} alt='Broken Image' />
              {size !== 'small' && <div className='title'>{file.name}</div>}
              {!disabled && (
                <button className='btn-icon' onClick={() => deleteFile(idx)}>
                  <DeleteForeverOutlinedIcon />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div>
      {renderFiles()}

      {!disabled && (
        <div>
          <button className='btn-raised' onClick={btnOnClick}>
            <label style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}>
              <input
                ref={inputRef}
                type='file'
                className='d-none'
                onChange={filesSelected}
                multiple
                accept='image/png, image/jpeg, image/gif, image/bmp'
                onClick={(event) => event.stopPropagation()}
                disabled={disabled}
              />
              Add Pictures
            </label>
          </button>
          {showUpload && !!validFiles?.length && (
            <button className='btn-stroked ms-3' onClick={handleClickUpload}>
              <label style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}>Confirm Upload</label>
            </button>
          )}
        </div>
      )}

      <div>{errorMessage}</div>
    </div>
  )
}
