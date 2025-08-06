const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Habilita CORS
app.use(cors());

// Cria a pasta de uploads se não existir
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configura o multer para salvar as imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

// Rota de upload
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado' });

  res.json({
    message: 'Imagem enviada com sucesso!',
    fileName: req.file.filename,
    path: `/uploads/${req.file.filename}`
  });
});

// Rota de Listagem
app.get('/images', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao ler os arquivos' });
    }

    // Retorna apenas arquivos de imagem (por segurança)
    const imageFiles = files.filter(file =>
      /\.(jpg|jpeg|png|webp|gif)$/i.test(file)
    );

    res.json(imageFiles);
  });
});


// Servir imagens diretamente
app.use('/uploads', express.static(uploadDir));

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://212.85.1.39:${PORT}`);
});
