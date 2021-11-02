import express from 'express'
const router = express.Router()
import {
    authAdmin,
    registerAdmin,
    recoverPassword,
    verifyRecoverCode,
    resetPassword
  } from '../controllers/authController.js'

  router.post('/adminRegister', registerAdmin)
  router.post('/adminAuth', authAdmin)
  router.post('/adminRecoverPassword', recoverPassword)
  router.post('/adminverifyRecoverCode', verifyRecoverCode)
  router.post('/adminresetPassword', resetPassword)


  
  

  export default router
