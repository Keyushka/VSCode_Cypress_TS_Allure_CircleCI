/// <reference types="cypress" />

import { ApiResponse } from "../utils/types";

declare namespace Cypress {
    interface Chainable<Subject = any> {
        sentRequestT2(method: 'GET' | 'POST' | 'PUT' | 'DELETE', endpoint: string, payload?: any): Chainable<Response<ApiResponse>>;
    }
}

