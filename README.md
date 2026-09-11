# MedClinic API

API REST da etapa 1 do sistema de gerenciamento de clínica médica. Este projeto entrega exclusivamente a base de acesso: cadastro de usuários, autenticação JWT e autorização por perfil (RBAC). Os módulos de especialidades, médicos, pacientes e consultas não fazem parte deste escopo.

## Tecnologias

- Node.js 20+
- TypeScript
- Express 5
- PostgreSQL
- TypeORM
- bcryptjs
- JSON Web Token (JWT)
- ESLint e Prettier

## Pré-requisitos

- Node.js 20 ou superior
- PostgreSQL em execução
- Um banco de dados vazio, por exemplo `medclinic`

## Instalação e configuração

```bash
git clone https://github.com/Cleitoncme/medclinic-api.git
cd medclinic-api
npm install
```

Crie o arquivo `.env` a partir de `.env.example` e informe as credenciais locais do PostgreSQL:

```env
PORT=3333
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=medclinic
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
JWT_SECRET=use-uma-chave-longa-e-segura
JWT_EXPIRES_IN=1h
```

Compile o projeto e aplique a migration que cria a tabela `users`:

```bash
npm run build
npx typeorm migration:run -d dist/database/data-source.js
```

Para desfazer a última migration:

```bash
npx typeorm migration:revert -d dist/database/data-source.js
```

## Execução e qualidade

```bash
# desenvolvimento
npm run dev

# produção (compile antes)
npm run build
npm start

# verificações de código
npm run lint
npm run format:check
```

Por padrão, a API responde em `http://localhost:3333`. Use `GET /health` para confirmar que o Express está ativo.

## Arquitetura

O projeto organiza responsabilidades em camadas, preparado para receber os futuros domínios da clínica.

```text
src/
├── config/          # leitura e validação das variáveis de ambiente
├── controllers/     # entrada HTTP e respostas
├── database/        # DataSource TypeORM e migrations
├── dtos/            # contratos de entrada e saída
├── entities/        # entidades TypeORM
├── middlewares/     # autenticação, RBAC e erros globais
├── repositories/    # acesso aos dados via TypeORM
├── routes/          # definição de endpoints
├── services/        # regras de negócio
├── types/           # extensão tipada do Express Request
├── utils/           # hash de senha e erros da aplicação
├── app.ts           # configuração do Express
└── server.ts        # conexão com banco e inicialização HTTP
```

Fluxo principal: `Route → Middleware → Controller → Service → Repository → PostgreSQL`.

## Dados e segurança

`User` possui `id` UUID, `name`, `email` único, `passwordHash`, `role` e `createdAt`. A senha é transformada em hash bcrypt com 12 rounds, não é devolvida nas respostas e a coluna usa `select: false` no TypeORM.

O token JWT contém o identificador (`id`) e o perfil (`role`), possui expiração configurável por `JWT_EXPIRES_IN` e é enviado nas rotas protegidas no header:

```http
Authorization: Bearer <token>
```

Perfis disponíveis:

| Perfil | Permissões nesta etapa |
| --- | --- |
| `ADMIN` | Acessa rotas autenticadas e `GET /admin/ping`. |
| `ATTENDANT` | Acessa rotas autenticadas, mas recebe 403 em rotas administrativas. |

## Endpoints

### Health check

`GET /health`

Resposta `200`:

```json
{ "status": "ok" }
```

### Cadastro

`POST /auth/register`

```json
{
  "name": "Ana Silva",
  "email": "ana@example.com",
  "password": "SenhaSegura123",
  "role": "ADMIN"
}
```

`name`, `email` e `password` são obrigatórios. O e-mail precisa ser válido, a senha precisa ter no mínimo oito caracteres e `role` é opcional (o padrão é `ATTENDANT`).

Resposta `201`:

```json
{
  "user": {
    "id": "uuid",
    "name": "Ana Silva",
    "email": "ana@example.com",
    "role": "ADMIN",
    "createdAt": "2026-09-10T00:00:00.000Z"
  }
}
```

### Login

`POST /auth/login`

```json
{
  "email": "ana@example.com",
  "password": "SenhaSegura123"
}
```

Resposta `200`:

```json
{ "token": "jwt-assinado" }
```

Credenciais inválidas retornam `401`, sem identificar qual campo falhou.

### Usuário autenticado

`GET /users/me`

Exige token válido. Retorna `200` com os dados públicos do usuário autenticado.

### Verificação administrativa

`GET /admin/ping`

Exige token válido de um usuário `ADMIN`.

Resposta `200`:

```json
{ "message": "Administrator access granted." }
```

Com token de `ATTENDANT`, retorna `403`.

## Erros

As falhas são tratadas por middleware centralizado e usam a estrutura abaixo:

```json
{
  "statusCode": 401,
  "message": "Authentication token is required."
}
```

Situações previstas incluem validação inválida (`400`), credenciais ou token inválidos (`401`), permissão insuficiente (`403`), rota/usuário inexistente (`404`) e e-mail duplicado (`409`). Falhas inesperadas retornam `500` sem expor detalhes internos.

## Versionamento

O desenvolvimento utiliza as branches `main`, `develop`, `feat/setup-projeto`, `feat/database`, `feat/auth`, `feat/rbac` e `docs/readme`, com commits semânticos que registram a evolução das funcionalidades.
