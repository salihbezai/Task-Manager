export interface userState {
    users: User[];
    loading: boolean;
    error: string | null;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    profileImageUrl?: string;
    role: "member" | "admin";
    createdAt?: Date;
    updatedAt?: Date;
    pendingTaskCount: number;
    completedTaskCount: number;
    inProgressTaskCount: number;
}

// export interface UserMemberCardType {
//     _id: string;
//     name: string;
//     email: string;
//     profileImageUrl?: string;
//     role: "member" | "admin";
//     createdAt?: Date;
//     updatedAt?: Date;
//     pendingTaskCount: number;
//     completedTaskCount: number;
//     inProgressTaskCount: number;
// }