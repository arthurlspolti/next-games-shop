import prisma from "@/services/prisma";
import { currentUser } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export async function GET(request) {
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
    } else {
      const salvarUsuario = await prisma.usuario.create({
        data: {
          email: user.emailAddresses[0].emailAddress,
          username: user.username,
          clerkId: user.id,
        },
      });

      return new Response(JSON.stringify({ user: salvarUsuario }), {
        status: 200,
      });
    }
  } catch (error) {
    console.log(`Esta dando o erro: ${error}`);
  }
}
