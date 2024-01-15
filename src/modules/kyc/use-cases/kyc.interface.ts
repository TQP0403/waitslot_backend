export interface KycInterface {
  send(username: string, token: string): Promise<void> | void;
}
