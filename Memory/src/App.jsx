import { useState, useEffect } from 'react';
import {
  Container, Typography, Button, Box, Card, CardMedia,
  CircularProgress, Alert, Grid, Link
} from '@mui/material';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:4000';

function App() {
  const [isUploading, setIsUploading] = useState(false);
  
  const [uploadResult, setUploadResult] = useState(null);
  const [images, setImages] = useState([]);

  const fetchImages = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/images`);
      const files = await res.json();
      setImages(files);
    } catch (err) {
      console.error('Erro ao buscar imagens:', err);
    }
  };

  useEffect(() => {
    fetchImages(); // busca as imagens ao carregar a página
  }, []);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (file && file.type.startsWith('image/')) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        setIsUploading(true);
        const response = await fetch(`${SERVER_URL}/upload`, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          setUploadResult({ success: true, message: 'Imagem enviada com sucesso!' });
          fetchImages(); // Atualiza galeria após o upload
        } else {
          setUploadResult({ success: false, message: data.error || 'Erro no upload' });
        }
      } catch (error) {
        setUploadResult({ success: false, message: error.message });
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <Container maxWidth="false"
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #f6a4f6ff, #c500b2ff)',
        py: 5,
        textAlign: 'center'
      }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          mb: 2
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: '#333',
            textShadow: '1px 1px 3px rgba(0,0,0,0.1)'
          }}
        >
          Memory
        </Typography>
        <img
          src="Logo-memory.png"
          alt="Memory Logo"
          style={{
            width: '100px', // pode ajustar
            height: 'auto'
          }}
        />
      </Box>
      <Button variant="contained"
        color="secondary"
        sx={{
          px: 4,
          py: 1.5,
          fontWeight: 'bold',
          borderRadius: 3,
          boxShadow: 3,
          textTransform: 'none',
          mt: 2
        }}
        component="label"
        disabled={isUploading}>
        Adicionar Foto
        <input hidden accept="image/*" type="file" onChange={handleFileChange} />
      </Button>

      {isUploading && <CircularProgress sx={{ mt: 2 }} />}

      {uploadResult && (
        <Alert severity={uploadResult.success ? 'success' : 'error'} sx={{ mt: 2 }}>
          {uploadResult.message}
        </Alert>
      )}

      <Box mt={10}>
        <Grid container spacing={2} justifyContent="center">
          {[...images].reverse().map((fileName) => (
            <Grid item xs={12} sm={6} md={5} key={fileName}>
              <Card
                sx={{
                  width: '90vw',
                  maxWidth: 600,
                  borderRadius: 4,
                  boxShadow: 6,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                    borderRadius: 2
                  }}
                  image={`${SERVER_URL}/uploads/${fileName}`}
                  alt={fileName}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box component="footer" sx={{ mt: 6, py: 2, bgcolor: 'rgba(0,0,0,0.1)' }}>
        <Typography variant="body2" color="text.secondary">
          Desenvolvido por{' '}
          <Link
            href="https://www.instagram.com/fortysoft"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            sx={{ fontWeight: 'bold' }}
          >
            FortySoft
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}

export default App;
