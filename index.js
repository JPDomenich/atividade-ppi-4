import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";

const host = "localhost";
const port = 3000;

const app = express();

app.use(session({
  secret:"Minh4Ch4v3S3cr3t4",
  resave: true,
  saveUninitialized: true,
  cookie:{
    maxAge: 1000*60*15
  }
}))
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

let listaProdutos = [];



// Rota do index
app.get("/",verificaUser, (req, res) => {
  let ultimo = req.cookies?.ultimo;
  const data = new Date();
  res.cookie("ultimo",data.toLocaleString());
  res.setHeader("Content-type","text/html");
  let index = `
    <html lang="pt-br">
      <head>
          <meta charset="UTF-8">
          <title>Página inicial do site</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
      </head>
      <body>
          <nav class="navbar navbar-expand-lg bg-body-tertiary">
              <div class="container-fluid">
                  <a class="navbar-brand" href="/">Menu do site</a>
                  <div class="collapse navbar-collapse">
                      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                          <li class="nav-item">
                              <a class="nav-link" href="/cadastroProduto">Cadastrar Produtos</a>
                          </li>
                          <li class="nav-item">
                              <a class="nav-link" href="/listaProduto">Listar Produtos</a>
                          </li>
                          <li class="nav-item">
                              <a class="nav-link" href="/login">Logar</a>
                          </li>
                      </ul>
                  </div>
              </div>
              <div class="container-fluid">
                <div class="d-flex">
                  <div class="p-2">
                    <p>Ultimo Acesso: ${ultimo || "Nenhum acesso"}</p>
                  </div>
                </div>
              </div>
          </nav>
      </body>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
    </html>
  `;

  
  res.send(index);
});

// Rota do Cadastro
app.get("/cadastroProduto",verificaUser, (req, res) => {
  let cadastro = `
    <html lang="pt-br">
      <head>
          <meta charset="UTF-8">
          <title>Cadastro de Usuários</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
      </head>
      <body>
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
              <div class="container-fluid">
                  <a class="navbar-brand" href="/">Menu do site</a>
                  <div class="collapse navbar-collapse">
                      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                          <li class="nav-item">
                              <a class="nav-link" href="/cadastroProduto">Cadastrar Produtos</a>
                          </li>
                          <li class="nav-item">
                              <a class="nav-link" href="/listaProduto">Listar Produtos</a>
                          </li>
                          <li class="nav-item">
                              <a class="nav-link" href="/login">Logar</a>
                          </li>
                      </ul>
                  </div>
              </div>
          </nav>
          <div class="container w-75 mb-5 mt-5">
              <form method="POST" action="/cadastroProduto" class="row g-3 border p-3 rounded shadow-sm">
                  <fieldset>
                      <legend class="text-center">Cadastro de Produtos</legend>
                  </fieldset>

                  <div class="col-md-4">
                      <label class="form-label">Código de Barras</label>
                      <input type="text" class="form-control" name="cod" >
                  </div>

                  <div class="col-md-4">
                      <label class="form-label">Descrição do Produto</label>
                      <input type="text" class="form-control" name="desc" >
                  </div>

                  <div class="col-md-4">
                      <label class="form-label">Preço de Custo</label>
                      <input type="number" class="form-control" name="preco_custo" >
                  </div>

                  <div class="col-md-4">
                      <label class="form-label">Preço de Venda</label>
                      <input type="number" class="form-control" name="preco_vendas" >
                  </div>

                  <div class="col-md-3">
                      <label class="form-label">Data de Validade</label>
                      <input type="date" class="form-control" name="data" >
                  </div>

                  <div class="col-md-4">
                      <label class="form-label">Quantidade em Estoque</label>
                      <input type="number" class="form-control" name="quant" >
                  </div>


                  <div class="col-md-4">
                      <label class="form-label">Nome do Fabricante</label>
                      <input type="text" class="form-control" name="nome" >
                  </div>

                  <div class="col-12">
                      <button class="btn btn-primary" type="submit">Cadastrar Usuário</button>
                      <a class="btn btn-secondary" href="/">Voltar</a>
                  </div>
              </form>
          </div>
      </body>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
    </html>
  `;

  res.send(cadastro);
});

