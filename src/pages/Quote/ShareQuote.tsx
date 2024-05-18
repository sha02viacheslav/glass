import { FC, useState } from 'react'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ShareIcon from '@mui/icons-material/Share'
import { Divider, Drawer, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { FacebookShareButton, WhatsappShareButton, TelegramShareButton, EmailShareButton } from 'react-share'

const TITLE_SHARE = 'Share Booking fix.glass'

export const ShareQuote: FC<{ url: string }> = ({ url }) => {
  const [show, setShow] = useState(false)
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {})
      .catch((error) => {
        console.error('Error copying to clipboard:', error)
      })
  }
  return (
    <>
      <Box onClick={() => setShow(true)}>
        Service mainpage <ShareIcon />
      </Box>
      <Drawer anchor={'bottom'} open={show} onClose={() => setShow(false)} className='drawer-rounded'>
        <Box sx={{ padding: 5, pt: 10 }}>
          <Typography variant='h5' sx={{ fontSize: 16, mb: 4 }}>
            Share the booking mainpage
          </Typography>
          <Box display={'flex'} gap={2} justifyContent={'space-between'}>
            <EmailShareButton url={url} subject={encodeURIComponent(TITLE_SHARE)} body={encodeURIComponent(url)}>
              <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src='/images/chat.svg' />
                <Box sx={{ mt: 2, fontSize: 12 }}>SMS</Box>
              </Box>
            </EmailShareButton>
            <FacebookShareButton
              title={TITLE_SHARE}
              hashtag='car'
              url={url}
              style={{ display: 'flex', gap: 3, flexDirection: 'column', alignItems: 'center' }}
            >
              <img src='/images/facebook-outline.svg' />
              <Box sx={{ fontSize: 12 }}>Facebook</Box>
            </FacebookShareButton>

            <WhatsappShareButton
              title={TITLE_SHARE}
              url={url}
              style={{ display: 'flex', gap: 3, flexDirection: 'column', alignItems: 'center' }}
            >
              <img src='/images/whatsapp.svg' />
              <Box sx={{ fontSize: 12 }}>Whatsapp</Box>
            </WhatsappShareButton>

            <TelegramShareButton
              title={TITLE_SHARE}
              url={url}
              style={{ display: 'flex', gap: 3, flexDirection: 'column', alignItems: 'center' }}
            >
              <img src='/images/telegram.svg' />
              <Box sx={{ fontSize: 12 }}>Telegram</Box>
            </TelegramShareButton>
          </Box>
        </Box>
        <Divider />
        <Box sx={{ padding: 5, pb: 10 }}>
          <Typography sx={{ fontSize: 14, mb: 4 }} className='text-grey'>
            Main page link
          </Typography>
          <Box display={'flex'} gap={2} justifyContent={'space-between'} alignItems={'center'}>
            <Typography sx={{ fontSize: 14 }} className='text-gray-700'>
              {url}
            </Typography>
            <ContentCopyIcon onClick={() => copyToClipboard(url)} sx={{ color: '#225FC2', width: 16 }} />
          </Box>
        </Box>
      </Drawer>
    </>
  )
}
