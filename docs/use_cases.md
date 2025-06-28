---
layout: default
title: "Casos de Uso"
description: "Casos de uso detalhados do sistema"
---

# Casos de Uso do Sistema de Controle de Produção de Cápsulas de Suplementos CNC

Este documento descreve os casos de uso para o Sistema de Controle de Produção de Cápsulas de Suplementos CNC, detalhando as interações entre os usuários e o sistema em diversos cenários.

<h2>Índice</h2>

- [Casos de Uso do Sistema de Controle de Produção de Cápsulas de Suplementos CNC](#casos-de-uso-do-sistema-de-controle-de-produção-de-cápsulas-de-suplementos-cnc)
  - [I. Gestão de Produtos (Product Management)](#i-gestão-de-produtos-product-management)
    - [1. Criar um Novo Produto (Create a New Product)](#1-criar-um-novo-produto-create-a-new-product)
    - [2. Definir a Fórmula de um Produto (Define a Product's Formula)](#2-definir-a-fórmula-de-um-produto-define-a-products-formula)
  - [II. Gestão de Matérias-Primas e Fornecedores (Raw Materials and Suppliers Management)](#ii-gestão-de-matérias-primas-e-fornecedores-raw-materials-and-suppliers-management)
    - [3. Receber uma Remessa de Matéria-Prima (Receive a Raw Material Shipment)](#3-receber-uma-remessa-de-matéria-prima-receive-a-raw-material-shipment)
    - [4. Listar as Matérias-Primas de um Fornecedor (List a Supplier's Raw Materials)](#4-listar-as-matérias-primas-de-um-fornecedor-list-a-suppliers-raw-materials)
    - [5. Listar os Lotes de um Fornecedor (List a Supplier's Batches)](#5-listar-os-lotes-de-um-fornecedor-list-a-suppliers-batches)
  - [III. Gestão da Produção (Production Management)](#iii-gestão-da-produção-production-management)
    - [6. Criar um Lote de Produção (Create a Production Batch)](#6-criar-um-lote-de-produção-create-a-production-batch)
    - [7. Registrar o Consumo de Matéria-Prima (Record Raw Material Consumption)](#7-registrar-o-consumo-de-matéria-prima-record-raw-material-consumption)
  - [IV. Relatórios e Análises (Reports and Analysis)](#iv-relatórios-e-análises-reports-and-analysis)
    - [8. Calcular a Proporção da Fórmula (Calculate Formula Proportion)](#8-calcular-a-proporção-da-fórmula-calculate-formula-proportion)
    - [9. Visualizar Informações de um Produto (View Product Information)](#9-visualizar-informações-de-um-produto-view-product-information)
    - [10. Visualizar Informações de um Lote de Produção (View Production Batch Information)](#10-visualizar-informações-de-um-lote-de-produção-view-production-batch-information)
  - [V. Casos de Uso de Erro](#v-casos-de-uso-de-erro)
    - [11. Tentar Consumir Mais do que o Disponível (Attempt to Consume More than Available)](#11-tentar-consumir-mais-do-que-o-disponível-attempt-to-consume-more-than-available)
    - [12. Criar um Ingrediente com Quantidade Inválida (Create an Ingredient with Invalid Quantity)](#12-criar-um-ingrediente-com-quantidade-inválida-create-an-ingredient-with-invalid-quantity)
  - [Detalhes Importantes para os Casos de Uso:](#detalhes-importantes-para-os-casos-de-uso)



## I. Gestão de Produtos (Product Management)

### 1. Criar um Novo Produto (Create a New Product)

*   **Descrição:** Um usuário (por exemplo, gerente de desenvolvimento de produtos) precisa definir um novo produto farmacêutico, incluindo seu nome, descrição, apresentação (embalagem) e a fórmula (receita) usada para produzi-lo.
*   **Ator Principal:** Gerente de Desenvolvimento de Produtos
*   **Pré-condições:**
    *   O sistema deve estar em execução.
    *   Pode ser necessário criar uma nova `Formula` primeiro.
*   **Fluxo Principal:**
    1.  O usuário seleciona a `ApresentacaoEnum` (ex: `EMBALAGEM_30`).
    2.  O usuário cria uma nova instância de `Produto`, especificando:
        *   `id` (identificador único).
        *   `nome` (nome do produto).
        *   `descricao` (descrição do produto).
        *   `apresentacao` (a apresentação selecionada).
        *   `formula` (a fórmula associada, que deve existir).
    3.  O sistema armazena o novo `Produto`.
*   **Pós-condições:**
    *   Um novo `Produto` é criado e está disponível no sistema.
*   **Fluxos Alternativos:**
    *   Se a `Formula` especificada não existir, o sistema deve exibir um erro e solicitar a criação da fórmula primeiro.

### 2. Definir a Fórmula de um Produto (Define a Product's Formula)

*   **Descrição:** Um usuário precisa definir os ingredientes e suas quantidades para a fórmula de um produto específico. Os ingredientes podem vir de diferentes matérias-primas e lotes.
*   **Ator Principal:** Técnico de Formulação
*   **Pré-condições:**
    *   O sistema deve estar em execução.
    *   Deve existir um `Produto`.
    *   Pode ser necessário cadastrar `MateriaPrima` e `Fornecedor`.
    *   Deve existir `LoteMateriaPrima`.
*   **Fluxo Principal:**
    1.  O usuário seleciona a `FormaFarmaceuticaEnum`.
    2.  O usuário cria uma nova instância de `Formula`, especificando:
        *   `id` (identificador único).
        *   `forma_farmaceutica` (a forma farmacêutica selecionada).
        *   `quant_unid_padrao` (quantidade de unidades por embalagem).
        *   `quant_kg_padrao` (quantidade em kg por lote).
    3.  O usuário adiciona instâncias de `Ingrediente` à `Formula` com a função `add_ingrediente`.
    4.  Para cada `Ingrediente`, o usuário:
        *   Seleciona um `LoteMateriaPrima` existente.
        *   Especifica a `quant_mg` do ingrediente.
    5.  O sistema adiciona o `Ingrediente` à `Formula`.
    6.  O sistema armazena a nova `Formula`.
    7. Adiciona a formula no objeto `Produto`
*   **Pós-condições:**
    *   A `Formula` está definida, com seus `Ingredientes`, e associada ao `Produto`.
*   **Fluxos Alternativos:**
    *   Se o `LoteMateriaPrima` especificado não existir, o sistema deve exibir um erro e solicitar a criação do lote primeiro.
    *   Se a quantidade (`quant_mg`) do ingrediente for inválida, o sistema deve exibir um erro.

## II. Gestão de Matérias-Primas e Fornecedores (Raw Materials and Suppliers Management)

### 3. Receber uma Remessa de Matéria-Prima (Receive a Raw Material Shipment)

*   **Descrição:** Um usuário (por exemplo, funcionário do armazém) precisa registrar o recebimento de uma nova remessa de matérias-primas de um fornecedor.
*   **Ator Principal:** Funcionário do Armazém
*   **Pré-condições:**
    *   O sistema deve estar em execução.
    *   Deve existir o `Fornecedor`.
    *   Pode ser necessário cadastrar `MateriaPrima`.
*   **Fluxo Principal:**
    1.  O usuário seleciona a `MateriaPrima`.
    2.  O usuário seleciona o `Fornecedor`.
    3.  O usuário cria uma nova instância de `LoteMateriaPrima`, especificando:
        *   `id` (identificador único).
        *   `materia_prima` (a matéria-prima recebida).
        *   `lote` (o número do lote fornecido pelo fornecedor).
        *   `quant_total_mg` (a quantidade total recebida, em miligramas).
        *   `nota_fiscal` (o número da nota fiscal).
        *   `fornecedor` (o fornecedor da remessa).
    4. O sistema adiciona o `LoteMateriaPrima` na lista de lotes do fornecedor `Fornecedor.lotes_fornecidos`.
    5. O sistema adiciona a `MateriaPrima` na lista de produtos do fornecedor `Fornecedor.produtos`
    6.  O sistema armazena o novo `LoteMateriaPrima`.
*   **Pós-condições:**
    *   Um novo `LoteMateriaPrima` é criado e está disponível no sistema, com os dados do fornecedor.
    *   A matéria-prima foi associada ao fornecedor, assim como o lote fornecido.
*   **Fluxos Alternativos:**
    *   Se a `MateriaPrima` ou o `Fornecedor` especificados não existirem, o sistema deve exibir um erro.

### 4. Listar as Matérias-Primas de um Fornecedor (List a Supplier's Raw Materials)

*   **Descrição:** Um usuário quer ver a lista de todas as matérias-primas que um fornecedor específico oferece.
*   **Ator Principal:** Comprador
*   **Pré-condições:**
    *   O sistema deve estar em execução.
    *   Deve existir o `Fornecedor`.
*   **Fluxo Principal:**
    1.  O usuário seleciona o `Fornecedor`.
    2.  O sistema chama o método `listar_materias_primas_fornecidas()` do `Fornecedor`.
    3.  O sistema retorna a lista de `MateriaPrima`.
*   **Pós-condições:**
    *   Uma lista de `MateriaPrima` é exibida.
*   **Fluxos Alternativos:**
    *   Se o `Fornecedor` não existir, o sistema deve exibir um erro.

### 5. Listar os Lotes de um Fornecedor (List a Supplier's Batches)

*   **Descrição:** Um usuário quer ver a lista de todos os lotes de matérias-primas que foram recebidas de um determinado fornecedor.
*   **Ator Principal:** Comprador ou Funcionário do Armazém
*   **Pré-condições:**
    *   O sistema deve estar em execução.
    *   Deve existir o `Fornecedor`.
    *   Deve existir `LoteMateriaPrima` associada ao fornecedor.
*   **Fluxo Principal:**
    1.  O usuário seleciona o `Fornecedor`.
    2.  O sistema chama o método `listar_lotes_fornecidos()` do `Fornecedor`.
    3.  O sistema retorna a lista de `LoteMateriaPrima`.
*   **Pós-condições:**
    *   Uma lista de `LoteMateriaPrima` é exibida.
*   **Fluxos Alternativos:**
    *   Se o `Fornecedor` não existir, o sistema deve exibir um erro.
    *   Se não existirem `LoteMateriaPrima` associadas ao fornecedor, deve retornar uma lista vazia.

## III. Gestão da Produção (Production Management)

### 6. Criar um Lote de Produção (Create a Production Batch)

*   **Descrição:** Um usuário (por exemplo, supervisor de produção) precisa iniciar um novo lote de produção para um produto específico.
*   **Ator Principal:** Supervisor de Produção
*   **Pré-condições:**
    *   O sistema deve estar em execução.
    *   Deve existir o `Produto`.
*   **Fluxo Principal:**
    1.  O usuário seleciona o `Produto` que será produzido.
    2.  O usuário cria uma nova instância de `LoteProducao`, especificando:
        *   `id` (identificador único).
        *   `produto` (o produto sendo produzido).
        *   `lote` (o número do lote de produção).
        *   `lote_tamanho` (o tamanho do lote de produção).
        *   `data_producao` (a data de produção).
    3.  O sistema armazena o novo `LoteProducao`.
*   **Pós-condições:**
    *   Um novo `LoteProducao` é criado e está disponível no sistema.
*   **Fluxos Alternativos:**
    *   Se o `Produto` especificado não existir, o sistema deve exibir um erro.

### 7. Registrar o Consumo de Matéria-Prima (Record Raw Material Consumption)

*   **Descrição:** Conforme um lote de produção é fabricado, um usuário precisa registrar o consumo de lotes específicos de matérias-primas.
*   **Ator Principal:** Operador de Produção
*   **Pré-condições:**
    *   O sistema deve estar em execução.
    *   Deve existir o `LoteProducao`.
    *   Devem existir `LoteMateriaPrima` disponíveis.
*   **Fluxo Principal:**
    1.  O usuário seleciona o `LoteProducao` que está consumindo as matérias-primas.
    2.  Para cada matéria-prima consumida, o usuário:
        *   Seleciona o `LoteMateriaPrima` utilizado.
        *   Especifica a `quantidade_consumida_mg` (a quantidade consumida do lote).
    3.  O sistema chama o método `registrar_consumo()` do `LoteProducao`, passando o `LoteMateriaPrima` e a quantidade consumida.
    4. O sistema registra o `LoteMateriaPrimaConsumida` na lista `lotes_materias_primas_consumidas` do `LoteProducao`.
*   **Pós-condições:**
    *   A `quantidade_disponivel_mg` do `LoteMateriaPrima` é atualizada.
    *   A informação do consumo fica registrada.
*   **Fluxos Alternativos:**
    *   Se a quantidade consumida for inválida (menor ou igual a zero), o sistema deve exibir um erro.
    *   Se a quantidade consumida for maior que a quantidade disponível no `LoteMateriaPrima`, o sistema deve exibir um erro.

## IV. Relatórios e Análises (Reports and Analysis)

### 8. Calcular a Proporção da Fórmula (Calculate Formula Proportion)

*   **Descrição:** Um usuário precisa calcular a proporção dos ingredientes dentro de uma determinada fórmula.
*   **Ator Principal:** Técnico de Formulação, Gerente de Qualidade
*   **Pré-condições:**
    *   O sistema deve estar em execução.
    *   Deve existir a `Formula`.
*   **Fluxo Principal:**
    1.  O usuário seleciona a `Formula`.
    2.  O sistema chama o método `calcular_proporcao()` da `Formula`.
    3.  O sistema retorna o valor do cálculo.
*   **Pós-condições:**
    *   O valor de `calcular_proporcao` é exibido.
*   **Fluxos Alternativos:**
    *   Se não houver ingredientes na fórmula, deve retornar 0.

### 9. Visualizar Informações de um Produto (View Product Information)

*   **Descrição:** Um usuário precisa obter todas as informações de um produto.
*   **Ator Principal:** Gerente de desenvolvimento de produtos, Gerente de qualidade.
*   **Pré-condições:**
    *   O sistema deve estar em execução.
    *   Deve existir o `Produto`.
*   **Fluxo Principal:**
    1.  O usuário seleciona o `Produto`.
    2.  O sistema imprime ou retorna todas as informações do produto: `id`, `nome`, `descricao`, `apresentacao`, e `Formula`.
*   **Pós-condições:**
    *   Todas as informações do `Produto` são exibidas.
*   **Fluxos Alternativos:**
    *   Se o `Produto` não existir, o sistema deve exibir um erro.

### 10. Visualizar Informações de um Lote de Produção (View Production Batch Information)

*   **Descrição:** Um usuário precisa obter todas as informações de um lote de produção.
*   **Ator Principal:** Supervisor de produção, Gerente de qualidade.
*   **Pré-condições:**
    *   O sistema deve estar em execução.
    *   Deve existir o `LoteProducao`.
*   **Fluxo Principal:**
    1.  O usuário seleciona o `LoteProducao`.
    2.  O sistema imprime ou retorna todas as informações do lote de produção: `id`, `produto`, `lote`, `lote_tamanho`, `data_producao`, `LoteMateriaPrimaConsumida`.
*   **Pós-condições:**
    *   Todas as informações do `LoteProducao` são exibidas.
*   **Fluxos Alternativos:**
    *   Se o `LoteProducao` não existir, o sistema deve exibir um erro.

## V. Casos de Uso de Erro

Estes casos de uso descrevem cenários em que erros podem ocorrer:

### 11. Tentar Consumir Mais do que o Disponível (Attempt to Consume More than Available)

*   **Descrição:** Um usuário tenta registrar o consumo de uma quantidade de matéria-prima de um lote que excede a quantidade disponível nesse lote.
*   **Ator Principal:** Operador de Produção
*   **Pré-condições:**
    *   O sistema deve estar em execução.
    *   Deve existir o `LoteProducao`.
    *   Deve existir o `LoteMateriaPrima` com quantidade disponível.
*   **Fluxo Principal:**
    1.  O usuário seleciona o `LoteProducao`.
    2.  O usuário seleciona o `LoteMateriaPrima`.
    3.  O usuário digita um valor maior que a quantidade disponível do `LoteMateriaPrima.quantidade_disponivel_mg`.
    4.  O sistema chama o método `registrar_consumo()` do `LoteProducao`.
*   **Pós-condições:**
    *   O sistema mostra uma `ValueError`.
*   **Fluxos Alternativos:**
    *   O método `LoteProducao.registrar_consumo` levanta um `ValueError` com uma mensagem indicando que a quantidade solicitada é maior que a quantidade disponível.

### 12. Criar um Ingrediente com Quantidade Inválida (Create an Ingredient with Invalid Quantity)

*   **Descrição:** Um usuário tenta criar um `Ingrediente` com uma quantidade menor ou igual a zero.
*   **Ator Principal:** Técnico de Formulação
*   **Pré-condições:**
    *   O sistema deve estar em execução.
    *   Deve existir `LoteMateriaPrima`.
*   **Fluxo Principal:**
    1.  O usuário tenta criar um novo `Ingrediente` com o parâmetro `quantidade_mg` com um valor menor ou igual a 0.
*   **Pós-condições:**
    *   O sistema mostra uma `ValueError`.
*   **Fluxos Alternativos:**
    *   A função `Ingrediente.__init__` levanta um `ValueError` com uma mensagem indicando que a quantidade deve ser maior que zero.

## Detalhes Importantes para os Casos de Uso:

*   **Ator Principal:** A pessoa ou sistema que inicia o caso de uso.
*   **Pré-condições:** O que deve ser verdade para o caso de uso acontecer.
*   **Fluxo Principal:** A sequência de passos "feliz", sem erros.
*   **Pós-condições:** O que é verdade após o caso de uso ser completado com sucesso.
*   **Fluxos Alternativos:** Caminhos que podem acontecer quando erros ocorrem.
