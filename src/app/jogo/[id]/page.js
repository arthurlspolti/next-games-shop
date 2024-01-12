/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft } from "lucide-react";

const DetalheJogos = ({ params }) => {
  const [detalheJogos, setDetalheJogos] = useState({
    titulo: "",
    preco: "",
    descricao: "",
    comentarios: "",
    imagemUrl: "",
  });

  useEffect(() => {
    const buscarDetalhes = async () => {
      try {
        const id = params.id;
        const resposta = await axios.get(`/api/jogo/${id}`);
        const dados = resposta.data;

        setDetalheJogos({
          nome: dados.nome,
          preco: dados.preco,
          descricao: dados.descricao,
          comentarios: dados.comentarios,
          avaliacoes: dados.avaliacoes,
          imagemUrl: dados.imagemUrl,
        });
      } catch (err) {
        console.log(err);
      }
    };

    buscarDetalhes();
  }, [params.id]);

  function mudarRota() {
    window.history.back();
  }

  return (
    <>
      <div className="flex flex-col items-center  h-screen bg-sky-950">
        <div className="text-3xl font-bold mb-4 text-white self-start bg-gray-800 w-screen p-4">
          <div className="flex items-center gap-4 ml-2">
            <ArrowLeft onClick={mudarRota} />
            <h1 className="text-white text-3xl font-semibold">GamesCom</h1>
          </div>
        </div>
        <div className="bg-gray-900 rounded-lg p-8 w-4/5 text-white border-sky-500 border-[1px]">
          <div className="flex">
            <div className="w-1/2 p-4">
              <img
                src={detalheJogos.imagemUrl}
                alt="Imagem do Produto"
                className="w-full h-auto rounded-md"
              />
            </div>
            <div className="w-1/2 p-4">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-4">
                    {detalheJogos.nome}
                  </h1>
                  <div className="flex justify-end gap-2 items-center">
                    <h2 className="text-3xl font-semibold">
                      R$: {detalheJogos.preco}
                    </h2>
                    <button className="bg-blue-500 text-white px-6 py-3 rounded-md">
                      Comprar
                    </button>
                  </div>
                  <div className="mt-6">
                    <p className="text-gray-300">{detalheJogos.descricao}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="mb-4">
                    Comentarios: {detalheJogos.comentarios}
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4">
                      Avaliações: {detalheJogos.avalicoes}
                    </div>
                    {/* Adicione aqui elementos para a avaliação, como estrelas ou outros componentes */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetalheJogos;