// Post do Cadastro
app.post("/cadastroProduto",verificaUser, (req, res) => {
  const { cod, desc, preco_custo, preco_vendas, data, quant, nome } = req.body;

  if (cod && desc && preco_custo && preco_vendas && data && quant && nome) {
    listaProdutos.push({ cod, desc, preco_custo, preco_vendas, data, quant, nome });
    res.redirect("/listaProduto");
  } 
  else {
    let devolve = `<html lang="pt-br">
      <head>
          <meta charset="UTF-8">
          <title>Cadastro de Produtos</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
      </head>
      <body>
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
              <div class="container-fluid">
                  <a class="navbar-brand" href="/">Menu do site</a>
                  <div class="collapse navbar-collapse">
                      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                          <li class="nav-item">
                              <a class="nav-link" href="/cadastroProduto">Cadastrar Produtos</a>
                          </li>
                          <li class="nav-item">
                              <a class="nav-link" href="/listaProduto">Listar Produtos</a>
                          </li>
                          <li class="nav-item">
                              <a class="nav-link" href="/login">Logar</a>
                          </li>
                      </ul>
                  </div>
              </div>
          </nav>
          <div class="container w-75 mb-5 mt-5">
              <form method="POST" action="/cadastroProduto" class="row g-3 border p-3 rounded shadow-sm">
                  <fieldset>
                      <legend class="text-center">Cadastro de Usuários</legend>
                  </fieldset>

                   <div class="col-md-4">
                      <label class="form-label">Código de Barras</label>
                      <input type="text" class="form-control" name="cod" value="${cod}">
                  `;
          if(!cod){
            devolve += `<div>
                          <p>Por favor, informe o Código do produto</p>
                        </div>`;
          }
           devolve += `
           </div>
                   <div class="col-md-4">
                      <label class="form-label">Descrição do Produto</label>
                      <input type="text" class="form-control" name="desc" value="${desc}">
          `;
          if(!desc){
            devolve += `<div>
                          <p>Por favor, informe a Descrição do pedido</p>
                        </div>`;
          }
           devolve += `
           </div>
                  <div class="col-md-4">
                      <label class="form-label">Preço de Custo</label>
                      <input type="number" class="form-control" name="preco_custo" value="${preco_custo}" >
                  `;
          if(!preco_custo){
            devolve += `<div>
                          <p>Por favor, informe o preço de custo do produto</p>
                        </div>`;
          }
           devolve += `
            </div>
                  <div class="col-md-4">
                      <label class="form-label">Preço de Venda</label>
                      <input type="number" class="form-control" name="preco_vendas" value="${preco_vendas}">
                  `;
          if(!preco_vendas){
            devolve += `<div>
                          <p>Por favor, informe o preço de venda do produto</p>
                        </div>`;
          }
           devolve += `
           
            </div>
                 <div class="col-md-3">
                      <label class="form-label">Data de Validade</label>
                      <input type="date" class="form-control" name="data" value="${data}">
                  `;
          if(!data){
            devolve += `<div>
                          <p>Por favor, informe a data de validade do produto</p>
                        </div>`;
          }
           devolve += `
            </div>
                   <div class="col-md-4">
                      <label class="form-label">Quantidade em Estoque</label>
                      <input type="number" class="form-control" name="quant" value="${quant}">
                  `;
          if(!quant){
            devolve += `<div>
                          <p>Por favor, informe a quantidade no estoque deste produto</p>
                        </div>`;
          }
           devolve += `
            </div>
                  <div class="col-md-4">
                      <label class="form-label">Nome do Fabricante</label>
                      <input type="text" class="form-control" name="nome" value="${nome}">
                  `;
          if(!nome){
            devolve += `
                </div>
                  <div class="col-12">
                      <button class="btn btn-primary" type="submit">Cadastrar Usuário</button>
                      <a class="btn btn-secondary" href="/">Voltar</a>
                  </div>
              </form>
          </div>
      </body>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
    </html>`;

    res.send(devolve);
  }
}});

// Rota do list
app.get("/listaProduto",verificaUser, (req, res) => {
  let ultimo = req.cookies?.ultimo;
  const data = new Date();
  res.cookie("ultimo",data.toLocaleString());
  res.setHeader("Content-type","text/html");
  let conteudo = `
    <html lang="pt-br">
      <head>
          <meta charset="UTF-8">
          <title>Lista de Usuários</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
      </head>
      <body> 
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
              <div class="container-fluid">
                  <a class="navbar-brand" href="/">Menu do site</a>
                  <div class="collapse navbar-collapse">
                      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                          <li class="nav-item">
                              <a class="nav-link" href="/cadastroProduto">Cadastrar Produtos</a>
                          </li>
                          <li class="nav-item">
                              <a class="nav-link" href="/listaProduto">Listar Produtos</a>
                          </li>
                          <li class="nav-item">
                              <a class="nav-link" href="/login">Logar</a>
                          </li>
                      </ul>
                  </div>
              </div>
              <div class="container-fluid">
                <div class="d-flex">
                  <div class="p-2">
                    <p>Ultimo Acesso: ${ultimo || "Nenhum acesso"}</p>
                  </div>
                </div>
              </div>
          </nav>
          <div class="container w-75 mb-5 mt-5">
              <h2 class="text-center mb-4">Lista de Usuários Cadastrados</h2>
              <table class="table table-striped table-hover">
                  <thead>
                      <tr>
                          <th>Código de Barra</th>
                          <th>Descrição</th>
                          <th>Preço de Custo</th>
                          <th>Preço de Vendas</th>
                          <th>Data de Validade</th>
                          <th>Quantidade em Estoque</th>
                          <th>Nome do Fabricante</th>
                      </tr>
                  </thead>
                  <tbody>`;

  for (let produtos of listaProdutos) {
    conteudo += `
      <tr>
          <td>${produtos.cod}</td>
          <td>${produtos.desc}</td>
          <td>${produtos.preco_custo}</td>
          <td>${produtos.preco_vendas}</td>
          <td>${produtos.data}</td>
          <td>${produtos.quant}</td>
          <td>${produtos.nome}</td>
      </tr>`;
  }

  conteudo += `
                  </tbody>
              </table>
              <a class="btn btn-secondary" href="/cadastroProduto">Cadastrar novo Produto</a>
          </div>
      </body>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
    </html>`;

  res.send(conteudo);
});

