# 📌 Descrição do Projeto

Este projeto consiste em uma API para gerenciamento de transações utilizando múltiplos gateways de pagamento. O sistema permite autenticação de usuários com diferentes roles, manipulação de produtos, clientes e transações, além de suportar reembolsos.

## 🚀 **Principais Funcionalidades**

- CRUD de usuários, clientes e produtos.
- Gerenciamento de gateways de pagamento (ativação/desativação, prioridade e autenticação).
- Processamento de compras, considerando múltiplos produtos e integração dinâmica com gateways.
- Rota para detalhar uma compra específica.
- Suporte a reembolsos.
- Controle de acesso baseado em roles (`ADMIN`, `MANAGER`, `FINANCE`, `USER`).
- Implementação de autenticação para gateways.
- **(Pendente)** Implementação de testes unitários seguindo **TDD**.

---

## 🛠 **Tecnologias Utilizadas**

- **AdonisJS** (framework backend)
- **TypeScript**
- **PostgreSQL** (banco de dados)
- **Mock Docker com Auth** ❌ (Não implementado por falta de tempo)
- **Testes Unitários** ❌ (Não implementado por falta de tempo)

---

## 📌 **Configuração e Instalação**

### **1. Clonar o repositório**

```bash
git clone https://github.com/HeinrichLowe/betalent-practical-test.git
```

### **2. Instalar as dependências**

```bash
npm install
```

### **3. Configurar variáveis de ambiente**

Copie o arquivo `.env.example` e renomeie para `.env`, ajustando as configurações do banco de dados e gateways.

### **4. Executar migrações do banco de dados**

```bash
node ace migration:run
```

### **5. Iniciar o servidor**

```bash
node ace serve --watch
```

### **6. Iniciar o mock Docker (Sem Auth)**

```bash
docker run -p 3001:3001 -p 3002:3002 -e REMOVE_AUTH='true' matheusprotzen/gateways-mock
```

A API estará disponível em `http://localhost:3333`.

---

## 🔒 **Autenticação e Controle de Acesso**

A API utiliza autenticação JWT. Após o login, um token deve ser incluído nos headers das requisições:

```json
Authorization: Bearer <seu_token>
```

**Roles disponíveis:**

- `ADMIN` → Acesso total ao sistema.
- `MANAGER` → Gerencia produtos e usuários.
- `FINANCE` → Gerencia produtos e realiza reembolsos.
- `USER` → Pode realizar compras e visualizar suas próprias transações.

---

## 🛠 **Endpoints Principais**

### **Autenticação**

- `POST /login` → Autenticar usuário.
- `POST /logout` → Encerrar sessão.

### **Usuários**

- `GET /users` → Listar usuários (**ADMIN**).
- `POST /users` → Criar usuário (**ADMIN**).

### **Gateways**

- `GET /gateways` → Listar gateways.
- `PATCH /gateways/:id/active` → Ativar/desativar gateway.
- `PATCH /gateways/:id/priority` → Alterar prioridade do gateway.

### **Transações**

- `POST /purchase` → Realizar compra.
- `GET /transactions/:id` → Detalhar uma compra (**Finance/Admin**).
- `POST /transactions/:id/refund` → Processar reembolso (**Finance/Admin**).

---

## 📌 **Collection - (Postman, Insomnia ou outros)**

Foi disponibilizado uma collection 'betalent_practical_test.json' para que possa ser usado no Postman, Insomnia ou em outras ferramentas de sua preferência. Ela auxiliará nos testes de todas as rotas disponíveis no projeto.

## 🚀 **Próximos Passos**

- [ ] Implementar testes unitários seguindo TDD.
- [ ] Melhorar a documentação com exemplos de requisição/resposta.

---

### 📌 **Entrega Final:**

O sistema está quase completo, restando apenas testes unitários, a implementação do Docker com AUTH. Infelizmente essas implementações foram descartados por limitações de tempo.

---

###

# 📌 **Comentário e Observações:**

### **Maiores dificuldades:**

Enfrentei mais obstáculos do que gostaria de admitir durante o desenvolvimento do projeto, mas o momento de maior dificuldade foi entender os gateways. Embora já tivesse lidado com APIs de terceiros em projetos anteriores (especialmente em processos seletivos), este foi o mais complexo entre eles. Demorei bem mais tempo do que gostaria para me adaptar, mas, depois que entendi, o processo se tornou bem mais fácil.

> **Observação:** Não que os gateways sejam difíceis de entender — na verdade, eles são até bem simples. Porém, como foi a primeira vez que lidei com gateways dessa forma, admito que me confundi um pouco até começar a mexer neles. Depois disso, como mencionei, ficou fácil lidar com eles. _Haha_

## **Diferença nos Gateways:**

Como os gateways possuem a mesma estrutura de dados, mudando apenas a "tradução" dos campos, criei um novo campo na _migration_ do gateway chamado `schema`. Nele, defino qual estrutura o gateway pode ter (neste caso, `EN` para a versão em inglês do gateway 1 e `PT` ou `BR` para a versão em português do gateway 2). Desde que os novos gateways sigam um desses dois _schemas_, é possível criar quantos forem necessários.

No projeto, a função responsável por decidir qual _schema_ usar é a `paymentProcessHelper`. Claro que existem formas melhores de tornar isso ainda mais dinâmico, mas, infelizmente, não tive muito tempo disponível para implementar algo mais elaborado.

---

# 📌 **Considerações Finais:**

Infelizmente, por falta de tempo, não consegui implementar e/ou melhorar tudo o que gostaria. Como nunca havia trabalhado com AdonisJS, precisei dedicar um tempo para aprender a utilizá-lo, e isso fez falta no final do processo.

Sei que há partes do projeto que poderiam ter sido feitas de forma melhor. Como mencionei antes, eu tinha planos para melhorar algumas delas, mas, conforme o prazo foi se esgotando, tive que abrir mão de algumas melhorias para garantir que o projeto estivesse funcional.

Admito também que, em alguns casos, a falta de experiência me limitou. Mesmo me considerando, na melhor das hipóteses, um desenvolvedor júnior um pouco mais avançado, ainda há muito para aprender até me tornar o profissional que almejo ser. _Haha_

---

## **Algumas Melhorias e/ou Implementações que ficaram de fora:**

### **Melhorias:**

- Gostaria de ter elaborado um sistema melhor de _roles_. Embora o atual funcione, ele é muito rígido e pouco dinâmico. Isso significa que, caso seja necessário criar ou alterar uma _role_, será preciso modificar o código, o que não é uma boa prática.

- Também gostaria de ter desenvolvido uma solução melhor para lidar com as diferenças entre os gateways. Embora a abordagem atual funcione, ainda acho que ela é muito suscetível a falhas.

### **Implementações:**

- A principal implementação que ficou de fora — e que considero a mais crítica — foram os testes (unitários e de integração). Sei que por trás de todo código robusto sempre há uma série de testes que garantem seu pleno funcionamento, especialmente para futuras melhorias e expansão do projeto. Portanto, considero esse o meu maior "arrependimento" neste projeto. _Haha_

- Gostaria de ter implementado o _Docker Compose_ para facilitar a execução do projeto. Normalmente, costumo configurá-lo em meus projetos, pois acho prático para quem deseja testar o código. No entanto, tive muitos problemas durante o desenvolvimento, e, com o prazo se esgotando, não conseguiria resolvê-los a tempo. Foi mais uma funcionalidade que precisei abrir mão para garantir que o projeto estivesse funcional dentro do prazo.
