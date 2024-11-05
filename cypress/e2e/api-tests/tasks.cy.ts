import {
    createTask, getTasks, getTask, updateTask, deleteTask, 
    getFilteredTeamTask, getTaskTimeInStatus, getBulkTaskTimeInStatus
} from "../../utils/tasksMethods";
import * as allure from "allure-js-commons";

describe('Check tasks functionality on clickup', () => {

    it('Get Tasks', () => {
        allure.severity('normal');
        getTasks().then((response) => {
            expect(response.status).to.eq(200);
        });
    });

    it('Create Task', () => {
        allure.severity('blocker');
        createTask().then((response) => {
            expect(response.status).to.eq(200);
        });
    });

    it.only('Get Task', () => {
        allure.severity('critical');
        createTask().then((createResponse) => {
            const task_id = createResponse.body.id
            getTask(task_id).then((getResponse) => {
                const task = getResponse.body
                expect(getResponse.status).to.eq(200)
                cy.get('@randomTaskName').then((name) => {
                    expect(task.name).to.eq(name)
                })
                cy.get('@randomTaskDescription').then((description) => {
                    expect(task.description).to.eq(description)
                })
                expect(task.status.status).to.eq('to do')
                expect(task.status.type).to.eq('open')
                expect(task.priority.id).to.eq('3')
                expect(task.priority.priority).to.eq('normal')
                deleteTask(task_id)
            })
        })
    })

    it('Update Task', () => {
        allure.severity('critical');
        createTask().then((createResponse) => {
            const task_id = createResponse.body.id
            updateTask(task_id).then((updateResponse) => {
                expect(updateResponse.status).to.eq(200)
                getTask(task_id).then((getResponse) => {
                    const updatedTask = getResponse.body
                    expect(getResponse.status).to.eq(200)
                    cy.get('@updatedTaskName').then((name) => {
                        expect(updatedTask.name).to.eq(name)
                    })
                    cy.get('@updatedTaskDescription').then((description) => {
                        expect(updatedTask.description).to.eq(description)
                    })
                    expect(updatedTask.priority.id).to.eq('4')
                    expect(updatedTask.priority.priority).to.eq('low')
                    deleteTask(task_id)
                })
            })
        })
    })

    it('Delete Task', () => {
        allure.severity('normal');
        createTask().then((response) => {
            const task_id = response.body.id
            deleteTask(task_id).then((response) => {
                expect(response.status).to.eq(204)
                getTask(task_id).then((response) => {
                    expect(response.status).to.be.oneOf([404, 403])
                })
            })
        })
    })

    it('Get Filtered Team Tasks', () => {
        allure.severity('minor');
        createTask().then((createResponse) => {
            const task_id = createResponse.body.id;    
            getFilteredTeamTask().then((filteredTasksResponse) => {
                expect(filteredTasksResponse.status).to.eq(200)
                const tasks = filteredTasksResponse.body.tasks;                
                const createdTask = tasks.find((task: { id: string }) => task.id === task_id);    
                expect(createdTask).to.not.be.undefined;
                expect(createdTask.status.status).to.eq('to do');
                expect(createdTask.status.type).to.eq('open');
                deleteTask(task_id)
            });
        });
    });

    // only for upgraded Business Plan
    it('Get Task Time in Status - Expect 403 with Plan Restriction Message', () => {
        allure.severity('trivial');
        createTask().then((createResponse) => {
            const task_id = createResponse.body.id;  
            getTaskTimeInStatus(task_id).then((response) => {
                expect(response.status).to.eq(403);
                expect(response.body.err).to.eq("Time In Status is not available on your plan.");
                deleteTask(task_id)
            });
        });
    });
    
    // only for upgraded Business Plan
    it('Get Bulk Task Time in Status', () => {
        allure.severity('trivial');
        createTask().then((createResponse) => {
            const task_id = createResponse.body.id;  
            getBulkTaskTimeInStatus(task_id).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.deep.eq({});                 
                deleteTask(task_id)
            });
        });
    });

})
