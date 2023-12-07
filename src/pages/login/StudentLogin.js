import React, { useEffect, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import axios from 'axios'
import { Box } from '@mui/system'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Icon, IconButton, InputAdornment, Typography } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import Divider from '@mui/material/Divider'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import Link from 'next/link'

// ** Form
import { Controller, useForm } from 'react-hook-form'
import { useRouter } from 'next/router'

import Modal from '@mui/material'

export default function QrCodeScanner() {
  const [isPinVisible, setPinVisible] = useState(true)
  const [isPasswordVisible, setPasswordVisible] = useState(false)

  const theme = useTheme()

  const auth = useAuth()

  const router = useRouter()
  const [scanResult, setScanResult] = useState(null)
  const [data, setData] = useState([])
  const [showPassword, setShowPassword] = useState(false)
  const [succ, setSucc] = useState(false)
  const [error, setError] = useState(null)

  const LoginIllustration = styled('img')(({ theme }) => ({
    zIndex: 2,
    maxWidth: 125
  }))

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250
      },
      fps: 5
    })

    scanner.render(success, error)
    function success(result) {
      console.log('student login check', result)
      scanner.clear()
      setScanResult(result)
      axios
        .get(`${process.env.NEXT_PUBLIC_BASE_URL}api/GetUserInfoByUserId?UserId=${result}`)
        .then(response => setData(response.data))

      //   alert('Get Lol')
    }

    function error(err) {
      console.warn(err)
    }
  }, [])

  function handlePasswordReset() {
    setPinVisible(false)
    setPasswordVisible(true)
  }

  function pinHandler(x) {
    console.log('student pin check', x)
    const val = Number(x.target.value)
    if (val === data.PIN) {
      setSucc(true)
      const { email, password } = data

      auth.login({ email, password }, () => {
        setError('email', {
          type: 'manual',
          message: 'Email or Password is invalid'
        })
      })
    } else {
      setSucc(false)
      setError({
        type: 'manual',
        message: (
          <span>
            Incorrect PIN.{' '}
            <span style={{ color: '#12A3EA', cursor: 'pointer' }} onClick={handlePasswordReset}>
              Click Here
            </span>
            &nbsp;to RESET your password.
          </span>
        )
      })
    }
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    mode: 'onSubmit'
  })

  const userId = data.userId
  const memberId = data.memberId

  const handleSubmitPINreset = async e => {
    e.preventDefault()
    const formData = new FormData(e.target)
    formData.append('userId', userId)
    formData.append('memberId', memberId)
    formData.append('password', password)

    const PIN = formData.get('PINreset')

    var pData = {
      userId: userId,
      PIN: PIN,
      password: password,
      memberId: memberId
    }

    console.log(pData)
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}api/User/PINPassword`, pData) // Replace '/api/your-endpoint' with your API endpoint
      // Handle successful response
      console.log('Response:', response.data)
      router.replace('/')
    } catch (error) {
      // Handle error
      console.error('Error:', error)
      window.alert('An error occurred. Please try again later.')
    }
  }

  const passwordCheck = watch('passwordCheck', '')

  const { handleSubmit: passwordCheckHandler } = useForm({
    mode: 'onSubmitPass'
  })
  const [isResetPIN, setResetPIN] = React.useState(false)

  const [isPassError, setPassError] = useState(false)
  const passCheck = data.password

  const onSubmitPass = data => {
    if (passwordCheck === passCheck) {
      setResetPIN(true)
      setPasswordVisible(false)
      setPassError(false)
    } else {
      setError({
        type: 'manual',
        messagePass: (
          <span style={{ marginTop: '0px' }}>
            Incorrect Password.{' '}
            <span style={{ color: '#12A3EA', cursor: 'pointer' }} onClick={handleOpen}>
              Click Here
            </span>
            &nbsp;to RESET your password.
          </span>
        )
      })
      setPassError(true)
    }
  }
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const { handleSubmit: handlePinSubmit } = useForm({
    mode: 'onPinSubmit'
  })

  const password = data.password
  const onPinSubmit = dataPIN => {
    const updatePIN = {
      password: password,
      PIN: dataPIN.PINreset,
      UserId: userId,
      memberId: memberId
    }

    console.log('updatePIN ===> ', updatePIN)

    updatePin(updatePIN)
  }

  const updatePin = async param => {
    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')

    // myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

    const requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: JSON.stringify(param),
      redirect: 'follow'
    }

    console.log(requestOptions)

    const res = await fetch(my_url, requestOptions)
    const data = await res.json()
    if (res.ok) {
      // dispatch(usersList(userDispatch))
      // setShow(false)
      // toggle(true)
      console.log('Turza PIN Okay')
      router.replace('/')

      return { ok: true, data }
    } else {
      console.log('Turza PIN Not Okay')
      console.log('ERROR => ', data.error)

      return { ok: false, err: res, data }
    }
  }

  return (
    <>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          position: 'relative',
          alignItems: 'center',
          borderRadius: '20px',
          justifyContent: 'center',
          margin: theme => theme.spacing(8, 8, 0, 8)
        }}
      >
        <LoginIllustration alt='login-illustration' src={`/images/pages/studentLogin.png`} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <h2>Student Login with QR Code</h2>
      </Box>

      {scanResult ? (
        <>
          {data.userId === scanResult && !succ ? (
            <div>
              {data.userstatus === 'NEW' ? (
                <div>
                  <h4>Please set up the PIN and password to continue..</h4>

                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                      name='PIN'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          sx={{ mb: 4 }}
                          label='PIN'
                          onChange={onChange}
                          type={showPassword ? 'text' : 'password'}
                          error={Boolean(errors.PIN)}
                          {...(errors.PIN && { helperText: errors.PIN.message })}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position='end'>
                                <IconButton
                                  edge='end'
                                  onMouseDown={e => e.preventDefault()}
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  <Icon
                                    fontSize='1.25rem'
                                    fontColor='black'
                                    icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'}
                                  />
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                        />
                      )}
                    />

                    <Controller
                      name='password'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          sx={{ mb: 4 }}
                          label='Password'
                          onChange={onChange}
                          type={showPassword ? 'text' : 'password'}
                          error={Boolean(errors.password)}
                          {...(errors.password && { helperText: errors.password.message })}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position='end'>
                                <IconButton
                                  edge='end'
                                  onMouseDown={e => e.preventDefault()}
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  <Icon
                                    fontSize='1.25rem'
                                    fontColor='black'
                                    icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'}
                                  />
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                        />
                      )}
                    />
                    <Button type='submit' variant='contained'>
                      Set PIN & Password
                    </Button>
                  </form>
                </div>
              ) : (
                <Box sx={{ mb: 1.5 }}>
                  {isPinVisible && (
                    <CustomTextField
                      fullWidth
                      label='PIN'
                      rules={{ required: true }}
                      onChange={pinHandler}
                      id='auth-login-v2-password'
                      type={showPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onMouseDown={e => e.preventDefault()}
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              <Icon fontSize='1.25rem' icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )}

                  {isPinVisible && error && <p style={{ color: 'red' }}>{error.message}</p>}
                  <form onSubmit={passwordCheckHandler(onSubmitPass)}>
                    {isPasswordVisible && (
                      <Controller
                        name='passwordCheck'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <CustomTextField
                            fullWidth
                            value={value}
                            sx={{ mb: 4 }}
                            label='Password'
                            onChange={onChange}
                            type={showPassword ? 'text' : 'password'}
                            error={Boolean(errors.password)}
                            {...(errors.password && { helperText: errors.password.message })}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position='end'>
                                  <IconButton
                                    edge='end'
                                    onMouseDown={e => e.preventDefault()}
                                    onClick={() => setShowPassword(!showPassword)}
                                  >
                                    <Icon
                                      fontSize='1.25rem'
                                      fontColor='black'
                                      icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'}
                                    />
                                  </IconButton>
                                </InputAdornment>
                              )
                            }}
                          />
                        )}
                      />
                    )}

                    {isPassError && error && <p style={{ color: 'red', marginTop: '0px' }}>{error.messagePass}</p>}

                    {isPasswordVisible && (
                      <Button type='submit' variant='contained'>
                        Continue with Password
                      </Button>
                    )}
                  </form>
                </Box>
              )}
            </div>
          ) : (
            <div>
              <Alert severity='warning'>
                <AlertTitle>QR Code doesn't match!</AlertTitle>
                <Link href='/'>Click Here</Link>
                &nbsp; to try again..
              </Alert>
              {/* <b>
                LOGIN SUCCESS {data.userid}. <br /> Please wait, we are validating your data.
              </b> */}
            </div>
          )}
        </>
      ) : (
        <div style={{ position: ' relative ', width: ' 100% ', maxWidth: ' 600px ', margin: ' 0 auto ' }}>
          <div
            style={{
              position: 'absolute ',
              top: '2px',
              left: '4px',
              width: '98% ',
              height: '21px ',
              backgroundColor: '#ffffff ',
              zIndex: '3'
            }}
          ></div>

          {/* <div id='reader'  style={{position: "relative", padding: "10px", border: "1px solid #ccc", width: "100%", maxWidth: "600px", margin: "0 auto", { #reader__dashboard_section { display:"none" } }}}></div> */}
          <div id='reader'></div>
        </div>
      )}

      {/* <Divider>
        <Button fullWidth type='submit' variant='contained' sx={{ mb: 4 }}>
          Login
        </Button>
      </Divider> */}

      {isResetPIN && (
        <form onSubmit={handleSubmitPINreset}>
          <CustomTextField
            name='PINreset'
            autoFocus
            fullWidth
            sx={{ mb: 4 }}
            label='Reset PIN'
            type={showPassword ? 'text' : 'password'}
            error={Boolean(errors.PINreset)}
            {...(errors.PINreset && { helperText: errors.PINreset.message })}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    edge='end'
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <Icon fontSize='1.25rem' fontColor='black' icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Button type='submit' variant='contained'>
            Reset PIN
          </Button>
        </form>
      )}

      {open && (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              <Alert severity='warning'>
                <AlertTitle>Please contact with Program Admin to RESET your Password.</AlertTitle>
              </Alert>
            </DialogContentText>
          </DialogContent>
          <DialogActions className='dialog-actions-dense'>
            <Button variant='outlined' onClick={handleClose}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  )
}
