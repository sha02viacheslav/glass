import React from 'react'
import { List, ListItem, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { Link } from 'react-router-dom'

const TermsConditions: React.FC = () => {
  return (
    <Box sx={{ px: 4, py: 40 }}>
      <Typography variant='h3' sx={{ fontSize: 24, mb: 4 }}>
        Terms & Conditions
      </Typography>
      <Box sx={{ lineHeight: '24px' }} className='text-gray-700'>
        <Box sx={{ mb: 4 }}>
          Welcome to FixGlass website. By accessing this website, you agree to comply with and be bound by the following
          terms and conditions of use:
        </Box>
        <List sx={{ mb: 6, listStyle: 'auto', pl: 4 }} component='ol'>
          <ListItem>
            <b>Use of Website:</b> The content of the pages of this website is for your general information and use
            only. It is subject to change without notice.
          </ListItem>
          <ListItem>
            <b>Service Information:</b> We strive to provide accurate and up-to-date information regarding our car glass
            repair services. However, we do not guarantee the completeness, accuracy, reliability, or suitability of the
            information and materials found on this website.
          </ListItem>
          <ListItem>
            <b>Booking and Payments:</b> Booking services through our website is subject to availability. Payment terms
            and conditions will be provided during the booking process.
          </ListItem>
          <ListItem>
            <b>Cancellation and Refunds:</b> Cancellation and refund policies vary based on the type of service booked.
            Please refer to our specific cancellation and refund policy for more information.
          </ListItem>
          <ListItem>
            <b>Intellectual Property:</b> This website contains material which is owned by or licensed to us. This
            material includes, but is not limited to, the design, layout, look, appearance, and graphics. Reproduction
            is prohibited without prior written consent.
          </ListItem>
          <ListItem>
            <b>Links to Other Websites:</b> Our website may contain links to other websites. These links are provided
            for your convenience to provide further information. We have no responsibility for the content of the linked
            websites.
          </ListItem>
          <ListItem>
            <b>Privacy Policy:</b> Your use of this website is subject to our Privacy Policy, which governs how we
            collect, use, and protect your personal information.
          </ListItem>
          <ListItem>
            <b>Disclaimer:</b> Your use of any information or materials on this website is entirely at your own risk,
            for which we shall not be liable. It shall be your own responsibility to ensure that any products, services,
            or information available through this website meet your specific requirements.
          </ListItem>
          <ListItem>
            <b>Governing Law:</b> Your use of this website and any dispute arising out of such use is subject to the
            laws of England, Scotland, Wales, or Northern Ireland, depending on your location, and the courts of these
            jurisdictions shall have exclusive jurisdiction.
          </ListItem>
        </List>
        <Box sx={{ mb: 6 }}>
          By continuing to use this website,{' '}
          <b>you acknowledge that you have read, understood, and agreed to these terms and conditions.</b>
        </Box>
        <Box>
          Have any questions?{' '}
          <Link to='/contact' className='text-gray-700'>
            <b>Contact us</b>
          </Link>
        </Box>
      </Box>
    </Box>
  )
}

export default TermsConditions
