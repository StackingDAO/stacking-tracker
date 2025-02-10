// app/api/revalidate/route.ts
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
  try {
    revalidatePath("/");
    revalidatePath("/positions");
    revalidatePath("/tokens");
    revalidatePath("/pools");
    revalidatePath("/signers");

    return NextResponse.json({ revalidated: true });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error revalidating",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}
