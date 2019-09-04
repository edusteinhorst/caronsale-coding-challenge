import "reflect-metadata";
import { ILogger } from "../interface/ILogger";
import { injectable } from "inversify";
import { createLogger, format, transports } from "winston";

@injectable()
export class Logger implements ILogger {

    private logger = createLogger({
        transports: [
            new transports.Console({ format: format.simple() }),
        ],
        exitOnError: false,
    });

    public info(message: string): void {
        this.logger.info(message);
    }

    public error(message: string): void {
        this.logger.error(message);
    }
}
