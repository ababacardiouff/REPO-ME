type Labels = Record<string, string>;

class Counter {
  private value = 0;
  constructor(public readonly name: string) {}
  inc(_labels?: Labels, amount = 1) {
    this.value += amount;
  }
  get() {
    return this.value;
  }
}

class Gauge {
  private value = 0;
  constructor(public readonly name: string) {}
  set(value: number) {
    this.value = value;
  }
  get() {
    return this.value;
  }
}

class Histogram {
  private observations: number[] = [];
  constructor(public readonly name: string) {}
  startTimer() {
    const start = process.hrtime.bigint();
    return () => {
      const sec = Number(process.hrtime.bigint() - start) / 1_000_000_000;
      this.observations.push(sec);
    };
  }
  getCount() {
    return this.observations.length;
  }
}

export const httpRequestDuration = new Histogram("eats_http_request_duration_seconds");
export const httpRequestsTotal = new Counter("eats_http_requests_total");
export const menuCreates = new Counter("eats_menu_creates_total");
export const FatimaValidationFailures = new Counter("eats_Fatima_validation_failures_total");
export const outboxLagGauge = new Gauge("eats_outbox_lag");

const register = {
  contentType: "text/plain",
  async metrics() {
    return [
      `# TYPE ${httpRequestsTotal.name} counter`,
      `${httpRequestsTotal.name} ${httpRequestsTotal.get()}`,
      `# TYPE ${menuCreates.name} counter`,
      `${menuCreates.name} ${menuCreates.get()}`,
      `# TYPE ${FatimaValidationFailures.name} counter`,
      `${FatimaValidationFailures.name} ${FatimaValidationFailures.get()}`,
      `# TYPE ${outboxLagGauge.name} gauge`,
      `${outboxLagGauge.name} ${outboxLagGauge.get()}`,
      `# TYPE ${httpRequestDuration.name} summary`,
      `${httpRequestDuration.name}_count ${httpRequestDuration.getCount()}`
    ].join("\n");
  }
};

export default { register };
