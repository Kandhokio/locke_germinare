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
    introText.textContent = `${playerName}, você é uma tábula rasa, como diria John Locke. Cada escolha que você fizer aqui moldará não apenas a sua vida, mas também o impacto que terá no mundo. Prepare-se para enfrentar dilemas que testarão seus valores, sua ética e sua visão de governança. Lembre-se: suas ações, ou a falta delas, sempre terão consequências.`;
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

    document.getElementById("advance-button").onclick = function () {
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

    // Contagem das escolhas por atributo
    const counts = choices.reduce((acc, choice) => {
        acc[choice] = (acc[choice] || 0) + 1;
        return acc;
    }, {});

    const totalChoices = choices.length;
    const percentages = {};

    // Calcula a porcentagem para cada atributo
    for (const [key, value] of Object.entries(counts)) {
        percentages[key] = (value / totalChoices) * 100;
    }

    // Ordena os atributos por porcentagem
    const sortedAttributes = Object.keys(percentages).sort(
        (a, b) => percentages[b] - percentages[a]
    );

    // Verifica se há equilíbrio entre os dois atributos mais escolhidos
    const isBalanced =
        percentages[sortedAttributes[0]] === percentages[sortedAttributes[1]];

    if (isBalanced) {
        finalMessage = `${playerName}, sua trajetória reflete uma vida marcada pelo equilíbrio entre valores individuais e coletivos. Inspirado pelos princípios de Locke, você conseguiu proteger os direitos naturais à liberdade e à propriedade, enquanto valorizava o bem comum. No entanto, sua busca constante por harmonia pode ter sido vista como indecisão em momentos que exigiam posicionamentos mais firmes. Ainda assim, seu legado é de sabedoria e ponderação, servindo de exemplo para quem busca viver em equilíbrio com a sociedade.`;
    } else {
        const dominantAttribute = sortedAttributes[0];
        switch (dominantAttribute) {
            case "power":
                finalMessage = `${playerName}, suas escolhas destacaram sua habilidade de exercer liderança e buscar conquistas. Como Locke sugeriria, sua busca por ordem e estabilidade contribuiu para proteger direitos essenciais e promover avanços. No entanto, em sua trajetória, houve momentos em que o poder foi priorizado em detrimento da liberdade de outros. Sua jornada foi marcada por uma visão clara de progresso, mas com desafios éticos que reforçaram a complexidade de suas decisões.`;
                break;
            case "group":
                finalMessage = `${playerName}, seu compromisso com o bem-estar coletivo definiu sua trajetória. Inspirado pelos ideais de Locke, você entendeu que a força de uma sociedade está no contrato social e na proteção do grupo. Sua dedicação ao coletivo fortaleceu laços e promoveu justiça social, mas, ocasionalmente, os interesses individuais podem ter sido sacrificados. Seu legado é um testemunho de como a união pode moldar uma sociedade mais justa e solidária.`;
                break;
            case "freedom":
                finalMessage = `${playerName}, sua jornada foi marcada por uma profunda valorização da liberdade individual. Seguindo os princípios de Locke, você demonstrou que os direitos naturais são a base de uma vida plena e autônoma. Sua busca por independência inspirou inovação e coragem, mas pode ter criado uma distância em relação às necessidades do coletivo. Seu legado é de autenticidade e resistência contra quaisquer forças que comprometam a autonomia.`;
                break;
            case "indifference":
                finalMessage = `${playerName}, sua trajetória revelou um distanciamento em relação às demandas da sociedade, mas ainda assim respeitou os direitos naturais à vida e à propriedade. Embora distante do contrato social defendido por Locke, sua postura refletiu uma escolha de viver em tranquilidade e em seus próprios termos. No entanto, em momentos de crise, sua ausência pode ter deixado lacunas difíceis de preencher. Seu legado, embora discreto, reforça o direito de cada indivíduo de viver de acordo com suas convicções.`;
                break;
        }
    }

    document.getElementById("ending-text").textContent = finalMessage;

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
