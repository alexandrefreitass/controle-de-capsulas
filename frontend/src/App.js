import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Componentes de Autenticação
import Login from './components/Login';
import Register from './components/Register';
import Success from './components/Success';

// Componentes de Fornecedores - Corrija estes imports
import Fornecedores from './components/Fornecedores';
import FornecedorForm from './components/FornecedorForm';

// Componentes de Matérias Primas
import MateriasPrimas from './components/MateriasPrimas';
import MateriaPrimaForm from './components/MateriaPrimaForm';
import Lotes from './components/Lotes';
import LoteForm from './components/LoteForm';

// Componentes da Produção
import Producao from './components/Producao';
import ProducaoForm from './components/ProducaoForm';
import ProducaoDetalhe from './components/ProducaoDetalhe';

// Componentes dos Produtos
import Produtos from './components/Produtos';
import ProdutoForm from './components/ProdutoForm';
import ProdutoDetalhe from './components/ProdutoDetalhe';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Rotas de Autenticação */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/success" element={<Success />} />
          
          {/* Rotas de Fornecedores */}
          <Route path="/fornecedores" element={<Fornecedores />} />
          <Route path="/fornecedores/novo" element={<FornecedorForm />} />
          <Route path="/fornecedores/editar/:id" element={<FornecedorForm />} />
          
          {/* Rotas de Matérias Primas */}
          <Route path="/materias-primas" element={<MateriasPrimas />} />
          <Route path="/materias-primas/novo" element={<MateriaPrimaForm />} />
          <Route path="/materias-primas/editar/:id" element={<MateriaPrimaForm />} />
          <Route path="/materias-primas/:materiaPrimaId/lotes" element={<Lotes />} />
          <Route path="/materias-primas/:materiaPrimaId/lotes/novo" element={<LoteForm />} />
          <Route path="/materias-primas/:materiaPrimaId/lotes/editar/:id" element={<LoteForm />} />
          
          {/* Rotas de Produção */}
          <Route path="/producao" element={<Producao />} />
          <Route path="/producao/novo" element={<ProducaoForm />} />
          <Route path="/producao/detalhar/:id" element={<ProducaoDetalhe />} />
          
          {/* Rotas de Produtos */}
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/produtos/novo" element={<ProdutoForm />} />
          <Route path="/produtos/editar/:id" element={<ProdutoForm />} />
          <Route path="/produtos/detalhar/:id" element={<ProdutoDetalhe />} />
          
          {/* Rota para página não encontrada */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;