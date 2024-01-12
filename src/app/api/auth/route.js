import prisma from "@/services/prisma";
import { currentUser } from "@clerk/nextjs";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return new Response(JSON.stringify({ user: "não tem usuario" }), {
        status: 401,
      });
    }

    const usuarioExiste = await prisma.usuario.findUnique({
      where: {
        clerkId: user.id,
      },
    });

    if (usuarioExiste) {
      return new Response(JSON.stringify({ user: usuarioExiste }), {
        status: 200,
      });
    }

    const salvarUsuario = await prisma.usuario.create({
      data: {
        email: user.emailAddresses[0].emailAddress,
        username: user.username,
        clerkId: user.id,
      },
    });
    console.log(salvarUsuario);
    return new Response(JSON.stringify({ user: salvarUsuario }), {
      status: 200,
    });
  } catch (error) {
    console.log(`Esta dando o erro: ${error}`);
  }
}
