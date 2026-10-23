const express = require("express");
const pool = require("./config/db");

const app = express();
app.use(express.json());

const PORTA = process.env.PORT || 3000;

function validar(dados) {
  const { titulo, autor, preco, estoque } = dados || {};

  if (typeof titulo !== "string" || titulo.trim() === "") {
    return "Título não pode ser vazio";
  }
  if (typeof autor !== "string" || autor.trim() === "") {
    return "Autor não pode ser vazio";
  }
  if (typeof preco !== "number" || Number.isNaN(preco) || preco < 0) {
    return "Preço inválido";
  }
  if (!Number.isInteger(estoque) || estoque < 0) {
    return "Estoque inválido";
  }
  return null;
}

function idValido(valor) {
  const id = Number(valor);
  return Number.isInteger(id) && id > 0 ? id : null;
}

app.get("/", (req, res) => {
  res.json({ mensagem: "API de livros funcionando!" });
});

// Cadastrar livro
app.post("/livros", async (req, res) => {
  const problema = validar(req.body);
  if (problema) {
    return res.status(400).json({ erro: problema });
  }

  const { titulo, autor, preco, estoque } = req.body;

  try {
    const [resultado] = await pool.query(
      "INSERT INTO Livros (Titulo, Autor, Preco, Estoque) VALUES (?, ?, ?, ?)",
      [titulo.trim(), autor.trim(), preco, estoque]
    );

    res.status(201).json({
      mensagem: "Livro cadastrado com sucesso!",
      id: resultado.insertId
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao cadastrar livro" });
  }
});

// Listar todos os livros
app.get("/livros", async (req, res) => {
  try {
    const [livros] = await pool.query(
      "SELECT Id, Titulo, Autor, Preco, Estoque FROM Livros ORDER BY Titulo"
    );

    res.json(livros);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao consultar livros" });
  }
});

// Buscar livro pelo ID
app.get("/livros/:id", async (req, res) => {
  const id = idValido(req.params.id);
  if (!id) {
    return res.status(400).json({ erro: "ID inválido" });
  }

  try {
    const [livros] = await pool.query(
      "SELECT Id, Titulo, Autor, Preco, Estoque FROM Livros WHERE Id = ?",
      [id]
    );

    if (livros.length === 0) {
      return res.status(404).json({ erro: "Livro não encontrado" });
    }

    res.json(livros[0]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao consultar livro" });
  }
});

// Atualizar livro
app.put("/livros/:id", async (req, res) => {
  const id = idValido(req.params.id);
  if (!id) {
    return res.status(400).json({ erro: "ID inválido" });
  }

  const problema = validar(req.body);
  if (problema) {
    return res.status(400).json({ erro: problema });
  }

  const { titulo, autor, preco, estoque } = req.body;

  try {
    const [resultado] = await pool.query(
      "UPDATE Livros SET Titulo = ?, Autor = ?, Preco = ?, Estoque = ? WHERE Id = ?",
      [titulo.trim(), autor.trim(), preco, estoque, id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Livro não encontrado" });
    }

    res.json({ mensagem: "Livro atualizado com sucesso!" });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao atualizar livro" });
  }
});

// Excluir livro
app.delete("/livros/:id", async (req, res) => {
  const id = idValido(req.params.id);
  if (!id) {
    return res.status(400).json({ erro: "ID inválido" });
  }

  try {
    const [resultado] = await pool.query("DELETE FROM Livros WHERE Id = ?", [id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Livro não encontrado" });
    }

    res.json({ mensagem: "Livro excluído com sucesso!" });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao excluir livro" });
  }
});

// Trata JSON inválido enviado no corpo da requisição
app.use((erro, req, res, next) => {
  if (erro instanceof SyntaxError && erro.status === 400 && "body" in erro) {
    return res.status(400).json({ erro: "JSON inválido" });
  }
  next(erro);
});

app.listen(PORTA, () => {
  console.log(`Servidor executando na porta ${PORTA}`);
});
