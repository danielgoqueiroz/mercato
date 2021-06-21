# mercato

Acompanhamento de concorrentes

- Dado uma lista de 'termos', 'alvo' e um 'límite de páginas', retornar:
- - Resultados de pesquisa do Google paginados
- - - { Link, Título, Texto }
- - Lista de termos de pesquisa 'pesquisas relacionadas'
- - Lista de resultados de propagandas
    Json:

```
report: {
    term: string,
    target: string,
    pageLimit: integer,
    date: date,
    relatedQuestions: [ string ],
    raltedSearch: [ string ],
    results: [
        {
            page: int,
            links: [
                {
                    link: string,
                    isAd: boolean,
                    title: string,
                    description: string
                }
            ]
        }
    ]
}
```

- Salvar resultados
- - Jsons Locais com nome yyyy-MM-dd_termo.json
- - Bando de dados Mongo

- Filtro
- Dado uma lista de resultados:
- - Informar resultados aplicando filtro em 'título', 'texto' ou 'link' informando a posição do resultado

## Configurações

Deve realizar pesquisas períodicas conforme configuração.
As configureações podem ser vistas com endpoint

### GET /schedule

### POST /shedule

Envia:

```
{
    interval: Interval;
    terms: [];
    target: string
}
```

Retorna:

```
{
    interval: Interval;
    terms: [];
    target: string
}
```

Atualiza configurações para realização de pesquisa

```
{
    terms: [
        "termo 1"
    ],
    interval: {
        minutes: 30
    }
}
```

Demais funcionalidades

- Realizar a pesquisa por geolocalização, utilizando proxy ou vpn
- Agendamento de pesquisas (ex. 1 por dia)
- Geração de relatórios visuais
- - Dado um termo, quantas vezes aparece nos resultados de pesquisa
- buscar informações sobre as empresas encontradas
- - contatos
- - resumo de conteúdos publicados pela empresa (sobre o que ela fala)
- - redes sociais
- - tamanho de site
- - Print do site em pdf

# Puppeteer

Doc - https://pptr.dev/

Tutorial - https://www.codota.com/code/javascript/functions/puppeteer/Page/click

# Mocha

Doc - https://mochajs.org/


## Docker 
### Mongo 
docker run -v ~/docker --name mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=mongo -e MONGO_INITDB_ROOT_PASSWORD=mercato mongo

