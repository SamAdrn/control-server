import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        // Determine the status code
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        // Determine the error message
        const message =
            exception instanceof HttpException
                ? exception.getResponse()
                : 'Internal server error';

        // Determine timestamp
        const timestamp = new Date().toISOString();

        // Log the exception details on the console
        console.error(`[${timestamp}] ${status} Error:`, exception);

        // Send the response
        response.status(status).json({
            success: false,
            statusCode: status,
            message:
                typeof message === 'string'
                    ? message
                    : message['message'] || message,
            timestamp: timestamp,
            path: request.url,
        });
    }
}
