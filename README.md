# TP-ENGSOFT2 Controle de Compras

## Integrantes

Gabriel Martins Medeiros Fialho
Gabriel Torres Bolognani
Mariano Glauber Torres Fernandes
Samuel Henrique Miranda Alves

## Descrição do projeto

Esse projeto é um combinador de ordens de negociação que simula uma bolsa de valores simplificada, onde os usuários podem criar ordens de compra e venda para um único ativo, como a ação de uma empresa. O aplicativo combina ordens com base em seu preço e no momento em que foram colocadas, garantindo um processo de negociação justo e eficiente. Ele mantém o estado de ordens de compra, venda e cumpridas em listas separadas. Seguindo a regra de "prioridade de preço-tempo", ordens com o maior preço de compra ou o menor preço de venda são priorizadas, e em caso de empate, a ordem que foi colocada mais cedo tem precedência.

Por exemplo, digamos que temos três ordens de compra para uma ação: Ordem A com um preço de $50 colocada às 10:00, Ordem B com um preço de $51 colocada às 10:05, e Ordem C com um preço de $50 colocada às 10:10. Neste caso, a Ordem B seria priorizada primeiro devido ao seu preço mais alto, seguida pela Ordem A porque foi colocada antes da Ordem C no mesmo preço.

## Tecnologias utilizadas

O projeto foi feito utilizando:
- React
Uma biblioteca para desenvolver a interface de usuário através de componentes reutilizáveis.
    
- TypeScript 
Uma linguagem de programação que extende o JavaScript, inserindo recursos de tipagem estática, melhorando a escrita do código, facilitando a manutenção e diminuindo a quantidade de possíveis erros.

- ESLint
Uma ferramenta de análise de código para melhorar a formatação do código durante o desenvolvimento, com regras configuráveis para garantir a consistência do código.

## Getting Started

1. Run `npm install`

To start the development server, run:

`npm start`

To run the tests, run:

`npm test`