# 🛹 SkateSpot

Uma aplicação web moderna para skatistas registrarem e descobrirem skate spots pelo mundo. Construída com React, TypeScript, Tailwind CSS, Shadcn UI e OpenStreetMap.

## 🎯 Funcionalidades

- **Mapa interativo**: Clique em qualquer ponto do mapa para registrar um novo spot
- **Tipos de spot**: Categorize spots como `Street`, `Park`, `Plaza`, `Downhill` ou `Other`
- **Armazenamento persistente**: Todos os check-ins são salvos localmente no navegador
- **Marcadores customizados**: Marcadores com cores diferentes conforme o tipo do spot
- **Design responsivo**: Funciona bem em desktop e dispositivos móveis

## 🚀 Desenvolvimento local

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone <your-repo-url>
cd skatespot
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra no navegador:
```
http://localhost:5173
```

### Scripts disponíveis

- `npm run dev` — Inicia o servidor de desenvolvimento (Vite)
- `npm run build` — Compila para produção
- `npm run preview` — Pré-visualiza a build de produção localmente
- `npm run lint` — Executa o ESLint

## 📦 Tech Stack

- **Framework**: Vite + React 19
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS v3
- **Componentes UI**: Shadcn UI
- **Mapas**: Leaflet + React-Leaflet (OpenStreetMap)
- **Gerenciamento de estado**: Zustand com persistência
- **Validação de formulários**: React Hook Form + Zod
- **Ícones**: Lucide React

## 🌐 Deploy no Vercel

### Opção 1: Via Vercel CLI

1. Instale o Vercel CLI globalmente:
```bash
npm install -g vercel
```

2. Faça login no Vercel:
```bash
vercel login
```

3. Faça o deploy:
```bash
vercel
```

4. Para produção:
```bash
vercel --prod
```

### Opção 2: Via Dashboard do Vercel

1. Envie o código para um repositório Git (GitHub, GitLab ou Bitbucket)

2. Acesse https://vercel.com e faça login

3. Clique em "Add New Project"

4. Importe seu repositório

5. Configure o projeto:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

6. Clique em "Deploy"

Seu app ficará disponível em `https://your-project-name.vercel.app`

### Variáveis de ambiente

Nenhuma variável de ambiente é necessária para o setup básico. Todos os dados são armazenados localmente no `localStorage` do navegador.

## 🗺️ Como usar

1. **Ver o mapa**: O app carrega com um mapa interativo centralizado na sua localização (ou em São Paulo por padrão)

2. **Adicionar um spot**: Clique em qualquer ponto do mapa para abrir o diálogo de check-in

3. **Preencher os detalhes**:
   - **Nome do spot**: Dê um nome memorável ao spot
   - **Tipo**: Selecione o tipo do spot (`Street`, `Park`, `Plaza`, `Downhill`, `Other`)
   - **Descrição**: Adicione detalhes como melhor horário para ir, nível de segurança, etc.

4. **Visualizar spots**: Clique em um marcador para ver os detalhes em um popup

5. **Persistência**: Todos os check-ins são salvos automaticamente e persistirão mesmo após fechar o navegador

## 🎨 Personalização

### Alterar localização padrão

Edite `src/components/Map/SkateMap.tsx`:

```typescript
const defaultPosition: [number, number] = [-23.5505, -46.6333]; // Suas coordenadas
```

### Adicionar novos tipos de spot

Edite `src/store/useSkateStore.ts`:

```typescript
export type SpotType = 'Street' | 'Park' | 'Downhill' | 'Plaza' | 'Other' | 'YourNewType';
```

### Customizar cores dos marcadores

Edite a função `createCustomIcon` em `src/components/Map/SkateMap.tsx`.

## 📝 Aperfeiçoamentos futuros

- Integração com backend para compartilhar spots entre usuários
- Autenticação de usuários
- Upload de fotos para os spots
- Sistema de avaliações
- Recursos sociais (comentários, curtidas)
- Sistema de verificação de spots
- Aplicativo móvel (React Native)

## 📄 Licença

Licença MIT — sinta-se à vontade para usar este projeto

## 🤝 Contribuição

Contribuições são bem-vindas! Abra issues ou envie pull requests.

---

Feito com ❤️ para a comunidade skate
