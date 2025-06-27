
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from './Icon';
import LogoCNC from '../assets/images/logo-02.png';

function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/login');
  };

  const menuItems = [
    {
      path: '/success',
      icon: 'LayoutDashboard',
      label: 'Dashboard'
    },
    {
      path: '/fornecedores',
      icon: 'Building2',
      label: 'Fornecedores'
    },
    {
      path: '/materias-primas',
      icon: 'FlaskConical',
      label: 'Matérias Primas'
    },
    {
      path: '/producao',
      icon: 'Factory',
      label: 'Produção'
    },
    {
      path: '/produtos',
      icon: 'Package',
      label: 'Produtos'
    }
  ];

  const isActive = (path) => {
    if (path === '/success') {
      return location.pathname === '/success';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div 
      className={`sidebar ${isExpanded ? 'expanded' : ''}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="sidebar-logo">
        <div onClick={() => navigate('/success')} style={{ cursor: 'pointer' }}>
          <img
            src={LogoCNC}
            alt="Logo"
            className="logo-collapsed"
          />
          <img
            src={LogoCNC}
            alt="Logo Estendida"
            className="logo-expanded"
          />
        </div>
      </div>

      <div className="menu-items">
        {menuItems.map((item) => (
          <div
            key={item.path}
            className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <Icon name={item.icon} size={20} />
            <span>{item.label}</span>
          </div>
        ))}

        <div className="menu-item" onClick={handleLogout}>
          <Icon name="LogOut" size={20} />
          <span>Sair</span>
        </div>
      </div>

      <div className="sidebar-user-profile">
        <div className="avatar-container">
          <Icon name="User" size={24} className="user-photo" />
        </div>
        <span className="user-name">{username}</span>
      </div>
    </div>
  );
}

export default Sidebar;