app.get("/login", (req, res) => {
  let login = `
    <html lang="pt-br">
      <head>
          <meta charset="UTF-8">
          <title>Cadastro de Usuários</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
      </head>
      <body>
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
              <div class="container-fluid">
                  <a class="navbar-brand" href="/">Menu do site</a>
                  <div class="collapse navbar-collapse">
                      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                          <li class="nav-item">
                              <a class="nav-link" href="/cadastroProduto">Cadastrar Produtos</a>
                          </li>
                          <li class="nav-item">
                              <a class="nav-link" href="/listaProduto">Listar Produtos</a>
                          </li>
                          <li class="nav-item">
                              <a class="nav-link" href="/login">Logar</a>
                          </li>
                      </ul>
                  </div>
              </div>
          </nav>
          <div class="container w-75 mb-5 mt-5">
              <form method="POST" action="/login" class="row g-3 border p-3 rounded shadow-sm">
                  <fieldset>
                      <legend class="text-center">Cadastro de Usuários</legend>
                  </fieldset>

                  <div class="col-md-4">
                      <label class="form-label">Usuário</label>
                      <input type="text" class="form-control" name="user" >
                  </div>

                  <div class="col-md-4">
                      <label class="form-label">Senha</label>
                      <input type="password" class="form-control" name="senha" >
                  </div>

                  <div class="col-12">
                      <button class="btn btn-primary" type="submit">Entrar</button>
                      <a class="btn btn-secondary" href="/">Voltar</a>
                  </div>
              </form>
          </div>
      </body>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
    </html>
  `;
  
  res.send(login);
});

// Rota do Login
app.post("/login", (req, res) => {
  const { user, senha} = req.body;

  if (user == "admin" && senha == "12345678") { 
    req.session.DadosLogin = {
      logado:true,
      nomeUser: "Adiminstrador"
    };
    res.redirect("/");
  } 
  else {
    let erro = `
    <html lang="pt-br">
      <head>
          <meta charset="UTF-8">
          <title>Cadastro de Usuários</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
      </head>
      <body>
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
              <div class="container-fluid">
                  <a class="navbar-brand" href="/">Menu do site</a>
                  <div class="collapse navbar-collapse">
                      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                          <li class="nav-item">
                              <a class="nav-link" href="/cadastroProduto">Cadastrar Produtos</a>
                          </li>
                          <li class="nav-item">
                              <a class="nav-link" href="/listaProduto">Listar Produtos</a>
                          </li>
                          <li class="nav-item">
                              <a class="nav-link" href="/login">Logar</a>
                          </li>
                      </ul>
                  </div>
              </div>
          </nav>
          <div class="container w-75 mb-5 mt-5">
              <form method="POST" action="/login" class="row g-3 border p-3 rounded shadow-sm">
                  <fieldset>
                      <legend class="text-center">Cadastro de Usuários</legend>
                  </fieldset>

                  <div class="col-md-4">
                      <label class="form-label">Usuário</label>
                      <input type="text" class="form-control" name="user" >
                  `;

            if(user != "admin"){
              if(!user){
              erro += `<div>
                          <p>Por Favor, insíra o usuário</p>
                        </div>`;
              }
              else{
                erro += `<div>
                          <p>Usuário Incorreto</p>
                        </div>`;
              }
            }

              erro += ` 
                </div>
                  <div class="col-md-4">
                        <label class="form-label">Senha</label>
                        <input type="password" class="form-control" name="senha" >
                    `;
            if(senha != "12345678"){
              erro += `<div>
                          <p>senha Incorreta</p>
                        </div>`;
            }
            if(!senha){
              erro += `<div>
                          <p>Por Favor, insirá senha</p>
                        </div>`;
            }
            erro += `
              </div>
                  <div class="col-12">
                      <button class="btn btn-primary" type="submit">Entrar</button>
                      <a class="btn btn-secondary" href="/">Voltar</a>
                  </div>
              </form>
          </div>
      </body>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
    </html>
  `;

    res.send(erro);
  }
});

function verificaUser(req, res, next){
  if(req.session?.DadosLogin?.logado){
    next();
  }
  else{
    res.redirect("/login");
  }
}

app.get("/sair", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

// Inicializa o Servidor
app.listen(port, host, () => {
  console.log(`Servidor Funcionado! Caminho: http://${host}:${port}/`);
});
