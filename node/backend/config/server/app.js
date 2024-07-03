import routes from './routes/formulario_route.js'
import express from 'express';
import cors from 'cors'


const app = express();
const port = 3000;

app.use(cors())
// Middleware para parsear el cuerpo de las solicitudes JSON
app.use(express.json());

// const views_path = join(__dirname, '../../../frontend/views')

// app.set('views', views_path)
// app.set('view engine', 'ejs')

// Ruta básica para la raíz del servidor
// app.get('/', (req, res) => { 
//     res.render('index');
// });

// app.use(express.static(join(__dirname, '../../../frontend/public')));

app.use("/api/", routes)

// Inicia el servidor
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});