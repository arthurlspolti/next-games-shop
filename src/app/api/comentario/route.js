import prisma from "@/services/prisma";
import { currentUser } from "@clerk/nextjs";

export async function POST(request) {
  try {
    const { nota, comentario, jogoId } = await request.json();
    const notaInt = parseInt(nota);
    const jogoIdInt = parseInt(jogoId);

    // Obter usuário atual
    const user = await currentUser();
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Usuário não autenticado" }),
        {
          status: 401,
        }
      );
    }

    const usuario = await prisma.usuario.findUnique({
      where: {
        clerkId: user.id,
      },
    });

    if (!usuario) {
      return new Response(
        JSON.stringify({ error: "Usuário não encontrado no banco de dados" }),
        {
          status: 404,
        }
      );
    }

    // Verificar se o jogo existe
    const jogo = await prisma.jogo.findUnique({
      where: {
        id: jogoIdInt,
      },
    });

    if (!jogo) {
      return new Response(JSON.stringify({ error: "Jogo não encontrado" }), {
        status: 404,
      });
    }

    const novoComentario = await prisma.comentario.create({
      data: {
        texto: comentario,
        usuarioId: usuario.id,
        jogoId: jogo.id,
      },
    });

    const novaAvaliacao = await prisma.avaliacao.create({
      data: {
        nota: notaInt,
        usuarioId: usuario.id,
        jogoId: jogo.id,
      },
    });

    return new Response(
      JSON.stringify({ comentario: novoComentario, avaliacao: novaAvaliacao }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(`Erro: ${error}`);
    return new Response(JSON.stringify({ error: "Erro interno do servidor" }), {
      status: 500,
    });
  }
}
