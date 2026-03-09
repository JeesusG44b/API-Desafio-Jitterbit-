API Gerenciador de Pedidos

API RESTful desenvolvida em Node.js para gerenciamento e transformação de pedidos. Este projeto recebe um payload JSON específico com chaves em português, mapeia e tipifica os dados para a língua inglesa e os armazena de forma estruturada em um banco de dados MongoDB.

Tecnologias Utilizadas

Node.js (Ambiente de execução JavaScript)

Express.js (Framework web para rotas e requisições HTTP)

MongoDB (Banco de dados NoSQL)

Mongoose (ODM para modelagem de dados do MongoDB)

Como rodar o projeto localmente

Pré-requisitos

Ter o Node.js instalado na sua máquina (versão 18+ recomendada).

Ter o MongoDB rodando localmente na porta padrão (27017) ou possuir uma string de conexão válida do MongoDB Atlas.

Passo a passo

Clone este repositório:

git clone [https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git](https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git)


Acesse a pasta do projeto:

cd SEU_REPOSITORIO


Instale as dependências:

npm install express mongoose


Execute a aplicação:

node api.js


O servidor estará rodando em http://localhost:3000

Como testar a API rapidamente

Você pode testar esta API utilizando clientes HTTP visuais como o Postman ou o Insomnia. Alternativamente, utilize o seu próprio terminal através do comando curl.

Abaixo estão os exemplos prontos para uso no terminal:

1. Criar um novo pedido (POST)

curl -X POST http://localhost:3000/order \
-H "Content-Type: application/json" \
-d '{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 1,
      "valorItem": 1000
    }
  ]
}'


2. Listar todos os pedidos (GET)

curl -X GET http://localhost:3000/order/list


3. Obter um pedido específico (GET)

curl -X GET http://localhost:3000/order/v10089015vdb-01


4. Atualizar um pedido (PUT)

curl -X PUT http://localhost:3000/order/v10089015vdb-01 \
-H "Content-Type: application/json" \
-d '{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 20000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 2,
      "valorItem": 1000
    }
  ]
}'


5. Eliminar um pedido (DELETE)

curl -X DELETE http://localhost:3000/order/v10089015vdb-01


Documentação Detalhada dos Endpoints

Abaixo estão os detalhes de requisição e as respostas esperadas para cada rota da API.

1. Criar um novo pedido

Rota: POST /order

Descrição: Recebe o payload em português, transforma os dados para o padrão do banco (inglês/tipificado) e salva o pedido.

Corpo da Requisição (JSON):

{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    { "idItem": "2434", "quantidadeItem": 1, "valorItem": 1000 }
  ]
}


Respostas Esperadas:

201 Created (Sucesso): Retorna o objeto mapeado recém-criado.

{
  "orderId": "v10089015vdb-01",
  "value": 10000,
  "creationDate": "2023-07-19T12:24:11.529Z",
  "items": [
    { "productId": 2434, "quantity": 1, "price": 1000 }
  ]
}


409 Conflict (Erro): Se um pedido com este numeroPedido já existir.

400 Bad Request (Erro): Se faltarem campos obrigatórios no payload.

2. Listar todos os pedidos

Rota: GET /order/list

Descrição: Retorna um array contendo todos os pedidos já mapeados e armazenados no banco de dados.

Respostas Esperadas:

200 OK (Sucesso):

[
  {
    "orderId": "v10089015vdb-01",
    "value": 10000,
    "creationDate": "2023-07-19T12:24:11.529Z",
    "items": [ ... ]
  },
  ...
]


3. Obter um pedido específico

Rota: GET /order/:orderId

Descrição: Busca e retorna os dados de um pedido específico utilizando o ID (orderId) passado na URL.

Respostas Esperadas:

200 OK (Sucesso): Retorna o objeto do pedido.

404 Not Found (Erro): Se o pedido não for encontrado no banco de dados.

{ "error": "Pedido não encontrado." }


4. Atualizar um pedido

Rota: PUT /order/:orderId

Descrição: Atualiza os dados de um pedido existente. A requisição deve conter o payload completo do pedido (no formato original em português). O ID fornecido na URL prevalece sobre o payload.

Corpo da Requisição (JSON): (Mesmo formato do POST)

Respostas Esperadas:

200 OK (Sucesso): Retorna o objeto do pedido com os dados atualizados.

404 Not Found (Erro): Se o pedido especificado na URL não existir.

400 Bad Request (Erro): Se o payload for inválido.

5. Deletar um pedido

Rota: DELETE /order/:orderId

Descrição: Remove permanentemente o pedido do banco de dados com base no ID fornecido na URL.

Respostas Esperadas:

204 No Content (Sucesso): O pedido foi deletado com sucesso. Não retorna corpo na resposta.

404 Not Found (Erro): Se o pedido não for encontrado para exclusão.

Arquitetura e Decisões

Mapping de Dados: Foi criada a função utilitária transformOrderPayload() que intercepta a requisição e converte chaves em português (ex: numeroPedido) para os nomes das colunas do banco (ex: orderId). Ela também realiza os devidos casts de tipos de String para Number e Date.

Banco de Dados: Optou-se pelo MongoDB por se adequar perfeitamente a estruturas JSON aninhadas (Pedido contendo um array de Itens). Isso dispensa a necessidade de tabelas relacionais separadas (Order e Items) e operações de JOIN complexas, garantindo alta performance de leitura e gravação.

Tratamento de Erros: A API implementa respostas padronizadas baseadas em status HTTP semânticos:

200/201/204 para sucessos.

404 para recursos não encontrados.

409 para conflitos de duplicação de chave.

400 para requisições com dados malformados.

500 para erros internos e não previstos do servidor ou do banco.
