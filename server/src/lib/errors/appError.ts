export class AppError extends Error {
  constructor(
    public status: number,
    msg: string = 'Error occurred'
  ) {
    super(msg);
    this.status = status;
  }
}
