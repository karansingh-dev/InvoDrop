import z from "zod";

export function isUUID(uuid: string) {
  const uuidSchema = z.string().uuid();

  const result = uuidSchema.safeParse(uuid);

  return result.success;
}
