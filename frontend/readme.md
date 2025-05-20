# CNC - Sistema de Autenticação (Frontend)

Frontend desenvolvido em React para o sistema CNC (KONNEKIT).

## Tecnologias Utilizadas

- React
- React Router Dom
- Axios
- Webpack
- Babel

## Estrutura do Projeto

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Login.js
│   │   ├── Register.js
│   │   └── Success.js
│   ├── App.js
│   ├── index.js
│   └── styles.css
├── webpack.config.js
├── .babelrc
├── package.json
└── README.md
```

## Funcionalidades

- **Login de Usuários**: Autenticação de usuários existentes
- **Registro de Usuários**: Cadastro de novos usuários
- **Validação de Formulários**: Tratamento de erros nos formulários
- **Redirecionamento Inteligente**: Encaminhamento baseado na autenticação

## Instalação

Para instalar e executar este projeto localmente:

```bash
# Navegue até o diretório do projeto
cd c:\CODES\KONNEKIT\CNC\frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm start
```

O aplicativo estará disponível em [http://localhost:3000](http://localhost:3000).

## Desenvolvimento

### Scripts Disponíveis

- `npm start`: Inicia o servidor de desenvolvimento
- `npm run build`: Cria uma versão de produção otimizada

### Comunicação com o Backend

O frontend se comunica com o backend através de requisições HTTP usando Axios:

- Endpoint de Login: `http://localhost:8000/accounts/login/`
- Endpoint de Registro: `http://localhost:8000/accounts/register/`

## Autores

KONNEKIT Team

## Licença

Este projeto está licenciado sob [********](********).