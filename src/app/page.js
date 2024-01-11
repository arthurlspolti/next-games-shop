'use client';
import { useEffect, useState } from 'react';
import Card from '@/components/cardJogos';

export default function Home() {
  const [jogos, setJogos] = useState([]);
  const [classeSelecionada, setClasseSelecionada] = useState(null);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const resposta = await fetch('/api/jogos');
        const dados = await resposta.json();
        setJogos(dados);
      } catch (err) {
        console.log(err);
      }
    };

    buscarDados();
  }, []);

  const jogosFiltrados = classeSelecionada
    ? jogos.filter((jogo) => jogo.classeId === classeSelecionada)
    : jogos;

  return (
    <>
      <div>
        <div>
          <button onClick={() => setClasseSelecionada(null)}>Todos</button>
          <button onClick={() => setClasseSelecionada(1)}>Tiro em Primeira Pessoa</button>
          <button onClick={() => setClasseSelecionada(2)}>Tiro em Terceira Pessoa</button>
          <button onClick={() => setClasseSelecionada(3)}>Esporte</button>
        </div>
      </div>
      <div className="flex justify-center items-center flex-wrap gap-4">
        {jogosFiltrados.map((jogo) => (
          <Card
            key={jogo.id}
            titulo={jogo.titulo}
            descricao={jogo.descricao}
            imagemUrl={jogo.imagemUrl}
          />
        ))}
      </div>
    </>
  );
}
