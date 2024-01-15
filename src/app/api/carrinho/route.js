import prisma from "@/services/prisma";
import { currentUser } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await currentUser();

  if (!user) {
    return new Response(JSON.stringify({ user: "não tem usuario" }), {
      status: 401,
    });
  }

  const carrinhoUsuario = await prisma.carrinho.findFirst({
    where: {
      usuarioId: user.id,
    },
    include: {
      carrinhoJogos: {
        include: {
          jogo: {
            select: {
              id: true,
              nome: true,
              preco: true,
            },
          },
        },
      },
    },
  });

  // Verifica se carrinhoUsuario e carrinhoUsuario.carrinhoJogos existem antes de mapeá-los para um array
  const carrinhoArray =
    carrinhoUsuario && carrinhoUsuario.carrinhoJogos
      ? carrinhoUsuario.carrinhoJogos.map((item) => ({
          id: item.jogo.id,
          nome: item.jogo.nome,
          preco: item.jogo.preco,
        }))
      : [];

  return new Response(JSON.stringify({ carrinho: carrinhoArray }));
}

export async function POST(request) {
  try {
    const user = await currentUser();
    const userId = user.id;

    const { jogoId } = await request.json();

    if (!user) {
      return new Response(JSON.stringify({ user: "não tem usuario" }), {
        status: 401,
      });
    }

    const carrinhoExistente = await prisma.carrinho.findFirst({
      where: {
        usuarioId: userId,
      },
    });

    if (!carrinhoExistente) {
      const novoCarrinho = await prisma.carrinho.create({
        data: {
          usuario: {
            connect: {
              clerkId: userId,
            },
          },
        },
      });

      const adicionarJogoAoCarrinho = await prisma.carrinhoJogo.create({
        data: {
          carrinho: {
            connect: {
              id: novoCarrinho.id,
            },
          },
          jogo: {
            connect: {
              id: Number(jogoId),
            },
          },
        },
      });

      return new Response(JSON.stringify({ carrinho: novoCarrinho }));
    } else {
      // Verifica se o jogo já está no carrinho do usuário
      const jogoNoCarrinho = await prisma.carrinhoJogo.findFirst({
        where: {
          carrinhoId: carrinhoExistente.id,
          jogoId: Number(jogoId),
        },
      });

      if (jogoNoCarrinho) {
        // Se o jogo já está no carrinho, retorna uma mensagem de sucesso
        return new Response(
          JSON.stringify({ message: "O jogo já está no carrinho" }),
          { status: 200 }
        );
      }

      const adicionarJogoAoCarrinho = await prisma.carrinhoJogo.create({
        data: {
          carrinho: {
            connect: {
              id: carrinhoExistente.id,
            },
          },
          jogo: {
            connect: {
              id: Number(jogoId),
            },
          },
        },
      });

      return new Response(JSON.stringify({ carrinho: carrinhoExistente }));
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function DELETE(request) {
  try {
    const user = await currentUser();
    const userId = user.id;
    const { jogoId } = await request.json();

    if (!user) {
      return new Response(JSON.stringify({ user: "não tem usuario" }), {
        status: 401,
      });
    }

    const carrinhoExistente = await prisma.carrinho.findFirst({
      where: {
        usuarioId: userId,
      },
    });

    if (carrinhoExistente) {
      const removerJogoDoCarrinho = await prisma.carrinhoJogo.deleteMany({
        where: {
          AND: [
            { carrinhoId: carrinhoExistente.id },
            { jogoId: Number(jogoId) },
          ],
        },
      });

      return new Response(JSON.stringify({ carrinho: carrinhoExistente }));
    } else {
      return new Response(
        JSON.stringify({ error: "Carrinho não encontrado" }),
        {
          status: 404,
        }
      );
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
