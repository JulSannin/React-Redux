import { Prioroty, Status } from '../types';

export type Task = {
  id: string;
  title: string;
  priority: Prioroty;
  status: Status;
  progress: number;
};

export const taskList: Array<Task> = [
  {
    id: '01',
    title: 'Выучить React state',
    priority: Prioroty.HIGH,
    status: Status.TODO,
    progress: 0,
  },
  {
    id: '02',
    title: 'Читать книгу',
    priority: Prioroty.LOW,
    status: Status.DONE,
    progress: 100,
  },
  {
    id: '03',
    title: 'Сходить в магазин',
    priority: Prioroty.MEDIUM,
    status: Status.PROGRESS,
    progress: 50,
  },
  {
    id: '04',
    title: 'Запланить за квартиру',
    priority: Prioroty.HIGH,
    status: Status.DONE,
    progress: 100,
  },
  {
    id: '05',
    title: 'Напистаь статью',
    priority: Prioroty.MEDIUM,
    status: Status.PROGRESS,
    progress: 50,
  },
];
