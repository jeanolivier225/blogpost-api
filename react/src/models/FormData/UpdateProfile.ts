export type UpdateProfile = {
    name: string | null,
    email: string | null,
    password: string | null,
    new_password: string | null,
    authors: number[] | null,
    sources: number[] | null,
    categories: number[] | null,
};
