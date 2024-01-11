import React from 'react';
import Image from 'next/image';
const Card = ({ titulo, descricao, imagemUrl }) => {
  return (
    <div className="bg-slate-600 w-[400px] h-[425px] p-4 flex flex-col  items-center rounded-2xl">
      <Image src={imagemUrl} alt="Capa do Jogo" width={300} height={300} />
      <div className="flex flex-col items-center justify-center text-wrap text-center">
        <h1>{titulo}</h1>
        <p>{descricao}</p>
      </div>
    </div>
  );
};

export default Card;
