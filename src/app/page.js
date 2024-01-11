'use client';
import { useEffect, useState } from 'react';
import Card from '@/components/cardJogos';

export default function Home() {
  const [jogos, setJogos] = useState([]);

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

  return (
    <>
      <div></div>
      <div className="flex justify-center items-center flex-wrap gap-4">
        {jogos.map((jogo) => (
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
