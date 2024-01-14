import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart } from "lucide-react";
import axios from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";

const BotaoComprar = ({ jogos, atualizarCarrinho }) => {
  const [compraRealizada, setCompraRealizada] = useState(false);

  const handleCompra = async () => {
    try {
      // Enviar os IDs dos jogos na requisição
      const resposta = await axios.post("/api/comprar", {
        idJogos: jogos.map((jogo) => jogo.id),
      });
      console.log(resposta.data);

      setCompraRealizada(true);

      atualizarCarrinho();
    } catch (erro) {
      console.error(`Ocorreu um erro ao realizar a compra: ${erro}`);
    }
  };

  return (
    <button
      onClick={handleCompra}
      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded m-2"
    >
      Comprar
    </button>
  );
};

const MiniCard = ({ jogo, onRemove }) => {
  const [quantidade, setQuantidade] = useState(1);

  const handleIncrease = () => {
    setQuantidade(quantidade + 1);
  };

  const handleDecrease = () => {
    if (quantidade > 1) {
      setQuantidade(quantidade - 1);
    }
  };

  const handleRemove = async () => {
    try {
      const resposta = await axios.delete("/api/carrinho", {
        data: { jogoId: jogo.id },
      });
      console.log(resposta.data);
      onRemove();
    } catch (erro) {
      console.error(`Ocorreu o erro: ${erro}`);
    }
  };

  // Converte o preço para o formato brasileiro
  const precoFormatado = (jogo.preco * quantidade).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <div className="border-2 border-gray-300 m-4 p-4">
      <h2 className="text-xl font-bold">{jogo.nome}</h2>
      <p className="text-lg">Preço: {jogo.preco}</p>
      <p className="text-lg">Quantidade: {quantidade}</p>
      <button
        onClick={handleIncrease}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2"
      >
        Adicionar
      </button>
      <button
        onClick={handleDecrease}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2"
      >
        Diminuir
      </button>
      <button
        onClick={handleRemove}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded m-2"
      >
        Remover
      </button>
      <p className="text-lg">Total: {precoFormatado}</p>
    </div>
  );
};

const calcularTotal = (jogos) => {
  // Calcula o total somando os preços de todos os jogos
  const total = jogos.reduce((soma, jogo) => soma + Number(jogo.preco), 0);

  // Formata o total para o formato brasileiro
  const totalFormatado = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return totalFormatado;
};

const IconeCarrinho = () => {
  const [dadosCarrinho, setDadosCarrinho] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const buscarDados = async () => {
    setCarregando(true);
    try {
      const resposta = await axios.get("/api/carrinho");
      setDadosCarrinho(resposta.data);
      console.log(resposta.data);
      console.log(dadosCarrinho);
    } catch (erro) {
      console.log(`Ocorreu o erro: ${erro}`);
    }
    setCarregando(false);
  };

  const handleIconClick = () => {
    buscarDados();
  };

  const handleRemove = () => {
    buscarDados();
  };

  return (
    <>
      <Sheet>
        <SheetTrigger onClick={handleIconClick}>
          {" "}
          <ShoppingCart size={20} className="text-white" />
        </SheetTrigger>
        <SheetContent className="bg-gray-800 overflow-y-scroll max-h-screen">
          <SheetHeader>
            <SheetDescription className="text-white">
              <div className="bg-gray-800 p-4">
                <h1 className="text-2xl text-white">Seu carrinho</h1>
                <div className="text-white">
                  Itens do carrinho:
                  {carregando
                    ? "Carregando..."
                    : dadosCarrinho &&
                      dadosCarrinho.carrinho &&
                      dadosCarrinho.carrinho.length > 0
                    ? dadosCarrinho.carrinho.map((item, index) => (
                        <MiniCard
                          key={index}
                          jogo={item}
                          onRemove={handleRemove}
                        />
                      ))
                    : "Carrinho vazio"}
                </div>
              </div>
              {/* Passando os jogos para o BotaoComprar */}
              {dadosCarrinho &&
                dadosCarrinho.carrinho &&
                dadosCarrinho.carrinho.length > 0 && (
                  <h2 className="text-xl text-white">
                    Total: {calcularTotal(dadosCarrinho.carrinho)}
                  </h2>
                )}
              <BotaoComprar
                jogos={dadosCarrinho ? dadosCarrinho.carrinho : []}
                atualizarCarrinho={buscarDados}
              />
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default IconeCarrinho;
