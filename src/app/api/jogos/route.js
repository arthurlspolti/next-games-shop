import prisma from '@/services/prisma';

export const GET = async () => {
  const jogos = await prisma.jogo.findMany();
  return new Response(JSON.stringify(jogos), { status: 200 });
};
