# Convite do Dom · 1 ano

Site estático de uma página para o aniversário do Dom (24 de outubro de 2026). Sem build, sem servidor: abra o `index.html` ou publique no GitHub Pages.

## Trocar foto e cores

- **Foto:** substitua [`assets/foto_perfil.jpeg`](assets/foto_perfil.jpeg) ou atualize o `src` da foto no [`index.html`](index.html).
- **Música:** coloque o arquivo em [`assets/tema.mp3`](assets/tema.mp3). O convite tenta tocar sozinho; se o navegador bloquear, o botão **Tocar tema** continua no canto da tela.
- **Cores e fontes:** edite as variáveis no começo de [`styles.css`](styles.css):

```css
:root {
  --cor-fundo: #fff6ee;
  --cor-destaque: #e85d4c;
  --cor-apoio: #2a9d8f;
  /* ... */
}
```

## Confirmações (Google Form invisível)

O convite tem um formulário **com a cara da festa**. Por trás, as respostas vão para uma planilha do Google. O convidado não vê a tela do Google Forms.

### 1. Criar o formulário

1. Abra [Google Forms](https://forms.google.com) com a sua conta Google.
2. Clique em **Em branco**.
3. Título: `Confirmação — aniversário do Dom`.
4. Crie **exatamente** estas perguntas, nesta ordem:

| Pergunta | Tipo | Obrigatória | Opções / detalhe |
| --- | --- | --- | --- |
| Nome | Resposta curta | Sim | — |
| Vai? | Múltipla escolha | Sim | `Eu vou` e `Não vou` (texto idêntico) |
| Quantas pessoas | Resposta curta | Não | — |
| Recadinho | Parágrafo | Não | — |

5. Em **Respostas**, clique no ícone verde de planilha para ligar uma Google Sheet. É nessa planilha que você vê quem confirmou.

### 2. Pegar o ID do formulário

1. No Forms, clique em **Enviar**.
2. Copie o link. Ele parece com:

`https://docs.google.com/forms/d/e/XXXXX/viewform`

3. O `XXXXX` (entre `/e/` e `/viewform`) é o `formId`.

### 3. Pegar os códigos `entry.`

O jeito mais fácil:

1. No Forms, menu **⋮** → **Obter link pré-preenchido**.
2. Preencha Nome, Vai, Quantas pessoas e Recadinho com qualquer coisa e clique em **Obter link**.
3. O link vem assim:

`.../viewform?usp=pp_url&entry.111=Ana&entry.222=Eu+vou&entry.333=2&entry.444=Oi`

4. Anote:

- `entry.111` → Nome
- `entry.222` → Vai?
- `entry.333` → Quantas pessoas
- `entry.444` → Recadinho

### 4. Colar no site

No começo de [`script.js`](script.js):

```javascript
const RSVP_GOOGLE = {
  formId: "XXXXX",
  entries: {
    nome: "entry.111",
    vai: "entry.222",
    pessoas: "entry.333",
    recado: "entry.444",
  },
};
```

Salve, recarregue o convite e envie um teste. A linha nova tem que aparecer na planilha.

As opções **Vou** / **Não vou** precisam ter exatamente esse texto no Google Form.

## Fotos e vídeos no Google Drive (sem login)

O convidado escolhe o arquivo **no convite**. Por trás, um Apps Script na sua conta grava na pasta do Drive. Ninguém precisa entrar no Google.

Limite prático: **8 MB por arquivo** (fotos ok; vídeo só se for curto). Isso é limitação do Apps Script, não do site.

### 1. Pasta no Drive

1. Abra o [Google Drive](https://drive.google.com) e crie a pasta, por exemplo `Festa Dom`.
2. Abra a pasta. O ID está na URL:

`https://drive.google.com/drive/folders/ESTE_ID`

### 2. Apps Script

1. Abra [script.google.com](https://script.google.com) → **Novo projeto**.
2. Apague o código padrão e cole o conteúdo de [`drive-upload/Codigo.gs`](drive-upload/Codigo.gs).
3. Troque `COLE_O_ID_DA_PASTA_AQUI` pelo ID da pasta.
4. **Implantar** → **Nova implantação**.
5. Tipo: **App da Web**.
6. **Executar como:** Eu (sua conta).
7. **Quem tem acesso:** Qualquer pessoa.
8. Autorize o Drive quando o Google pedir.
9. Copie a URL da implantação (termina com `/exec`).

### 3. Colar no site

No [`script.js`](script.js):

```javascript
const DRIVE_UPLOAD_URL = "https://script.google.com/macros/s/XXXX/exec";
```

Envie uma foto de teste pelo convite e confira se ela aparece na pasta.

## Publicar de graça no GitHub Pages

URL final: `https://SEU-USUARIO.github.io/Niver_Dom`

1. Crie um repositório no GitHub chamado `Niver_Dom` (pode ser público).
2. Na pasta deste projeto:

```bash
git init
git add .
git commit -m "Convite estático do Dom"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/Niver_Dom.git
git push -u origin main
```

3. No GitHub: **Settings → Pages → Build and deployment**.
4. Em **Source**, escolha **Deploy from a branch**.
5. Branch `main`, pasta `/ (root)` → **Save**.
6. Espere 1–2 minutos e abra `https://SEU-USUARIO.github.io/Niver_Dom`.

Não é preciso domínio pago. O certificado HTTPS vem junto com o `github.io`.

### Outra opção gratuita

O mesmo HTML pode ir para o [Cloudflare Pages](https://pages.cloudflare.com/) e ficar em `algo.pages.dev`, sem mudar o código.

## Arquivos

| Arquivo | Função |
| --- | --- |
| `index.html` | Conteúdo das seções |
| `styles.css` | Visual (variáveis no topo) |
| `script.js` | Menu mobile e scroll suave |
| `assets/` | Foto e favicon |

Data, horário e endereço estão no `index.html` — edite o texto se algo mudar.
