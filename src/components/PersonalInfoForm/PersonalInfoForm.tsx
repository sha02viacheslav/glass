import React from 'react'
import { Box, CardMedia, FormControl, Grid, InputLabel, OutlinedInput } from '@mui/material'
import { FormikErrors, FormikTouched } from 'formik'
import { FormFieldIds } from '@glass/pages/Customer/Customer'

export type PersonalInfoForm = {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export type PersonalInfoFormProps = {
  errors: FormikErrors<PersonalInfoForm>
  setFieldValue: (
    field: string,
    value: unknown,
    shouldValidate?: boolean | undefined,
  ) => Promise<void | FormikErrors<PersonalInfoForm>>
  touched: FormikTouched<PersonalInfoForm>
  values: PersonalInfoForm
}

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ values, touched, errors, setFieldValue }) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 6 }}>
        <CardMedia
          component='img'
          sx={{ width: 20, height: 20 }}
          image={process.env.PUBLIC_URL + '/images/account.svg'}
          alt='Account'
        />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl id={FormFieldIds.FIRST_NAME} fullWidth>
              <InputLabel>First name*</InputLabel>
              <OutlinedInput
                value={values.firstName}
                label='First name*'
                placeholder='First name*'
                onChange={(e) => setFieldValue(FormFieldIds.FIRST_NAME, e.target.value)}
                error={touched.firstName && !!errors.firstName}
              />
              <small className='form-error'>{touched.firstName && errors.firstName}</small>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl id={FormFieldIds.LAST_NAME} fullWidth>
              <InputLabel>Last name*</InputLabel>
              <OutlinedInput
                value={values.lastName}
                label='Last name*'
                placeholder='Last name*'
                onChange={(e) => setFieldValue(FormFieldIds.LAST_NAME, e.target.value)}
                error={touched.lastName && !!errors.lastName}
              />
              <small className='form-error'>{touched.lastName && errors.lastName}</small>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, marginBottom: 6 }}>
        <CardMedia
          component='img'
          sx={{ width: 20, height: 20 }}
          image={process.env.PUBLIC_URL + '/images/phone-blue.svg'}
          alt='Account'
        />
        <FormControl id={FormFieldIds.PHONE} fullWidth>
          <InputLabel>Phone number*</InputLabel>
          <OutlinedInput
            value={values.phone}
            label='Phone number*'
            placeholder='Phone number*'
            onChange={(e) => setFieldValue(FormFieldIds.PHONE, e.target.value)}
            error={touched.phone && !!errors.phone}
          />
          <small className='form-error'>{touched.phone && errors.phone}</small>
        </FormControl>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, marginBottom: 6 }}>
        <CardMedia
          component='img'
          sx={{ width: 20, height: 20 }}
          image={process.env.PUBLIC_URL + '/images/email-blue.svg'}
          alt='Account'
        />
        <FormControl id={FormFieldIds.EMAIL} fullWidth>
          <InputLabel>E-mail*</InputLabel>
          <OutlinedInput
            value={values.email}
            label='E-mail*'
            placeholder='E-mail*'
            onChange={(e) => setFieldValue(FormFieldIds.EMAIL, e.target.value)}
            error={touched.email && !!errors.email}
          />
          <small className='form-error'>{touched.email && errors.email}</small>
        </FormControl>
      </Box>
    </Box>
  )
}
