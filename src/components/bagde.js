import { useEffect, useState } from "react";
import axios from "axios";
import { Medal } from "lucide-react";

const Badge = () => {
  const [iconeVisivel, setIconeVisivel] = useState(false);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const resposta = await axios.get("/api/comprar");
        setIconeVisivel(resposta.data);
      } catch (erro) {
        console.error(`Ocorreu um erro ao buscar os dados: ${erro}`);
      }
    };

    buscarDados();
  }, []);

  return iconeVisivel ? <Medal className="text-white" /> : null;
};

export default Badge;
