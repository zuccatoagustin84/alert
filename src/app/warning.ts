export interface Warning {
  present: boolean;
  accepted: boolean;
  accept: () => void;
}

export class WarningImpl implements Warning {
  constructor(public present: boolean = true, public accepted: boolean = false) {}

  accept(): void {
    this.accepted = true;
  }
}