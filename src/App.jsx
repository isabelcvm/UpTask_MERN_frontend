import { BrowserRouter, Routes, Route } from 'react-router-dom'
//Providers
import { AuthProvider } from './context/AuthProvider'
import { ProyectosProvider } from './context/ProyectoProvider'
//Layouts
import AuthLayout from './layouts/AuthLayout'
import RutasProtegidas from './layouts/RutasProtegidas'
//Pages
import ConfirmarCuenta from './pages/confirmarCuenta'
import Login from './pages/login'
import NuevoPassword from './pages/NuevoPassword'
import OlvidePassword from './pages/OlvidePassword'
import Proyectos from './pages/Proyectos'
import Registrar from './pages/Registrar'
import NuevoProyecto from './pages/NuevoProyecto'
import Proyecto from './components/Proyecto'
import EditarProyecto from './pages/EditarProyecto'
import NuevoColaborador from './pages/NuevoColaborador'

function App() {
  return (
    <BrowserRouter basename='/UpTask_MERN_frontend/'>
      <AuthProvider>
        <ProyectosProvider>
        <Routes>
          <Route path='/' element={<AuthLayout />}>
            <Route index element={<Login />} />
            <Route path='registrar' element={<Registrar />} />
            <Route path='olvide-password' element={<OlvidePassword />} />
            <Route path='olvide-password/:token' element={<NuevoPassword />} />
            <Route path='confirmar/:id' element={<ConfirmarCuenta />} />
          </Route>
          <Route path='/proyectos' element={ <RutasProtegidas/> }>
            <Route index element={<Proyectos/> } />
            <Route path='nuevo-colaborador/:id' element={ <NuevoColaborador/>} />
            <Route path='crear-proyecto' element={ <NuevoProyecto/> } />
            <Route path=':id' element={ <Proyecto /> } />
            <Route path='editar/:id' element={ <EditarProyecto /> } />
          </Route>
        </Routes>
        </ProyectosProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
/* Todas las rutas que tengas el routing dinamico deben ir hacia el final */

export default App
