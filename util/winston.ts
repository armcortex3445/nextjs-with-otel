import * as winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

//ref : https://pypystory.tistory.com/80

const isProduction = process.env.NODE_ENV == "production";

const dailyOptions = (level: string) => {
  return {
    level,
    datePattern: "YYYY-MM-DD",
    dirname: `logs/app`,
    filename: `%DATE%.${level}.log`,
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
  };
};

/*
# level     - Logger function
  error: 0, - Logger.error()
  warn: 1,  - Logger.warn()
  info: 2,  - Logger.log() ** careful with this level*
  http: 3,  -  Not used
  verbose: 4, - Logger.verbose()
  debug: 5,   - Logger.debug()
  silly: 6
};
*/

// TODO: 로그 로직 개선
// - [ ] 로그 출력시 호출자 context(파일, 모듈, 클래스) 정보도 포함하여 출력하기
//  -> 디버깅시 로그 정보를 빠르게 확인하기 위함.
// - [ ] exceptionHandlers 설정이 동작안하는 버그 수정
// ! 주의: <경고할 사항>
// ? 질문: <의문점 또는 개선 방향>
// * 참고: <관련 정보나 링크>
const logFormat = winston.format.printf((info) => {
  let icon = "";
  switch (info.level) {
    // 아이콘 사용시, vscode terminal 로그 중간에 공백 삽입되는 문제발생. 유니코드로 대체하였지만, 여전히 결과는 같음.
    // 아이콘 자체가 유니코드이므로, 아이콘을 유니코드 값으로 결과는 같음.
    // 문제 원인은 터미널의 유니코드 인코딩에 있는 것으로 보임. 다만 DebugConsole에서 문제는 없음
    case "error":
      icon = "\u274C"; // ❌
      break;
    case "warn":
      icon = "\u26A0\uFE0F"; // ⚠️
      break;
    case "info":
      icon = "\uD83D\uDFE2"; // 🟢
      break;
    case "http":
    case "verbose":
    case "debug":
      icon = "\uD83D\uDEE0\uFE0F"; // 🛠️
      break;
    default:
  }

  //VS Debug Console 출력용
  if (!isProduction) {
    console.debug(
      `${icon} [${info.label}] ${info.timestamp} [${info.level}] : ${info.message}`
    );
  }
  return `${icon} [${info.label}] ${info.timestamp} [${info.level}] : ${info.message}`;
});

export const serverLogger: winston.Logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
    winston.format.label({ label: "next.js-server" }),
    winston.format.splat(), //String interpolation splat for %d %s %O -style messages. you can log object by using %O
    winston.format.combine(logFormat) // 모든 transport에 대한 로그 형식 기본값 설정
  ),
  transports: [
    new winston.transports.Console({
      level: isProduction ? "info" : "debug",
    }),
    new DailyRotateFile(dailyOptions("info")),
  ],

  exceptionHandlers: [new DailyRotateFile(dailyOptions("exception"))],
});
