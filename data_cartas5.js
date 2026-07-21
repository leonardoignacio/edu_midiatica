const cartasTipo5 = [
    { tipo: 5, pontos: -2, fakeNews: "Você compartilhou a notícia de que o Senac cancelou todos os cursos presenciais e agora será tudo no Metaverso." },
    { tipo: 5, pontos: -2, fakeNews: "Você compartilhou a notícia de que alterar o arquivo 'hosts' do Windows magicamente deixa a internet 1000% mais rápida." },
    { tipo: 5, pontos: -2, fakeNews: "Você compartilhou um meme afirmando que as urnas eletrônicas rodam em um servidor do Minecraft." },
    { tipo: 5, pontos: -2, fakeNews: "Você compartilhou a notícia de que o ChatGPT foi adquirido pelo Governo Federal e passará a cobrar impostos por mensagem." },
    { tipo: 5, pontos: -2, fakeNews: "Você curtiu e compartilhou que a configuração mime-type no lighttpd causa incêndios espontâneos no servidor físico." },
    { tipo: 5, pontos: -2, fakeNews: "Você enviou em todos os grupos que carregar o celular dentro do micro-ondas carrega a bateria em 5 segundos." },
    { tipo: 5, pontos: -2, fakeNews: "Você retuitou que profissionais de TI serão todos substituídos por IA em 2 meses e que o diploma não vale nada." },
    { tipo: 5, pontos: -2, fakeNews: "Você alertou seus amigos que a vacina atualiza o driver do 5G direto no seu DNA sem checar a fonte." },
    { tipo: 5, pontos: -2, fakeNews: "Você encaminhou um áudio falso dizendo que a direção do Senac bloqueou o uso de qualquer rede social no bairro inteiro." },
    { tipo: 5, pontos: -2, fakeNews: "Você postou que criar servidores Docker gasta mais água que a agricultura local." }
];
// Autopreenchimento mecânico para alcançar 20 cartas sorteadas de punição
for(let i=11; i<=20; i++){ cartasTipo5.push(cartasTipo5[Math.floor(Math.random()*10)]); }