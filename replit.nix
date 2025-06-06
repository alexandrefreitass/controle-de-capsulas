# Arquivo: replit.nix
{ pkgs }: {
  deps = [
    # Adiciona as bibliotecas cliente do PostgreSQL, incluindo o pg_config
    pkgs.postgresql

    # Adiciona o compilador C, que pode ser necessário para outras libs
    pkgs.gcc
  ];
}