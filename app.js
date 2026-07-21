window.app = {
    groups: [], 
    turn: 0, 
    deck: [],
    cardsStatus: [], // Rastreia as cartas reveladas (true = aberta, false = fechada)
    
    showSetup: () => {
        document.getElementById('screen-intro').classList.remove('active');
        document.getElementById('screen-setup').classList.add('active');
    },

    startGame: () => {
        const g1 = document.getElementById('g1-name').value.trim() || 'Grupo 1';
        const g2 = document.getElementById('g2-name').value.trim() || 'Grupo 2';
        const g3 = document.getElementById('g3-name').value.trim() || 'Grupo 3';
        
        window.app.groups = [ 
            {name: g1, score: 0}, 
            {name: g2, score: 0}, 
            {name: g3, score: 0} 
        ];
        
        document.getElementById('screen-setup').classList.remove('active');
        document.getElementById('screen-game').classList.add('active');
        
        window.app.buildDeck();
        window.app.renderBoard();
        window.app.updateUI();
    },

    buildDeck: () => {
        if (typeof cartasTipo1 === 'undefined' || typeof cartasTipo5 === 'undefined') {
            alert("⚠️ ERRO: Os arquivos de dados (data_cartas1.js, etc.) não foram carregados.");
            return;
        }

        const getRand = (arr, n) => [...arr].sort(() => 0.5 - Math.random()).slice(0, n);
        
        // Embaralha todas as 24 cartas selecionadas
        window.app.deck = [
            ...getRand(cartasTipo1, 5), ...getRand(cartasTipo2, 5),
            ...getRand(cartasTipo3, 5), ...getRand(cartasTipo4, 5),
            ...getRand(cartasTipo5, 4)
        ].sort(() => 0.5 - Math.random());

        // Inicializa o status de todas as 24 cartas como "fechadas" (false)
        window.app.cardsStatus = new Array(24).fill(false);
    },

    renderBoard: () => {
        const grid = document.getElementById('board-grid');
        grid.innerHTML = '';
        
        // Renderiza 24 cartas numeradas no painel
        window.app.deck.forEach((card, index) => {
            const isOpened = window.app.cardsStatus[index];
            const bgPattern = `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiMzMzQxNTUiIGZpbGwtb3BhY2l0eT0iMC40Ii8+PC9zdmc+')`;
            
            grid.innerHTML += `
                <button 
                    id="board-card-${index}"
                    onclick="window.app.openCard(${index})" 
                    ${isOpened ? 'disabled' : ''}
                    class="board-card bg-slate-800 border-2 ${isOpened ? 'border-slate-800 bg-slate-900' : 'border-cyan-700 bg-gradient-to-br from-slate-700 to-slate-900 text-cyan-400 hover:text-cyan-300'} rounded-xl flex items-center justify-center text-4xl font-black shadow-lg relative overflow-hidden group">
                    
                    <!-- Fundo texturizado imitando o verso da carta -->
                    ${!isOpened ? `<div class="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity" style="background-image: ${bgPattern}"></div>` : ''}
                    
                    <span class="relative z-10 drop-shadow-md">${isOpened ? '✓' : (index + 1)}</span>
                </button>
            `;
        });
    },

    openCard: (index) => {
        const card = window.app.deck[index];
        window.app.cardsStatus[index] = true; // Marca a carta como revelada
        
        // Atualiza a aparência da carta imediatamente no grid
        const btn = document.getElementById(`board-card-${index}`);
        btn.disabled = true;
        btn.innerHTML = '<span class="relative z-10 drop-shadow-md text-emerald-500">✓</span>';
        
        // Prepara e exibe o modal
        const modalContent = document.getElementById('card-modal-content');
        modalContent.innerHTML = window.app.renderCardHTML(card);
        modalContent.className = "w-full max-w-2xl w-full modal-enter";
        
        document.getElementById('card-modal').classList.remove('hidden');
        
        // Atualiza a contagem de cartas restantes
        const remaining = window.app.cardsStatus.filter(s => !s).length;
        document.getElementById('cards-left').textContent = remaining;
    },

    renderCardHTML: (c) => {
        if(c.tipo === 4) {
            return `
            <div class="card-golden rounded-2xl p-6 md:p-8 relative">
                <div class="absolute -top-4 -right-4 bg-yellow-900 text-yellow-300 font-bold px-4 py-1 rounded-full shadow-lg border border-yellow-700">10 PONTOS</div>
                <h2 class="text-xl md:text-2xl font-bold mb-2">Mergulhe mais fundo (Debate)</h2>
                <div class="bg-yellow-900/10 p-3 md:p-4 rounded-lg border border-yellow-700/30 mb-4 md:mb-6 italic font-medium text-base md:text-lg leading-relaxed">"${c.recorte}"</div>
                <h3 class="font-bold uppercase tracking-wider mb-2 md:mb-3 text-sm md:text-base">Questões Norteadoras:</h3>
                <ul class="list-disc pl-5 space-y-2 md:space-y-3 mb-6 font-medium text-yellow-950 text-sm md:text-base">
                    ${c.perguntas.map(p => `<li>${p}</li>`).join('')}
                </ul>
                <button onclick="window.app.finishTurn(${c.pontos})" class="w-full bg-yellow-900 hover:bg-yellow-800 text-yellow-100 font-bold py-2.5 rounded-xl transition-all shadow-md text-base">Proximo... (+10 Pts)</button>
            </div>`;
        }
        if(c.tipo === 5) {
            return `
            <div class="card-fake rounded-2xl p-6 md:p-8 relative text-center">
                <div class="text-6xl md:text-7xl mb-4">🚨</div>
                <h2 class="text-3xl md:text-4xl font-black mb-4 uppercase tracking-wider">Fake News</h2>
                <p class="text-xl md:text-2xl font-medium mb-8 leading-snug">${c.fakeNews}</p>
                <button onclick="window.app.finishTurn(${c.pontos})" class="bg-red-950 hover:bg-red-900 text-red-200 font-bold py-2.5 px-8 rounded-xl transition-all border border-red-800 text-base w-full shadow-md">Proximo... (-2 Pts)</button>
            </div>`;
        }
        
        const typeNames = {1: "Cultura Digital e Ed. Midiática", 2: "Mídia como Recurso vs Ed. Midiática", 3: "Prática Docente"};
        return `
        <div class="card-base relative p-6">
            <div class="flex justify-between items-start mb-4">
                <span class="text-xs font-bold uppercase tracking-widest text-cyan-500 bg-cyan-950 px-3 py-1 rounded-md border border-cyan-800">${typeNames[c.tipo]}</span>
                <span class="font-bold text-slate-200 bg-slate-700 px-3 py-1 rounded-full border border-slate-600 text-sm">${c.pontos} Pts</span>
            </div>
            <p class="text-lg md:text-xl text-slate-100 mb-6 leading-relaxed">${c.cenario}</p>
            <div id="options-area" class="space-y-2 mb-4">
                ${c.alternativas.map((opt) => `
                    <button onclick="window.app.verifyAnswer(this, ${opt.correta}, ${c.pontos})" class="w-full text-left p-3 rounded-xl border border-slate-600 bg-slate-800 hover:bg-slate-700 transition-all text-sm md:text-base text-slate-300 font-medium">
                        ${opt.texto}
                    </button>
                `).join('')}
            </div>
            <div id="feedback-area" class="hidden bg-slate-900 border border-slate-700 p-4 rounded-xl mt-4 shadow-inner">
                <p id="feedback-msg" class="text-base font-bold mb-2"></p>
                <div class="bg-slate-950 p-3 rounded-lg border border-slate-800 relative">
                    <span class="absolute -top-2.5 left-3 bg-slate-800 text-slate-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-slate-700">Fundamentação (PDF)</span>
                    <p class="text-xs md:text-sm text-slate-300 italic leading-relaxed mt-1">${c.base}</p>
                </div>
                <button onclick="window.app.finishTurn(0)" class="mt-4 w-full bg-cyan-700 hover:bg-cyan-600 text-white font-bold py-2 rounded-lg transition-all text-sm shadow-md">Proximo...</button>
            </div>
        </div>`;
    },

    verifyAnswer: (btn, isCorrect, points) => {
        const area = document.getElementById('options-area');
        area.querySelectorAll('button').forEach(b => b.disabled = true);
        
        if(isCorrect) {
            btn.classList.replace('bg-slate-800', 'bg-emerald-900');
            btn.classList.add('border-emerald-500', 'text-emerald-100');
            window.app.groups[window.app.turn].score += points;
        } else {
            btn.classList.replace('bg-slate-800', 'bg-rose-900');
            btn.classList.add('border-rose-500', 'text-rose-100');
        }

        const feedback = document.getElementById('feedback-area');
        feedback.classList.remove('hidden');
        
        const msgEl = document.getElementById('feedback-msg');
        if(isCorrect) {
            msgEl.textContent = "✅ Parabéns, Resposta Correta!";
            msgEl.className = "text-base md:text-lg font-bold mb-2 text-emerald-400";
        } else {
            msgEl.textContent = "❌ Resposta Incorreta.";
            msgEl.className = "text-base md:text-lg font-bold mb-2 text-rose-400";
        }
    },

    finishTurn: (pointsToAdd = 0) => {
        window.app.groups[window.app.turn].score += pointsToAdd;
        window.app.turn = (window.app.turn + 1) % 3;
        
        // Esconde e limpa o Modal
        document.getElementById('card-modal').classList.add('hidden');
        document.getElementById('card-modal-content').innerHTML = '';
        
        window.app.updateUI();

        // Checa se o jogo acabou
        const remaining = window.app.cardsStatus.filter(s => !s).length;
        if (remaining === 0) {
            setTimeout(() => {
                alert("O Ciclo terminou! Verifique o grupo vencedor no Ranking lateral.");
            }, 500);
        }
    },

    updateUI: () => {
        document.getElementById('current-group-name').textContent = window.app.groups[window.app.turn].name;
        
        const ranking = document.getElementById('ranking-list');
        ranking.innerHTML = '';
        
        const sorted = [...window.app.groups].sort((a,b) => b.score - a.score);
        
        sorted.forEach(g => {
            const isTurn = g.name === window.app.groups[window.app.turn].name;
            ranking.innerHTML += `
                <div class="rank-item bg-slate-800 border ${isTurn ? 'border-cyan-500 bg-slate-700 shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'border-slate-700'} p-4 rounded-xl flex justify-between items-center transition-all duration-300">
                    <span class="font-bold ${isTurn ? 'text-cyan-300' : 'text-slate-300'}">${g.name}</span>
                    <span class="bg-slate-900 px-3 py-1.5 rounded-lg font-mono text-cyan-400 font-bold border border-slate-700 text-lg">${g.score}</span>
                </div>
            `;
        });
    }
};