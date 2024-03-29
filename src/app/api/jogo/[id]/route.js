import prisma from "@/services/prisma";

export async function GET(request, context) {
  const id = context.params.id;
  try {
    const jogo = await prisma.jogo.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        avaliacoes: {
          include: {
            usuario: {
              select: {
                username: true,
              },
            },
          },
        },
        comentarios: {
          include: {
            usuario: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });

    return new Response(JSON.stringify(jogo), {
      status: 200,
    });
  } catch (error) {
    console.log(`Ocorreu o erro: ${error}`);
    return new Response(JSON.stringify({ erro: `Ocorreu o erro ${error}` }), {
      status: 500,
    });
  }
}
