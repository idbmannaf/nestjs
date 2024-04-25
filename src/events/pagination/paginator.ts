import {QueryBuilder, SelectQueryBuilder} from "typeorm";

export interface PaginationOptions {
    limit: number,
    currentPage: number,
    total?: number
}

export interface PaginationResult<T> {
    first: number,
    last: number,
    total?: number,
    limit: number,
    data: T[],
    page?: number
    totalPage?: number
}

export async function paginate<T>(
    qb: SelectQueryBuilder<T>,
    options: PaginationOptions = {
        limit: 10,
        currentPage: 1
    }
): Promise<PaginationResult<T>> {
    const offset = (options.currentPage - 1) * (options.limit);
    const data = await qb.limit(options.limit).offset(offset).getMany();

    const totalPages = Math.ceil(await qb.getCount() / options.limit);
    return {
        first: offset + 1,
        last: offset + data.length + 1,
        total: options.total ? await qb.getCount() : null,
        limit: options.limit,
        page: options.currentPage,
        totalPage: totalPages,
        data
    }

}