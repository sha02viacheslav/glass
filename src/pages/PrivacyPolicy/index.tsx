import React, { useMemo } from 'react'
import { List, ListItem, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { Link } from 'react-router-dom'
import './style.css'

const PrivacyPolicy: React.FC = () => {
  const items = useMemo(
    () =>
      [
        {
          title: 'Information We Collect',
          content: [
            'Personal Information (e.g., name, contact details) provided by you',
            'Technical information (e.g., IP address, browser type) collected automatically',
            'Other information related to your use of our services',
          ],
        },
        {
          title: 'How We Use Your Information',
          content: [
            'To provide and maintain our car glass repair services',
            'To communicate with you regarding bookings, updates, and promotions',
            'To improve our website and services based on your feedback',
          ],
        },
        {
          title: 'Cookies and Tracking Technologies',
          content: [
            'We use cookies and similar technologies to enhance your browsing experience',
            'These technologies help us analyze website traffic, customize content, and show relevant ads',
            'You can manage your cookie preferences through your browser settings',
          ],
        },
        {
          title: 'Data Sharing and Disclosure',
          content: [
            'We may share your information with third-party service providers for business purposes (e.g., payment processing, analytics)',
            'Your information may be disclosed if required by law or to protect our legal rights',
          ],
        },
        {
          title: 'Data Retention',
          content: [
            'We retain your personal information as long as necessary for the purposes outlined in this policy',
            'You can request deletion of your information as per your rights (see Section 6)',
          ],
        },
        {
          title: 'Your Rights',
          content: [
            'You have the right to access, update, or delete your personal information',
            'You can opt-out of marketing communications at any time',
            'Contact us (see Section 9) to exercise your rights or for inquiries about your data',
          ],
        },
        {
          title: 'Security Measures',
          content: [
            'We implement security measures to protect your information from unauthorized access or disclosure',
            'However, no method of transmission over the internet or electronic storage is 100% secure',
          ],
        },
        {
          title: 'Changes to This Policy',
          content: [
            'We may update this privacy and cookies policy periodically',
            'Any changes will be reflected on this page, and we may notify you via email or website notice',
          ],
        },
      ].map((el, index) => ({ ...el, _id: index + 1, id: el.title.replace(/\s/g, '_').toLowerCase() })),
    [],
  )
  return (
    <Box className='container'>
      <Box sx={{ py: { xs: 40, lg: 65 }, maxWidth: 780 }}>
        <Typography variant='h3' sx={{ fontSize: { xs: 24, lg: 60 }, lineHeight: '130%', mb: { xs: 5, lg: 12 } }}>
          Privacy & Cookies policy
        </Typography>
        <Typography variant='h5' sx={{ color: 'var(--WF-Base-800, #2D3648)', fontSize: { xs: 14, lg: 24 }, mb: 0 }}>
          TABLE OF CONTENTS
        </Typography>
        <Box sx={{ lineHeight: '24px' }}>
          <List sx={{ mb: 6, listStyle: 'auto', pl: 4 }} component='ol'>
            {items.map((item) => (
              <ListItem key={item._id} sx={{ color: 'var(--WF-Base-700, #4A5468)', fontSize: { xs: 16, lg: 20 } }}>
                <a href={`#${item.id}`} className='text-decoration-none text-base-700'>
                  {item.title}
                </a>
              </ListItem>
            ))}
          </List>
          <Box className='text-base-800 mt-5'>
            {items.map((item) => (
              <Box key={item._id} id={item.id} className='anchor'>
                <Typography
                  variant='h5'
                  sx={{ color: 'var(--WF-Base-800, #2D3648)', fontSize: { xs: 14, lg: 20 }, mb: 3 }}
                >
                  {item._id}. <span className='text-uppercase'>{item.title}</span>
                </Typography>
                <List sx={{ mb: 6, listStyle: 'disc', pl: 8 }}>
                  {item.content.map((el, idx) => (
                    <ListItem
                      key={idx}
                      sx={{ color: 'var(--WF-Base-700, #4A5468)', py: { xs: 0, lg: 1 }, fontSize: { xs: 16, lg: 20 } }}
                    >
                      {el}
                    </ListItem>
                  ))}
                </List>
              </Box>
            ))}
          </Box>
          <Box sx={{ color: 'var(--WF-Base-700, #4A5468)', fontSize: { xs: 16, lg: 20 } }}>
            Have any questions?{' '}
            <Link to='/contact' className='text-gray-700'>
              <b>Contact us</b>
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default PrivacyPolicy
