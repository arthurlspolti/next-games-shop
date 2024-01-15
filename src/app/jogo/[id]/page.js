/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import IconeCarrinho from "@/components/iconeCarrinho";
import Badge from "@/components/bagde";
import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const DetalheJogos = ({ params }) => {
  const [detalheJogos, setDetalheJogos] = useState({
    nome: "",
    preco: "",
    descricao: "",
    comentarios: [],
    avaliacoes: [],
    imagemUrl: "",
  });

  const [novaAvaliacao, setNovaAvaliacao] = useState({
    nota: 1,
    comentario: "",
  });

  const router = useRouter();

  const salvarUsuario = async () => {
    try {
      const resposta = await axios.get("/api/salvarUsuario");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    salvarUsuario();
  }, []);

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

  useEffect(() => {
    buscarDetalhes();
  }, [params.id]);

  async function adicionarCarrinho() {
    try {
      const id = params.id;
      console.log(id);
      await axios.post("/api/carrinho", {
        jogoId: id,
      });
    } catch (err) {
      console.log(err);
    }
  }

  const enviarComentario = async () => {
    try {
      const id = params.id;
      await axios.post("/api/comentario", {
        nota: novaAvaliacao.nota,
        comentario: novaAvaliacao.comentario,
        jogoId: id,
      });

      // Após a submissão bem-sucedida, buscar novamente os detalhes do jogo
      buscarDetalhes();

      // Limpar o estado da nova avaliação
      setNovaAvaliacao({
        nota: 1,
        comentario: "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  function mudarRota() {
    router.push("/");
  }

  return (
    <>
      <div className="flex flex-col items-center h-screen bg-sky-950">
        <div className="flex justify-between text-3xl font-bold mb-4 text-white self-start bg-gray-800 w-screen p-4">
          <div className="flex items-center gap-4 ml-2">
            <ArrowLeft onClick={mudarRota} className="cursor-pointer" />
            <h1 className="text-white text-3xl font-semibold">GamesCom</h1>
          </div>
          <div className="flex items-center gap-8">
            <Badge />
            <IconeCarrinho />
            <UserButton />
          </div>
        </div>
        <div className="bg-gray-900 rounded-lg p-8 w-4/5 text-white border-sky-500 border-[1px] overflow-y-auto">
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
                    <button
                      onClick={() => adicionarCarrinho()}
                      className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-md"
                    >
                      Comprar
                    </button>
                  </div>
                  <div className="mt-6">
                    <p className="text-gray-300">{detalheJogos.descricao}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="flex items-center">
                    <div className="mr-4 flex">
                      <select
                        value={novaAvaliacao.nota}
                        onChange={(e) =>
                          setNovaAvaliacao({
                            ...novaAvaliacao,
                            nota: parseInt(e.target.value, 10),
                          })
                        }
                        className="mr-2 bg-gray-800 text-white p-2 rounded-md border border-gray-600"
                      >
                        {[1, 2, 3, 4, 5].map((nota) => (
                          <option key={nota} value={nota}>
                            {nota}
                          </option>
                        ))}
                      </select>
                      <textarea
                        value={novaAvaliacao.comentario}
                        onChange={(e) =>
                          setNovaAvaliacao({
                            ...novaAvaliacao,
                            comentario: e.target.value,
                          })
                        }
                        rows="3"
                        required
                        placeholder="Escreva um comentário..."
                        className="mr-2 p-2 border rounded-md bg-gray-800 text-white border-gray-600"
                      />
                      <button
                        onClick={enviarComentario}
                        className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
                      >
                        Enviar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="ml-8 border-l-2 border-gray-700 pl-4">
              <div className="mb-4">
                <h2 className="text-xl font-bold mb-2">Comentários:</h2>
                {detalheJogos.comentarios.map((comentario) => (
                  <div key={comentario.id} className="mb-2">
                    <p className="text-gray-300">{comentario.texto}</p>
                    <p className="text-gray-500">
                      @{comentario.usuario.username}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mb-4">
                <h2 className="text-xl font-bold mb-2">Avaliações:</h2>
                {detalheJogos.avaliacoes.map((avaliacao) => (
                  <div key={avaliacao.id} className="mb-2">
                    <p className="text-gray-300">{avaliacao.nota} estrelas</p>
                    <p className="text-gray-500">
                      @{avaliacao.usuario.username}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetalheJogos;
