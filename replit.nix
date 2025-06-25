{ pkgs }: {
  deps = [
    # Pacotes essenciais para o Python
    pkgs.python311Full
    pkgs.replitPackages.poetry
    
    # Pacotes essenciais para o Node.js
    pkgs.nodejs-18_x
    pkgs.nodePackages.npm
    
    # Dependência de sistema para a biblioteca psycopg2 do Python
    pkgs.postgresql-client
    
    # Ferramentas de desenvolvimento úteis
    pkgs.gdb
    pkgs.gnumake
    pkgs.gcc
  ];
}