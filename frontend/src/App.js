
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Componentes de Layout
import Layout from './components/Layout';

// Componentes de Autenticação
import Login from './components/Login';
import Register from './components/Register';
import Success from './components/Success';

// Componentes de Fornecedores
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
          {/* Rotas de Autenticação - SEM Layout (sem sidebar) */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Rotas com Layout (COM sidebar) */}
          <Route path="/success" element={<Layout><Success /></Layout>} />
          
          {/* Rotas de Fornecedores */}
          <Route path="/fornecedores" element={<Layout><Fornecedores /></Layout>} />
          <Route path="/fornecedores/novo" element={<Layout><FornecedorForm /></Layout>} />
          <Route path="/fornecedores/editar/:id" element={<Layout><FornecedorForm /></Layout>} />
          
          {/* Rotas de Matérias Primas */}
          <Route path="/materias-primas" element={<Layout><MateriasPrimas /></Layout>} />
          <Route path="/materias-primas/novo" element={<Layout><MateriaPrimaForm /></Layout>} />
          <Route path="/materias-primas/editar/:id" element={<Layout><MateriaPrimaForm /></Layout>} />
          <Route path="/materias-primas/:materiaPrimaId/lotes" element={<Layout><Lotes /></Layout>} />
          <Route path="/materias-primas/:materiaPrimaId/lotes/novo" element={<Layout><LoteForm /></Layout>} />
          <Route path="/materias-primas/:materiaPrimaId/lotes/editar/:id" element={<Layout><LoteForm /></Layout>} />
          
          {/* Rotas de Produção */}
          <Route path="/producao" element={<Layout><Producao /></Layout>} />
          <Route path="/producao/novo" element={<Layout><ProducaoForm /></Layout>} />
          <Route path="/producao/detalhar/:id" element={<Layout><ProducaoDetalhe /></Layout>} />
          
          {/* Rotas de Produtos */}
          <Route path="/produtos" element={<Layout><Produtos /></Layout>} />
          <Route path="/produtos/novo" element={<Layout><ProdutoForm /></Layout>} />
          <Route path="/produtos/editar/:id" element={<Layout><ProdutoForm /></Layout>} />
          <Route path="/produtos/detalhar/:id" element={<Layout><ProdutoDetalhe /></Layout>} />
          
          {/* Rota para página não encontrada */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
