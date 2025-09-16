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

function App() {
  return (
    <Router>
      <div className='wrapper-app'>
        <div className='logo-place' style={{zIndex: "1000"}}>
          <h2 style={{cursor: "pointer"}} onClick={() => window.location.href = window.location.origin}>
            Planetarium
          </h2>
        </div>
        <AuthProvider>
          <ScrollProvider>
          <Header/>
          <Routes>
            {/* Landingpage */}
            <Route path="/" element={<IndexPage />} />

            {/* For Contentpage */}
            <Route path="/content/:filterType?/:filterValue?" element={<ContentPage />}>
              <Route path=":articleId" element={<ArticleView />} />
            </Route>

            {/* Settingspage */}
            <Route path='/settings' element={<SettingsPage />}>
              <Route path=':articleId' element={<ArticleView/>} />
            </Route>

            {/* Notifications */}
            <Route path='/notifications' element={<NotificationsPage/>}/>
              <Route path=':articleId' element={<ArticleView />} />
            <Route/>

            {/* Other pages */}
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
