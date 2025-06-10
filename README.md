# Hub Acadêmico

## Sobre o Projeto

O Hub Acadêmico é uma funcionalidade integrada ao aplicativo acadêmico do Inatel que permite aos alunos comprar, vender e acessar materiais acadêmicos, além de agendar mentorias com colegas. Tem como foco a otimização do tempo de estudo e facilitação do acesso a recursos e apoio acadêmico.Add commentMore actions

Para garantir a sustentabilidade, o contínuo desenvolvimento da plataforma e a geração de receita para o Inatel, uma taxa de aproximadamente 5% é aplicada sobre cada pagamento realizado, seja pela compra de materiais ou agendamento de mentorias.

Foi desenvolvido para o projeto final da disciplina de Interface Homem-Máquina.

## Funcionalidades

- **Exploração de Materiais:** Navegue pelos materiais didáticos organizados por categoria.
- **Mentoria Personalizada:** Encontre e agende sessões com mentores nas áreas de seu interesse.
- **Carrinho de Compras:** Sistema completo para adicionar materiais e mentorias ao carrinho e finalizar a compra.
- **Gerenciamento de Agenda:** Visualize suas mentorias agendadas e gerencie compromissos futuros.

## Tecnologias Utilizadas

**Frontend:**
- HTML5
- CSS3 (Design responsivo mobile-first)
- JavaScript Vanilla (ES6+)

**Armazenamento:**
- LocalStorage para persistência de dados do usuário

**Bibliotecas:**
- Font Awesome para ícones

## Estrutura do Projeto

```
/
├── index.html                # Arquivo HTML principal
├── data/                     # Arquivos JSON com dados simulados
│   ├── materials.json        # Dados de materiais
│   ├── mentors.json          # Dados dos mentores
│   └── ...
├── js/
│   ├── components.js         # Componentes reutilizáveis da UI
│   ├── data.js               # Gerenciamento de dados
│   ├── router.js             # Sistema de roteamento SPA
│   ├── utils.js              # Funções utilitárias
│   └── mentor-scheduling.js  # Funcionalidade de agendamento
└── styles/
    ├── main.css              # Estilos globais e variáveis
    ├── components.css        # Estilos dos componentes
    ├── pages.css             # Estilos específicos de páginas
    ├── modals.css            # Estilos de modais
    └── scheduling.css        # Estilos do sistema de agendamento
```

## Recursos Adicionais

A aplicação funciona totalmente no lado do cliente, utilizando dados simulados para demonstração das funcionalidades. Para uma implementação em produção, seria necessário conectar com um backend apropriado.