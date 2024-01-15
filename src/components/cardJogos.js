/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";

const Card = ({ nome, descricao, imagemUrl, id }) => {
  return (
    <div className="bg-gray-900 w-full md:w-1/2 lg:w-1/4 h-full p-4 flex flex-col items-center rounded-2xl border-sky-500 border-[1px]">
      <img
        src={imagemUrl}
        alt="Capa do Jogo"
        className="w-full h-64 md:h-48 lg:h-64 rounded-lg object-fill"
      />
      <div className="flex flex-col items-center justify-center text-wrap text-center mt-4">
        <h1 className="text-white text-lg md:text-xl lg:text-2xl font-semibold truncate">
          {nome}
        </h1>
        <Link
          href={`/jogo/${id}`}
          className="mt-2 bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded"
        >
          Ver detalhes
        </Link>
      </div>
    </div>
  );
};

export default Card;
