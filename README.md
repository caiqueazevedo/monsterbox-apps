# monsterbox-apps

# 📦 Calculadora de Viabilidade & Pedidos Shopee (Monsterbox)

![Status do Projeto](https://img.shields.io/badge/Status-Conclu%C3%ADdo-brightgreen)
![Tech Stack](https://img.shields.io/badge/Stack-HTML%20%7C%20JS%20%7C%20Bootstrap-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

Uma aplicação web intuitiva para vendedores da Shopee importarem pedidos, calcularem taxas automaticamente, analisarem a margem de lucro (ROI) e gerarem relatórios em PDF profissionais.

---

## 🚀 Funcionalidades

-   **📄 Importação Flexível:** Suporte para arquivos Excel (`.xlsx`, `.xls`) e `.csv` via SheetJS.
-   **🧮 Cálculo Automático de Taxas:**
    -   Comissão Padrão (12%)
    -   Taxa de Transação (2%)
    -   Taxa Fixa por Item (R$ 4,00 ou proporcional)
    -   Suporte a Programa de Frete Grátis (Toggle opcional).
-   **📊 Análise de Lucratividade (ROI):**
    -   🔴 **Vermelho:** Prejuízo real.
    -   🟡 **Amarelo:** Lucro positivo, mas abaixo da meta de 40%.
    -   🟢 **Verde:** Lucro saudável (acima de 40% sobre o custo).
-   **📱 Design Responsivo:**
    -   **Desktop:** Tabela detalhada com edição inline.
    -   **Mobile:** Cards otimizados para visualização rápida em celulares.
-   **🖨️ Exportação de Relatórios:** Geração de PDF vetorial limpo usando `jsPDF`, com títulos personalizáveis e resumo financeiro.
-   **✏️ Edição em Tempo Real:** Altere custos, preços de venda ou nomes de produtos e veja os totais recalculados instantaneamente.

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:** HTML5, CSS3
* **Framework UI:** [Bootstrap 5.3](https://getbootstrap.com/) (Tema Escuro/Dark Mode)
* **Lógica:** JavaScript (ES6+)
* **Bibliotecas:**
    * [SheetJS (xlsx)](https://sheetjs.com/) - Para leitura de planilhas.
    * [jsPDF](https://parall.ax/products/jspdf) & [AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable) - Para geração de relatórios.

---

## 🧠 Lógica de Cálculo (Shopee)

A aplicação utiliza a seguinte lógica para determinar a viabilidade do produto:



1.  **Taxas:** `(Preço * 14%) + Taxa Fixa + (Opcional Frete: 6%)`.
2.  **Lucro Unitário:** `Preço Venda - (Custo Produto + Taxas)`.
3.  **Meta de Lucro:** O sistema define a meta como **40% sobre o Custo Total**.
4.  **Validação:** O sistema sanitiza inputs para evitar erros de `NaN` (Not a Number) ao editar valores monetários (ex: `R$ 1.200,50` vira `1200.50`).

---

## 📸 Visualização

### Modo Desktop
Tabela completa com cálculos linha a linha.

*(Insira aqui um print da sua tela no PC)*

### Modo Mobile
Cards expansíveis com indicadores visuais de lucro.

*(Insira aqui um print da sua tela no Celular)*

---

## 🔧 Como Executar Localmente

Como é uma aplicação estática, não requer instalação de dependências (Node.js, Python, etc).

1.  Clone este repositório:
    ```bash
    git clone [https://github.com/seu-usuario/nome-do-projeto.git](https://github.com/seu-usuario/nome-do-projeto.git)
    ```
2.  Navegue até a pasta:
    ```bash
    cd nome-do-projeto
    ```
3.  Abra o arquivo `index.html` em qualquer navegador moderno (Chrome, Edge, Firefox).

---

## 🌐 Como Colocar Online (Deploy Grátis)

Você pode hospedar este projeto gratuitamente usando o **GitHub Pages**:

1.  Suba os arquivos (`index.html`, `main.js`, `style.css` se houver) para um repositório no GitHub.
2.  Vá em **Settings** (Configurações) do repositório.
3.  Clique em **Pages** no menu lateral.
4.  Em **Branch**, selecione `main` (ou `master`) e salve.
5.  Em instantes, seu link estará pronto (ex: `https://seu-usuario.github.io/projeto`).

---

## 📄 Licença

Este projeto está sob a licença MIT. Sinta-se livre para usar e modificar.
