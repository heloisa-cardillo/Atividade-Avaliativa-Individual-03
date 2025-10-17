const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// EJS renderizando 
app.set('view engine', 'ejs');
app.set('views', [
    path.join(__dirname, 'views'),
    path.join(__dirname, 'public/core')
]);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/pdfs', express.static(path.join(__dirname, 'pdfs')));
app.use('/image', express.static(path.join(__dirname, 'image')));
app.use('/app', express.static(path.join(__dirname, 'app')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// infos

const estudante = {
    nome: "Heloisa Cardillo",
    nomeCompleto: "Heloisa Cardillo Lima",
    curso: "Desenvolvimento de Software Multiplataformas",
    instituicao: "FATEC São José dos Campos",
    anoIngresso: 2025
};

const disciplinas = [
    "Modelagem de Banco de Dados",
    "Desenvolvimento Web I",
    "Algoritmo e Lógica de Programação",
    "Engenharia de Software I",
    "Design Digital",
    "Sistemas Operacionais e Redes de Computadores",
    "Banco de Dados Relacional",
    "Desenvolvimento Web II",
    "Técnicas de Programação I",
    "Engenharia de Software II",
    "Estrutura de Dados",
    "Matemática para Computação"
];

let projetos = [
    {
        id: 1,
        titulo: "API 1º Semestre 2025",
        descricao: "Criação de um site com banco de dados mostrando os principais produtos importados e exportados nos municípios de São Paulo.",
        papel: "Desenvolvedora Front-End",
        detalhes: "Criação do protótipo visual no Figma e implementação de um gráfico em formato de funil com Chart.js e CSS.",
        tecnologias: ["pandas", "Google Colab", "GitHub", "CSS", "HTML", "JavaScript", "Chart.js"]
    },
    {
        id: 2,
        titulo: "API 2º Semestre 2025",
        descricao: "Criação de uma plataforma única que centralize e padronize processos administrativos, comerciais e operacionais da empresa Newe Log.",
        papel: "Product Owner e Desenvolvedora Front-End",
        detalhes: "Criação e gerenciamento do backlog do produto, definição de prioridades, negociação com cliente, acompanhamento das sprints, elaboração de wireframes e implementação de funcionalidades no front-end.",
        tecnologias: ["HTML", "JavaScript", "CSS", "Typescript", "NodeJS", "React", "Git", "Figma", "Jira"]
    },
    {
        id: 3,
        titulo: "Site Centro de Memórias Fatec",
        descricao: "Reestruturação do código da página Centro de Memória do site da Fatec São José dos Campos.",
        papel: "Desenvolvedora Front-End e de Software",
        detalhes: "Aprimoramento do layout e interatividade da interface para torná-la mais moderna, atrativa e funcional.",
        tecnologias: ["HTML", "CSS", "JavaScript"],
        link: "https://heloisa-cardillo.github.io/site-memoria/"
    },
    {
        id: 4,
        titulo: "Aplicativo Julius Tracker",
        descricao: "Aplicativo para auxiliar no acompanhamento da rotina de medicação.",
        papel: "Desenvolvedora",
        detalhes: "Permite registro de data, medicamento e dosagem, organizando em rotina diária.",
        tecnologias: ["Android Studio", "Kotlin", "Figma"]
    }
];

const contato = {
    email: "heloisacardillo@gmail.com",
    telefone: null,
    linkedin: "https://www.linkedin.com/in/heloisa-cardillo-lima/",
    github: "https://github.com/heloisa-cardillo"
};

app.get('/cursos', (req, res) => {
    res.render('cursos');
});

// rotas


app.get('/', (req, res) => {
    res.render('index', { nome: estudante.nome });
});


app.get('/sobre', (req, res) => {
    res.render('sobre', { estudante });
});


app.get('/disciplinas', (req, res) => {
    res.render('disciplinas', { disciplinas });
});


app.get('/projetos', (req, res) => {
    res.render('projetos', { projetos });
});

app.get('/cursos', (req, res) => {
    res.render('cursos', { cursos });
});

app.get('/contato', (req, res) => {
    res.render('contato', { contato });
});


app.get('/dashboard', (req, res) => {
    const todasTecnologias = projetos.flatMap(p => p.tecnologias);
    const contagemTecnologias = {};

    todasTecnologias.forEach(tech => {
        contagemTecnologias[tech] = (contagemTecnologias[tech] || 0) + 1;
    });

    const tecnologiasOrdenadas = Object.entries(contagemTecnologias)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const estatisticas = {
        totalDisciplinas: disciplinas.length,
        projetosConcluidos: projetos.length,
        tecnologiasMaisUsadas: tecnologiasOrdenadas
    };

    res.render('dashboard', { estatisticas });
});

// ==================== CRUD ====================

// GET - Listar todos os projetos (JSON)
app.get('/api/projetos', (req, res) => {
    res.json(projetos);
});

// POST - Adicionar novo projeto
app.post('/api/projetos', (req, res) => {
    const novoProjeto = {
        id: projetos.length + 1,
        titulo: req.body.titulo,
        descricao: req.body.descricao,
        papel: req.body.papel,
        detalhes: req.body.detalhes,
        tecnologias: req.body.tecnologias || []
    };
    projetos.push(novoProjeto);
    res.status(201).json(novoProjeto);
});

// PUT - Atualizar projeto existente
app.put('/api/projetos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = projetos.findIndex(p => p.id === id);

    if (index !== -1) {
        projetos[index] = {
            id: id,
            titulo: req.body.titulo || projetos[index].titulo,
            descricao: req.body.descricao || projetos[index].descricao,
            papel: req.body.papel || projetos[index].papel,
            detalhes: req.body.detalhes || projetos[index].detalhes,
            tecnologias: req.body.tecnologias || projetos[index].tecnologias
        };
        res.json(projetos[index]);
    } else {
        res.status(404).json({ mensagem: 'Projeto não encontrado' });
    }
});

// DELETE - Remover projeto
app.delete('/api/projetos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = projetos.findIndex(p => p.id === id);

    if (index !== -1) {
        const projetoRemovido = projetos.splice(index, 1);
        res.json({ mensagem: 'Projeto removido com sucesso', projeto: projetoRemovido });
    } else {
        res.status(404).json({ mensagem: 'Projeto não encontrado' });
    }
});

// ==================== INICIAR SERVIDOR ====================

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});