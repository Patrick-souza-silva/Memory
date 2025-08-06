import { useState, useEffect } from 'react';
import {
  Container, Typography, Button, Box, Card, CardMedia,
  CircularProgress, Alert, Grid
} from '@mui/material';

//trocar depois para variavel de ambiente
const SERVER_URL = 'http://localhost:3000'; // altere para seu IP real se testar em rede

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
        background: 'linear-gradient(to bottom right, #f6a4f6ff, #f800dfff)',
        py: 5,
        textAlign: 'center'
      }}>
      <Typography variant="h3"
        gutterBottom
        sx={{
          fontWeight: 700,
          color: '#333',
          textShadow: '1px 1px 3px rgba(0,0,0,0.1)'
        }}>
        Memory 🎉
      </Typography>

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
    </Container>
  );
}

export default App;
