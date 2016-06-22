# Instruçoes Para Utilizar o modulo query-handler



## Caso tenha o module localmente

```javascript
1. adicione ao package.json a dependencia:
	dependencies:{"query-handler":"file:caminho para modulo"}

2. rode o comando npm install


3. no seu projeto chame o modulo:
	var query_handler = require('query-handler');

4. use como um middleware do express
	app.use(query_handler());

```

## Funcionamento

```javascript
1. O modulo ira fazer os parses seguintes
	1.or=field1=value1,field2=value2 => or:[{field1:value1,field2:value2}]]
	2.and=field1=value1,field2=value2 => and:[{field1:value1,field2:value2}]]
	3.limit=qtd* => limit:qtd *qtd é o numero a ser limitado
	4.skip=qtd* => skip:qtd *qtd é o numero a ser pulado
	5.sort=field1,-field2* => sort:"field1 -field2" *o sinal negativo é para ordenar descendentemente
	7.select=field1,field2 => select:"field1 field2"
	8.caso não seja nenhum dos 5 acima será considerado um campo e adicional a field

2.Caso haja algum erro na query, os erros serao adicionados ao objeto erros;

3.todos os campos estarão disponiveis em req.query_handler

```
