import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Box, Container, TextField, Button, Typography, Paper, Snackbar } from '@mui/material'
import MuiAlert from '@mui/material/Alert'
import { useFirebase } from '../firebase/FirebaseContext'

function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useFirebase()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    city: '',
    district: '',
    neighborhood: '',
    address: ''
  })
  const [errors, setErrors] = useState({})
  const [openSnackbar, setOpenSnackbar] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    let newValue = value
    
    if (name === 'phone' && value) {
      newValue = value.startsWith('0') ? value : '0' + value
      newValue = newValue.slice(0, 11)
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}

    if (formData.password.length < 6 || formData.password.length > 20) {
      newErrors.password = 'Şifre 6-20 karakter arasında olmalıdır'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Geçerli bir email adresi giriniz'
    }

    const phoneRegex = /^0[0-9]{10}$/
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Geçerli bir telefon numarası giriniz (0 ile başlayan 11 haneli numara)'
    }

    Object.keys(formData).forEach(key => {
      if (!formData[key]) {
        newErrors[key] = 'Bu alan zorunludur'
      }
    })

    // Add password length validation
    if (formData.password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalıdır';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Add logging here to check email and password before calling register
    console.log("Attempting to register with:", { email: formData.email, password: formData.password });

    try {
      const { email, password, ...userData } = formData
      // Ensure email and password are valid strings before calling register
      if (typeof email !== 'string' || typeof password !== 'string') {
         console.error("Invalid email or password type:", { email, password });
         setErrors({ submit: 'Geçersiz email veya şifre formatı.' });
         return;
      }
      await register(email, password, {
        ...userData,
        role: 'user'
      })

      setOpenSnackbar(true)
      setTimeout(() => {
        navigate('/login')
      }, 2000)
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        city: '',
        district: '',
        neighborhood: '',
        address: ''
      })
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setErrors({ email: 'Bu email adresi zaten kayıtlı' });
      } else if (error.code === 'auth/weak-password') {
        setErrors({ password: 'Şifre yeterince güçlü değil (en az 6 karakter olmalı)' });
      } else {
        console.error('Registration Error:', error); // Log the full error for debugging
        let errorMessage = 'Kayıt sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
        if (error.message) {
          errorMessage = `Kayıt sırasında bir hata oluştu: ${error.message}`;
        }
        // Add more specific Firebase error handling if needed
        if (error.code === 'auth/network-request-failed') {
          errorMessage = 'Ağ bağlantısı hatası. Lütfen internet bağlantınızı kontrol edin.';
        } else if (error.code === 'auth/too-many-requests') {
          errorMessage = 'Çok fazla deneme yapıldı. Lütfen daha sonra tekrar deneyin.';
        } else if (error.code && error.code.startsWith('auth/')) {
          // Generic auth error
          errorMessage = `Kimlik doğrulama hatası: ${error.message}`;
        } 
        // For Firestore permission errors, the initial console log from FirebaseContext should give more details.
        // The error reaching here might be a generic one if not caught specifically by Firebase rules.

        setErrors({ submit: errorMessage });
      }
    }
  }

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Kayıt Ol
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="firstName"
              label="Ad"
              name="firstName"
              autoFocus
              value={formData.firstName}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="lastName"
              label="Soyad"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-posta Adresi"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Şifre"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password || '6-20 karakter arası olmalıdır'}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="phone"
              label="Telefon Numarası"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone || '11 haneli telefon numarası (0 ile başlar)'}
              inputProps={{ maxLength: 11 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="city"
              label="İl"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="district"
              label="İlçe"
              name="district"
              value={formData.district}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="neighborhood"
              label="Mahalle"
              name="neighborhood"
              value={formData.neighborhood}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="address"
              label="Açık Adres"
              name="address"
              value={formData.address}
              onChange={handleChange}
              multiline
              rows={3}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Kayıt Ol
            </Button>
            <Typography align="center">
              Zaten hesabınız var mı?{' '}
              <Link to="/" style={{ textDecoration: 'none' }}>
                Giriş Yap
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
      <Snackbar open={openSnackbar} autoHideDuration={2000} onClose={handleCloseSnackbar}>
        <MuiAlert elevation={6} variant="filled" severity="success">
          Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...
        </MuiAlert>
      </Snackbar>
    </Container>
  )
}

export default RegisterPage