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
