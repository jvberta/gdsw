# Modulo de erros

## Erros customizados 
---
exportado em errors.customErrors
```javascript
new FormatError(errors) // Erro de formatação dos dados
new InvalidApplication() // Erro para aplicações que não estejam cadastradas
new InvalidCredential() // Erro de usuario ou senha errados
new InvalidToken(token) // Erro do token utilizado para autorização é invalido
new notFound(resource /*recurso pesquisado*/, params /*parametros utilizados para consulta*/) //Erro de recurso não encontrado para a pesquisa
new Unauthorized(modulo/*Modulo do qual foi negado o recurso*/,papeis/*perfis aos quais são permitidos os acesso*/) // Erro de acesso não autorizado
new ValidationError(model /*modelo validado*/, errors) //Erro de validacao dos dados fornecidos
```

## Middleware de tratamento dos erros
---
exportado em errors.middleware

### Uso
```javascript
const errosMiddleware = require("core").errors.middleware;

//declaração das rotas
... 

app.use(errosMiddleware(opts*)); // * Opcional - Erros customizados da aplicação no formato {nomeDoErro:http_status_code}

//No controller
controler(req,res,next){
//processamento
next(new erro) // Erro lançado que sera tratado pelo middleware
}

```
### Erros mapeados

| Erro | Http Status |
| -------- | -------- |
| ValidationError   | 422 |
| NotFound   | 404   |
|FormatError|400|
|Unauthorized|403|
|InvalidToken|401|
|InvalidCredentials|401|
|InvalidApplication|401|
|Erros passados em opts|Status mapeado para o erro|
|Outros erros|500 * é feito o log da stack do erro|

