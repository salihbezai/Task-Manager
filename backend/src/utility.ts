import winston from "winston";

const logger: winston.Logger = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "errors.log", level: "error" }),
  ],
});

 function sum(a: number, b: number): number {
  return a + b;
}


export { logger, sum};
