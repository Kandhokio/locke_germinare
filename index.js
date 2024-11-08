// Variável para armazenar o final selecionado diretamente
let selectedEnding = "";
let playerName = "";

// Função para iniciar o jogo e capturar o nome do jogador
function startGame() {
    playerName = document.getElementById('player-name').value.trim();
    
    if (playerName === "") {
        alert("Por favor, insira seu nome.");
        return;
    }

    // Salva o nome do jogador no localStorage
    localStorage.setItem('playerName', playerName);

    // Exibe o pop-up de introdução
    const introOverlay = document.getElementById('intro-overlay');
    const introText = document.getElementById('intro-text');
    introText.textContent = `${playerName}, você assume a vida de um personagem fictício que nasce em uma comunidade periférica, enfrentando dilemas éticos complexos desde a infância até a velhice. Cada escolha reflete em valores inspirados nas ideias de John Locke e a teoria da “tábula rasa”, moldando quem você se tornará.`;
    introOverlay.style.display = "flex";
}

// Função para prosseguir para a fase 1 após o pop-up de introdução
function proceedToGame() {
    const introOverlay = document.getElementById('intro-overlay');
    introOverlay.style.display = "none";
    window.location.href = "fase1.html";
}

// Exibe o pop-up com a consequência e opção para avançar
function showConsequence(consequenceText, ending, nextPhase) {
    document.getElementById("consequence-text").textContent = consequenceText;
    document.getElementById("popup").style.display = "block";
    document.querySelector(".popup-overlay").style.display = "block";

    // Armazena a escolha no localStorage
    const currentChoices = JSON.parse(localStorage.getItem('playerChoices')) || [];
    currentChoices.push(ending);
    localStorage.setItem('playerChoices', JSON.stringify(currentChoices));
    
    document.getElementById("advance-button").onclick = function() {
        document.getElementById("popup").style.display = "none";
        document.querySelector(".popup-overlay").style.display = "none";
        window.location.href = nextPhase;
    };
}

// Função para exibir o final na página de resultados com estatísticas
function displayEnding() {
    const playerName = localStorage.getItem('playerName') || "Jogador";
    const choices = JSON.parse(localStorage.getItem('playerChoices')) || [];
    let finalMessage = "";

    const counts = choices.reduce((acc, choice) => {
        acc[choice] = (acc[choice] || 0) + 1;
        return acc;
    }, {});

    const allAttributesChosen = ["power", "group", "freedom", "indifference"].every(attr => counts[attr] > 0);

    if (allAttributesChosen) {
        finalMessage = `${playerName}, com uma vida equilibrada, você é lembrado como alguém complexo, com altos e baixos. Sua herança emocional para quem cruzou seu caminho é uma mistura de respeito, admiração e mistério.`;
    } else {
        const maxCount = Math.max(...Object.values(counts));
        const topChoice = Object.keys(counts).find(choice => counts[choice] === maxCount);

        switch (topChoice) {
            case "power":
                finalMessage = `${playerName}, com as escolhas centradas no “Poder”, você vive e morre em uma posição de prestígio e riqueza. Sua morte é lembrada pela conquista pessoal, mas você é criticado por sua indiferença aos outros.`;
                break;
            case "group":
                finalMessage = `${playerName}, focado no “Grupo”, você se torna uma figura comunitária, lembrada por seus atos e sacrifícios em prol de outros. Sua vida, mesmo com limitações, é celebrada pela comunidade que você ajudou.`;
                break;
            case "freedom":
                finalMessage = `${playerName}, seguindo um caminho de “Liberdade”, você vive uma vida marcada pela independência, com momentos de solidão, mas também paz e realização. Você vive de acordo com suas convicções até o fim.`;
                break;
            case "indifference":
                finalMessage = `${playerName}, em um fim de “Indiferença”, você é lembrado como uma figura distante, que passou pela vida sem grande conexão com os outros. Viveu sem arrependimentos, mas sem laços.`;
                break;
        }
    }

    document.getElementById('ending-text').textContent = finalMessage;

    displayChoiceStats(counts);
}

// Função para exibir as estatísticas das escolhas em barras de progresso
function displayChoiceStats(counts) {
    const totalChoices = Object.values(counts).reduce((acc, val) => acc + val, 0);
    const statsContainer = document.getElementById('stats-container');

    const title = document.createElement('h3');
    title.textContent = "Resumo das Escolhas";
    statsContainer.appendChild(title);

    const attributes = ["power", "group", "freedom", "indifference"];
    const labels = {
        power: "Poder",
        group: "Grupo",
        freedom: "Liberdade",
        indifference: "Indiferença"
    };

    attributes.forEach(attr => {
        const count = counts[attr] || 0;
        const percentage = ((count / totalChoices) * 100).toFixed(1);

        const statBar = document.createElement('div');
        statBar.classList.add('stat-bar');

        const label = document.createElement('span');
        label.textContent = `${labels[attr]}: ${count} escolhas (${percentage}%)`;

        const progressContainer = document.createElement('div');
        progressContainer.classList.add('progress-container');

        const bar = document.createElement('div');
        bar.classList.add('progress', attr);
        bar.style.width = `${percentage}%`;

        progressContainer.appendChild(bar);
        statBar.appendChild(label);
        statBar.appendChild(progressContainer);
        statsContainer.appendChild(statBar);
    });
}

// Reinicia o jogo ao limpar o localStorage e redireciona para a página inicial
function restartGame() {
    localStorage.clear();
    window.location.href = "inicial.html";
}

// Verifica se está na página de resultados e exibe o final quando o DOM estiver carregado
if (window.location.pathname.endsWith("fresultados.html")) {
    document.addEventListener("DOMContentLoaded", displayEnding);
}

// Insere o nome do jogador nas narrativas das fases quando o DOM estiver carregado
if (window.location.pathname.includes("fase")) {
    document.addEventListener("DOMContentLoaded", () => {
        const storyText = document.getElementById("story-text");
        const playerName = localStorage.getItem("playerName");
        if (storyText && playerName) {
            storyText.innerHTML = `${playerName}, ${storyText.innerHTML}`;
        }
    });
}
