import { Request, Response } from "express";
import Task from "../models/Task";
import excelJS from 'exceljs';
import { IUser, User } from '../models/User';
import { logger } from "../utility";


export const exportTaskReport = async (req: Request, res: Response) => {
  // Logic to generate and send task report
  try {
    const tasks = await Task.find().populate('assignedTo', 'name email');

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet('Tasks Report');
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Title', key: 'title', width: 30 },
      { header: 'Description', key: 'description', width: 30 },
      { header: 'Priority', key: 'priority', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Assigned To', key: 'assignedTo', width: 25 },
      { header: 'Due Date', key: 'dueDate', width: 20 },
    ];

    tasks.forEach(task => {
      worksheet.addRow({
        id: task._id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        assignedTo: task.assignedTo ?? [].map((user: IUser) => `${user.name} (${user.email})`).join(', '),
        dueDate: task.dueDate?.toISOString().split('T')[0]
      });
    });

    res.setHeader('Content-Type', 
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=tasks_report.xlsx');
    await workbook.xlsx.write(res);
    res.status(200).end();

  } catch (error) {
      logger.error({
            message: "Error exporting task report",
            error: (error as Error).message,
            stack: (error as Error).stack,
            route: req.originalUrl
        })
        res.status(500).json({ message: "Failed to export task report" });
  }
}

export const exportUserReport = async (req: Request, res: Response) => {
    // Logic to generate and send user report
    try {
        // get users but exclude passwords
        const users = await User.find().select('-password');
        console.log(JSON.stringify(users))
        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet('Users Report');
        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Name', key: 'name', width: 30 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Role', key: 'role', width: 15 },
            { header: 'Created At', key: 'createdAt', width: 20 },
        ];

        users.forEach(user => {
            worksheet.addRow({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt ? user.createdAt.toISOString().split('T')[0] : ''
        })
        }
    );

        res.setHeader('Content-Type', 
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=users_report.xlsx');
        await workbook.xlsx.write(res);
        res.status(200).end();
        
    } catch (error) {
        logger.error({
            message: "Error exporting user report",
            error: (error as Error).message,
            stack: (error as Error).stack,
            route: req.originalUrl
        })
        res.status(500).json({ message: "Failed to export user report" });
    }
}