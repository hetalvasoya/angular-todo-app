export interface Task {
    _id: string,
    title: string,
    description: string,
    dueDate: string,
    status: number,
    assigneeId: string,
    order: number
}