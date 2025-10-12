import IndexPage from './Pages/IndexPage';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import Header from './Components/Header';
import Footer from './Components/Footer';
import SettingsPage from './Pages/SettingsPage';
import CreatePage from './Pages/CreatePage';
import ContentPage from './Pages/ContentPage';
import AuthPage from './Pages/AuthPage';

import AuthProvider from './Context/AuthContext';
import NotificationsPage from './Pages/NotificationsPage';
import ArticleView from './Components/ArticleView';
import ScrollProvider from './Context/ScrollContext';
import snail from './Images/snail-logo-green.png'

function App() {
  return (
    <Router>
      <div className='wrapper-app'>
        <div className='logo-place' style={{zIndex: "1000"}}>

          <h2 onClick={() => window.location.href = window.location.origin}>
            Slowreads
          </h2>
          
        </div>
        <AuthProvider>
          <ScrollProvider>
          <Header/>
          <Routes>

            <Route path="/" element={<IndexPage />} />

            <Route path="/content/:filterType?/:filterValue?" element={<ContentPage />}>
              <Route path=":articleId" element={<ArticleView />} />
            </Route>

            <Route path='/settings' element={<SettingsPage />}>
              <Route path=':articleId' element={<ArticleView/>} />
            </Route>

            <Route path='/notifications' element={<NotificationsPage/>}/>
              <Route path=':articleId' element={<ArticleView />} />
            <Route/>

            <Route path='/create' element={<CreatePage />} />
            <Route path='/auth' element={<AuthPage/>}/>
            
          </Routes>
          <Footer/>
          </ScrollProvider>
        </AuthProvider>
      </div>
    </Router>
  );
}

export default App;
