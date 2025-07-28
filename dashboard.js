document.addEventListener('DOMContentLoaded', function() {
    // Carrega dados do usuário
    const user = UserStorage.getUser();
    
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    // Atualiza informações do usuário na UI
    document.getElementById('userName').textContent = user.name;
    document.getElementById('personalizedWelcome').textContent = `Olá, ${user.name.split(' ')[0]}!`;
    document.getElementById('welcomeMessage').textContent = `Bem-vindo de volta, ${user.name.split(' ')[0]}!`;
    document.getElementById('userPoints').textContent = `${user.points || 0} pontos`;
    
    // Atualiza barra de progresso (simulado)
    const progressPercentage = Math.min(Math.floor((user.points || 0) / 10), 100);
    document.getElementById('progressPercentage').textContent = `${progressPercentage}%`;
    document.getElementById('progressFill').style.width = `${progressPercentage}%`;
    
    // Dados simulados de oportunidades
    const opportunities = [
        {
            id: 1,
            title: "Estágio em Desenvolvimento Web",
            company: "Tech Solutions Inc.",
            location: "Remoto",
            type: "Estágio",
            area: "tecnologia",
            description: "Estágio para estudantes de TI com conhecimentos em HTML, CSS e JavaScript.",
            image: "images/op1.jpg"
        },
        {
            id: 2,
            title: "Auxiliar de Enfermagem",
            company: "Hospital Municipal",
            location: "São Paulo, SP",
            type: "Tempo Integral",
            area: "saude",
            description: "Vaga para auxiliar de enfermagem com curso técnico completo.",
            image: "images/op2.jpg"
        },
        {
            id: 3,
            title: "Assistente Administrativo",
            company: "Empresa XYZ",
            location: "Rio de Janeiro, RJ",
            type: "Meio Período",
            area: "administracao",
            description: "Vaga para assistente administrativo com conhecimentos em pacote Office.",
            image: "images/op3.jpg"
        }
    ];
    
    // Dados simulados de cursos
    const courses = [
        {
            id: 1,
            title: "Introdução ao JavaScript",
            provider: "Digital School",
            duration: "20 horas",
            area: "tecnologia",
            description: "Aprenda os fundamentos de JavaScript para desenvolvimento web.",
            image: "images/course1.jpg"
        },
        {
            id: 2,
            title: "Primeiros Socorros Básicos",
            provider: "Saúde em Foco",
            duration: "15 horas",
            area: "saude",
            description: "Curso básico de primeiros socorros para situações de emergência.",
            image: "images/course2.jpg"
        }
    ];
    
    // Filtra oportunidades baseadas nos interesses do usuário
    const filteredOpportunities = opportunities.filter(op => 
        user.interests.includes(op.area)
    );
    
    // Filtra cursos baseados nos interesses do usuário
    const filteredCourses = courses.filter(course => 
        user.interests.includes(course.area)
    );
    
    // Renderiza oportunidades
    const opportunitiesGrid = document.getElementById('opportunitiesGrid');
    
    filteredOpportunities.forEach(op => {
        const opportunityCard = document.createElement('div');
        opportunityCard.className = 'opportunity-card';
        opportunityCard.innerHTML = `
            <div class="opportunity-image" style="background-image: url('${op.image}')"></div>
            <div class="opportunity-info">
                <h4>${op.title}</h4>
                <div class="opportunity-meta">
                    <span>${op.company}</span>
                    <span>${op.location}</span>
                </div>
                <p>${op.description}</p>
                <div class="opportunity-actions">
                    <button class="btn btn-primary btn-small">Ver Detalhes</button>
                    <button class="favorite-btn" data-id="${op.id}">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        `;
        opportunitiesGrid.appendChild(opportunityCard);
    });
    
    // Renderiza cursos
    const coursesGrid = document.getElementById('coursesGrid');
    
    filteredCourses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        courseCard.innerHTML = `
            <div class="course-image" style="background-image: url('${course.image}')"></div>
            <div class="course-info">
                <h4>${course.title}</h4>
                <div class="course-meta">
                    <span>${course.provider}</span>
                    <span>${course.duration}</span>
                </div>
                <p>${course.description}</p>
                <div class="course-actions">
                    <button class="btn btn-primary btn-small">Inscrever-se</button>
                    <button class="favorite-btn" data-id="${course.id}">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        `;
        coursesGrid.appendChild(courseCard);
    });
    
    // Filtro de oportunidades
    document.getElementById('opportunityFilter').addEventListener('change', function(e) {
        const area = e.target.value;
        
        if (area === 'all') {
            document.querySelectorAll('.opportunity-card').forEach(card => {
                card.style.display = 'block';
            });
        } else {
            document.querySelectorAll('.opportunity-card').forEach(card => {
                card.style.display = 'none';
            });
            
            filteredOpportunities
                .filter(op => op.area === area)
                .forEach(op => {
                    document.querySelector(`.opportunity-card [data-id="${op.id}"]`).closest('.opportunity-card').style.display = 'block';
                });
        }
    });
    
    // Botão de logout
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        UserStorage.clearUser();
        window.location.href = 'index.html';
    });
    
    // Favoritar oportunidades/cursos
    document.addEventListener('click', function(e) {
        if (e.target.closest('.favorite-btn')) {
            const btn = e.target.closest('.favorite-btn');
            const id = btn.getAttribute('data-id');
            
            btn.classList.toggle('active');
            btn.innerHTML = btn.classList.contains('active') ? 
                '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
            
            // Atualiza pontos (gamificação)
            const pointsChange = btn.classList.contains('active') ? 5 : -5;
            user.points = (user.points || 0) + pointsChange;
            UserStorage.updateUser({ points: user.points });
            
            // Atualiza UI
            document.getElementById('userPoints').textContent = `${user.points} pontos`;
            
            const progressPercentage = Math.min(Math.floor(user.points / 10), 100);
            document.getElementById('progressPercentage').textContent = `${progressPercentage}%`;
            document.getElementById('progressFill').style.width = `${progressPercentage}%`;
        }
    });
});
// Adicionar ao dashboard.js
document.getElementById('resumeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const user = UserStorage.getUser();
    const objective = document.getElementById('objective').value;
    const education = document.getElementById('education').value;
    const experience = document.getElementById('experience').value;
    const skills = document.getElementById('skills').value;
    const languages = document.getElementById('languages').value;
    
    // Gera o HTML do currículo
    const resumeHTML = `
        <div class="resume-template">
            <div class="resume-header">
                <h2>${user.name}</h2>
                <p>${user.age} anos | ${user.city}</p>
                <p>${user.email}</p>
            </div>
            
            ${objective ? `
            <div class="resume-section">
                <h3>Objetivo</h3>
                <p>${objective.replace(/\n/g, '<br>')}</p>
            </div>
            ` : ''}
            
            ${education ? `
            <div class="resume-section">
                <h3>Formação Acadêmica</h3>
                <div class="resume-item">
                    ${education.replace(/\n/g, '<br>')}
                </div>
            </div>
            ` : ''}
            
            ${experience ? `
            <div class="resume-section">
                <h3>Experiência Profissional</h3>
                <div class="resume-item">
                    ${experience.replace(/\n/g, '<br>')}
                </div>
            </div>
            ` : ''}
            
            ${skills ? `
            <div class="resume-section">
                <h3>Habilidades</h3>
                <div class="skills-list">
                    ${skills.split(',').map(skill => `
                        <span class="skill-tag">${skill.trim()}</span>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            ${languages ? `
            <div class="resume-section">
                <h3>Idiomas</h3>
                <p>${languages.replace(/\n/g, '<br>')}</p>
            </div>
            ` : ''}
        </div>
    `;
    
    document.getElementById('resumeOutput').innerHTML = resumeHTML;
    document.getElementById('exportResume').disabled = false;
});

document.getElementById('exportResume').addEventListener('click', function() {
    alert('Para exportar para PDF, você pode incluir a biblioteca html2pdf.js\n\nExemplo:\n\nhtml2pdf().from(resumeOutput).save("meu-curriculo.pdf");');
});
// Adicionar ao dashboard.js
const quizQuestions = [
    {
        question: "O que você mais gosta de fazer no seu tempo livre?",
        options: [
            { text: "Resolver problemas e quebra-cabeças", area: "tecnologia", points: 3 },
            { text: "Ajudar e cuidar de outras pessoas", area: "saude", points: 3 },
            { text: "Ler e estudar sobre diversos assuntos", area: "educacao", points: 3 },
            { text: "Organizar e planejar atividades", area: "administracao", points: 3 }
        ]
    },
    {
        question: "Qual dessas matérias você mais gostava na escola?",
        options: [
            { text: "Matemática ou Ciências", area: "tecnologia", points: 2 },
            { text: "Biologia ou Química", area: "saude", points: 2 },
            { text: "Português ou História", area: "educacao", points: 2 },
            { text: "Administração ou Economia", area: "administracao", points: 2 }
        ]
    },
    {
        question: "Como você descreveria sua personalidade?",
        options: [
            { text: "Analítico e lógico", area: "tecnologia", points: 1 },
            { text: "Compassivo e cuidadoso", area: "saude", points: 1 },
            { text: "Comunicativo e curioso", area: "educacao", points: 1 },
            { text: "Organizado e prático", area: "administracao", points: 1 }
        ]
    },
    {
        question: "Qual ambiente de trabalho você prefere?",
        options: [
            { text: "Dinâmico e inovador", area: "tecnologia", points: 2 },
            { text: "Onde possa ajudar pessoas diretamente", area: "saude", points: 2 },
            { text: "Que permita compartilhar conhecimento", area: "educacao", points: 2 },
            { text: "Estruturado e com processos definidos", area: "administracao", points: 2 }
        ]
    },
    {
        question: "Qual dessas habilidades você considera sua maior força?",
        options: [
            { text: "Raciocínio lógico e resolução de problemas", area: "tecnologia", points: 2 },
            { text: "Empatia e trabalho em equipe", area: "saude", points: 2 },
            { text: "Comunicação e didática", area: "educacao", points: 2 },
            { text: "Organização e planejamento", area: "administracao", points: 2 }
        ]
    }
];

const quizResults = {
    tecnologia: {
        title: "Você combina com a área de Tecnologia!",
        description: "Seu perfil analítico e interesse por resolver problemas indicam que você pode se dar muito bem em carreiras como:",
        careers: [
            "Desenvolvedor de Software",
            "Analista de Dados",
            "Especialista em Cybersecurity",
            "Engenheiro de Computação"
        ],
        tips: [
            "Faça cursos de programação e lógica",
            "Participe de hackathons e eventos de tecnologia",
            "Desenvolva projetos pessoais para praticar"
        ]
    },
    saude: {
        title: "Você combina com a área da Saúde!",
        description: "Sua personalidade compassiva e interesse em ajudar os outros indicam que você pode se destacar em profissões como:",
        careers: [
            "Enfermeiro",
            "Técnico em Enfermagem",
            "Fisioterapeuta",
            "Técnico em Farmácia"
        ],
        tips: [
            "Procure cursos técnicos na área da saúde",
            "Faça trabalho voluntário em hospitais ou postos de saúde",
            "Desenvolva sua capacidade de trabalhar em equipe"
        ]
    },
    educacao: {
        title: "Você combina com a área de Educação!",
        description: "Sua curiosidade e habilidade de comunicação sugerem que você pode ser excelente em carreiras como:",
        careers: [
            "Professor",
            "Instrutor de Cursos Profissionalizantes",
            "Educador Social",
            "Tutor Particular"
        ],
        tips: [
            "Desenvolva suas habilidades de oratória",
            "Faça cursos de pedagogia ou metodologias de ensino",
            "Pratique explicando conceitos para outras pessoas"
        ]
    },
    administracao: {
        title: "Você combina com a área Administrativa!",
        description: "Sua organização e pensamento prático indicam que você pode se sair muito bem em funções como:",
        careers: [
            "Assistente Administrativo",
            "Gerente de Operações",
            "Analista de Processos",
            "Empreendedor"
        ],
        tips: [
            "Aprenda sobre gestão e processos",
            "Faça cursos de ferramentas de escritório",
            "Desenvolva seu networking profissional"
        ]
    }
};

let currentQuestionIndex = 0;
let userAnswers = [];
let areaScores = {
    tecnologia: 0,
    saude: 0,
    educacao: 0,
    administracao: 0
};

document.getElementById('startQuiz').addEventListener('click', function() {
    document.getElementById('quizIntro').style.display = 'none';
    document.getElementById('quizQuestions').style.display = 'block';
    showQuestion(currentQuestionIndex);
});

document.getElementById('nextQuestion').addEventListener('click', function() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < quizQuestions.length) {
        showQuestion(currentQuestionIndex);
        document.getElementById('nextQuestion').style.display = 'none';
    } else {
        showResults();
    }
});

