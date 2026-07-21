window.app = {
    isGroupMode: false,
    useTimer: false,
    timeLimit: 30,
    timerInterval: null,
    currentStudyTab: 1, 
    
    groups: [], 
    turn: 0, 
    deck: [],
    cardsStatus: [],
    currentCard: null,
    
    showSetup: () => {
        document.getElementById('screen-intro').classList.remove('active');
        document.getElementById('screen-setup').classList.add('active');
    },

    backToMenuFromSetup: () => {
        document.getElementById('screen-setup').classList.remove('active');
        document.getElementById('screen-intro').classList.add('active');
    },

    // ==========================================================
    // NOVA FEATURE: MODO ESTUDAR (COM ABAS E ACORDEON)
    // ==========================================================
    startStudyMode: () => {
        document.getElementById('screen-intro').classList.remove('active');
        document.getElementById('screen-estudar').classList.add('active');
        
        window.app.changeStudyTab(1);
    },

    changeStudyTab: (tipo) => {
        window.app.currentStudyTab = tipo;

        // Dicionário de estilos
        const tabStyles = {
            1: {
                label: "Ed. Midiática",
                inactive: "flex-1 min-w-[130px] sm:min-w-[140px] py-2 sm:py-3 px-2 sm:px-4 rounded-lg font-bold text-xs sm:text-sm transition-all text-center bg-slate-800 text-cyan-400 border border-cyan-800 hover:bg-cyan-900/50",
                active: "flex-1 min-w-[130px] sm:min-w-[140px] py-2 sm:py-3 px-2 sm:px-4 rounded-lg font-bold text-xs sm:text-sm transition-all text-center bg-cyan-600 text-white border border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
            },
            2: {
                label: "Mídia Recurso",
                inactive: "flex-1 min-w-[130px] sm:min-w-[140px] py-2 sm:py-3 px-2 sm:px-4 rounded-lg font-bold text-xs sm:text-sm transition-all text-center bg-slate-800 text-purple-400 border border-purple-800 hover:bg-purple-900/50",
                active: "flex-1 min-w-[130px] sm:min-w-[140px] py-2 sm:py-3 px-2 sm:px-4 rounded-lg font-bold text-xs sm:text-sm transition-all text-center bg-purple-600 text-white border border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.4)]"
            },
            3: {
                label: "Prática Docente",
                inactive: "flex-1 min-w-[130px] sm:min-w-[140px] py-2 sm:py-3 px-2 sm:px-4 rounded-lg font-bold text-xs sm:text-sm transition-all text-center bg-slate-800 text-emerald-400 border border-emerald-800 hover:bg-emerald-900/50",
                active: "flex-1 min-w-[130px] sm:min-w-[140px] py-2 sm:py-3 px-2 sm:px-4 rounded-lg font-bold text-xs sm:text-sm transition-all text-center bg-emerald-600 text-white border border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
            },
            4: {
                label: "Citações do Doc.",
                inactive: "flex-1 min-w-[130px] sm:min-w-[140px] py-2 sm:py-3 px-2 sm:px-4 rounded-lg font-bold text-xs sm:text-sm transition-all text-center bg-slate-800 text-yellow-400 border border-yellow-800 hover:bg-yellow-900/50",
                active: "flex-1 min-w-[130px] sm:min-w-[140px] py-2 sm:py-3 px-2 sm:px-4 rounded-lg font-bold text-xs sm:text-sm transition-all text-center bg-yellow-600 text-white border border-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.4)]"
            },
            5: {
                label: "Fake News",
                inactive: "flex-1 min-w-[130px] sm:min-w-[140px] py-2 sm:py-3 px-2 sm:px-4 rounded-lg font-bold text-xs sm:text-sm transition-all text-center bg-slate-800 text-red-400 border border-red-800 hover:bg-red-900/50",
                active: "flex-1 min-w-[130px] sm:min-w-[140px] py-2 sm:py-3 px-2 sm:px-4 rounded-lg font-bold text-xs sm:text-sm transition-all text-center bg-red-600 text-white border border-red-400 shadow-[0_0_10px_rgba(239,68,68,0.4)]"
            }
        };

        for (let i = 1; i <= 5; i++) {
            const btn = document.getElementById(`tab-btn-${i}`);
            btn.textContent = tabStyles[i].label; 
            btn.className = (i === tipo) ? tabStyles[i].active : tabStyles[i].inactive; 
        }

        const sourceArrays = { 1: cartasTipo1, 2: cartasTipo2, 3: cartasTipo3, 4: cartasTipo4, 5: cartasTipo5 };
        const cartasParaExibir = sourceArrays[tipo];
        
        let htmlContent = '';
        const typeNames = {1: "Ed. Midiática", 2: "Mídia como Recurso", 3: "Prática Docente", 4: "Citações do Doc.", 5: "Fake News"};
        const typeColors = {
            1: "text-cyan-400 border-cyan-700 bg-cyan-950/30",
            2: "text-purple-400 border-purple-700 bg-purple-950/30",
            3: "text-emerald-400 border-emerald-700 bg-emerald-950/30",
            4: "text-yellow-400 border-yellow-600 bg-yellow-950/30",
            5: "text-red-400 border-red-700 bg-red-950/30"
        };

        const colorConfig = typeColors[tipo];
        const typeName = typeNames[tipo];
        const colorClasses = colorConfig.split(' '); 

        cartasParaExibir.forEach((c, index) => {
            let conteudo = c.cenario || c.recorte || c.fakeNews;
            let feedbackHtml = '';

            if (c.alternativas) {
                const correta = c.alternativas.find(a => a.correta).texto;
                feedbackHtml = `
                    <div class="pt-4 border-t border-slate-700">
                        <p class="text-emerald-400 font-bold text-sm mb-2"><i class="fa-solid fa-check-circle mr-1"></i> Resposta Correta: <span class="font-normal text-slate-200">${correta}</span></p>
                        <p class="text-slate-400 text-sm leading-relaxed"><strong class="text-slate-300">Base Teórica:</strong> ${c.base}</p>
                    </div>
                `;
            } else if (c.perguntas) {
                feedbackHtml = `
                    <div class="pt-4 border-t border-yellow-700/50">
                        <p class="text-yellow-400 font-bold text-sm mb-2"><i class="fa-solid fa-lightbulb mr-1"></i> Questão para Reflexão:</p>
                        <p class="text-yellow-100/80 text-sm leading-relaxed">${c.perguntas[0]}</p>
                    </div>
                `;
            } else if (c.fakeNews) {
                // AQUI FOI INJETADA A NOVA BASE TEÓRICA ANTES DOS PONTOS (MODO ESTUDO)
                feedbackHtml = `
                    <div class="pt-4 border-t border-red-800/50">
                        <p class="text-red-300 font-medium text-sm mb-3"><i class="fa-solid fa-book-open mr-1"></i> ${c.base}</p>
                        <p class="text-red-400 font-bold text-sm"><i class="fa-solid fa-triangle-exclamation mr-1"></i> Penalidade: ${c.pontos} pontos.</p>
                    </div>
                `;
            }

            htmlContent += `
                <details class="group bg-slate-800 border-2 ${colorClasses[1]} rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                    <summary class="p-5 md:p-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden flex flex-col outline-none">
                        <div class="flex justify-between items-center mb-4 border-b border-slate-700 pb-3">
                            <span class="text-xs font-black text-slate-500 uppercase tracking-widest">Carta ${index + 1}</span>
                            <span class="text-xs font-black uppercase tracking-widest ${colorClasses[0]} px-3 py-1 ${colorClasses[2]} rounded-full border ${colorClasses[1]}">${typeName}</span>
                        </div>
                        <div class="flex justify-between items-start gap-4">
                            <p class="text-slate-100 text-base md:text-lg leading-relaxed text-justify flex-1 m-0">${conteudo}</p>
                            <div class="w-8 h-8 flex items-center justify-center rounded-full bg-slate-700 text-slate-300 group-open:rotate-180 transition-transform duration-300 flex-shrink-0 mt-1 border border-slate-600">
                                <i class="fa-solid fa-chevron-down"></i>
                            </div>
                        </div>
                    </summary>
                    <div class="px-5 md:px-6 pb-5 md:pb-6">
                        ${feedbackHtml}
                    </div>
                </details>
            `;
        });

        document.getElementById('study-list').innerHTML = htmlContent;
    },

    backToMenu: () => {
        document.getElementById('screen-estudar').classList.remove('active');
        document.getElementById('screen-intro').classList.add('active');
        document.getElementById('study-list').innerHTML = ''; 
    },
    // ==========================================================

    toggleConfig: () => {
        const mode = document.querySelector('input[name="gameMode"]:checked').value;
        const timer = document.querySelector('input[name="timerConfig"]:checked').value;
        
        document.getElementById('group-inputs-container').style.display = (mode === 'grupos') ? 'block' : 'none';
        document.getElementById('timer-input-container').style.display = (timer === 'on') ? 'block' : 'none';
    },

    toggleGroupCount: () => {
        const count = parseInt(document.getElementById('group-count-select').value);
        for(let i=1; i<=4; i++) {
            const input = document.getElementById(`g${i}-name`);
            input.style.display = (i <= count) ? 'block' : 'none';
        }
    },

    startGame: () => {
        const mode = document.querySelector('input[name="gameMode"]:checked').value;
        window.app.isGroupMode = (mode === 'grupos');

        const timerConfig = document.querySelector('input[name="timerConfig"]:checked').value;
        window.app.useTimer = (timerConfig === 'on');
        window.app.timeLimit = parseInt(document.getElementById('time-seconds').value) || 30;

        if (window.app.isGroupMode) {
            const count = parseInt(document.getElementById('group-count-select').value);
            window.app.groups = [];
            for (let i = 1; i <= count; i++) {
                const name = document.getElementById(`g${i}-name`).value.trim() || `Grupo ${i}`;
                window.app.groups.push({ name: name, score: 0, history: [] });
            }
        } else {
            window.app.groups = [ {name: 'Jogador(a)', score: 0, history: []} ];
        }
        
        document.getElementById('screen-setup').classList.remove('active');
        document.getElementById('screen-game').classList.add('active');
        
        window.app.buildDeck();
        window.app.renderBoard();
        window.app.updateUI();
    },

    buildDeck: () => {
        const getUniqueRand = (arr, numItems) => {
            const uniqueArr = [];
            const seen = new Set();
            arr.forEach(item => {
                const identifier = item.cenario || item.recorte || item.fakeNews;
                if (!seen.has(identifier)) {
                    seen.add(identifier);
                    uniqueArr.push(item);
                }
            });
            for (let i = uniqueArr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [uniqueArr[i], uniqueArr[j]] = [uniqueArr[j], uniqueArr[i]];
            }
            return uniqueArr.slice(0, numItems);
        };
        
        window.app.deck = [
            ...getUniqueRand(cartasTipo1, 5), 
            ...getUniqueRand(cartasTipo2, 5),
            ...getUniqueRand(cartasTipo3, 5), 
            ...getUniqueRand(cartasTipo4, 5),
            ...getUniqueRand(cartasTipo5, 4)
        ];

        for (let i = window.app.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [window.app.deck[i], window.app.deck[j]] = [window.app.deck[j], window.app.deck[i]];
        }

        window.app.cardsStatus = new Array(24).fill(false);
    },

    renderBoard: () => {
        const grid = document.getElementById('board-grid');
        grid.innerHTML = '';
        
        window.app.deck.forEach((card, index) => {
            const isOpened = window.app.cardsStatus[index];
            const bgPattern = `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiMzMzQxNTUiIGZpbGwtb3BhY2l0eT0iMC40Ii8+PC9zdmc+')`;
            
            grid.innerHTML += `
                <button 
                    id="board-card-${index}"
                    onclick="window.app.openCard(${index})" 
                    ${isOpened ? 'disabled' : ''}
                    class="board-card bg-slate-800 border-2 ${isOpened ? 'border-slate-800 bg-slate-900' : 'border-cyan-700 bg-gradient-to-br from-slate-700 to-slate-900 text-cyan-400 hover:text-cyan-300'} rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden group">
                    ${!isOpened ? `<div class="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity" style="background-image: ${bgPattern}"></div>` : ''}
                    <span class="relative z-10 drop-shadow-md text-3xl md:text-5xl font-black">${isOpened ? '✓' : (index + 1)}</span>
                </button>
            `;
        });
    },

    formatTime: (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    },

    openCard: (index) => {
        const card = window.app.deck[index];
        window.app.currentCard = card; 
        window.app.cardsStatus[index] = true; 
        
        const btn = document.getElementById(`board-card-${index}`);
        btn.disabled = true;
        btn.innerHTML = '<span class="relative z-10 drop-shadow-md text-emerald-500 text-3xl md:text-5xl font-black">✓</span>';
        
        const modalContent = document.getElementById('card-modal-content');
        modalContent.innerHTML = window.app.renderCardHTML(card);
        modalContent.className = "w-full max-w-3xl w-full modal-enter"; 
        
        document.getElementById('card-modal').classList.remove('hidden');
        
        if (card.tipo === 4) {
            window.app.startTimer(4, card.pontos, 300);
        } else if (card.tipo >= 1 && card.tipo <= 3 && window.app.useTimer) {
            window.app.startTimer(card.tipo, card.pontos, window.app.timeLimit);
        }

        const remaining = window.app.cardsStatus.filter(s => !s).length;
        const deskCounter = document.getElementById('cards-left');
        const mobCounter = document.getElementById('cards-left-mobile');
        if (deskCounter) deskCounter.textContent = remaining;
        if (mobCounter) mobCounter.textContent = remaining;
    },

    startTimer: (tipo, pontos, totalSeconds) => {
        let timeLeft = totalSeconds;
        const timerDisplay = document.getElementById('modal-timer-display');
        const timerSquare = document.getElementById('timer-square');
        if (!timerDisplay) return;

        timerDisplay.textContent = window.app.formatTime(timeLeft);
        
        window.app.timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = window.app.formatTime(timeLeft);
            
            if (timeLeft <= 5) {
                timerDisplay.classList.add('timer-danger');
                if (timerSquare) timerSquare.classList.add('border-red-500', 'shadow-[0_0_20px_rgba(239,68,68,0.5)]');
            }
            
            if (timeLeft <= 0) {
                window.app.handleTimeOut(tipo, pontos);
            }
        }, 1000);
    },

    handleTimeOut: (tipo, pontos) => {
        clearInterval(window.app.timerInterval);
        const card = window.app.currentCard;
        const typeNames = {1: "Ed. Midiática", 2: "Mídia Recurso", 3: "Prática Docente"};

        if (tipo >= 1 && tipo <= 3) {
            const area = document.getElementById('options-area');
            area.querySelectorAll('button').forEach(b => {
                b.disabled = true;
                if(b.getAttribute('data-correct') === 'true') {
                    b.classList.replace('bg-slate-800', 'bg-emerald-900');
                    b.classList.add('border-emerald-500', 'text-emerald-100');
                }
            });

            window.app.groups[window.app.turn].history.push({
                carta: typeNames[card.tipo] || "Problema",
                pergunta: card.cenario,
                pontos: 0,
                status: '<span class="text-orange-400 font-bold">Estourou Tempo</span>'
            });

            const feedback = document.getElementById('feedback-area');
            feedback.classList.remove('hidden');
            document.getElementById('feedback-msg').innerHTML = "⏱️ Tempo Esgotado! <span class='text-sm text-slate-300 font-normal block mt-1'>A resposta correta está destacada em verde.</span>";
            document.getElementById('feedback-msg').className = "text-xl md:text-2xl font-black mb-2 text-orange-400";
            document.getElementById('btn-next').classList.replace('bg-cyan-700', 'bg-orange-600');

        } else if (tipo === 4) {
            document.getElementById('btn-golden-action').disabled = true;
            window.app.groups[window.app.turn].history.push({
                carta: "Mergulhe Fundo",
                pergunta: card.perguntas[0],
                pontos: 10,
                status: '<span class="text-yellow-400 font-bold">Debate Concluído</span>'
            });
            
            const msgArea = document.getElementById('debate-msg-area');
            if (msgArea) {
                msgArea.innerHTML = "<div class='bg-yellow-900/40 border border-yellow-500 p-4 rounded-xl mt-4 text-center animate-pulse'><p class='text-xl font-bold text-yellow-300'>⏱️ Tempo de Debate Encerrado!</p><p class='text-yellow-100'>10 Pontos garantidos para a equipe.</p></div>";
            }
            
            setTimeout(() => window.app.finishTurn(10, true), 3000);
        }
    },

    renderCardHTML: (c) => {
        let timerSquareHTML = '';
        
        // Lógica dinâmica para a posição da Tag de Pontos. 
        const badgePontosPos = window.app.useTimer 
            ? "absolute -top-4 right-4 md:top-28 md:-right-4" 
            : "absolute -top-4 right-4 md:-right-4";

        if (c.tipo === 4) {
            timerSquareHTML = `
            <div id="timer-square" class="relative md:absolute md:-top-8 md:-right-8 w-full md:w-32 bg-slate-900 border-2 md:border-4 border-yellow-600 rounded-xl md:rounded-2xl flex flex-row md:flex-col items-center justify-between md:justify-center shadow-lg md:shadow-2xl z-20 md:transform md:rotate-3 p-3 px-5 md:p-0 md:h-32 mb-6 md:mb-0 mt-3 md:mt-0">
                <span class="text-xs md:text-xs text-yellow-500 uppercase font-black tracking-widest md:mb-1">Debate</span>
                <span id="modal-timer-display" class="font-mono text-3xl md:text-4xl font-black text-yellow-400 leading-none drop-shadow-md">05:00</span>
            </div>`;
        } else if (c.tipo >= 1 && c.tipo <= 3 && window.app.useTimer) {
            timerSquareHTML = `
            <div id="timer-square" class="relative md:absolute md:-top-8 md:-right-8 w-full md:w-32 bg-slate-950 border-2 md:border-4 border-cyan-700 rounded-xl md:rounded-2xl flex flex-row md:flex-col items-center justify-between md:justify-center shadow-lg md:shadow-2xl z-20 md:transform md:rotate-3 p-3 px-5 md:p-0 md:h-32 mb-6 md:mb-0 mt-3 md:mt-0">
                <span class="text-xs md:text-xs text-slate-400 uppercase font-bold tracking-widest md:mb-1">Tempo</span>
                <span id="modal-timer-display" class="font-mono text-3xl md:text-4xl font-black text-cyan-400 leading-none drop-shadow-md">${window.app.formatTime(window.app.timeLimit)}</span>
            </div>`;
        }

        if(c.tipo === 4) {
            return `
            <div class="card-golden rounded-2xl p-5 md:p-10 relative mt-6 md:mt-4">
                <div class="absolute -top-4 left-4 md:-left-4 bg-yellow-900 text-yellow-300 font-black px-4 py-1 md:px-6 md:py-2 rounded-full shadow-lg border-2 border-yellow-600 text-sm md:text-xl z-20 uppercase tracking-wider drop-shadow-md">10 PONTOS</div>
                
                ${timerSquareHTML}
                
                <div class="md:pr-28"> <!-- Margem de segurança para o cronômetro no desktop -->
                    <h2 class="text-2xl md:text-4xl font-black mb-4 text-yellow-950">Mergulhe mais fundo</h2>
                    <div class="bg-yellow-900/10 p-4 md:p-6 rounded-xl border border-yellow-700/40 mb-6 italic font-medium text-lg md:text-2xl leading-relaxed text-yellow-950 shadow-inner">"${c.recorte}"</div>
                </div>
                
                <h3 class="font-black uppercase tracking-wider mb-3 md:mb-4 text-base md:text-xl text-yellow-900">Questão Norteadora (Plenária):</h3>
                <p class="font-bold text-yellow-950 text-xl md:text-3xl leading-snug mb-8 bg-yellow-100 p-5 md:p-6 rounded-xl shadow-sm border border-yellow-400/50">
                    ${c.perguntas[0]}
                </p>
                <div id="debate-msg-area"></div>
                <button id="btn-golden-action" onclick="window.app.finishTurn(${c.pontos})" class="w-full mt-2 bg-yellow-900 hover:bg-yellow-800 text-yellow-100 font-black py-4 rounded-xl transition-all shadow-xl text-lg md:text-xl uppercase tracking-widest border border-yellow-700">Encerrar (+10 Pts)</button>
            </div>`;
        }
        
        if(c.tipo === 5) {
            return `
            <div class="card-fake rounded-2xl p-6 md:p-12 relative text-center mt-6 md:mt-4">
                <div class="text-7xl md:text-9xl mb-6 drop-shadow-2xl">🚨</div>
                <h2 class="text-4xl md:text-6xl font-black mb-6 uppercase tracking-widest text-red-400 drop-shadow-md">Fake News!</h2>
                <p class="text-2xl md:text-4xl font-bold mb-4 leading-snug text-red-100 bg-red-950/50 p-6 rounded-2xl border border-red-800/50 shadow-inner">${c.fakeNews}</p>
                
                <!-- AQUI FOI INJETADA A NOVA BASE TEÓRICA NA CARTA DO MODO JOGO -->
                <p class="text-lg md:text-xl text-red-300 font-medium mb-10 italic">${c.base}</p>
                
                <button id="btn-fake-action" onclick="window.app.finishTurn(${c.pontos})" class="bg-red-950 hover:bg-red-900 text-red-200 font-black py-4 px-8 rounded-xl transition-all border-2 border-red-700 text-xl md:text-2xl w-full shadow-2xl uppercase tracking-widest">Assumir o Erro (${c.pontos} Pts)</button>
            </div>`;
        }
        
        const typeNames = {1: "Cultura Digital", 2: "Mídia como Recurso", 3: "Prática Docente"};
        return `
        <div class="card-base relative p-5 md:p-10 mt-6 md:mt-4">
            <div class="absolute -top-4 left-4 md:-left-4 bg-cyan-950 text-cyan-400 font-black px-3 md:px-4 py-1 md:py-2 rounded-full shadow-lg border-2 border-cyan-700 text-xs md:text-lg z-20 uppercase tracking-widest">${typeNames[c.tipo]}</div>
            
            <div class="${badgePontosPos} bg-slate-700 text-slate-200 font-black px-4 md:px-6 py-1 md:py-2 rounded-full shadow-lg border-2 border-slate-500 text-xs md:text-lg z-20 uppercase transition-all duration-300">${c.pontos} Pts</div>
            
            ${timerSquareHTML}
            
            <div class="md:pr-28 ${window.app.useTimer ? 'mt-0' : 'mt-4'}"> 
                <p class="text-xl md:text-3xl font-bold text-slate-100 mb-6 md:mb-8 leading-snug">${c.cenario}</p>
            </div>
            
            <div id="options-area" class="space-y-3 md:space-y-4 mb-4">
                ${c.alternativas.map((opt) => `
                    <button data-correct="${opt.correta}" onclick="window.app.verifyAnswer(this, ${opt.correta}, ${c.pontos})" class="w-full text-left p-4 md:p-5 rounded-2xl border-2 border-slate-600 bg-slate-800 hover:bg-slate-700 transition-all text-lg md:text-xl text-slate-200 font-medium leading-snug shadow-md">
                        ${opt.texto}
                    </button>
                `).join('')}
            </div>
            <div id="feedback-area" class="hidden bg-slate-900 border-2 border-slate-700 p-5 rounded-2xl mt-6 shadow-inner">
                <p id="feedback-msg" class="text-xl md:text-2xl font-black mb-3"></p>
                <div class="bg-slate-950 p-4 md:p-5 rounded-xl border border-slate-800 relative mt-4">
                    <span class="absolute -top-3 left-4 bg-slate-800 text-slate-400 text-[10px] md:text-xs uppercase font-black px-3 py-1 rounded-md border border-slate-600 tracking-wider">Fundamentação Pedagógica</span>
                    <p class="text-sm md:text-base text-slate-300 italic leading-relaxed mt-2">${c.base}</p>
                </div>
                <button id="btn-next" onclick="window.app.finishTurn(0)" class="mt-6 w-full bg-cyan-700 hover:bg-cyan-600 text-white font-black py-4 rounded-xl transition-all text-lg md:text-xl shadow-xl uppercase tracking-widest">Continuar</button>
            </div>
        </div>`;
    },

    verifyAnswer: (btn, isCorrect, points) => {
        clearInterval(window.app.timerInterval); 
        
        const area = document.getElementById('options-area');
        area.querySelectorAll('button').forEach(b => b.disabled = true);
        
        const card = window.app.currentCard;
        const typeNames = {1: "Ed. Midiática", 2: "Mídia como Recurso", 3: "Prática Docente"};
        
        window.app.groups[window.app.turn].history.push({
            carta: typeNames[card.tipo] || "Problema",
            pergunta: card.cenario,
            pontos: isCorrect ? points : 0,
            status: isCorrect ? '<span class="text-emerald-400 font-bold">Acertou</span>' : '<span class="text-rose-400 font-bold">Errou</span>'
        });

        area.querySelectorAll('button').forEach(b => {
            if(b.getAttribute('data-correct') === 'true') {
                b.classList.replace('bg-slate-800', 'bg-emerald-900');
                b.classList.add('border-emerald-500', 'text-emerald-100');
            } else if (b === btn && !isCorrect) {
                b.classList.replace('bg-slate-800', 'bg-rose-900');
                b.classList.add('border-rose-500', 'text-rose-100');
            }
        });

        if(isCorrect) {
            window.app.groups[window.app.turn].score += points;
        }

        const feedback = document.getElementById('feedback-area');
        feedback.classList.remove('hidden');
        
        const msgEl = document.getElementById('feedback-msg');
        if(isCorrect) {
            msgEl.textContent = "✅ Parabéns, Resposta Correta!";
            msgEl.className = "text-2xl md:text-3xl font-black mb-3 text-emerald-400";
        } else {
            msgEl.innerHTML = "❌ Resposta Incorreta. <span class='text-sm text-slate-300 font-normal block mt-1'>A resposta correta está destacada em verde.</span>";
            msgEl.className = "text-2xl md:text-3xl font-black mb-3 text-rose-400";
        }
    },

    finishTurn: (pointsToAdd = 0, isTimeout = false) => {
        clearInterval(window.app.timerInterval);
        const card = window.app.currentCard;
        
        if (!isTimeout) {
            if (card.tipo === 4) {
                window.app.groups[window.app.turn].history.push({
                    carta: "Mergulhe Fundo",
                    pergunta: card.perguntas[0],
                    pontos: 10,
                    status: '<span class="text-yellow-400 font-bold">Debate Concluído</span>'
                });
            } else if (card.tipo === 5) {
                window.app.groups[window.app.turn].history.push({
                    carta: "Fake News",
                    pergunta: card.fakeNews,
                    pontos: card.pontos,
                    status: '<span class="text-red-500 font-bold">Penalidade</span>'
                });
            }
        }

        window.app.groups[window.app.turn].score += pointsToAdd;
        window.app.currentCard = null; 
        
        if (window.app.isGroupMode) {
            window.app.turn = (window.app.turn + 1) % window.app.groups.length;
        }
        
        document.getElementById('card-modal').classList.add('hidden');
        document.getElementById('card-modal-content').innerHTML = '';
        
        window.app.updateUI();

        const remaining = window.app.cardsStatus.filter(s => !s).length;
        if (remaining === 0) {
            setTimeout(() => {
                window.app.showVictory();
            }, 800);
        }
    },

    updateUI: () => {
        const indicator = document.getElementById('turn-indicator');
        if (window.app.isGroupMode) {
            indicator.innerHTML = `Vez: <span id="current-group-name" class="text-cyan-400 text-xl md:text-2xl">${window.app.groups[window.app.turn].name}</span>`;
            document.getElementById('ranking-title').textContent = "Ranking";
        } else {
            indicator.innerHTML = `<span class="text-cyan-400 text-xl md:text-2xl">Modo Individual</span>`;
            document.getElementById('ranking-title').textContent = "Seu Placar";
        }
        
        const ranking = document.getElementById('ranking-list');
        ranking.innerHTML = '';
        
        const sorted = [...window.app.groups].sort((a,b) => b.score - a.score);
        
        sorted.forEach(g => {
            const isTurn = window.app.isGroupMode ? (g.name === window.app.groups[window.app.turn].name) : true;
            
            ranking.innerHTML += `
                <div class="rank-item bg-slate-800 border ${isTurn ? 'border-cyan-500 bg-slate-700 shadow-[0_0_15px_rgba(34,211,238,0.3)] scale-[1.02] z-10' : 'border-slate-700'} p-3 md:p-4 rounded-xl flex flex-col md:flex-row justify-between items-center transition-all duration-300 flex-1 min-w-[40%] md:min-w-full mb-1 md:mb-0">
                    <span class="font-bold text-sm md:text-lg text-center md:text-left truncate w-full ${isTurn ? 'text-cyan-300' : 'text-slate-300'}">${g.name}</span>
                    <span class="bg-slate-900 px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-mono text-cyan-400 font-black border border-slate-700 text-base md:text-xl mt-2 md:mt-0 w-full md:w-auto text-center">${g.score}</span>
                </div>
            `;
        });
    },

    showVictory: () => {
        document.getElementById('screen-game').classList.remove('active');
        document.body.style.overflow = 'auto'; 
        
        const victoryScreen = document.getElementById('screen-victory');
        victoryScreen.classList.add('active');
        
        const sorted = [...window.app.groups].sort((a,b) => b.score - a.score);
        const winner = sorted[0];
        
        if (window.app.isGroupMode) {
            document.getElementById('victory-title').textContent = "Grupo Vencedor!";
            document.getElementById('winner-name').textContent = winner.name;
        } else {
            document.getElementById('victory-title').textContent = "Desafio Concluído!";
            document.getElementById('winner-name').textContent = "Sua Pontuação";
        }
        
        document.getElementById('winner-score').textContent = winner.score + " Pts";
        
        const tablesContainer = document.getElementById('victory-tables');
        tablesContainer.innerHTML = '';
        
        sorted.forEach((g, index) => {
            const isWinner = index === 0;
            
            let rows = g.history.map(h => `
                <tr class="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                    <td class="p-4 md:p-5 text-sm md:text-base text-cyan-200 font-bold align-top">${h.carta}</td>
                    <td class="p-4 md:p-5 text-sm md:text-base text-slate-200 align-top leading-relaxed">${h.pergunta}</td>
                    <td class="p-4 md:p-5 text-base md:text-lg font-mono font-bold text-slate-100 text-center align-middle">${h.pontos > 0 ? '+'+h.pontos : h.pontos}</td>
                    <td class="p-4 md:p-5 text-sm md:text-base text-center align-middle uppercase tracking-wider">${h.status}</td>
                </tr>
            `).join('');
            
            if (g.history.length === 0) {
                rows = `<tr><td colspan="4" class="p-8 text-center text-slate-500 italic text-lg">Nenhuma carta foi jogada por este jogador/grupo.</td></tr>`;
            }

            const tableName = window.app.isGroupMode ? `${index + 1}º Lugar: ${g.name}` : `Histórico de Partida`;

            tablesContainer.innerHTML += `
                <div class="bg-slate-800 border-2 ${isWinner ? 'border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.2)]' : 'border-slate-700'} rounded-3xl overflow-hidden">
                    <div class="bg-slate-900/80 p-5 md:p-6 border-b ${isWinner ? 'border-yellow-500/50' : 'border-slate-700'} flex flex-col sm:flex-row justify-between items-center gap-4">
                        <h3 class="text-xl md:text-2xl font-black ${isWinner ? 'text-yellow-400' : 'text-slate-300'} text-center sm:text-left uppercase tracking-widest">
                            ${tableName}
                        </h3>
                        <span class="bg-slate-950 px-5 py-2 md:px-6 md:py-3 rounded-xl font-mono text-cyan-400 font-black border border-slate-700 text-lg md:text-2xl">
                            Final: ${g.score}
                        </span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse min-w-[600px] md:min-w-[800px]">
                            <thead>
                                <tr class="bg-slate-900/60 text-slate-400 text-xs md:text-sm uppercase tracking-widest font-black">
                                    <th class="p-5 w-1/5">Tipo de Carta</th>
                                    <th class="p-5 w-2/5">Cenário Enfrentado</th>
                                    <th class="p-5 w-1/6 text-center">Pontos</th>
                                    <th class="p-5 w-1/6 text-center">Resultado</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rows}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        });
    }
};