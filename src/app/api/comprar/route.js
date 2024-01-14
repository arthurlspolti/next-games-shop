import { currentUser } from "@clerk/nextjs";
import prisma from "@/services/prisma";

export async function POST(request) {
  const user = await currentUser();
  const { idJogos } = await request.json();
  console.log(idJogos);

  try {
    const compra = await Promise.all(
      idJogos.map(async (idJogo) => {
        return prisma.compra.create({
          data: {
            usuarioId: user.id,
            jogoId: Number(idJogo),
          },
        });
      })
    );

    const carrinho = await prisma.carrinho.findFirst({
      where: { usuarioId: user.id },
    });

    if (!carrinho) {
      return res.status(404).json({ error: "Carrinho não encontrado" });
    }

    await prisma.carrinhoJogo.deleteMany({
      where: { carrinhoId: carrinho.id },
    });

    await prisma.carrinho.delete({
      where: { id: carrinho.id },
    });

    return new Response(JSON.stringify(compra), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
}

export async function GET() {
  const user = await currentUser();

  if (!user) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  try {
    const compras = await prisma.compra.findMany({
      where: {
        usuarioId: user.id,
      },
      select: {
        id: true,
      },
    });

    const iconeVisivel = compras.length > 5;
    console.log(iconeVisivel);

    return new Response(JSON.stringify(iconeVisivel), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(`Ocorreu o erro ${error}`), {
      status: 500,
    });
  }
}
