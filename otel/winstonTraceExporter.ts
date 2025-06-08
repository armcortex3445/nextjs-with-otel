// otel/WinstonTraceExporter.ts
import {
  ConsoleSpanExporter,
  ReadableSpan,
} from "@opentelemetry/sdk-trace-base";
import {
  ExportResult,
  ExportResultCode,
  hrTimeToMicroseconds,
} from "@opentelemetry/core";
import { serverLogger } from "../util/winston";
import { server } from "typescript";
import util from "util";

export class WinstonTraceExporter extends ConsoleSpanExporter {
  export(
    spans: ReadableSpan[],
    resultCallback: (result: ExportResult) => void
  ): void {
    return this._sendSpansToWinston(spans, resultCallback);
  }

  shutdown(): Promise<void> {
    return Promise.resolve();
  }

  private _exportInfoFromBase(span: ReadableSpan) {
    return {
      resource: {
        attributes: span.resource.attributes,
      },
      instrumentationScope: span["instrumentationScope"] || undefined,
      traceId: span.spanContext().traceId,
      parentSpanContext: span["parentSpanContext"] || undefined,
      traceState: span.spanContext().traceState?.serialize(),
      name: span.name,
      id: span.spanContext().spanId,
      kind: span.kind,
      timestamp: hrTimeToMicroseconds(span.startTime),
      duration: hrTimeToMicroseconds(span.duration),
      attributes: span.attributes,
      status: span.status,
      events: span.events,
      links: span.links,
    };
  }

  private _sendSpansToWinston(
    spans: ReadableSpan[],
    done?: (result: ExportResult) => void
  ): void {
    for (const span of spans) {
      const infoObj = this._exportInfoFromBase(span);
      const info = util.inspect(infoObj, { depth: 3 });
      serverLogger.info(info);
      //   console.dir(this._exportInfo(span), { depth: 3 });
    }
    if (done) {
      return done({ code: ExportResultCode.SUCCESS });
    }
  }
}
