import {
    Catch,
    ExceptionFilter,
    ArgumentsHost,
    HttpException,
    BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        if (exception instanceof BadRequestException) {
            const validationErrors = exception.getResponse() as { message: string[], error: string };
            console.log(validationErrors);
            if (validationErrors && validationErrors.error === 'Bad Request') {
                // Handle validation errors separately
                response
                    .status(status)
                    .json({
                        statusCode: status,
                        message: 'Validation failed',
                        errors: validationErrors.message,
                        timestamp: new Date().toISOString(),
                        path: request.url,
                    });
            } else {
                // Handle other types of Bad Request exceptions
                response
                    .status(status)
                    .json({
                        statusCode: status,
                        message: exception.message,
                        timestamp: new Date().toISOString(),
                        path: request.url,
                    });
            }
        } else {
            // Handle other types of HttpExceptions
            response
                .status(status)
                .json({
                    statusCode: status,
                    message: exception.message,
                    timestamp: new Date().toISOString(),
                    path: request.url,
                });
        }


    }

}
