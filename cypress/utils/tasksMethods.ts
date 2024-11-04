/// <reference types="cypress" />

import { faker } from "@faker-js/faker";
import * as allure from "allure-js-commons";
import { ApiResponse } from "./types";

const list_id = '901205435871';
const team_id = '9012454330';
const tasksURL = '/list/' + list_id + '/task';

// Функція для обгортки в allure.step
const allureStep = (name: string, action: () => Cypress.Chainable<ApiResponse>): Cypress.Chainable<ApiResponse> => {
    return cy.then(() => allure.step(name, action)).then(result => result);
};


export const getTasks = (): Cypress.Chainable<ApiResponse> => {
    return allureStep('Get a list of Tasks', () => {
        return cy.sentRequest('GET', tasksURL);
    });
};

export const createTask = (): Cypress.Chainable<ApiResponse> => {
    return allureStep('Create Task with random data', () => {
        return cy.fixture('createTask.json').then((body) => {
            const randomName = faker.company.name();
            const randomDescription = faker.lorem.sentence();
            
            body.name = randomName;
            body.description = randomDescription;

            cy.wrap(randomName).as('randomTaskName');
            cy.wrap(randomDescription).as('randomTaskDescription');
            
            return cy.sentRequest('POST', tasksURL + '?custom_task_ids=true&team_id=' + team_id, body);
        });
    });
};

export const getTask = (task_id: string): Cypress.Chainable<ApiResponse> => {
    return allureStep('Get Task by ID', () => {
        return cy.sentRequest('GET', `/task/${task_id}`, null);
    });
};

export const updateTask = (task_id: string): Cypress.Chainable<ApiResponse> => {
    return allureStep('Update Task with random data by ID', () => {
        const randomName = faker.company.name();
        const randomDescription = faker.lorem.sentence();
        const newBody = { name: randomName, description: randomDescription, priority: 4 };

        cy.wrap(randomName).as('updatedTaskName');
        cy.wrap(randomDescription).as('updatedTaskDescription');
        
        return cy.sentRequest('PUT', `/task/${task_id}`, newBody);
    });
};

export const deleteTask = (task_id: string): Cypress.Chainable<ApiResponse> => {
    return allureStep('Delete Task by ID', () => {
        return cy.sentRequest('DELETE', `/task/${task_id}?custom_task_ids=true&team_id=${team_id}`, null);
    });
};

export const getFilteredTeamTask = (): Cypress.Chainable<ApiResponse> => {
    return allureStep('Get filtered tasks for team', () => {
        //return cy.sentRequest('GET', `/team/${team_id}/task?page=0&order_by=id&statuses[]=to%20do`, null);
        const params = new URLSearchParams({
            page: '0',
            order_by: 'id'
        });
        // Додаємо статус як окремий параметр, враховуючи що це масив
        params.append('statuses[]', 'to do');
        const url = `/team/${team_id}/task?${params.toString()}`;
        return cy.sentRequest('GET', url, null);
    });
};

// only for upgraded Business Plan
export const getTaskTimeInStatus = (task_id: string): Cypress.Chainable<ApiResponse> => {
    return allureStep('Get Task Time in Status', () => {
        const params = new URLSearchParams({
            custom_task_ids: 'true',
            team_id: team_id
        });
        const url = `/task/${task_id}/time_in_status?${params.toString()}`;
        return cy.sentRequest('GET', url, null);
    });
};


// only for upgraded Business Plan
// export const getBulkTaskTimeInStatus2 = (task_id: string): Cypress.Chainable<ApiResponse> => {
//     return allureStep('Get Bulk Task Time in Status', () => {
//         return cy.sentRequest('GET', `/task/bulk_time_in_status/task_ids?task_ids=${task_id}&custom_task_ids=false&team_id=${team_id}`, null);
//     });
// };

// only for upgraded Business Plan
export const getBulkTaskTimeInStatus = (task_id: string): Cypress.Chainable<ApiResponse> => {
    return allureStep('Get Bulk Task Time in Status', () => {
        const params = new URLSearchParams({
            task_ids: task_id,
            custom_task_ids: 'false',
            team_id: team_id
        });
        const url = `/task/bulk_time_in_status/task_ids?${params.toString()}`;
        return cy.sentRequest('GET', url, null);
    });
};
