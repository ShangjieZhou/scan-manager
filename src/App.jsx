import { AnnotationPage } from './pages/annotationPage/AnnotationPage';
import React, { useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LoginPage } from './pages/loginPage/LoginPage';
import { CasesPage } from './pages/casesPage/CasesPage';
import { BrowserRouter, Routes, Route, IndexRoute } from 'react-router-dom';
import { CreateCasePage } from './pages/createCasePage/CreateCasePage';
import "./App.scss"
import DashboardPage from './pages/dashboard/DashboardPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#00adbb',
      contrastText: "#fff"
    },
    secondary: {
      main: '#fff0f1'
    },
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path='/annotation-steps/:caseId' element={<AnnotationPage />} />
          <Route path='/' element={<LoginPage />} />
          <Route path='/cases-list' element={<CasesPage />} />
          <Route path='/cases-list/create' element={<CreateCasePage />} />
          <Route path='/dashboard/:caseId' element={<DashboardPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
