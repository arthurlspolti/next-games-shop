"use client";
import { useEffect, useState } from "react";
import Card from "@/components/cardJogos";
import axios from "axios";
import { UserButton } from "@clerk/nextjs";
import IconeCarrinho from "@/components/iconeCarrinho";
import Badge from "@/components/bagde";

export default function Home() {
  const [jogos, setJogos] = useState([]);
  const [classeSelecionada, setClasseSelecionada] = useState(null);
  const [valorPesquisa, setValorPesquisa] = useState("");

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const resposta = await axios.get("/api/jogos");
        const dados = resposta.data;
        setJogos(dados);
      } catch (err) {
        console.log(err);
      }
    };

    buscarDados();
  }, []);

  const jogosFiltrados = jogos.filter(
    (jogo) =>
      (classeSelecionada ? jogo.classeId === classeSelecionada : true) &&
      (valorPesquisa.length > 0
        ? jogo.nome.toLowerCase().includes(valorPesquisa.toLowerCase())
        : true)
  );

  return (
    <>
      <div className="h-screen bg-sky-950">
        <div className="flex justify-between bg-gray-800 p-4 items-center">
          <div className="flex items-center gap-4 ml-2">
            <h1 className="text-white text-3xl font-semibold">GamesCom</h1>
          </div>
          <div className="flex items-center justify-center gap-8">
            <Badge />
            <IconeCarrinho />
            <UserButton />
          </div>
        </div>
        <div className="flex bg-sky-950">
          <div className="m-4 flex gap-4 items-center justify-center w-screen">
            <button
              className="rounded-md p-4 bg-gray-900 hover:bg-gray-800 text-white"
              onClick={() => setClasseSelecionada(null)}
            >
              Todos
            </button>

            <button
              className="rounded-md p-4 bg-gray-900 hover:bg-gray-800 text-white"
              onClick={() => setClasseSelecionada(1)}
            >
              Esporte
            </button>

            <button
              className="rounded-md p-4 bg-gray-900 hover:bg-gray-800 text-white"
              onClick={() => setClasseSelecionada(2)}
            >
              Tiro em Terceira Pessoa
            </button>

            <button
              className="rounded-md p-4 bg-gray-900 hover:bg-gray-800 text-white"
              onClick={() => setClasseSelecionada(3)}
            >
              Tiro em Primeira Pessoa
            </button>
            <input
              className="rounded-md p-4 bg-gray-900 hover:bg-gray-800 text-white"
              placeholder="Pesquisar"
              onChange={(e) => setValorPesquisa(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-center items-center flex-wrap gap-4 p-4 bg-sky-950">
          {jogosFiltrados.map((jogo) => (
            <Card
              key={jogo.id}
              nome={jogo.nome}
              descricao={jogo.descricao}
              imagemUrl={jogo.imagemUrl}
              id={jogo.id}
            />
          ))}
        </div>
      </div>
    </>
  );
}