document.getElementById('retakeQuiz').addEventListener('click', function() {
    currentQuestionIndex = 0;
    userAnswers = [];
    areaScores = {
        tecnologia: 0,
        saude: 0,
        educacao: 0,
        administracao: 0
    };
    
    document.getElementById('quizResult').style.display = 'none';
    document.getElementById('quizQuestions').style.display = 'block';
    showQuestion(currentQuestionIndex);
});

function showQuestion(index) {
    const question = quizQuestions[index];
    document.getElementById('currentQuestion').textContent = index + 1;
    document.getElementById('questionText').textContent = question.question;
    
    const optionsContainer = document.getElementById('quizOptions');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, i) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'quiz-option';
        optionElement.textContent = option.text;
        optionElement.dataset.area = option.area;
        optionElement.dataset.points = option.points;
        
        optionElement.addEventListener('click', function() {
            // Remove seleção anterior
            document.querySelectorAll('.quiz-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Seleciona a opção atual
            this.classList.add('selected');
            
            // Habilita o botão de próxima pergunta
            document.getElementById('nextQuestion').style.display = 'inline-block';
            
            // Armazena a resposta
            userAnswers[index] = {
                question: question.question,
                answer: option.text,
                area: option.area,
                points: option.points
            };
        });
        
        optionsContainer.appendChild(optionElement);
    });
}

