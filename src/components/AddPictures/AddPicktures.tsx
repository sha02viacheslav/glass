import './style.css'
import React, { useState, useRef, useEffect, ChangeEvent, MouseEvent } from 'react'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import { Attachment } from '@glass/models'

type AddPicturesProps = {
  disabled?: boolean
  attachments: Attachment[]
  limit?: number
  onChangeFiles?: (files: Attachment[]) => void
}

type ValidateFileResponse = {
  status: boolean
  message?: string
}

export const AddPictures: React.FC<AddPicturesProps> = ({ disabled = false, attachments, limit, onChangeFiles }) => {
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
    newFiles.map((file) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const newAttachment: Attachment = {
          attachment_id: 0,
          name: file.name,
          datas: reader.result as string,
        }
        setValidFiles((pre) => [...pre, newAttachment])
        onChangeFiles && onChangeFiles([...validFiles, newAttachment])
      }
    })
  }

  const deleteFile = (idx: number) => {
    validFiles.splice(idx, 1)
    setValidFiles([...validFiles])
    onChangeFiles && onChangeFiles(validFiles)
  }

  useEffect(() => {
    setValidFiles(attachments || [])
  }, [attachments])

  const renderFiles = () => (
    <div className='row'>
      {validFiles.map((file, idx) => (
        <div key={idx} className='col-6 col-lg-4 broken-image-wrap mb-4'>
          <div className='square'>
            <div>
              <img src={file.datas} alt='Broken Image' />
              <div className='title'>{file.name}</div>
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
      )}

      <div>{errorMessage}</div>
    </div>
  )
}
