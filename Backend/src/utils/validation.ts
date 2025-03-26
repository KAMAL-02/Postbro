import { z } from 'zod';

const urlRegex =  /^(https?:\/\/)([\w.-]+(?:\.[\w\.-]+)+)(:\d{1,5})?(\/[^\s?#]*)?(\?[^\s#]*)?(#[^\s]*)?$/;

const apiSchema = z.object({
    url: z.string().regex(urlRegex),
    method: z.enum(["GET", "POST", "PUT", "DELETE"]),
    params: z.record(z.string()).optional(),
    headers: z.record(z.string()).optional(),
})

export { apiSchema };