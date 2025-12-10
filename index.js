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
    maxAge: 1000*60*30
  }
}))
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

let listaEquipes = [];
let listaJogadores = [];

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
                              <a class="nav-link" href="/cadastroTimes">Cadastrar Times</a>
                          </li>
                          <li class="nav-item">
                              <a class="nav-link" href="/cadastrarJogador">Cadastrar Jogadores</a>
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
app.get("/cadastroTimes",verificaUser, (req, res) => {
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
                              <a class="nav-link" href="/cadastroTimes">Cadastrar Times</a>
                          </li>
                      </ul>
                  </div>
              </div>
          </nav>
          <div class="container w-75 mb-5 mt-5">
              <form method="POST" action="/cadastroTimes" class="row g-3 border p-3 rounded shadow-sm">
                  <fieldset>
                      <legend class="text-center">Cadastro de Times</legend>
                  </fieldset>

                  <div class="col-md-4">
                      <label>Nome da Equipe</label>
                      <input type="text" name="nome">
                  </div>

                  <div class="col-md-4">
                        <label>Responsável pela equipe</label>
                        <input type="text" name="resp">
                  </div>

                  <div class="col-md-4">
                      <label>Contato do responsável</label>
                      <input type="number" name="tel">
                  </div>

                  <div class="col-12">
                      <button class="btn btn-primary" type="submit">Cadastrar equipe</button>
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
app.post("/cadastroTimes",verificaUser, (req, res) => {
  const { nome, resp, tel } = req.body;

  if (nome && resp && tel) {
    listaEquipes.push({ nome, resp, tel });
    res.redirect("/listaEquipe");
  } 
  else {
    let devolve = `
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
                              <a class="nav-link" href="/cadastroTimes">Cadastrar Times</a>
                          </li>
                      </ul>
                  </div>
              </div>
          </nav>
          <div class="container w-75 mb-5 mt-5">
              <form method="POST" action="/cadastroTimes" class="row g-3 border p-3 rounded shadow-sm">
                  <fieldset>
                      <legend class="text-center">Cadastro de Times</legend>
                  </fieldset>

                  <div class="col-md-4">
                      <label>Nome da Equipe</label>
                      <input type="text" name="nome" value="${nome}">
                  </div>
                  `;
                  if(!nome){
                  devolve += `<div>
                                <p>Por favor, informe o nome da equipe</p>
                              </div>`;
                  }

                  devolve += `
                  <div class="col-md-4">
                        <label>Responsável pela equipe</label>
                        <input type="text" name="resp" value="${resp}">
                  </div>
                        `;
                  if(!resp){
                  devolve += `<div>
                                <p>Por favor, informe o nome do responsável da equipe</p>
                              </div>`;
                  }
                  devolve += `

                  <div class="col-md-4">
                      <label>Contato do responsável</label>
                      <input type="number" name="tel" value="${tel}">
                  </div>
                        `;
                  if(!tel){
                  devolve += `<div>
                                <p>Por favor, informe o contato do responsável da equipe</p>
                              </div>`;
                  }

                  devolve += `

                  <div class="col-12">
                      <button class="btn btn-primary" type="submit">Cadastrar equipe</button>
                      <a class="btn btn-secondary" href="/">Voltar</a>
                  </div>
              </form>
          </div>
      </body>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
    </html>
  `;
    res.send(devolve);
  }
});

// Rota do list
app.get("/listaEquipe",verificaUser, (req, res) => {
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
                              <a class="nav-link" href="/cadastroTimes">Cadastrar Times</a>
                          </li>
                      </ul>
                  </div>
              </div>
          </nav>
          <div class="container w-75 mb-5 mt-5">
              <h2 class="text-center mb-4">Lista de Usuários Cadastrados</h2>
              <table class="table table-striped table-hover">
                  <thead>
                      <tr>
                          <th>Nome do Time</th>
                          <th>Responsável do Time</th>
                          <th>Contato do Responsável</th>
                      </tr>
                  </thead>
                  <tbody>`;

                  for (let equipe of listaEquipes) {
                    conteudo += `
                      <tr>
                          <td>${equipe.nome}</td>
                          <td>${equipe.resp}</td>
                          <td>${equipe.tel}</td>
                      </tr>`;
                  }

                  conteudo += `
                  </tbody>
              </table>
              <a class="btn btn-secondary" href="/cadastroTimes">Cadastrar nova equipe</a>
          </div>
      </body>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
    </html>`;

  res.send(conteudo);
});

// Rota do Cadastro
app.get("/cadastrarJogador",verificaUser, (req, res) => {
  let cadastro_jogador = `
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
                              <a href="/cadastrarJogador">Cadastrar Jogadores</a>
                          </li>
                      </ul>
                  </div>
              </div>
          </nav>
          <div class="container w-75 mb-5 mt-5">
              <form method="POST" action="/cadastrarJogador" class="row g-3 border p-3 rounded shadow-sm">
                  <fieldset>
                      <legend class="text-center">Cadastro de Jogadores</legend>
                  </fieldset>

                  <div class="col-md-4">
                      <label>Nome do Jogador</label>
                      <input type="text" name="name">
                  </div>

                  <div class="col-md-4">
                          <label>Nickname in-game</label>
                          <input type="text" name="nick">
                  </div>

                  <div class="col-md-4">
                      <label for="opcoes">Qual sua função:</label>
                      <select id="lane" name="lane">
                          <option value="">Lanes</option>
                          <option value="Top">Top</option>
                          <option value="Mid">Mid</option>
                          <option value="Jungle">Jungle</option>
                          <option value="ADCarry">ADCarry</option>
                          <option value="Sup">Sup</option>
                      </select>
                  </div>

                  <div class="col-md-4">
                          <label for="opcoes">Qual seu elo:</label>
                          <select id="elo" name="elo">
                              <option value="">Elo</option>
                              <option value="Ferro">Ferro</option>
                              <option value="Bronze">Bronze</option>
                              <option value="Prata">Prata</option>
                              <option value="Ouro">Ouro</option>
                              <option value="Platina">Platina</option>
                              <option value="Diamante">Diamante</option>
                              <option value="Mestre">Mestre</option>
                              <option value="Grão-Mestre">Grão-Mestre</option>
                              <option value="Desafiante">Desafiante</option>
                          </select>
                  </div>

                  <div class="col-md-4">
                          <label for="opcoes">Gênero:</label>
                          <select id="sexo" name="sexo">
                              <option value="">Sexo</option>
                              <option value="Masculino">Masculino</option>
                              <option value="Feminino">Feminino</option>
                          </select>
                  </div>

                  <div class="col-md-4">
                         <label for="opcoes">Time:</label>
                          <select id="time" name="time">
                              <option value="">Times</option> `;
                              for (let equipe of listaEquipes) {
                                  cadastro_jogador += `<option value="${equipe.nome}">${equipe.nome}</option>`;
                              }
                  cadastro_jogador += `    
                  </select>
                  </div>

                  <div class="col-12">
                      <button class="btn btn-primary" type="submit">Cadastrar Jogador</button>
                      <a class="btn btn-secondary" href="/">Voltar</a>
                  </div>
              </form>
          </div>
      </body>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
    </html>
  `;

  res.send(cadastro_jogador);
});

// Post do Cadastro
app.post("/cadastrarJogador",verificaUser, (req, res) => {
  const { name, nick, lane, elo, sexo, time } = req.body;

  if (name && nick && lane && elo && sexo && time) {
    listaJogadores.push({ name, nick, lane, elo, sexo, time });
    res.redirect("/listaJogador");
  }  
  else {
    let devolve_jogador = `
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
                              <a href="/cadastrarJogador">Cadastrar Jogadores</a>
                          </li>
                      </ul>
                  </div>
              </div>
          </nav>
          <div class="container w-75 mb-5 mt-5">
              <form method="POST" action="/cadastrarJogador" class="row g-3 border p-3 rounded shadow-sm">
                  <fieldset>
                      <legend class="text-center">Cadastro de Jogadores</legend>
                  </fieldset>

                  <div class="col-md-4">
                      <label>Nome do Jogador</label>
                      <input type="text" name="name" value="${name}">
                  </div>
                  `;
                  if(!name){
                  devolve_jogador += `<div>
                                <p>Por favor, informe o nome do jogador</p>
                              </div>`;
                  }

                  devolve_jogador += `
                  <div class="col-md-4">
                          <label>Nickname in-game</label>
                          <input type="text" name="nick" value="${nick}">
                  </div>
                  `;
                  if(!nick){
                  devolve_jogador += `<div>
                                <p>Por favor, informe o nick-name do jogador</p>
                              </div>`;
                  }

                  devolve_jogador += `
                  <div class="col-md-4">
                      <label for="opcoes">Qual sua função:</label>
                      <select id="lane" name="lane" >
                          <option value="${lane}">${lane}</option>
                          <option value="Top">Top</option>
                          <option value="Mid">Mid</option>
                          <option value="Jungle">Jungle</option>
                          <option value="ADCarry">ADCarry</option>
                          <option value="Sup">Sup</option>
                      </select>
                  </div>
                  `;
                  if(!lane){
                  devolve_jogador += `<div>
                                <p>Por favor, informe a rota do jogador</p>
                              </div>`;
                  }

                  devolve_jogador += `
                  <div class="col-md-4">
                          <label for="opcoes">Qual seu elo:</label>
                          <select id="elo" name="elo" >
                              <option value="${elo}">${elo}</option>
                              <option value="Ferro">Ferro</option>
                              <option value="Bronze">Bronze</option>
                              <option value="Prata">Prata</option>
                              <option value="Ouro">Ouro</option>
                              <option value="Platina">Platina</option>
                              <option value="Diamante">Diamante</option>
                              <option value="Mestre">Mestre</option>
                              <option value="Grão-Mestre">Grão-Mestre</option>
                              <option value="Desafiante">Desafiante</option>
                          </select>
                  </div>
                  `;
                  if(!elo){
                  devolve_jogador += `<div>
                                <p>Por favor, informe o elo do jogador</p>
                              </div>`;
                  }

                  devolve_jogador += `
                  <div class="col-md-4">
                          <label for="opcoes">Gênero:</label>
                          <select id="sexo" name="sexo" >
                              <option value="${sexo}">${sexo}</option>
                              <option value="Masculino">Masculino</option>
                              <option value="Feminino">Feminino</option>
                          </select>
                  </div>
                  `;
                  if(!sexo){
                  devolve_jogador += `<div>
                                <p>Por favor, informe o sexo do jogador</p>
                              </div>`;
                  }

                  devolve_jogador += `
                  <div class="col-md-4">
                         <label for="opcoes">Time:</label>
                          <select id="time" name="time" ">
                              <option value="${time}">${time}</option> `;
                              for (let equipe of listaEquipes) {
                                  devolve_jogador += `<option value="${equipe.nome}">${equipe.nome}</option>`;
                              }
                  devolve_jogador += `    
                          </select>
                  </div>
                  `;
                    if(!time){
                    devolve_jogador += `<div>
                                  <p>Por favor, informe o time do jogador</p>
                                </div>`;
                    }

                    devolve_jogador += `

                  <div class="col-12">
                      <button class="btn btn-primary" type="submit">Cadastrar Jogador</button>
                      <a class="btn btn-secondary" href="/">Voltar</a>
                  </div>
              </form>
          </div>
      </body>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
    </html>
  `;
    res.send(devolve_jogador);
  }
});

// Rota do list
app.get("/listaJogador",verificaUser, (req, res) => {
  let ultimo = req.cookies?.ultimo;
  const data = new Date();
  res.cookie("ultimo",data.toLocaleString());
  res.setHeader("Content-type","text/html");
  let conteudo_jogador = `
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
                              <a class="nav-link" href="/cadastrarJogador">Cadastrar Jogadores</a>
                          </li>
                      </ul>
                  </div>
              </div>
          </nav>
          <div class="container w-75 mb-5 mt-5">
              <h2 class="text-center mb-4">Lista de Usuários Cadastrados</h2>
              <table class="table table-striped table-hover">
                  <thead>
                      <tr>
                          <th>Nome do Jogador</th>
                          <th>Nickname</th>
                          <th>Função</th>
                          <th>Ranking</th>
                          <th>Gênero</th>
                          <th>Equipe</th>
                      </tr>
                  </thead>
                  <tbody>`;

   for (let jogador of listaJogadores) {
    conteudo_jogador += `
      <tr>
        <td>${jogador.name}</td>
        <td>${jogador.nick}</td>
        <td>${jogador.lane}</td>
        <td>${jogador.elo}</td>
        <td>${jogador.sexo}</td>
        <td>${jogador.time}</td>
      </tr>
    `;
  }

  conteudo_jogador += `
                  </tbody>
              </table>
              <a class="btn btn-secondary" href="/cadastrarJogador">Cadastrar nova equipe</a>
          </div>
      </body>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
    </html>`;

  res.send(conteudo_jogador);
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
          <div class="container w-75 mb-5 mt-5">
              <form method="POST" action="/login" class="row g-3 border p-3 rounded shadow-sm">
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
          <title>Login</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
      </head>
      <body>
          <div class="container w-75 mb-5 mt-5">
              <form method="POST" action="/login" class="row g-3 border p-3 rounded shadow-sm">
                  <div class="col-md-4">
                      <label class="form-label">Usuário</label>
                      <input type="text" class="form-control" name="user" value="${user}">
                  </div>
                  `;
                  if(user != "admin"){
                    if(!user){
                    erro += `<div class="erro-msg">
                                <p>Por Favor, insíra o usuário</p>
                              </div>`;
                    }
                    else{
                      erro += `<div class="erro-msg">
                                <p>Usuário Incorreto</p>
                              </div>`;
                    }
                  }
                  erro += `
                  <div class="col-md-4">
                      <label class="form-label">Senha</label>
                      <input type="password" class="form-control" name="senha" value="${senha}">
                  </div>
                  `;
                  if(senha != "12345678"){
                    erro += `<div class="erro-msg">
                                <p>senha Incorreta</p>
                              </div>`;
                  }
                  if(!senha){
                    erro += `<div class="erro-msg">
                                <p>Por Favor, insirá senha</p>
                              </div>`;
                  }
                  erro += `
                  <div class="col-12">
                      <button class="btn btn-primary" type="submit">Entrar</button>
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
