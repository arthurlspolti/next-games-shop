import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart } from "lucide-react";
import axios from "axios";

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
    <div className="flex flex-col mt-4">
      <p>Confirmar compra</p>
      <button
        onClick={handleCompra}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2 w-[120px]"
      >
        Comprar
      </button>
    </div>
  );
};

const MiniCard = ({ jogo, onRemove, onQuantityChange }) => {
  const [quantidade, setQuantidade] = useState(1);

  const handleIncrease = () => {
    const novaQuantidade = quantidade + 1;
    setQuantidade(novaQuantidade);
    onQuantityChange(jogo.id, novaQuantidade); // Altere esta linha
  };

  const handleDecrease = () => {
    if (quantidade > 1) {
      const novaQuantidade = quantidade - 1;
      setQuantidade(novaQuantidade);
      onQuantityChange(jogo.id, novaQuantidade); // Altere esta linha
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

const IconeCarrinho = () => {
  const [dadosCarrinho, setDadosCarrinho] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [quantidades, setQuantidades] = useState({});

  const handleQuantityChange = (id, quantidade) => {
    setQuantidades({
      ...quantidades,
      [id]: quantidade,
    });
  };

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

  const calcularTotal = (jogos) => {
    const total = jogos.reduce((soma, jogo) => {
      const preco = Number(jogo.preco);
      const quantidade = Number(quantidades[jogo.id] || 1);

      if (isNaN(preco) || isNaN(quantidade)) {
        console.error("Preço ou quantidade inválidos", jogo);
        return soma;
      }

      return soma + preco * quantidade;
    }, 0);

    const totalFormatado = total.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return totalFormatado;
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
                          onQuantityChange={handleQuantityChange} // Esta linha está correta
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
