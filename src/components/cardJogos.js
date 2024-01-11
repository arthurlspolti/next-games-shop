import React from "react";
import Image from "next/image";
import Link from "next/link";
const Card = ({ titulo, descricao, imagemUrl, id }) => {
  return (
    <div className="bg-gray-900 w-[400px] h-[425px] p-4 flex flex-col items-center rounded-2xl">
      <Image
        src={imagemUrl}
        alt="Capa do Jogo"
        width={300}
        height={300}
        className="rounded-lg"
      />
      <div className="flex flex-col items-center justify-center text-wrap text-center mt-4">
        <h1 className="text-white text-xl font-semibold">{titulo}</h1>
        <p className="text-gray-300">{descricao}</p>
        <Link
          href={`/jogo/${id}`}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Ver detalhes
        </Link>
      </div>
    </div>
  );
};

export default Card;
