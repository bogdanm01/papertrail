export class AppError extends Error {
  constructor(
    public status: number,
    msg?: string,
    public clientMessage: string = 'Error occurred'
  ) {
    super(msg);
    this.status = status;
    this.clientMessage = clientMessage;
  }
}
