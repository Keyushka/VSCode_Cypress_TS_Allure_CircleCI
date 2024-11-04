/// <reference types="cypress" />

import * as allure from "allure-js-commons";
import { ApiResponse } from "../utils/types";

declare global {
    namespace Cypress {
        interface Chainable {
            sentRequest(method: 'GET' | 'POST' | 'PUT' | 'DELETE', endpoint: string, payload?: any): Chainable<ApiResponse>;
        }
    }
}

// @ts-ignore: Ignore type checks for Cypress.Commands.add
Cypress.Commands.add('sentRequest', (method, endpoint, payload) => {
    return allure.step(`Trying to send ${method} request to ${endpoint}`, () => {
        if (payload && Object.keys(payload).length > 0) {
            allure.attachment(`requestBody for ${method} ${endpoint}`, JSON.stringify(payload), 'application/json');
            cy.log(`Trying to send ${method} request to ${endpoint} with body ${JSON.stringify(payload)}`);
        } else {
            cy.log(`Trying to send ${method} request to ${endpoint} without body`);
        }

        return cy.request<ApiResponse>({
            method: method as Cypress.HttpMethod,
            url: endpoint,
            body: payload,
            failOnStatusCode: false,
            headers: {
                Authorization: Cypress.env('token2'),
                Accept: 'application/json'
            }
        }).then((resp) => {
            if (resp.body) {
                allure.attachment(`responseBody for ${method} ${endpoint}`, JSON.stringify(resp.body), 'application/json');
            }
            return cy.wrap(resp);
        });
    });
});