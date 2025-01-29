# Sistema de controle de produção de cápulas de suplementos CNC

Sistema para o controle de produção 

## Requisitos

### RH

- tela com uma tabela do mês vigente, contendo as colunas 'data', 'responsáveis' e receitas.
- Cada receita deverá conter o nome do produto, e a quantidade de tanques
- A receita pode ser alterada até 12h antes da data em que estiver cadastrada
- Os tanques podem ser bloqueados até 1h antes do início destes pela produção, a contar a hora atual do sistema
- A quantidade de tanques deve ser exibida com um marcador na tela gerencial
- Caso o tanque seja bloqueado, todos os tanques posteriores a este estarão bloqueados, e haverá um ícone de interdição abaixo do tanque no dashboard
- Ao bloquear um ou mais tanques, o sistema pedirá para que seja inserida uma observação. Esta observação será exibida na tela quando o operador tentar iniciar um novo tanque.
- A observação será inserida na tela gerencial

### Produção
 - Tela com programação da produção diária (prrenchida pelo RH)
 - Cada dia deverá apresentar um único processo de produção, que ao clicar iniciar, será iniciado uma parte do processo
 - O processo deve ser sequencial, impedindo que o usuário cancele ou retorne para a tela anterior.
 - O processo deverá ser composto por
    - p1: Mistrura
    - p2: Estabilização
    - p3: Vácuo
    - p4: Refrigeração
    - p5: Liberação dos tanques
  - Em cada processo, haverá um check list para ser marcado pelo usuário, que caso não marcado, não permitir o avanço para a tela posterior.
  - Em cada processo, haverá uma um campo para inserção de valores, que deverá ser preenchido para que se possa avançar para a próxima etapa
  - Em cada processo, poderá haver listas de dicas
  - No processo p2, além de preencher todos os itens requeridos, após ser iniciado, deverá haver um cronometro regressivo de 60 minutos, que impeça que o usuário avance para o próximo processo
  - No processo de liberação de tanques, deverá haver um botão de start para cada tanque definido previamente pelo rh. 
  - Em cada tanque iniciado haverão os campos 'temperatura' e 'peso', que deverão ser informados antes de iniciar o próximo tanque
  - Todos os processos deverão registrar automaticamente o horário de início e término
  - O RH poderá bloquear a liberação dos tanques (p5) até desde que o horário atual seja menor do que 1h antes da liberação do tanque anterior
  - Caso o tanque seja bloqueado, ao tentar liberar um novo tanque, deverá aparecer uma mensagem popup para o usuário, informando que o tanque foi bloqueado, seguido da mensagem inserida pelo RH.
  - Após o pop up, direcionar para a tela final do sistema, com um campo de texto para observações do operador. Este campo é opcional.
  - Ao clicar em finalizar, sistema exibirá a tela de 'dashboard', com o filtro ativo para o usuário ativo.
  - Ao tentar acessar o sistema após o processo concluído, sempre redirecionar para o 'dashboard' com o filtro ativo

### Controle de Produção

 - Cada usuário poderá visualizar somente as receitas que lhe forem atribuídas.
 - Haverá um ícone no canto superior esquerdo (tubo de ensaio, becker) para acessar um modal de inserção de parâmetros
 - Este modal pode ser acessado a qualquer momento
 - Este modal deverá ter 3 abas: 'regulagens', 'carga' e 'resultados'
    - regulagens: uma tabela que deverá ser prenchida as informações inínio/meio/fim
        
    |Regulagens|Início|Meio|Fim|
    |----------|------|----|---|
    |Cunha     |      |    |   |
    |Geladeira |      |    |   |
    |Motor     |      |    |   |
    |Roda      |      |    |   |
    |Dragnet   |      |    |   |

    - Carga
    - Campos 'Peso Gelatina (mg)', 'Peso bruto', 'peso medicina'
    - Resultados
    - Campos 'total gelatina', 'total medicina', 'perdas (aparas)' e 'perda cápsulas'
- Haverá um ícone em linha no canto superior, ao lado do 'tubo de ensaio', que exibirá um popup com as informações de resultados (ícone de gráfico de barras), denomidado de área de resultados
- Na área de resultados, o sistema mostrá um modal com os dados inseridos no total deste dia (dados inseridos em 'resultados') e média calculada dos campos de peso bruto e peso medicina


### Gerencial

- Tela contendo o acompanhamento de todos os usuários
- Cada acompanhamento, deverá ser uma linha do tempo, que mostre em qual parte do processo determinado usuário está
- Abaixo da linha do usuário, deverá haver a hora de início e a previsão de fim daquela etapa
- No topo da tela ao centro deverá haver um fitro de seleção para que possa ser marcado e exibido todos os usuários
- Por padrão deverá ser exibido todos os usuarios.
- Caso os usuário insiram obervações, estas deverão aparecer listadas em uma lista 'scrollavel' no canto esquerdo da tela
- Caso os usuários insiram ocorrências, na linha de tempo dos usuário que registrou a ocorrência, deverá aparecer um ícone de (!), que aparecerá até que o RH marque a pendência como concluída e insira um comentário sobre a ação que foi tomada.
- A observação anotada pelo RH na ocorrência, será inserida na área de observações.
- As observações serão organizadas por data de criação inversa (da mais recentes para as mas antigas)
- Após marcado como concluída pelo RH, a pendência tem seu status marcado como resolvida, e o ícone de (!) desaparece da linha do tempo.
- A tela gerencial pode ser acessada somente por usuário que possua acesso específico para esta rotina
- A tela gerencial apresentará somente o que está sendo produzido na data atual


### Controle de ocorrências

- Em qualquer momento, o usuário poderá clicar no ícone (!) na tela de produção. 
- Quando acionado, abrirá uma página com os campos 'título', 'descrição' e 'anexos'.
- Todos os campos são obrigatórios
- Os anexos deverão ser arquivos de imagem, no máximo de 3 arquivos.
- após finalizar a ocorrência, esta não pode ser editada
- quando finalizada, o sistema retornará automaticamente para a tela do último processo que o usuário estava.


### BI e Analytics
- Tela contendo informações visuais, em um dashboard dinâmico
- Todos os dados quantificáveis do sistema apareceram resumidos no dashboard
- No todo do dashboard deverá haver ícones de filtro de data inicial e final
- Os dados default serão sempre os do mês vigente
- Os gráficos serão interativos, sendo permitido a navegação granular dentro deles para maiores detalhes
- haverá um link que mostre listadas todoas as observações apontadas no período selecionado
- haverá um link que mostre todas as ocorrências registrdas no período selecionado
- a de BI deverá ser acessada somente para usuários que tenham permissão para acesso.

- Infraestrutura
- O sistema será construído em python com o framework Django
- O acesso se dará somente por rede local
- As telas da produção deverão ter ícones e fontes grandes, de modo a facilitar a navegação dos funcionários que estarão vestindo roupas e luvas
- A tela Gerencial será projetada para telas grandes (smart tvs)
- A tela gerencial será atualizada a cada 5 minutos
- Todas as telas deverão usar html semântico, css e bootstrap
  