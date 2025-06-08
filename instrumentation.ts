import { registerOTel } from "@vercel/otel";
import { ConsoleSpanExporter } from "@opentelemetry/sdk-trace-base";
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { WinstonTraceExporter } = await import(
      "./otel/winstonTraceExporter"
    );
    registerOTel({
      serviceName: "next-server-side",
      traceExporter: new WinstonTraceExporter(),
    });
  } else {
    registerOTel({
      serviceName: "next-client-side",
      traceExporter: new ConsoleSpanExporter(),
    });
  }
}
