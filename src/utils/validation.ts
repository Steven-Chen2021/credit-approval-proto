import * as yup from 'yup'

export const ownerSchema = yup.object({
  name: yup.string().required(),
  title: yup.string().required(),
  address: yup.string().required(),
  phone: yup.string().required(),
  email: yup.string().email().required(),
  ssnMasked: yup.string().matches(/^\*{4}-\*{2}-\d{4}$/, '****-**-1234').required()
})

export const referenceSchema = yup.object({
  company: yup.string().required(),
  contact: yup.string().required(),
  address: yup.string().required(),
  phone: yup.string().required(),
  fax: yup.string().nullable(),
  website: yup.string().url().nullable(),
  email: yup.string().email().required()
})

export const bankRefSchema = yup.object({
  bank: yup.string().required(),
  contact: yup.string().required(),
  address: yup.string().required(),
  phone: yup.string().required(),
  checkingNoMasked: yup.string().matches(/^\*{3,}\d{4}$/).nullable(),
  savingsNoMasked: yup.string().matches(/^\*{3,}\d{4}$/).nullable(),
  yearsOpen: yup.number().min(0).max(100).nullable()
})
