import type { ActionErrorCode } from "../types/account";

// Thrown by the mutation hooks so the UI can translate the error by its code.
export class ActionError extends Error {
  readonly code: ActionErrorCode;

  constructor(code: ActionErrorCode) {
    super(code);
    this.name = "ActionError";
    this.code = code;
  }
}
