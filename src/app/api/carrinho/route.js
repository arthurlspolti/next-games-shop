import prisma from "@/services/prisma";
import { currentUser } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await currentUser();
  console.log(user);

  if (!user) {
    return new Response(JSON.stringify({ user: "não tem usuario" }), {
      status: 401,
    });
  }

  const carrinhoUsuario = await prisma.carrinho.findFirst({
    where: {
      usuarioId: user.id,
    },
  });

  return new Response(JSON.stringify({ carrinho: carrinhoUsuario }));
}

export async function POST(request) {
  try {
    const user = await currentUser();
    const userId = user.id;
    console.log(userId);

    const { jogoId } = await request.json();

    if (!user) {
      return new Response(JSON.stringify({ user: "não tem usuario" }), {
        status: 401,
      });
    }
    const adicionarCarrinho = await prisma.carrinho.create({
      data: {
        quantidade: 1,
        usuarioId: userId,
        jogoId: jogoId,
      },
    });

    return new Response(JSON.stringify({ carrinho: adicionarCarrinho }));
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
