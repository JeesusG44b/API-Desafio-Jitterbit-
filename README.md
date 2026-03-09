API Gerenciador de Pedidos

API RESTful desenvolvida em Node.js para gerenciamento e transformação de pedidos. Este projeto recebe um payload JSON específico, mapeia e tipifica os dados para a língua inglesa e os armazena em um banco de dados MongoDB.

Tecnologias Utilizadas

Node.js

Express.js (Framework web para rotas e requisições HTTP)

MongoDB (Banco de dados NoSQL)

Mongoose (ODM para modelagem de dados do MongoDB)

Como rodar o projeto localmente

Pré-requisitos

Ter o Node.js instalado.

Ter o MongoDB rodando localmente na porta padrão (27017) ou possuir uma string de conexão do MongoDB Atlas.

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

Como testar a API

Pode testar esta API utilizando clientes HTTP visuais como o Postman ou o Insomnia. Alternativamente, pode utilizar o seu próprio terminal através do comando curl.

Abaixo estão os exemplos prontos a usar no terminal:

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


Endpoints da API

1. Criar um novo pedido (POST)

POST /order

Descrição: Recebe o payload, transforma os dados e salva no banco.

Corpo (Request):

{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    { "idItem": "2434", "quantidadeItem": 1, "valorItem": 1000 }
  ]
}


2. Listar todos os pedidos (GET)

GET /order/list

Descrição: Retorna a lista de todos os pedidos já mapeados e armazenados.

3. Obter um pedido específico (GET)

GET /order/:orderId

Exemplo: GET /order/v10089015vdb-01

Descrição: Retorna os dados do pedido pelo ID.

4. Atualizar um pedido (PUT)

PUT /order/:orderId

Descrição: Atualiza os dados de um pedido existente passando o payload de atualização.

5. Deletar um pedido (DELETE)

DELETE /order/:orderId

Descrição: Remove o pedido do banco de dados. Retorna Status 204.

Arquitetura e Decisões

Mapping de Dados: Foi criada a função utilitária transformOrderPayload() que converte chaves como numeroPedido para orderId e realiza os devidos casts de tipos de String para Number e Date.

Banco de Dados: Optou-se pelo MongoDB por se adequar perfeitamente a estruturas JSON aninhadas (Pedido contendo array de Itens), dispensando a necessidade de tabelas relacionais (Order e Items).

Tratamento de Erros: Respostas padronizadas para não encontrados (404), conflitos de duplicação (409), requisições inválidas (400) e erros internos (500).

