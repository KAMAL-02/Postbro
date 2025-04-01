import { z } from 'zod';

const urlRegex = /^(https?:\/\/)?([\w.-]+)(:\d+)?(\/[^\s]*)?(\?[^\s#]*)?(#[^\s]*)?$/;

const apiSchema = z.object({
    url: z.string().url(),
    method: z.enum(["GET", "POST", "PUT", "DELETE"]),
    params: z.record(z.string()).optional(),
    headers: z.record(z.string()).optional(),
    bodyData: z.union([z.record(z.unknown()), z.array(z.unknown())]).optional(),
})

export { apiSchema };