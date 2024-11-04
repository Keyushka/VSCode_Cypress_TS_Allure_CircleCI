// utils/types.ts

export interface ApiResponse {
    status: number;
    body: any; // Тут можна замінити `any` на точніший тип, якщо відома структура `body`
}
