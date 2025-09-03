import process from "node:process";

import { cutil } from "@ghasemkiani/base";
import { Obj } from "@ghasemkiani/base";

class Agent extends Obj {
  static {
    cutil.extend(this.prototype, {
      fetch,
      _apiKey: null,
      model: "gemini-2.0-flash",
    });
  }
  get apiKey() {
    if (cutil.na(this._apiKey)) {
      this._apiKey = process.env["GEMINI_API_KEY"];
    }
    return this._apiKey;
  }
  set apiKey(apiKey) {
    this._apiKey = apiKey;
  }
  async toGenerateContent(prompt) {
    let agent = this;
    let { fetch } = agent;
    let { apiKey } = agent;
    let { model } = agent;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const payload = { contents: [{ parts: [{ text: prompt }] }] };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `API error: ${response.status} - ${errorData.error.message || response.statusText}`,
        );
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      throw error;
    }
  }
}

export { Agent };
