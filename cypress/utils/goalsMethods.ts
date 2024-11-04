/// <reference types="cypress" />

import { faker } from "@faker-js/faker";
import * as allure from "allure-js-commons";
import { ApiResponse } from "./types";

const team_id = '9012454330';
const goalsURL = '/team/' + team_id + '/goal';

// Функція для обгортки в allure.step
const allureStep = (name: string, action: () => Cypress.Chainable<ApiResponse>): Cypress.Chainable<ApiResponse> => {
    return cy.then(() => allure.step(name, action)).then(result => result);
};


export const getGoals = (): Cypress.Chainable<ApiResponse> => {
    return allureStep('Get a list of Goals', () => {
        return cy.sentRequest('GET', goalsURL);
    });
};

export const createGoal = (): Cypress.Chainable<ApiResponse> => {
    return allureStep('Create Goal with random data', () => {
        return cy.fixture('createGoal.json').then((body) => {
            const randomColor = faker.color.rgb({ format: 'hex', casing: 'lower' });
            const randomDueDate = faker.date.future().getTime();
            const randomName = faker.company.name();
            const randomDescription = faker.lorem.sentence();
            
            body.name = randomName;
            body.description = randomDescription;
            body.color = randomColor;
            body.due_date = randomDueDate;

            cy.wrap(randomColor).as('randomColor');
            cy.wrap(randomDueDate).as('randomDueDate');
            cy.wrap(randomName).as('randomGoalName');
            cy.wrap(randomDescription).as('randomGoalDescription');
            
            return cy.sentRequest('POST', goalsURL, body);
        });
    });
};

export const getGoal = (goal_id: string): Cypress.Chainable<ApiResponse> => {
    return allureStep('Get Goal by ID', () => {
        return cy.sentRequest('GET', `/goal/${goal_id}`, null);
    });
};

export const updateGoal = (goal_id: string): Cypress.Chainable<ApiResponse> => {
    return allureStep('Update Goal with random data by ID', () => {
        const randomName = faker.company.name();
        const randomDescription = faker.lorem.sentence();
        const newBody = { name: randomName, description: randomDescription };

        cy.wrap(randomName).as('updatedGoalName');
        cy.wrap(randomDescription).as('updatedGoalDescription');
        
        return cy.sentRequest('PUT', `/goal/${goal_id}`, newBody);
    });
};

export const deleteGoal = (goal_id: string): Cypress.Chainable<ApiResponse> => {
    return allureStep('Delete Goal by ID', () => {
        return cy.sentRequest('DELETE', `/goal/${goal_id}`, null);
    });
};

export const createKeyResult = (goal_id: string): Cypress.Chainable<ApiResponse> => {
    return allureStep('Create KeyResult with random name by ID', () => {
        const randomName = faker.string.sample({ min: 5, max: 10 });
        cy.wrap(randomName).as('keyResultName');
        
        return cy.fixture('createKeyResult.json').then((body: any) => {
            body.name = randomName;
            return cy.sentRequest('POST', `/goal/${goal_id}/key_result`, body);
        });
    });
};

export const editKeyResult = (key_result_id: string): Cypress.Chainable<ApiResponse> => {
    return allureStep('Update KeyResult with random name by ID', () => {
        const randomName = faker.string.sample({ min: 5, max: 10 });
        cy.wrap(randomName).as('newKeyResultName');
        const newBody = { name: randomName };
        
        return cy.sentRequest('PUT', `/key_result/${key_result_id}`, newBody);
    });
};

export const deleteKeyResult = (key_result_id: string): Cypress.Chainable<ApiResponse> => {
    return allureStep('Delete KeyResult by ID', () => {
        return cy.sentRequest('DELETE', `/key_result/${key_result_id}`, null);
    });
};
