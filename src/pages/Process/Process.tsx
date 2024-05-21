import React, { useMemo } from 'react'
import { Box, Typography } from '@mui/material'
import { ProcessCard } from './ProcessCard'

export const Process: React.FC = () => {
  const helpItems = useMemo(
    () => [
      {
        id: 'our-process',
        title: 'Our Process',
        cards: [
          {
            title: 'How you can drive after only 60 minutes we changed the glass?',
            content: [
              {
                text: 'During the glass replacement process, we utilize premium Sika Drive glue, which ensures safe driving just 60 minutes after application.',
              },
              {
                text: 'This glue undergoes rigorous crash testing to guarantee its reliability. For more insight, view crash test video',
              },
              {
                text: 'Sika Drive glue crash test',
                video: 'https://www.youtube.com/embed/aqz-KE-bpKQ',
              },
            ],
          },
          {
            title: 'Why we use specially designed curved Non-scratch blade for cutting of the old glue?',
            content: [
              {
                text: '1. Curved Shape: The curved shape of the blade allows for better control and maneuverability when cutting. It provides a more ergonomic grip and allows for precise cutting along curved or intricate surfaces.',
              },
              {
                text: '2. Non-Scratch Blade: The non-scratch blade is designed to minimize the risk of scratching or damaging the underlying surface or material. It is typically made from materials that are softer or less abrasive than the surface being worked on. This helps protect the integrity and appearance of the material while removing the glue.',
              },
              {
                text: "3. Efficient Cutting: The blade's sharpness and curved shape make it efficient at cutting through old glue. It allows for effective removal of the adhesive without excessive force or repeated attempts, saving time and effort.",
              },
              {
                text: '4. Versatility: The curved non-scratch blade is often designed for multi-purpose use, making it suitable for various applications beyond glue removal. It can be used for tasks such as scraping, trimming, or shaping different materials.',
              },
            ],
          },
          {
            title: 'How we are able to work mobile and even in the dark?',
            content: [
              {
                text: '1. Mobile Devices: Mobile devices such as smartphones and tablets have become extremely powerful and versatile. They are equipped with high-resolution screens, fast processors, ample storage, and various connectivity options. These devices allow us to access a wide range of applications, tools, and services on the go, enabling productivity regardless of location.',
              },
              {
                text: '2. Portability: Mobile devices are lightweight and portable, allowing us to carry them with us wherever we go. This portability makes it convenient to work while traveling, commuting, or in different work environments.',
              },
            ],
          },
          {
            title: 'What are the characteristics of the replaced glass?',
            content: [
              {
                text: 'Transparency: Glass is typically transparent or translucent, allowing light to pass through. It provides clarity and visibility, making it suitable for applications such as windows, display panels, or lenses.',
              },
              {
                text: 'Strength and Durability: Replaced glass should possess sufficient strength and durability to withstand environmental conditions and potential impacts. The specific type of glass chosen will depend on the required level of strength, such as tempered glass for added toughness or laminated glass for improved safety.',
              },
            ],
          },
        ],
      },
      {
        id: 'payment-methods',
        title: 'Payment methods',
        cards: [
          {
            title: 'How online payments work?',
            content: [
              {
                text: '1. Selection of Payment Method: The buyer selects a preferred payment method during the online checkout process. Common payment methods include credit or debit cards, digital wallets (e.g., PayPal, Stripe), bank transfers, or cryptocurrencies.',
              },
              {
                text: '2. Payment Authorization: The payment details, such as the card number, expiry date, CVV, or login credentials for digital wallets, are entered by the buyer and securely transmitted to the payment processor.',
              },
            ],
          },
          {
            title: 'How does installments works?',
            content: [
              {
                text: 'Installments allow consumers to split the cost of a purchase into multiple smaller payments over a specified period of time. This payment method provides flexibility and affordability for buyers, especially for larger or more expensive items.',
              },
              {
                text: "It's important for buyers to carefully review the terms and conditions of the installment plan, including any interest rates, fees, and consequences for missed or late payments. Different payment providers or merchants may have variations in their installment processes, so it's essential to understand the specific terms before committing to an installment payment option.",
              },
            ],
          },
          {
            title: 'How does pay in cash works?',
            content: [
              {
                text: 'Paying in cash is a straightforward and traditional method of making a payment. It involves exchanging physical currency, such as banknotes or coins, directly between the buyer and the seller. ',
              },
            ],
          },
        ],
      },
      {
        id: 'insurance-and-warranty',
        title: 'Insurance and warranty',
        cards: [
          {
            title: 'Why we offer lifetime warranty if you own the car?',
            content: [
              {
                text: "1. Product Confidence: A lifetime warranty on a car demonstrates the manufacturer's confidence in the quality of their product. It assures customers that the company stands behind the reliability and durability of the vehicle.",
              },
              {
                text: '2. Competitive Advantage: Offering a lifetime warranty can differentiate a car manufacturer or seller from competitors. It can be seen as a value-added feature that attracts customers and builds brand loyalty.',
              },
              {
                text: '3. Customer Satisfaction and Peace of Mind: A lifetime warranty provides customers with peace of mind, knowing that certain components or systems of their vehicle will be covered for an extended period. It can enhance customer satisfaction and instill trust in the brand.',
              },
            ],
          },
          {
            title: 'Why we don’t work with the insurance companies?',
            content: [
              {
                text: '1. Administrative Complexity: Working with insurance companies often involves navigating complex administrative processes, such as submitting claims, providing documentation, and following specific procedures. Some businesses or individuals may prefer to avoid the administrative burden associated with dealing with insurance companies directly.',
              },
              {
                text: '2. Delayed Payments: Insurance companies can sometimes take time to process and approve claims, which can result in delayed payments. Businesses or individuals may prefer to receive immediate payment for their products or services rather than waiting for reimbursement from the insurance company.',
              },
              {
                text: '3. Contractual Limitations: Working with insurance companies often requires entering into contractual agreements, which may include specific terms and conditions. Some businesses or individuals may choose not to enter into such agreements or may have concerns about the requirements or limitations imposed by insurance contracts.',
              },
            ],
          },
        ],
      },
      {
        id: 'glass-result',
        title: 'Insurance and warranty',
        cards: [
          {
            title: 'New glass is clearly little different right?',
            content: [
              {
                text: 'Yes, new glass can indeed have differences compared to older or different types of glass.',
              },
              {
                text: '1. Composition: Glass can be made from various materials, such as silica (sand), soda ash, limestone, and other additives. Different compositions can result in variations in properties like transparency, strength, thermal conductivity, and resistance to chemicals.',
              },
              {
                text: '2. Manufacturing Techniques: Glass manufacturing techniques have evolved over time, leading to advancements in quality and efficiency. Modern processes may involve methods like float glass, which produces smooth and uniform sheets of glass, or specialized techniques like tempered or laminated glass for enhanced strength and safety.',
              },
            ],
          },
          {
            title: 'Is the black edge of the glass same?',
            content: [
              {
                text: 'The black edge of glass, also known as the ceramic frit, is a decorative element that is often applied to the edges of automotive and architectural glass.',
              },
              {
                text: 'It serves several purposes, including aesthetics, enhancing durability, and providing a visual transition between the glass surface and the surrounding frame. However, the appearance and characteristics of the black edge can vary depending on factors such as the manufacturing process, intended application, and specific product design. ',
              },
            ],
          },
          {
            title: 'Will water leak after replacement?',
            content: [
              {
                text: 'The potential for water leaks after glass replacement depends on various factors, including the quality of the replacement process, the condition of the surrounding seals and weatherstripping, and the specific design and installation of the glass.',
              },
            ],
          },
          {
            title: 'Is the mirror going to be put back on?',
            content: [
              {
                text: 'When replacing automotive glass, such as a windshield, side window, or rear window, the decision to reinstall the mirror depends on several factors.',
              },
              {
                text: '1. Mirror Removal: In many cases, the mirror attached to the glass needs to be removed before the glass replacement process. This is typically done to ensure safe and proper removal of the old glass and installation of the new one.',
              },
              {
                text: '2. Mirror Attachment Method: The method used to attach the mirror to the glass can vary. Some mirrors are affixed using adhesive pads, while others may have a metal bracket or housing that attaches to the glass. The specific attachment method will determine whether the mirror can be easily reattached or if additional steps are required.',
              },
              {
                text: '3. Mirror Condition: If the mirror is in good condition and undamaged, it can usually be reinstalled after the glass replacement. However, if the mirror is cracked, broken, or otherwise damaged, it may need to be replaced with a new one.',
              },
              {
                text: '4. Compatibility: The replacement glass should be compatible with the mirror attachment method and design. This ensures a proper fit and secure attachment of the mirror to the glass.',
              },
              {
                text: "5. Additional Services: Some glass replacement services may offer mirror reattachment as part of their service, while others may require it to be done separately. It's recommended to check with the glass replacement provider to understand their specific procedures and whether mirror reinstallation is included or requires an additional service.",
              },
            ],
          },
        ],
      },
    ],
    [],
  )

  return (
    <Box>
      <Box sx={{ py: { xs: 20, lg: 32 } }}></Box>

      <Box
        sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', lg: 'center' } }}
        className='container'
      >
        <Box
          sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', lg: 'center' } }}
          className='page-header'
        >
          <Typography
            sx={{
              color: 'var(--Light-Blue---Primary-600, #133f85)',
              fontSize: { xs: 12, lg: 16 },
              lineHeight: { xs: '130%', lg: '125%' },
              letterSpacing: { xs: '0.84px', lg: '1.12px' },
              textTransform: 'uppercase',
            }}
          >
            More about our process
          </Typography>
          <Typography
            sx={{
              textAlign: { xs: 'left', lg: 'center' },
              fontSize: { xs: 24, lg: 72 },
              fontWeight: 700,
              lineHeight: { xs: '130%', lg: '110%' },
              marginTop: { xs: 4, lg: 8 },
              maxWidth: 962,
            }}
          >
            Explore Our Glass Repair Process: Learn About How We Work!
          </Typography>
          <Typography
            sx={{
              textAlign: { xs: 'left', lg: 'center' },
              color: 'var(--Gray-600, #6a6b71)',
              fontSize: { xs: 16, lg: 30 },
              lineHeight: { xs: '170%', lg: '160%' },
              marginTop: { xs: 3, lg: 6 },
              maxWidth: 704,
            }}
          >
            Below, we&apos;ve simplified our approach into bite-sized answers to common questions. Tap each question to
            reveal more about how we work.
          </Typography>
        </Box>

        <Box sx={{ p: { xs: 6, lg: 12 } }}></Box>

        <Box sx={{ maxWidth: 704 }}>
          {helpItems.map((help) => (
            <Box key={help.id} id={help.id} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 10 }}>
              <Typography sx={{ fontSize: '20px', fontWeight: 700, lineHeight: '130%', marginBottom: '8px' }}>
                {help.title}
              </Typography>
              {help.cards.map((q, qIdx) => (
                <ProcessCard title={q.title} key={qIdx}>
                  {q.content.map((content, cIdx) => (
                    <Box key={cIdx}>
                      <Box sx={{ mb: content.video ? 0 : 4, fontWeight: content.video ? 'bold' : 'normal' }}>
                        {content.text}
                      </Box>
                      {content.video && (
                        <iframe
                          width='100%'
                          height='315'
                          src={content.video}
                          title='YouTube Video'
                          frameBorder='0'
                          allowFullScreen
                        ></iframe>
                      )}
                    </Box>
                  ))}
                </ProcessCard>
              ))}
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ p: { xs: 16, lg: 25 } }}></Box>
    </Box>
  )
}
