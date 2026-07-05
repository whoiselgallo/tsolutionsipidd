import { WebSocketServer, type WebSocket } from "ws";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export function startRUA(server: any) {
    const wss = new WebSocketServer({ server });

    wss.on("connection", (ws: WebSocket) => {
        const history: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
            {
                role: "system",
                content:
                    "Eres RUA, el asistente de TSolutions IPIDD. Responde de forma breve, útil y profesional.",
            },
        ];

        ws.on("message", async (message: WebSocket.RawData) => {
            const text = message.toString().trim();
            if (!text) return;

            history.push({ role: "user", content: text });

            try {
                if (!process.env.OPENAI_API_KEY) {
                    ws.send(JSON.stringify({ error: "OPENAI_API_KEY is not configured" }));
                    return;
                }

                const completion = await client.chat.completions.create({
                    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
                    messages: history,
                    temperature: 0.7,
                });

                const answer = completion.choices[0]?.message?.content ?? "Sin respuesta.";
                history.push({ role: "assistant", content: answer });
                ws.send(answer);
            } catch (error) {
                const detail = error instanceof Error ? error.message : String(error);
                ws.send(JSON.stringify({ error: detail }));
            }
        });
    });
}
