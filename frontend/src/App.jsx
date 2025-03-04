import { Upload } from 'lucide-react';
import React from 'react';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import UploadForm from './components/UploadForm';
import ModelList from './components/ModelList';

const App = () => {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UploadForm />} />
          <Route path="/viewmodel" element={<ModelList />} />
         
        </Routes>
        </BrowserRouter>

    );
};

export default App;
