# CRUD de Livros

API de livros feita com Node.js, Express e MySQL.

## Como rodar

1. Instale as dependências:

   npm install

2. Abra o MySQL Workbench e execute o arquivo `database/script.sql` para criar o banco e a tabela.

3. Copie o arquivo `.env.example` para `.env` e ajuste os dados de conexão (usuário e senha do MySQL, se tiver).

4. Inicie o servidor:

   npm start

5. Abra http://localhost:3000 no navegador.

## Rotas

- POST /livros - cadastra um livro
- GET /livros - lista todos os livros (em ordem alfabética)
- GET /livros/:id - busca um livro pelo ID
- PUT /livros/:id - atualiza um livro
- DELETE /livros/:id - exclui um livro

Exemplo de corpo para POST e PUT:

    {
      "titulo": "Dom Casmurro",
      "autor": "Machado de Assis",
      "preco": 39.90,
      "estoque": 15
    }