function showResults() {
    // Calcula os pontos por área
    userAnswers.forEach(answer => {
        areaScores[answer.area] += answer.points;
    });
    
    // Encontra a área com maior pontuação
    let topArea = 'tecnologia';
    let topScore = areaScores.tecnologia;
    
    for (const area in areaScores) {
        if (areaScores[area] > topScore) {
            topArea = area;
            topScore = areaScores[area];
        }
    }
    
    // Exibe o resultado
    const result = quizResults[topArea];
    const resultCard = document.getElementById('resultCard');
    
    resultCard.innerHTML = `
        <h5>${result.title}</h5>
        <p>${result.description}</p>
        <ul>
            ${result.careers.map(career => `<li>${career}</li>`).join('')}
        </ul>
        <p><strong>Dicas para começar:</strong></p>
        <ul>
            ${result.tips.map(tip => `<li>${tip}</li>`).join('')}
        </ul>
    `;
    
    document.getElementById('quizQuestions').style.display = 'none';
    document.getElementById('quizResult').style.display = 'block';
    
    // Atualiza pontos do usuário (gamificação)
    const user = UserStorage.getUser();
    user.points = (user.points || 0) + 10; // 10 pontos por completar o quiz
    UserStorage.updateUser({ points: user.points });
    
    // Atualiza UI
    document.getElementById('userPoints').textContent = `${user.points} pontos`;
    
    const progressPercentage = Math.min(Math.floor(user.points / 10), 100);
    document.getElementById('progressPercentage').textContent = `${progressPercentage}%`;
    document.getElementById('progressFill').style.width = `${progressPercentage}%`;
}
// Navegação entre seções
document.querySelectorAll('.sidebar-nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove a classe active de todos os itens
        document.querySelectorAll('.sidebar-nav li').forEach(item => {
            item.classList.remove('active');
        });
        
        // Adiciona a classe active ao item clicado
        this.parentElement.classList.add('active');
        
        // Oculta todas as seções
        document.querySelectorAll('.content-wrapper > section').forEach(section => {
            section.style.display = 'none';
        });
        
        // Mostra a seção correspondente
        const sectionId = this.getAttribute('href').substring(1);
        if (sectionId) {
            document.getElementById(sectionId).style.display = 'block';
        }
    });
});

// Mostra o dashboard por padrão
document.querySelector('.sidebar-nav li.active a').click();
// Menu mobile
const mobileMenuBtn = document.createElement('button');
mobileMenuBtn.className = 'mobile-menu-btn';
mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
document.body.appendChild(mobileMenuBtn);

mobileMenuBtn.addEventListener('click', function() {
    document.querySelector('.sidebar').classList.toggle('active');
});

// Fecha o menu ao clicar em um item
document.querySelectorAll('.sidebar-nav a').forEach(link => {
    link.addEventListener('click', function() {
        if (window.innerWidth < 768) {
            document.querySelector('.sidebar').classList.remove('active');
        }
    });
});
