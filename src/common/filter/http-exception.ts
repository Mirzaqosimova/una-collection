import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { HttpService } from '@nestjs/axios';
import { ErrorMessage } from '../types/errors';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpService: HttpService) {}

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorMessage = exception.message;
    const message = {
      platform: 'Reservation',
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      requestBody: request.body,
      requestParams: request.params,
      requestQuery: request.query,
      message: errorMessage,
      stack: exception.stack,
    };
    const language: any = request.query['lang'];
    let responseErrorMsg;
    if (language && ['uz', 'ru'].includes(language)) {
      responseErrorMsg = ErrorMessage[language][errorMessage]
        ? ErrorMessage[language][errorMessage]
        : errorMessage;
    } else {
      responseErrorMsg = exception.response.message
        ? exception.response.message
        : errorMessage;
    }
    if (status !== HttpStatus.UNAUTHORIZED) {
      message.message =
        exception.status == 400 ? exception.response.message : errorMessage;
      await this.sendMessage(
        process.env.ERROR_SENDER_GROUP_ID,
        this.formatTelegramMessage(message),
      );
    }
    response
      .status(status)
      .send({ message: responseErrorMsg, code: exception.status });
  }

  formatTelegramMessage(message: any): string {
    return `
🛑 *Error Notification* 🛑
*Platform:* ${message.platform}
*Status Code:* ${message.statusCode}
*Timestamp:* ${message.timestamp}
*Path:* ${message.path}
*Method:* ${message.method}

*Request Body:*
\`\`\`
${JSON.stringify(message.requestBody, null, 2)}
\`\`\`

*Request Params:*
\`\`\`
${JSON.stringify(message.requestParams, null, 2)}
\`\`\`

*Error Message:*
\`\`\`
${message.message}
\`\`\`

*Stack Trace:*
\`\`\`
${message.stack}
\`\`\`
    `;
  }

  async sendMessage(chatId: string, message: string): Promise<any> {
    const url = `https://api.telegram.org/bot${process.env.ERROR_SENDER_BOT}/sendMessage`;
    // const url = `https://api.telegram.org/bot{token}/sendMessage`;

    const data = {
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown', // Enable Markdown formatting
    };

    if (message.length > 4095) {
      // Handle message splitting if it's too long
      const first_data = {
        chat_id: chatId,
        text: message.substring(0, 4095),
        parse_mode: 'Markdown',
      };

      await this.httpService.axiosRef.post(url, first_data);

      const second_message = message.substring(4095);

      if (second_message.length > 4095) {
        const second_data = {
          chat_id: chatId,
          text: second_message.substring(0, 4095),
          parse_mode: 'Markdown',
        };

        await this.httpService.axiosRef.post(url, second_data);
      }

      const third_data = {
        chat_id: chatId,
        text: second_message.substring(4095),
        parse_mode: 'Markdown',
      };

      return this.httpService.axiosRef.post(url, third_data);
    } else {
      return this.httpService.axiosRef.post(url, data);
    }
  }
}
